//本代码仅用于个人学习，请勿用于其他作用，下载后请24小时内删除，代码虽然是公开学习的，但请尊重作者，应留下说明
require((config.聚影||config.依赖).replace(/[^/]*$/,'') + 'SrcJyPublic.js');

function Live() {
    addListener("onClose", $.toString(() => {
        clearMyVar('editmode');
        clearMyVar('JYlivenum');
        clearMyVar('JYlivelocal');
    }));

    var d = [];
    d.push({
        title: '⚙管理中心⚙',
        img: getIcon("聚影.svg"),
        url: $('hiker://empty#noRecordHistory##noHistory#').rule(() => {
            require(config.聚影.replace(/[^/]*$/,'') + 'SrcLive.js');
            LiveSet();
        }),
        col_type: 'avatar'
    });
    let livecfgfile = "hiker://files/rules/Src/Juying2/liveconfig.json";
    let livecfg = fetch(livecfgfile);
    if (livecfg != "") {
        eval("var liveconfig = " + livecfg);
    } else {
        var liveconfig = {};
    }
    let livedata = liveconfig['data'] || [];
    livedata = livedata.filter(item => {
        return item.show != 0;
    })

    let JYlivefile = rulepath + "live.txt";
    let JYlive = "";
    let JYlivedyurl = getMyVar('JYlivedyurl', 'juying');
    if (getMyVar('JYlivelocal', '0') == "1") {
        JYlive = fetch(JYlivefile);
    } else {
        if (JYlivedyurl == "juying") {
            JYlive = fetch(JYlivefile);
            if (JYlive == "" && livedata.length > 0) {
                JYlivedyurl = livedata[0].url ? livedata[0].url : JYlivedyurl;
                putMyVar('JYlivedyurl', JYlivedyurl);
            }
        }
        if (JYlivedyurl != "juying") {
            try {
                showLoading('发现订阅源，正在初始化');
                let YChtml = fetchCache(JYlivedyurl, 48, { timeout: 3000 }).replace(/TV-/g, 'TV').replace(/\[.*\]/g, '');
                let shstr = YChtml.substr(0, YChtml.indexOf('\n'));
                if(shstr.includes(',http')){
                    YChtml = "未分组,#genre#\n" + YChtml;
                }
                if (YChtml.indexOf('#genre#') > -1 || YChtml.indexOf('#EXTINF:-1') > -1) {
                    JYlive = YChtml;
                }
                hideLoading();
            } catch (e) {
                hideLoading();
                log(e.message);
            }
        }
    }
    let color = getItem("主题颜色", "#2EC99D");
    if (livedata.length > 0) {
        d.push({
            col_type: 'line'
        })
        for (let i = 0; i < 9; i++) {
            d.push({
                col_type: "blank_block"
            })
        }
        d.push({
            title: JYlivedyurl == "juying" ? `‘‘’’<b><span style="color:`+color+`">` + '本地' : '本地',
            url: $("#noLoading#").lazyRule(() => {
                putMyVar('JYlivedyurl', 'juying');
                putMyVar('JYlivelocal', '1');
                refreshPage(false);
                return "toast://聚影直播本地源数据";
            }),
            col_type: 'scroll_button',
            extra: {
                backgroundColor: JYlivedyurl=="juying"?"#20" + color.replace('#',''):""
            }
        })
        for (let i = 0; i < livedata.length; i++) {
            let dyname = livedata[i].name;
            let dyurl = livedata[i].url;
            //if(livedata[i].show!=0){
            d.push({
                title: JYlivedyurl == dyurl ? `‘‘’’<b><span style="color:`+color+`">` + dyname : dyname,
                url: $("#noLoading#").lazyRule((dyname, dyurl) => {
                    putMyVar('JYlivedyurl', dyurl);
                    clearMyVar('JYlivelocal');
                    clearMyVar('editmode');
                    refreshPage(false);
                    return "toast://已切换远程订阅：" + dyname;
                }, dyname, dyurl),
                col_type: 'scroll_button',
                extra: {
                    backgroundColor: JYlivedyurl==dyurl?"#20" + color.replace('#',''):""
                }
            })
            //}
        }
        d.push({
            col_type: 'line'
        })
    }
    let JYlives = [];
    if (JYlive) {
        if (JYlive.indexOf('#genre#') > -1) {
            JYlives = JYlive.split('\n');
        } else if (JYlive.indexOf('#EXTINF:-1') > -1) {
            JYlives = JYlive.split('#EXTINF:-1');
        }
    }

    if (JYlives.length > 0) {
        let datalist = [];
        let datalist2 = [];
        let group = "";
        for (let i = 0; i < JYlives.length; i++) {
            try {
                if (JYlive.indexOf('#genre#') > -1) {
                    if (JYlives[i].indexOf('#genre#') > -1) {
                        group = JYlives[i].split(',')[0];
                    } else if (JYlives[i].indexOf(',') > -1) {
                        datalist.push({ group: group, name: JYlives[i].split(',')[0].trim() });
                    }
                } else if (JYlives[i].indexOf('group-title') > -1) {
                    datalist.push({ group: JYlives[i].match(/group-title="(.*?)"/)[1], name: JYlives[i].match(/",(.*?)\n/)[1].trim() });
                }
            } catch (e) {
                //log(e.message);
            }
        }

        let obj = {};
        if (JYlivedyurl == "juying") { putMyVar('JYlivenum', datalist.length); }
        datalist = datalist.reduce((newArr, next) => {
            obj[next.name] ? "" : (obj[next.name] = true && newArr.push(next));
            return newArr;
        }, []);

        d.push({
            title: "🔍",
            url: $.toString((guanlidata, datalist) => {
                if (datalist.length > 0) {
                    deleteItemByCls('livelist');
                    let lists = datalist.filter(item => {
                        return item.name.includes(input);
                    })
                    let gldatalist = guanlidata(lists);
                    addItemAfter('liveloading', gldatalist);
                }
                return "hiker://empty";
            }, guanlidata, datalist),
            desc: "搜你想要的...",
            col_type: "input",
            extra: {
                id: "livesearch",
                titleVisible: true
            }
        });

        let grouplist = datalist.map((list) => {
            return list.group;
        })
        function uniq(array) {
            var temp = [];
            for (var i = 0; i < array.length; i++) {
                if (temp.indexOf(array[i]) == -1) {
                    temp.push(array[i]);
                }
            }
            return temp;
        }

        grouplist = uniq(grouplist);
        let index = 0;
        for (var i in grouplist) {
            let lists = datalist.filter(item => {
                return item.group == grouplist[i];
            })
            if (lists.length > 0) {
                let groupname = grouplist[i] ? grouplist[i] : "未分组";
                let longClick = getMyVar('editmode', '0') == "1" ? [{
                    title: "删除此分组",
                    js: $.toString((groupname, lists) => {
                        require(config.聚影.replace(/[^/]*$/,'') + 'SrcLive.js');
                        return GroupEdit(groupname, 'del', lists);
                    }, groupname, lists)
                }, {
                    title: "重命名分组",
                    js: $.toString((groupname) => {
                        require(config.聚影.replace(/[^/]*$/,'') + 'SrcLive.js');
                        return GroupEdit(groupname, 'rename');
                    }, groupname)
                }] : [];
                
                d.push({
                    title: index == 0 ? `‘‘’’<b><span style="color:`+color+`">` + groupname : groupname,
                    url: $('#noLoading#').lazyRule((grouplist, groupname, guanlidata, lists) => {
                        if (getMyVar('selectgroup') != groupname) {
                            putMyVar('selectgroup', groupname);
                            for (let i in grouplist) {
                                if (grouplist[i] == groupname) {
                                    updateItem(groupname, { title: `‘‘’’<b><span style="color:`+getItem("主题颜色", "#2EC99D")+`">` + groupname })
                                } else {
                                    updateItem(grouplist[i], { title: grouplist[i] })
                                }
                            }
                            deleteItemByCls('livelist');
                            let gldatalist = guanlidata(lists);
                            addItemAfter('liveloading', gldatalist);
                        }
                        return "hiker://empty";
                    }, grouplist, groupname, guanlidata, lists),
                    col_type: "scroll_button",
                    extra: {
                        id: groupname,
                        longClick: longClick
                    }
                });
                if (index == 0) {
                    datalist2 = lists;
                    index = 1;
                }
            }
        }
        d.push({
            col_type: 'line',
            extra: {
                id: 'liveloading'
            }
        });
        datalist = datalist2;
        d = d.concat(guanlidata(datalist));
        d.push({
            title: '<br>',
            col_type: 'rich_text'
        });
    } else {
        d.push({
            title: '没有直播数据源',
            col_type: 'rich_text'
        });
    }
    setHomeResult(d);
}

function GroupEdit(groupname, mode, lists) {
    let JYlivefile = rulepath + "live.txt";
    if (mode == 'del') {
        try {
            showLoading('删除中，请稍候...');
            let JYlive = fetch(JYlivefile);
            let JYlives = JYlive.split('\n');
            for (let i = 0; i < JYlives.length; i++) {
                if (JYlives[i].indexOf('#genre#') > -1 && JYlives[i].indexOf(groupname) > -1) {
                    JYlives.splice(i, 1);
                    i = i - 1;
                } else if (JYlives[i].indexOf('#genre#') == -1 && JYlives[i].indexOf(',') > -1 && lists.some(item => item.name == JYlives[i].split(',')[0].trim())) {
                    JYlives.splice(i, 1);
                    i = i - 1;
                }
            }
            writeFile(JYlivefile, JYlives.join('\n'));
            deleteItem(groupname);
            let playlist = lists.map((list) => {
                return list.name;
            });
            deleteItem(playlist);
            hideLoading();
            return "toast://已删除分组 <" + groupname + "> 所有地址";
        } catch (e) {
            hideLoading();
            log(e.message);
            return "toast://删除分组失败，详情查看日志";
        }
    } else if (mode == 'rename') {
        return $("", "输入新的分组名").input((JYlivefile, groupname) => {
            if (input) {
                let JYlive = fetch(JYlivefile);
                let JYlives = JYlive.split('\n');
                for (let i = 0; i < JYlives.length; i++) {
                    try {
                        if (JYlives[i].indexOf('#genre#') > -1 && JYlives[i].indexOf(groupname) > -1) {
                            JYlives[i] = JYlives[i].replace(groupname, input);
                        }
                    } catch (e) { }
                }
                writeFile(JYlivefile, JYlives.join('\n'));
                updateItem(groupname, { title: input });
                return "toast:// <" + groupname + "> 分组改名为 <" + input + ">";
            } else {
                return "toast://输入不能为空"
            }
        }, JYlivefile, groupname)
    }
}

function guanlidata(datalist) {
    let list = [];
    for (let i = 0; i < datalist.length; i++) {
        let name = datalist[i].name;
        let longClick = getMyVar('editmode', '0') == "1" ? [{
            title: "删除此频道",
            js: $.toString((name) => {
                require(config.聚影.replace(/[^/]*$/,'') + 'SrcLive.js');
                return LiveEdit(name, 'del');
            }, name)
        }, {
            title: "重命名频道",
            js: $.toString((name) => {
                require(config.聚影.replace(/[^/]*$/,'') + 'SrcLive.js');
                return LiveEdit(name, 'rename');
            }, name)
        }] : [];

        list.push({
            title: name,
            img: globalMap0.getVar('Src_Jy_gmParams').getIcon("直播-tv.svg"),
            col_type: 'icon_2_round',
            url: $('#noLoading#').lazyRule((name) => {
                require(config.聚影.replace(/[^/]*$/,'') + 'SrcLive.js');
                return LivePlay(name);
            }, name),
            extra: {
                id: name,
                cls: 'livelist',
                longClick: longClick
            }
        });
    }
    return list;
}
function LivePlay(name) {
    let JYlive = '';
    if(getMyVar('JYlivedyurl', 'juying') == "juying"){
        JYlive = fetch(rulepath + "live.txt");
    }else{
        let YChtml = fetchCache(getMyVar('JYlivedyurl'), 24, { timeout: 3000 });
        let shstr = YChtml.substr(0, YChtml.indexOf('\n'));
        if(shstr.includes(',http')){
            YChtml = "未分组,#genre#\n" + YChtml;
        }
        JYlive = YChtml;
    }
    
    let JYlives = [];
    if (JYlive.indexOf('#genre#') > -1) {
        JYlives = JYlive.split('\n');
    } else if (JYlive.indexOf('#EXTINF:-1') > -1) {
        JYlives = JYlive.split('#EXTINF:-1');
    }

    let urls = [];
    for (let i = 0; i < JYlives.length; i++) {
        try {
            if (JYlive.indexOf('#genre#') > -1) {
                if (JYlives[i].indexOf(',') > -1 && JYlives[i].indexOf('#genre#') == -1 && JYlives[i].split(',')[0].replace(/TV-/g, 'TV').replace(/\[.*\]/g, '').trim() == name) {
                    let url = JYlives[i].split(',')[1].trim();
                    let urll = url.split('#');
                    urll.forEach(item => {
                        if (/\\r^/.test(item)) {
                            item = item.slice(0, item.length - 2);
                        }
                        if (item) {
                            urls.push(item.split('$')[0] + '#isVideo=true#');
                        }
                    })
                }
            } else if (JYlives[i].indexOf('group-title') > -1 && JYlives[i].match(/",(.*?)\n/)[1].replace(/TV-/g, 'TV').replace(/\[.*\]/g, '').trim() == name) {
                let urll = JYlives[i].split('\n');
                urls.push(urll[1] + '#isVideo=true#');
            }
        } catch (e) {
            //log(e.message);
        }
    }
    if (urls.length == 0) {
        return "toast://无播放地址";
    } else if (urls.length == 1) {
        return urls[0];
    } else {
        return JSON.stringify({
            urls: urls
        });
    }
}
function LiveEdit(name, mode) {
    let JYlivefile = rulepath + "live.txt";
    if (mode == 'del') {
        let JYlive = fetch(JYlivefile);
        let JYlives = JYlive.split('\n');
        for (let i = 0; i < JYlives.length; i++) {
            try {
                if (JYlives[i].indexOf('#genre#') == -1 && JYlives[i].indexOf(',') > -1 && JYlives[i].split(',')[0].replace(/TV-/g, 'TV').replace(/\[.*\]/g, '').trim() == name) {
                    JYlives.splice(i, 1);
                    i = i - 1;
                }
            } catch (e) { }
        }
        writeFile(JYlivefile, JYlives.join('\n'));
        deleteItem(name);
        return "toast://已删除 <" + name + ">";
    } else if (mode == 'rename') {
        return $("", "输入新的地址名").input((name, JYlivefile) => {
            if (input) {
                let JYlive = fetch(JYlivefile);
                let JYlives = JYlive.split('\n');
                for (let i = 0; i < JYlives.length; i++) {
                    try {
                        if (JYlives[i].indexOf(',') > -1 && JYlives[i].indexOf(name) > -1) {
                            JYlives[i] = JYlives[i].replace(name, input);
                        }
                    } catch (e) { }
                }
                writeFile(JYlivefile, JYlives.join('\n'));
                updateItem(name, {
                    title: input
                });
                return "toast:// <" + name + "> 改名为 <" + input + ">";
            } else {
                return "toast://输入不能为空"
            }
        }, name, JYlivefile)
    }
}
function LiveSet() {
    addListener("onClose", $.toString(() => {
        if (getMyVar('isEdit') == "1") {
            refreshPage(false);
        }
        clearMyVar('isEdit');
    }));
    //setPageTitle("⚙直播设置⚙");
    var d = [];
    d.push({
        title: '👦哥就是帅，不接受反驳...',
        col_type: "rich_text"
    });
    d.push({
        col_type: "line_blank",
    });
    d.push({
        title: "直播管理",
        img: globalMap0.getVar('Src_Jy_gmParams').getIcon("直播-管理.svg"),
        col_type: "avatar",
        url: "hiker://empty",
    });
    d.push({
        title: "订阅源管理",
        img: globalMap0.getVar('Src_Jy_gmParams').getIcon("直播-箭头.svg"),
        url: $('hiker://empty#noRecordHistory##noHistory#').rule(() => {
            addListener("onClose", $.toString(() => {
                //refreshPage(false);
            }));
            let livecfgfile = globalMap0.getVar('Src_Jy_gmParams').rulepath + "liveconfig.json";
            let livecfg = fetch(livecfgfile);
            if (livecfg != "") {
                eval("var liveconfig = " + livecfg);
            } else {
                var liveconfig = {};
            }
            var d = [];
            d.push({
                title: '‘‘’’<b>📺 订阅源管理</b> &nbsp &nbsp <small>添加自定义链接</small>',
                img: "https://img.vinua.cn/images/QqyC.png",
                url: $("", "输入通用格式的tv链接地址").input((livecfgfile, liveconfig) => {
                    if (input) {
                        if (/\/storage\/emulated\//.test(input)) { input = "file://" + input }
                        let livedata = liveconfig['data'] || [];
                        if (!livedata.some(item => item.url == input)) {
                            showLoading('正在验证链接有效性...');
                            let YChtml = request(input, { timeout: 3000 });
                            let shstr = YChtml.substr(0, YChtml.indexOf('\n'));
                            if(shstr.includes(',http')){
                                YChtml = "未分组,#genre#\n" + YChtml;
                            }
                            if (YChtml.indexOf('#genre#') > -1 || YChtml.indexOf('#EXTINF:-1') > -1) {
                                hideLoading();
                                return $("", "链接有效，起个名字保存").input((livedata, url, livecfgfile, liveconfig) => {
                                    if (input) {
                                        livedata.push({ name: input, url: url });
                                        liveconfig['data'] = livedata;
                                        writeFile(livecfgfile, JSON.stringify(liveconfig));
                                        refreshPage(false);
                                        return "toast://增加自定义tv链接地址成功";
                                    } else {
                                        return "toast://输入不能为空"
                                    }
                                }, livedata, input, livecfgfile, liveconfig)
                            } else {
                                hideLoading();
                                return "toast://无法识别";
                            }
                        } else {
                            return "toast://已存在";
                        }
                    } else {
                        return "toast://地址不能为空";
                    }
                }, livecfgfile, liveconfig),
                col_type: 'text_1'
            });

            let livedata = liveconfig['data'] || [];
            if (livedata.length > 0) {
                d.push({
                    title: '点击下方的订阅源条目，进行操作👇',
                    col_type: "rich_text"
                });
                d.push({
                    col_type: "line"
                });
                function getide(is) {
                    if (is == 1) {
                        return '‘‘’’<strong><font color="#f13b66a">◉ </front></strong>';
                    } else {
                        return '‘‘’’<strong><font color="#F54343">◉ </front></strong>';
                    }
                }
                for (let i = 0; i < livedata.length; i++) {
                    d.push({
                        title: (livedata[i].show != 0 ? getide(1) : getide(0)) + livedata[i].name,
                        desc: livedata[i].url,
                        url: $(["复制链接", "修改名称", "导入本地", "更新缓存", "删除订阅", livedata[i].show != 0 ? "停用订阅" : "启用订阅", "列表置顶", "列表置底"], 2, "").select((livecfgfile, url, name) => {
                            try {
                                if (input == "更新缓存") {
                                    showLoading('正在缓存，请稍后.');
                                    let YChtml = request(url, { timeout: 3000 });
                                    let shstr = YChtml.substr(0, YChtml.indexOf('\n'));
                                    if(shstr.includes(',http')){
                                        YChtml = "未分组,#genre#\n" + YChtml;
                                    }
                                    if (YChtml.indexOf('#genre#') > -1) {
                                        deleteCache(url);
                                        let YChtml = fetchCache(url, 24, { timeout: 3000 }).replace(/TV-/g, 'TV').replace(/\[.*\]/g, '');
                                        hideLoading();
                                        return "toast://更新文件缓存成功";
                                    } else {
                                        hideLoading();
                                        return "toast://更新失败";
                                    }
                                } else if (input == "删除订阅") {
                                    if (/^http/.test(url)) {
                                        deleteCache(url);
                                    }
                                    let livecfg = fetch(livecfgfile);
                                    if (livecfg != "") {
                                        eval("var liveconfig = " + livecfg);
                                        let livedata = liveconfig['data'] || [];
                                        for (let i = 0; i < livedata.length; i++) {
                                            if (livedata[i].url == url) {
                                                livedata.splice(i, 1);
                                                break;
                                            }
                                        }
                                        liveconfig['data'] = livedata;
                                        writeFile(livecfgfile, JSON.stringify(liveconfig));
                                        refreshPage(false);
                                    }
                                } else if (input == "修改名称") {
                                    return $(name, "修改新名称").input((livecfgfile,url)=>{
                                        if(input.trim()==""){
                                            return "toast://名称不能为空";
                                        }
                                        let livecfg = fetch(livecfgfile);
                                        if (livecfg != "") {
                                            eval("var liveconfig = " + livecfg);
                                            let livedata = liveconfig['data'] || [];
                                            for (let i = 0; i < livedata.length; i++) {
                                                if (livedata[i].url == url) {
                                                    livedata[i].name = input;
                                                    break;
                                                }
                                            }
                                            liveconfig['data'] = livedata;
                                            writeFile(livecfgfile, JSON.stringify(liveconfig));
                                            refreshPage(false);
                                        }
                                    }, livecfgfile, url)
                                }  else if (input == "导入本地") {
                                    showLoading('叠加导入直播，最大万行限制');
                                    let YChtml = fetchCache(url, 24, { timeout: 3000 }).replace(/TV-/g, 'TV').replace(/\[.*\]/g, '');
                                    let shstr = YChtml.substr(0, YChtml.indexOf('\n'));
                                    if(shstr.includes(',http')){
                                        YChtml = "未分组,#genre#\n" + YChtml;
                                    }
                                    if (YChtml.indexOf('#genre#') > -1) {
                                        var YClives = YChtml.split('\n');
                                    } else {
                                        var YClives = [];
                                    }
                                    if (YClives.length > 0) {
                                        let importnum = 0;
                                        let JYlivefile = globalMap0.getVar('Src_Jy_gmParams').rulepath + "live.txt";
                                        let JYlive = fetch(JYlivefile);
                                        if (JYlive) {
                                            var JYlives = JYlive.split('\n');
                                            let id = 0;
                                            let py = 0;
                                            for (let i = 0; i < YClives.length; i++) {
                                                if (JYlives.length > 10000) {
                                                    log('直播数据源文件已大于10000行，为保证效率停止导入');
                                                    break;
                                                } else {
                                                    if (YClives[i].indexOf('#genre#') > -1 && JYlives.indexOf(YClives[i]) > -1) {
                                                        id = JYlives.indexOf(YClives[i]);
                                                        py = 0;
                                                    } else if (YClives[i].indexOf('#genre#') > -1 && JYlives.indexOf(YClives[i]) == -1) {
                                                        id = JYlives.length + 1;
                                                        py = 0;
                                                        JYlives.splice(id + 1, 0, YClives[i]);
                                                    } else if (YClives[i].indexOf(',') > -1 && JYlives.indexOf(YClives[i]) == -1 && YClives[i].trim() != "") {
                                                        JYlives.splice(id + 1 + py, 0, YClives[i]);
                                                        py++;
                                                        importnum++;
                                                    }
                                                }
                                            }
                                        } else {
                                            var JYlives = YClives;
                                            importnum = JYlives.length;
                                        }
                                        writeFile(JYlivefile, JYlives.join('\n'));
                                        hideLoading();
                                        if (importnum > 0 && getMyVar('JYlivedyurl', 'juying') == "juying") {
                                            putMyVar('isEdit', '1');
                                        }
                                        return "toast://成功导入" + importnum;
                                    } else {
                                        hideLoading();
                                        return "toast://文件异常或不支持的格式，导入失败";
                                    }
                                } else if (input == "复制链接") {
                                    copy(url);
                                } else if (input == "停用订阅" || input == "启用订阅") {
                                    let livecfg = fetch(livecfgfile);
                                    if (livecfg != "") {
                                        eval("var liveconfig = " + livecfg);
                                        let livedata = liveconfig['data'] || [];
                                        for (let i = 0; i < livedata.length; i++) {
                                            if (livedata[i].url == url) {
                                                livedata[i].show = input == "停用订阅" ? 0 : 1;
                                                break;
                                            }
                                        }
                                        liveconfig['data'] = livedata;
                                        writeFile(livecfgfile, JSON.stringify(liveconfig));
                                        refreshPage(false);
                                    }
                                } else if (input == "列表置顶" || input == "列表置底") {
                                    let livecfg = fetch(livecfgfile);
                                    if (livecfg != "") {
                                        eval("var liveconfig = " + livecfg);
                                        let datalist = liveconfig['data'] || [];
                                        let index = datalist.findIndex(item => item.url === url);
                                        if ((index == 0 && input == "列表置顶") || (index == datalist.length - 1 && input == "列表置底")) {
                                            return 'toast://位置移动无效';
                                        } else {
                                            let data = datalist[index];
                                            datalist.splice(index, 1);
                                            if (input == "列表置顶") {
                                                datalist.unshift(data);
                                            } else {
                                                datalist.push(data);
                                            }
                                        }
                                        liveconfig['data'] = datalist;
                                        writeFile(livecfgfile, JSON.stringify(liveconfig));
                                        refreshPage(false);
                                    }
                                }
                                return "hiker://empty";
                            } catch (e) {
                                hideLoading();
                                log(e.message);
                                return "toast://操作异常，详情查看日志";
                            }
                        }, livecfgfile, livedata[i].url, livedata[i].name),
                        col_type: "text_1"
                    });
                }
            } else {
                d.push({
                    title: '↻无记录',
                    col_type: "rich_text"
                });
            }
            setHomeResult(d);
        }),
        col_type: "text_icon"
    });
    d.push({
        title: "box配置订阅",
        img: globalMap0.getVar('Src_Jy_gmParams').getIcon("直播-箭头.svg"),
        col_type: "text_icon",
        url: $('hiker://empty#noRecordHistory##noHistory#').rule(() => {
            addListener("onClose", $.toString(() => {
                clearMyVar('importinput');
            }));
            let cfgfile = "hiker://files/rules/Src/Juying2/config.json";
            let Juconfig = {};
            let Jucfg = fetch(cfgfile);
            if (Jucfg != "") {
                eval("Juconfig=" + Jucfg + ";");
            }
            let d = [];
            d.push({
                title: '本地',
                col_type: 'input',
                desc: '请输入链接地址',
                url: $.toString(() => {
                    return `fileSelect://` + $.toString(() => {
                        return "toast://" + input;
                    })
                }),
                extra: {
                    titleVisible: false,
                    defaultValue: getMyVar('importinput', ''),
                    onChange: 'putMyVar("importinput",input)'
                }
            });
            d.push({
                title: '⏏️ 本地文件',
                col_type: 'text_2',
                url: `fileSelect://` + $.toString(() => {
                    putMyVar("importinput", "file://" + input);
                    refreshPage();
                    return "toast://" + input;
                })
            })
            d.push({
                title: '🆗 确定订阅',
                col_type: 'text_2',
                url: $('#noLoading#').lazyRule((Juconfig, cfgfile) => {
                    let input = getMyVar('importinput', '');
                    if (input == "") {
                        return 'toast://请先输入链接地址'
                    }

                    let importrecord = Juconfig['importrecord'] || [];
                    if (importrecord.length > 20) {//保留20个记录
                        importrecord.shift();
                    }
                    if (!importrecord.some(item => item.url == input && item.type == '1')) {
                        importrecord.push({ type: '1', url: input });
                        Juconfig['importrecord'] = importrecord;
                        writeFile(cfgfile, JSON.stringify(Juconfig));
                    }

                    let data;
                    try {
                        showLoading('检测文件有效性');
                        if (/\/storage\/emulated\//.test(input)) { input = "file://" + input }
                        let html = request(input, { timeout: 2000 });
                        if (html.includes('LuUPraez**')) {
                            html = base64Decode(html.split('LuUPraez**')[1]);
                        }
                        eval('data = ' + html)
                    } catch (e) {
                        hideLoading();
                        log('TVBox文件检测失败>' + e.message);
                        return "toast://TVBox导入失败：链接文件无效或内容有错";
                    }
                    hideLoading();
                    let lives = data.lives || [];
                    if (lives.length > 0) {
                        showLoading('正在导入');
                        try {
                            let urls = [];
                            for (let i = 0; i < lives.length; i++) {
                                if (lives[i].channels) {
                                    let channels = lives[i].channels;
                                    if (channels.length > 0) {
                                        for (let j = 0; j < channels.length; j++) {
                                            let live = channels[i].urls;
                                            for (let k = 0; k < live.length; k++) {
                                                let url = live[i].replace('proxy://do=live&type=txt&ext=', '');
                                                if (!/^http/.test(url)) {
                                                    url = base64Decode(url);
                                                }
                                                urls.push({ name: url.substr(url.lastIndexOf('/') + 1).split('.')[0], url: url });
                                            }
                                        }
                                    }
                                } else if (lives[i].url) {
                                    let url = lives[i].url;
                                    if (/^\./.test(url)) {
                                        url = input.match(/http(s)?:\/\/.*\//)[0] + url.replace("./", "");
                                    }
                                    urls.push({ name: lives[i].name || url.substr(url.lastIndexOf('/') + 1).split('.')[0], url: url });
                                }
                            }
                            if (urls.length > 0) {
                                livenum = 0;
                                let livecfgfile = "hiker://files/rules/Src/Juying2/liveconfig.json";
                                let livecfg = fetch(livecfgfile);
                                if (livecfg != "") {
                                    eval("var liveconfig = " + livecfg);
                                } else {
                                    var liveconfig = {};
                                }
                                let livedata = liveconfig['data'] || [];
                                for (let i = 0; i < urls.length; i++) {
                                    if (!livedata.some(item => item.url == urls[i].url)) {
                                        let YChtml = request(urls[i].url, { timeout: 5000 }).replace(/TV-/g, 'TV');
                                        let shstr = YChtml.substr(0, YChtml.indexOf('\n'));
                                        if(shstr.includes(',http')){
                                            YChtml = "未分组,#genre#\n" + YChtml;
                                        }
                                        if (YChtml.indexOf('#genre#') > -1 || YChtml.indexOf('#EXTINF:-1') > -1) {
                                            livedata.push(urls[i]);
                                            livenum++;
                                        }
                                    }
                                }
                                if (livenum > 0) {
                                    liveconfig['data'] = livedata;
                                    writeFile(livecfgfile, JSON.stringify(liveconfig));
                                }
                                hideLoading();
                                return 'toast://成功订阅：' + livenum;
                            }
                        } catch (e) {
                            log('TVBox导入live保存失败>' + e.message);
                        }
                    }
                    hideLoading();
                    return 'toast://失败';
                }, Juconfig, cfgfile)
            })

            d.push({
                title: '🆖 历史记录',
                col_type: "rich_text"
            });
            let importrecord = Juconfig['importrecord'] || [];
            let lists = importrecord.filter(item => {
                return item.type == '1';
            })
            if (lists.length > 0) {
                lists.reverse();
                for (let i = 0; i < lists.length; i++) {
                    d.push({
                        title: lists[i].url,
                        url: $('#noLoading#').lazyRule((url) => {
                            putMyVar('importinput', url);
                            refreshPage(true);
                            return "toast://已选择，需确认";
                        }, lists[i].url),
                        col_type: "text_1",
                        extra: {
                            id: lists[i].url,
                            longClick: [{
                                title: "删除",
                                js: $.toString((cfgfile, Juconfig, url) => {
                                    let importrecord = Juconfig['importrecord']||[];
                                    for(let j=0;j<importrecord.length;j++){
                                        if(importrecord[j].url==url&&importrecord[j].type=='1'){
                                            importrecord.splice(j,1);
                                            break;
                                        }
                                    }
                                    Juconfig['importrecord'] = importrecord; 
                                    writeFile(cfgfile, JSON.stringify(Juconfig));
                                    refreshPage(false);
                                    return "toast://已删除";
                                },cfgfile, Juconfig, lists[i].url)
                            }]
                        }
                    });
                }
            }
            setResult(d);
        })
    });
    d.push({
        col_type: "line",
    });
    d.push({
        title: "编辑本地源",
        img: globalMap0.getVar('Src_Jy_gmParams').getIcon("直播-箭头.svg"),
        col_type: "text_icon",
        url:
            getMyVar("JYlivedyurl", "juying") == "juying"
                ? $("#noLoading#").lazyRule(() => {
                    if (getMyVar("JYlivenum", "0") == "0") {
                        return "toast://本地数据源为空，无法进入编辑模式";
                    }
                    putMyVar("editmode", "1");
                    putMyVar("isEdit", "1");
                    return "toast://进入编辑模式，长按分组或频道选择操作";
                })
                : "toast://当前为远程订阅源，无法进入编辑模式",
    });
    d.push({
        title: "清空直播源",
        img: globalMap0.getVar('Src_Jy_gmParams').getIcon("直播-箭头.svg"),
        col_type: "text_icon",
        url: $("确定清空聚影直播本地文件？").confirm(() => {
            writeFile(globalMap0.getVar('Src_Jy_gmParams').rulepath + "live.txt", "");
            if (getMyVar("JYlivedyurl", "juying") == "juying") {
                putMyVar("isEdit", "1");
            }
            clearMyVar("JYlivenum");
            refreshPage(false);
            return "toast://已清空";
        }),
    });
    d.push({
        col_type: "line_blank",
    });
    d.push({
        title: "清理失效",
        img: globalMap0.getVar('Src_Jy_gmParams').getIcon("直播-清理.svg"),
        col_type: "avatar",
        url: "hiker://empty",
    });
    d.push({
        title: "‘‘实验功能可能存在误删，谨慎操作！’’",
        desc: "通过判断地址是否可以访问来甄别有效性\n聚影本地直播源地址有：" + getMyVar("JYlivenum", "0"),
        col_type: 'text_center_1',
        url: $('#noLoading#').lazyRule(() => {
            putMyVar('isEdit', '1');
            let urls = [];
            let JYlivefile = globalMap0.getVar('Src_Jy_gmParams').rulepath + "live.txt";
            let JYlive = fetch(JYlivefile);
            if (JYlive != "") {
                var task = function (obj) {
                    try {
                        let url = obj.split(',')[1];
                        let code = JSON.parse(request(url, { onlyHeaders: true, timeout: 1000 }));
                        if (code.statusCode != 200) {
                            fails.push(obj);
                        }
                    } catch (e) {

                    }
                    return 1;
                }

                let JYlives = JYlive.split('\n');
                for (let i = 0; i < JYlives.length; i++) {
                    try {
                        if (JYlives[i].indexOf(',') > -1 && JYlives[i].indexOf('#genre#') == -1) {
                            urls.push(JYlives[i]);
                        }
                    } catch (e) { }
                }
                showLoading('检测' + urls.length + '条，保持屏幕亮屏');
                let fails = [];
                for (var i = 0; i < urls.length; i++) {
                    let UrlList = [];
                    let p = i + 799;
                    for (let s = i; s < p; s++) {
                        UrlList.push(urls[s]);
                        i = s;
                    }
                    let urlscheck = UrlList.map((list) => {
                        return {
                            func: task,
                            param: list,
                            id: list
                        }

                    });
                    be(urlscheck, {
                        func: function (obj, id, error, taskResult) {
                        },
                        param: {
                        }
                    });
                }

                for (let i = 0; i < JYlives.length; i++) {
                    if (fails.indexOf(JYlives[i]) > -1) {
                        JYlives.splice(i, 1);
                        i = i - 1;
                    }
                }
                writeFile(JYlivefile, JYlives.join('\n'));
                hideLoading();
                if (fails.length > 0 && getMyVar('JYlivedyurl', 'juying') == "juying") {
                    putMyVar('isEdit', '1');
                }
                return "toast://删除疑似失效源" + fails.length + "条";
            } else {
                return "toast://没有直播数据源";
            }
        })
    });
    setHomeResult(d);
}