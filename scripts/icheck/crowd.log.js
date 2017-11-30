(function () {
   if (!window.crowd_log) {
      window.crowd_log = {};
   }
   var _c = window.crowd_log;
   _c.trig = true;
   _c.LoadBeginTime = new Date().getTime();
   

   window.onload = function () {
      var LoadEndTime = new Date().getTime();
      //************************
      _c.TemplateId = __markInfo.TemplateId;
      _c.UserId = __markInfo.personInTaskId;
      _c.ProjectId = __markInfo.projectId;
      _c.ProjectName = __markInfo.projectTitle;
      _c.PageLoadTime = (LoadEndTime - _c.LoadBeginTime) / 1000;
      _c.DataLoadTime = "";
      _c.OperateTime = "";
      _c.DataSize = "";
      _c.SubTime = new Array();
      //************************
      if (window.crowd_log.trig == true && $("#btnNext").length > 0) {
         $("#btnNext").bind("click", function () {
            var endtime = new Date().getTime();
            _c.OperateTime = (endtime - _c.LoadBeginTime) / 1000;
            var param =
                 "TemplateId=" + _c.TemplateId
               + "&UserId=" + __markInfo.personInTaskId
               + "&ProjectId=" + _c.ProjectId
               + "&ProjectName=" + _c.ProjectName
               + "&PageLoadTime=" + _c.PageLoadTime
               + "&DataLoadTime=" + _c.DataLoadTime
               + "&OperateTime=" + _c.OperateTime
               + "&DataSize=" + _c.DataSize
               + "&SubTime=" + _c.SubTime.join("-");
            $.get("http://139.217.22.7:8785/log.gif", param, function (result) { });
         });
      }
   }

})();