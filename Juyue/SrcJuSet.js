////本代码仅用于个人学习，请勿用于其他作用，下载后请24小时内删除，代码虽然是公开学习的，但请尊重作者，应留下说明
require(config.聚阅.replace(/[^/]*$/,'') + 'SrcJuPublic.js');
//本地接口管理
function SRCSet() {
    addListener("onClose", $.toString(() => {
        clearMyVar('duodatalist');
        clearMyVar("seacrhJiekou");
        clearMyVar('jkdatalist');
        clearMyVar('批量选择模式');
        clearMyVar('onlyStopJk');
        clearMyVar('similarTitles');
        clearMyVar('selectGroup');
    }));

    let d = [];
    let jkIcons = getThemeList(true)['接口图标'];
    d.push({
        title: '增加',
        url: $('hiker://empty#noRecordHistory##noHistory#').rule(() => {
            setPageTitle('增加 | 聚阅接口');
            require(config.聚阅.replace(/[^/]*$/,'') + 'SrcJuSet.js');
            jiekouapi();
        }),
        img: getIcon(jkIcons[0].img, false, jkIcons[0].color),
        col_type: "icon_small_4",
        extra: {
            longClick: []
        }
    });
    d.push({
        title: '操作',
        url: $([getMyVar('批量选择模式')?"退出批量":"批量选择",getMyVar('onlyStopJk')?"退出禁用":"查看禁用","清空所有","分组排序",getMyVar('similarTitles')?"退出相似":"查看相似"], 2).select(() => {
            require(config.聚阅.replace(/[^/]*$/,'') + 'SrcJuPublic.js');
            if(input=="批量选择" || input=="退出批量"){
                let sm;
                if(getMyVar('批量选择模式')){
                    clearMyVar('批量选择模式');
                    clearMyVar('duodatalist');
                    sm = "退出批量选择模式";
                }else{
                    putMyVar('批量选择模式','1');
                    sm = "进入批量选择模式";
                }
                refreshPage(false);
                return "toast://"+sm;
            }else if(input=="清空所有"){
                return $("确定要删除本地所有的源接口吗？").confirm(()=>{
                    require(config.聚阅.replace(/[^/]*$/,'') + 'SrcJuPublic.js');
                    deleteData();
                    refreshPage(false);
                    return 'toast://已全部清空';
                })
            }else if(input=="查看禁用"||input=="退出禁用"){
                let sm;
                if(getMyVar('onlyStopJk')){
                    clearMyVar('onlyStopJk');
                    sm = "退出仅显示禁用列表";
                }else{
                    putMyVar('onlyStopJk','1');
                    sm = "进入仅显示禁用列表";
                }
                refreshPage(false);
                return "toast://"+sm;
            }else if(input=="分组排序"){
                require(config.聚阅.replace(/[^/]*$/,'') + 'SrcJuPublic.js');
                let groupNames = getGroupNames();

                const hikerPop = $.require(config.聚阅.replace(/[^/]*$/,'') + 'plugins/hikerPop.js');
                hikerPop.setUseStartActivity(false);

                let inputBox;
                let pop = hikerPop.selectBottomRes({
                    options: groupNames,
                    columns: 3,
                    title: "长按调整，最后确定",
                    noAutoDismiss: true,
                    extraInputBox: (inputBox = new hikerPop.ResExtraInputBox({
                        title: '确定',
                        defaultValue: groupNames.join(',') || "",
                        click(s, manage) {
                            Juconfig['groupSort'] = s;
                            writeFile(cfgfile, JSON.stringify(Juconfig));
                            pop.dismiss();
                            refreshPage(false);
                        },
                        titleVisible: true
                    })),
                    longClick(s, i, manage) {
                        hikerPop.selectCenter({
                            options: ["进位", "退位", "置顶", "置底"],
                            columns: 2,
                            title: '选择调整动作',
                            click(input) {
                                if ((i == 0 && (input == "进位" || input == "置顶")) || (i == groupNames.length - 1 && (input == "退位" || input == "置底"))) {
                                    return 'toast://位置移动无效';
                                } else {
                                    if (input == "进位" || input == "退位") {
                                        let newindex = input == "进位" ? i - 1 : i + 1;
                                        groupNames.splice(newindex, 0, groupNames.splice(i, 1)[0]);
                                    } else {
                                        groupNames.splice(i, 1);
                                        if (input == "置顶") {
                                            groupNames.unshift(s);
                                        } else {
                                            groupNames.push(s);
                                        }
                                    }
                                    manage.list.length = 0;
                                    groupNames.forEach(x => {
                                        manage.list.push(x);
                                    });
                                    manage.change();
                                    inputBox.setDefaultValue(groupNames.join(','));
                                }
                            }
                        });
                    }
                });
                return 'hiker://empty';
            }else if(input=="查看相似"||input=="退出相似"){
                let sm;
                if(getMyVar('similarTitles')){
                    clearMyVar('similarTitles');
                    sm = "退出仅显示相似列表";
                }else{
                    putMyVar('similarTitles','1');
                    sm = "进入仅显示相似列表";
                }
                refreshPage(false);
                return "toast://"+sm;
            }
        }),
        img: getIcon(jkIcons[1].img, false, jkIcons[1].color),
        col_type: "icon_small_4"
    });
    d.push({
        title: '导入',
        url: $("","聚阅口令").input(()=>{
            if(input==""){
                return 'toast://不能为空';
            }
            if(input.indexOf('@import=js:')>-1){
                input = input.split('@import=js:')[0].replace('云口令：','').trim();
            }
            require(config.聚阅.replace(/[^/]*$/,'') + 'SrcJuSet.js');
            return JYimport(input);
        }),
        img: getIcon(jkIcons[2].img, false, jkIcons[2].color),
        col_type: "icon_small_4"
    });
    let pastes = getPastes();
    pastes.push('云口令文件');
    
    let datalist = getDatas('all');
    if(getMyVar('similarTitles')){
        datalist = similarTitles(datalist);
    }else if(getMyVar('onlyStopJk')){
        datalist = datalist.filter(item => item.stop);
    }

    let jkdatalist = getGroupLists(datalist, getMyVar("selectGroup","全部"));

    if(getMyVar("seacrhJiekou")){
        jkdatalist = jkdatalist.filter(it=>{
            return it.name.indexOf(getMyVar("seacrhJiekou"))>-1 || (it.author||"").indexOf(getMyVar("seacrhJiekou"))>-1;
        })
    }
    let yxdatalist = jkdatalist.filter(it=>{
        return !it.stop;
    });
    storage0.putMyVar("jkdatalist", jkdatalist);
    d.push({
        title: '分享',
        url: yxdatalist.length == 0 ? "toast://有效接口为0，无法分享" : $(pastes,2).select(()=>{
            require(config.聚阅.replace(/[^/]*$/,'') + 'SrcJuSet.js');
            return JYshare(input);
        }),
        img: getIcon(jkIcons[3].img, false, jkIcons[3].color),
        col_type: "icon_small_4",
        extra: {
            longClick: [{
                title: '单接口分享剪贴板：' + getItem("sharePaste","自动选择"),
                js: $.toString(() => {
                    let pastes = getPastes();
                    pastes.unshift('自动选择');
                    return $(pastes,2,'指定单接口分享时用哪个剪贴板').select(() => {
                        if(input=="自动选择"){
                            clearItem("sharePaste");
                        }else{
                            setItem("sharePaste", input);
                        }
                        refreshPage(false);
                        return 'toast://单接口分享剪贴板已设置为：' + input;
                    })
                })
            }]
        }
    });
    d.push({
        col_type: "line"
    });
    d.push({
        title: "🔍",
        url: $.toString(() => {
            putMyVar("seacrhJiekou",input);
            refreshPage(false);
        }),
        desc: "搜你想要的...",
        col_type: "input",
        extra: {
            defaultValue: getMyVar('seacrhJiekou',''),
            titleVisible: true
        }
    });

    let groupNames = getJkGroups(datalist);
    groupNames.unshift("全部");
    let Color = getItem('主题颜色','#3399cc');
    let groupColtype = getItem("groupColtype", "flex_button");
    let lockgroups = Juconfig["lockgroups"] || [];
    groupNames.forEach(it =>{
        let obj = {
            title: (getMyVar("selectGroup","全部")==it?`““””<b><span style="color: `+Color+`">`+it+`</span></b>`:it) + (lockgroups.indexOf(it)>-1?"🔒":""),
            url: $('#noLoading#').lazyRule((it) => {
                if(getMyVar("selectGroup")!=it){
                    putMyVar("selectGroup",it);
                    refreshPage(false);
                }
                return "hiker://empty";
            },it),
            col_type: groupColtype,
            extra: {
                backgroundColor: getMyVar("selectGroup","全部")==it?"#20" + Color.replace('#',''):""
            }
        }
        
        if(it == "全部"){
            obj.extra.longClick = [{
                title: "分组样式:" + getItem("groupColtype", "flex_button"),
                js: $.toString(() => {
                    return $(["flex_button","scroll_button"], 1).select(() => {
                        setItem("groupColtype", input);
                        refreshPage(false);
                    })
                })
            },{
                title: "列表排序:" + getItem("sourceListSort", "更新时间"),
                js: $.toString(() => {
                    return $(["更新时间","接口名称"], 1).select(() => {
                        setItem("sourceListSort", input);
                        refreshPage(false);
                    })
                })
            },{
                title: juItem2.get('noShowType')=='1'?"显示分类":"不显示分类",
                js: $.toString(() => {
                    if(juItem2.get('noShowType')=='1'){
                        juItem2.clear('noShowType')
                    }else{
                        juItem2.set('noShowType', '1')
                    }
                    return 'toast://已切换，切源列表、快速分组、接口列表同时生效';
                })
            }]
        }else{
            obj.extra.longClick = [{
                title: lockgroups.indexOf(it)>-1?"解锁":"加锁",
                js: $.toString((it) => {
                    require(config.聚阅.replace(/[^/]*$/,'') + 'SrcJuPublic.js');
                    let lockgroups = Juconfig["lockgroups"] || [];
                    if(lockgroups.indexOf(it)>-1){
                        const hikerPop = $.require(config.聚阅.replace(/[^/]*$/,'') + 'plugins/hikerPop.js');
                        if (hikerPop.canBiometric() !== 0) {
                            return "toast://无法调用生物学验证";
                        }
                        lockgroups = lockgroups.filter(item => item !== it);
                        let pop = hikerPop.checkByBiometric(() => {
                            Juconfig["lockgroups"] = lockgroups;
                            writeFile(cfgfile, JSON.stringify(Juconfig));
                            refreshPage(false);
                        });
                    }else{
                        lockgroups.push(it);
                        Juconfig["lockgroups"] = lockgroups;
                        writeFile(cfgfile, JSON.stringify(Juconfig));
                        refreshPage(false);
                    }
                },it)
            }]
        }
        d.push(obj);
    })
    
    if(getMyVar('批量选择模式')){
        d.push({
            col_type: "blank_block"
        });
        d.push({
            title: "反向选择",
            url: $('#noLoading#').lazyRule(() => {
                let jkdatalist = storage0.getMyVar("jkdatalist") || [];
                require(config.聚阅.replace(/[^/]*$/,'') + 'SrcJuPublic.js');
                duoselect(jkdatalist);
                return "toast://已反选";
            }),
            col_type: 'scroll_button'
        })
        d.push({
            title: "删除所选",
            url: $('#noLoading#').lazyRule(() => {
                let selectlist = storage0.getMyVar('duodatalist') || [];
                if(selectlist.length==0){
                    return "toast://未选择";
                }
                return $("确定要删除选择的"+selectlist.length+"个接口？").confirm((selectlist)=>{
                    require(config.聚阅.replace(/[^/]*$/,'') + 'SrcJuPublic.js');
                    deleteData(selectlist);
                    refreshPage(false);
                    return 'toast://已删除选择';
                }, selectlist)
            }),
            col_type: 'scroll_button'
        })
        d.push({
            title: "调整分组",
            url: $('#noLoading#').lazyRule(()=>{
                    let selectlist = storage0.getMyVar('duodatalist') || [];
                    if(selectlist.length>0){
                        return $("","选定的"+selectlist.length+"个接口新分组名，留空则清空").input((selectlist)=>{
                            input = input.trim();
                            if(input=="全部"){
                                return "toast://分组名不能为：全部";
                            }else if(input.includes('[') || input.includes(']')){
                                return "toast://分组名不能包含：[]";
                            }
                            require(config.聚阅.replace(/[^/]*$/,'') + 'SrcJuPublic.js');
                            eval("var datalist=" + fetch(jkfile) + ";");
                            datalist.forEach(data=>{
                                if(selectlist.some(item => data.id==item.id)){
                                    if(input){
                                        data.group  = input;
                                    }else{
                                        delete data.group;
                                    }
                                }
                            })
                            writeFile(jkfile, JSON.stringify(datalist));
                            clearMyVar('duodatalist');
                            refreshPage(false);
                            return "toast://已批量调整接口分组";
                        }, selectlist)
                    }else{
                        return "toast://请选择";
                    }
                }),
            col_type: "scroll_button"
        });
        d.push({
            title: "禁用所选",
            url: $('#noLoading#').lazyRule(() => {
                let selectlist = storage0.getMyVar('duodatalist') || [];
                if(selectlist.length==0){
                    return "toast://未选择";
                }
                return $("确定要禁用选择的"+selectlist.length+"个接口？").confirm((selectlist)=>{
                    require(config.聚阅.replace(/[^/]*$/,'') + 'SrcJuPublic.js');
                    let sm = dataHandle(selectlist, '禁用');
                    refreshPage(false);
                    return 'toast://' + sm;
                },selectlist)
            }),
            col_type: 'scroll_button'
        })
        d.push({
            title: "启用所选",
            url: $('#noLoading#').lazyRule(() => {
                let selectlist = storage0.getMyVar('duodatalist') || [];
                if(selectlist.length==0){
                    return "toast://未选择";
                }
                return $("确定要启用选择的"+selectlist.length+"个接口？").confirm((selectlist)=>{
                    require(config.聚阅.replace(/[^/]*$/,'') + 'SrcJuPublic.js');
                    let sm = dataHandle(selectlist, '启用');
                    refreshPage(false);
                    return 'toast://' + sm;
                },selectlist)
            }),
            col_type: 'scroll_button'
        })

        d.push({
            title: "批量检测",
            url: !config.聚阅.includes('000')?"toast://暂未上线":$('#noLoading#').lazyRule(() => {
                let nowtime = Date.now();
                let checkSourcetime = getItem('checkSourcetime','0');
                let oldtime = parseInt(checkSourcetime.split('|')[0]);
                let h = checkSourcetime=="0"?0:parseInt(checkSourcetime.split('|')[1]);
                if (nowtime < (oldtime+h*60*60*1000)) {
                    return "toast://下次允许批量检测时间\n" + $.dateFormat(oldtime+h*60*60*1000, "yyyy-MM-dd HH:mm:ss");
                }
                let duoselect = storage0.getMyVar('duodatalist') || [];
                duoselect = duoselect.filter(v=>!v.stop);
                if(duoselect.length==0){
                    return "toast://未选择";
                }
                if(getMyVar("批量检测_线程开始")=="1"){
                    return "toast://上一个任务还没有结束，请等待.";
                }
                storage0.putMyVar('批量检测_待检列表', duoselect);//写入待检测源

                return $("hiker://empty#noRecordHistory##noHistory##noRefresh#").rule(() => {
                    addListener("onClose", $.toString(() => {
                        putMyVar("批量检测_退出页面","1");
                        let nowtime = Date.now();
                        setItem('checkSourcetime', nowtime+'|'+getMyVar("批量检测_下次时间", "0"));
                        clearMyVar("批量检测_下次时间");
                        clearMyVar("批量检测_待检列表");
                        clearMyVar("批量检测_中止线程");
                        clearMyVar("批量检测_复检模式");
                        clearMyVar("批量检测_失败列表");
                        clearMyVar("批量检测_当前进度");
                        clearMyVar("批量检测_复检列表");
                        clearMyVar('批量选择模式');
                        clearMyVar('duodatalist');
                        refreshPage(true);
                    }));
                    function testSource() {
                        return $('#noLoading#').lazyRule(()=>{
                            if(getMyVar("批量检测_线程开始")=="1"){
                                return "toast://上一个任务还没有结束，请等待.";
                            }
                            if(getMyVar("批量检测_当前进度")=="0"){
                                return "toast://检测项目已结束";
                            }

                            require(config.聚阅.replace(/[^/]*$/,'') + 'SrcJuPublic.js');
                            let schedule = getMyVar("批量检测_当前进度","1");

                            let task = function (data) {
                                let desc = data.message || '';
                                let error = 0;
                                if(schedule=="1"){
                                    if(data.ilk != "2"){
                                        if(getYiData('testSource', data)){
                                            desc += "一级列表检测正常";
                                        }else{
                                            error = 1;
                                            desc += "一级列表检测失败";
                                        }
                                    }else{
                                        desc += "搜索源，跳过一级列表检测";
                                    }
                                }else if(schedule=="2"){
                                    if(data.searchable!='0'){
                                        let ssdata = getSsData("我的", data, 1);
                                        if(ssdata.error){
                                            desc += "\n搜索 ‘我的’ 检测出错";
                                            error = 1;
                                        }else if(ssdata.vodlists.length>0 && !data.erurl){
                                            data.erurl = ssdata.vodlists[0].url;
                                            data.ername = ssdata.vodlists[0].title;
                                            desc += "\n搜索 ‘我的’ 结果获取到>" + ssdata.vodlists.length;
                                        }
                                    }else{
                                        desc += "不支持搜索源，跳过搜索检测";
                                    }
                                }else if(schedule=="3"){
                                    if(data.erurl){
                                        let erdata = getErData(data, data.erurl);
                                        let lists = erdata.lists || [];
                                        if(lists.length==0){
                                            error = 1;
                                            desc += "\n获取 ‘"+data.ername+"’ 选集列表失败";
                                        }else{
                                            desc += "\n获取 ‘"+data.ername+"’ 选集列表成功";
                                        }
                                    }else{
                                        desc += "\n未获取到二级链接，跳过二级选集检测";
                                    }
                                }
                                
                                data.message = desc;

                                return {error:error, data:data}
                            }

                            showLoading("批量检测中...");
                            let checkSourceList = storage0.getMyVar("批量检测_待检列表") || [];
                            let list = checkSourceList.filter(v=>{
                                return schedule=="3"?v.erurl:v.url;
                            }).map((item) => {
                                return {
                                    func: task,
                                    param: item,
                                    id: item.id
                                }
                            });

                            clearMyVar("批量检测_退出页面");
                            putMyVar("批量检测_下次时间", "24");
                            putMyVar("批量检测_线程开始", "1");
                            log("批量检测_线程开始");

                            let success = 0;
                            let checknumber = list.length;
                            let failSourceList = storage0.getMyVar("批量检测_失败列表") || [];

                            if(list.length>0){
                                be(list, {
                                    func: function (obj, id, error, taskResult) {
                                        if(taskResult.error){
                                            let data = taskResult.data;
                                            failSourceList.push(data);
                                            
                                            addItemBefore("testSource2", {
                                                title: data.name,
                                                desc: data.message,
                                                url: $("hiker://empty#noRecordHistory##noHistory#").rule((data) => {
                                                    setPageTitle(data.name+"-接口测试");
                                                    require(config.聚阅.replace(/[^/]*$/,'') + 'SrcJu.js');
                                                    yiji(data);
                                                }, data),
                                                col_type: "text_1",
                                                extra: {
                                                    id: "failSource-" + data.id,
                                                    cls: "failSource",
                                                    longClick: [{
                                                        title: "禁用",
                                                        js: $.toString((data) => {
                                                            if(getMyVar("批量检测_线程开始")=="1"){
                                                                return "toast://等待任务结束或中止线程";
                                                            }
                                                            let failSource = storage0.getMyVar("批量检测_失败列表") || [];
                                                            let index = failSource.indexOf(data);
                                                            if(index>-1){
                                                                failSource.splice(index, 1);
                                                                storage0.putMyVar("批量检测_失败列表", failSource);
                                                            }
                                                            deleteItem("failSource-" + data.id);
                                                            require(config.聚阅.replace(/[^/]*$/,'') + 'SrcJuPublic.js');
                                                            let sm = dataHandle(data, "禁用");
                                                            return "toast://" + sm;
                                                        }, data)
                                                    },{
                                                        title: "删除",
                                                        js: $.toString((data) => {
                                                            if(getMyVar("批量检测_线程开始")=="1"){
                                                                return "toast://等待任务结束或中止线程";
                                                            }
                                                            let failSource = storage0.getMyVar("批量检测_失败列表") || [];
                                                            let index = failSource.indexOf(data);
                                                            if(index>-1){
                                                                failSource.splice(index, 1);
                                                                storage0.putMyVar("批量检测_失败列表", failSource);
                                                            }
                                                            deleteItem("failSource-" + data.id);
                                                            require(config.聚阅.replace(/[^/]*$/,'') + 'SrcJuPublic.js');
                                                            deleteData(data);
                                                            return "toast://已删除";
                                                        }, data)
                                                    },{
                                                        title: "保留",
                                                        js: $.toString((data) => {
                                                            if(getMyVar("批量检测_线程开始")=="1"){
                                                                return "toast://等待任务结束或中止线程";
                                                            }
                                                            let failSource = storage0.getMyVar("批量检测_失败列表") || [];
                                                            let index = failSource.indexOf(data);
                                                            if(index>-1){
                                                                failSource.splice(index, 1);
                                                                storage0.putMyVar("批量检测_失败列表", failSource);
                                                            }
                                                            deleteItem("failSource-" + data.id);
                                                            return "toast://已保留，不处理";
                                                        }, data)
                                                    }]
                                                }
                                            });
                                        }else{
                                            success++;
                                            let index = checkSourceList.indexOf(checkSourceList.filter(d => taskResult.data.id==d.id )[0]);
                                            checkSourceList[index] = taskResult.data;
                                        }
                                        
                                        updateItem("testSource", {
                                            title: (failSourceList.length+success) + "/" + checknumber + "，成功：" + success + "，失败：" + failSourceList.length,
                                            desc: "点击中止线程，停止批量检测",
                                            url: $().lazyRule(()=>{
                                                putMyVar("批量检测_中止线程","1");
                                                showLoading("正在拦截线程");
                                                return "toast://正在拦截线程，停止批量检测";
                                            })
                                        });
                                        //log(id + ">>>" +error);

                                        if(getMyVar("批量检测_退出页面")=="1" || getMyVar("批量检测_中止线程")=="1"){
                                            log("批量检测_中止线程");
                                            return "break";
                                        }
                                    },
                                    param: {
                                    }
                                })
                            }
                            
                            log("批量检测_线程结束");
                            clearMyVar("批量检测_线程开始"); 
                            clearMyVar("批量检测_中止线程");
                            
                            if(!getMyVar("批量检测_退出页面")){
                                if(failSourceList.length>0){
                                    addItemAfter("testSource2", {
                                        title: "批量删除失效",
                                        url: $("#noLoading#").lazyRule((failnum) => {
                                            return $("确认要删除失败"+failnum+"个接口？").confirm(()=>{
                                                let failSourceList = storage0.getMyVar("批量检测_失败列表") || [];
                                                let checkSourceList = storage0.getMyVar("批量检测_待检列表") || [];
                                                failSourceList.forEach(it=>{
                                                    let index = checkSourceList.indexOf(checkSourceList.filter(d => it.id==d.id )[0]);
                                                    checkSourceList.splice(index, 1);
                                                    deleteItem("failSource-" + it.id);
                                                })
                                                storage0.putMyVar("批量检测_待检列表",checkSourceList);

                                                require(config.聚阅.replace(/[^/]*$/,'') + 'SrcJuPublic.js');
                                                deleteData("jk", failSourceList);
                                                clearMyVar("批量检测_失败列表");
                                                deleteItem("deleteAllFail");
                                                return "toast://已批量删除";
                                            })
                                        },failSourceList.length),
                                        col_type : "text_center_1",
                                        extra: {
                                            id: "deleteAllFail"
                                        }
                                    })
                                    storage0.putMyVar("批量检测_失败列表", failSourceList);
                                }
                                
                                storage0.putMyVar("批量检测_待检列表",checkSourceList);
                                updateItem("testSource", {
                                    desc: "",
                                    url: "hiker://empty"
                                });
                                let checkFailSource = {
                                    title: "针对失败源进行复检",
                                    url: $("#noLoading#").lazyRule(() => {
                                        let recheckList = storage0.getMyVar("批量检测_复检列表") || [];
                                        let failSourceList = storage0.getMyVar("批量检测_失败列表") || [];
                                        failSourceList.forEach(it=>{
                                            if(recheckList.indexOf(it.id)==-1){
                                                recheckList.push(it.id);
                                            }
                                        })
                                        let checkSourceList = storage0.getMyVar("批量检测_待检列表") || [];
                                        checkSourceList = checkSourceList.filter(v=>recheckList.indexOf(v.id)>-1);
                                        if(checkSourceList.length==0){
                                            deleteItem("recheckSource");
                                            return "toast://没有需复检的源";
                                        }
                                        storage0.putMyVar("批量检测_待检列表", checkSourceList);
                                        clearMyVar("批量检测_失败列表");
                                        clearMyVar("批量检测_当前进度");
                                        clearMyVar("批量检测_复检列表");
                                        refreshPage(true);
                                        return "hiker://empty";
                                    }),
                                    col_type : "text_center_1",
                                    extra: {
                                        id: "recheckSource"
                                    }
                                }
                                let schedule = getMyVar("批量检测_当前进度","1");
                                if(schedule=="3"){
                                    putMyVar("批量检测_当前进度","0");
                                    updateItem("schedule_er", {title:"👌二级选集"});

                                    addItemAfter("testSource2", checkFailSource);
                                }else{
                                    addItemAfter("testSource2", {
                                        title: "进行下一项检测",
                                        url: $("#noLoading#").lazyRule(() => {
                                            let schedule = getMyVar("批量检测_当前进度","1");
                                            if(schedule=="1"){
                                                putMyVar("批量检测_当前进度","2");
                                            }else if(schedule=="2"){
                                                putMyVar("批量检测_当前进度","3");
                                            }
                                            let recheckList = storage0.getMyVar("批量检测_复检列表") || [];
                                            let failSourceList = storage0.getMyVar("批量检测_失败列表") || [];
                                            failSourceList.forEach(it=>{
                                                if(recheckList.indexOf(it.id)==-1){
                                                    recheckList.push(it.id);
                                                }
                                            })
                                            storage0.putMyVar("批量检测_复检列表", recheckList);
                                            clearMyVar("批量检测_失败列表");
                                            refreshPage(true);
                                            return "hiker://empty";
                                        }),
                                        col_type : "text_center_1",
                                        extra: {
                                            id: "nextCheck"
                                        }
                                    })
                                }
                            }

                            hideLoading();
                            return "toast://测试结束";
                        })
                    }
                    let checkSourceList = storage0.getMyVar("批量检测_待检列表") || [];
                    let d = [];
                    d.push({
                        title: "检测项目",
                        col_type: "rich_text"
                    })
                    let schedule = getMyVar("批量检测_当前进度","1");
                    d.push({
                        title: (schedule=="1"?"👉":"👌") + '一级列表',
                        col_type: 'text_3',
                        url: "hiker://empty"
                    });
                    d.push({
                        title: (schedule=="1"?"":schedule=="2"?"👉":"👌") + '搜索测试',
                        col_type: 'text_3',
                        url: $().lazyRule(()=>{
                            putMyVar("批量检测_当前进度","2");
                            refreshPage();
                            return "toast://跳过一级检测";
                        })
                    });
                    d.push({
                        title: (schedule=="1"||schedule=="2"?"":schedule=="3"?"👉":"👌") + '二级选集',
                        col_type: 'text_3',
                        url: "hiker://empty",
                        extra: {
                            id: "schedule_er"
                        }
                    });
                    d.push({
                        col_type: "line_blank"
                    });
                    d.push({
                        title: "待检测源：" + checkSourceList.length,
                        url: testSource(),
                        desc: "点击开始检测",
                        col_type : "text_center_1",
                        extra: {
                            id: "testSource"
                        }
                    })
                    d.push({
                        col_type: "blank_block",
                        extra: {
                            id: "testSource2"
                        }
                    });

                    setResult(d);
                })
            }),
            col_type: 'scroll_button',
            extra: {
                longClick: [{
                    title: "清除",
                    js: $.toString(() => {
                        clearItem('checkSourcetime');
                        return "toast://可以了"
                    })
                }]
            }
        })
    }
    jkdatalist.forEach(it => {
        let selectmenu,datatitle;
        selectmenu = ["分享","编辑", "删除", it.stop?"启用":"禁用", "置顶", "测试"];
        datatitle = getDataTitle(it);
        let itimg = it.img || "http://123.56.105.145/tubiao/ke/31.png";

        d.push({
            title: datatitle,
            url: getMyVar('批量选择模式')?$('#noLoading#').lazyRule((data) => {
                data = JSON.parse(base64Decode(data));
                require(config.聚阅.replace(/[^/]*$/,'') + 'SrcJuPublic.js');
                duoselect(data);
                return "hiker://empty";
            },base64Encode(JSON.stringify(it))):$(selectmenu, 2).select((data) => {
                data = JSON.parse(base64Decode(data));
                if (input == "分享") {
                    if(getItem("sharePaste","")==""){
                        let pastes = getPastes();
                        pastes.push('云口令文件');
                        return $(pastes,2).select((data)=>{
                            require(config.聚阅.replace(/[^/]*$/,'') + 'SrcJuSet.js');
                            return JYshare(input, data);
                        }, data)
                    }else{
                        require(config.聚阅.replace(/[^/]*$/,'') + 'SrcJuSet.js');
                        return JYshare(getItem("sharePaste",""), data);
                    }
                } else if (input == "编辑") {
                    return $('hiker://empty#noRecordHistory##noHistory#').rule((data) => {
                        require(config.聚阅.replace(/[^/]*$/,'') + 'SrcJuSet.js');
                        jiekouapi(data);
                    }, data)
                } else if (input == "删除") {
                    return $("确定删除："+data.name).confirm((data)=>{
                        require(config.聚阅.replace(/[^/]*$/,'') + 'SrcJuPublic.js');
                        deleteData(data);
                        refreshPage(false);
                        return 'toast://已删除:'+data.name;
                    }, data)
                } else if (input == "测试") {
                    return $("hiker://empty#noRecordHistory##noHistory#").rule((data) => {
                        setPageTitle(data.name+"-接口测试");
                        require(config.聚阅.replace(/[^/]*$/,'') + 'SrcJu.js');
                        yiji(data);
                    }, data);
                } else {//置顶、禁用、启用
                    if(input == "置顶" && getItem("sourceListSort", "更新时间") != "更新时间"){
                        return "toast://无效操作，接口列表排序方式为：" + getItem("sourceListSort");
                    }
                    require(config.聚阅.replace(/[^/]*$/,'') + 'SrcJuPublic.js');
                    let sm = dataHandle(data, input);
                    refreshPage(false);
                    return 'toast://' + sm;
                }
            }, base64Encode(JSON.stringify(it))),
            desc: (it.group||it.type) + (it.group?"("+it.type+")":"") + (it.ilk=="1" ? "  [主页源]" : it.ilk=="2" ? "  [搜索源]" : "  [完整源]"),
            img: it.stop?itimg+'?t=stop' + $().image(() => $.require("jiekou?rule=" + MY_TITLE).toGrayscale()):itimg,
            col_type: ((MY_NAME=="海阔视界"&&getAppVersion()>=5566)||(MY_NAME=="嗅觉浏览器"&&getAppVersion()>=2305))?"icon_1_left_pic":"avatar",
            extra: {
                id: it.id
            }
        });
    })
    
    d.push({
        title: "‘‘’’<small><font color=#f20c00>当前接口数：" + jkdatalist.length + "，总有效数："+yxdatalist.length+"</font></small>",
        url: 'hiker://empty',
        col_type: 'text_center_1'
    });
    setResult(d);
}
//接口新增/编辑入口
function jiekouapi(data, look) {
    addListener("onClose", $.toString(() => {
        clearMyVar('apiname');
        clearMyVar('apiauthor');
        clearMyVar('apiversion')
        clearMyVar('apiimg');
        clearMyVar('apitype');
        clearMyVar('apigroup');
        clearMyVar('apiilk');
        clearMyVar('apiruleurl');
        clearMyVar('isload');
    }));
    if(data){
        if(getMyVar('isload', '0')=="0"){
            putMyVar('apiname', data.name);
            putMyVar('apiauthor', data.author||"");
            putMyVar('apiversion', data.version||"");
            putMyVar('apiimg', data.img||"");
            putMyVar('apitype', data.type||"");
            putMyVar('apigroup', data.group||"");
            putMyVar('apiilk', data.ilk||"");
            putMyVar('apiruleurl', data.url||"");
            putMyVar('isload', '1');
        }
    }

    let d = [];
    d.push({
        title: '名称',
        col_type: 'input',
        desc: "接口名称",
        extra: {
            defaultValue: getMyVar('apiname') || "",
            titleVisible: false,
            onChange: $.toString(() => {
                putMyVar('apiname', input);
            })
        }
    });
    d.push({
        title: '源接口作者：'+ getMyVar('apiauthor',''),
        col_type: 'text_1',
        url: 'toast://保存代码文件时自动获取，作者:',/*$(getMyVar('apiauthor',''), "源接口作者").input(() => {
            putMyVar('apiauthor',input);
            refreshPage(false);
            return 'toast://源接口作者已设置为：' + input;
        }),*/
        extra: {
            //lineVisible: false
        }
    });
    d.push({
        title: '源版本号：'+ getMyVar('apiversion',''),
        col_type: 'text_1',
        url: 'toast://保存代码文件时自动获取，版本:'
    });
    d.push({
        title: '接口类型：'+ getMyVar('apitype',''),
        col_type: 'text_1',
        url: $(runTypes,2,"接口类型").select(() => {
            putMyVar('apitype',input);
            refreshPage(false);
            return 'toast://接口类型已设置为：' + input;
        }),
        extra: {
            //lineVisible: false
        }
    });
    d.push({
        title: '接口分组：'+ getMyVar('apigroup',''),
        col_type: 'text_1',
        url: $('#noLoading#').lazyRule(()=>{
            let selectTag = getMyVar('apigroup','').split(',').filter(item => item !== '');

            require(config.聚阅.replace(/[^/]*$/,'') + 'SrcJuPublic.js');
            let groupNames = getGroupNames();
            selectTag.forEach(it=>{
                if(groupNames.indexOf(it)==-1 && runTypes.indexOf(it)==-1){
                    groupNames.push(it);
                }
            })
            groupNames = groupNames.filter(item => runTypes.indexOf(item)==-1).map(it=>{
                if(selectTag.indexOf(it)>-1){
                    it = '‘‘’’<span style="color:red">' + it;
                }
                return it;
            })
            
            const hikerPop = $.require(config.聚阅.replace(/[^/]*$/,'') + "plugins/hikerPop.js");
            let FlexSection = hikerPop.FlexMenuBottom.FlexSection;
            let inputBox;
            let pop = hikerPop.FlexMenuBottom({
                extraInputBox: (inputBox = new hikerPop.ResExtraInputBox({
                    hint: "已选择的分组标签",
                    title: "确定",
                    defaultValue: getMyVar('apigroup',''),
                    click(s, pop) {
                        s = s.replace(/，/g, ',');
                        putMyVar('apigroup', s.split(',').filter(item => item !== '' && runTypes.indexOf(item)==-1).join(','));
                        refreshPage();
                        pop.dismiss();
                    }
                })), 
                sections: [new FlexSection("", groupNames)], 
                title: "选择分组标签", 
                click(button, sectionIndex, i) {
                    if(button.title.includes('‘‘’’')){
                        let newtitle = button.title.replace('‘‘’’<span style="color:red">', '');
                        selectTag = selectTag.filter(x=>x!=newtitle);
                        pop.updateButtonTitle(sectionIndex, i, newtitle);
                    }else{
                        selectTag.push(button.title);
                        pop.updateButtonTitle(sectionIndex, i, '‘‘’’<span style="color:red">'+button.title);
                    }
                    inputBox.setDefaultValue(selectTag.join(','));
                }
            });
            return "hiker://empty";
        }),
        extra: {
            //lineVisible: false
        }
    });
    d.push({
        title: '接口图标',
        col_type: 'input',
        desc:"接口图标可留空",
        extra: {
            defaultValue: getMyVar('apiimg') || "",
            titleVisible: false,
            onChange: $.toString(() => {
                putMyVar('apiimg', input);
            })
        }
    });
    
    d.push({
        title: data||getMyVar('apiruleurl')?'查看':'新建',
        col_type: 'input',
        desc: "接口规则文件，不能为空",
        url: $.toString((isnew) => {
            let file = getMyVar('apiruleurl','');
            if(isnew && !file){
                let tmpl = fc(config.聚阅.replace(/[^/]*$/,'') + 'plugins/parseCodeTmpl.js', 96);
                let codeTmpl = 'hiker://files/_cache/Juyue/parseCodeTmpl.txt';
                writeFile(codeTmpl, tmpl);
                file = codeTmpl;
            }

            if(fileExist(file)){
                let jsstr = $.toString((file)=>{
                    try {
                        eval(fetch(file)); 
                        let is;
                        if(parse['作者'] && parse['作者'] != getMyVar('apiauthor','')){
                            putMyVar('apiauthor', parse['作者']);
                            is = 1;
                        }
                        let version = parse['版本'] || parse['Ver'] || parse['ver'] || $.dateFormat(new Date(),"yyyyMMdd");
                        if(version != getMyVar('apiversion','')){
                            putMyVar('apiversion', version.toString());
                            is = 1;
                        }
                        if(is){
                            toast('作者、版本有变化，记得点保存');
                        }
                        putMyVar("apiruleurl", file);
                        refreshPage(false);
                    } catch (e) {
                        toast("文件存在错误>" + e.message + " 错误行#" + e.lineNumber);
                    }
                },file)
                return "editFile://" + file + `@js=` + jsstr;
            }else{
                return "toast://文件不存在，无法查看";
            }
        }, data?0:1),
        extra: {
            titleVisible: true,
            defaultValue: getMyVar('apiruleurl',''),
            onChange: data?'toast("不能修改文件地址");':'putMyVar("apiruleurl",input);'
        }
    });
    let ilks = ["主页源","搜索源","完整源"];
    let ilkindex = -1;
    if(getMyVar('apiilk')){
        ilkindex = parseInt(getMyVar('apiilk')) -1;
    }
    d.push({
        title: '选择源类型：'+ (ilkindex>-1?ilks[ilkindex]:''),
        col_type: 'text_1',
        url: $(ilks, 3, "选择源类型：").select(() => {
            if(input=="主页源"){
                putMyVar('apiilk','1');
            }else if(input=="搜索源"){
                putMyVar('apiilk','2');
            }else{
                putMyVar('apiilk','3');
            }
            refreshPage(false);
            return 'hiker://empty';
        }),
        extra: {
            //lineVisible: false
        }
    });
    if(!look){
        if(data){
            d.push({
                title:'删除',
                col_type:'text_3',
                url: $("确定删除接口："+data.name).confirm((data)=>{
                    require(config.聚阅.replace(/[^/]*$/,'') + 'SrcJuPublic.js');
                    deleteData(data);
                    back(true);
                    return "toast://已删除";
                }, data)
            });   
        }else{
            d.push({
                title:'清空',
                col_type:'text_3',
                url:$("确定要清空上面填写的内容？").confirm(()=>{
                    clearMyVar('apiname');
                    clearMyVar('apiauthor');
                    clearMyVar('apiimg');
                    clearMyVar('apitype');
                    clearMyVar('apigroup');
                    clearMyVar('apiilk');
                    clearMyVar('apiruleurl');
                    refreshPage(true);
                    return "toast://已清空";
                })
            });
        }
        d.push({
            title: '保存',
            col_type: 'text_3',
            url: $().lazyRule((oldid) => {
                if (!getMyVar('apiname')) {
                    return "toast://名称不能为空";
                }
                if (!getMyVar('apiversion')) {
                    return "toast://源版本号不能为空";
                }
                if (!getMyVar('apitype')) {
                    return "toast://类型没有选择";
                }
                if (!getMyVar('apiruleurl') || !fetch(getMyVar('apiruleurl'))) {
                    return "toast://规则文件不存在";
                }
                if (!getMyVar('apiilk')) {
                    return "toast://源类型没有选择";
                }
            
                let name = getMyVar('apiname');
                let author = getMyVar('apiauthor');
                let version = getMyVar('apiversion');
                let ruleurl = getMyVar('apiruleurl');
                let img = getMyVar('apiimg');
                let type = getMyVar('apitype');
                let group = getMyVar('apigroup');
                let ilk = getMyVar('apiilk');
                
                let newid = Date.now().toString();
                let newapi = {
                    id: oldid || newid,
                    name: name,
                    type: type,
                    url: ruleurl,
                    ilk: ilk
                }
                if(author){
                    newapi['author'] = author;
                }
                if(version){
                    newapi['version'] = version;
                }
                if(group){
                    newapi['group'] = group;
                }
                if(img){
                    newapi['img'] = img;
                }
                if(oldid){
                    newapi['oldid'] = oldid;
                }
                require(config.聚阅.replace(/[^/]*$/,'') + 'SrcJuSet.js');

                let urls = [];
                urls.push(newapi);
                let jknum = jiekousave(urls);
                if(jknum==-1){
                    return 'toast://内容异常';
                }else if(jknum==-2){
                    return 'toast://已存在';
                }else{
                    clearMyVar('SrcJu_searchMark');
                    clearMyVar('一级源接口信息');
                    back(true);
                    return "toast://保存成功";
                }
            }, (data?data.id:"")||""),
            extra: {
                longClick: [{
                    title: "分享代码文件",
                    js: $.toString(() => {
                        if(!getMyVar('apiruleurl') || !fetch(getMyVar('apiruleurl'))){
                            return 'toast://代码文件不存在';
                        }
                        return 'share://'+ getMyVar('apiruleurl');
                    })
                },{
                    title: "打开代码文件",
                    js: $.toString(() => {
                        if(!getMyVar('apiruleurl') || !fetch(getMyVar('apiruleurl'))){
                            return 'toast://代码文件不存在';
                        }
                        return 'openFile://'+ getMyVar('apiruleurl');
                    })
                }]
            }
        });
    }
    d.push({
        title:'测试',
        col_type:'text_3',
        url: $('#noLoading#').lazyRule((data)=>{
            if(!data){
                if (!getMyVar('apiname')) {
                    return "toast://名称不能为空";
                }
                if (!getMyVar('apitype')) {
                    return "toast://类型没有选择";
                }
                if (!getMyVar('apiruleurl') || !fetch(getMyVar('apiruleurl'))) {
                    return "toast://规则文件不存在";
                }

                let name = getMyVar('apiname');
                let author = getMyVar('apiauthor');
                let ruleurl = getMyVar('apiruleurl');
                let img = getMyVar('apiimg');
                let type = getMyVar('apitype');
                let group = getMyVar('apigroup');
                let ilk = getMyVar('apiilk');
                
                let newid = Date.now().toString();
                let newapi = {
                    id: newid,
                    name: name,
                    type: type,
                    url: ruleurl,
                    ilk: ilk
                }
                if(author){
                    newapi['author'] = author;
                }
                if(group){
                    newapi['group'] = group;
                }
                if(img){
                    newapi['img'] = img;
                }
                data = newapi;
            }
            return $("hiker://empty#noRecordHistory##noHistory#").rule((data) => {
                setPageTitle(data.name+"-接口测试");
                require(config.聚阅.replace(/[^/]*$/,'') + 'SrcJu.js');
                yiji(data);
            }, data);
        }, data),
        extra: {
            longClick: [{
                title: "开发助手",
                js: $.toString(() => {
                    return 'hiker://debug';
                })
            }]
        }
    }); 
    setResult(d);
}
//接口保存
function jiekousave(urls, mode) {
    if(urls.length==0){return 0;}
    let num = 0;
    try{
        let datalist = [];
        let sourcedata = fetch(jkfile);
        if(sourcedata != ""){
            try{
                eval("datalist=" + sourcedata+ ";");
            }catch(e){}
        }
        if(mode==2){//全量模式时，先删除本地
            for(let i=0;i<datalist.length;i++){
                if(datalist[i].retain!=1){
                    if(datalist[i].url.startsWith(jkfilespath)){
                        deleteFile(datalist[i].url);
                    }
                    datalist.splice(i,1);
                    i = i - 1;
                }
            }
        }
        let olddatanum = datalist.length;

        urls.forEach(it=>{
            function checkitem(item) {
                return item.id==it.id;
            }

            if(it.oldid || mode==1){//覆盖已存在接口
                for(let i=0;i<datalist.length;i++){
                    if(datalist[i].id==it.id || datalist[i].id==it.oldid){
                        if(mode==1 && datalist[i].group){
                            it.group = datalist[i].group;
                        }
                        datalist.splice(i,1);
                        break;
                    }
                }
            }else if(!mode && datalist.some(checkitem)){
                return -2;//已存在
            }
            
            if(!datalist.some(checkitem)){
                if(it.url.startsWith(cachepath)){//缓存的数据文件转到jiekou目录
                    if(fetch(it.url)){
                        let newurl = jkfilespath + it.id + '.txt'
                        writeFile(newurl, fetch(it.url));
                        it.url = newurl;
                    }else{
                        xlog(it.name + '>接口规则文件为空');
                        delete it.url;
                    }
                }else if(it.extstr){//带数据内容的保存到data目录
                    writeFile(it.url, it.extstr);
                    delete it['extstr'];
                }

                //if(!it.oldurl && olddatanum>0){
                //    it.group = it.group || "新导入";
                //}
                
                delete it['oldid'];
                delete it['oldversion'];

                if(it.name&&it.url&&it.type){
                    datalist.push(it);
                    num = num + 1;
                }
            }
        })
        //setJkSort(datalist, {fail: 0});
        if(num>0){writeFile(jkfile, JSON.stringify(datalist));}
    } catch (e) {
        xlog("导入失败：" + e.message + " 错误行#" + e.lineNumber); 
        return -1;
    }
    return num;
}
//资源分享
function JYshare(input,data) {
    let sharelist,sm,sm2;
    sm = '聚阅接口';
    if(data){
        sharelist = [];
        sharelist.push(data);
    }else{
        let duoselect = storage0.getMyVar('duodatalist') || [];
        if(duoselect.length>0){
            sharelist = duoselect;
        }else{
            sharelist = storage0.getMyVar("jkdatalist", []);
        }
    }

    for(let i=0;i<sharelist.length;i++){
        let it = sharelist[i];
        if(it.url.startsWith(jkfilespath)){
            it.extstr = fetch(it.url);
            if(!it.extstr){
                xlog(it.name+">未获取到数据文件，剔除分享");
                sharelist.splice(i,1);
                i = i - 1;
            }
        }else if(!it.url.startsWith(jkfilespath) && (it.url.startsWith("hiker")||it.url.startsWith("file"))){
            xlog(it.name+">私有路径的数据文件，剔除分享");
            sharelist.splice(i,1);
            i = i - 1;
        }
    }

    if(sharelist.length==0){
        return "toast://有效接口数为0，无法分享";
    }
    let gzip = $.require(codePath + "plugins/gzip.js");
    let sharetxt = gzip.zip(JSON.stringify(sharelist));
    let sharetxtlength = sharetxt.length;
    if(sharetxtlength>200000 && /云剪贴板2|云剪贴板5|云剪贴板9|云剪贴板10/.test(input)){
        return "toast://超出字符最大限制，建议用云6或文件分享";
    }

    if(input=='云口令文件'){
        sm2 = sharelist.length==1?sharelist[0].name:sharelist.length;
        let code = sm + '￥' + aesEncode('Juyue', sharetxt) + '￥云口令文件';
        let sharefile = 'hiker://files/_cache/【聚阅源】_'+sm2+'_'+$.dateFormat(new Date(),"HHmmss")+'.hiker';
        writeFile(sharefile, '云口令：'+code+`@import=js:$.require("hiker://page/import?rule=聚阅");`);
        if(fileExist(sharefile)){
            return 'share://'+sharefile;
        }else{
            return 'toast://'+input+'分享生成失败';
        }
    }else{
        showLoading('分享生成中，请稍后...');
        sm2 = sharelist.length==1?sharelist[0].name:'共' + sharelist.length + '条';
        let pasteurl = sharePaste(sharetxt, input);
        hideLoading();
        if(/^http|^云/.test(pasteurl) && pasteurl.includes('/')){
            xlog('剪贴板地址>'+pasteurl);
            let code = sm+'￥'+aesEncode('Juyue', pasteurl)+'￥' + sm2 + (input?'('+input.replace('剪贴板','')+')':'');
            copy('云口令：'+code+`@import=js:$.require("hiker://page/import?rule=聚阅");`);
            return "toast://聚阅分享口令已生成";
        }else{
            xlog('分享失败>'+pasteurl);
            return "toast://分享失败，剪粘板或网络异常>"+pasteurl;
        }
    }
}
//资源导入
function JYimport(input) {
    let cloudimport;
    if(input.includes('云口令：')){
        input = input.split('云口令：')[1].split('@import=js:')[0];
        cloudimport = 1;
    }

    let pasteurl,inputname,sm;
    let codelx = "share";
    try{
        pasteurl = aesDecode('Juyue', input.split('￥')[1]);
        inputname = input.split('￥')[0];
        if(inputname=="聚阅资源码"){
            codelx = "dingyue";
            if(input.split('￥')[2] != "文件分享"){
                pasteurl = '云6oooole/xxxxxx/' + pasteurl;
            }
            inputname = "聚阅接口";
        }
    }catch(e){
        return "toast://聚阅：口令有误>"+e.message + " 错误行#" + e.lineNumber;
    }

    try{
        if(inputname=="聚阅接口"){
            sm = "聚阅：接口";
        }else{
            return "toast://聚阅：无法识别的口令";
        }
        let text;
        if(/^http|^云/.test(pasteurl)){
            showLoading('获取数据中，请稍后...');
            text = parsePaste(pasteurl);
            hideLoading();
        }else{
            text = pasteurl;
        }
        if(pasteurl&&!/^error/.test(text)){
            let gzip = $.require(codePath + "plugins/gzip.js");
            let sharetxt = gzip.unzip(text);
            let pastedata = JSON.parse(sharetxt);           
            let urlnum = 0;
            if(inputname=="聚阅接口"){
                if(codelx=="share"){
                    var pastedatalist = pastedata;
                }else if(codelx=="dingyue"){
                    var pastedatalist = pastedata.接口;
                }
                urlnum = jiekousave(pastedatalist);
            }
            if(urlnum>0&&cloudimport!=1){
                refreshPage(false);
            }
            return "toast://"+sm+"合计："+pastedatalist.length+"，保存："+urlnum;
        }else{
            return "toast://聚阅：口令错误或已失效";
        }
    } catch (e) {
        return "toast://聚阅：无法识别的口令>" + e.message + " 错误行#" + e.lineNumber;
    }
}
// 云口令导入确认页
function importConfirm(jsfile) {
    let importfile = "hiker://files/_cache/Juyue/cloudimport.txt";
    addListener("onClose", $.toString((importfile) => {
        deleteFile(importfile);
        clearMyVar('importConfirm');
    },importfile));
    let code,name,lx,sm,importdatas,datalist;
    let d = [];
    if(isDarkMode() || getItem('不显示沉浸图')=='1'){
        for(let i=0;i<2;i++){
            d.push({
                title: "",
                url: "hiker://empty",
                col_type: "text_1",
                extra: {
                    lineVisible: false
                }
            })
        }
    }else{
        d.push({
            col_type: 'pic_1_full',
            img: "http://123.56.105.145/weisyr/img/TopImg0.png",
            url: 'hiker://empty',
        });
    }
    
    if(!jsfile){
        //云口令导入
        let input = fetch(importfile);
        if(input.includes('云口令：')){
            input = input.split('云口令：')[1].split('@import=')[0];
        }
        try{
            code = aesDecode('Juyue', input.split('￥')[1]);
            name = input.split('￥')[0];
            /*
            if(name=="聚影资源码" && input.split('￥')[2]=="文件分享"){
                let gzip = $.require(codePath + "plugins/gzip.js");
                let textcontent = gzip.unzip(code);
                let pastedata = JSON.parse(textcontent);

                d.push({
                    title: '以增量方式导入，不会清除原有的',
                    desc: "包含资源：" + Object.keys(pastedata).join(','),
                    url: "hiker://empty",
                    col_type: "text_center_1"
                });
                const hikerPop = $.require(config.聚影.replace(/[^/]*$/,'') + 'plugins/hikerPop.js');
                let fruit = Object.keys(pastedata);
                hikerPop.multiChoice({
                    title: "选择要导入本地的项", 
                    options: fruit, 
                    checkedIndexs: Array.from(fruit.keys()), 
                    onChoice(i, isChecked) {
                        //xlog(i + ":" + isChecked);
                    }, 
                    rightTitle: "确认导入", 
                    rightClick(options, checked) {
                        if(options.filter((v, i) => checked[i]).length==0){
                            return "toast://没有选择导入项";
                        }
                        require(config.聚影.replace(/[^/]*$/,'') + 'SrcJySet.js');
                        let jknum = 0, jxnum = 0, ypnum = 0, tvnum = 0, ghnum = 0;
                        hikerPop.runOnNewThread(() => {
                            options.forEach((option,i)=>{
                                if(checked[i]){
                                    if(option=="ghproxy"){
                                        let ghproxy = pastedata.ghproxy||[];
                                        if(ghproxy.length>0){
                                            oldproxy = Juconfig['ghproxy'] || [];
                                            ghproxy.forEach(gh=>{
                                                if(!oldproxy.some(item => gh.url==item.url)){
                                                    oldproxy.push(gh);
                                                    ghnum++;
                                                }
                                            })
                                            Juconfig['ghproxy'] = oldproxy;
                                        }
                                    }else if(option=="接口"){
                                        let jkdatalist = pastedata.接口||[];
                                        jknum = jiekousave(jkdatalist, 1);
                                    }
                                }
                            })
                            writeFile(cfgfile, JSON.stringify(Juconfig));
                                xlog("更新同步订阅资源完成；新增接口："+jknum+"，ghproxy："+ghnum);
                            back(false);
                            return "toast://更新同步文件资源完成；";
                        })
                    }, 
                    leftTitle: "取消",
                    leftClick() {
                        back(false);
                    }
                });
            }else{
                */
                if(name=="聚阅接口"){
                    sm = "接口";
                    lx = "jk";
                }else{
                    toast("聚阅：无法识别的口令>" + name);
                }
                importdatas = storage0.getMyVar('importConfirm', []);
                if(importdatas.length==0){
                    try{
                        let text;
                        if(/^http|^云/.test(code)){
                            showLoading('获取数据中，请稍后...');
                            text = parsePaste(code);
                            hideLoading();
                        }else{
                            text = code;
                        }
                        if(text && !/^error/.test(text)){
                            let gzip = $.require(codePath + "plugins/gzip.js");
                            let sharetxt = gzip.unzip(text);
                            importdatas = JSON.parse(sharetxt); 
                            storage0.putMyVar('importConfirm', importdatas);
                        }
                    } catch (e) {
                        toast("聚阅：无法识别的口令>"+e.message);
                    }
                }
            //}
        }catch(e){
            toast("聚阅：口令有误>"+e.message);
        }
    }
    if(name!="聚阅资源码"){
        //获取现有接口
        datalist = [];
        let sourcedata = fetch(jkfile);
        if(sourcedata != ""){
            try{
                eval("datalist = " + sourcedata+ ";");
            }catch(e){}
        }
        let newdatas = [];
        importdatas.forEach(it=>{
            if(!datalist.some(v=>v.id==it.id)){
                newdatas.push(it);
            }else{
                let olddata = datalist.filter(v=>v.id==it.id)[0];
                it.oldversion = olddata.version || "";
            }
            it.id = it.id.toString();
        })
        const prop = 'oldversion';
        importdatas.sort((a, b) => {
            let hasA = prop in a;
            let hasB = prop in b;

            if (hasA && !hasB) return -1;
            if (!hasA && hasB) return 1;
            return 0;
        });
        
        let oldnum = importdatas.length - newdatas.length;
        let Color = getItem('主题颜色','#3399cc');
        d.push({
            title: "““””<big><b><font color="+Color+">📲 云口令导入  </font></b></big>",
            desc: (sm||"") + " 共计" + importdatas.length + "/新增" + newdatas.length + "/存在" + oldnum ,
            url: "hiker://empty",
            col_type: 'text_center_1'
        });

        d.push({
            title: importdatas.length>0&&oldnum==0?"":"增量导入",
            url: importdatas.length>0&&oldnum==0?"hiker://empty":$("跳过已存在，只导入新增，确认？").confirm((lx)=>{
                require(config.聚阅.replace(/[^/]*$/,'') + 'SrcJuSet.js');
                let importlist = storage0.getMyVar('importConfirm', []);
                let num;
                if(lx=="jk"){
                    num = jiekousave(importlist, 0);
                }else{
                    return "toast://类型异常";
                }
                clearMyVar('SrcJu_searchMark');
                back(false);
                return "toast://增量导入"+(num<0?"失败":num);
            },lx),
            img: importdatas.length>0&&oldnum==0?"":getIcon("管理-增量导入.svg"),
            col_type: 'icon_small_3'
        });
        d.push({
            title: "",
            url: "hiker://empty",
            col_type: 'icon_small_3'
        });
        d.push({
            title: "全量导入",
            url: importdatas.length>0&&oldnum==0?$().lazyRule((lx)=>{
                require(config.聚阅.replace(/[^/]*$/,'') + 'SrcJuSet.js');
                let importlist = storage0.getMyVar('importConfirm', []);
                if(lx=="jk"){
                    num = jiekousave(importlist, 1);
                }else{
                    return "toast://类型异常";
                }
                clearMyVar('SrcJu_searchMark');
                back(false);
                return "toast://全量导入"+(num<0?"失败":num);
            },lx):$("全部覆盖导入，确认？").confirm((lx)=>{
                require(config.聚阅.replace(/[^/]*$/,'') + 'SrcJuSet.js');
                let importlist = storage0.getMyVar('importConfirm', []);
                if(lx=="jk"){
                    num = jiekousave(importlist, 1);
                }else{
                    return "toast://类型异常";
                }
                clearMyVar('SrcJu_searchMark');
                back(false);
                return "toast://全量导入"+(num<0?"失败":num);
            },lx),
            img: getIcon("管理-全量导入.svg"),
            col_type: 'icon_small_3'
        });
        
        importdatas.forEach(it=>{
            let isnew = newdatas.some(v=>v.id==it.id);
            let datamenu = ["确定导入", "修改名称"];
            if(lx=="jk"){
                datamenu.push("设定分组");
                datamenu.push("接口测试");
                if(!it.url.startsWith('http')){
                    datamenu.push("查看文件");
                }
            }
            let ittitle,itimg,itcol;
            if((MY_NAME=="海阔视界"&&getAppVersion()>=5566)||(MY_NAME=="嗅觉浏览器"&&getAppVersion()>=2305)){
                ittitle = it.name + "‘‘’’<small><font color=grey>(" + it.type + ")" + (it.author?"["+it.author+"]":"") + (it.oldversion?"-本V"+it.oldversion:"");
                itimg = it.img || "http://123.56.105.145/tubiao/ke/31.png";
                itcol = "icon_1_left_pic";
            }else{
                ittitle = it.name + "<small><font color=grey>(" + it.type + ")" + (it.author?"["+it.author+"]":"") + "{" + (isnew?"新增加":"已存在") + "}";
                itimg = getIcon("管理-箭头.svg");
                itcol = "text_icon";
            }
            d.push({
                title: ittitle,
                url: $(datamenu, 2).select((lx, data, isnew) => {
                    data = JSON.parse(base64Decode(data));

                    if (input == "确定导入") {
                        function iConfirm(lx,data) {
                            let dataid = data.id;
                            require(config.聚阅.replace(/[^/]*$/,'') + 'SrcJuSet.js');
                            let datas = [];
                            datas.push(data);
                            let num;
                            if(lx=="jk"){
                                num = jiekousave(datas, 1);
                            }else{
                                return "toast://类型异常";
                            }
                            clearMyVar('SrcJu_searchMark');
                            let importlist = storage0.getMyVar('importConfirm', []);
                            if(importlist.length==1){
                                back(false);
                            }else{
                                let index2 = importlist.findIndex(item => item.id === dataid);
                                importlist.splice(index2, 1);
                                storage0.putMyVar('importConfirm', importlist);
                                deleteItem(dataid);
                            }
                            return "toast://导入"+(num<0?"失败":num);
                        }
                        if(isnew){
                            return iConfirm(lx,data);
                        }else{
                            return $("导入将覆盖本地，确认？").confirm((lx,data,iConfirm)=>{
                                return iConfirm(lx,data);
                            },lx,data,iConfirm);
                        }
                    }else if (input == "修改名称") {
                        return $(data.name, "请输入新名称").input((data)=>{
                            if(!input.trim()){
                                return "toast://不能为空";
                            }
                            let dataid = data.id;
                            let importlist = storage0.getMyVar('importConfirm', []);
                            let index = importlist.findIndex(item => item.id === dataid);
                            importlist[index].name = input;
                            storage0.putMyVar('importConfirm', importlist);
                            refreshPage(false);
                            return "toast://已修改名称";
                        }, data);
                    }else if (input == "设定分组") {
                        let dataid = data.id;
                        require(config.聚阅.replace(/[^/]*$/,'') + 'SrcJuPublic.js');
                        let groupNames = getGroupNames();
                        groupNames.unshift("清除");
                        return $(groupNames, 2, "选择分组").select((dataid) => {
                            let importlist = storage0.getMyVar('importConfirm', []);
                            let index = importlist.findIndex(item => item.id === dataid);
                            if(input=="清除"){
                                delete importlist[index].group;
                            }else{
                                importlist[index].group = input;
                            }
                            storage0.putMyVar('importConfirm', importlist);
                            refreshPage(false);
                            return 'toast://已设置分组';
                        },dataid)
                    }else if (input == "接口测试") {
                        return $("hiker://empty#noRecordHistory##noHistory#").rule((data) => {
                            setPageTitle(data.name+"-接口测试");
                            require(config.聚阅.replace(/[^/]*$/,'') + 'SrcJu.js');
                            yiji(data);
                        },data)
                    }else if (input == "查看文件") {
                        writeFile('hiker://files/_cache/Juyue/lookimportfile.txt', data.extstr);
                        return "editFile://hiker://files/_cache/Juyue/lookimportfile.txt";
                    }else if (input == "删除文件") {
                        return $("删除"+data.ext+"，确认？").confirm((data)=>{
                            deleteFile(data.ext);
                            clearMyVar('SrcJu_searchMark');
                            let importlist = storage0.getMyVar('importConfirm', []);
                            if(importlist.length==1){
                                back(false);
                            }else{
                                let index2 = importlist.findIndex(item => item.id === data.id);
                                importlist.splice(index2, 1);
                                storage0.putMyVar('importConfirm', importlist);
                                deleteItem(data.id);
                            }
                            return "toast://已删除";
                        }, data)
                    }
                }, lx, base64Encode(JSON.stringify(it)), isnew),
                desc: "““””<b><font color="+Color+">"+(isnew?"新增加":"已存在") + "</font></b>" + (it.version?(it.version==it.oldversion?"":"<font color="+Color+"0>")+"-云V"+it.version:""),
                img: itimg,
                col_type: itcol,
                extra: {
                    id: it.id
                }
            });
        })
    }
    setResult(d);
}

// 管理中心
function manageSet(){
    addListener("onClose", $.toString(() => {
        //refreshPage(false);
    }));
    setPageTitle("♥管理中心"+getMyVar('SrcJu_Version', ''));

    let d = [];
    d.push({
        col_type: "line_blank"
    });
    d.push({
        title: '依赖管理',
        img: getIcon("管理-依赖.svg"),
        col_type: 'avatar',
        url: 'hiker://empty'
    });
    d.push({
        title: 'github加速管理',
        img: getIcon("管理-箭头.svg"),
        url: $('hiker://empty#noRecordHistory##noHistory#').rule(() => {
            $.require('ghproxy').proxyPage();
        }),
        col_type: 'text_icon'
    });
    d.push({
        title: '指定聚阅代码库',
        img: getIcon("管理-箭头.svg"),
        url: $(getItem('依赖', ''),"手工指定聚阅代码库地址").input(()=>{
            return $("确定要指定聚阅代码库地址"+input).confirm((input)=>{
                if(input && (!input.startsWith("http") || !input.endsWith("SrcJu.js"))){
                    return "toast://输入有误"
                }
                input = input.trim();
                setItem('依赖', input);
                initConfig({
                    聚阅: input
                })
                setPublicItem('聚阅', input);
                deleteCache();
                return "toast://已设置，返回主页刷新";
            },input)
        }),
        col_type: 'text_icon'
    });
    d.push({
        col_type: "line_blank"
    });
    d.push({
        title: '规则配置',
        img: getIcon("管理-配置.svg"),
        col_type: 'avatar',
        url: 'toast://不清楚，可不动'
    });
    /*
    d.push({
        title: '资源码分享管理',
        img: getIcon("管理-箭头.svg"),
        url: $('hiker://empty#noRecordHistory##noHistory#').rule(() => {
            require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyPublic.js');
            shareResource();
        }),
        col_type: 'text_icon'
    });
    d.push({
        title: '资源码订阅管理',
        img: getIcon("管理-箭头.svg"),
        url: $('hiker://empty#noRecordHistory##noHistory#').rule(() => {
            require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyPublic.js');
            subResource();
        }),
        col_type: 'text_icon'
    });
    */
    d.push({
        title: '规则日志打印',
        img: getItem('规则日志打印','1')=="1"?getIcon("管理-开.svg"):getIcon("关.svg"),
        url: $("#noLoading#").lazyRule(() => {
            if(getItem('规则日志打印')=="0"){
                clearItem('规则日志打印');
            }else{
                setItem('规则日志打印','0');
            }
            refreshPage();
            return 'hiker://empty';
        }),
        col_type: 'text_icon'
    });
    d.push({
        title: '接口日志打印',
        img: getItem('接口日志打印')=="1"?getIcon("管理-开.svg"):getIcon("关.svg"),
        url: $("#noLoading#").lazyRule(() => {
            if(getItem('接口日志打印')=="1"){
                clearItem('接口日志打印');
            }else{
                setItem('接口日志打印','1');
            }
            refreshPage();
            return 'hiker://empty';
        }),
        col_type: 'text_icon'
    });
    d.push({
        title: '不显示沉浸图',
        img: getItem('不显示沉浸图')=="1"?getIcon("管理-开.svg"):getIcon("关.svg"),
        url: $("#noLoading#").lazyRule(() => {
            if(getItem('不显示沉浸图')=="1"){
                clearItem('不显示沉浸图');
            }else{
                setItem('不显示沉浸图','1');
            }
            refreshPage();
            return 'hiker://empty';
        }),
        col_type: 'text_icon'
    });
    d.push({
        col_type: "line_blank"
    });
    d.push({
        title: '关于聚阅',
        img: getIcon("聚阅.svg"),
        col_type: 'avatar',
        url: 'toast://哥就是帅'
    });
    d.push({
        title: '主题图标设置',
        img: getIcon("管理-箭头.svg"),
        col_type: 'text_icon',
        url: $("hiker://empty#noRecordHistory##noHistory##immersiveTheme#").rule(() => {
            require(config.聚阅.replace(/[^/]*$/,'') + 'SrcJuSet.js');
            themeIconSet();
        }),
        extra: {
            newWindow: true,
            windowId: '聚阅主题图标设置'
        }
    });
    let colors = [{
        title: '绿意盎然',
        icon: "#4EAF7C"
    },{
        title: '蓝田生玉',
        icon: "#3498DB"
    },{
        title: '暗宝石绿',
        icon: "#00CED1"
    },{
        title: '橙黄橘绿',
        icon: "#F5AB34"
    },{
        title: '热情似火',
        icon: "#D64440"
    },{
        title: '粉装玉琢',
        icon: "#F0838D"
    },{
        title: '重斤球紫',
        icon: "#9B59B5"
    },{
        title: '深卡其色',
        icon: "#BDB76B"
    },{
        title: '亮天蓝色',
        icon: "#87CEFA"
    },{
        title: '泥牛入海',
        icon: "#BD7F45"
    },{
        title: '青出于黑',
        icon: "#336F7A"
    },{
        title: "自定义色",
        icon: getItem('自定义色', '1')
    },{
        title: "恢复初始",
        icon: ""
    }]
    
    colors.forEach(it=>{
        if(getItem('主题颜色','') == it.icon){
            it.title = it.title + '√';
        }
    })
    d.push({
        title: '主题颜色选择',
        img: getIcon("管理-箭头.svg"),
        url: $(colors, 3).select((colors) => {
            input = input.replace('√', '');
            if(input=="自定义色"){
                return $(getItem('自定义色', ''), "输入自定义主题颜色代码").input(()=>{
                    if(!input.startsWith('#')){
                        return "toast://颜色代码错误，请以#开头";
                    }
                    setItem('主题颜色', input);
                    setItem('自定义色', input);
                    refreshPage(false);
                    return "hiker://empty";
                })
            }else{
                let color = colors.filter(d => d.title == input)[0].icon;
                if(color){
                    setItem('主题颜色', color);
                }else{
                    clearItem('主题颜色');
                }
                refreshPage();
                return "hiker://empty";
            } 
        }, colors),
        col_type: 'text_icon',
        extra: {
            longClick: [{
                title: "主页大图标不变化",
                js: $.toString(() => {
                    return $("#noLoading#").lazyRule(() => {
                        if(getItem('主页大图标不变化')=="1"){
                            clearItem('主页大图标不变化');
                        }else{
                            setItem('主页大图标不变化','1');
                        }
                        return 'toast://切换成功，返回主页刷新';
                    })
                })
            }]
        }
    });
    d.push({
        title: '查看更新日志',
        img: getIcon("管理-箭头.svg"),
        col_type: 'text_icon',
        url: $("#noLoading#").lazyRule(() => {
            eval(fetch(getItem("依赖","").replace(/[^/]*$/,'') + 'SrcTmplVersion.js'));
            let updateRecords = newVersion.JYUpdateRecords || [];

            const hikerPop = $.require(getItem("依赖","").replace(/[^/]*$/,'') + 'plugins/hikerPop.js');
            hikerPop.updateRecordsBottom(updateRecords);
            
            return "hiker://empty";
        })
    });
    d.push({
        title: '开发手册文档',
        img: getIcon("管理-箭头.svg"),
        col_type: 'text_icon',
        url: $("#noLoading#").lazyRule(() => {
            return "web://https://docs.qq.com/doc/DWERBTHJzcWV0UHVE";
        })
    });
    d.push({
        title: '检测版本更新',
        img: getIcon("管理-箭头.svg"),
        col_type: 'text_icon',
        url: $("#noLoading#").lazyRule(() => {
            if(!getItem("依赖","")){
                return "toast://代码库获取异常，无法更新！";
            }
            if(!getItem("依赖","").startsWith("http")){
                return "toast://非在线代码库，无法在线更新！";
            }
            try{
                eval(request(getItem("依赖","").replace(/[^/]*$/,'') + 'SrcTmplVersion.js'))
                let nowVersion = getItem('Version', getMyVar('SrcJu_Version', '0.1').replace('-V',''));
                let nowtime = Date.now();
                if (parseFloat(newVersion.SrcJu) > parseFloat(nowVersion)) {
                    confirm({
                        title: '发现新版本，是否更新？', 
                        content: '本地V'+nowVersion+' => 云端V'+newVersion.SrcJu, 
                        confirm: $.toString((nowtime,newVersion) => {
                            setItem('Version', newVersion);
                            setItem('VersionChecktime', nowtime+'time');
                            deleteCache();
                            putMyVar('SrcJu_Version', '-V'+newVersion);
                            refreshPage();
                        },nowtime, newVersion.SrcJu),
                        cancel:''
                    })
                }else{
                    toast('已经为最新版本');
                }
            }catch(e){
                toast('获取版本信息异常>'+e.message);
            }
            return "hiker://empty";
        })
    });
    d.push({
        title: '支持一下作者',
        img: getIcon("管理-箭头.svg"),
        col_type: 'text_icon',
        url: config.聚阅.replace(/[^/]*$/,'') + 'img/pay.jpg'
    });
    d.push({
        col_type: "line_blank"
    });
    d.push({
        title: '免责申明',
        img: getIcon("管理-免责.svg"),
        col_type: 'avatar',
        url: 'hiker://empty'
    })
    d.push({
        title: `<small>
                1. 本小程序是一个空壳小程序，无任何内置资源。<br>
                2. 本小程序开源<b>完全免费</b>，如果是付费购买的那你被骗了。<br>
                3. 本小程序免费无偿使用，不接受任何指责和无理要求。<br>
                4. 本小程序开发初衷源于兴趣爱好，乐于分享，禁止贩卖。<br>
                5. 本小程序仅用于个人学习研究，请于导入24小时内删除！<br>
                <b>开始使用本规则即代表遵守规则条例</b><br>
            </small>`,
        col_type: 'rich_text'
    });
    setResult(d);
}
// 程序图标设置
function themeIconSet() {
    addListener("onClose", $.toString(() => {
        clearMyVar('themeList');
        clearMyVar('currentTheme');
    }));
    setPageTitle('主题图标设置');
    clearMyVar('按钮名称');
    clearMyVar('按钮索引');
    clearMyVar('编辑类别');
    clearMyVar('编辑组件状态');
    clearMyVar('图标临时记录');
    if(fileExist(libspath + 'themes.json')){
        writeFile(rulepath + 'themes.json', fetch(libspath + 'themes.json'));
        deleteFile(libspath + 'themes.json');
    }

    let d = [];
    if(isDarkMode() || getItem('不显示沉浸图')=='1'){
        for(let i=0;i<2;i++){
            d.push({
                title: "",
                url: "hiker://empty",
                col_type: "text_1",
                extra: {
                    lineVisible: false
                }
            })
        }
    }else{
        d.push({
            col_type: 'pic_1_full',
            img: "http://123.56.105.145/weisyr/img/TopImg0.png",
            url: 'hiker://empty',
        });
    }

    let themeList = storage0.getMyVar('themeList');
    if (!themeList) {
        themeList = getThemeList();
        storage0.putMyVar('themeList', themeList);
    }

    let currentTheme = storage0.getMyVar('currentTheme', storage0.getItem('currentTheme', getThemeList(true)));
    let themename = currentTheme['名称'] || '';
    let themenames = themeList.map(it => it.名称);
    if (!storage0.getMyVar('currentTheme') && themename) {
        storage0.putMyVar('currentTheme', currentTheme);
    }

    d.push({
        title: '主题：' + (themename || '没有主题'),
        url: $(themenames, 2, '选择主题').select(() => {
            let theme = storage0.getMyVar('themeList').filter(v => v.名称 == input)[0];
            storage0.putMyVar('currentTheme', theme);
            refreshPage();
            return 'hiker://empty';
        }),
        col_type: 'text_2'
    })
    d.push({
        title: '新增|删除',
        url: $('', '请输入一个主题名称').input(() => {
            let themeList = storage0.getMyVar('themeList');
            if (themeList.some(v => v.名称 == input) || input=='原生主题') {
                return 'toast://主题名称已存在';
            } else if (input) {
                storage0.putMyVar('currentTheme', {
                    名称: input
                });
                refreshPage();
            }
            return 'hiker://empty';
        }),
        col_type: 'text_2',
        extra: {
            longClick: [{
                title: "删除主题",
                js: $.toString((rulepath,themename) => {
                    return $("删除主题["+themename+"]，确认？").confirm((rulepath, themename)=>{
                        let currentTheme = storage0.getMyVar('currentTheme', {});
                        let themeList = storage0.getMyVar('themeList', []);
                        themeList = themeList.filter(v => v.名称 != currentTheme.名称);
                        writeFile(rulepath + 'themes.json', JSON.stringify(themeList));

                        if(storage0.getItem('currentTheme', {}).名称==currentTheme.名称){
                            clearItem('currentTheme');
                        }
                        clearMyVar('currentTheme');
                        clearMyVar('themeList');
                        //删除对应文件夹
                        let L = $.require("http://123.56.105.145/weisyr/js/file.js")
                        L.deleteFiles(getPath(rulepath + 'themes/' + themename).replace('file://',''));

                        refreshPage(true);
                        return 'toast://已保存并生效';
                    }, rulepath, themename)
                }, rulepath, themename)
            }]
        }
    })
    if(themename){
        let 编辑组件 = () => {
            let d = []
            d.push({
                title: '着色',
                col_type: 'text_3',
                url: $("#noLoading#").lazyRule(() => {
                    let imgtype = getMyVar('编辑类别', '主页') + '图标';
                    let currentTheme = storage0.getMyVar('currentTheme', {});
                    let imgs = currentTheme[imgtype] || [];
                    let i = parseInt(getMyVar('按钮索引', '0'));
                    let img = (imgs[i]||{}).img;

                    function extractColorsFromSVG(svgString) {
                        const colorRegex = /#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})\b/g;
                        const colors = new Set(); // 使用 Set 避免重复

                        let match;
                        while ((match = colorRegex.exec(svgString)) !== null) {
                            colors.add(match[0]); // 添加完整匹配的颜色代码
                        }

                        return Array.from(colors); // 转成数组返回
                    }

                    if(img){
                        if(!img.endsWith('.svg')){
                            return 'toast://非svg格式图标无法着色';
                        }
                        let colors = extractColorsFromSVG(fetch(img)).map(v=>{
                            return {
                                title: v,
                                icon: v
                            }
                        })
                        if(colors.length==0){
                            return 'toast://获取svg图标中颜色代码失败';
                        }
                        return $(colors, 2, '选择随主题色变化的颜色代码').select(()=>{
                            let imgtype = getMyVar('编辑类别', '主页') + '图标';
                            let currentTheme = storage0.getMyVar('currentTheme', {});
                            let imgs = currentTheme[imgtype] || [];
                            let i = parseInt(getMyVar('按钮索引', '0'));
                            let img = (imgs[i]||{}).img;
                            imgs[i] = {img: img, color: input};
                            currentTheme[imgtype] = imgs;
                            storage0.putMyVar('currentTheme', currentTheme);
                            return 'toast://已选择：' + input;
                        })
                    }
                    return 'hiker://empty';
                }),
                extra: {
                    id: '图标编辑着色',
                    cls: '图标编辑组件'
                }
            })
            d.push({
                title: `““””📂本地`,
                col_type: 'text_3',
                url: `fileSelect://`+$.toString(()=>{
                    updateItem(getMyVar('编辑类别') + '图标id' + getMyVar('按钮索引'), {
                        img: 'file://' + input
                    })
                    updateItem("图标编辑input", {
                        desc: '已选择本地图',
                    });
                    let imgtype = getMyVar('编辑类别', '主页') + '图标';
                    let currentTheme = storage0.getMyVar('currentTheme', {});
                    let imgs = currentTheme[imgtype] || [];
                    let i = parseInt(getMyVar('按钮索引', '0'));
                    //记录图标上一个状态
                    let 图标临时记录 = storage0.getMyVar('图标临时记录', {});
                    图标临时记录[getMyVar('编辑类别') + '图标id' + getMyVar('按钮索引')] = imgs[i]?(imgs[i].img || ''):'';
                    storage0.putMyVar('图标临时记录', 图标临时记录);
                    //更新新图标
                    imgs[i] = {img: 'file://' + input, color: (imgs[i]||{}).color||undefined};
                    currentTheme[imgtype] = imgs;
                    storage0.putMyVar('currentTheme', currentTheme);
                }),
                extra: {
                    id: '本地选择',
                    cls: '图标编辑组件',
                    backgroundColor: '#FB9966'
                }
            })
            d.push({
                title: `““””撤销`,
                col_type: 'text_3',
                url: $('#noLoading#').lazyRule(() => {
                    //查询图标上一个状态
                    let 图标临时记录 = storage0.getMyVar('图标临时记录', {});
                    let oldimg = 图标临时记录[getMyVar('编辑类别') + '图标id' + getMyVar('按钮索引')] || '';
                    if(oldimg){
                        //恢复原图标
                        updateItem(getMyVar('编辑类别') + '图标id' + getMyVar('按钮索引'), {
                            img: oldimg
                        })
                        updateItem("图标编辑input", {
                            desc: '已恢复上一个图标',
                        });
                        //记录图标
                        let imgtype = getMyVar('编辑类别', '主页') + '图标';
                        let currentTheme = storage0.getMyVar('currentTheme', {});
                        let imgs = currentTheme[imgtype] || [];
                        let i = parseInt(getMyVar('按钮索引', '0'));
                        //更新原图标
                        imgs[i] = {img: oldimg, color: (imgs[i]||{}).color||undefined};
                        currentTheme[imgtype] = imgs;
                        storage0.putMyVar('currentTheme', currentTheme);
                        return 'toast://已恢复';
                    }
                    return 'toast://无记录';
                }),
                extra: {
                    id: '撤销',
                    cls: '图标编辑组件',
                }
            })

            d.push({
                title: '',
                desc: '输入图标地址',
                url: $.toString(() => {
                    input = input.trim();
                    if(!input){
                        return 'toast://输入不能为空';
                    }
                    let imgtype = getMyVar('编辑类别', '主页') + '图标';
                    let currentTheme = storage0.getMyVar('currentTheme', {});
                    let imgs = currentTheme[imgtype] || [];
                    let i = parseInt(getMyVar('按钮索引', '0'));
                    //记录图标上一个状态
                    let 图标临时记录 = storage0.getMyVar('图标临时记录', {});
                    图标临时记录[getMyVar('编辑类别') + '图标id' + getMyVar('按钮索引')] = imgs[i]?(imgs[i].img || ''):'';
                    storage0.putMyVar('图标临时记录', 图标临时记录);
                    //更新新图标
                    imgs[i] = {img: input, color: (imgs[i]||{}).color||undefined};
                    currentTheme[imgtype] = imgs;
                    storage0.putMyVar('currentTheme', currentTheme);
                    updateItem(getMyVar('编辑类别') + '图标id' + getMyVar('按钮索引'), {
                        img: input
                    });
                    return 'hiker://empty';
                }),
                col_type: 'input',
                extra: {
                    defaultValue: '',
                    id: '图标编辑input',
                    cls: '图标编辑组件'
                }
            })
            return d
        }
        let 编辑d = 编辑组件();
        let datas = [{
            'type': '主页',
            'name': ['切源', '频道', '搜索', '收藏', '管理']
        }, {
            'type': '二级',
            'name': ['简介', '书架', '换源', '详情', '搜索']
        },
        {
            'type': '书架',
            'name': ['本地下载', '切换样式', '收藏列表']
        }, {
            'type': '接口',
            'name': ['增加', '操作', '导入', '分享']
        }]

        let icon5_col = (MY_NAME=="海阔视界"&&getAppVersion()>=5579)||(MY_NAME=="嗅觉浏览器"&&getAppVersion()>=2322) ? 'icon_5_no_crop' : 'icon_5';
        datas.forEach((data) => {
            let type_name = data.type;
            d.push({
                title: `““””<font color=#B5B5B5>${type_name}图标</font>`,
                col_type: 'text_1',
                url: 'hiker://empty'
            })
            let imgs = currentTheme[type_name + '图标'] || [];
            imgs = imgs.map((v)=>{
                return {
                    img: $.type(v)=='object'?v.img:v,
                    color: $.type(v)=='object'?v.color||'':''
                }
            })
            data.name.forEach((it, i) => {
                let icon_name = it;
                let icon_img = getIcon((imgs[i]||{}).img, false, (imgs[i]||{}).color);
                d.push({
                    title: icon_name,
                    img: icon_img,
                    col_type: type_name == '接口' ? 'icon_small_4' : type_name == '二级' ? 'icon_small_3' : type_name == '书架' ? 'icon_small_3' : icon5_col,
                    url: themename=='原生主题'?'hiker://empty':$('#noLoading#').lazyRule((type_name, icon_name, i, 编辑d) => {
                        //还原上一个图标名称
                        updateItem(getMyVar('编辑类别') + '图标id' + getMyVar('按钮索引'), {
                            title: getMyVar('按钮名称'),
                        });
                        
                        //执行按钮编辑组件变换
                        if (getMyVar('编辑类别') == type_name && getMyVar('按钮索引') == i && getMyVar('编辑组件状态', '1') == '1') {
                            deleteItemByCls('图标编辑组件');
                            putMyVar('编辑组件状态', '0');
                            updateItem(type_name + '图标id' + i, {
                                title: icon_name,
                            });
                        } else if (getMyVar('编辑类别') != type_name || getMyVar('编辑组件状态', '0') == '0') {
                            deleteItemByCls('图标编辑组件');
                            addItemAfter(type_name + 'add', 编辑d);
                            putMyVar('编辑组件状态', '1');
                        }
                        updateItem("图标编辑input", {
                            desc: `输入地址修改［${icon_name}］`
                        });
                        
                        //修正当前选中按钮图标
                        let font;
                        if (type_name == '二级' || type_name == '书架') {
                            font = '';
                        } else {
                            font = '““””';
                        }
                        if (getMyVar('编辑组件状态', '1') == '1') {
                            updateItem(type_name + '图标id' + i, {
                                title: `${font}<b><font color=#F4A7B9>${icon_name}</font></b>`,
                            });
                        }
                        
                        //记录当前选中的按钮信息
                        putMyVar('按钮索引', i);
                        putMyVar('按钮名称', icon_name);
                        putMyVar('编辑类别', type_name);

                        //处理增加底部空白
                        deleteItemByCls('底部增加空白区');
                        let addnum = 0;
                        if(type_name=='接口'){
                            addnum = 4;
                        }else if(type_name=='书架'){
                            addnum = 2;
                        }
                        let d = [];
                        for(let i=0;i<addnum;i++){
                            d.push({
                                title: "",
                                url: "hiker://empty",
                                col_type: "text_1",
                                extra: {
                                    cls: '底部增加空白区',
                                    lineVisible: false
                                }
                            })
                        }
                        addItemAfter('icondownid', d);
                        return 'hiker://empty';
                    }, type_name, icon_name, i, 编辑d),
                    extra: {
                        id: type_name + '图标id' + i,
                    }
                })
            })
            d.push({
                col_type: 'blank_block',
                extra: {
                    id: type_name + 'add',
                }
            })
            d.push({
                col_type: 'line_blank'
            })
        })

        
    }

    d.push({
        col_type: 'big_blank_block',
    })
    d.push({
        title: '恢复|清空',
        url: $().lazyRule(() => {
            clearItem('currentTheme');
            clearMyVar('currentTheme');
            clearMyVar('themeList');
            refreshPage(true);
            return 'toast://已恢复使用原生自带';
        }),
        col_type: 'text_3',
        extra: {
            longClick: [{
                title: "清空主题",
                js: $.toString((rulepath) => {
                    return $("清空本地所有主题，确认？").confirm((rulepath)=>{
                        deleteFile(rulepath + 'themes.json');
                        clearMyVar('currentTheme');
                        clearMyVar('themeList');
                        refreshPage(true);
                        return 'toast://已清空';
                    },rulepath)
                },rulepath)
            }]
        }
    })
    d.push({
        title: '““””<font color=#94B5B0>保存|应用</font>',
        url: !themename ? 'toast://没有主题' : $().lazyRule((rulepath, themename) => {
            let currentTheme = storage0.getMyVar('currentTheme', {});
            if (!themename) {
                return 'toast://没有主题'
            } else if (!currentTheme.主页图标) {
                return 'toast://新建主题没有内容';
            }

            Object.keys(currentTheme).forEach(it=>{
                if($.type(currentTheme[it])=='array'){
                    currentTheme[it].forEach(v=>{
                        if($.type(v)=='object' && !v.img.startsWith(rulepath) && !v.img.startsWith('http')){
                            let newimg = rulepath+'themes/'+themename+v.img.substr(v.img.lastIndexOf('/')).replace('_fileSelect_','').replace('_storage_emulated_0_','');
                            saveImage(getPath(v.img).replace('file://',''), newimg);
                            v.img = newimg;
                        }
                    })
                }
            })

            let themeList = storage0.getMyVar('themeList', []);
            themeList = themeList.filter(v => v.名称 != themename);
            themeList.push(currentTheme);
            writeFile(rulepath + 'themes.json', JSON.stringify(themeList));
            storage0.setItem('currentTheme', currentTheme);//保存为当前主题
            storage0.putMyVar('currentTheme', currentTheme);
            storage0.putMyVar('themeList', themeList);
            refreshPage(true);
            return 'toast://已保存并生效';
        }, rulepath, themename),
        col_type: 'text_3'
    })
    d.push({
        title: '导入|分享',
        url: $().lazyRule(() => {
            return $("", "输入聚阅主题分享口令").input(() => {
                let pasteurl = aesDecode('Juyue', input.split('￥')[1]);
                let inputname = input.split('￥')[0];
                if (inputname == '聚阅主题') {
                    function saveBase64Image(base64Str, savePath) {
                        const File = java.io.File;
                        const FileOutputStream = java.io.FileOutputStream;

                        try {
                            // 移除可能的base64前缀
                            let pureBase64 = base64Str.replace(/^data:image\/\w+;base64,/, "");
                            // 解码
                            let bytes = _base64.decode(pureBase64, _base64.NO_WRAP);
                            // 处理保存路径
                            let fullPath = getPath(savePath).replace("file://", "");
                            // 确保目录存在
                            let file = new File(fullPath);
                            let parent = file.getParentFile();
                            if (!parent.exists()) {
                                parent.mkdirs();
                            }
                            // 写入文件
                            let fos = new FileOutputStream(file);
                            fos.write(bytes);
                            fos.close();
                            return;
                        } catch (e) {
                            //xlog("保存图片失败：" + e);
                            return;
                        }
                    }
                    

                    try {
                        let text;
                        if(/^http|^云/.test(pasteurl)){
                            showLoading('获取数据中，请稍后...');
                            text = parsePaste(pasteurl);
                            hideLoading();
                        }
                        if(text && !/^error/.test(text)){
                            let importTheme = [];
                            try{
                                let gzip = $.require(codePath + "plugins/gzip.js");
                                importTheme = JSON.parse(gzip.unzip(parsePaste(pasteurl)));
                            }catch(e){
                                importTheme = JSON.parse(parsePaste(pasteurl));//兼容一下旧的分享口令
                            }
                            Object.keys(importTheme).forEach(it=>{
                                if($.type(importTheme[it])=='array'){
                                    importTheme[it].forEach(v=>{
                                        if($.type(v)=='object' && !v.img.startsWith('http') && v.imgb64){
                                            v.img = 'hiker://files/_cache/Juyue/themes/' + importTheme.名称 + v.img.substr(v.img.lastIndexOf('/'));
                                            saveBase64Image(v.imgb64, v.img);
                                            delete v.imgb64;
                                        }
                                    })
                                }
                            })

                            storage0.putMyVar('currentTheme', importTheme);
                            refreshPage();
                            return 'toast://确定需要，则要保存';
                        }else{
                            return 'toast://获取失败>' + text;
                        }
                    } catch (e) {
                        return 'toast://口令异常';
                    }
                }
                return 'toast://不是聚阅主题口令';
            })
        }),
        col_type: 'text_3',
        extra: {
            longClick: [{
                title: "主题分享",
                js: $.toString((themename) => {
                    let currentTheme = storage0.getMyVar('currentTheme', {});
                    if (!themename) {
                        return 'toast://没有主题'
                    } else if (!currentTheme.主页图标) {
                        return 'toast://新建主题没有内容';
                    } else if (themename=='原生主题') {
                        return 'toast://原生主题无法分享';
                    }

                    let themeList = storage0.getMyVar('themeList', []).filter(v => v.名称 == themename);
                    if (themeList.length == 1) {
                        Object.keys(currentTheme).forEach(it=>{
                            if($.type(currentTheme[it])=='array'){
                                currentTheme[it].forEach(v=>{
                                    if($.type(v)=='object' && !v.img.startsWith('http')){
                                        v.imgb64 = convertBase64Image(v.img);
                                    }
                                })
                            }
                        })

                        let gzip = $.require(codePath + "plugins/gzip.js");
                        let sharetxt = gzip.zip(JSON.stringify(currentTheme));

                        let pastes = getPastes();
                        return $(pastes,2).select((sharetxt,themename)=>{
                            let pasteurl = sharePaste(sharetxt, input);
                            if (/^http|^云/.test(pasteurl) && pasteurl.includes('/')) {
                                let code = '聚阅主题￥' + aesEncode('Juyue', pasteurl) + '￥' + themename;
                                copy(code);
                                return "toast://分享口令已生成";
                            } else {
                                xlog('分享失败>' + pasteurl);
                                return "toast://分享失败，剪粘板或网络异常>" + pasteurl;
                            }
                        }, sharetxt, themename)
                    }
                    return 'toast://异常';
                }, themename)
            }]
        }

    })
    d.push({
        title: "““””<small><font color=#bfbfbf>" + '着色功能仅对.svg格式图标有效' + "</font></small>",
        col_type: "text_center_1",
        url: 'hiker://empty',
        extra: {
            lineVisible: false,
        }
    })
    d.push({
        title: "",
        url: "hiker://empty",
        col_type: "text_1",
        extra: {
            id: 'icondownid',
            lineVisible: false
        }
    })

    setResult(d);
}
// 只显示名称相近的接口
function similarTitles(items, similarityThreshold) {
    // 设置默认相似度阈值
    similarityThreshold = similarityThreshold || 0.8;
    
    // 计算两个字符串的相似度（0~1）
    function similarity(s1, s2) {
        var longer = s1.length > s2.length ? s1 : s2;
        var shorter = s1.length > s2.length ? s2 : s1;
        var longerLength = longer.length;
        if (longerLength === 0) return 1.0;
        
        var distance = levenshteinDistance(longer, shorter);
        return (longerLength - distance) / longerLength;
    }

    // Levenshtein 距离计算
    function levenshteinDistance(s, t) {
        if (s === t) return 0;
        if (s.length === 0) return t.length;
        if (t.length === 0) return s.length;

        var dp = [];
        for (var i = 0; i <= s.length; i++) {
            dp[i] = [];
            dp[i][0] = i;
        }
        for (var j = 0; j <= t.length; j++) {
            dp[0][j] = j;
        }

        for (i = 1; i <= s.length; i++) {
            for (j = 1; j <= t.length; j++) {
                var cost = s[i - 1] === t[j - 1] ? 0 : 1;
                dp[i][j] = Math.min(
                    dp[i - 1][j] + 1,     // 删除
                    dp[i][j - 1] + 1,     // 插入
                    dp[i - 1][j - 1] + cost // 替换
                );
            }
        }
        return dp[s.length][t.length];
    }

    // 1. 先分组
    var groups = [];
    var visited = {};

    for (var i = 0; i < items.length; i++) {
        if (visited[i]) continue;

        var currentGroup = [items[i]];
        visited[i] = true;

        // 查找所有与当前对象相似的
        for (var j = 0; j < items.length; j++) {
            if (i === j || visited[j]) continue;

            var sim = similarity(
                items[i].name.toLowerCase(),
                items[j].name.toLowerCase()
            );

            if (sim >= similarityThreshold) {
                currentGroup.push(items[j]);
                visited[j] = true;
            }
        }

        // 只保留相似项≥2的组
        if (currentGroup.length >= 2) {
            groups.push(currentGroup);
        }
    }

    // 2. 扁平化分组
    var result = [];
    for (var g = 0; g < groups.length; g++) {
        for (var k = 0; k < groups[g].length; k++) {
            result.push(groups[g][k]);
        }
    }

    return result;
}