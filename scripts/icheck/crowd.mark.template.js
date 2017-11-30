define([], function () {

    var _resultInfo = null;
    var _loadTime = null;

    return {
        configInfo: {
            dataId: 0,
            perosnInTaskId: 0
        },
        urls: {
            "get_result": function (dataId, personInTaskId) {
                return "/api/data_result/get/{dataId}-{assignId}"
                    .replace("{dataId}", dataId)
                    .replace("{assignId}", personInTaskId);
            },
            "get_source": function (dataId, personInTaskId) {
                return "/api/data_source/get/{dataId}-{assignId}"
                    .replace("{dataId}", dataId)
                    .replace("{assignId}", personInTaskId);
            },
            "save": "/api/dataresult/save2",
            "saveBlob":"/api/dataresult/SaveBlob"
        },
        loadDataResult: function (uri, onSuccess) {
            /// <summary>
            /// 获取标注结果
            /// </summary>

            //用来判断是否包含属性
            var propertyCount = 0;

            var _self = this;
            _loadTime = new Date();

            var jsonObj = {
                Workload:{
                    Ban_sign:0,
                    Car:16,
                    Other:0,
                    Pedestrians:14,
                    Traffic_light:2,
                    Traffic_sign:1,
                    boxCount:38,
                    workTime:830.7305833333334
                },
                boxs:[
                    {
                        cont:"1",
                        content:"小型汽车",
                        cut:"0",
                        h:52.999635568513135,
                        id:"ui-rect-1",
                        shade:"1",
                        title:"2-小型汽车-左侧面-部分遮挡（0%~35%）-完全未截断（0%）",
                        type:"小型汽车",
                        val1:"Car",
                        val_data:"1,0,",
                        val_data1:"1,0,1",
                        w:143.99781341107874,
                        x:2083.480320699709,
                        y:539.0051020408165
                    },
                    {
                        cont:"1",
                        content:"小型汽车",
                        cut:"0",
                        h:116.2000728862974,
                        id:"ui-rect-0",
                        shade:"2",
                        title:"1-小型汽车-左侧面-大部分遮挡（35%~50%）-完全未截断（0%）",
                        type:"小型汽车",
                        val1:null,
                        val_data:null,
                        val_data1:"null1",
                        w:242.19788629737616,
                        x:2135.6559766763853,
                        y:552.9956268221576
                    }
                ],
                effective:"1",
                img:"bj20160905_M_005\bj20160905_M_005_f021.png",
                _createTime:"2017/8/14 17:00:33",
                _guid:"c020a8dc-198f-42f4-aa85-8ace7ff17a6b",
                _personInProjectId:407229
            };
             //进行函数回掉
             onSuccess(jsonObj);
             
            _resultInfo = jsonObj;

            try {
                //进行 knockoutjs 注册.
                ko.applyBindings(jsonObj);
            } catch (e) {
                console.log("knockout bindings is error:", e);
            }

            //获取标注结果
            // $.ajax({
            //     type: "GET",
            //     url: uri,
            //     data: null,
            //     async: false,
            //     contentType: "application/json; charset=utf-8",
            //     dataType: "json",
            //     timeout: 5000,
            //     success: function (jsonObj) {

            //         for (var p in jsonObj) {
            //             propertyCount++;
            //         }

            //         if (propertyCount == 0) {
            //             return;
            //         }

            //         //进行函数回掉
            //         onSuccess(jsonObj);

            //         _resultInfo = jsonObj;

            //         try {
            //             //进行 knockoutjs 注册.
            //             ko.applyBindings(jsonObj);
            //         } catch (e) {
            //             console.log("knockout bindings is error:", e);
            //         }
            //     },
            //     error: function (msg) {
            //         alert('数据加载超时.请稍后再试');
            //     }
            // });
        },
        getLoadTime: function(){
          return _loadTime;
        },
        getResultInfo: function () {
            return _resultInfo;
        },
        loadSource: function (uri, onSuccess) {
            $.getJSON(uri, null, function (jsonObj) {

                onSuccess(jsonObj);

            });
        },
        storage: function (args) {

            /// <summary>
            /// 保存标注结果
            /// </summary>
            /// <param name="url"></param>
            /// <param name="json"></param>
            /// <param name="taskId"></param>
            /// <param name="dataId"></param>
            /// <param name="personInTaskId"></param>

            var json = args.json;

            //将JSON对象转换成字符串
            var jsonStr = JSON.stringify(json);

            //POST对象
            var postData = {
                ProjectId: args.taskId,
                DataId: args.dataId,
                DataTitle: args.dataTitle,
                AssignId: args.personInTaskId,
                ResultJson: jsonStr,
                IsValid: true,
                FeedBack: args.FeedBack
            };
            var async = true;
            if (args.hasOwnProperty('async')) {
                async = args.async;
            }

            //数据有效性（大于1为无效数据）
            postData.IsValid = !(json['Effective'] > 1 || json['effective'] > 1);

            $.ajax({
                url: this.urls.save,
                data: postData,
                method: "POST",
                async: async
            }).success(function (response) {
                /// <summary>
                /// 
                /// </summary>
                /// <param name="response"></param>

                args.success();
            }).fail(function (msg) {
                /// <summary>
                /// 
                /// </summary>
                /// <param name="msg"></param>


                var obj = JSON.parse(msg.responseText);
                //回传JSON对象
                args.fail(obj);
            }).complete(function () {
                /// <summary>
                /// 
                /// </summary>

                args.complete();
            });
        },
        storageOneFrame: function(args){
          // var json = args.json;
  
          //将JSON对象转换成字符串
          var jsonStr = JSON.stringify(args.contents);
  
          //POST对象
          var postData = {
            ProjectId: args.projectId,
            Filename: args.contents.key,
            Content:args.contents.content,
            IsLog:args.isLog
          };
  
          var async = true;
          if (args.hasOwnProperty('async')) {
            async = args.async;
          }
          
          $.ajax({
            url: this.urls.saveBlob,
            data: postData,
            method: "POST",
            async: async
          }).success(function (response) {
            args.success(response);
          }).fail(function (msg) {
            var obj = JSON.parse(msg.responseText);
            args.fail(obj);//回传JSON对象
          }).complete(function () {
            args.complete();
          });
        },
        runExtension: function (action, vars, returnArray) {
            /// <summary>
            /// 运行插件
            /// </summary>
            /// <param name="action"></param>
            /// <param name="vars"></param>
            /// <param name="returnArray"></param>

            return crowd.dataMark.runExtension(action, vars, returnArray);
        },
        getFormSerizlize: function () {
            /// <summary>
            /// 获取表单
            /// </summary>

            var obj = this.runExtension("getFormSerizlize", null);
            return obj;
        },
        checkValidata: function (formObject) {
            /// <summary>
            /// 进行模版自行检查
            /// </summary>

            return this.runExtension("checkValidata", formObject);
        },
        initialization: function (config) {
            $("#work-space").hide();

            this.configInfo = config;
            this.configInfo.dataId = config.dataId;
            this.configInfo.personInTaskId = config.assignId;

            var self = this;

            //加载众包结果数据
            this.loadDataResult(this.urls.get_result(this.configInfo.dataId, this.configInfo.personInTaskId), function (json) {
                crowd.dataMark.setResult(json);
            });

            if (config.loadSource) {
                //加载众包原始数据
                var zyjson = {"data":"bj20160905_M_005\\bj20160905_M_005_f021.png","_personInProjectId":0,"_createTime":"2017/4/18 9:07:44","_guid":"e82364ab-d5dd-4746-aa9c-b0042212b236"};
                self.runExtension("initialize", zyjson);
                
                if (zyjson["_guid"]) {
                    $("body").attr("data-guid", zyjson["_guid"]);
                }
                // this.loadSource(this.urls.get_source(this.configInfo.dataId, this.configInfo.personInTaskId), function (json) {
                //     self.runExtension("initialize", json);

                //     if (json["_guid"]) {
                //         $("body").attr("data-guid", json["_guid"]);
                //     }
                // });
            } else {
                //加载插件
                self.runExtension("initialize", null);
            }

            if (crowd.dataMark.getUseIcheck()) {
                //使用icheck美化checkbox 和radio
                $('input').iCheck({
                    checkboxClass: 'icheckbox_square',
                    radioClass: 'iradio_square',
                    increaseArea: '20%' // optional
                });
            }

            //显示界面
            $("#work-space").show();
            $("#work-space-loading").hide();
        },

        getCurentTime: function () {
            var now = new Date();
            var year = now.getFullYear();       //年
            var month = now.getMonth() + 1;     //月
            var day = now.getDate();            //日

            var hh = now.getHours();            //时
            var mm = now.getMinutes();          //分
            var clock = year + "-";

            if (month < 10)
                clock += "0";

            clock += month + "-";

            if (day < 10)
                clock += "0";

            clock += day + " ";

            if (hh < 10)
                clock += "0";

            clock += hh + ":";
            if (mm < 10) clock += '0';
            clock += mm;
            return (clock);
        },
        getQueryString: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]); return null;
        }
    }
});