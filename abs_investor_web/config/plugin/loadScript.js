(function (global) {

    var doc = global.document,
        isFallBack = 'ActiveXObject' in global,
        scriptList = [],
        syntaxErrorList = [
            'expected identifier',
        ];

    var Iterator = (function () {

        var i = 0, arr = [
            "$main.js",
            "$fallback.js",
            '<div class="el-row el-dialog--center" style="font-size: 2em;margin-top: 5em;"><div class="el-col el-col-12 el-col-offset-6">不支持的浏览器</div><div class="el-col el-col-18 el-col-offset-3">可用浏览器：Chrome、Firefox、Edge、IE11；推荐使用Chrome</div></div>'
        ];

        return {
            get: function (){
                return arr[i];
            },
            next: function () {
                return arr[++i];
            },
            isEnd: function () {
                return arr.length <= i;
            }
        };

    })();

    global.onerror = reload;

    load(isFallBack ? Iterator.next() : Iterator.get());

    function load(it) {
        if(it){
            Iterator.isEnd() ? loadHtml(it) : loadJs(it);
        }
    }

    function each(arr, cb) {
        for (var i = 0; i < arr.length; i++){
            if(cb(arr[i]) === true){
                return true;
            }
        }
    }

    function loadHtml(html) {
        //unsupported browser
        doc.body.innerHTML = html;
    }

    function loadJs(list) {
        var frag = doc.createDocumentFragment();
        each(list, function (src) {
            var script = doc.createElement('script');
            script.src = src;
            frag.appendChild(script);
            scriptList.push(script);
        });
        doc.body.appendChild(frag);
    }

    function reload(e) {
        var msg = e.toLowerCase(), hasError = each(syntaxErrorList, function(e) {return msg.indexOf(e) > -1});
        if(hasError){
            //remove error script
            while (scriptList.length){
                doc.body.removeChild(scriptList.pop());
            }
            //clear webpack module
            global.webpackJsonp = undefined;
            //load
            load(Iterator.next());
        }
    }

})(window);
