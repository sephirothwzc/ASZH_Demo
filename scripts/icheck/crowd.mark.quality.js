define(["template", 'crowd.mark'], function (template, mark) {
    /// <summary>
    /// 质检
    /// </summary>
    /// <param name="$"></param>

    var _qualityInfo = null;
    return {
        saveConclusion: function (eventDom, conclusion, disabled) {
            /// <summary>
            /// 质检-保存针对标注人员的评价
            /// </summary>
            /// <param name="conclusion"></param>

            $(eventDom).prop("disabled", true);
            $.post('/api/quality/save_conclusion', {
                Conclusion: conclusion,
                PersonInProjectId: __markInfo.assignId,
                ProjectId: __markInfo.projectId,
                Disable: disabled
            }, function (reponse) {
                if (reponse.ret > 0) {
                    alert(reponse.msg);
                }
                $(eventDom).prop("disabled", false).text('保存');
            });
        },
        getConclusion: function (callback) {
            /// <summary>
            /// 获取质检结果
            /// </summary>
            /// <param name="callback"></param>

            $.getJSON('/api/quality/get_conclusion', {
                personInProjectId: __markInfo.assignId,
                packageId: _qualityInfo.packgeId
            }, function (reponse) {
                if (callback) {
                    callback(reponse);
                }
            });
        },
        getValue: function (statusCode) {
            if (statusCode == 2) {
                statusCode = 1;
            }

            //质检表单
            var obj = $("#qualityForm").serializeArray();

            var checkResult = "";
            var opinion = "";
            for (var i = 0; i < obj.length; i++) {
                if (obj[i].name === "qualityProperty") {
                    checkResult += "," + obj[i].value;
                } else if (obj[i].name === "qualityOpinion") {
                    opinion = obj[i].value;
                    break;
                }
            };

            //质检结果
            checkResult = checkResult.substr(1, checkResult.length);
            if (checkResult.length == 0 && statusCode == 3)
                checkResult = "其它";

            //质检对象标识
            var dataGuid = undefined;

            if (__markInfo.isGatherSource == false) {
                if (__markInfo.dataResultGuid && __markInfo.dataResultGuid != "00000000-0000-0000-0000-000000000000") {
                    dataGuid = __markInfo.dataResultGuid;
                } else if (DataMark.dataResult && DataMark.dataResult["_guid"]) {
                    dataGuid = DataMark.dataResult["_guid"];
                } else {
                    dataGuid = $("body").attr("data-guid");
                }
            }
            else {
                dataGuid = __markInfo.source_key;
            }

            if (dataGuid == undefined || dataGuid == "00000000-0000-0000-0000-000000000000") {
                alert('质检数据无效.');
                return;
            }

            //回传数据
            return {
                "PersonInProjectId": __markInfo.assignId,
                "InspectorPersonInProjectId": _qualityInfo.inspectorPersonInProjectId,
                "ProjectId": __markInfo.projectId,
                "CheckResult": checkResult,
                "Opinion": opinion,
                "Status": statusCode,
                "DataGuid": dataGuid,
                "DataTitle": __markInfo.dataTitle
            };
        },
        setQualityInfo: function (qualityInfo) {
            //质检信息
            _qualityInfo = qualityInfo;
        },
        loadForm: function (settings) {
            /// <summary>
            /// 加载质检表单
            /// </summary>
            /// <param name="domId">质检表单区域DocumentId</param>

            //质检信息
            _qualityInfo = settings.qualityInfo;

            //显示质检区域
            $("#quality-area").show();

            var order = template.getQueryString("order");

            $('input[name="work-qualityType"]').val(order);

            //通过模板脚本加载质检表单
            var jsonArray = template.runExtension("qualityForm", null);

            if (jsonArray == null || jsonArray === false || jsonArray === undefined) {
                $("#quality-form-controls").html('<div style="padding: 5px;background-color: #FFFB91;margin: 0 0 5px;">还没有配置质检属性.</div>');
            } else {
                //加载质检结果选项
                jsonArray.sort(function (a, b) { return a.sort - b.sort });

                var html = "";
                for (var i = 0; i < jsonArray.length; i++) {
                    html += '<div class="extend-form-item">'
                         + '    <label>'
                         + '        <input type="checkbox" {checked} name="qualityProperty" value="{text}"/>{text}'
                                    .replace(/{text}/g, jsonArray[i].value)
                                    .replace('{checked}', _qualityInfo.checkResultArray.in_array(jsonArray[i].value) ? "checked=\"checked\"" : "")
                         + '    </label>'
                         + ' </div>';
                }
            }

            //审核意见
            var qualityOpinion = $("textarea[name='qualityOpinion']");
            qualityOpinion.text(_qualityInfo.opinion);

            //输出界面
            settings.target.empty();
            settings.target.append(html);

            //是否允许修改审核意见,如果非质检人员将不允许修改质检结果.
            if (settings.allowEdit == 'false') {
                qualityOpinion.text(_qualityInfo.opinion === '' ? "无" : _qualityInfo.opinion);
                $("textarea[name='qualityOpinion'],input[name='qualityProperty']").attr("disabled", "disabled");
            }

            //审核状态
            this.renderStatus(_qualityInfo.status);

            //审核时间
            var datetime = template.getCurentTime();
            $("[data-source='qualityTime']").text(datetime);
        },
        renderStatus: function (status) {
            //$("[data-quality-status='" + status + "']")
            //    .attr("disabled", "disabled")
            //    .attr("title", "本次质检结果");
            var html = "<div class=\"seal seal-{class}\">";
            var className = "";
            switch (status) {
                case 1:
                    html += "合格";
                    className = "success";
                    break;
                case 2:
                case 3:
                    html += "不合格";
                    className = "danger"
                    break;
                default:
                    html += "等待审核";
                    break;
            }

            html += "</div>";
            html = html.replace('{class}', className);

            //输出到界面,默认在右上角    
            $("#markForm").append(html);
        },
        save: function (statusCode, domId) {
            /// <summary>
            /// 质量检查
            /// </summary>
            /// <param name="isPass" type="Boolean">审核是否通过</param>
            var _self = this;
            var dataObject = this.getValue(statusCode);
            var defaultText = $(domId).text();
            var modifyed = true;
            var operationCase = __markInfo.operationCase;
           
            var valid = true;

            if (!valid)
                return;

            //if (statusCode === 1) {
            //    //合格不能有错误类型被勾选
            //    var propertys = document.getElementsByName("qualityProperty");
            //    var propertys_len = propertys.length;
            //    for (var i = 0; i < propertys_len; i++) {
            //        if (propertys[i].checked) {
            //            alert("质检合格不能选择错误类型");
            //            return;
            //        }
            //    }
            //    var opinion = document.getElementsByName("qualityOpinion");
            //    if (opinion[0].value.replace(/(^s*)|(s*$)/g, "").length > 0) {
            //        alert('质检合格不能填写审核意见');
            //        return;
            //    }
            //} else if (statusCode === 3) {
            //    //不合格必须有错误类型被勾选或者填写审核意见
            //    var ischeck = false;
            //    var isopinion = false;
            //    var propertys = document.getElementsByName("qualityProperty");
            //    var propertys_len = propertys.length;
            //    for (var i = 0; i < propertys_len; i++) {
            //        if (propertys[i].checked) {
            //            ischeck = true;
            //            break;
            //        }
            //    }
            //    var opinion = document.getElementsByName("qualityOpinion");
            //    if (opinion[0].value.replace(/(^s*)|(s*$)/g, "").length > 0) {
            //        isopinion = true;
            //    }
            //    if (ischeck === false && isopinion === false) {
            //        alert("质检不合格必须选择错误类型或者填写审核意见");
            //        return;
            //    }
            //}


            if (operationCase === 4 || operationCase === 32 || operationCase === 128 || operationCase === 256) {
                var qualityValidate = _self.validate(statusCode);
                if (qualityValidate.status !== 1) {
                    alert(qualityValidate.message);
                    return false;
                }
            }

            //采集任务的质检是否需要保存到mongodb
            var dosubmit = true;
            if (__markInfo.Type == 2) {
                dosubmit = false;
                if (crowd.dataMark.IsSave != undefined && crowd.dataMark.IsSave == true)
                    dosubmit = true;
            }

            if (operationCase === 4 || operationCase === 128) {
                //普通质检或普通自检员不自动提交
                dosubmit = false;
            }

            //质检人员修改,本质上是进行数据的修改。
            if (statusCode === 2 || __markInfo.Type == 2) {
                //保存时，不进行自动跳转
                var params = {
                    taskId: __markInfo.projectId,
                    dataId: __markInfo.dataId,
                    personInTaskId: __markInfo.assignId,
                    type: __markInfo.type,
                    model: "revise",
                    trigger: $(domId),
                    async: false,
                    taskType: __markInfo.Type,
                    success: function (args) {
                        if (__markInfo.Type != 2)
                            alert('修改成功');
                        //window.location.reload();
                    }
                };
                if (dosubmit)
                    valid = mark.submit(params);
            }

            if (!valid)
                return;


            if (modifyed != undefined && modifyed == false) {
                $(".btn-freez").removeAttr("disabled");
                return;
            }

            $(".btn-freeze").attr("disabled", true);

            $(domId).text("保存中...");

            //如果质检合格的话清空质检错误类型内容
            if (statusCode == 1)
                dataObject.CheckResult = "";
           
            //质检结果提交
            $.post('/api/quality/save', dataObject)
                .success(function () {

                    $(domId).text("提交成功.");

                    if (window.location.href.indexOf("quality") > 0) {
                        //质检配置JSON
                        var qualityJson = template.getQueryString("quality");

                        //质检配置对象
                        qualityConfig = JSON.parse(qualityJson);

                        if (qualityConfig.count - 1 == 0) {
                            alert('目标数据量，质检完成.');
                        } else {
                            //目标数量-1
                            qualityConfig.count = qualityConfig.count - 1;
                            qualityJson = JSON.stringify(qualityConfig);

                            //获取下一条质检数据
                            var uri_next = "/zh-cn/quality/take?personInProjectId={personInProjectId}&quality={1}"
                                .replace('{personInProjectId}', __markInfo.assignId)
                                .replace('{1}', qualityJson);

                            window.location = uri_next;
                        }

                    } else {
                        var orderBy = "";
                        $('input[name="work-qualityType"]').each(function (i, input) {
                            if (true == $(input).is(':checked')) {
                                console.log(input)
                                orderBy = $(this).val();
                                if (orderBy == "") {
                                    orderBy = $(this).data("value");
                                }

                                return false;
                            }
                        });

                        if (orderBy == "random" || orderBy == "order") {
                            window.location.href = "/zh-cn/quality/takeQualityData?personProjectId=" + dataObject.PersonInProjectId + "&order=" + orderBy;
                        } else {
                            window.location.reload();
                        }
                    }
                })
                .fail(function (msg) {
                    var responseJson = JSON.parse(msg.responseText);
                    alert(responseJson.message);
                    //$(".btn-freeze").removeAttr("disabled");
                    //$(domId).text(defaultText);
                })
                .done(function () {
                    $(".btn-freeze").removeAttr("disabled");
                    $(domId).text(defaultText);
                });
        },

        /**
         * 质检表单校验
         * @return {boolean} 校验结果
         */
        validate: function (statusCode) {
            var validateResult = {
                status: 1,
                message: ''
            }
            var qualityProperty = []; //定义一个数组
                //遍历每一个名字为interest的复选框，其中选中的执行函数
            $('input[name=qualityProperty]:checked').each(function () {
                qualityProperty.push($(this).val()); //将选中的值添加到数组qualityProperty中
            });
            var qualityOpinion = $('textarea[name=qualityOpinion]').val().replace(/(^s*)|(s*$)/g, "");

            if (statusCode === 1) { // 整体合格
                if (qualityProperty.length !== 0) {
                    validateResult = {
                        status: -1,
                        message: '质检合格时不允许选择错误类型！'
                    }
                } else if (qualityOpinion !== '') {
                    validateResult = {
                        status: -2,
                        message: '质检合格时不允许填写审核意见！'
                    }
                }
            } else if (statusCode === 2) { // 修改通过
                if (qualityProperty.length !== 0) {
                    validateResult = {
                        status: -3,
                        message: '质检修改通过时不允许选择错误类型！'
                    }
                }else if (qualityOpinion !== '') {
                    validateResult = {
                        status: -4,
                        message: '质检修改通过时不允许填写审核意见！'
                    }
                }
            } else if (statusCode === 3) { // 整体不合格
                if (qualityProperty.length === 0 && qualityOpinion === '') {
                    validateResult = {
                        status: -5,
                        message: '质检不合格时必须选择错误类型或填写审核意见！'
                    }
                }
            }

            return validateResult;
        }
    }
});