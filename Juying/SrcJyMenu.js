//本代码仅用于个人学习，请勿用于其他作用，下载后请24小时内删除，代码虽然是公开学习的，但请尊重作者，应留下说明
let getIcon = globalMap0.getVar('Src_Jy_gmParams').getIcon;
//二级统一菜单
function erjimenu(desc,name,group) {
    return [
        {
            title: "详情简介",
            url: $("#noLoading#").lazyRule((desc) => {
                if (getMyVar('Src_Jy_二级简介打开标识') == "1") {
                    clearMyVar('Src_Jy_二级简介打开标识');
                    deleteItemByCls("SrcJudescload");
                } else {
                    putMyVar('Src_Jy_二级简介打开标识', "1");
                    addItemAfter('detailid', [{
                        title: `<font color="#098AC1">详情简介 </font><small><font color="#f47983"> ::</font></small>`,
                        col_type: "avatar",
                        url: $("#noLoading#").lazyRule(() => {
                            clearMyVar('Src_Jy_二级简介打开标识');
                            deleteItemByCls("SrcJudescload");
                            return "hiker://empty";
                        }),
                        pic_url: globalMap0.getVar('Src_Jy_gmParams').getIcon("点播-简介.svg"),
                        extra: {
                            cls: "SrcJudescload"
                        }
                    }, {
                        title: desc,
                        col_type: "rich_text",
                        extra: {
                            cls: "SrcJudescload"
                        }
                    }]);
                }
                return "hiker://empty";
            }, desc || ""),
            pic_url: getIcon("点播-详情简介.svg"),
            col_type: 'icon_small_3',
            extra: {
                cls: "Juloadlist"
            }
        },
        {
            title: "观看设置",
            url: $('hiker://empty#noRecordHistory##noHistory#').rule(() => {
                require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyMenu.js');
                lookset();
            }),
            pic_url: getIcon("点播-观看设置.svg"),
            col_type: 'icon_small_3',
            extra: {
                cls: "Juloadlist"
            }
        },
        {
            title: "切换站源",
            url: !fileExist(jkfile) ? "toast://聚搜、分享页面，无法扩展更多片源" : $("#noLoading#").lazyRule((name,group) => {
                require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyMenu.js');
                cutSource(name,group);
                return  "hiker://empty";
            },name, group),
            pic_url: getIcon("点播-切换站源.svg"),
            col_type: 'icon_small_3',
            extra: {
                cls: "Juloadlist",
                longClick: [{
                    title: "指定接口",
                    js: $.toString((name,group) => {
                        return $("", "输入指定接口").input((name,group)=>{
                            deleteItemByCls('Juloadlist');
                            let updateItemid = group + "_" +name + "_loading";
                            updateItem(updateItemid+'2', {
                                extra: {"id":updateItemid,"lineVisible":false}
                            })
                            require(config.聚影.replace(/[^/]*$/,'') + 'SrcJuying.js');
                            let ssdatalist = getSearchLists().filter(v=>v.name.includes(input));
                            erjisousuo(name, group, ssdatalist);
                            return "hiker://empty";
                        },name,group)
                    },name,group)
                }]
            }
        }
    ]
}

//切源事件
function cutSource(name, group) {
    putMyVar("Src_Jy_切源旧分组", group);
    require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyPublic.js');
    let datalist = getDatas('jk',1).filter(v=>v.searchable!=0);
    let groups = getJiekouGroups(datalist).concat(['云盘']);
    let grouparr = [];
    let color = getItem("主题颜色", "#6dc9ff");//#3399cc
    groups.forEach(it=>{
        grouparr.push({
            title: group==it?`““””<b><span style="color: `+color+`">`+it+`</span></b>`:it,
            url: $('#noLoading#').lazyRule((name,newgroup) => {
                let oldgroup = getMyVar("Src_Jy_切源旧分组","");
                if(oldgroup==newgroup){
                    return "hiker://empty";
                }
                updateItem("id_"+oldgroup, {
                    title: oldgroup
                })
                updateItem("id_"+newgroup, {
                    title: `““””<b><span style="color: `+getItem("主题颜色", "#6dc9ff")+`">`+newgroup+`</span></b>`
                })
                updateItem(oldgroup+"_"+name+"_loading", {
                    extra: {"id":newgroup+"_"+name+"_loading","lineVisible":false}
                })
                deleteItemByCls('grouploadlist');
                putMyVar("Src_Jy_切源旧分组", newgroup);
                if(newgroup=="云盘"){
                    require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyAliDisk.js');
                    erjiSousuo(name);
                }else{
                    require(config.聚影.replace(/[^/]*$/,'') + 'SrcJuying.js');
                    erjisousuo(name, newgroup, undefined);
                }
                return 'toast://切源分组已切为：' + newgroup;
            }, name, it),
            col_type: "scroll_button",
            extra: {
                id: "id_"+it,
                cls: "Juloadlist"
            }
        })
    })
    
    deleteItemByCls('Juloadlist');
    let updateItemid = group + "_" +name + "_loading";
    updateItem(updateItemid+'2', {
        extra: {"id":updateItemid,"lineVisible":false}
    })
    addItemBefore(updateItemid, grouparr);// 生成切源分组
    if(group=="云盘"){
        require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyAliDisk.js');
        erjiSousuo(name);
    }else{
        require(config.聚影.replace(/[^/]*$/,'') + 'SrcJuying.js');
        erjisousuo(name, group, undefined);
    }
}

function lookset() {
    addListener("onClose", $.toString(() => {
        clearMyVar('playSet');
    }));
    if(!config.聚影 && getPublicItem('聚影','')){
        initConfig({
            聚影: getPublicItem('聚影','')
        });
    }
    require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyPublic.js');
    setPageTitle("点播二级观看设置");
    let recordfile = rulepath + "parse.json";//解析相关记录文件
    let parseRecord = {};
    if(fetch(recordfile)){
        try{
            eval("parseRecord =" + fetch(recordfile) + ";");
        }catch(e){}
    }

    let playSet = storage0.getMyVar('playSet') || storage0.getItem('playSet') || Juconfig['playSet'] || {};
    clearItem('playSet');

    let d = [];
    let 箭头图标 = getIcon("点播-箭头.svg");
    d.push({
        col_type: "line_blank"
    });
    d.push({
        title: '功能管理',
        pic_url: getIcon("点播-功能开关.svg"),
        col_type: "avatar",
        url: "hiker://empty"
    });
    d.push({
        title: '本地解析管理',
        url: $('#noLoading#').lazyRule(() => {
            if(getItem("sourceMode")=="2"){
                return "toast://订阅文件模式，无法管理本地解析";
            }
            putMyVar('guanli','jx');
            return $("hiker://empty#noRecordHistory##noHistory#").rule(() => {
                setPageTitle('解析管理');
                require(config.聚影.replace(/[^/]*$/,'') + 'SrcJySet.js');
                SRCSet();
            })
        }),
        pic_url: 箭头图标,
        col_type: "text_icon"
    });
    d.push({
        title: '解析日志打印',
        url: $('#noLoading#').lazyRule((playSet) => {
            if (playSet['printlog'] != 1) {
                playSet['printlog'] = 1;
            } else {
                playSet['printlog'] = 0;
            }
            storage0.putMyVar('playSet', playSet);
            refreshPage(false);
            return 'toast://切换成功';
        }, playSet),
        pic_url: playSet['printlog']?getIcon("点播-开.svg"):getIcon("关.svg"),
        col_type: "text_icon"
    });
    if(MY_RULE.title=="聚影"){
        d.push({
            col_type: "line_blank"
        });
        d.push({
            title: '分页设置',
            pic_url: getIcon("点播-分页设置.svg"),
            col_type: "avatar",
            url: "hiker://empty"
        });
        let partpage = storage0.getItem('partpage') || {};
        d.push({
            title: '选集列表分页',
            url: $('#noLoading#').lazyRule((partpage) => {
                if (partpage['ispage'] != 1) {
                    partpage['ispage'] = 1;
                } else {
                    partpage['ispage'] = 0;
                }
                storage0.setItem('partpage', partpage);
                refreshPage(false);
                return 'toast://切换成功';
            }, partpage),
            pic_url: partpage['ispage']?getIcon("点播-开.svg"):getIcon("关.svg"),
            col_type: "text_icon"
        });
        d.push({
            title: '每页数量：'+(partpage['pagenum']||40),
            url: $(partpage['pagenum']||"40","每页选集数量").input((partpage) => {
                partpage['pagenum'] = parseInt(input);
                storage0.setItem('partpage',partpage);
                refreshPage(false);
                return 'hiker://empty'
            },partpage),
            pic_url: 箭头图标,
            col_type: "text_icon"
        });
        d.push({
            title: '分页阀值：'+(partpage['partnum']||100),
            url: $(partpage['partnum']||"100","选集数量超过多少才分页").input((partpage) => {
                partpage['partnum'] = parseInt(input);
                storage0.setItem('partpage',partpage);
                refreshPage(false);
                return 'hiker://empty'
            },partpage),
            pic_url: 箭头图标,
            col_type: "text_icon"
        });
    }
    d.push({
        col_type: "line_blank"
    });
    d.push({
        title: '解析设置',
        pic_url: getIcon("点播-解析设置.svg"),
        col_type: "avatar",
        url: "hiker://empty"
    });
    let parsemode = playSet["parsemode"] || 1;
    d.push({
        title: '聚影智能',
        url: $('#noLoading#').lazyRule((playSet) => {
            playSet['parsemode'] = 1;
            storage0.putMyVar('playSet', playSet);
            refreshPage(false);
            return 'toast://聚影智能 | 上次优先>接口自带+私有解析';
        }, playSet),
        pic_url: parsemode==1?getIcon("点播-开.svg"):getIcon("关.svg"),
        col_type: "text_icon"
    });
    d.push({
        title: '强制嗅探',
        url: $('#noLoading#').lazyRule((playSet) => {
            playSet['parsemode'] = 2;
            storage0.putMyVar('playSet', playSet);
            refreshPage(false);
            return 'toast://强制嗅探 | 将web解析组线路进video播放器';
        }, playSet),
        pic_url: parsemode==2?getIcon("点播-开.svg"):getIcon("关.svg"),
        col_type: "text_icon"
    });
    d.push({
        title: '手动切换',
        url: $('#noLoading#').lazyRule((playSet) => {
            playSet['parsemode'] = 3;
            storage0.putMyVar('playSet', playSet);
            refreshPage(false);
            return 'toast://手动切换 | 代理播放，在播放页手动选择解析';
        }, playSet),
        pic_url: parsemode==3?getIcon("点播-开.svg"):getIcon("关.svg"),
        col_type: "text_icon"
    });
    d.push({
        col_type: "line"
    });
    d.push({
        title: '嗅探内核：'+(playSet['xiutannh']||"web"),
        url: $('#noLoading#').lazyRule((playSet) => {
            let sm;
            if(playSet['xiutannh'] == 'x5'){
                playSet['xiutannh'] = 'web';
                sm = 'web';
            }else{
                playSet['xiutannh'] = 'x5';
                sm = 'x5';
            }
            storage0.putMyVar('playSet', playSet);
            refreshPage(false);
            return 'toast://嗅探内核切换为：'+sm;
        }, playSet),
        pic_url: 箭头图标,
        col_type: "text_icon"
    });
    d.push({
        title: '嗅探方式：'+(playSet['video']!=0?"video":"WebRule"),
        url: $('#noLoading#').lazyRule((playSet) => {
            if (playSet['video'] != 0) {
                playSet['video'] = 0;
            } else {
                playSet['video'] = 1;
            }
            storage0.putMyVar('playSet', playSet);
            refreshPage(false);
            return 'toast://已切换';
        }, playSet),
        pic_url: 箭头图标,
        col_type: "text_icon"
    });
    d.push({
        col_type: "line"
    });
    d.push({
        title: '无效播放地址',
        url: $("", "输入无法播放的地址进行屏蔽").input((parseRecord, recordfile) => {
            parseRecord['excludeurl'] = parseRecord['excludeurl'] || [];
            let url = input.split(';{')[0].replace(/file.*video\.m3u8##/, '').replace('#isVideo=true#', '');
            if (parseRecord['excludeurl'].indexOf(url) == -1) {
                parseRecord['excludeurl'].push(url);
            }
            writeFile(recordfile, JSON.stringify(parseRecord));
            return 'toast://对此播放地址将拦截';
        }, parseRecord, recordfile),
        pic_url: 箭头图标,
        col_type: "text_icon"
    });
    d.push({
        title: '清空播放拦截记录',
        url: $("清空拦截无法播放地址记录？").confirm((parseRecord, recordfile) => {
            delete parseRecord['excludeurl'];
            writeFile(recordfile, JSON.stringify(parseRecord));
            return 'toast://无清空';
        }, parseRecord, recordfile),
        pic_url: 箭头图标,
        col_type: "text_icon"
    });
    d.push({
        col_type: "line"
    });
    d.push({
        title: 'm3u8索引文件缓存',
        url: $('#noLoading#').lazyRule((playSet) => {
            if (playSet['cachem3u8'] != 1) {
                playSet['cachem3u8'] = 1;
            } else {
                playSet['cachem3u8'] = 0;
            }
            storage0.putMyVar('playSet', playSet);
            refreshPage(false);
            return 'toast://切换成功';
        }, playSet),
        pic_url: playSet['cachem3u8']?getIcon("点播-开.svg"):getIcon("关.svg"),
        col_type: "text_icon"
    });
    d.push({
        title: '解析结果有效性检测',
        desc: "除video方式外，其他解析结果是否开启检测",
        url: $('#noLoading#').lazyRule((playSet) => {
            if (playSet['isTest']) {
                playSet['isTest'] = 0;
            } else {
                playSet['isTest'] = 1;
            }
            storage0.putMyVar('playSet', playSet);
            refreshPage(false);
            return 'toast://切换成功';
        }, playSet),
        pic_url: playSet['isTest']?getIcon("点播-开.svg"):getIcon("关.svg"),
        col_type: "text_icon"
    });
    d.push({
        title: '调用dm盒子弹幕',
        url: $('#noLoading#').lazyRule((playSet) => {
            let sm;
            if (playSet['dmRoute']) {
                playSet['dmRoute'] = 0;
                sm = '关闭dm盒子弹幕';
            } else {
                playSet['dmRoute'] = 1;
                sm = '仅针对官网地址有效，需要dm盒子小程序';
            }
            storage0.putMyVar('playSet', playSet);
            refreshPage(false);
            return 'toast://' + sm;
        }, playSet),
        pic_url: playSet['dmRoute']?getIcon("点播-开.svg"):getIcon("关.svg"),
        col_type: "text_icon"
    });
    d.push({
        col_type: "line"
    });
    d.push({
        title: 'M3U8广告清除规则',
        url: $('#noLoading#').lazyRule((playSet) => {
            if (playSet['clearM3u8Ad']) {
                delete playSet['clearM3u8Ad'];
                storage0.putMyVar('playSet', playSet);
                refreshPage(false);
                return 'toast://关闭订阅M3U8广告清除规则';
            } else {
                return $("确认要从聚影订阅M3U8广告清除规则来覆盖软件的？").confirm((playSet)=>{
                    playSet['clearM3u8Ad'] = 1;
                    storage0.putMyVar('playSet', playSet);
                    let m3u8Ad_file = config.聚影.replace(/[^/]*$/,'') + "plugins/m3u8_ad_rule.json";
                    let m3u8Ad = fetch(m3u8Ad_file);
                    if(m3u8Ad){
                        writeFile("hiker://files/rules/m3u8_ad_rule.json", m3u8Ad);
                        refreshPage(false);
                        return "toast://开启订阅并已替换软件播放器的M3U8广告清除规则，重启软件生效";
                    }else{
                        refreshPage(false);
                        return "toast://开启订阅";
                    }
                },playSet)
            }
        }, playSet),
        pic_url: playSet['clearM3u8Ad']?getIcon("点播-开.svg"):getIcon("关.svg"),
        col_type: "text_icon",
        extra: {
            longClick: [{
                title: "清除播放器规则",
                js: $.toString(() => {
                    writeFile("hiker://files/rules/m3u8_ad_rule.json", "");
                    return "toast://已清除软件播放器的M3U8广告清除规则，重启软件生效";
                })
            }]
        }
    });
    d.push({
        title: '<br>',
        col_type: 'rich_text'
    });
    setResult(d);
    Juconfig['playSet'] = playSet;
    writeFile(cfgfile, JSON.stringify(Juconfig));
}
//主页导航按钮菜单
let menubtns = ["管理", "历史", "收藏", "点播", "直播", "Alist", "云盘"];
let nochange = getItem('主页大图标不变化','0');
let buttonmenu = {
    "管理": {
        img: getIcon("主页-管理.svg", nochange),//"https://hikerfans.com/tubiao/more/129.png",
        url: $("hiker://empty#noRecordHistory##noHistory#").rule(() => {
            require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyMenu.js');
            manageSet();
        })
    },
    "历史": {
        img: getIcon("主页-历史.svg", nochange),//"https://hikerfans.com/tubiao/more/213.png",
        url: "hiker://history?rule=" + MY_RULE.title
    },
    "收藏": {
        img: getIcon("主页-收藏.svg", nochange),//"https://hikerfans.com/tubiao/more/109.png",
        url: "hiker://collection?rule=" + MY_RULE.title
    },
    "点播": {
        img: getIcon("主页-点播.svg", nochange),//"https://hikerfans.com/tubiao/more/105.png",
        url: $("hiker://empty##fypage#noRecordHistory##noHistory#").rule(() => {
            require(config.聚影.replace(/[^/]*$/,'') + 'SrcJuying.js');
            dianboyiji();
        })
    },
    "直播": {
        img: getIcon("主页-直播.svg", nochange),//"https://hikerfans.com/tubiao/more/87.png",
        url: $("hiker://empty#noRecordHistory##noHistory#").rule(() => {
            require(config.聚影.replace(/[^/]*$/,'') + 'SrcLive.js');
            Live();
        })
    },
    "Alist": {
        img: getIcon("主页-Alist.svg", nochange),//"https://hikerfans.com/tubiao/more/226.png",//hiker://files/cache/src/Alist.svg
        url: $("hiker://empty###noRecordHistory##noHistory#").rule(() => {
            require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyAlist.js');
            alistHome();
        })
    },
    "云盘": {
        img: getIcon("主页-云盘.svg", nochange),//"https://hikerfans.com/tubiao/more/97.png",
        url: $("hiker://empty#noRecordHistory##noHistory#").rule(() => {
            require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyAliDisk.js');
            aliMyDisk();
        })
    }
}
//管理中心
function manageSet(){
    addListener("onClose", $.toString(() => {
        //refreshPage(false);
    }));
    setPageTitle("♥管理"+getMyVar('Src_Jy_Version', ''));

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
        title: '指定聚影代码库',
        img: getIcon("管理-箭头.svg"),
        url: $(getItem('依赖', ''),"手工指定聚影代码库地址").input(()=>{
            return $("确定要指定聚影代码库地址"+input).confirm((input)=>{
                if(input && (!input.startsWith("http") || !input.endsWith("SrcJuying.js"))){
                    return "toast://输入有误"
                }
                input = input.trim();
                setItem('依赖', input);
                initConfig({
                    依赖: input
                })
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
    d.push({
        title: '规则日志打印',
        img: getItem('规则日志打印')=="1"?getIcon("管理-开.svg"):getIcon("关.svg"),
        url: $("#noLoading#").lazyRule(() => {
            if(getItem('规则日志打印')=="1"){
                clearItem('规则日志打印');
            }else{
                setItem('规则日志打印','1');
            }
            refreshPage();
            return 'hiker://empty';
        }),
        col_type: 'text_icon'
    });
    d.push({
        title: 'drpy调试日志打印',
        img: getItem('drpy调试日志')=="1"?getIcon("管理-开.svg"):getIcon("关.svg"),
        url: $("#noLoading#").lazyRule(() => {
            if(getItem('drpy调试日志')=="1"){
                clearItem('drpy调试日志');
            }else{
                setItem('drpy调试日志','1');
            }
            refreshPage();
            return 'toast://重启软件后生效';
        }),
        col_type: 'text_icon'
    });
    d.push({
        col_type: "line_blank"
    });
    d.push({
        title: '关于聚影',
        img: getIcon("聚影.svg"),
        col_type: 'avatar',
        url: 'toast://哥就是帅'
    });
    d.push({
        title: '主页显示点播',
        img: getItem('主页显示点播')=="1"?getIcon("管理-开.svg"):getIcon("关.svg"),
        url: $("#noLoading#").lazyRule(() => {
            if(getItem('主页显示点播')=="1"){
                clearItem('主页显示点播');
            }else{
                setItem('主页显示点播','1');
            }
            refreshPage();
            return 'toast://设置成功，返回主页刷新';
        }),
        col_type: 'text_icon'
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
        title: '检测版本更新',
        img: getIcon("管理-箭头.svg"),
        col_type: 'text_icon',
        url: $("#noLoading#").lazyRule(() => {
            if(!getItem("依赖","")){
                return "toast://代码库获取异常，无法更新！";
            }
            if(!getItem("依赖","").startsWith("http")){
                return "toast://非在线代码库，无法更新！";
            }
            try{
                eval(request(getItem("依赖","").replace(/[^/]*$/,'') + 'SrcTmplVersion.js'))
                let nowVersion = getItem('Version', getMyVar('Src_Jy_Version', '0.1').replace('-V',''));
                let nowtime = Date.now();
                if (parseFloat(newVersion.SrcJuying) > parseFloat(nowVersion)) {
                    confirm({
                        title: '发现新版本，是否更新？', 
                        content: '本地V'+nowVersion+' => 云端V'+newVersion.SrcJuying, 
                        confirm: getItem('本地依赖库')=="1"?$.toString((codeDownload) => {
                            return "web://" + codeDownload;
                        },newVersion.codeDownload):$.toString((nowtime,newVersion) => {
                            setItem('Version', newVersion);
                            setItem('VersionChecktime', nowtime+'time');
                            deleteCache();
                            putMyVar('Src_Jy_Version', '-V'+newVersion);
                            refreshPage();
                        },nowtime, newVersion.SrcJuying),
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
        url: config.聚影.replace(/[^/]*$/,'') + 'img/pay.jpg'
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
                3. 本小程序用于部分box源接口测试，并非所有接口都支持。<br>
                4. 本小程序仅用于个人学习研究，请于导入24小时内删除！<br>
                <b>开始使用本规则即代表遵守规则条例</b><br>
                
        </small>`,
        col_type: 'rich_text'
    });
    setResult(d);
}
