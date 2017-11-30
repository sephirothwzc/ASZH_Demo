define(["template", "mark.recent", "crowd.mark.try"], function (template, recent, markTry) {
    mutilSubmit = 0 ;
    firstWorkTime = 0;
    
    return {
        nextUrl: function (dataId, personInTaskId) {          

            return "/{lang}/{personInTaskId}/{dataId}"
                .replace("{lang}", 'zh-cn')
                .replace("{personInTaskId}", personInTaskId)
                .replace("{dataId}", dataId);
        },
        jump: function (args) {
            var dataId = args.dataId;
            var personInTaskId = args.personInTaskId;
            var model = args.model;
            var redo = args.redo;
            var trigger = args.trigger;

            var url = "/api/data_source/get_next/{dataId}-{assignId}-{isRedo}"
                .replace("{dataId}", dataId)
                .replace("{assignId}", personInTaskId)
                .replace("{isRedo}", redo);

            var self = this;

            var defaultText='';
            if(args.trigger){   
                defaultText = trigger.text();
                args.trigger.text('正在获取下一条数据...');
            }
            //console.log(args.trigger);                      
            text = defaultText;

            //发送请求获取下一条跳数据
            $.ajax({
                url: url,
                data: null,
                timeout: 5000,
                async: false
            }).success(function (dataSource) {
                var dataId = dataSource.DataId;

                url = self.nextUrl(dataId, personInTaskId);
                if (redo) {
                    url += "?agin=true";
                }

                switch (model) {
                    case "new":
                        {
                            //本地存储最近标注
                            recent.push(window.location.href, __markInfo.dataTitle);

                            //新增
                            text = "正在跳转至下一条";
                        }
                        break;
                    case "revise":
                        //修改
                        alert("修改完成");

                        break;
                    default:
                }
                if (args.trigger) {
                    trigger.text(text);
                }
                if (dataId > 0) {
                    //自动进入下一条
                    window.location.href = url;
                } else {
                    alert('该批次的数据已经标注完成，请重新开始标注。');

                    //trigger.text(defaultText);
                    $("button,.btn-freeze").removeAttr("disabled");
                    window.location.href = "/zh-cn/do/message/taskComplate";
                }
            }).fail(function (msg) {
                var responseJson = JSON.parse(msg.responseText);
                alert(responseJson.message);              
                $("button,.btn-freeze").removeAttr("disabled");
            }).complete(function () {
                //
                //trigger.text(defaultText);
            });
        },
        submit: function (params) {
            /// <summary>
            /// 
            /// </summary>
            /// <param name="settings"></param>
            var defaultText = '';//原始text，用于恢复原始text
            if(params.trigger){
                defaultText = params.trigger.text();
            }
            //禁用页面上的所有按钮
            $(".btn-freeze").attr("disabled", true);

            //获取模板返回结果
            var json = template.getFormSerizlize();

            //获取自定义表单序列化结构
            if (!json) {
                alert('模板配置错误,无法获取到标注结果.');
                $(".btn-freeze").attr("disabled", false);
                return;
            }

            if (!json.Workload && !json.workload) {
                alert('提示：未配置工作量，将采用默认值.');
                //如果没有工作量，使用默认工作量
                json.workload = {
                    Count: 1
                };
            }

            //进行数据检查
            if (!template.checkValidata(json)) {
                $(".btn-freeze").removeAttr("disabled");

                return false;
            }
            
            //处理工时需求
            try{
	            if(__markInfo){
                var _resultInfo = template.getResultInfo();
                var workload = json.workload || json.Workload;
  
                if(!workload.workTime){
                  workload.workTime = 0 ;
                  if(_resultInfo){
                    resultWorkload = _resultInfo.workload || _resultInfo.Workload;
                    workload.workTime = resultWorkload.workTime || 0;
                  }
                }
    
                if(__markInfo.operationCase === 2 || __markInfo.operationCase === 1){
                  var submitDate = new Date();
                  var diff = (submitDate.getTime() - template.getLoadTime())/ (60 * 1000);// 本次保存时间的间隔
                  
                  /**
                   * 分两种情况：
                   *  * 单次保存 Ttotal = Ttotal + (Tsubmit - Tpageload)
                   *  * 多次保存 Ttotal = Tfirstsubmit + (Tsubmit - Tpageload)
                   *
                   *  // 记录首次保存时 Ttotal 的值
                   *  if(mutilSubmit === 0)
                   *     Tfirstsubmit = json.workload.workTime
                   */
                  if(mutilSubmit === 0){
                    firstWorkTime = workload.workTime;
                    workload.workTime = diff + workload.workTime;
                  }else{
                    workload.workTime = diff + firstWorkTime;
                  }
	              }
	            }
	          }catch(e){
	            console.error('标注时长统计错误！'+e.message);
	          }

            var _feedback = '';
            if (params.type == 3)
                _feedback = markTry.getTrialFeedback(params)

            var args = {
                taskId: params.taskId,
                dataId: params.dataId,
                dataTitle: params.dataTitle,
                personInTaskId: params.personInTaskId,
                model: params.model,
                redo: params.redo,
                trigger: params.trigger,
                json: json,
                FeedBack: _feedback,
                async: params.async
            };
			if(args.trigger){
                args.trigger.text('请稍等,正在保存...');
		    }
            var self = this;

            //保存成功
            args.success = function () {
                if (args.trigger) {
                    args.trigger.text('保存成功.');
                }
                if (params.success) {
                    params.success(args);
                } else {
                    self.jump(args);
                }
            };

            //保存失败
            args.fail = function (obj) {
                alert(obj.message);

                $(".btn-freeze").removeAttr("disabled");
                
            };

            //保存完成
            args.complete = function () {
                //恢复按钮默认状态
                setTimeout(function () { $(".btn-freeze").removeAttr("disabled"); if (args.trigger) { args.trigger.text(defaultText) } }, 500);
            };

            //数据存储
            template.storage(args);
            
            // 记录当前保存的次数
            mutilSubmit ++;

            return true;
        },
        submitOneFrame: function(params){
          var projectId = params.projectId;
          if(!projectId){
            alert('提交失败，缺少任务ID参数')
          }
          
          var key = params.key;
          if(!key){
            alert('提交失败，参数缺失！');
            return;
          }
          
          var content = params.content;
          if(!content || content === ''){
            alert('无提交内容！');
            return ;
          }
          
          var contents = {
            key: key,
            content: content
          }
          
          var json = {
            projectId: projectId,
            contents: contents,
            async: params.async || true,
            isLog: params.isLog || false,
            success: params.success,
            fail: params.fail,
            complete: params.complete
          }
          
          template.storageOneFrame(json);
        },
        getDataSource: function (url, onSuccess) {
            /// <summary>
            /// 保存
            /// </summary>

            //发送请求获取下一条跳数据
            $.getJSON(url)
                .success(function (dataSource) {

                    settings.trigger.text(text);

                    //触发回掉
                    onSuccess(dataSource);
                })
                .fail(function (msg) {
                    alert(msg.responseJSON.message);
                }).complete(function () {

                });
        },
        skip: function (args) {
            /// <summary>
            /// 跳转
            /// </summary>
            /// <param name="args"></param>

            $(".btn-freeze").attr("disabled", true);

            var url = "";
            if (!args.url) {
                url = "/api/data_source/skip?did={did}&pipid={pipid}&pid={pid}"
                    .replace("{did}", args.dataId)
                    .replace("{pipid}", args.personInTaskId)
                    .replace("{pid}", args.taskId);
            }

            var _self = this;
            $.post(url, null)
                .success(function (response) {
                    var dataId = response.obj.DataId;
                    var url = _self.nextUrl(dataId, args.personInTaskId);
                    window.location.href = url;
                }).fail(function (msg) {
                    var responseJson = JSON.parse(msg.responseText);
                    alert(responseJson.message);
                    $(".btn-freeze").removeAttr("disabled");
                }).complete(function () {

                });
        }
    }
});