define(["template"], function (template) {
    /// <summary>
    /// 
    /// </summary>
    /// <param name="$"></param>

    return {
        getTrialFeedback: function (markInfo) {
            /// <summary>
            /// 获取试标结果
            /// </summary>

            var url =
                "/api/data_source/get/{dataId}-{assignId}"
                .replace("{dataId}", markInfo.dataId)
                .replace("{assignId}", markInfo.personInTaskId);

            //试标结果字符串
            var trialFeedback = "";

            //同步等待试标结果
            $.ajax({
                url: url,
                async: false,
                data: null,
                success: function (jsonObj) {
                    //运行组件方法
                    trialFeedback = template.runExtension("trialResult", jsonObj);
                }
            });

            return trialFeedback;
        }
    }
});