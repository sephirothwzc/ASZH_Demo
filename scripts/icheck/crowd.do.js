(function () {
	if (!window.crowd) {
		window.crowd = {};
	}

	if (!window.crowd.dataMark) window.crowd.dataMark = function () {
		var extensions = {};

		var obj = {};

		obj.dataResult = null;
		obj.useIcheck = true;
		obj.runExtension = function (action, vars, returnArray) {
			/// <summary>
			/// 运行扩展插件
			/// </summary>
			/// <param name="action"></param>
			/// <param name="vars"></param>
			/// <param name="returnArray"></param>

			var result = null;
			if (returnArray) { result = []; }
			$.each(extensions, function (name, opts) {
				if (action in opts) {
					if (returnArray) {
						result.push(opts[action](vars))
					} else {
						result = opts[action](vars);
					}
				}
			});

			return result;
		};

		obj.addExtension = function (name, ext_func) {
			/// <summary>
			/// 加入扩展插件
			/// </summary>
			/// <param name="name" type="String">插件名称，这里必须唯一</param>
			/// <param name="ext_func" type="Function">插件函数对象</param>

			if (!(name in extensions)) {
				// Provide private vars/funcs here. Is there a better way to do this?
				var ext;
				if ($.isFunction(ext_func)) {
					ext = ext_func();
				}

				extensions[name] = ext;
				//call("extension_added", ext);
			} else {
				console.log('Cannot add extension "' + name + '", an extension by that name already exists"');
			}
		};

		obj.getMarkInfo = function () {
		    return __markInfo;
		};

		obj.getFileUrl = function (useParams) {
		    /// <summary>
		    /// 根据 __markInfo.FileName 获取文件的全路径
		    /// </summary>
		    /// <returns type=""></returns>

		    //var url = "http://cs-file.datatang.com/file/" + __markInfo.source_key;
		    //if (useParams) {
		    //    url = "http://cs-file.datatang.com/file/?filename=" + __markInfo.source_key;
		    //}
		    //return url;
		    return this.getFile(__markInfo.FileName);		   
		};

		obj.getFile = function (fileName) {
		    /// <summary>
		    /// 根据参数中的文件名来获取完整文件路径
		    /// </summary>
		    /// <returns type=""></returns>		   
		    var _filename = fileName;
		    if (_filename.indexOf("http:/") > -1 || _filename.indexOf("https:/") > -1) {
		        return _filename;  //.replace("https://", "http://").replace(":443/", "/");
		    }
		    else {
		       
		        if (_filename.indexOf("\\\\") > 0)
		            _filename = _filename.replace("\\\\", "/");
		        //var url = "http://crowd-file.datatang.com/{0}/{1}".replace("{0}", __markInfo.projectId).replace("{1}", _filename);
		        var url = "http://crowdfile.blob.core.chinacloudapi.cn/{0}/{1}".replace("{0}", __markInfo.projectId).replace("{1}", _filename);
		        return url;		       
		    }		   
		};		

		obj.getCrowdFilePrefix = function () {
		    //获取文件存储前缀
		    //return "http://file.crowd.datatang.com";
		    return "http://crowdfile.blob.core.chinacloudapi.cn";
		}

		obj.getCrowdFilePrefix2 = function () {
            //获取香港blob地址前缀
		    return "http://datatang2.blob.core.windows.net"
		}

		obj.getCrowdFileCdnPrefix = function () {
		    //获取文件存储CDN前缀
		    return "http://cdn.file.crowd.datatang.com";
		}

		obj.getCrowdCdnPrefix = function () {
            //获取资源文件cdn前缀
		    return "http://cdn.crowd.datatang.com";
		}

		obj.getUseIcheck = function () {
		    return this.useIcheck;
		};

		obj.setResult = function (json) {
		    this.dataResult = json;
		};

		return obj;
	}();

})();