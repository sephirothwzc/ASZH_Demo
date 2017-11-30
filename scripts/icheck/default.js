crowd.dataMark.useIcheck = false;
var __playIndex = 0;
var __paying = false;
var __images = [];
var __timerNext = null;
var __timerPrev = null;
var $imgIndex = 0;
var $shape = null;
var flag=true;


requirejs(['crowd.mark'],function(mark){
    var args={
        taskId:__markInfo.projectId,
        dataId:__markInfo.dataId,
        personInTaskId:__markInfo.assignId,
        dataTitle:__markInfo.dataTitle,
        type:__markInfo.type
    };
    
    args.success = function(){
        alert('保存成功');
    }

    function getQueryString(name){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    }

    var redo=getQueryString("agin");
    if(redo!=null){
        redo= redo.toLowerCase()=="true";
    }else{
        redo=false;
    }
    
    upload = function(){
        
            mark.submit(args);
       
    }
    
    
});

crowd.dataMark.addExtension("Crowd.Template.Audio", function () {
    var isNew=true;
    //统计标注框数量
    var boxCount = 0,Pedestrians = 0,Car=0,Traffic_light=0,Traffic_sign=0,Ban_sign=0,Other=0;
     //计算标注框总数
    function setboxCount(boxCount){
        $('#boxCount').text(boxCount>=0?boxCount:0);
    } 
    function setPedestrians(Pedestrians){
        $('#Pedestrians').text(Pedestrians>=0?Pedestrians:0);
    } //计算车辆框总数
    function setCar(Car){
        $('#Car').text(Car>=0?Car:0);
    }
    //计算信号灯框总数
    function setTraffic_light(Traffic_light){
        $('#Traffic_light').text(Traffic_light>=0?Traffic_light:0);
    }
     //计算交通标志总数
    function setTraffic_sign(Traffic_sign){
        $('#Traffic_sign').text(Traffic_sign>=0?Traffic_sign:0);
    }
     //计算禁令标志框总数
    function setBan_sign(Ban_sign){
        $('#Ban_sign').text(Ban_sign>=0?Ban_sign:0);
    }
     //计算其他框总数
    function setOther(Other){
        $('#Other').text(Other>=0?Other:0);
    }

    var images = ["http://localhost/img/12290.jpg", "http://localhost/img/12315.jpg", "http://localhost/img/12320.jpg", "http://localhost/img/12335.jpg", "http://localhost/img/12375.jpg"];
    var $lastRectId = "";
    var $saved = true;
    var $img = "";
    var $video = "";
    var $list = null;

    $("#img-player").insertAfter(".content");
    $("#cloth-area").insertAfter("body");
    $("#ivbox").insertAfter(".content");
    $("#ivbox1").insertAfter(".content");
  
  //显示框
  $("#cloth-box-show").click(function() {
    $(".ui-shape").show();
  });

  //隐藏框
  $("#cloth-box-hide").click(function() {
    $(".ui-shape").hide();
  });
  
  $(document).keydown(function(e) {
      switch (e.keyCode) {
        case 90: 
          if ($(".ui-shape").eq(0).css("display") == "none") {
            $(".ui-shape").show();
          } else {
            $(".ui-shape").hide();
          }
      }
  });
  
 function bottom_show_list(id){
    document.getElementById("InBrand").innerHTML="";
    var val=$("#" + id)[0].getAttribute("value");
    var val1_h=$("#" + id)[0].getAttribute("val1");
    var content1=$("#" + id)[0].getAttribute("content");
    if(content1==""||content1==null||content1==undefined){
        isNew=true;
    }else{
        isNew=false;
    }
    if(content1 =="最低限速" || content1 =="限制速度" || content1 =="禁止宽度" || content1 =="限制高度" || content1 =="限制质量" || content1 =="限制轴重"){
          ignoreChange(content1);
          $("#fujia").val($("#" + id).data("fujia"));
          
     }else if(content1 =="普通灯" || content1 =="直行_信号灯" || content1 =="左转" || content1 =="右转" || content1 =="掉头" || content1 =="左转掉头" || content1 =="直行左转" || content1 =="直行右转" || content1 =="直行掉头" || content1 =="数字"){
          ignoreChange(content1);
         $("#light_color").val($("#" + id).data("light_color"));
         $("#fujia").val($("#" + id).data("light_id"));
     }else if(content1 =="行人" || content1 =="骑电动自行车/摩托车行人" || content1 =="骑自行车行人" || content1 =="坐着的人" || content1 =="小型汽车" || content1 =="中型乘用车" || content1 =="三轮车" || content1 =="厢式车" || content1 =="卡车" || content1 =="城市公交车" || content1 =="小型汽车" || content1 =="有轨电车" || content1 =="长途客车"){
           ignoreChange(content1);
          $("#cont").val($("#" + id).data("cont"));
          $("#shade").val($("#" + id).data("shade"));
          $("#cut").val($("#" + id).data("cut"));
     }else if(content1 == "Misc"){
          ignoreChange(content1);
         $("#InBrand").val(content1);
         $("#InBrand").text(content1);
         $("#misc_type").val($("#" + id).data("misc_type"));
     }else{
         ignoreChange(content1);
         $("#InBrand").val(content1);
         $("#InBrand").text(content1);
     }
    $("#" + id)[0].innerHTML = "";
    $lastRectId = id;
    var h = $("#" + id)[0].offsetHeight+2;
    var newHeight= $("#workPlace").height();
    var realh=(h*normailHeight())/newHeight;

    if(realh <=25 && val1_h=="Pedestrians"){
      $('.pixes-tip').fadeIn();
      setTimeout(function(){
          $('#'+ $lastRectId).remove();
          $('.pixes-tip').fadeOut();
      }, 1000);
      return;
    }else if(realh <=25 && val1_h=="Car"){
         $('.pixes-tip').fadeIn();
      setTimeout(function(){
          $('#'+ $lastRectId).remove();
          $('.pixes-tip').fadeOut();
      }, 1000);
      return;
    }else if(realh <=20 && val1_h=="Traffic_sign"){
      $('.pixes-tip2').fadeIn();
      setTimeout(function(){
          $('#'+ $lastRectId).remove();
          $('.pixes-tip2').fadeOut();
      }, 1000);
      return;
    }else if(realh <=20 && val1_h=="Ban_sign"){
      $('.pixes-tip2').fadeIn();
      setTimeout(function(){
          $('#'+ $lastRectId).remove();
          $('.pixes-tip2').fadeOut();
      }, 1000);
      return;
    }else if(realh <=10 && val1_h=="Traffic_light"){
      $('.pixes-tip3').fadeIn();
      setTimeout(function(){
          $('#'+ $lastRectId).remove();
          $('.pixes-tip3').fadeOut();
      }, 1000);
      return;
    }else{
         $("#box-form").addClass('active').show();
    }
    var bottm_htm=$("#" + id)[0].title.split("-")[0];
    var html = '<span class="box_watermark">' + bottm_htm + '</span>';
    $("#" + id).html(html);
 }
 
    //取消
  $("#box_cancel").click(function() {
    var rect = $("#" + $lastRectId);
    var content= $("#" + $lastRectId).attr("content");
    var title=$("#" + $lastRectId).attr("title");
    if(content!=undefined&&content!=null&&content!=""){
        if(content =="普通灯" || content =="直行_信号灯" || content =="左转" || content =="右转" || content =="掉头" || content =="左转掉头" || content =="直行左转" || content =="直行右转" || content =="直行掉头" || content =="数字"){
            if($("#fujia").val() !="" && $("#fujia").val() !=null && $("#fujia").val() !=undefined && $("#light_color").val() !=""  &&  $("#light_color").val() !=null && $("#light_color").val() !=undefined){
                rect.addClass("water_" + content);
                rect.html('<span class="box_watermark">' + (parseInt($lastRectId.split("-")[2]) + 1) + '</span>');
                rect.attr("title", title);
             }else{
                rect.remove();
                flag =false;
            }
        }else if(content =="最低限速" || content =="限制速度" || content =="禁止宽度" || content =="限制高度" || content =="限制质量" || content =="限制轴重"){
            if($("#fujia").val() !=""  && $("#fujia").val() !=null && $("#fujia").val() !=undefined){
                rect.addClass("water_" + content);
                rect.html('<span class="box_watermark">' + (parseInt($lastRectId.split("-")[2]) + 1) + '</span>');
                rect.attr("title", title);
            }else{
                rect.remove();
                flag =false;
            }
        }else if(content =="行人" || content =="骑电动自行车/摩托车行人" || content =="骑自行车行人" || content =="坐着的人" || content =="小型汽车" || content =="中型乘用车" || content =="三轮车" || content =="厢式车" || content =="卡车" || content =="城市公交车" || content =="小型汽车" || content =="有轨电车" || content =="长途客车"){
          if($("#cont").val() !="" && $("#cont").val() !=null && $("#cont").val() !=undefined && $("#shade").val() !="" && $("#shade").val() !=null && $("#shade").val() !=undefined){
                rect.addClass("water_" + content);
                rect.html('<span class="box_watermark">' + (parseInt($lastRectId.split("-")[2]) + 1) + '</span>');
                rect.attr("title", title);
          }else{
                rect.remove();
                flag =false;
            }
        } else if(content == "Misc"){
             if($("#misc_type").val() !="" && $("#misc_type").val() !=null && $("#misc_type").val() !=undefined){
                rect.addClass("water_" + content);
                rect.html('<span class="box_watermark">' + (parseInt($lastRectId.split("-")[2]) + 1) + '</span>');
                rect.attr("title", title);
             }else{
                rect.remove();
                flag =false;
            }
        }else{
            if($("#InBrand").val() !="" && $("#InBrand").val() !=null && $("#InBrand").val() !=undefined){
                rect.addClass("water_" + content);
                rect.html('<span class="box_watermark">' + (parseInt($lastRectId.split("-")[2]) + 1) + '</span>');
                rect.attr("title", title);
             }else{
                rect.remove();
                flag =false;
            }
        }
    }else{
        rect.remove();
        flag =false;
    }
    $("#box-form").removeClass('active').hide();
    sumMarkCount();
    _dragtrig = 0;
  });
    $(document).on("dblclick", ".cloth-tab", function () {
        $("#" + this.id.split("_")[1]).hide();
    });
  //var normailHeight=1944;
   function normailHeight(){
      var img = new Image();  
      // 改变图片的src  
      img.src = $img;  
      var normailHeight=img.height;
      return normailHeight;
  };
    $(document).on("click", ".cloth-tab", function () {
       $("#" + this.id.split("_")[1]).show();
       var id=this.id.split("_")[1];
       $("#box-form").addClass('active').show();
       document.getElementById("InBrand").innerHTML = document.getElementById(id).getAttribute("title")
        var content1=document.getElementById("InBrand").innerHTML;
         if(content1 =="最低限速" || content1 =="限制速度" || content1 =="禁止宽度" || content1 =="限制高度" || content1 =="限制质量" || content1 =="限制轴重"){
              $("#fujia").val($("#" + this.id).data("fujia"));
         }else if(content1 =="普通灯" || content1 =="直行_信号灯" || content1 =="左转" || content1 =="右转" || content1 =="掉头" || content1 =="左转掉头" || content1 =="直行左转" || content1 =="直行右转" || content1 =="直行掉头" || content1 =="数字"){
             $("#light_color").val($("#" + this.id).data("light_color"));
             $("#fujia").val($("#" + this.id).data("light_id"));
         }else if(content1 =="行人" || content1 =="骑电动自行车/摩托车行人" || content1 =="骑自行车行人" || content1 =="坐着的人" || content1 =="小型汽车" || content1 =="中型乘用车" || content1 =="三轮车" || content1 =="厢式车" || content1 =="卡车" || content1 =="城市公交车" || content1 =="小型汽车" || content1 =="有轨电车" || content1 =="长途客车"){
              $("#cont").val($("#" + this.id).data("cont"));
              $("#shade").val($("#" + this.id).data("shade"));
              $("#cut").val($("#" + this.id).data("cut"));
         }else if(content1 == "Misc"){
             $("#misc_type").val($("#" + this.id).data("misc_type"));
         }
    });
    $(document).on("dblclick", ".ui-shape", function () {
        flag=true;
        var isShow = $("#box-form").is(':hidden');
          if (!isShow) {
            alert("尚有未保存的标注内容");
            return;
          }
        document.getElementById("InBrand").innerHTML="";
        var val=this.getAttribute("value");
        var val1_h=this.getAttribute("val1");
        var content1=this.getAttribute("content");
        if(content1==""||content1==null||content1==undefined){
            isNew=true;
        }else{
            isNew=false;
        }
        if(content1 =="最低限速" || content1 =="限制速度" || content1 =="禁止宽度" || content1 =="限制高度" || content1 =="限制质量" || content1 =="限制轴重"){
              ignoreChange(content1);
              $("#fujia").val($("#" + this.id).data("fujia"));
              
         }else if(content1 =="普通灯" || content1 =="直行_信号灯" || content1 =="左转" || content1 =="右转" || content1 =="掉头" || content1 =="左转掉头" || content1 =="直行左转" || content1 =="直行右转" || content1 =="直行掉头" || content1 =="数字"){
              ignoreChange(content1);
             $("#light_color").val($("#" + this.id).data("light_color"));
             $("#fujia").val($("#" + this.id).data("light_id"));
         }else if(content1 =="行人" || content1 =="骑电动自行车/摩托车行人" || content1 =="骑自行车行人" || content1 =="坐着的人" || content1 =="小型汽车" || content1 =="中型乘用车" || content1 =="三轮车" || content1 =="厢式车" || content1 =="卡车" || content1 =="城市公交车" || content1 =="小型汽车" || content1 =="有轨电车" || content1 =="长途客车"){
               ignoreChange(content1);
              $("#cont").val($("#" + this.id).data("cont"));
              $("#shade").val($("#" + this.id).data("shade"));
              $("#cut").val($("#" + this.id).data("cut"));
         }else if(content1 == "Misc"){
              ignoreChange(content1);
             $("#InBrand").val(content1);
             $("#InBrand").text(content1);
             $("#misc_type").val($("#" + this.id).data("misc_type"));
         }else{
             //var val1_h=document.getElementById("InBrand").getAttribute(content);
             $("#InBrand").val(content1);
             $("#InBrand").text(content1);
         }
        this.innerHTML = "";
        $lastRectId = this.id;
        var h = $(this)[0].offsetHeight+2;
        var newHeight= $("#workPlace").height();
        var realh=(h*normailHeight())/newHeight;
    
        if(realh <=25 && val1_h=="Pedestrians"){
          $('.pixes-tip').fadeIn();
          setTimeout(function(){
              $('#'+ $lastRectId).remove();
              $('.pixes-tip').fadeOut();
          }, 1000);
          return;
        }else if(realh <=25 && val1_h=="Car"){
             $('.pixes-tip').fadeIn();
          setTimeout(function(){
              $('#'+ $lastRectId).remove();
              $('.pixes-tip').fadeOut();
          }, 1000);
          return;
        }else if(realh <=20 && val1_h=="Traffic_sign"){
          $('.pixes-tip2').fadeIn();
          setTimeout(function(){
              $('#'+ $lastRectId).remove();
              $('.pixes-tip2').fadeOut();
          }, 1000);
          return;
        }else if(realh <=20 && val1_h=="Ban_sign"){
          $('.pixes-tip2').fadeIn();
          setTimeout(function(){
              $('#'+ $lastRectId).remove();
              $('.pixes-tip2').fadeOut();
          }, 1000);
          return;
        }else if(realh <=10 && val1_h=="Traffic_light"){
          $('.pixes-tip3').fadeIn();
          setTimeout(function(){
              $('#'+ $lastRectId).remove();
              $('.pixes-tip3').fadeOut();
          }, 1000);
          return;
        }else{
             $("#box-form").addClass('active').show();
        }
     });
 
  //保存数据
    var savedata=function() {
        //以下为存库代码/////////////////////////////////////////////////////////////
        if($("#InBrand").text() == null || $("#InBrand").text() == undefined || $("#InBrand").text() == ""){
            alert('title为null，不能保存！');
            return;
        }
        var result = {};
        var reflag = true;
        result.img =$sourceImg;
        result.effective = $("[name='effective']:checked").val();
        result.boxs = [];
        var boxCount = 0,Pedestrians = 0,Car=0,Traffic_light=0,Traffic_sign=0,Ban_sign=0,Other=0;
        if (result.effective=="1") {
            var shapes = $shape.getShapes();
            $(shapes).each(function (i, shape) {
                var t = $("#" + shape.id).data("type");
                var text = document.getElementById(shape.id).getAttribute("title");
                if(text == null){
                    reflag = false;
                    return reflag;
                }
                var f = $("#" + shape.id).data("fujia");
                var light_id=$("#" + shape.id).data("light_id");
                var z = $("#" + shape.id).data("cont");
                var z_c = $("#" + shape.id).data("light_color");
                var val1=$("#" + shape.id + "").data("val1");
                var val_data=$("#" + shape.id + "").data("val_data");
                var val_data1=$("#" + shape.id + "").data("val_data1");
                var misc_type=$("#" + shape.id + "").data("misc_type");
                var shade=$("#" + shape.id + "").data("shade");
                var cut=$("#" + shape.id + "").data("cut");
                switch(val1){
                  case "Pedestrians":
                    Pedestrians++;
                    break;
                  case "Car":
                    Car++;
                    break;
                  case "Traffic_light":
                    Traffic_light++;
                    break;
                  case "Traffic_sign":
                    Traffic_sign++;
                    break;
                  case "Ban_sign":
                    Ban_sign++;
                    break;
                  case "Other":
                    Other++;
                    break;
                  default:
                    break;
                }
                result.boxs.push({
                        id: shape.id,
                        type: t,
                        title: text,
                        fujia: f,
                        light_id:light_id,
                        cont: z,
                        val1:val1,
                        val_data:val_data,
                        val_data1:val_data1,
                        light_color:z_c,
                        misc_type:misc_type,
                        shade:shade,
                        cut:cut,
                        content:t,
                        x: shape.x,
                        y: shape.y,
                        w: shape.w,
                        h: shape.h
                    });
            });
             //工作量
            result.Workload = {
              boxCount: result.boxs.length,
              Pedestrians:Pedestrians,
              Car:Car,
              Traffic_light:Traffic_light,
              Traffic_sign:Traffic_sign,
              Ban_sign:Ban_sign,
              Other:Other
            };
        }else{
             result.Workload = {};
        }   
        
        
        if(reflag){
            
            upload();
            
            // var isValid = result.effective == "1" ? true : false ;
            // var postData = {
            //     ProjectId: __markInfo.projectId,
            //     DataId: __markInfo.dataId,
            //     DataTitle: __markInfo.dataTitle,
            //     AssignId: __markInfo.assignId,
            //     ResultJson: JSON.stringify(result),
            //     IsValid: isValid
            // };
            // $.ajax({
            //     url: "/api/dataresult/save2",
            //     data: postData,
            //     method: "POST",
            //     async: true
            // }).success(function (response) {
            //         alert("保存成功")
            // }).fail(function (msg) {
            //         alert("保存失败")
            // }); 
        }else{
            alert("title为null");
        }
    }
       
    if(__markInfo.operationCase!=4){
       $("#btnsavedata").bind("click",savedata);
    }
    //单击图片时的事件
    $(document).on("click", ".img-item", function () {
         if(flag){
             document.getElementById("InBrand").innerHTML="";
             //显示的标题
             document.getElementById("InBrand").innerHTML = this.children[1].innerHTML;
             var val1=this.children[0].getAttribute("selecttype");
             var val_data=this.children[0].getAttribute("selectdata");
             var content1=this.children[1].innerHTML;
             ignoreChange(content1);
             console.log(this.children[1].innerHTML)
             document.getElementById("InBrand").setAttribute("data-text",this.children[1].innerHTML);
             document.getElementById("InBrand").setAttribute("val1",val1);
             document.getElementById("InBrand").setAttribute("val_data",val_data);
         }
         
     });
    $("label").bind("change",function(){
        var selectval=$(this).val();
        ignoreChange(selectval);
    });
   /**
   * 删除图片上的矩形框和底部的矩形框
   */
  function deleteTrafficLights(id){
    // 其他项的统计数减少
    $('#'+id).remove();
    $('#rf_show_'+id).remove();
  }
   //在底部添加标注框内容
  function addNewRects(rect){
      $(".rf-rect-record .clear-fix").remove();
      var content = (parseInt(rect.data('parentId'))?rect.data('parentId'):rect.data("title")).split("-")[0];
      var html = '<div id="rf_show_'+rect.attr('id')+'" class="rf-show">'
              +'<span class="rf-span" id="rf_show_span_'+rect.attr('id')+'">'+content+'</span>'
              +'<span class="rf-close">×</span>'
              +'</div>';
		$('.rf-rect-record').append(html).append('<div class="clear-fix"></div>');
		$('#rf_show_'+rect.attr('id')+' .rf-close').on('click', function(evt){
		    var id = $(this).parent().attr('id').split('_')[2];
		    $("#"+id).remove();
		    $(this).parent().remove();
		    // 删除的是选中的框，需要回复之前的状态
			var activeFlg = false;
			$('.rf-show').each(function(idx, rs){
				if($(rs).hasClass('actived')){
					activeFlg = true;
					return;
				}
			});
			if(!activeFlg){
				$('.ui-shape').show();
			}
			// 阻止事件冒泡
			evt.stopPropagation();
		    sumMarkCount();
		});
		// 点击底部框，
		$('#rf_show_'+rect.attr('id')).on('click', function(evt){
		    if($(this).hasClass('actived')){
				$(this).removeClass('actived');
				$('.ui-shape').show();
				$("#box-form").removeClass('active').hide();
			} else {
				var id = $(this).attr('id').split('_')[2];
				// 图片上的所有框隐藏
				$('.ui-shape').hide();
				// 选中的显示
				$('#'+id).show();
				bottom_show_list(id);
				$(this).siblings().removeClass('actived');
				$(this).addClass('actived');
			}
			evt.stopPropagation();
		});
  }
 //统计标注框数量
  function sumMarkCount(){
    Pedestrians=$("div[val1='Pedestrians']").length;
    Car=$("div[val1='Car']").length;
    Traffic_light=$("div[val1='Traffic_light']").length;
    Traffic_sign=$("div[val1='Traffic_sign']").length;
    Ban_sign=$("div[val1='Ban_sign']").length;
    Other=$("div[val1='Other']").length;
    boxCount=Pedestrians+Car+Traffic_light+Traffic_sign+Ban_sign+Other;
    
    setMarkcount();
  }
//设置所有的标注数量
  function setMarkcount(){
    setPedestrians(Pedestrians);
    setCar(Car);
    setTraffic_light(Traffic_light);
    setTraffic_sign(Traffic_sign);
    setBan_sign(Ban_sign);
    setOther(Other);
    setboxCount(boxCount);
  }
//初始化工作量
  function initcount(){
      Pedestrians=0;
      Car=0;
      Traffic_light=0;
      Traffic_sign=0;
      Ban_sign=0;
      Other=0;
      boxCount=0;
  }
  function ignoreChange(content){
        if(content =="最低限速" || content =="限制速度" || content =="禁止宽度" || content =="限制高度" || content =="限制质量" || content =="限制轴重"){
            //最低限速 限制速度 禁止宽度 限制高度 限制质量 限制轴重
            $("#cont").hide();
            $("#shade").hide();
            $("#cut").hide();
            $("#light_color").hide();
            $("#fujia_content").show();
            $("#fujia").show();
            $("#misc_type").hide();
            document.getElementById("InBrand").innerHTML=content;
        }else if(content =="普通灯" || content =="直行_信号灯" || content =="左转" || content =="右转" || content =="掉头" || content =="左转掉头" || content =="直行左转" || content =="直行右转" || content =="直行掉头" || content =="数字"){
            $("#fujia_content").show();
            $("#cont").hide();
            $("#shade").hide();
            $("#cut").hide();
            $("#light_color").show();
            $("#fujia").show();
            $("#misc_type").hide();
            $("#cont").val("");
            $("#shade").val("");
            $("#light_color").val("");
            $("#fujia_content").val("");
            $("#fujia").val("");
            $("#misc_type").val("");
            document.getElementById("InBrand").innerHTML=content;
        }
        else if(content =="行人" || content =="骑电动自行车/摩托车行人" || content =="骑自行车行人" || content =="坐着的人" || content =="小型汽车" || content =="中型乘用车" || content =="三轮车" || content =="厢式车" || content =="卡车" || content =="城市公交车" || content =="小型汽车" || content =="有轨电车" || content =="长途客车"){
            $("#light_color").hide();
            $("#fujia_content").hide();
            $("#fujia").hide();
            $("#cont").show();
            $("#shade").show();
            $("#cut").show();
            $("#misc_type").hide();
            $("#cont").val("");
            $("#shade").val("");
            $("#light_color").val("");
            $("#fujia_content").val("");
            $("#fujia").val("");
            $("#misc_type").val("");
            document.getElementById("InBrand").innerHTML=content
        }else if(content =="Misc"){
            $("#misc_type").show();
            $("#cont").hide();
            $("#shade").hide();
            $("#cut").hide();
            $("#light_color").hide();
            $("#fujia_content").hide();
            $("#fujia").hide();
            $("#cont").val("");
            $("#shade").val("");
            $("#light_color").val("");
            $("#fujia_content").val("");
            $("#fujia").val("");
            $("#misc_type").val("");
            document.getElementById("InBrand").innerHTML=content
        }else{
            $("#cont").hide();
            $("#shade").hide();
            $("#cut").hide();
            $("#light_color").hide();
            $("#fujia_content").hide();
            $("#fujia").hide();
            $("#misc_type").hide();
            $("#cont").val("");
            $("#shade").val("");
            $("#light_color").val("");
            $("#fujia_content").val("");
            $("#fujia").val("");
            $("#misc_type").val("");
            document.getElementById("InBrand").innerHTML=content
        }
  }
  
  //保存
  $("#box_save").click(function () {
     var text = document.getElementById("InBrand").innerHTML;
     var val = document.getElementById("InBrand");
     //val1 用来计算框数
     var val1=document.getElementById("InBrand").getAttribute("val1");
     //用来保存数据
     var val_data=document.getElementById("InBrand").getAttribute("val_data");
     if (text == "") {
         alert("请选择标志类型");
         flag=true;
     }
     else if(text =="普通灯" || text =="直行_信号灯" || text =="左转" || text =="右转" || text =="掉头" || text =="左转掉头" || text =="直行左转" || text =="直行右转" || text =="直行掉头" || text =="数字"){
         var rect = $("#" + $lastRectId);
         rect.attr("content",text);
         rect.data("content",text);
         rect.attr("val1",val1);
         rect.data("val1",val1);
         rect.data("val_data",val_data);
         rect.attr("val_data",val_data);
         rect.data("type", text);
         var val1_h=document.getElementById("InBrand").getAttribute("val1");
         var h = $("#"+$lastRectId).height()+2;
         var newHeight= $("#workPlace").height();
         var realh=(h*normailHeight())/newHeight;
         if(realh <=10 && val1_h=="Traffic_light"){
           $("#box-form").removeClass('active').hide();
           $('.pixes-tip3').fadeIn();
           setTimeout(function(){
              $('#'+ $lastRectId).remove();
              $('.pixes-tip').fadeOut();
           }, 1000);
           return;
         }else{
            if($("#fujia").val()=="" || $("#fujia").val()==null || $("#fujia").val()==undefined || $("#light_color").val()=="" || $("#light_color").val()==null || $("#light_color").val()==undefined){
                     alert("请确认标注框属性是否全部填写(选择)。");
                     return;
             }else{
              rect.attr("light_id", $("#fujia").val());
              rect.data("light_id", $("#fujia").val());
             }
              rect.attr("light_color", $("#light_color").val());
              rect.data("light_color", $("#light_color").val());
              var light_color_data=$("#light_color").val();
              var fj_status=$("#fujia").val();
              var lc_status=$("#light_color option:selected").text();
             if(light_color_data !="" && light_color_data !=null && light_color_data !=undefined){
                 val_data1=val_data+light_color_data;
                 rect.data("val_data1",val_data1);
                 rect.attr("val_data1",val_data1);
             }
             rect.attr("title", (parseInt($lastRectId.split("-")[2]) + 1) + '-' + text + '-' + lc_status + '-' + fj_status);
             rect.data("title",  (parseInt($lastRectId.split("-")[2]) + 1) + '-' + text + '-' + lc_status + '-' + fj_status);
             rect.addClass("water_" + fj_status + '-' + lc_status + '-' + text);
             rect.append('<span class="box_watermark">' + (parseInt($lastRectId.split("-")[2]) + 1) + '</span>');
             $("#box-form").removeClass('active').hide();
             if(isNew){
                addNewRects(rect);
                isNew=true;
             }else{
                var stitle=(parseInt($lastRectId.split("-")[2]) + 1);
                var sid="rf_show_"+$lastRectId;
                $("#rf_show_span_"+$lastRectId).html(stitle);
                //统计框数
                sumMarkCount();
                var totalcount = Number($("#boxCount").text());
                var curId = Number($lastRectId.split("-")[2]) + 1;
                if(curId>=totalcount){
                    addNewRects(rect);
                }
                isNew=true;
             }
             rect.on('mousedown', mouseRightDown);
             $saved = true;  
        }
     }
     else {
         var rect = $("#" + $lastRectId);
         rect.addClass("water_" + text);
         rect.attr("title", (parseInt($lastRectId.split("-")[2]) + 1) + '-' + text);
         rect.data("title",  (parseInt($lastRectId.split("-")[2]) + 1) + '-' + text);
         rect.attr("content",text);
         rect.data("content",text);
         rect.attr("val1",val1);
         rect.data("val1",val1);
         rect.data("val_data",val_data);
         rect.attr("val_data",val_data);
         rect.data("type", text);
         var val1_h=document.getElementById("InBrand").getAttribute("val1");
         var h = $("#"+$lastRectId).height()+2;
         var newHeight= $("#workPlace").height();
         var realh=(h*normailHeight())/newHeight;
         if(realh <=25 && val1_h=="Pedestrians"){
          $("#box-form").removeClass('active').hide();
          $('.pixes-tip').fadeIn();
          setTimeout(function(){
              $('#'+ $lastRectId).remove();
              $('.pixes-tip').fadeOut();
          }, 1000);
          return;
         }else if(realh <=25 && val1_h=="Car"){
          $("#box-form").removeClass('active').hide();
          $('.pixes-tip').fadeIn();
          setTimeout(function(){
              $('#'+ $lastRectId).remove();
              $('.pixes-tip').fadeOut();
          }, 1000);
          return;
         }else if(realh <=20 && val1_h=="Traffic_sign"){
          $("#box-form").removeClass('active').hide();
          $('.pixes-tip2').fadeIn();
          setTimeout(function(){
              $('#'+ $lastRectId).remove();
              $('.pixes-tip2').fadeOut();
          }, 1000);
          return;
         }else if(realh <=20 && val1_h=="Ban_sign"){
          $("#box-form").removeClass('active').hide();
          $('.pixes-tip2').fadeIn();
          setTimeout(function(){
              $('#'+ $lastRectId).remove();
              $('.pixes-tip2').fadeOut();
          }, 1000);
          return;
         }else{
             if(text =="最低限速" || text =="限制速度" || text =="禁止宽度" || text =="限制高度" || text =="限制质量" || text =="限制轴重"){
                 if($("#fujia").val()=="" || $("#fujia").val()==null || $("#fujia").val()==undefined){
                     alert("请确认标注框属性是否全部填写(选择)。");
                     return;
                 }else{
                     rect.attr("fujia", $("#fujia").val());
                     rect.data("fujia", $("#fujia").val());
                     var fujia_data=$("#fujia").val();
                     var fj1_status=$("#fujia").val();
                     rect.attr("title", (parseInt($lastRectId.split("-")[2]) + 1) + '-' + text + '-' + fj1_status);
                     rect.data("title",  (parseInt($lastRectId.split("-")[2]) + 1) + '-' + text + '-' + fj1_status);
                     rect.addClass("water_" + text + '-' + fj1_status);
                     //rect.append('<span class="box_watermark">' + (parseInt($lastRectId.split("-")[2]) + 1) + '-'  + text + '-' + fj1_status + '</span>');
                     rect.append('<span class="box_watermark">' + (parseInt($lastRectId.split("-")[2]) + 1) + '</span>');
                 }
             }else if(text =="行人" || text =="骑电动自行车/摩托车行人" || text =="骑自行车行人" || text =="坐着的人" || text =="小型汽车" || text =="中型乘用车" || text =="三轮车" || text =="厢式车" || text =="卡车" || text =="城市公交车" || text =="小型汽车" || text =="有轨电车" || text =="长途客车"){
                  if($("#cont").val()=="" || $("#cont").val()==null || $("#cont").val()==undefined || $("#shade").val()=="" || $("#shade").val()==null || $("#shade").val()==undefined){
                     alert("请确认标注框属性是否全部填写(选择)。");
                     return;
                 }else{
                  rect.attr("cont", $("#cont").val());
                  rect.data("cont", $("#cont").val());
                  var cont_data=$("#cont").val();
                  var con1_status=$("#cont option:selected").text();
                  rect.attr("shade", $("#shade").val());
                  rect.data("shade", $("#shade").val());
                  var shade_data=$("#shade").val();
                  var shade1_status=$("#shade option:selected").text();
                  rect.attr("cut", $("#cut").val());
                  rect.data("cut", $("#cut").val());
                  var cut_data=$("#cut").val();
                  var cut1_status=$("#cut option:selected").text();
                  rect.attr("title", (parseInt($lastRectId.split("-")[2]) + 1) + '-' + text + '-' + con1_status + '-' + shade1_status + '-' + cut1_status);
                  rect.data("title",  (parseInt($lastRectId.split("-")[2]) + 1) + '-' + text + '-' + con1_status + '-' + shade1_status + '-' + cut1_status);
                  rect.addClass("water_" + text + '-' +con1_status + '-' + shade1_status + '-' + cut1_status);
                  //rect.append('<span class="box_watermark">' + (parseInt($lastRectId.split("-")[2]) + 1) + '-'  + text + '-' +con1_status + '-' + shade1_status + '-' + cut1_status + '</span>');
                  rect.append('<span class="box_watermark">' + (parseInt($lastRectId.split("-")[2]) + 1) + '</span>');
                 }
             }
             else if(text == "Misc"){
                 if($("#misc_type").val()=="" || $("#misc_type").val()==null || $("#misc_type").val()==undefined){
                     alert("请确认标注框属性是否全部填写(选择)。");
                     return;
                 }else{
                  rect.attr("misc_type", $("#misc_type").val());
                  rect.data("misc_type", $("#misc_type").val());
                  var misc_type_data=$("#misc_type").val();
                  var misc_type1_status=$("#misc_type option:selected").text();
                  if(misc_type1_status == "指示标志" || misc_type1_status == "禁止标志"){
                      if(realh <=20){
                          $("#box-form").removeClass('active').hide();
                          $('.pixes-tip2').fadeIn();
                          setTimeout(function(){
                              $('#'+ $lastRectId).remove();
                              $('.pixes-tip2').fadeOut();
                          }, 1000);
                          return;
                      }else{
                          rect.attr("title", (parseInt($lastRectId.split("-")[2]) + 1) + '-' + text + '-' + misc_type1_status);
                          rect.data("title",  (parseInt($lastRectId.split("-")[2]) + 1) + '-' + text + '-' + misc_type1_status);
                          rect.addClass("water_" + text + '-' + misc_type1_status);
                          //rect.append('<span class="box_watermark">' + (parseInt($lastRectId.split("-")[2]) + 1) + '-'  + text + '-' + misc_type1_status + '</span>');
                          rect.append('<span class="box_watermark">' + (parseInt($lastRectId.split("-")[2]) + 1) + '</span>');
                      }
                  }else if(misc_type1_status == "行人" || misc_type1_status == "车辆" || misc_type1_status == "其他"){
                      if(realh <=25){
                          $("#box-form").removeClass('active').hide();
                          $('.pixes-tip').fadeIn();
                          setTimeout(function(){
                              $('#'+ $lastRectId).remove();
                              $('.pixes-tip').fadeOut();
                          }, 1000);
                          return;
                      }else{
                          rect.attr("title", (parseInt($lastRectId.split("-")[2]) + 1) + '-' + text + '-' + misc_type1_status);
                          rect.data("title",  (parseInt($lastRectId.split("-")[2]) + 1) + '-' + text + '-' + misc_type1_status);
                          rect.addClass("water_" + text + '-' + misc_type1_status);
                          //rect.append('<span class="box_watermark">' + (parseInt($lastRectId.split("-")[2]) + 1) + '-'  + text + '-' + misc_type1_status + '</span>');
                          rect.append('<span class="box_watermark">' + (parseInt($lastRectId.split("-")[2]) + 1) + '</span>');
                      }
                  }else if(misc_type1_status == "信号灯"){
                      if(realh <=10){
                          $("#box-form").removeClass('active').hide();
                          $('.pixes-tip3').fadeIn();
                          setTimeout(function(){
                              $('#'+ $lastRectId).remove();
                              $('.pixes-tip3').fadeOut();
                          }, 1000);
                          return;
                      }else{
                          rect.attr("title", (parseInt($lastRectId.split("-")[2]) + 1) + '-' + text + '-' + misc_type1_status);
                          rect.data("title",  (parseInt($lastRectId.split("-")[2]) + 1) + '-' + text + '-' + misc_type1_status);
                          rect.addClass("water_" + text + '-' + misc_type1_status);
                          //rect.append('<span class="box_watermark">' + (parseInt($lastRectId.split("-")[2]) + 1) + '-'  + text + '-' + misc_type1_status + '</span>');
                          rect.append('<span class="box_watermark">' + (parseInt($lastRectId.split("-")[2]) + 1) + '</span>');
                      }
                  }
                  rect.attr("title", (parseInt($lastRectId.split("-")[2]) + 1) + '-' + text + '-' + misc_type1_status);
                  rect.data("title",  (parseInt($lastRectId.split("-")[2]) + 1) + '-' + text + '-' + misc_type1_status);
                  rect.addClass("water_" + text + '-' + misc_type1_status);
                  //rect.append('<span class="box_watermark">' + (parseInt($lastRectId.split("-")[2]) + 1) + '-'  + text + '-' + misc_type1_status + '</span>');
                  rect.append('<span class="box_watermark">' + (parseInt($lastRectId.split("-")[2]) + 1) + '</span>');
                 }
             }
             else{
                 //rect.append('<span class="box_watermark">' + (parseInt($lastRectId.split("-")[2]) + 1) + '-'  + text + '</span>');
                 rect.append('<span class="box_watermark">' + (parseInt($lastRectId.split("-")[2]) + 1) + '</span>');
             }
             if(cont_data !="" && cont_data !=null && cont_data !=undefined){
                 val_data1=val_data+cont_data;
                 rect.data("val_data1",val_data1);
                 rect.attr("val_data1",val_data1);
             }else if(fujia_data !="" && fujia_data !=null && fujia_data !=undefined){
                 val_data1=val_data+fujia_data;
                 rect.data("val_data1",val_data1);
                 rect.attr("val_data1",val_data1);
             }else if(misc_type_data !="" && misc_type_data !=null && misc_type_data !=undefined){
                 val_data1=val_data+misc_type_data;
                 rect.data("val_data1",val_data1);
                 rect.attr("val_data1",val_data1);
             }
             $("#box-form").removeClass('active').hide();
             if(isNew){
                addNewRects(rect);
                isNew=true;
             }else{
                //var stitle=(parseInt($lastRectId.split("-")[2]) + 1)
                //var stitle=$("#" + $lastRectId)[0].getAttribute("title");
               /* var sid="rf_show_"+$lastRectId;
                $("#rf_show_span_"+$lastRectId).html(stitle);*/
                //统计框数
                sumMarkCount();
                var totalcount = Number($("#boxCount").text());
                var curId = Number($lastRectId.split("-")[2]) + 1;
                if(curId>=totalcount){
                    addNewRects(rect);
                }
                isNew=true;
            }
             rect.on('mousedown', mouseRightDown);
             $saved = true;
        }

     }
        $("#cont").hide();
        $("#shade").hide();
        $("#misc_type").hide();
        $("#cut").hide();
        $("#light_color").hide();
        $("#fujia_content").hide();
        $(".d_c").css("display","none")
        //统计框数
        sumMarkCount();
    });

    if($("#box-form").is(":hidden")){
       $("#work-space").click( function(){
       $('.right-menu').remove();
  });
    }else{
        $(shape).remove();
        alert('尚有未保存的标注内容！');
        return;
    }


  $("#work-space").on('contextmenu', function(){
      return false; //设置返回为false，设置为true则返回右键菜单  限制浏览器右键
  });
  //鼠标右键按下事件处理函数
  function mouseRightDown(e){
      // 排除鼠标点击不是右键的情况
      if(e.which != 3){
        return;
      }
     
      // 删除已有的右键菜单
      if($('.right-menu').length > 0){
        $('.right-menu').remove();
      }
      var $rect = $(this);
      var title=$(this).attr("title");
      var selectid=$(this).attr("id");
      var left = $rect.get(0).offsetLeft;
      var top = $rect.get(0).offsetTop;
      var w = $rect.width();
      $rect.parent().append('<div class="right-menu"><span>删除</span></div>');
      var childs = $rect.parent().children();
      var zIndex = getMaxZindex(childs);
      if(left+w+57>=826){
          $('.right-menu').css({'left':left-57, 'top':top, 'z-index':zIndex+1});
      }else{
          $('.right-menu').css({'left':left+w+5, 'top':top, 'z-index':zIndex+1});
      }
      $('.right-menu').on('click', function(){
          // 删除矩形框
          $rect.remove();
          $('#rf_show_'+selectid).remove();
         
        // 删除右键菜单
        $(this).remove();
        sumMarkCount();
      });
    }
      /**
     * 获取所给元素的最大层级树
     * @param doms DOM元素数组
     */
    function getMaxZindex(doms){
      var max = 0;
      for(var i = 0;i < doms.length; i++){
        var dom = doms[i];
        var zIndex = dom.style.zIndex;
        if(zIndex > max){
          max = zIndex;
        }
      }
      return max;
    }

    function updateColorForFailPassRect(){
      var child = $(".ui-shape.actived");
      var height=(child[0].style.height).split("px")[0];
      //根据类型，做高度限制content_end
      var content_end=child[0].getAttribute("val1");
       if(height <=25 && content_end=="Pedestrians"){
          $('.pixes-tip').fadeIn();
          setTimeout(function(){
            $('#'+ child[0].id).remove();
            $('#rf_show_'+child[0].id).remove();
            $('.pixes-tip').fadeOut();
          }, 1000);
          return;
         }else if(height <=25 && content_end=="Car"){
          $('.pixes-tip').fadeIn();
          setTimeout(function(){
            $('#'+ child[0].id).remove();
            $('#rf_show_'+child[0].id).remove();
            $('.pixes-tip').fadeOut();
          }, 1000);
          return;
         }else if(height < 10 && content_end=="Traffic_light"){
          $('.pixes-tip3').fadeIn();
          setTimeout(function(){
            $('#'+ child[0].id).remove();
            $('#rf_show_'+child[0].id).remove();
            $('.pixes-tip3').fadeOut();
          }, 1000);
          return;
         }else if(height < 20 && content_end=="Traffic_sign"){
          $('.pixes-tip2').fadeIn();
          setTimeout(function(){
            $('#'+ child[0].id).remove();
            $('#rf_show_'+child[0].id).remove();
            $('.pixes-tip2').fadeOut();
          }, 1000);
          return;
         }else if(height < 20 && content_end=="Ban_sign"){
          $('.pixes-tip2').fadeIn();
          setTimeout(function(){
            $('#'+ child[0].id).remove();
            $('#rf_show_'+child[0].id).remove();
            $('.pixes-tip2').fadeOut();
          }, 1000);
          return;
         }else if(height < 10 && content_end=="Other"){
          $('.pixes-tip3').fadeIn();
          setTimeout(function(){
            $('#'+ child[0].id).remove();
            $('#rf_show_'+child[0].id).remove();
            $('.pixes-tip3').fadeOut();
          }, 1000);
          return;
         }
  }
  
    
    return {
   checkValidata: function (formObj) {
            /// <summary>
            /// 表单验证
            /// </summary>
            /// <returns type=""></returns>
             if(formObj.effective == '1'){
                 for (var i =0;i<formObj.boxs.length;i++){
                     if(formObj.boxs[i].title == "" || formObj.boxs[i].title == undefined || formObj.boxs[i].title == null){
                         alert("title 不能为null");
                         return false;
                     }
                 }
               return true; 
            }
            return true;
        },
         initialize: function (source) {
            /// <summary>
            /// 初始化
            /// </summary>

            //标注信息
            var markinfo = crowd.dataMark.getMarkInfo();
            var result = crowd.dataMark.dataResult;
            $sourceImg = source["data"];
            //当前需要标注的图片
            $img = source["data"];

            //正式
            //$img="http://crowdweb.blob.core.chinacloudapi.cn/100282/"+source["data"];
             $img = crowd.dataMark.getFile(encodeURIComponent(source["data"]));

            $LAB
                .script("scripts/usesys/jquery-ui.min.js")
                .script("scripts/usesys/jquery.iviewer.js")
                .script("scripts/usesys/jquery.mousewheel.min.js")
                .script("scripts/usesys/jquery.simpleShape.deg.road_siwei.js")
                .wait(function () {
                    //simpleShape
                    $shape = $("#viewer").simpleShape({
                        src:$img,
                        stopDraw: false,
                        onFinishLoad: function() {
                          //alert("onFinishLoad");
                          $(".dwa-loading").remove();
                          var _hrh = '<hr id="h_hr" style="border:1px dashed #F00;border-bottom:0;border-right:0;border-left:0;width:0;height:0;position: absolute;top: 0;visibility:hidden;margin-top: 0;margin-bottom: 0;">';
                          var _hrv = '<hr id="v_hr" style="border:1px dashed #F00;border-bottom:0;border-right:0;border-top:0;width:0;height:0;position: absolute;top: 0;visibility:hidden;margin-top: 0;margin-bottom: 0;">';
                          $("#workPlace").append(_hrh);
                          $("#workPlace").append(_hrv);
                          $("#h_hr").css("width", $("#workPlace").width() + "px");
                          $("#v_hr").css("height", $("#workPlace").height() + "px");
                          $("#workPlace").mouseover(function() {
                            $("#h_hr").css("visibility", "visible");
                            $("#v_hr").css("visibility", "visible");
                          });
                          $("#workPlace").mouseout(function() {
                            $("#h_hr").css("visibility", "hidden");
                            $("#v_hr").css("visibility", "hidden");
                          });
                          $("#workPlace").mousemove(function(e) {
                            $("#h_hr").css("width", $("#workPlace").width() + "px");
                            $("#v_hr").css("height", $("#workPlace").height() + "px");
                            if (e.originalEvent.offsetY > 1) {
                              $("#h_hr").css("top", e.originalEvent.offsetY + "px");
                            }
                            if (e.originalEvent.offsetX > 1) {
                              $("#v_hr").css("left", e.originalEvent.offsetX + "px");
                            }
                          });
                        },
                        onDrawStart: function (e, shape) {
                           if (!$("#box-form").is(':hidden')) {
                                $("#foodtype").select2('open');
                                alert("尚有未保存的标注内容");
                                return;
                              }
                        },
                        onDrawed: function (e, shape) {
                           if(!$("#box-form").is(":hidden")){
                            $(shape).remove();
                            alert('尚有未保存的标注内容！');
                            return;
                            }
                            if (!$saved) {
                                $("#" + $lastRectId).remove();
                            }
                            $lastRectId = shape.id;
                            var h = $(shape).height()+2;
                            var newHeight= $("#workPlace").height();
                            var realh=(h*normailHeight())/newHeight;
                           //alert("标注框的当前高度为："+h+"\n当前图片的实际高度为："+newHeight+"\n当前计算结果为："+realh+"\n计算公式为：标注框的实际高度=（标注框的当前高度*1080）/当前图片的实际高度");
                            if(realh <10){
                                  $('.pixes-tip3').fadeIn();
                                  setTimeout(function(){
                                      $('#'+ $lastRectId).remove();
                                    $('.pixes-tip3').fadeOut();
                                  }, 1000);
                                  return;
                            } else{
                                flag=true;
                                $saved = false;
                                $lastRectId = shape.id;
                                $("#fujia").hide();
                                $("#fujia_content").hide();
                                $("#fujia").val("");
                                $("#cont").hide();
                                $("#shade").hide();
                                $("#cut").hide();
                                $("#light_color").hide();
                                $("#misc_type").hide();
                                document.getElementById("InBrand").innerHTML = "";
                                $("#box-form").addClass('active').show();
                                $("#" + $lastRectId).html('<div class="d_c">' + parseInt(realh) + '<div>')
                            }
                        },
                        onRemoved: function (e, shape) {
                            var id = shape.id;
                            $("#box-form").removeClass('active').hide();
                        },
                        onZoomAfter: function () {

                        },
                        onResizeEnd : function(e, shape){
                           updateColorForFailPassRect();
                         }
                    });

                    //加载标注结果
                    if (result != null && result != undefined) {
                         $("[name='effective']:checked").val(result.effective)
                         boxCount=result.Workload.boxCount;
                         Pedestrians=result.Workload.Pedestrians;
                         Car=result.Workload.Car;
                         Traffic_light=result.Workload.Traffic_light;
                         Traffic_sign=result.Workload.Traffic_sign;
                         Ban_sign=result.Workload.Ban_sign;
                         Other=result.Workload.Other;
                         setMarkcount();
                        document.getElementById("InBrand").innerHTML = result.scene;
                        $list = result.boxs;

                        //加载矩形框
                        $(result.boxs).each(function (i, obj) {
                            var box = obj;
                            var shapeId = null;
                            if (obj.id != undefined) {
                                shapeId = obj.id;
                            }
                            var shape_id = (parseInt(shapeId.split("-")[2]) + 1);
                            $shape.drawShape(box.x, box.y, box.w, box.h, shapeId, function (shape) {
                                $("#" + shapeId).data("type", box.type).attr("type", box.type).data("misc_type", box.misc_type).attr("misc_type", box.misc_type).data("cut", box.cut).attr("cut", box.cut).data("shade", box.shade).attr("shade", box.shade).data("title", box.title).data("fujia", box.fujia).data("light_id", box.light_id).attr("light_id", box.light_id).data("cont", box.cont).attr("light_color", box.light_color).data("val_data", box.val_data).attr("val_data", box.val_data).data("val_data1", box.val_data1).attr("val_data1", box.val_data1).data("val1", box.val1).attr("val1", box.val1).data("light_color", box.light_color).attr("content", box.content).data("content", box.content).attr("fujia", box.fujia).attr("cont", box.cont).attr("title", box.title).addClass("water_" + box.type).append('<span class="box_watermark">' + shape_id + '</span>');
                            });
                            // 页面底部的矩形框
                          $("#" + shapeId).data({ 'parentId': box.parentId, 'content': box.content});
                          addNewRects($("#" + shapeId));
                             // 重新注册鼠标右键事件
                             $("#" + shapeId).on('mousedown', mouseRightDown);
                        });
                         document.getElementById("boxCount").innerHTML = result.boxs.length;
                    }else{
                         document.getElementById("boxCount").innerHTML = 0;
                    }
                });
                
                    //普通质检
                if(markinfo.operationCase==4 || markinfo.operationCase==32){
                 requirejs(['crowd.mark.quality'],function(quality){
                  $("#do-quality-qualified").unbind("click");
                  $("#do-quality-substandard").unbind("click");
                  $("#do-quality-modify_qualified").unbind("click");
                  $("#do-quality-qualified").click(function(){
                    var chk_value =[];//定义一个数组
                    $("input[name='qualityProperty']:checked").each(function(){//遍历每一个名字为interest的复选框，其中选中的执行函数
                        chk_value.push($(this).val());//将选中的值添加到数组chk_value中
                    });
                    
                    if(chk_value.length!=0){
                        alert("质检合格时不允许选择错误类型！");
                    }else if($("textarea[name='qualityOpinion']").val()!=undefined && $("textarea[name='qualityOpinion']").val() != "" && $("textarea[name='qualityOpinion']").val() != null){
                        alert("质检合格时不允许填写审核意见！");
                    }
                    else{
                        if(markinfo.operationCase==32){
                            savedata();
                        }
                        quality.save(1,$(this));
                    }
                  });
                  $("#do-quality-substandard").click(function(){
                    var chk_value =[];//定义一个数组
                    $("input[name='qualityProperty']:checked").each(function(){//遍历每一个名字为interest的复选框，其中选中的执行函数
                        chk_value.push($(this).val());//将选中的值添加到数组chk_value中
                    });
                    if(chk_value.length==0 && ($("textarea[name='qualityOpinion']").val()==undefined||$("textarea[name='qualityOpinion']").val()==""||$("textarea[name='qualityOpinion']").val()==null)){
                        alert("质检不合格时选择错误类型或填写审核意见！");
                    }
                    else{
                        if(markinfo.operationCase==32){
                            savedata();
                        }
                        quality.save(3,$(this));
                    }
                  });
                  $("#do-quality-modify_qualified").click(function(){
                    var chk_value =[];//定义一个数组
                    $("input[name='qualityProperty']:checked").each(function(){//遍历每一个名字为interest的复选框，其中选中的执行函数
                        chk_value.push($(this).val());//将选中的值添加到数组chk_value中
                    });
                    if(chk_value.length!=0){
                        alert("质检修改通过时不允许选择错误类型！");
                    }else if($("textarea[name='qualityOpinion']").val()!=undefined && $("textarea[name='qualityOpinion']").val()!= "" && $("textarea[name='qualityOpinion']").val()!=null){
                        alert("质检修改通过时不允许填写审核意见！");
                    }
                    else{
                        if(markinfo.operationCase==32){
                            savedata();
                        }
                        quality.save(2,$(this));
                    }
                  });
                });
              }
                
              //质检判断
              //被质检人员标记为合格的记录不允许质检人员和标注人员进行修改，只允许查看
              if ($("form[id='markForm'] div").hasClass("seal seal-success")) {
                $("#do-quality-qualified").attr("disabled",true);
                $("#do-quality-substandard").attr("disabled",false);
                $("#do-quality-modify_qualified").attr("disabled",true);
              }else if($("form[id='markForm'] div").hasClass("seal seal-danger")){
                //标记为不合格的数据
                $("#do-quality-qualified").attr("disabled",false);
                $("#do-quality-substandard").attr("disabled",false);
                $("#do-quality-modify_qualified").attr("disabled",false);
              }else{
                //标记为待审核的数据
                $("#do-quality-qualified").attr("disabled",false);
                $("#do-quality-substandard").attr("disabled",false);
                $("#do-quality-modify_qualified").attr("disabled",true);
                $(".ui-shape").attr("disabled", true);
              }
                
                $(".dwa-loading").hide();
        },
        
       
        getFormSerizlize: function () {
            var form = {};
            form.img = $sourceImg;
            form.effective = $("[name='effective']:checked").val();
            form.boxs = [];
            var boxCount = 0,Pedestrians = 0,Car=0,Traffic_light=0,Traffic_sign=0,Ban_sign=0,Other=0;
            if (form.effective=="1") {
                var shapes = $shape.getShapes();
                $(shapes).each(function (i, shape) {
                    var t = $("#" + shape.id).data("type");
                    var text = document.getElementById(shape.id).getAttribute("title");
                    var light_id = $("#" + shape.id).data("light_id");
                    var f = $("#" + shape.id).data("fujia");
                    var z = $("#" + shape.id).data("cont");
                    var z_c = $("#" + shape.id).data("light_color");
                    var val1=$("#" + shape.id + "").data("val1");
                    var val_data=$("#" + shape.id + "").data("val_data");
                    var val_data1=$("#" + shape.id + "").data("val_data1");
                    var misc_type=$("#" + shape.id + "").data("misc_type");
                    var shade =$("#" + shape.id + "").data("shade");
                    var cut =$("#" + shape.id + "").data("cut");
                    switch(val1){
                      case "Pedestrians":
                        Pedestrians++;
                        break;
                      case "Car":
                        Car++;
                        break;
                      case "Traffic_light":
                        Traffic_light++;
                        break;
                      case "Traffic_sign":
                        Traffic_sign++;
                        break;
                      case "Ban_sign":
                        Ban_sign++;
                        break;
                      case "Other":
                        Other++;
                        break;
                      default:
                        break;
                    }
                    form.boxs.push({
                            id: shape.id,
                            type: t,
                            title: text,
                            fujia: f,
                            light_id:light_id,
                            cont: z,
                            val1:val1,
                            val_data:val_data,
                            val_data1:val_data1,
                            light_color:z_c,
                            misc_type:misc_type,
                            shade:shade,
                            cut:cut,
                            content:t,
                            x: shape.x,
                            y: shape.y,
                            w: shape.w,
                            h: shape.h
                            
                        });
                });
                //工作量
                form.Workload = {
                  boxCount: form.boxs.length,
                  Pedestrians:Pedestrians,
                  Car:Car,
                  Traffic_light:Traffic_light,
                  Traffic_sign:Traffic_sign,
                  Ban_sign:Ban_sign,
                  Other:Other
                };
            }else{
                //工作量
                form.Workload = { };
            }       
            return form;
        },
        qualityForm: function () {
            /// <summary>
            /// 质检表单
            /// </summary>
            /// <returns type=""></returns>

            return [
                { sort: 1, value: "有未框选" },
                { sort: 2, value: "框选错误" },
                { sort: 3, value: "场景信息错误" },
                { sort: 4, value: "其他错误" },
                { sort: 5, value: "有效性错误" },
                { sort: 6, value: "文本错误" },
                { sort: 7, value: "框不贴合" },
                { sort: 8, value: "多标" },
                { sort: 9, value: "漏标" }
            ];
        }
    }
});
