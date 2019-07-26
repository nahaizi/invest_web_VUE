const fs                    = require('fs');
const path                  = require('path');
const Terser                = require('terser');
const HtmlWebpackPlugin     = require('html-webpack-plugin');

class HWPlugin extends HtmlWebpackPlugin {

    getJsReg(){}

    getAssetJs(){
        return [];
    }

    injectAssetsIntoHtml(html, assets, assetTags){
        let {js} = assets;
        assetTags.body = this.getAssetJs();
        let _html = super.injectAssetsIntoHtml(html, assets, assetTags);
        return js.length ? _html.replace(this.getJsReg(), JSON.stringify(js)) : _html;
    }


}

class MainHtmlWebpackPlugin extends HWPlugin {

    getJsReg(){
        return /"\$main\.js"/;
    }

    getAssetJs(){
        let code = fs.readFileSync(path.resolve(__dirname, 'loadScript.js'), 'utf8');
        return [{
            tagName: "script",
            closeTag: true,
            innerHTML: Terser.minify(code, {mangle: {toplevel: true}}).code,
        }];
    }

}

class IEHtmlWebpackPlugin extends HWPlugin {

    getJsReg(){
        return /"\$fallback\.js"/;
    }

}

module.exports = {
    IEHtmlWebpackPlugin,
    default: MainHtmlWebpackPlugin,
};
