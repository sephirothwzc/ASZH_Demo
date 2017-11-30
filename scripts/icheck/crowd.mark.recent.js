define([], function () {
    /// <summary>
    /// 最近标注数据
    /// </summary>
    /// <param name="$"></param>

    return {
        key: "do-recent",
        push: function (url, title) {
            var storage = window.localStorage;

            if (!storage) {
                console.log('不支持HTML5本地存储.');
            } else {
                var list = [];
                //查询本地存储
                if (storage.getItem(this.key)) {
                    //转换JSON对象
                    list = JSON.parse(storage.getItem(this.key));
                    //移除超出存储长度的值
                    if (list.length > 4) {
                        list.shift();
                    }
                }

                //加入新的最近标注记录
                list.push({ url: url, title: title });
                storage.setItem(this.key, JSON.stringify(list));
            }
        },
        list: function () {
            var storage = window.localStorage;
            
            var json = storage.getItem(this.key);
            if (json === null)
                return [];

            return JSON.parse(json);
        },
        bind: function (target) {
            var list = this.list();
            var html = "";

            for (var i = list.length - 1; i >= 0; i--) {
                html += "<a href=\"{0}\" target=\"_blank\" class=\"item\">{2}、{1}</a>"
                    .replace("{0}", list[i].url)
                    .replace("{1}", list[i].title)
                    .replace("{2}", i + 1);
            }

            $(target).append(html);
        }
    }
});