ARCGIS路径说明
由于调用arcgis的页面是加载在iframe中，所以可能会出现找不到某些文件的情况，如 'esri.nls.jsapi_zh-cn.js'
这时候需要打开init.js
搜索'js/lib/arcgis/dojo'
将其改为合理的路径