Array.prototype.in_array = function (e) {
	for (i = 0; i < this.length && this[i] != e; i++);
	return !(i == this.length);
}

String.prototype.format = function (args) {
	var result = this;
	if (arguments.length > 0) {
		if (arguments.length == 1 && typeof (args) == "object") {
			for (var key in args) {
				if (args[key] != undefined) {
					var reg = new RegExp("({" + key + "})", "g");
					result = result.replace(reg, args[key]);
				}
			}
		}
		else {
			for (var i = 0; i < arguments.length; i++) {
				if (arguments[i] != undefined) {
					//var reg = new RegExp("({[" + i + "]})", "g");//这个在索引大于9时会有问题，谢谢何以笙箫的指出
					var reg = new RegExp("({)" + i + "(})", "g");
					result = result.replace(reg, arguments[i]);
				}
			}
		}
	}
	return result;
}

String.prototype.trimStart = function (trimStr) {
	if (!trimStr) { return this; }
	var temp = this;
	while (true) {
		if (temp.substr(0, trimStr.length) != trimStr) {
			break;
		}
		temp = temp.substr(trimStr.length);
	}
	return temp;
};

String.prototype.trimEnd = function (trimStr) {
	if (!trimStr) { return this; }
	if (this.indexOf(trimStr) > 0 == false)
		return this;

	var temp = this;
	while (true) {
		if (temp.substr(temp.length - trimStr.length, trimStr.length) != trimStr) {
			break;
		}
		temp = temp.substr(0, temp.length - trimStr.length);
	}
	return temp;
};

String.prototype.trim = function (trimStr) {
	if (this.indexOf(trimStr) > 0 == false)
		return this;

	var temp = trimStr;
	if (!trimStr) { temp = " "; }
	return this.trimStart(temp).trimEnd(temp);
};

/**
 * 将表单对象转为json对象
 * @param formValues
 * @returns
 */
Array.prototype.toJson = function () {
    var result = {};
    for (var formValue, j = 0; j < this.length; j++) {
        formValue = this[j];
        var name = formValue.name;
        var value = formValue.value;
        if (name.indexOf('.') < 0) {
            result[name] = value;
            continue;
        } else {
            var simpleNames = name.split('.');
            // 构建命名空间
            var obj = result;
            for (var i = 0; i < simpleNames.length - 1; i++) {
                var simpleName = simpleNames[i];
                if (simpleName.indexOf('[') < 0) {
                    if (obj[simpleName] == null) {
                        obj[simpleName] = {};
                    }
                    obj = obj[simpleName];
                } else { // 数组
                    // 分隔
                    var arrNames = simpleName.split('[');
                    var arrName = arrNames[0];
                    var arrIndex = parseInt(arrNames[1]);
                    if (obj[arrName] == null) {
                        obj[arrName] = []; // new Array();
                    }
                    obj = obj[arrName];
                    multiChooseArray = result[arrName];
                    if (obj[arrIndex] == null) {
                        obj[arrIndex] = {}; // new Object();
                    }
                    obj = obj[arrIndex];
                }
            }

            if (obj[simpleNames[simpleNames.length - 1]]) {
                var temp = obj[simpleNames[simpleNames.length - 1]];
                obj[simpleNames[simpleNames.length - 1]] = temp;
            } else {
                obj[simpleNames[simpleNames.length - 1]] = value;
            }

        }
    }
    return result;
}

//var _bdhmProtocol = (("https:" == document.location.protocol) ? " https://" : " http://");
//document.write(unescape("%3Cscript src='" + _bdhmProtocol + "hm.baidu.com/h.js%3F536d7fef85c229c93954594caf2f16b6' type='text/javascript'%3E%3C/script%3E"));
