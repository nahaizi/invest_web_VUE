const MiniCssExtractPlugin =    require("mini-css-extract-plugin");

const { ConcatSource, SourceMapSource, OriginalSource } = require('webpack-sources');

const MODULE_TYPE = 'css/mini-extract';

const pluginName = 'mini-css-extract-plugin';

const MODULE_CSS_CLASS = 'CssDependency';
const MODULE_CLASS_NAMES = ['HarmonyImportSideEffectDependency', 'CommonJsRequireDependency'];

module.exports = class extends MiniCssExtractPlugin{

    apply(compiler){
        super.apply(compiler);
        compiler.hooks.thisCompilation.tap(pluginName, compilation => {
            compilation.mainTemplate.hooks.renderManifest.tap(pluginName, (result, { chunk }) => {
                var modelSet = new Set(), paths = new Set();
                this.findCssModules(compilation.entries[0], modelSet, paths);
                if (modelSet.size > 0) {
                    result.push({
                        render: () => this.myRenderContentAsset(modelSet, compilation.runtimeTemplate.requestShortener),
                        filenameTemplate: this.options.filename,
                        pathOptions: {
                            chunk,
                            contentHashType: MODULE_TYPE
                        },
                        identifier: `${pluginName}.${chunk.id}`,
                        hash: chunk.contentHash[MODULE_TYPE]
                    });
                }
            });
        });
    }

    findCssModules({dependencies = [], userRequest, factoryMeta}, result, foundModules = new Set()){
        if(!foundModules.has(userRequest) && factoryMeta.sideEffectFree){
            foundModules.add(userRequest);
            dependencies.forEach(m => {
                var {name} = m.constructor;
                if(MODULE_CLASS_NAMES.includes(name)){
                    return this.findCssModules(m.module || {}, result, foundModules);
                }
                if(MODULE_CSS_CLASS === name){
                    result.add(m.module);
                }
            });
        }
    }

    sourceFactory(content, rs, sourceMap){
        return sourceMap ? new SourceMapSource(content, rs, sourceMap) : new OriginalSource(content, rs);
    }

    myRenderContentAsset(modules, rs) {

        const source = new ConcatSource();
        for (const m of modules) {
            if (m.media) {
                source.add(`@media ${m.media} {\n`);
            }
            source.add(this.sourceFactory(m.content, m.readableIdentifier(rs), m.sourceMap));
            source.add('\n');
            if (m.media) {
                source.add('}\n');
            }
        }
        return source;
    }


};
