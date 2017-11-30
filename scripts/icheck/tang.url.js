/* File Created: 十二月 25, 2012 */
var tangUrl = {};

tangUrl.parseURL = function (url) {
    ///<summary>分析url</summary>
    ///<param name="网址URL" type="String">
    var a = document.createElement('a');
    a.href = url;
    return {
        source: url,
        protocol: a.protocol.replace(':', ''),
        host: a.hostname,
        port: a.port,
        query: a.search,
        params: (function () {
            var ret = {},
			seg = a.search.replace(/^\?/, '').split('&'),
			len = seg.length, i = 0, s;
            for (; i < len; i++) {
                if (!seg[i]) { continue; }
                s = seg[i].split('=');
                ret[s[0]] = s[1];
            }
            return ret;

        })(),
        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
        hash: a.hash.replace('#', ''),
        path: a.pathname.replace(/^([^\/])/, '/$1'),
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
        segments: a.pathname.replace(/^\//, '').split('/')
    };

    //#region 使用示例
    /*
    var myURL = parseURL('http://abc.com:8080/dir/index.html?id=255&m=hello#top');
    w("myUrl.file = " + myURL.file)     // = 'index.html'
    w("myUrl.hash = " + myURL.hash)     // = 'top' 
    w("myUrl.host = " + myURL.host)     // = 'abc.com'
    w("myUrl.query = " + myURL.query)    // = '?id=255&m=hello'
    w("myUrl.params = " + myURL.params)   // = Object = { id: 255, m: hello } 
    w("myUrl.path = " + myURL.path)     // = '/dir/index.html' 
    w("myUrl.segments = " + myURL.segments) // = Array = ['dir', 'index.html']
    w("myUrl.port = " + myURL.port)     // = '8080' 
    w("myUrl.protocol = " + myURL.protocol) // = 'http' 
    w("myUrl.source = " + myURL.source)   // = 'http://abc.com:8080/dir/index.html?id=255&m=hello#top'
 
    var _newUrl = replaceUrlParams(myURL, { id: 101, m: "World", page: 1,"page":2 });
 
    w("<br>新url为：")
    w(_newUrl); //http://abc.com:8080/dir/index.html?id=101&m=World&page=2#top
    */
    //#endregion
}

tangUrl.replaceCurrentUrl = function (newParams) {
    var url = this.replaceUrlParams(this.parseCurrentUrl(), newParams);
    return url
}

tangUrl.replaceUrlParams = function (myUrl, newParams) {
    ///<summary>替换myUrl中的同名参数值,如果有同名则替换，没有同名则追加参数</summary>
    ///<param name="myUrl" type="tangUrl.parseURL">需要进行参数同名替换的URL</param>
    ///<param name="newParams" type="Object">同名替换后的URL地址</param>
    for (var x in newParams) {
        var hasInMyUrlParams = false;
        for (var y in myUrl.params) {
            if (x.toLowerCase() == y.toLowerCase()) {
                myUrl.params[y] = newParams[x];
                hasInMyUrlParams = true;
                break;
            }
        }
        //原来没有的参数则追加
        if (!hasInMyUrlParams) {
            myUrl.params[x] = newParams[x];
        }
    }

    var _result = myUrl.protocol + "://" + myUrl.host + ":" + myUrl.port + myUrl.path + "?";

    for (var p in myUrl.params) {
        _result += (p + "=" + escape(unescape(myUrl.params[p])) + "&");
    }

    if (_result.substr(_result.length - 1) == "&") {
        _result = _result.substr(0, _result.length - 1);
    }

    if (myUrl.hash != "") {
        _result += "#" + myUrl.hash;
    }
    return _result;
}

tangUrl.parseCurrentUrl = function () {
    return tangUrl.parseURL(window.location);
}

tangUrl.getQueryStringSingle = function (key, defaultVal) {
    ///<summary>获取URL中的参数</summary>
    ///<param name="key" type="String">参数名称；
    /// 比如："http://test.aspx?action=getList"；getQueryStringSingle("action")得到的结果就是参数的值"getList"
    ///</param>
    var value = (document.location.search.match(new RegExp("(?:^\\?|&)" + key + "=(.*?)(?=&|$)")) || ['', null])[1];
    if (value == null) {
        return defaultVal;
    }
    else {
        value;
    }

    return unescape(value)
}


