//引入Ali公用文件
require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyAliPublic.js');
let folderFilter = new RegExp("优惠券|资源群|头像订阅|GT容量|购买年超级会员|买会员享|关注公众号|返佣金|关注QQ|QQ频道|订阅必看|尽快保存|qq群号", "i");//文件夹过滤
let errorCode = {
    'ShareLink.Cancelled': '来晚啦，该分享已失效',
    'ShareLink.Forbidden': '违规资源已被封禁',
    'NotFound.ShareLink': '不存在该链接请核对',
    'AccessTokenInvalid': '访问令牌失效，请重新登陆或稍后再试',
    'ShareLinkTokenInvalid': '分享令牌失效',
    'ParamFlowException': '访问过于频繁，请稍后再试'
}
let orders = {
    名称正序: 'name#ASC',
    名称倒序: 'name#DESC',
    时间正序: 'updated_at#ASC',
    时间倒序: 'updated_at#DESC',
    聚影排序: 'name#DESC'
};
let ordersKeys = Object.keys(orders);
let orderskey = orders[getItem('aliyun_order', '聚影排序')];
let style = getItem('aliyun_style', 'avatar');

function aliShareUrl(input) {
    let li = input.split('\n');
    let share_id;
    let folder_id;
    let share_pwd
    li.forEach(it => {
        it = it.trim();
        if (it.indexOf("提取码") > -1) {
            share_pwd = it.replace(/提取码|:| |：/g, '');
        }
        if (/www\.aliyundrive\.com|www\.alipan\.com/.test(it)) {
            it = it.replace('https://www.aliyundrive.com/s/', '').replace('https://www.alipan.com/s/', '').replace('链接：', '');
            share_id = it.indexOf('/folder/') > -1 ? it.split('/folder/')[0] : it;
            folder_id = it.indexOf('/folder/') > -1 ? it.split('/folder/')[1] : "root";
        }
    })

    if (share_id) {
        aliShare(share_id, folder_id, share_pwd);
    } else {
        back(false);
        toast("链接地址不正确");
    }
}


function aliShare(share_id, folder_id, share_pwd) {
    let my_params = {};
    if($.type(MY_PARAMS)!='undefined'){
        my_params = MY_PARAMS;
    }
    addListener("onClose", $.toString((isback) => {
        if (getMyVar('Src_Jy_聚影云盘自动返回') && isback == 1) {
            back(false);
        }
        clearMyVar('云盘共享链接页面标题');
    }, my_params.back || 0));
    clearMyVar('Src_Jy_聚影云盘自动返回');

    let d = [];
    let filterFiles = [];
    
    try {
        if (!userinfo.refresh_token) {
            d = d.concat(myDiskMenu(0));
        } else {
            share_pwd = share_pwd || "";
            let get_sharetoken = getShareToken(share_id, share_pwd);
            let sharetoken = get_sharetoken.share_token;
            let getbyshare = {};

            d.push({
                title: "换源",
                url: $().lazyRule((name, isback) => {
                    if (isback > 0) {
                        putMyVar('Src_Jy_聚影云盘自动返回', '1');
                        back(false);
                        return 'hiker://empty';
                    } else if (name) {
                        return $('hiker://empty#noRecordHistory##noHistory#').rule((name) => {
                            let d = [];
                            d.push({
                                title: name + "-云盘聚合搜索",
                                url: "hiker://empty",
                                col_type: "text_center_1",
                                extra: {
                                    id: "listloading",
                                    lineVisible: false
                                }
                            })
                            setResult(d);
                            require((config.云盘||config.聚影.replace(/[^/]*$/,'')) + 'SrcJyAliDisk.js');
                            aliDiskSearch(name);
                        }, name)
                    } else {
                        return 'hiker://empty';
                    }
                }, my_params.name || "", my_params.back || 0),
                col_type: 'icon_5',
                img: getIcon("云盘-换源.svg"),
                extra: {
                    longClick: [{
                        title: "上级目录",
                        js: $.toString((id) => {
                            if (!id) {
                                return "toast://已经是根目录了";
                            } else {
                                let ids = id.split;
                                return $("").rule((ids) => {
                                    require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyAliDisk.js');
                                    aliShare(ids[0], ids[1], ids[2]);
                                }, ids);
                            }
                        }, my_params.dirid || "")
                    }]
                }
            },
            {
                title: "样式",
                url: $(['text_1', 'movie_2', 'card_pic_3', 'avatar']).select(() => {
                    setItem('aliyun_style', input);
                    refreshPage();
                    return 'toast://已切换';
                }),
                col_type: 'icon_5',
                img: getIcon("云盘-样式.svg"),
            },
            {
                title: "排序",
                url: $(ordersKeys, 2).select(() => {
                    setItem('aliyun_order', input);
                    refreshPage();
                    return 'toast://切换成功';
                }),
                col_type: 'icon_5',
                img: getIcon("云盘-排序.svg"),
            },
            {
                title: getItem('aliyun_playMode', '智能'),
                url: $(['智能', '转码', '原画', '原画接口'+getItem('aliyun_openInt', '1'), '极速播放:'+(getItem('fastPlayMode')=="1"?"开":"关")]).select(() => {
                    if(input.includes('原画接口')){
                        require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyAliDisk.js');
                        return aliOpenInt();
                    }else if(input.includes('极速播放')){
                        let sm;
                        if(getItem('fastPlayMode')=="1"){
                            clearItem('fastPlayMode');
                            sm = '已关闭原画极速播放';
                        }else{
                            setItem('fastPlayMode', '1');
                            sm = '已开启原画极速播放';
                        }
                        return 'toast://'+sm;
                    }else{
                        setItem('aliyun_playMode', input);
                        updateItem("aliyun_playMode", {title: getItem('aliyun_playMode', '智能')});
                        return 'toast://已切换为'+input;
                    }
                }),
                col_type: 'icon_5',
                img: getIcon("云盘-转码.svg"),
                extra: {
                    id: "aliyun_playMode"
                }
            },
            {
                title: '转存',
                url: `smartdrive://share/browse?shareId=${share_id}&sharePwd=${share_pwd}`,
                col_type: 'icon_5',
                img: getIcon("云盘-转存.svg"),
                extra: {
                    longClick: [{
                        title: "💾转存",
                        js: $.toString((obj) => {
                            storage0.putMyVar('copydate', obj);
                            return $("hiker://empty").rule(() => {
                                addListener("onClose", $.toString(() => {
                                    clearMyVar('copydate');
                                }));
                                
                                require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyAliDisk.js');
                                aliMyDisk('', 0, '');
                            })
                        },{sharetoken:sharetoken,share_id:share_id,authorization:authorization,file_id:folder_id})
                    }]
                }
            },
            {
                col_type: 'line_blank'
            })

            if (errorCode[get_sharetoken.code]) {
                d.push({
                    title: errorCode[get_sharetoken.code],
                    url: 'hiker://empty',
                    col_type: "text_center_1"
                })
                setResult(d);
            } else {
                let postdata = { "share_id": share_id, "parent_file_id": folder_id || "root", "limit": 200, "image_thumbnail_process": "image/resize,w_256/format,jpeg", "image_url_process": "image/resize,w_1920/format,jpeg/interlace,1", "video_thumbnail_process": "video/snapshot,t_1000,f_jpg,ar_auto,w_256", "order_by": orderskey.split('#')[0], "order_direction": orderskey.split('#')[1] };
                headers['x-share-token'] = sharetoken;
                getbyshare = JSON.parse(request('https://api.aliyundrive.com/adrive/v2/file/list_by_share', { headers: headers, body: postdata, method: 'POST' }));
                
                if (errorCode[getbyshare.code]) {
                    d.push({
                        title: errorCode[getbyshare.code],
                        url: 'hiker://empty',
                        col_type: "text_center_1"
                    })
                    setResult(d);
                }
            }
            let sharelist = getbyshare.items || [];
            sharelist = sharelist.filter(item => {
                return item.type == "file" || (item.type == "folder" && !folderFilter.test(item.name));
            })
            if (sharelist.length == 1 && sharelist[0].type == "folder") {
                putMyVar('云盘共享链接页面标题', sharelist[0].name);
                java.lang.Thread.sleep(1000);
                aliShare(share_id, sharelist[0].file_id, share_pwd);
            } else if (sharelist.length > 0) {
                let sublist = sharelist.filter(item => {
                    return item.type == "file" && /srt|vtt|ass/.test(item.file_extension);
                })
                let dirlist = sharelist.filter((item) => {
                    return item.type == "folder";
                })
                dirlist.forEach((item) => {
                    d.push({
                        title: item.name,
                        img: getIcon("云盘-文件夹.svg"),
                        url: $("hiker://empty##https://www.aliyundrive.com/s/" + item.share_id + (item.file_id ? "/folder/" + item.file_id : "")).rule((share_id, folder_id, share_pwd) => {
                            require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyAliDisk.js');
                            aliShare(share_id, folder_id, share_pwd);
                        }, item.share_id, item.file_id, share_pwd),
                        col_type: style,
                        extra: {
                            pageTitle: item.name,
                            name: my_params.name || "",
                            back: 1,
                            dirid: share_id + '_' + folder_id + '_' + share_pwd,
                            longClick: [{
                                title: "💾转存",
                                js: $.toString((obj) => {
                                    storage0.putMyVar('copydate', obj);
                                    return $("hiker://empty").rule(() => {
                                        addListener("onClose", $.toString(() => {
                                            clearMyVar('copydate');
                                        }));
                                        
                                        require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyAliDisk.js');
                                        aliMyDisk('', 0, '');
                                    })
                                },{sharetoken:sharetoken,share_id:share_id,authorization:authorization,file_id:item.file_id})
                            }]
                        }
                    })
                })
                let filelist = sharelist.filter((item) => {
                    return item.type == "file";
                })
                if (getItem('aliyun_order', '聚影排序') == "聚影排序") {
                    filelist.sort(SortList);
                }
                
                filelist.forEach((item) => {
                    let filesize = item.size / 1024 / 1024;
                    let it = {
                        title: item.name,
                        img: item.thumbnail || (item.category == "video" ? "http://123.56.105.145/tubiao/movie/13.svg" : item.category == "audio" ? "http://123.56.105.145/tubiao/music/46.svg" : item.category == "image" ? "http://123.56.105.145/tubiao/more/38.png" : "https://img.alicdn.com/imgextra/i1/O1CN01mhaPJ21R0UC8s9oik_!!6000000002049-2-tps-80-80.png"),
                        desc: filesize < 1024 ? filesize.toFixed(2) + 'MB' : (filesize / 1024).toFixed(2) + 'GB',
                        col_type: style,
                        extra: {
                            id: item.file_id,
                            longClick: [{
                                title: "💾转存",
                                js: $.toString((obj) => {
                                    storage0.putMyVar('copydate', obj);
                                    return $("hiker://empty").rule(() => {
                                        addListener("onClose", $.toString(() => {
                                            clearMyVar('copydate');
                                        }));
                                        
                                        require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyAliDisk.js');
                                        aliMyDisk('', 0, '');
                                    })
                                },{sharetoken:sharetoken,share_id:share_id,authorization:authorization,file_id:item.file_id})
                            }]
                        }
                    }
                    if (item.category == "video") {
                        let sub_file_id;
                        if (sublist.length == 1) {
                            sub_file_id = sublist[0].file_id;
                        } else if (sublist.length > 1) {
                            sublist.forEach(it => {
                                let subnmae = it.name.substring(0, it.name.lastIndexOf(".")).replace(/\.chs|\.eng/g, '');
                                if (item.name.includes(subnmae)) {
                                    sub_file_id = it.file_id;
                                }
                            })
                            if (!sub_file_id) {
                                sub_file_id = sublist[0].file_id;
                            }
                        }
                        it.url = $("").lazyRule((share_id, file_id, sub_file_id, share_pwd) => {
                            require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyAliPublic.js');
                            let play = getAliUrl(share_id, file_id, share_pwd);
                            if (play.urls && play.urls.length > 0) {
                                let subtitle;
                                if (sub_file_id) {
                                    subtitle = getSubtitle(share_id, sub_file_id, share_pwd);
                                    if (subtitle) {
                                        play['subtitle'] = subtitle;
                                    }
                                }
                                return JSON.stringify(play);
                            } else {
                                return "toast://获取播放列表失败，看日志有无异常或token无效";
                            }
                        }, item.share_id, item.file_id, sub_file_id || "", share_pwd);
                        d.push(it);
                    } else {
                        it.url = $("").lazyRule((category, file_id, sharedata) => {
                            require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyAliPublic.js');
                            let file_url = aliOpenPlayUrl(file_id, sharedata);
                            if (category == "audio") {
                                return file_url + ";{Referer@https://www.aliyundrive.com/}#isMusic=true#";
                            } else if (category == "image") {
                                return file_url + "#.jpg@Referer=https://www.aliyundrive.com/";
                            } else {
                                return "download://" + file_url + ";{Referer@https://www.aliyundrive.com/}";
                            }
                        }, item.category, item.file_id, { sharetoken: sharetoken, share_id: item.share_id });
                        filterFiles.push(it);
                    }
                })
                d.push({
                    title: "““””<small><font color=#f20c00>已开启文件过滤，仅显示视频文件</font></small>",
                    url: filterFiles.length == 0 ? "hiker://empty" : $("").lazyRule((filterFiles, folder_id) => {
                        addItemAfter("sharelist_" + folder_id, filterFiles);
                        updateItem("sharelist_" + folder_id, {
                            url: "hiker://empty",
                            title: "““””<small><font color=#f20c00>已显示全部文件</font></small>" 
                        });
                        return "toast://已加载全部文件";
                    }, filterFiles, folder_id),
                    col_type: "text_center_1",
                    extra: {
                        id: "sharelist_" + folder_id
                    }
                })
            } else {
                toast('列表为空');
            }
        }
    } catch (e) {
        log('获取共享文件列表失败>' + e.message);
        d.push({
            title: '该分享已失效或异常',
            url: 'hiker://empty',
            col_type: "text_center_1"
        })
        toast('该分享已失效或异常，可刷新确认下');
    }
    setResult(d);
    if(typeof (MY_PARAMS) == "undefined" || !MY_PARAMS.pageTitle){
        setPageTitle(getMyVar('云盘共享链接页面标题', '云盘共享文件') + ' | 聚影');
    }
    setLastChapterRule('js:' + $.toString(() => {
        setResult('');
    }))
}
function aliOpenInt() {
    return $(['接口1(alist)', '接口2(webdav)']).select(() => {//, '接口3(tv)'
        clearMyVar('aliopentoken');
        if(input=='接口1(alist)'){
            setItem('aliyun_openInt', '1');
        }else if(input=='接口2(webdav)'){
            require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyAliPublic.js');
            if(aliOpenTokenObj.refresh_token_2){
                setItem('aliyun_openInt', '2');
            }else{
                let loyopentoken2;
                try{
                    let loyopen = eval('('+fetch("hiker://files/rules/LoyDgIk/aliOpenToken.json")+')') || {};
                    loyopentoken2 = loyopen.isV2?loyopen.RefreshTokenOpen:"";
                    aliOpenTokenObj.refresh_token_2 = loyopentoken2;
                    aliconfig.opentoken = aliOpenTokenObj;
                    writeFile(alicfgfile, JSON.stringify(aliconfig));
                }catch(e){
                    log(e.message);
                }
                if(loyopentoken2){
                    setItem('aliyun_openInt', '2');
                }else{
                    return $('','输入阿里webdav口令，留空打开网页获取').input((alicfgfile,aliconfig) => {
                        if(input==''){
                            return 'web://https://messense-aliyundrive-webdav-backendrefresh-token-ucs0wn.streamlit.app';
                        }else{
                            let aliOpenTokenObj = aliconfig.opentoken || {};
                            aliOpenTokenObj.refresh_token_2 = input;
                            aliconfig.opentoken = aliOpenTokenObj;
                            writeFile(alicfgfile, JSON.stringify(aliconfig));
                            setItem('aliyun_openInt', '2');
                        }
                    },alicfgfile,aliconfig)
                    
                }
            }
        }else if(input=='接口3(tv)'){
            setItem('aliyun_openInt', '3');
        }
        refreshPage();
        return 'toast://已切换为'+input;
    })
}
function myDiskMenu(islogin) {
    let setalitoken = $().lazyRule((alitoken) => {
        return $(alitoken || "", "新的refresh_token").input(() => {
            if(input){
                require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyAliPublic.js');
                let account = getUserInfo(input);
                if(account.refresh_token){
                    refreshPage(false);
                    return "toast://已登录";
                }
            }
            return "hiker://empty";
        })
    }, alitoken)

    let onlogin = [{
        title: userinfo.nick_name,
        url: $(['云盘接口', '更换token','观看历史','退出登录'], 2).select((setalitoken) => {
            if (input == '云盘接口') {
                return $('hiker://empty#noRecordHistory##noHistory#').rule(() => {
                    require(config.聚影.replace(/[^/]*$/,'') + 'SrcJySet.js');
                    yundiskjiekou();
                })
            } else if (input == '更换token') {
                return setalitoken;
            } else if (input == '退出登录') {
                require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyAliPublic.js');
                getUserInfo("");
                refreshPage(false);
                return "toast://已退出登录";
            } else if (input == '观看历史') {
                return $('hiker://empty#noRecordHistory##noHistory#').rule(() => {
                    require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyAliDisk.js');
                    yundiskhistory();
                })
            }
        }, setalitoken),
        img: userinfo.avatar,
        desc: '管理',
        col_type: 'avatar'
    }, {
        col_type: "line"
    }];
    let nologin = [{
        title: "⚡网页登录获取⚡",
        url: $("hiker://empty###noRecordHistory##noHistory#").rule(() => {
            let d = [];
            let url = 'https://auth.aliyundrive.com/v2/oauth/authorize?login_type=custom&response_type=code&redirect_uri=https%3A%2F%2Fwww.aliyundrive.com%2Fsign%2Fcallback&client_id=25dzX3vbYqktVxyX&state=%7B%22origin%22%3A%22*%22%7D#/login'
            let js = $.toString(() => {
                const tokenFunction = function () {
                    var token = JSON.parse(localStorage.getItem('token'))
                    if (token && token.user_id) {
                        let alicfgfile = "hiker://files/rules/Src/Juying2/aliconfig.json";
                        let aliconfig = {};
                        if (fy_bridge_app.fetch(alicfgfile)) {
                            try {
                                eval("aliconfig = " + fy_bridge_app.fetch(alicfgfile));
                            } catch (e) {}
                        }
                        let aliaccount = aliconfig.account || {};
                        aliaccount.refresh_token = token.refresh_token;
                        aliconfig.account = aliaccount;
                        fy_bridge_app.copy(token.refresh_token);
                        fy_bridge_app.log(token.refresh_token);
                        fy_bridge_app.writeFile(alicfgfile, JSON.stringify(aliconfig));
                        localStorage.clear();
                        fy_bridge_app.back(true);
                        fy_bridge_app.toast('TOKEN获取成功，请勿泄漏！');
                        return;
                    } else {
                        token_timer();
                    }
                }
                var token_timer = function () {
                    setTimeout(tokenFunction, 500);
                }
                tokenFunction();
            })
            d.push({
                url: url,
                col_type: 'x5_webview_single',
                desc: '100%&&float',
                extra: {
                    canBack: true,
                    js: js,
                    urlInterceptor: $.toString(() => true)
                }
            })
            setResult(d);
        }),
        col_type: 'text_center_1'
    }, {
        title: "⭐手工填写token⭐",
        url: setalitoken,
        col_type: 'text_center_1'
    }, {
        title: "🌟其他小程序获取🌟",
        url: $().lazyRule(() => {
            try {
                //节约资源，如果有获取过用户信息，就重复利用一下
                let loyfilepath = "hiker://files/rules/LoyDgIk/aliToken.json";
                let icyfilepath = "hiker://files/rules/icy/icy-ali-token.json";
                let alitoken;
                let alifile = fetch(loyfilepath);
                if (alifile) {
                    let token = eval('('+alifile+')');
                    alitoken = token.refresh_token;
                }
                if (!alitoken) {
                    alifile = fetch(icyfilepath);
                    if (alifile) {
                        let tokenlist = eval('('+alifile+')');
                        if (tokenlist.length > 0) {
                            alitoken = tokenlist[0].refresh_token;
                        }
                    }
                }

                if (alitoken) {
                    require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyAliPublic.js');
                    let account = getUserInfo(alitoken);
                    if(account.refresh_token){
                        refreshPage(false);
                        return "toast://已登录";
                    }
                }
            } catch (e) {
                log("获取alitoken失败>" + e.toString() + " 错误行>" + e.lineNumber);
            }
            return "toast://获取失败";
        }),
        col_type: 'text_center_1'
    }]
    if (islogin) {
        return onlogin;
    } else {
        return nologin;
    }
}

function aliMyDisk(folder_id, isSearch, drive_id) {
    folder_id = folder_id || "root";
    isSearch = isSearch || 0;
    drive_id = drive_id || alidrive_id;

    let d = [];
    if (userinfo && userinfo.user_id) {
        if (folder_id == "root") {
            let mydisk = myDiskMenu(1) || [];
            d = d.concat(mydisk);
            d.push({
                title: getMyVar("Src_Jy_selectDisk", "1") == "1" ? "““””<b>备份盘</b>" : "备份盘",
                img: getIcon("云盘-备份盘.svg"),
                url: $('#noLoading#').lazyRule(() => {
                    putMyVar("Src_Jy_selectDisk", "1");
                    refreshPage(false);
                    return "hiker://empty";
                }),
                col_type: 'icon_3_fill'
            })
            d.push({
                title: getMyVar("Src_Jy_selectDisk", "1") == "2" ? "““””<b>资源库</b>" : "资源库",
                img: getIcon("云盘-资源盘.svg"),
                url: $('#noLoading#').lazyRule(() => {
                    putMyVar("Src_Jy_selectDisk", "2");
                    refreshPage(false);
                    return "hiker://empty";
                }),
                col_type: 'icon_3_fill'
            })
            d.push({
                title: getMyVar("Src_Jy_selectDisk", "1") == "3" ? "““””<b>盘搜索</b>" : "盘搜索",
                img: getIcon("云盘-盘搜索.svg"),
                url: $('#noLoading#').lazyRule(() => {
                    putMyVar("Src_Jy_selectDisk", "3");
                    refreshPage(false);
                    return "hiker://empty";
                }),
                col_type: 'icon_3_fill'
            })
        }
        if (getMyVar("Src_Jy_selectDisk", "1") == "3" && !isSearch) {
            let searchurl = $('').lazyRule(() => {
                let recordlist = storage0.getItem('searchrecord') || [];
                if(recordlist.indexOf(input)>-1){
                    recordlist = recordlist.filter((item) => item !== input);
                }
                recordlist.unshift(input);
                if(recordlist.length>20){
                    recordlist.splice(recordlist.length-1,1);
                }
                storage0.setItem('searchrecord', recordlist);

                return $('hiker://empty#noRecordHistory##noHistory#').rule((name) => {
                    setPageTitle('云盘搜索 | 聚影');
                    let d = [];
                    d.push({
                        title: name+"-云盘聚合搜索",
                        url: "hiker://empty",
                        col_type: "text_center_1",
                        extra: {
                            id: "listloading",
                            lineVisible: false
                        }
                    })
                    setResult(d);
                    require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyAliDisk.js');
                    aliDiskSearch(name);
                }, input)
            });

            d.push({
                title: "搜索",
                url: $.toString((searchurl) => {
                        if(/www\.aliyundrive\.com|www\.alipan\.com/.test(input)){
                            input = input.replace('http','\nhttp');
                            return $("hiker://empty#noRecordHistory##noHistory#").rule((input) => {
                                require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyAliDisk.js');
                                aliShareUrl(input);
                            },input);
                        }else{
                            return input + searchurl;
                        }
                    },searchurl),
                desc: "搜你想看的...",
                col_type: "input",
                extra: {
                    titleVisible: true,
                    id: "searchinput",
                    onChange: $.toString((searchurl) => {
                        if(input.indexOf('https://www.aliyundrive.com/s/')==-1){
                            if(input.length==1){deleteItemByCls('suggest');}
                            if(input.length>1&&input!=getMyVar('sousuo$input', '')){
                                putMyVar('sousuo$input', input);
                                deleteItemByCls('suggest');
                                var html = request("https://movie.douban.com/j/subject_suggest?q=" + input, {timeout: 3000});
                                var list = JSON.parse(html)||[];
                                let suggest = list.map((sug)=>{
                                    try {
                                        let sugitem = {
                                            url: sug.title + searchurl,
                                            extra: {
                                                cls: 'suggest'
                                            }
                                        }
                                        if(sug.img!=""){
                                            sugitem.title = sug.title;
                                            sugitem.img = sug.img + '@Referer=https://www.douban.com';
                                            sugitem.desc = "年份：" + sug.year;
                                            sugitem.col_type = "movie_1_vertical_pic";
                                        }else{
                                            sugitem.title = "⚡" + sug.title;
                                            sugitem.col_type = "text_1";
                                        }
                                        return sugitem;
                                    } catch (e) {  }
                                });
                                if(suggest.length>0){
                                    addItemAfter('searchinput', suggest);
                                }
                            }
                        }
                    }, searchurl)
                }
            });

            if(getItem('searchrecordide','0')=='1'){
                let recordlist = storage0.getItem('searchrecord') || [];
                if(recordlist.length>0){
                    d.push({
                        title: '🗑清空',
                        url: $('#noLoading#').lazyRule(() => {
                            clearItem('searchrecord');
                            deleteItemByCls('searchrecord');
                            return "toast://已清空";
                        }),
                        col_type: 'scroll_button'
                    });
                }else{
                    d.push({
                        title: '↻无记录',
                        url: "hiker://empty",
                        col_type: 'scroll_button'
                    });
                }
                recordlist.forEach(item=>{
                    d.push({
                        title: item,
                        url: item + searchurl,
                        col_type: 'scroll_button',
                        extra: {
                            cls: 'searchrecord'
                        }
                    });
                })
            }
            
            let resoufile = libspath + "resou.json";
            let Juyingresou = fetch(resoufile);
            let JYresou = {};
            if(Juyingresou != ""){
                try{
                    eval("JYresou=" + Juyingresou+ ";");
                    delete JYresou['resoulist'];
                }catch(e){
                    log("加载热搜缓存出错>"+e.message);
                }
            }
            let resoudata = JYresou['data'] || {};
            let fenlei = ["电视剧","电影","动漫","综艺"];
            let fenleiid = ["3","2","5","4"];
            let ids = getMyVar("Src_Jy_热榜分类","0");
            let list = resoudata[fenlei[ids]] || [];

            let nowtime = Date.now();
            let oldtime = JYresou.updatetime || 0;
            if(list.length==0 || nowtime > (oldtime+24*60*60*1000)){
                try{
                    let html = request("https://api.web.360kan.com/v1/rank?cat="+fenleiid[ids], {timeout: 3000});
                    list = JSON.parse(html).data;
                    resoudata[fenlei[ids]] = list;
                    JYresou['data'] = resoudata;
                    JYresou['updatetime'] = nowtime;
                    writeFile(resoufile, JSON.stringify(JYresou));
                }catch(e){
                    log("获取热搜榜出错>"+e.message);
                }
            }
            d.push({
                title: '<span style="color:#ff6600"><b>\t热搜榜\t\t\t</b></span>',
                desc: '✅'+fenlei[ids],
                url: $(fenlei, 2, '选择热榜分类').select((fenlei) => {
                    putMyVar("Src_Jy_热榜分类",fenlei.indexOf(input));
                    refreshPage(false);
                    return "hiker://empty";
                },fenlei),
                pic_url: getIcon("主页-热搜.svg", 1),//'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=3779990328,1416553241&fm=179&app=35&f=PNG?w=60&h=70&s=E7951B62A4639D153293A4E90300401B',
                col_type: 'avatar'
            });
            let rbcolor = getItem('主题颜色','#587bff');
            list.forEach((item,i)=>{
                d.push({
                    title: (i=="0"?'““””<span style="color:#ff3300">' + (parseInt(i)+1).toString() + '</span>\t\t' + item.title:i=="1"?'““””<span style="color:#ff6600">' + (parseInt(i)+1).toString() + '</span>\t\t' + item.title:i=="2"?'““””<span style="color:#ff9900">' + (parseInt(i)+1).toString() + '</span>\t\t' + item.title:'““””<span>' + (parseInt(i)+1).toString() + '</span>\t\t' + item.title)+'\n<small><span style="color:'+rbcolor+'">'+item.comment+'</small>',
                    url: item.title + searchurl,
                    pic_url: item.cover,
                    desc: item.description,
                    col_type: "movie_1_vertical_pic"
                });
            })
        } else {
            try {
                let postdata = { "drive_id": drive_id, "parent_file_id": folder_id, "limit": 200, "all": false, "url_expire_sec": 14400, "image_thumbnail_process": "image/resize,w_256/format,avif", "image_url_process": "image/resize,w_1920/format,avif", "video_thumbnail_process": "video/snapshot,t_1000,f_jpg,ar_auto,w_256", "fields": "*", "order_by": orderskey.split('#')[0], "order_direction": orderskey.split('#')[1] };
                let posturl = "https://api.aliyundrive.com/adrive/v3/file/list";
                let deviceId = userinfo.device_id;
                let userId = userinfo.user_id;
                headers['authorization'] = authorization;
                headers['x-device-id'] = deviceId;
                headers['x-canary'] = "client=web,app=adrive,version=v4.9.0";
                let aliecc = createsession(headers, deviceId, userId);
                if (aliecc.success) {
                    headers['x-signature'] = aliecc.signature;
                }
                let getfiles = request(posturl, { headers: headers, body: postdata, method: 'POST' });
                let myfilelist = JSON.parse(getfiles).items || [];
                if (myfilelist.length > 0) {
                    if(folder_id != "root"){
                        d.push(
                            {
                                title: "探索",
                                url: $().lazyRule((headers) => {
                                    let result = JSON.parse(request("https://api.aliyundrive.com/adrive/v1/bottle/fish", { headers: headers, body: {}, method: 'POST' }));
                                    if(result.display_message){
                                        return "toast://"+result.display_message;
                                    }else{
                                        let share_name = result.bottleName;
                                        let share_id = result.shareId;
                                        return $(share_name+"\n是否查看","探索发现到").confirm((input)=>{
                                            return $('https://www.alipan.com/s/'+input).rule((input)=>{
                                                require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyAliDisk.js');
                                                aliShare(input);
                                            }, input)
                                        }, share_id)
                                    }
                                }, headers),
                                col_type: 'icon_5',
                                img: getIcon("云盘-探索.svg")
                            },
                            {
                                title: "样式",
                                url: $(['text_1', 'movie_2', 'card_pic_3', 'avatar']).select(() => {
                                    setItem('aliyun_style', input);
                                    refreshPage();
                                    return 'toast://已切换';
                                }),
                                col_type: 'icon_5',
                                img: getIcon("云盘-样式.svg")
                            },
                            {
                                title: "排序",
                                url: $(ordersKeys, 2).select(() => {
                                    setItem('aliyun_order', input);
                                    refreshPage();
                                    return 'toast://切换成功';
                                }),
                                col_type: 'icon_5',
                                img: getIcon("云盘-排序.svg")
                            },
                            {
                                title: getItem('aliyun_playMode', '智能'),
                                url: $(['智能', '转码', '原画', '原画接口'+getItem('aliyun_openInt', '1'), '极速播放:'+(getItem('fastPlayMode')=="1"?"开":"关")]).select(() => {
                                    if(input.includes('原画接口')){
                                        require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyAliDisk.js');
                                        return aliOpenInt();
                                    }else if(input.includes('极速播放')){
                                        let sm;
                                        if(getItem('fastPlayMode')=="1"){
                                            clearItem('fastPlayMode');
                                            sm = '已关闭原画极速播放';
                                        }else{
                                            setItem('fastPlayMode', '1');
                                            sm = '已开启原画极速播放';
                                        }
                                        return 'toast://'+sm;
                                    }else{
                                        setItem('aliyun_playMode', input);
                                        updateItem("aliyun_playMode", {title: getItem('aliyun_playMode', '智能')});
                                        return 'toast://已切换为'+input;
                                    }
                                }),
                                col_type: 'icon_5',
                                img: getIcon("云盘-转码.svg"),
                                extra: {
                                    id: "aliyun_playMode"
                                }
                            },
                            {
                                title: '分享',
                                url: backup_drive_id==drive_id?"toast://备份盘文件不能分享":$().lazyRule((drive_id, folder_id, headers) => {
                                    let currentDate = new Date();
                                    let date = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
                                    let postdata = {"drive_id":drive_id,"file_id_list":[folder_id],"share_pwd":"","expiration":date.toISOString(),"sync_to_homepage":false};
                                    let result = JSON.parse(request("https://api.aliyundrive.com/adrive/v2/share_link/create", { headers: headers, body: postdata, method: 'POST' }));
                                    let share_txt = result.share_name+"\n"+result.share_url;
                                    copy(share_txt);
                                    log(share_txt);
                                    return "toast://已生成7天有效分享链接"
                                }, drive_id, folder_id, headers),
                                col_type: 'icon_5',
                                img: getIcon("云盘-分享.svg")
                            },
                            {
                                col_type: 'line_blank'
                            }
                        )
                    }
                    let sublist = myfilelist.filter(item => {
                        return item.type == "file" && /srt|vtt|ass/.test(item.file_extension);
                    })
                    let dirlist = myfilelist.filter((item) => {
                        return item.type == "folder" && !folderFilter.test(item.name);
                    })
                    let copydate = storage0.getMyVar('copydate');
                    if(copydate){
                        copydate.folder_id = folder_id;
                        copydate.drive_id = drive_id;
                        d.push({
                            title: '保存至此目录',
                            col_type: 'text_center_1',
                            url: $().lazyRule((fcopy,copydate) => {
                                if(fcopy(copydate)){
                                    clearMyVar('copydate');
                                    deleteItem('yundisksharecopy');
                                    refreshPage(false);
                                    return 'toast://转存成功';
                                }
                                return 'toast://转存失败';
                            },fcopy,copydate),
                            extra: {
                                id: 'yundisksharecopy'
                            }
                        })
                    }
                    dirlist.forEach((item) => {
                        d.push({
                            title: item.name,
                            img: getIcon("云盘-文件夹.svg"),
                            url: $("hiker://empty").rule((folder_id, isSearch, drive_id, copydate) => {
                                require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyAliDisk.js');
                                aliMyDisk(folder_id, isSearch, drive_id, copydate);
                            }, item.file_id, isSearch, drive_id, copydate),
                            col_type: style,
                            extra: {
                                pageTitle: item.name,
                                longClick: [{
                                    title: "❌删除",
                                    js: $.toString((fdel,obj) => {
                                        fdel(obj);
                                        refreshPage(false);
                                        return 'toast://已执行删除';
                                    },fdel,{authorization:authorization,file_id:item.file_id,drive_id:drive_id})
                                }]
                            }
                        })
                    })
                    let filelist = myfilelist.filter((item) => {
                        return item.type == "file";
                    })
                    if (getItem('aliyun_order', '聚影排序') == "聚影排序") {
                        filelist.sort(SortList);
                    }
                    filelist.forEach((item) => {
                        if (item.category == "video" || !isSearch) {
                            let sub_file_url;
                            if (sublist.length == 1) {
                                sub_file_url = sublist[0].url;
                            } else if (sublist.length > 1) {
                                sublist.forEach(it => {
                                    let subnmae = it.name.substring(0, it.name.lastIndexOf(".")).replace(/\.chs|\.eng/g, '');
                                    if (item.name.includes(subnmae)) {
                                        sub_file_url = it.url;
                                    }
                                })
                            }
                            let filesize = item.size / 1024 / 1024;
                            d.push({
                                title: item.name,
                                img: item.thumbnail ? item.thumbnail + "@Referer=https://www.aliyundrive.com/" : item.category == "video" ? "http://123.56.105.145/tubiao/movie/13.svg" : item.category == "audio" ? "http://123.56.105.145/tubiao/music/46.svg" : item.category == "image" ? "http://123.56.105.145/tubiao/more/38.png" : "https://img.alicdn.com/imgextra/i1/O1CN01mhaPJ21R0UC8s9oik_!!6000000002049-2-tps-80-80.png@Referer=",
                                url: $("hiker://empty##").lazyRule((category, file_id, sub_file_url,drive_id) => {
                                    require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyAliPublic.js');
                                    if(!alitoken){
                                        return "toast://未获取到阿里token，重新登录偿试";
                                    }
                                    if (category == "video") {
                                        let play = aliMyPlayUrl(file_id,drive_id);
                                        if (play.urls) {
                                            if (sub_file_url) {
                                                let subfile = 'hiker://files/_cache/subtitles/' + file_id + '.srt';
                                                downloadFile(sub_file_url, subfile, { "referer": "https://www.aliyundrive.com/" })
                                                if (fetch(subfile)) {
                                                    play['subtitle'] = getPath(subfile);
                                                }
                                            }
                                            return JSON.stringify(play);
                                        } else {
                                            return "toast://" + play.message;
                                        }
                                    } else {
                                        let file_url = aliOpenPlayUrl(file_id, undefined, drive_id);
                                        if (category == "audio") {
                                            return file_url + ";{Referer@https://www.aliyundrive.com/}#isMusic=true#";
                                        } else if (category == "image") {
                                            return file_url + "#.jpg@Referer=https://www.aliyundrive.com/";
                                        } else {
                                            return "download://" + file_url + ";{Referer@https://www.aliyundrive.com/}";
                                        }
                                    }
                                }, item.category, item.file_id, sub_file_url || "", drive_id),
                                desc: filesize < 1024 ? filesize.toFixed(2) + 'MB' : (filesize / 1024).toFixed(2) + 'GB',
                                col_type: style,
                                extra: {
                                    id: item.file_id,
                                    cls: "playlist " + item.category,
                                    inheritTitle: false,
                                    longClick: [{
                                        title: "❌删除",
                                        js: $.toString((fdel,obj) => {
                                            fdel(obj);
                                            refreshPage(false);
                                            return 'toast://已执行删除';
                                        },fdel,{authorization:authorization,file_id:item.file_id,drive_id:drive_id})
                                    }]
                                }
                            })
                        }
                    })
                    if (isSearch) {
                        d.push({
                            title: "““””<small><font color=#f20c00>已开启文件过滤，仅显示视频文件</font></small>",
                            url: "hiker://empty",
                            col_type: "text_center_1"
                        })
                    }
                } else {
                    toast('列表为空');
                }
            } catch (e) {
                log(e.message);
                toast('有异常查看日志，可刷新确认下');
            }
        }
    } else {
        let mydisk = myDiskMenu(0) || [];
        d = d.concat(mydisk);
    }
    setResult(d);
    if(typeof (MY_PARAMS) == "undefined" || !MY_PARAMS.pageTitle){
        setPageTitle('我的云盘 | 聚影');
    }
    setLastChapterRule('js:' + $.toString(() => {
        setResult('');
    }))
}

function aliDiskSearch(input, data) {
    showLoading('搜索中，请稍后...');
    if (getMyVar('Src_Jy_diskSearch')) {
        putMyVar("Src_Jy_停止搜索线程", "1");
        let waittime = 10;
        for (let i = 0; i < waittime; i++) {
            if (getMyVar("Src_Jy_停止搜索线程", "0") == "0") {
                updateItem('listloading', { title: '搜索中...' });
                break;
            }
            updateItem('listloading', { title: '等待上次线程结束，' + (waittime - i - 1) + 's' });
            java.lang.Thread.sleep(1000);
        }
    }

    let datalist = [];
    if (data) {
        datalist.push(data);
    } else {
        let datafile = fetch(ypfile);
        if (datafile != "") {
            try {
                eval("datalist=" + datafile + ";");
            } catch (e) {
                datalist = [];
            }
        }
        datalist = datalist.filter(it=>{
            return !it.stop;
        });
    }
    let diskMark = storage0.getMyVar('Src_Jy_diskMark') || {};
    let i = 0;
    let one = "";
    for (var k in diskMark) {
        i++;
        if (i == 1) { one = k }
    }
    if (i > 30) { delete diskMark[one]; }

    addItemBefore("listloading", {
        col_type: "blank_block",
        extra: {
            id: "yundisklistloading"
        }
    })

    //多线程执行代码
    let task = function (obj) {
        try {
            let datalist2 = [];
            try {
                eval('let Parse = ' + obj.parse);
                datalist2 = obj.name =="我的云盘" ? myDiskSearch(input) : Parse(input);
            } catch (e) {
                log(obj.name + '>一解出错>' + e.message);
            }

            let searchlist = [];
            datalist2.forEach(item => {
                let itemTitle = item.title.replace(/<\/?.+?>/g, "");
                let arr = {
                    title: itemTitle,
                    img: getIcon("云盘-文件夹.svg"),
                    col_type: "avatar",
                    desc: obj.name,
                    extra: {
                        cls: "loadlist",
                        name: input,
                        pageTitle: itemTitle,
                        back: 2
                    }
                };

                if (obj.name == "我的云盘") {
                    arr.url = $('hiker://empty').rule((input,drive_id) => {
                        require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyAliDisk.js');
                        aliMyDisk(input,1,drive_id);
                    }, item.url, item.drive_id);
                    searchlist.push(arr);
                } else {
                    if (itemTitle.toLowerCase().includes(input.toLowerCase())) {//搜索结果包含关键字才行
                        let surl = item.url;
                        if (!/www\.aliyundrive\.com|www\.alipan\.com/.test(surl) && obj.erparse) {
                            try {
                                eval('let Parse2 = ' + obj.erparse)
                                surl = Parse2(surl);
                            } catch (e) {
                                log(obj.name + '>二解出错>' + e.message);
                            }
                        }
                        if (/www\.aliyundrive\.com|www\.alipan\.com/.test(surl)) {
                            arr.url = $(surl.split('\n')[0]).rule((input) => {
                                require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyAliDisk.js');
                                aliShareUrl(input);
                            }, surl);
                            searchlist.push(arr);
                        }
                    }
                }
            })

            if (searchlist.length > 0) {
                hideLoading();
                diskMark[input] = diskMark[input] || [];
                diskMark[input] = diskMark[input].concat(searchlist);
                addItemBefore('yundisklistloading', searchlist);
            }
        } catch (e) {
            log(obj.name + '>' + e.message);
        }
        return 1;
    }
    let list = datalist.map((item) => {
        return {
            func: task,
            param: item,
            id: item.name
        }
    });
    if (list.length > 0) {
        deleteItemByCls('loadlist');
        putMyVar('Src_Jy_diskSearch', '1');
        be(list, {
            func: function (obj, id, error, taskResult) {
                if (getMyVar("Src_Jy_停止搜索线程") == "1") {
                    return "break";
                }
            },
            param: {
            }
        });
        storage0.putMyVar('Src_Jy_diskMark', diskMark);
        clearMyVar('Src_Jy_diskSearch');
        toast('搜索完成');
    } else {
        toast('无接口，无法搜索');
    }
    hideLoading();
    clearMyVar("Src_Jy_停止搜索线程");
    deleteItem("yundisklistloading");
}

function yundiskhistory() {
    addListener("onClose", $.toString(() => {
        clearMyVar('Src_Jy_云盘历史');
    }));
    let d = [];
    d.push({
        title: getMyVar('Src_Jy_云盘历史','1')=='1'?"““””<b>本地历史</b>":'本地历史',
        url: $('#noLoading#').lazyRule(() => {
            putMyVar('Src_Jy_云盘历史','1');
            refreshPage(false);
            return 'hiker://empty';
        }),
        img: getIcon("云盘-本地历史.svg"),
        col_type: "icon_3_fill"
    });
    d.push({
        title: getMyVar('Src_Jy_云盘历史','1')=='2'?"““””<b>云端历史</b>":'云端历史',
        url: $('#noLoading#').lazyRule(() => {
            putMyVar('Src_Jy_云盘历史','2');
            refreshPage(false);
            return 'hiker://empty';
        }),
        img: getIcon("云盘-云端历史.svg"),
        col_type: "icon_3_fill"
    });
    d.push({
        title: getItem('yundisk_updateRecord')=="1"?"““””<b>记录上传</b>":'记录上传',
        url: $('#noLoading#').lazyRule(() => {
            if(getItem('yundisk_updateRecord')=="1"){
                clearItem('yundisk_updateRecord')
                toast('已关闭观看记录同步云端');
            }else{
                setItem('yundisk_updateRecord','1')
                toast('已开启观看记录同步云端');
            }
            return 'hiker://empty';
        }),
        img: getIcon("云盘-记录上传.svg"),
        col_type: "icon_3_fill"
    });
    if(getMyVar('Src_Jy_云盘历史','1')=='1'){
        let arr = JSON.parse(fetch("hiker://history"));
        arr.forEach(it=>{
            try{
                let p = JSON.parse(it.params);
                if(p.find_rule.includes('aliMyDisk') && p.title == MY_RULE.title){
                    d.push({
                        title: it.title,
                        url: 'hiker://empty@rule=' + p.find_rule,
                        img: it.picUrl,
                        col_type: "avatar",
                        extra: p.params
                    })
                }
            }catch(e){
                //log(e.message);
            }
            
        })
    }else if(getMyVar('Src_Jy_云盘历史','1')=='2'){
        let opentoken = getOpenToken(authorization);
        if(opentoken){
            headers['authorization'] = 'Bearer ' + opentoken;
            let recentList = JSON.parse(request('https://openapi.aliyundrive.com/adrive/v1.0/openFile/video/recentList', { headers: headers, body: {"image_thumbnail_width":480,"fields":"*","video_thumbnail_width":480}, method: 'POST' }));     
            let items = recentList.items;
            let arr = [];
            items.forEach(it=>{
                let index = arr.indexOf(arr.filter(d=>d.parent_file_id == it.parent_file_id)[0]);
                if(index==-1){
                    arr.push(it);
                }
            })
            arr.forEach(it=>{
                try{
                    let folder = JSON.parse(request('https://openapi.aliyundrive.com/adrive/v1.0/openFile/get', { headers: headers, body: {"drive_id":it.drive_id,"file_id":it.parent_file_id}, method: 'POST' })); 
                    d.push({
                        title: folder.name,
                        url: $("hiker://empty#noRecordHistory#").rule((folder_id, isSearch, drive_id) => {
                            if(getItem('yundisk_updateRecord')=="1"){
                                addListener("onClose", $.toString(() => {
                                    refreshPage(false);
                                }));
                            }

                            require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyAliDisk.js');
                            aliMyDisk(folder_id, isSearch, drive_id);
                            if(MY_PARAMS.lastClick){
                                toast('上次观看足迹：' + MY_PARAMS.lastClick);
                            }
                        }, it.parent_file_id, 0, it.drive_id),
                        img: it.thumbnail + "@Referer=https://www.aliyundrive.com/",
                        desc: it.name,
                        col_type: "avatar",
                        extra: {
                            lastClick: it.name,
                            pageTitle: folder.name
                        }
                    })
                }catch(e){
                    //log(e.message);
                }
                
            })
        }else{
            toast('开放接口opentoken获取失败');
        }
    }
    setResult(d);
}

function myDiskSearch(input) {
    if(userinfo.access_token){
        let deviceId = userinfo.device_id;
        let userId = userinfo.user_id;
        headers['authorization'] = authorization;
        headers['x-device-id'] = deviceId;
        headers['x-canary'] = "client=web,app=adrive,version=v4.9.0";
        let aliecc = createsession(headers, deviceId, userId);
        if (aliecc.success) {
            headers['x-signature'] = aliecc.signature;
            let drive_list = [userinfo.backup_drive_id || userinfo.default_drive_id, userinfo.resource_drive_id];
            let postdata = {"drive_id_list":drive_list,"limit":20,"query":"name match \""+input+"\" and type = \"folder\"","image_thumbnail_process":"image/resize,w_256/format,avif","image_url_process":"image/resize,w_1920/format,avif","video_thumbnail_process":"video/snapshot,t_120000,f_jpg,m_lfit,w_256,ar_auto,m_fast","order_by":"updated_at DESC"}
            let list = JSON.parse(request('https://api.aliyundrive.com/adrive/v3/file/search', { headers: headers, body: postdata, method: 'POST' })).items;
            let data = list.map(item => {
                return {
                    title: item.name,
                    url: item.file_id,
                    drive_id: item.drive_id
                }
            })
            return data;
        }
    }
    return [];
}

// 聚影二级切源
function erjiSousuo(name) {
    showLoading('搜源中，请稍后...');
    let updateItemid = "云盘_" + name + "_loading";
    let diskMark = storage0.getMyVar('Src_Jy_diskMark') || {};//二级换源缓存
    if(diskMark[name]){
        addItemBefore(updateItemid, diskMark[name]);
        updateItem(updateItemid, {
            title: "‘‘’’<small>当前搜索为缓存</small>",
            url: $("确定删除“"+name+"”搜索缓存吗？").confirm((name)=>{
                let diskMark = storage0.getMyVar('Src_Jy_diskMark') || {};
                delete diskMark[name];
                storage0.putMyVar('Src_Jy_diskMark', diskMark);
                refreshPage(true);
                return "toast://已清除";
            },name)
        });
        let i = 0;
        let one = "";
        for (var k in diskMark) {
            i++;
            if (i == 1) { one = k }
        }
        if (i > 30) { delete diskMark[one]; }
        hideLoading();
        return "hiker://empty";
    }else{
        updateItem(updateItemid, {
            title: "搜源中..."
        });
    }
    let getlist = myDiskSearch(name);
    getlist.forEach(item => {
        let itemTitle = item.title.replace(/<\/?.+?>/g, "");
        let arr = {
            title: itemTitle,
            img: item.pic || getIcon("云盘-文件夹.svg"),
            col_type: "avatar",
            desc: "我的云盘",
            extra: {
                url: item.url,
                cls: "Juloadlist grouploadlist"
            }
        };
        let extra = {
            folder_id: item.url,
            drive_id: item.drive_id,
            dataObj: {
                name: name,
                group: "云盘",
                updateItemid: "云盘_" + name + "_loading",
                data: {name: "我的云盘", type: "yundisk", group: "云盘", url: "我的云盘"}
            }
        }
        arr.url = $("#noLoading#").lazyRule((extra) => {
            let updateItemid = extra.dataObj.updateItemid;
            updateItem(updateItemid+'2', {
                extra: {"id":updateItemid,"lineVisible":false}
            })
            require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyAliDisk.js');
            return erjiAliMyDiskSs(extra);
        }, extra);
        diskMark[name] = diskMark[name] || [];
        diskMark[name] = diskMark[name].concat(arr);
        addItemBefore(updateItemid, arr);
    })

    let ssdatalist = [];
    let datafile = fetch(ypfile);
    if (datafile != "") {
        try {
            eval("ssdatalist=" + datafile + ";");
        } catch (e) {}
    }
    ssdatalist = ssdatalist.filter(it=>{
        return !it.stop && it.name!="我的云盘";
    });
    let nosousuolist = storage0.getMyVar('Src_Jy_nosousuolist_yundisk') || [];
    if (nosousuolist.length>0){
        ssdatalist = ssdatalist.filter(it => {
            return nosousuolist.indexOf(it.name) == -1;
        })
    }
    //多线程执行代码
    let task = function (obj) {
        try {
            let datalist2 = [];
            try {
                eval('let Parse = ' + obj.parse);
                datalist2 = Parse(name);
            } catch (e) {
                log(obj.name + '>一解出错>' + e.message);
            }
            let searchlist = [];
            datalist2.forEach(item => {
                let itemTitle = item.title.replace(/<\/?.+?>/g, "");
                let arr = {
                    title: itemTitle,
                    img: item.pic || getIcon("云盘-文件夹.svg"),
                    col_type: "avatar",
                    desc: obj.name,
                    extra: {
                        url: item.url,
                        cls: "Juloadlist grouploadlist"
                    }
                };
                
                if (itemTitle.toLowerCase().includes(name.toLowerCase())) {//搜索结果包含关键字才行
                    let surl = item.url;
                    if (!/www\.aliyundrive\.com|www\.alipan\.com/.test(surl) && obj.erparse) {
                        try {
                            eval('let Parse2 = ' + obj.erparse)
                            surl = Parse2(surl);
                        } catch (e) {
                            log(obj.name + '>二解出错>' + e.message);
                        }
                    }
                    if (/www\.aliyundrive\.com|www\.alipan\.com/.test(surl)) {
                        let extra = {
                            url: surl,
                            dataObj: {
                                name: name,
                                group: "云盘",
                                updateItemid: "云盘_" + name + "_loading",
                                data: {name: obj.name, type: "yundisk", group: "云盘", url: obj.name}
                            }
                        }
                        arr.url = $().lazyRule((extra) => {
                            let updateItemid = extra.dataObj.updateItemid;
                            updateItem(updateItemid+'2', {
                                extra: {"id":updateItemid,"lineVisible":false}
                            })
                            require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyAliDisk.js');
                            return erjiAliShareUrl(extra.url, extra.dataObj);
                        }, extra),
                        searchlist.push(arr);
                    }
                }
            })
            return {result:searchlist, success:1};
        } catch (e) {
            log(obj.name + '>' + e.message);
            return {result:[], success:0};
        }
    }
    let list = ssdatalist.map((item) => {
        return {
            func: task,
            param: item,
            id: item.name
        }
    });
    let success = 0;
    if (list.length > 0) {
        be(list, {
            func: function (obj, id, error, taskResult) {
                if (getMyVar("Src_Jy_停止搜索线程") == "1") {
                    return "break";
                }else if(taskResult.success==1){
                    let data = taskResult.result;
                    if(data.length>0){
                        success++;
                        diskMark[name] = diskMark[name] || [];
                        diskMark[name] = diskMark[name].concat(data);
                        addItemBefore(updateItemid, data);
                        hideLoading();
                    }
                }else if(taskResult.success==0){
                    nosousuolist.push(id);
                    storage0.putMyVar('Src_Jy_nosousuolist_yundisk', nosousuolist);
                }
            },
            param: {
            }
        });
        if (getMyVar("Src_Jy_停止搜索线程") != "1") {
            storage0.putMyVar('Src_Jy_diskMark', diskMark);
        }
        clearMyVar("Src_Jy_停止搜索线程");
        hideLoading();
        let sousuosm = "‘‘’’<small><font color=#f13b66a>" + success + "</font>/" + list.length + "，搜索完成</small>";
        updateItem(updateItemid, { title: sousuosm });
    } else {
        hideLoading();
        clearMyVar("Src_Jy_停止搜索线程");
        updateItem(updateItemid, { title: '' });
        toast("无接口");
    }
}

function erjiAliShare(share_id, folder_id, share_pwd) {
    let d = [];
    let errorStr;
    let saveinfo;
    try {
        if (!userinfo.refresh_token) {
            d = d.concat(myDiskMenu(0));
        } else {
            share_pwd = share_pwd || "";
            let get_sharetoken = getShareToken(share_id, share_pwd);
            let sharetoken = get_sharetoken.share_token;
            let getbyshare = {};

            if (errorCode[get_sharetoken.code]) {
                errorStr = errorCode[get_sharetoken.code];
            } else {
                saveinfo = {sharetoken:sharetoken,share_id:share_id,authorization:authorization,file_id:folder_id};
                let postdata = { "share_id": share_id, "parent_file_id": folder_id || "root", "limit": 200, "image_thumbnail_process": "image/resize,w_256/format,jpeg", "image_url_process": "image/resize,w_1920/format,jpeg/interlace,1", "video_thumbnail_process": "video/snapshot,t_1000,f_jpg,ar_auto,w_256", "order_by": orderskey.split('#')[0], "order_direction": orderskey.split('#')[1] };
                headers['x-share-token'] = sharetoken;
                getbyshare = JSON.parse(request('https://api.aliyundrive.com/adrive/v2/file/list_by_share', { headers: headers, body: postdata, method: 'POST' }));
                
                if (errorCode[getbyshare.code]) {
                    errorStr = errorCode[getbyshare.code];
                }else{
                    let sharelist = getbyshare.items || [];
                    sharelist = sharelist.filter(item => {
                        return item.type == "file" || (item.type == "folder" && !folderFilter.test(item.name));
                    })
                    if (sharelist.length == 1 && sharelist[0].type == "folder") {
                        java.lang.Thread.sleep(1000);
                        return erjiAliShare(share_id, sharelist[0].file_id, share_pwd);
                    } else if (sharelist.length > 0) {
                        let sublist = sharelist.filter(item => {
                            return item.type == "file" && /srt|vtt|ass/.test(item.file_extension);
                        })
                        let dirlist = sharelist.filter((item) => {
                            return item.type == "folder";
                        })
                    
                        dirlist.forEach((item) => {
                            d.push({
                                title: item.name,
                                img: getIcon("云盘-文件夹.svg"),
                                url: $().lazyRule((share_id, folder_id, share_pwd) => {
                                    require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyAliDisk.js');
                                    let data = erjiAliShare(share_id, folder_id, share_pwd);
                                    if(data.errorStr){
                                        return "toast://" + data.errorStr;
                                    }else{
                                        deleteItemByCls('grouploadlist');
                                        addItemAfter("yundiskloadid", data.lists);// 生成切源分组
                                    }
                                    return "hiker://empty";
                                }, item.share_id, item.file_id, share_pwd),
                                col_type: style,
                                extra: {
                                    cls: "Juloadlist grouploadlist",
                                    url: "https://www.aliyundrive.com/s/" + item.share_id + (item.file_id ? "/folder/" + item.file_id : ""),
                                    longClick: [{
                                        title: "💾转存",
                                        js: $.toString((obj) => {
                                            storage0.putMyVar('copydate', obj);
                                            return $("hiker://empty").rule(() => {
                                                addListener("onClose", $.toString(() => {
                                                    clearMyVar('copydate');
                                                }));
                                                
                                                require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyAliDisk.js');
                                                aliMyDisk('', 0, '');
                                            })
                                        },{sharetoken:sharetoken,share_id:share_id,authorization:authorization,file_id:item.file_id})
                                    }]
                                }
                            })
                        })
                        let filelist = sharelist.filter((item) => {
                            return item.type == "file";
                        })
                        if (getItem('aliyun_order', '聚影排序') == "聚影排序") {
                            filelist.sort(SortList);
                        }
                        
                        filelist.forEach((item) => {
                            let filesize = item.size / 1024 / 1024;
                            let it = {
                                title: item.name,
                                img: item.thumbnail || "http://123.56.105.145/tubiao/movie/13.svg",
                                desc: filesize < 1024 ? filesize.toFixed(2) + 'MB' : (filesize / 1024).toFixed(2) + 'GB',
                                col_type: style,
                                extra: {
                                    id: item.file_id,
                                    cls: "Juloadlist grouploadlist",
                                    longClick: [{
                                        title: "💾转存",
                                        js: $.toString((obj) => {
                                            storage0.putMyVar('copydate', obj);
                                            return $("hiker://empty").rule(() => {
                                                addListener("onClose", $.toString(() => {
                                                    clearMyVar('copydate');
                                                }));
                                                
                                                require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyAliDisk.js');
                                                aliMyDisk('', 0, '');
                                            })
                                        },{sharetoken:sharetoken,share_id:share_id,authorization:authorization,file_id:item.file_id})
                                    }]
                                }
                            }
                            if (item.category == "video") {
                                let sub_file_id;
                                if (sublist.length == 1) {
                                    sub_file_id = sublist[0].file_id;
                                } else if (sublist.length > 1) {
                                    sublist.forEach(it => {
                                        let subnmae = it.name.substring(0, it.name.lastIndexOf(".")).replace(/\.chs|\.eng/g, '');
                                        if (item.name.includes(subnmae)) {
                                            sub_file_id = it.file_id;
                                        }
                                    })
                                    if (!sub_file_id) {
                                        sub_file_id = sublist[0].file_id;
                                    }
                                }
                                it.url = $("").lazyRule((share_id, file_id, sub_file_id, share_pwd) => {
                                    require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyAliPublic.js');
                                    let play = getAliUrl(share_id, file_id, share_pwd);
                                    if (play.urls && play.urls.length > 0) {
                                        let subtitle;
                                        if (sub_file_id) {
                                            subtitle = getSubtitle(share_id, sub_file_id, share_pwd);
                                            if (subtitle) {
                                                play['subtitle'] = subtitle;
                                            }
                                        }
                                        return JSON.stringify(play);
                                    } else {
                                        return "toast://获取播放列表失败，看日志有无异常或token无效";
                                    }
                                }, item.share_id, item.file_id, sub_file_id || "", share_pwd);
                                d.push(it);
                            }
                        })
                    }
                    if(d.length==0){
                        errorStr = '列表为空';
                    }
                }
            }
        }
    } catch (e) {
        errorStr = "异常报错>" + e.message + " 错误行#" + e.lineNumber;
    }
    return {
        errorStr: errorStr,
        saveinfo: saveinfo,
        lists: d
    };
}

function erjiAliShareUrl(input, dataObj) {
    let li = input.split('\n');
    let share_id;
    let folder_id;
    let share_pwd
    let aliUrl;
    li.forEach(it => {
        it = it.replace('链接：', '').trim();
        if (it.indexOf("提取码") > -1) {
            share_pwd = it.replace(/提取码|:| |：/g, '');
        }
        if (/www\.aliyundrive\.com|www\.alipan\.com/.test(it)) {
            aliUrl = it;
            it = it.replace('https://www.aliyundrive.com/s/', '').replace('https://www.alipan.com/s/', '');
            share_id = it.indexOf('/folder/') > -1 ? it.split('/folder/')[0] : it;
            folder_id = it.indexOf('/folder/') > -1 ? it.split('/folder/')[1] : "root";
        }
    })
    if(share_id){
        let html = request("https://api.aliyundrive.com/adrive/v3/share_link/get_share_by_anonymous",{
            headers: {
                referer: "https://www.aliyundrive.com/"
            },
            body: {
                "share_id": share_id
            },
            method: 'POST'
        })
        let files = JSON.parse(html).file_infos || [];
        if(files.length==0){
            return "toast://分享链接已失效";
        }else{
            let data = erjiAliShare(share_id, folder_id, share_pwd);
            if(data.errorStr){
                return "toast://" + data.errorStr;
            }else{
                let refreshlist = $().lazyRule((share_id, folder_id, share_pwd) => {
                    require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyAliDisk.js');
                    let data = erjiAliShare(share_id, folder_id, share_pwd);
                    if(data.errorStr){
                        return "toast://" + data.errorStr;
                    }else{
                        deleteItemByCls('grouploadlist');
                        addItemAfter("yundiskloadid", data.lists);// 生成切源分组
                    }
                    return "hiker://empty";
                }, share_id, "root", share_pwd)
                let menus = [{
                    title: "刷新",
                    url: refreshlist,
                    col_type: 'icon_5',
                    img: getIcon("云盘-探索.svg"),
                    extra: {
                        url: "https://www.aliyundrive.com/s/" + share_id,
                        cls: "Juloadlist"
                    }
                },
                {
                    title: "样式",
                    url: $(['text_1', 'movie_2', 'card_pic_3', 'avatar'],2).select(() => {
                        setItem('aliyun_style', input);

                        let 列表 = findItemsByCls('grouploadlist') || [];
                        if(列表.length==0){
                            return 'toast://未获取到列表'
                        }
                        deleteItemByCls('grouploadlist');
                        let list_col_type = input;
                        列表.forEach(item => {
                            item.col_type = list_col_type;
                        })
                        addItemAfter("yundiskloadid", 列表);
                        return "hiker://empty";
                    }),
                    col_type: 'icon_5',
                    img: getIcon("云盘-样式.svg"),
                    extra: {
                        cls: "Juloadlist"
                    }
                },
                {
                    title: "排序",
                    url: $(ordersKeys, 2).select((refreshlist) => {
                        setItem('aliyun_order', input);
                        return refreshlist;
                    },refreshlist),
                    col_type: 'icon_5',
                    img: getIcon("云盘-排序.svg"),
                    extra: {
                        cls: "Juloadlist"
                    }
                },
                {
                    title: getItem('aliyun_playMode', '智能'),
                    url: $(['智能', '转码', '原画', '原画接口'+getItem('aliyun_openInt', '1'), '极速播放:'+(getItem('fastPlayMode')=="1"?"开":"关")]).select(() => {
                        if(input.includes('原画接口')){
                            require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyAliDisk.js');
                            return aliOpenInt();
                        }else if(input.includes('极速播放')){
                            let sm;
                            if(getItem('fastPlayMode')=="1"){
                                clearItem('fastPlayMode');
                                sm = '已关闭原画极速播放';
                            }else{
                                setItem('fastPlayMode', '1');
                                sm = '已开启原画极速播放';
                            }
                            return 'toast://'+sm;
                        }else{
                            setItem('aliyun_playMode', input);
                            updateItem("aliyun_playMode", {title: getItem('aliyun_playMode', '智能')});
                            return 'toast://已切换为'+input;
                        }
                    }),
                    col_type: 'icon_5',
                    img: getIcon("云盘-转码.svg"),
                    extra: {
                        id: "aliyun_playMode",
                        cls: "Juloadlist"
                    }
                },
                {
                    title: '切源',
                    url: $().lazyRule((name,group) => {
                        require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyMenu.js');
                        cutSource(name, group);
                        return "hiker://empty";
                    }, dataObj.name, dataObj.group),
                    col_type: 'icon_5',
                    img: getIcon("云盘-换源.svg"),
                    extra: {
                        cls: "Juloadlist",
                        longClick: [{
                            title: "💾转存",
                            js: $.toString((obj) => {
                                storage0.putMyVar('copydate', obj);
                                return $("hiker://empty").rule(() => {
                                    addListener("onClose", $.toString(() => {
                                        clearMyVar('copydate');
                                    }));
                                    
                                    require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyAliDisk.js');
                                    aliMyDisk('', 0, '');
                                })
                            }, data.saveinfo)
                        }]
                    }
                },
                {
                    col_type: 'line_blank',
                    extra: {
                        id: "yundiskloadid",
                        cls: "Juloadlist"
                    }
                }]
                deleteItemByCls('Juloadlist');
                let d = menus.concat(data.lists);
                addItemBefore(dataObj.updateItemid, d);// 生成切源分组
                updateItem(dataObj.updateItemid, {
                    title: ""
                })
                if(dataObj.data){
                    let params = JSON.parse(JSON.parse(getRule()).params);
                    let list = [{
                        title: "共享云盘资源",
                        url: $().lazyRule((input,dataObj) => {
                            require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyAliDisk.js');
                            return erjiAliShareUrl(input, dataObj);
                        },input, dataObj),
                        col_type: "text_2",
                        extra: {
                            url: aliUrl,
                            cls: "Juloadlist"
                        }
                    }]
                    params.lists = list;
                    params.data = dataObj.data;
                    setPageParams(params);
                    updateItem("detailid", {desc: "站源："+dataObj.data.group+"_"+dataObj.data.name})
                    return "toast://已切换源：" + dataObj.data.name;
                }else{
                    return "hiker://empty";
                }
            }
        }
    }else{
        return "toast://链接地址不正确>"+input;
    }
}

function erjiAliMyDiskSs(extra){
    let folder_id = extra.folder_id;
    let drive_id = extra.drive_id;
    let dataObj = extra.dataObj;
    let data = erjiAliMyDisk(folder_id, drive_id);
    if(data.errorStr){
        return "toast://" + data.errorStr;
    }else{
        deleteItemByCls('Juloadlist');
        let refreshlist = $().lazyRule((folder_id, drive_id) => {
            require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyAliDisk.js');
            let data = erjiAliMyDisk(folder_id, drive_id);
            if(data.errorStr){
                return "toast://" + data.errorStr;
            }else{
                deleteItemByCls('grouploadlist');
                addItemAfter("yundiskloadid", data.lists);// 生成切源分组
            }
            return "hiker://empty";
        }, folder_id, drive_id);
        let menus = [{
            title: "刷新",
            url: refreshlist,
            col_type: 'icon_5',
            img: getIcon("云盘-探索.svg"),
            extra: {
                cls: "Juloadlist"
            }
        },
        {
            title: "样式",
            url: $(['text_1', 'movie_2', 'card_pic_3', 'avatar']).select(() => {
                setItem('aliyun_style', input);
                let 列表 = findItemsByCls('grouploadlist') || [];
                if(列表.length==0){
                    return 'toast://未获取到列表'
                }
                deleteItemByCls('grouploadlist');
                let list_col_type = input;
                列表.forEach(item => {
                    item.col_type = list_col_type;
                })
                addItemAfter("yundiskloadid", 列表);
                return "hiker://empty";
            }),
            col_type: 'icon_5',
            img: getIcon("云盘-样式.svg"),
            extra: {
                cls: "Juloadlist"
            }
        },
        {
            title: "排序",
            url: $(ordersKeys, 2).select((refreshlist) => {
                setItem('aliyun_order', input);
                return refreshlist;
            },refreshlist),
            col_type: 'icon_5',
            img: getIcon("云盘-排序.svg"),
            extra: {
                cls: "Juloadlist"
            }
        },
        {
            title: getItem('aliyun_playMode', '智能'),
            url: $(['智能', '转码', '原画', '原画接口'+getItem('aliyun_openInt', '1'), '极速播放:'+(getItem('fastPlayMode')=="1"?"开":"关")]).select(() => {
                if(input.includes('原画接口')){
                    require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyAliDisk.js');
                    return aliOpenInt();
                }else if(input.includes('极速播放')){
                    let sm;
                    if(getItem('fastPlayMode')=="1"){
                        clearItem('fastPlayMode');
                        sm = '已关闭原画极速播放';
                    }else{
                        setItem('fastPlayMode', '1');
                        sm = '已开启原画极速播放';
                    }
                    return 'toast://'+sm;
                }else{
                    setItem('aliyun_playMode', input);
                    updateItem("aliyun_playMode", {title: getItem('aliyun_playMode', '智能')});
                    return 'toast://已切换为'+input;
                }
            }),
            col_type: 'icon_5',
            img: getIcon("云盘-转码.svg"),
            extra: {
                id: "aliyun_playMode",
                cls: "Juloadlist"
            }
        },
        {
            title: '切源',
            url: $().lazyRule((name,group) => {
                require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyMenu.js');
                cutSource(name, group);
                return "hiker://empty";
            }, dataObj.name, dataObj.group),
            col_type: 'icon_5',
            img: getIcon("云盘-换源.svg"),
            extra: {
                cls: "Juloadlist"
            }
        },
        {
            col_type: 'line_blank',
            extra: {
                id: "yundiskloadid",
                cls: "Juloadlist"
            }
        }]
        let d = menus.concat(data.lists);
        addItemBefore(dataObj.updateItemid, d);// 生成切源分组
        updateItem(dataObj.updateItemid, {
            title: ""
        })
        if(dataObj.data){
            let params = JSON.parse(JSON.parse(getRule()).params);
            let list = [{
                title: "我的云盘资源",
                url: $().lazyRule((extra) => {
                    require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyAliDisk.js');
                    return erjiAliMyDiskSs(extra);
                },extra),
                col_type: "text_2",
                extra: {
                    cls: "Juloadlist"
                }
            }]
            params.lists = list;
            params.data = dataObj.data;
            setPageParams(params);
            updateItem("detailid", {desc: "站源："+dataObj.data.group+"_"+dataObj.data.name})
            return "toast://已切换源：" + dataObj.data.name;
        }else{
            return "hiker://empty";
        }
    }    
}
function erjiAliMyDisk(folder_id, drive_id) {
    let d = [];
    let errorStr;
    try {
        if (userinfo && userinfo.user_id) {
            let postdata = { "drive_id": drive_id, "parent_file_id": folder_id, "limit": 200, "all": false, "url_expire_sec": 14400, "image_thumbnail_process": "image/resize,w_256/format,avif", "image_url_process": "image/resize,w_1920/format,avif", "video_thumbnail_process": "video/snapshot,t_1000,f_jpg,ar_auto,w_256", "fields": "*", "order_by": orderskey.split('#')[0], "order_direction": orderskey.split('#')[1] };
            let posturl = "https://api.aliyundrive.com/adrive/v3/file/list";
            let deviceId = userinfo.device_id;
            let userId = userinfo.user_id;
            headers['authorization'] = authorization;
            headers['x-device-id'] = deviceId;
            headers['x-canary'] = "client=web,app=adrive,version=v4.9.0";
            let aliecc = createsession(headers, deviceId, userId);
            if (aliecc.success) {
                headers['x-signature'] = aliecc.signature;
            }
            let getfiles = request(posturl, { headers: headers, body: postdata, method: 'POST' });
            let myfilelist = JSON.parse(getfiles).items || [];
            if (myfilelist.length > 0) {
                let sublist = myfilelist.filter(item => {
                    return item.type == "file" && /srt|vtt|ass/.test(item.file_extension);
                })
                let dirlist = myfilelist.filter((item) => {
                    return item.type == "folder" && !folderFilter.test(item.name);
                })
                
                dirlist.forEach((item) => {
                    d.push({
                        title: item.name,
                        img: getIcon("云盘-文件夹.svg"),
                        url: $().lazyRule((folder_id, drive_id) => {
                            require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyAliDisk.js');
                            let data = erjiAliMyDisk(folder_id, drive_id);
                            if(data.errorStr){
                                return "toast://" + data.errorStr;
                            }else{
                                deleteItemByCls('grouploadlist');
                                addItemAfter("yundiskloadid", data.lists);// 生成切源分组
                            }
                            return "hiker://empty";
                        }, item.file_id, drive_id),
                        col_type: style,
                        extra: {
                            cls: "Juloadlist grouploadlist"
                        }
                    })
                })
                let filelist = myfilelist.filter((item) => {
                    return item.type == "file";
                })
                if (getItem('aliyun_order', '聚影排序') == "聚影排序") {
                    filelist.sort(SortList);
                }
                filelist.forEach((item) => {
                    if (item.category == "video") {
                        let sub_file_url;
                        if (sublist.length == 1) {
                            sub_file_url = sublist[0].url;
                        } else if (sublist.length > 1) {
                            sublist.forEach(it => {
                                let subnmae = it.name.substring(0, it.name.lastIndexOf(".")).replace(/\.chs|\.eng/g, '');
                                if (item.name.includes(subnmae)) {
                                    sub_file_url = it.url;
                                }
                            })
                        }
                        let filesize = item.size / 1024 / 1024;
                        d.push({
                            title: item.name,
                            img: item.thumbnail ? item.thumbnail + "@Referer=https://www.aliyundrive.com/" : "http://123.56.105.145/tubiao/movie/13.svg",
                            url: $().lazyRule((file_id, sub_file_url,drive_id) => {
                                    require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyAliPublic.js');
                                    if (alitoken) {
                                        let play = aliMyPlayUrl(file_id,drive_id);
                                        if (play.urls) {
                                            if (sub_file_url) {
                                                let subfile = 'hiker://files/_cache/subtitles/' + file_id + '.srt';
                                                downloadFile(sub_file_url, subfile, { "referer": "https://www.aliyundrive.com/" })
                                                if (fetch(subfile)) {
                                                    play['subtitle'] = getPath(subfile);
                                                }
                                            }
                                            return JSON.stringify(play);
                                        } else {
                                            return "toast://" + play.message;
                                        }
                                    } else {
                                        return "toast://未获取到阿里token";
                                    }
                            }, item.file_id, sub_file_url || "", drive_id),
                            desc: filesize < 1024 ? filesize.toFixed(2) + 'MB' : (filesize / 1024).toFixed(2) + 'GB',
                            col_type: style,
                            extra: {
                                cls: "Juloadlist grouploadlist",
                            }
                        })
                    }
                })
            }
            if(d.length==0){
                errorStr = '列表为空';
            }
        } else {
            d = d.concat(myDiskMenu(0));
        }
    } catch (e) {
        errorStr = "异常报错>" + e.message + " 错误行#" + e.lineNumber;
    }
    return {
        errorStr: errorStr,
        lists: d
    };
}