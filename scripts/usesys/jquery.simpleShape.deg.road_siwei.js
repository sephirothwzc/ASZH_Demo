(function ($, undefined) {
    var $currentMouseKeyCode = 0;
    var $firstZoomed = false;
    var _imgInfo = null;
    var $currentCoords = {
        x: 0,
        y: 0
    };
    var _selectedShape = {
        x: 0,
        y: 0,
        w: 0,
        h: 0
    };

    var zoomRate = 1;
    var oldZoom = 1;
    var mouseDownActive = false;

    var _creating = false;

    //开始拖拽
    var iviewer_StartDrag = function (code, mouseCoords) {

        //只允许按住“空格键”的时候才能够移动
        if (32 !== $currentMouseKeyCode) {
            return false;
        }
    }

    //结束缩放
    var iviewer_AfterZoom = function (e, newZoom) {
        //首次缩放
        if (false === $firstZoomed) {
            $firstZoomed = true;
        }

        setWorkPlaceStyle();

        zoomRate = (newZoom / 100);
        zoomCanvas(zoomRate);
    }

    //图片加载完成
    var iviewer_FinishLoad = function (code, imgObject) {

        setWorkPlaceStyle();
    }

    //缩放事件
    var iviewer_onZoom = function (code, newZoom) {
        
    }

    //鼠标移动时
    var iviewer_onMouseMove = function (e, coords) {
        $currentCoords = coords;
    }

    //拖拽事件
    var iviewer_onDrag = function (e, coords) {
        //setWorkPlaceStyle();
    }

    //设置工作区域大小
    var setWorkPlaceStyle = function () {
        if (_imgInfo === null) {
            _imgInfo = $("#viewer").find("img").first();
        }

        $("#workPlace,#workCanvas").attr("style", function () {
            return _imgInfo.attr("style").replace("transform","transform1");
        });

        $("#workCanvas").css("position", "relative");
    }

    //停止拖拽
    var iviewer_onStopDrag = function (e, coords) {
        setWorkPlaceStyle();
    }

    //进行缩放
    var zoomCanvas = function (zoomRate) {
        var shapes = _getShapes();
        var html = '';

        $(shapes).each(function (i, shape) {
            $("#" + shape.id).css({
                "left": shape.left + "px",
                "top": shape.top + "px",
                "height": shape.height + "px",
                "width": shape.width + "px"
            });
        });
    }

    function _getShapes() {
        var shapes = [];
        $(".ui-shape").each(function (i) {

            var style = $(this).attr("style");

            var wStryle = style.substring(style.indexOf('width:'));
            var w = wStryle.substring(6, wStryle.indexOf('px'));

            var hStryle = style.substring(style.indexOf('height:'));
            var h = hStryle.substring(7, hStryle.indexOf('px'));

            var tStryle = style.substring(style.indexOf('top:'));
            var t = tStryle.substring(4, tStryle.indexOf('px'));

            var lStryle = style.substring(style.indexOf('left:'));
            var l = lStryle.substring(5, lStryle.indexOf('px'));

            shapes.push({
                id: $(this).attr("id"),
                html: $(this).html(),
                width: (parseFloat(w) / oldZoom) * zoomRate,
                height: (parseFloat(h) / oldZoom) * zoomRate,
                left: parseFloat(l) / oldZoom * zoomRate,
                top: parseFloat(t) / oldZoom * zoomRate
            });
        });

        oldZoom = zoomRate;

        return shapes;
    }

    var defaults = {
        "src": "http://pic.chunji.cn/allimg/c140516/1400196305460-11F8.jpg",
        "onDrawed": jQuery.noop,
        "onRemoved": jQuery.noop,
        "onFinishLoad": jQuery.noop,
        "onZoomAfter": jQuery.noop,
        "onResizeEnd":jQuery.noop,
        "onDragEnd":jQuery.noop,
        "minWidth": 5,
        "minHeight": 5,
        "zoom": "fit"
    }

    var shapeMax = 0;

    //矩形Id
    var _getRectangleObjectId = function () {
        $(".ui-shape").each(function (i) {
            var id = parseInt($(this).attr("id").replace("ui-rect-", ""));
            if (id > shapeMax) {
                shapeMax = id + 1;
            }
        });

        //临时防止重复
        var id = "ui-rect-" + (shapeMax);
        if ($("#" + id).length > 0) {
            shapeMax++;
        }

        return "ui-rect-" + (shapeMax);
    }

    var _getRectangleLastObjectId = function () {
        return "ui-rect-" + shapeMax;
    }

    //创建矩形
    var _createRectangle = function (objId) {

        var id = "";
        if (arguments[0] != null) {
            id = objId;
        } else {
            id = _getRectangleObjectId();
        }

        $("<div>", {
            'class': "ui-shape",
            'style': "z-index:" + $(".ui-shape").length + "",
            'id': id
        }).appendTo($("#workCanvas"));

        return $("#" + id);
    }


    $.fn.simpleShape = function (options) {
        options = $.extend(defaults, options);
        var self = this;
        //绑定自定义事件
        $(this)
			.bind("onDrawed", defaults.onDrawed)
			.bind("onRemovStart", defaults.onRemovStart)
			.bind("onRemoved", defaults.onRemoved)
			.bind("onFinishLoad", defaults.onFinishLoad)
			.bind("onAfterZoom", defaults.onAfterZoom)
			.bind("onStopDrag", defaults.onStopDrag)
            .bind("onResizeEnd",defaults.onResizeEnd)
            .bind("onDragEnd",defaults.onDragEnd)
			.bind("onSpace", defaults.onSpace);

        $(this).append('<div id="workCanvas"></div><div id="workPlace"></div>');

        $(document).keydown(function (e) {
        	var removeRect = function(){
        		var actived = $("#workCanvas .actived");
                if (actived.length == 0) {
                    return;
                }

                //准备删除
                var confirm = self.trigger("onRemovStart", actived);

                if (confirm) {
                    //删除
                    actived.remove();
                }

                //触发删除事件
                self.trigger("onRemoved", actived);
        	}
            switch (e.keyCode) {
                case 32:
					$currentMouseKeyCode = e.keyCode;
					e.preventDefault();
					break;
                case 18:break;
                case 160:
                    {
                        if (e.target.type === "text") {
                            break;
                        }
                        //禁止默认行为。
                        e.preventDefault();
                        //停止事件冒泡。
                        e.stopPropagation();
                    }
					//设置当前键盘值。
		            $currentMouseKeyCode = e.keyCode;
                    break;
                case 46:
                    {
                		//removeRect();
                    }
                    break;
                case 8:
	                {
	            		//removeRect();
	                }
					break;
                default:
                    break;
            }
			self.trigger("onSpace", $currentMouseKeyCode);
        }).keyup(function (e) {
            $currentMouseKeyCode = 0;
			self.trigger("onSpace", $currentMouseKeyCode);
        });

        //初始化 iviewer
        $(this).iviewer({
            src: options.src,
            zoom:options.zoom,
            onZoom: iviewer_onZoom,
            onAfterZoom: function(e, newZoom){
				iviewer_AfterZoom(e, newZoom);
                self.trigger('onAfterZoom', newZoom);
			},
            onFinishLoad: function () {
                iviewer_FinishLoad();
                self.trigger('onFinishLoad');
            },
            onStartDrag: iviewer_StartDrag,
            onStopDrag: function(e, coords){
				iviewer_onStopDrag(e, coords);
				self.trigger('onStopDrag', coords);
			},
            onDrag: iviewer_onDrag,
            onMouseMove: iviewer_onMouseMove
        });


        //画图
        (function () {
            var defaultLeft = 0;
            var defaultTop = 0;
            var mouseDownCoords = {
                x: 0,
                y: 0
            };
            var _width = 0;
            var _height = 0;

            var model = '';

            //鼠标移动事件
            var mousemove = function (e) {
                if ($(".resize-active").length > 0) {
                    model = "resize";
                }

                switch (model) {
                    case "draw":
                        _createRectangle();
                    case "drawing":
                        _drawShape(e);
                        break;
                    case "resize":
                        _resizeShape(e);

                        // 触发调整大小完毕事件
                        self.trigger('onResizeEnd');
                        break;
                    case "drag":
                        _activedMove(e);

                        // 触发移动完毕事件
                        self.trigger('onDragEnd');
                        break;
                    default:
                        break;
                }
            }

            //调整形状大小
            var _resizeShape = function (e) {
                var shape = $(".resize-active").parent();
                var me = $(".resize-active");

                var left = _selectedShape.x;
                var top = _selectedShape.y;
                var width = _selectedShape.w;
                var height = _selectedShape.h;

                var newW = width + ($currentCoords.x * zoomRate - (width + left));
                var newH = height + ($currentCoords.y * zoomRate - (height + top));
                var newT = $currentCoords.y;
                var newL = $currentCoords.x;

                if (me.hasClass('cd-right-bottom')) {
                    //右下角
                    width = newW;
                    height = newH;

                    if (width < 0) {
                        left = $currentCoords.x * zoomRate;
                        width = Math.abs(width);
                    }

                    if (height < 0) {
                        height = Math.abs(height);
                        top = $currentCoords.y * zoomRate;
                    }

                } else if (me.hasClass('cd-left-bottom')) {
                    //左下角
                    newW = width + (left - newL * zoomRate);
                    newL = newL * zoomRate;

                    width = newW;
                    height = newH;
                    left = newL;

                    if (width < 0) {
                        left = _selectedShape.w + _selectedShape.x;
                        width = Math.abs(width);
                    }

                    if (height < 0) {
                        height = Math.abs(height);
                        top = $currentCoords.y * zoomRate;
                    }

                } else if (me.hasClass('cd-right-top')) {
                    //右上角
                    newH = height + (top - newT * zoomRate);
                    newT = newT * zoomRate;

                    width = newW;
                    height = newH;
                    top = newT;

                    if (height < 0) {
                        height = Math.abs(height);
                        top = _selectedShape.h + _selectedShape.y;
                    }

                    if (width < 0) {
                        left = $currentCoords.x * zoomRate;
                        width = Math.abs(width);
                    }

                } else if (me.hasClass('cd-left-top')) {
                    //左上角

                    newW = width + (left - newL * zoomRate);
                    newH = height + (top - newT * zoomRate);

                    newL = newL * zoomRate;
                    newT = newT * zoomRate;

                    width = newW;
                    height = newH;
                    top = newT;
                    left = newL;

                    if (width < 0) {
                        left = _selectedShape.w + _selectedShape.x;
                        width = Math.abs(width);
                    }

                    if (height < 0) {
                        height = Math.abs(height);
                        top = _selectedShape.h + _selectedShape.y;
                    }

                } else if (me.hasClass("cd-left")) {
                    newW = width + (left - newL * zoomRate);
                    newL = newL * zoomRate;

                    width = newW;
                    left = newL;

                    if (width < 0) {
                        left = _selectedShape.w + _selectedShape.x;
                        width = Math.abs(width);
                    }
                } else if (me.hasClass("cd-right")) {
                    width = newW;

                    if (width < 0) {
                        left = $currentCoords.x * zoomRate;
                        width = Math.abs(width);
                    }

                } else if (me.hasClass("cd-top")) {
                    //上
                    newH = height + (top - newT * zoomRate);
                    newT = newT * zoomRate;

                    height = newH;
                    top = newT;

                    if (height < 0) {
                        height = Math.abs(height);
                        top = _selectedShape.h + _selectedShape.y;
                    }

                } else if (me.hasClass("cd-bottom")) {
                    //下
                    height = newH;

                    if (height < 0) {
                        height = Math.abs(height);
                        top = $currentCoords.y * zoomRate;
                    }
                }

                var imgHeight = _imgInfo.height();
                var imgWidth = _imgInfo.width();

                //宽度超出
                if ($currentCoords.x * zoomRate > imgWidth) {
                    width = imgWidth - left;
                }

                //当高度超出
                if ($currentCoords.y * zoomRate > imgHeight) {
                    height = imgHeight - top;
                }

                //当顶部超出
                if (top < 0) {
                    top = 0;
                    height = height - (top - $currentCoords.y * zoomRate);
                }

                //左侧超出
                if (left < 0) {
                    left = 0;
                    width = width - (left - $currentCoords.x * zoomRate);
                }

                shape.css({
                    "left": left + "px",
                    "top": top + "px",
                    "width": width + "px",
                    "height": height + "px"
                });
            }

            //绘制形状
            var _drawShape = function (e) {
                //只有在按下鼠标的情况下才进行移动事件的处理。
                if (mouseDownActive == false) {
                    return;
                }

//                $(".ui-shape").css("z-index", "10");

                var imgHeight = _imgInfo.height();
                var imgWidth = _imgInfo.width();

                var imgOrgHeight = imgHeight / zoomRate;
                var imgOrgWeight = imgWidth / zoomRate;

                //获取当前的矩形，默认是最后一个
                var currentRect = self.getLastShape();
                var left = mouseDownCoords.x;
                var top = mouseDownCoords.y;


                //右侧大于图片宽度
                if (mouseDownCoords.x > imgOrgWeight) {
                    left = imgOrgWeight - 1;
                    _width = 0;

                    if ($currentCoords.x < imgOrgWeight) {
                        _width = $currentCoords.x - imgOrgWeight;
                        //左侧超出
                        if ($currentCoords.x < 0) {
                            //设置为图片宽度
                            _width = imgOrgWeight;
                            //左边距0
                            left = 0;
                        }
                    }
                } else {
                    _width = $currentCoords.x - mouseDownCoords.x;
                }

                if (left <= 0 && _width < 0) {
                    _width = 0;
                }

                if (left > 0 && _width < 0) {
                    left = left + _width;
                }


                _height = $currentCoords.y - mouseDownCoords.y;


                //右侧大于图片宽度
                if (mouseDownCoords.y > imgOrgHeight) {
                    top = imgOrgHeight;
                    _height = 0;

                    if ($currentCoords.y < imgOrgHeight) {
                        _height = $currentCoords.y - imgOrgHeight;
                        //左侧超出
                        if ($currentCoords.y < 0) {
                            //设置为图片宽度
                            _height = imgOrgHeight;
                            //左边距0
                            top = 0;
                        }
                    }
                } else {
                    _height = $currentCoords.y - mouseDownCoords.y;
                }

                if (top <= 0 && _height < 0) {
                    _height = 1;
                }
                if (top > 0 && _height < 0) {
                    top = top + _height;
                }

                _width = Math.abs(_width) * zoomRate;
                _height = Math.abs(_height) * zoomRate;
                top = top * zoomRate;
                left = left * zoomRate;

                if (_height > imgHeight) {
                    _height = imgHeight;
                }

                if (_width > imgWidth) {
                    _width = imgWidth;
                }

                //宽度超出
                if ($currentCoords.x * zoomRate > imgWidth) {
                    _width = imgWidth - mouseDownCoords.x * zoomRate;
                }

                //当高度超出
                if ($currentCoords.y * zoomRate > imgHeight) {
                    _height = imgHeight - mouseDownCoords.y * zoomRate;
                }

                //当顶部超出
                if (top < 0) {
                    top = 0;
                    _height = mouseDownCoords.y * zoomRate;
                }

                //左侧超出
                if (left < 0) {
                    left = 0;
                    _width = mouseDownCoords.x * zoomRate;
                }

                currentRect.css({
                    "width": _width.toFixed(2) + "px",
                    "height": _height.toFixed(2) + "px",
                    "left": left + "px",
                    "top": top + "px",
                    "z-index": "999"
                });

                model = "drawing";
                if (_creating == false) {
                    _creating = true;
                }
            }

            //移动形状
            var _activedMove = function (e) {

                var selectedShape = $(".actived").first();

                if ($(".resize-active").length > 0 || selectedShape == null) {
                    return;
                }

                $(".ui-shape").removeClass("drag");
                selectedShape.addClass("drag");

                var moveResult = moveDistance(_selectedShape.x, _selectedShape.y, mouseDownCoords, $currentCoords);

                if (moveResult.x < 0) {
                    moveResult.x = 0;
                }

                if (moveResult.y < 0) {
                    moveResult.y = 0;
                }

                if (moveResult.y > (_imgInfo.height() - _selectedShape.h)) {
                    moveResult.y = (_imgInfo.height() - _selectedShape.h);
                }

                if (moveResult.x > (_imgInfo.width() - _selectedShape.w)) {
                    moveResult.x = (_imgInfo.width() - _selectedShape.w);
                }

                if (mouseDownActive) {
                    selectedShape.css({
                        "left": moveResult.x + "px",
                        "top": moveResult.y + "px"
                    });
                }
            }

            //鼠标释放事件
            var mouseup = function (e) {
                //释放鼠标
                mouseDownActive = false;

                if (model == "") {
                    return;
                }

                //获取当前的矩形，默认是最后一个
                var currentRect = self.getLastShape();
//                currentRect.css("z-index", "10");
                _width = currentRect.width();
                _height = currentRect.height();

                switch (model) {
                    case "drawing":
                        if (_width < options.minWidth || _height < options.minHeight) {
                            currentRect.remove();
                            break;
                        }

                        if (_creating) {
                            //触发绘制完成事件。
                            self.trigger('onDrawed', currentRect);

                            //形状索引+1;
                            shapeMax++;
                        }

                        _creating = false;
                        break;
                    case "resize":
                        $(".cd-resize-point").removeClass("resize-active");
                        break;
                    case "drag":
                        $(".ui-shape").removeClass("drag");
                        break;
                    default:
                }

                _width = 0;
                _height = 0;
                model = "";
            }

            //鼠标按下事件
            var mousedown = function (e) {
                mouseDownActive = true;
                //记录初始坐标，起点
                mouseDownCoords.x = $currentCoords.x < 0 ? 0 : $currentCoords.x;
                mouseDownCoords.y = $currentCoords.y < 0 ? 0 : $currentCoords.y;
            }
            
            //矩形绑定事件
            $("#workCanvas").on({
                "mouseup": function (e) {
                    mouseup(e);
                },
                "mousedown": function (e) {
                    if ($currentMouseKeyCode == 0) {
                        mousedown(e);
                    }
                },
                "mousemove": function (e) {
                    mousemove(e);
                },
                "mouseenter": function () {
                    $(this).addClass("hover");
                },
                "mouseleave": function () {
                    $(this).removeClass("hover");
                },
                "click": function (e) {
                	e.stopPropagation();
                    if ($currentMouseKeyCode > 0) {
                        return;
                    }
                    $(".ui-shape").removeClass("actived");
                    $(".cd-resize-point").remove();

                    $(this).addClass("actived").append(function () {
                        var htmls = [];
                        htmls.push('<a class="cd-resize-point cd-left-top"></a>');
                        htmls.push('<a class="cd-resize-point cd-right-top"></a>');
                        htmls.push('<a class="cd-resize-point cd-left-bottom"></a>');
                        htmls.push('<a class="cd-resize-point cd-right-bottom"></a>');
                        htmls.push('<a class="cd-resize-point cd-right"></a>');
                        htmls.push('<a class="cd-resize-point cd-left"></a>');
                        htmls.push('<a class="cd-resize-point cd-top"></a>');
                        htmls.push('<a class="cd-resize-point cd-bottom"></a>');

                        return htmls.join('');
                    });

                    model = "moveShape";
                }
            }, ".ui-shape", null);

            //活动矩形绑定事件
            $("#workCanvas").on({
                "mousedown": function (e) {
                    if ($currentMouseKeyCode == 0) {
                        _selectedShape.x = parseFloat($(this).css("left"));
                        _selectedShape.y = parseFloat($(this).css("top"));
                        _selectedShape.w = parseFloat($(this).css("width"));
                        _selectedShape.h = parseFloat($(this).css("height"));

                        model = "drag";
                    }

                    //禁止默认行为。
                    e.preventDefault();
                    //停止事件冒泡。
                    e.stopPropagation();
                }
            }, ".actived", null);

            //调整大小事件
            $("#workCanvas").on({
                "mousedown": function () {
                    if ($currentMouseKeyCode == 0) {
                        $(this).addClass("resize-active");
                        $(this).parent().removeClass("drag");
                    }
                },
                "mouseup": function () {
                    $(this).removeClass("resize-active");
                }
            }, ".cd-resize-point", null);

            $("#workPlace").on({
                "mousedown": function (e) {
                	self.clearActived();
                	//$('.ui-shape').show();
				    if ($currentMouseKeyCode == 0) {
                        mousedown(e);
                        model = "draw";
                    }
                },
                "mouseup": function (e) {
                    mouseup(e);
                },
                "mousemove": function (e) {
                    if ($currentMouseKeyCode == 0) {
                        mousemove(e);
                    }
                },
                "click": function (e) {
                    var targetObj = $(e.target);
                    if (targetObj.hasClass("ui-shape") == false) {
                        self.clearActived();

                        model = "moveShape";
                    }
                }
            });

        })();


        this.getActivedShape = function () {
            /// <summary>
            /// 
            /// </summary>
            /// <returns type=""></returns>

            return $(".ui-shape.actived");
        }

        this.getLastShape = function () {
            /// <summary>
            /// 
            /// </summary>
            /// <returns type=""></returns>

            return $(".ui-shape").last();
        }

        this.clearActived = function () {
            /// <summary>
            /// 
            /// </summary>
            /// <returns type=""></returns>

            $(".ui-shape").removeClass("actived");
            $(".cd-resize-point").remove();
        }

        this.getShapes = function () {
            /// <summary>
            /// 获取所有形状
            /// </summary>
            /// <returns type="">shapes array</returns>

            var shapes = [];

            $(".ui-shape").each(function (i) {

                var style = $(this).attr("style");
                var wStryle = style.substring(style.indexOf('width:'));
                var w = wStryle.substring(6, wStryle.indexOf('px'));

                var hStryle = style.substring(style.indexOf('height:'));
                var h = hStryle.substring(7, hStryle.indexOf('px'));

                var tStryle = style.substring(style.indexOf('top:'));
                var t = tStryle.substring(4, tStryle.indexOf('px'));

                var lStryle = style.substring(style.indexOf('left:'));
                var l = lStryle.substring(5, lStryle.indexOf('px'));

                shapes.push({
                    id: $(this).attr("id"),
                    obj: $(this),
                    w: (parseFloat(w) / zoomRate),
                    h: (parseFloat(h) / zoomRate),
                    x: (parseFloat(l) / zoomRate),
                    y: (parseFloat(t) / zoomRate)
                });
            });

            return shapes;
        }

        this.drawShape = function (x, y, w, h, shapeId, func) {
            /// <summary>
            /// 绘制形状
            /// </summary>
            /// <param name="x"></param>
            /// <param name="y"></param>
            /// <param name="w"></param>
            /// <param name="h"></param>
            /// <param name="shapeId"></param>
            /// <param name="func"></param>
            /// <returns type=""></returns>

            shapeMax++;

            //这种赋值方法不精确
            //shape.width((w * zoomRate - 2).toFixed(2) + "px");
            //shape.height((h * zoomRate - 2).toFixed(2) + "px");
            //shape.css("left", (x * zoomRate).toFixed(2) + "px");
            //shape.css("top", (y * zoomRate).toFixed(2) + "px");

            //console.log(w, zoomRate, parseFloat(w * zoomRate));

            var shape = _createRectangle(shapeId);
            var styleStr = "width:" + parseFloat(w * zoomRate) + "px;height:" + parseFloat(h * zoomRate) + "px;top:" + (parseFloat(y) * zoomRate) + "px;left:" + (parseFloat(x) * zoomRate) + "px";

            shape.attr("style", styleStr);

            if (func) {
                func(shape);
            }
        }

        return this;
    }

    function moveDistance(l, t, downCoords, moveCoords) {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="l"></param>
        /// <param name="t"></param>
        /// <param name="downCoords"></param>
        /// <param name="moveCoords"></param>

        var left = moveCoords.x - downCoords.x;
        var top = moveCoords.y - downCoords.y;

        return {
            x: parseFloat(l) + left * zoomRate,
            y: parseFloat(t) + top * zoomRate
        };
    }

})(jQuery, undefined);