let newb = "4.7";
let 日期 = "2024-07-10";
let 内容= "1. 修复更新问题。";
[{
"版本": "5.4",
"日期": "2024-10-10",
"内容": "1. 添加 小说、漫画、听书 类型。\n2. 除了 影视、动漫、短剧 类型，解析失败不会再跳转嗅探。\n3. 更换失效仓库。"
}, {
"版本": "5.3",
"日期": "2024-08-03",
"内容": "1. 添加轮播图开关，检测失效源开关。\n2. 添加网盘类型。\n3. 修复轮播图滚动时，图片对不齐边框。\n4. 重写自适应大小屏方法，之前用软件自带的方法，下方会出现空白，现在应是修复了。\n5. 修复搜索部分站点转二级bug。\n6. 修复首页图标错乱。\n7. 调整轮播图下方指示条颜色。\n8. 调整首页切换分类到换源列表，方便切换。\n9. 优化二级选集列表写样式，可写选集详(desc)。"
}, {
"版本": "5.2",
"日期": "2024-07-29",
"内容": "1. 增加首页轮播图，写源时自行选择是否写轮播图列表，默认轮播列表1图片。\n2. 二级选集列表增加写入样式。\n3. 修复导入源时，提示导入新规则bug。\n4. 优化失效源判定，访问3次不成功或数据错误即判定失效源。\n5. 修复新窗口点击影源管理无法打开。\n6. 影源管理中失效类标注失效原因。\n7. 调整二级顶部字体颜色，以适应新版本。"
}, {
"版本": "5.1",
"日期": "2024-07-22",
"内容": "1. 修复上个版本更新后，首页报错、导入报错。"
}, {
"版本": "5.0",
"日期": "2024-07-21",
"内容": "1. 添加私有类型，设置-关于风影-左上角空白处长按开启。\n2. 增加 排除、包含 嗅探视频关键字符。\n3. 修复影源管理 移动位置bug。\n4. 修复影视类型中出现短剧的bug。\n5. 测试时，二级不再带缓存，免嗅不会自动跳转嗅探。\n6. 修复首页免嗅。"
}, {
"版本": "4.9",
"日期": "2024-07-17",
"内容": "1. 添加调用云盘简播放云盘资源，可写云盘规则了。\n2. 导入多条源时，增加检测风影是否为最新版。\n3. 添加部分源需要点击播放才能嗅探的代码入口。\n4. 修复切换类型bug。\n5. 修复免嗅调用bug。\n6. 修复部分链接嗅探失败问题。\n7. 修复发布页域名更换失败问题。\n8. 优化无页面时的错误提示。"
}, {
"版本": "4.8",
"日期": "2024-07-13",
"内容": "1. 增加源类型，首页长按选源图标切换类型，搜索页点击类型切换，影源管理分类，方便管理。\n2. 增加失效源检测，使用过程中，会自动标注失效源。\n3. 导入确认页增加失效源标注。\n4. 写源页添加开发助手调用，方便写源。\n5. 修改JS源数字验证时，需自行写入判断关键字。\n6. 优化显示问题。\n7. 优化搜索页面，竖列排版时，标注搜索关键词。"
}, {
"版本": "4.7",
"日期": "2024-07-10",
"内容": "1. 修复更新问题。\n2. 优化二级选集显示。"
}, {
"版本": "4.6",
"日期": "2024-07-09",
"内容": "1. JS源加入调用内置数字验证(需手动输入数字验证，自动验证没找到免费的OCR)。\n2. 搜索页增加长按删除当前源，聚搜长按站名删除当前源。\n3. 新增支持简单json源，可能还不太完善。\n4. 添加更新日志，设置页点击版本号查看。\n5. 修复首页免嗅代码丢失bug。\n6. 修复提示无数据bug。\n7. 修改二级免嗅代码调用。\n8. 去除设置项无用功能，去除HTML写法。"
}, {
"版本": "4.5",
"日期": "2024-07-03",
"内容": "1. 新增支持搜索关键词为GBK的链接。\n2. 优化影源管理，点击格式后，全页面跟随改变。\n3. 优化无法访问之类的提示，以及发布页域名无法重新获取。\n4. 修复导入确认页报错，添加导入提示。\n5. 修复二级页面特殊情况报错，修复host搜索一直加载。"
}, {
"版本": "4.4",
"日期": "2024-07-01",
"内容": "1. 新增自定义首页样式。\n2. 新增分类自定义顶部标题。\n3. 新增搜索、分类自定义样式。\n4. 新增导入确认页，需手动选择添加或更新源。\n5. 修复聚搜部分源无法搜索。\n6. 修复二级免嗅代码丢失。\n7. 其它优化。"
}, {
"版本": "4.0",
"日期": "2024-06-28",
"内容": "1. 新增自定义添加源、分享、删除。\n2. 此版之后不再维护内置源，且删除之前的内置源。"
}]