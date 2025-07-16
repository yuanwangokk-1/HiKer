const csdown = {
    d: [],
    version: '20250501',
    author: '流苏',
    rely: (data) => {
        return data.match(/\{([\s\S]*)\}/)[0].replace(/\{([\s\S]*)\}/, '$1')
    },
    home: () => {
        var d = csdown.d;
        if (MY_PAGE == 1) {
            d.push({   
                title: "搜索 ",
                url: $.toString(() => {
                    putMyVar('keyword', input)
                    return 'hiker://empty?page=fypage@rule=js:$.require("csdown").search()'
                }),
                   desc: "请输入搜索关键词",
                   col_type: "input",
                extra: {
                    defaultValue: getMyVar('keyword', ''),
                }
            })
        };
        var pg = getParam('page');
        var c1 = [{
            title: '吃瓜&片库&社区',
            id: '1&2&3&4&5',
            img: 'https://ghproxy.net/https://raw.githubusercontent.com/ls125781003/tubiao/main/more/47.png&https://ghproxy.net/https://raw.githubusercontent.com/ls125781003/tubiao/main/more/175.png&https://ghproxy.net/https://raw.githubusercontent.com/ls125781003/tubiao/main/more/78.png&https://ghproxy.net/https://raw.githubusercontent.com/ls125781003/tubiao/main/more/48.png&https://ghproxy.net/https://raw.githubusercontent.com/ls125781003/tubiao/main/more/109.png'
        }];
        if (MY_PAGE == 1) {
            eval(csdown.rely(csdown.aes));
            Cate(c1, 'c1', d, 'icon_3_round_fill');
            d.push({
                col_type: 'line',
            }, {
                col_type: 'big_blank_block',
            }, {
                col_type: 'big_blank_block',
            });
        }
        var 分类 = getMyVar('c1', '1');
        if (MY_RULE.author == csdown.author || MY_NAME == '嗅觉浏览器') {
            if (分类 == 1) {
                csdown.black()
            } else if (分类 == 2) {
                csdown.video()
            } else if (分类 == 3) {
                csdown.topic()
            }
        } else {
            d.push({
                title: '请勿修改作者名',
                url: 'hiker://empty',
                col_type: 'text_center_1'
            })
        }
        setResult(d)
    },
    aes: $.toString(() => {
        //加载CryptoJS库
        eval(getCryptoJS())

        function color(txt) {
            return '<b><font color=' + '#FF6699' + '>' + txt + '</font></b>'
        }

        function strong(d, c) {
            return '‘‘’’<strong><font color=#' + (c || '000000') + '>' + d + '</font></strong>';
        }

        function Cate(list, n, d, col, longclick) {
            if (!col) {
                col = 'scroll_button';
            }
            if (!longclick) {
                longclick = [];
            }
            var index_n = list[0].id.split('&')[0] + '';
            list.forEach(data => {
                var title = data.title.split('&');
                var id = data.id.split('&');
                if (data.img != null) {
                    var img = data.img.split('&');
                } else {
                    var img = [];
                }
                title.forEach((title, index) => {
                    d.push({
                        title: (getMyVar(n, index_n) == id[index] ? strong(title, 'FF6699') : title),
                        img: img[index],
                        url: $('#noLoading#').lazyRule((n, title, id) => {
                            putMyVar(n, id);
                            refreshPage(false);
                            return 'hiker://empty';
                        }, n, title, id[index] + ''),
                        col_type: col,
                        extra: {
                            longClick: longclick,
                        }
                    })
                })
                d.push({
                    col_type: 'blank_block',
                });
            })
            return d;
        }

        // 解密函数
        function Decrypt(word) {
            const id = CryptoJS.enc.Utf8.parse("66JY6UGvib6b5Dpj");
            const iv = CryptoJS.enc.Utf8.parse("bd5d212d30324ff6");
            let encryptedHexStr = CryptoJS.enc.Base64.parse(word);
            let decrypt = CryptoJS.AES.decrypt({
                ciphertext: encryptedHexStr
            }, id, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
            let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
            return decryptedStr;
        }

        // 加密函数
        function Encrypt(plaintext) {
            const id = CryptoJS.enc.Utf8.parse("66JY6UGvib6b5Dpj");
            const iv = CryptoJS.enc.Utf8.parse("bd5d212d30324ff6");
            var encrypted = CryptoJS.AES.encrypt(plaintext, id, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
            var ciphertext = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
            return ciphertext;
        }

        var image = $('').image(() => {
            const CryptoUtil = $.require("hiker://assets/crypto-java.js");
            let key = CryptoUtil.Data.parseUTF8("66JY6UGvib6b5Dpj");
            let iv = CryptoUtil.Data.parseUTF8("bd5d212d30324ff6");
            let textData = CryptoUtil.Data.parseInputStream(input).toString();
            let encrypted = CryptoUtil.AES.decrypt(textData, key, {
                mode: "AES/CBC/PKCS7Padding",
                iv: iv
            });
            let de = CryptoUtil.Data.parseBase64(encrypted, _base64.NO_WRAP);
            return de.toInputStream();
        })
        // 随机字符串方法
        function generateRandomHex(length) {
            var result = '';
            var characters = '0123456789abcdef';
            for (var i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return result;
        }

        function post(url, body) {
            function generateRandomHex(length) {
                var result = '';
                var characters = '0123456789abcdef';
                for (var i = 0; i < length; i++) {
                    result += characters.charAt(Math.floor(Math.random() * characters.length));
                }
                return result;
            }
            let requestId = generateRandomHex(32);
            let t = Math.floor(Date.now());
            let data = Encrypt(body);
            let sign = md5('body' + data + 'appIdsc04requestId' + requestId + 'time' + t);
            let body = '{"requestId":"' + requestId + '","appId":"sc04","time":' + t + ',"body":"' + data + '","sign":"' + sign + '"}';
            let html = fetch(url, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                    'm-acct': 'sc04',
                    'c-token': getMyVar('token'),
                    'user-agent': 'Dart/3.4 (dart:io)',
                },
                body: body,
                method: 'POST'
            }).slice(1, -1);
            let html1 = Decrypt(html);
            return JSON.parse(html1);
        }

        var vod = $('').lazyRule(() => {
            eval($.require("csdown").rely($.require("csdown").aes));
            let vod_body = '{"videoId":"' + input + '"}'
            let vod_url = getMyVar('host') + '/front/long/handle/userGetVideoInfo';
            let url1 = getItem('Domain') + post(vod_url, vod_body).data.videoInfo.masterVideoUrl;
            if (url1.includes('preview')) {
                $.require("csdown").token()
            }
            url1 = getItem('Domain') + post(vod_url, vod_body).data.videoInfo.masterVideoUrl;
            return url1
        })

        function pageAdd(page) {
            if (getMyVar("page")) {
                putMyVar("page", (parseInt(page) + 1) + '');
            }
            return;
        } //翻页

        function pageMoveto(page, pages) {
            var longClick = [{
                title: "首页",
                js: $.toString(() => {
                    putMyVar("page", "1");
                    refreshPage();
                    return "hiker://empty";
                }),
            }, {
                title: "上页",
                js: $.toString((page) => {
                    if (page > 1) {
                        putMyVar("page", (parseInt(page) - 1));
                        refreshPage();
                        return "hiker://empty";
                    }
                }, page),
            }, {
                title: "当前第" + page + "页",
                js: "",
            }, {
                title: "跳转",
                js: $.toString(() => {
                    return $("").input(() => {
                        putMyVar("page", input);
                        refreshPage();
                    });
                }),
            }];
            if (typeof(pages) != 'undefined') {
                var extra1 = {
                    title: "尾页" + pages,
                    js: $.toString((pages) => {
                        putMyVar("page", pages);
                        refreshPage();
                        return "hiker://empty";
                    }, pages),
                };
                longClick.push(extra1)
            }
            return longClick
        } //长按跳页
    }),
    search: () => {
        var d = csdown.d;
        eval(csdown.rely(csdown.aes));
        if (MY_PAGE == 1) {
            d.push({   
                title: "搜索 ",
                url: $.toString(() => {
                    putMyVar('keyword', input)
                    refreshPage(false)
                    return "hiker://empty"
                }),
                   desc: "请输入搜索关键词",
                   col_type: "input",
                extra: {
                    defaultValue: getMyVar('keyword', ''),
                    pageTitle: '搜索结果'
                }
            })
            let 搜索 = [{
                title: '吃瓜&视频&帖子',
                id: '1&2&3'
            }]
            Cate(搜索, '搜索', d)
        }
        let pg = getParam('page');
        try {
            if (getMyVar('搜索', '1') == 2) {
                let url = getMyVar('host') + '/front/long/handle/search';
                let body = '{"tagName":null,"searchWord":"' + getMyVar('keyword') + '","pageNo":' + pg + ',"pageSize":10}';
                let data = post(url, body).data.dataList;
                data.forEach(data => {
                    d.push({
                        title: data.videoInfo.videoTitle,
                        desc: data.publishTime + '  ' + parseInt(data.videoInfo.videoDuration / 60) + ':' + parseInt(data.videoInfo.videoDuration % 60),
                        img: getItem('Domain') + data.videoInfo.videoCoverImg + image,
                        url: data.videoId + vod,
                        col_type: 'movie_2',
                    })
                })
            } else if (getMyVar('搜索', '1') == 1) {
                let url = getMyVar('host') + '/front/article/search';
                let body = '{"pageNo":' + pg + ',"pageSize":10,"searchWord":"' + getMyVar('keyword') + '","tagName":null,"mediaType":21}';
                let data = post(url, body).data.dataList;
                data.forEach(data => {
                    d.push({
                        title: data.title,
                        desc: data.createTime + '\n' + data.description,
                        img: getItem('Domain') + data.cover + image,
                        url: 'hiker://empty?page=fypage@rule=js:$.require("csdown").blackerji()',
                        col_type: 'pic_1_card',
                        extra: {
                            id: data.articleId,
                        }
                    })
                })
            } else if (getMyVar('搜索', '1') == 3) {
                let url = getMyVar('host') + '/front/article/search';
                let body = '{"pageNo":' + pg + ',"pageSize":10,"searchWord":"' + getMyVar('keyword') + '","tagName":null,"mediaType":3}';
                let data = post(url, body).data.dataList;
                data.forEach(data => {
                    d.push({
                        title: data.user.nickname,
                        desc: data.createTime,
                        img: 'https://630heiliao.cc/favicon.ico',
                        url: 'hiker://empty?page=fypage@rule=js:$.require("csdown").uperji()',
                        col_type: 'avatar',
                        extra: {
                            id: data.userId
                        }
                    }, {
                        title: data.title,
                        desc: data.description,
                        url: 'hiker://empty@rule=js:$.require("csdown").topicerji()',
                        col_type: 'text_1',
                        extra: {
                            lineVisible: false,
                            id: data.articleId,
                        }
                    })
                    if (data.imagePreview) {
                        var content = data.content;
                        JSON.parse(data.imagePreview).forEach(data => {
                            if (data.type == 'image') {
                                d.push({
                                    img: getItem('Domain') + data.imgUrl + image,
                                    url: getItem('Domain') + data.imgUrl + image,
                                    col_type: 'movie_3',
                                })
                            } else if (data.type == 'video') {
                                d.push({
                                    title: strong('视频', 'FF6699'),
                                    desc: '0',
                                    img: getItem('Domain') + data.imgUrl + image,
                                    url: $('noLoading#').lazyRule(content => {
                                        eval($.require("csdown").rely($.require("csdown").aes));
                                        let data = getItem('Domain') + JSON.parse(Decrypt(fetch(getItem('Domain') + content)))[0].mainUrl;
                                        return data;
                                    }, content),
                                    col_type: 'card_pic_1',
                                })
                            }
                        })
                    }
                    if (data.topic) {
                        d.push({
                            title: data.topic.title,
                            url: 'hiker://empty?page=fypage@rule=js:$.require("csdown").qunerji',
                            col_type: 'flex_button',
                            extra: {
                                id: data.topic.topicId,
                            }
                        })
                    }
                })
            }
        } catch (e) {
            log(e.message)
            csdown.token()
        }
        setResult(d)
    },
    black: () => {
        var d = csdown.d;
        eval(csdown.rely(csdown.aes));
        var pg = getParam('page');
        try {
            if (MY_PAGE == 1) {
                if (!getMyVar('host', '')) {
                    let host_arr = ["https://csv.retkd8vu.top", "https://api.sgx2lmhm.vip", "https://api.zche66xh.vip"];
                    for (let item of host_arr) {
                        let data = JSON.parse(fetch(item + '/front/test', {
                            withStatusCode: true,
                            timeout: 5000,
                        }));
                        if (data.statusCode == 200) {
                            putMyVar('host', item);
                            break;
                        }
                    }
                }
                if (storage0.getMyVar('cdnline') == '') {
                    let cdnline_url = getMyVar('host') + '/front/system/cdnline/userGetCdn';
                    let cdnline_data = post(cdnline_url, '{"cdnType":1}').data
                    storage0.putMyVar('cdnline', cdnline_data)
                    for (let item of storage0.getMyVar('cdnline')) {
                        let data = JSON.parse(fetch(item.cdnLine + '/test', {
                            withStatusCode: true,
                            timeout: 5000,
                        }));
                        if (data.statusCode == 200) {
                            setItem('Domain', item.cdnLine);
                            break;
                        }
                    }
                }
                if (!storage0.getItem('cate_')) {
                    let cate_url = getMyVar('host') + '/front/long/category/userGetCategory';
                    let cate_data = post(cate_url, '{}').data;
                    storage0.setItem('cate_', cate_data)
                }
                let index_n = storage0.getItem('cate_')[0].childList[0].categoryId + '';
                putMyVar('index_black', index_n)
                storage0.getItem('cate_')[0].childList.forEach(data => {
                    d.push({
                        title: getMyVar('black', getMyVar('index_black')) == data.categoryId + '' ? strong(data.categoryName, 'FF6699') : data.categoryName,
                        url: $('#noLoading#').lazyRule((title, id) => {
                            putMyVar('black', id);
                            refreshPage(false);
                            return 'hiker://empty';
                        }, data.categoryName, data.categoryId + ''),
                        col_type: 'scroll_button',
                        extra: {
                            id: data.categoryId,
                            longClick: [],
                        }
                    })
                })
                d.push({
                    col_type: 'blank_block',
                })
                let 黑料分类 = [{
                    title: '最新&最热&推荐&精华',
                    id: 'publish_time&view&publish_weight&favor'
                }]
                Cate(黑料分类, '黑料分类', d)
            }
            let black_url = getMyVar('host') + '/front/article/page';
            if (getMyVar('black', getMyVar('index_black')) == getMyVar('index_black')) {
                var black_body = '{"pageNo":' + pg + ',"pageSize":10,"mediaType":21,"publishDate":null,"payType":null,"topicId":"","subjectId":null,"publishStatus":1,"recommend":null,"firstCategoryId":null,"secondCategoryId":"","thirdCategoryId":"","sort":"' + getMyVar('黑料分类', 'publish_time') + '"}'
            } else if (getMyVar('black', getMyVar('index_black')) == '1821892692577890304') {
                var black_body = '{"pageNo":' + pg + ',"pageSize":10,"mediaType":21,"publishDate":null,"payType":null,"topicId":null,"subjectId":null,"publishStatus":1,"recommend":1,"firstCategoryId":null,"secondCategoryId":null,"thirdCategoryId":null,"sort":"' + getMyVar('黑料分类', 'publish_time') + '"}';
            } else {
                var black_body = '{"pageNo":' + pg + ',"pageSize":10,"mediaType":21,"publishDate":null,"payType":null,"topicId":"","subjectId":null,"publishStatus":1,"recommend":null,"firstCategoryId":null,"secondCategoryId":"' + getMyVar('black', getMyVar('index_black')) + '","thirdCategoryId":"","sort":"' + getMyVar('黑料分类', 'publish_time') + '"}';
            }
            let black_data = post(black_url, black_body).data.dataList;
            black_data.forEach(data => {
                d.push({
                    title: data.title,
                    desc: data.createTime + '\n' + data.description,
                    img: getItem('Domain') + data.cover + image,
                    url: 'hiker://empty?page=fypage@rule=js:$.require("csdown").blackerji()',
                    col_type: 'pic_1_card',
                    extra: {
                        id: data.articleId,
                        longClick: []
                    }
                })
            })
        } catch (e) {
            log(e.message)
            csdown.token()
        }
    },
    blackerji: () => {
        var d = csdown.d;
        eval(csdown.rely(csdown.aes));
        let id = MY_PARAMS.id;
        try {
            let url = getMyVar('host') + '/front/article/get';
            let body = '{"articleId":"' + id + '"}';
            let article_data = post(url, body).data;
            let content = JSON.parse(Decrypt(fetch(getItem('Domain') + article_data.content)));
            d.push({
                title: article_data.title,
                col_type: 'rich_text'
            })
            content.forEach((data, index) => {
                if (data.mainUrl) {
                    d.push({
                        title: strong('视频' + index, 'FF6699'),
                        desc: '0',
                        img: getItem('Domain') + data.videoCover + image,
                        url: getItem('Domain') + data.mainUrl,
                        col_type: 'card_pic_1'
                    })
                }
            })
            content.forEach((data, index) => {
                if (data.content) {
                    let texts = data.content.replace(/\<\/p\>.*?\<p\>/g, '</p>&&<p>').split('&&');
                    texts.forEach((item, index) => {
                        if (pdfh(item, 'p&&Text')) {
                            d.push({
                                title: pdfh(item, 'p&&Text'),
                                col_type: 'rich_text',
                            });
                        }
                        let imgs = pdfa(item, 'p&&img').map(h => pdfh(h, 'img&&src'));
                        imgs.forEach(item2 => {
                            d.push({
                                title: '',
                                img: getItem('Domain') + item2 + image,
                                url: getItem('Domain') + item2 + image,
                                col_type: 'pic_1_full'
                            });
                        });
                    })
                } else {
                    d.push({
                        title: strong('视频' + index, 'FF6699'),
                        desc: '0',
                        img: getItem('Domain') + data.videoCover + image,
                        url: getItem('Domain') + data.mainUrl,
                        col_type: 'card_pic_1'
                    })
                }
            })
        } catch (e) {
            log(e.message)
            csdown.token()
        }
        setResult(d)
    },
    video: () => {
        var d = csdown.d;
        eval(csdown.rely(csdown.aes));
        var pg = getParam('page');
        try {
            if (MY_PAGE == 1) {
                let index_n = storage0.getItem('cate_')[1].childList[0].categoryId + '';
                putMyVar('index_video', index_n)
                storage0.getItem('cate_')[1].childList.forEach(data => {
                    d.push({
                        title: getMyVar('video', getMyVar('index_video')) == data.categoryId + '' ? strong(data.categoryName, 'FF6699') : data.categoryName,
                        url: $('#noLoading#').lazyRule((title, id) => {
                            putMyVar('video', id);
                            refreshPage(false);
                            return 'hiker://empty';
                        }, data.categoryName, data.categoryId + ''),
                        col_type: 'scroll_button',
                        extra: {
                            id: data.categoryId,
                            longClick: [],
                        }
                    })
                })
                d.push({
                    col_type: 'blank_block'
                })
            }
            if (getMyVar('video', getMyVar('index_video')) == '1821892098983211008' || getMyVar('video', getMyVar('index_video')) == '1836975781077463040') {
                if (MY_PAGE == 1) {
                    let video_url = getMyVar('host') + '/front/long/handle/listAllGroupBySecondCategoryId';
                    let video_body = '{"categoryId":"' + getMyVar('video', getMyVar('index_video')) + '"}'
                    let video_data = post(video_url, video_body).data;
                    video_data.forEach(data => {
                        d.push({
                            title: color(data.categoryName),
                            img: 'hiker://images/icon_right5',
                            url: 'hiker://empty?page=fypage@rule=js:$.require("csdown").videoerji()',
                            col_type: 'text_icon',
                            extra: {
                                id: data.categoryId,
                            }
                        })
                        let videoInfoList = data.videoInfoList;
                        videoInfoList.forEach(data => {
                            d.push({
                                title: data.videoInfo.videoTitle,
                                desc: data.publishTime + '  ' + parseInt(data.videoInfo.videoDuration / 60) + ':' + parseInt(data.videoInfo.videoDuration % 60),
                                img: getItem('Domain') + data.videoInfo.videoCoverImg + image,
                                url: data.videoId + vod,
                                col_type: 'movie_2',
                            })
                        })
                    })
                }
            } else {
                if (MY_PAGE == 1) {
                    let 片库分类 = [{
                        title: '最新&最热&推荐&精华',
                        id: 'publish_time&view&publish_weight&favor'
                    }]
                    Cate(片库分类, '片库分类', d)
                }
                if (getMyVar('video', getMyVar('index_video')) == '1821892179224440832') {
                    var video_url = getMyVar('host') + '/front/long/handle/userGetVideoBySubjectId';
                    var video_body = '{"subjectId":null,"orderType":"' + getMyVar('片库分类', 'publish_time') + '","recommend":null,"pageNo":' + pg + ',"pageSize":10}'
                } else {
                    var video_url = getMyVar('host') + '/front/long/handle/userGetVideoByCategoryId';
                    var video_body = '{"categoryId":"' + getMyVar('video', getMyVar('index_video')) + '","orderType":"' + getMyVar('片库分类', 'publish_time') + '","recommend":null,"pageNo":' + pg + ',"pageSize":10}'
                }
                let video_data = post(video_url, video_body).data.dataList;
                video_data.forEach(data => {
                    d.push({
                        title: data.videoInfo.videoTitle,
                        desc: data.publishTime + '  ' + parseInt(data.videoInfo.videoDuration / 60) + ':' + parseInt(data.videoInfo.videoDuration % 60),
                        img: getItem('Domain') + data.videoInfo.videoCoverImg + image,
                        url: data.videoId + vod,
                        col_type: 'movie_2',
                    })
                })
            }
        } catch (e) {
            log(e.message)
            csdown.token()
        }
    },
    videoerji: () => {
        var d = csdown.d;
        eval(csdown.rely(csdown.aes));
        if (MY_PAGE == 1) {
            let 视频二级分类 = [{
                title: '最新&最热&推荐&精华',
                id: 'publish_time&view&publish_weight&favor'
            }]
            Cate(视频二级分类, '视频二级分类', d)
        }
        let id = MY_PARAMS.id;
        let pg = getParam('page');
        try {
            let url = getMyVar('host') + '/front/long/handle/userGetVideoByCategoryId';
            let body = '{"categoryId":"' + id + '","orderType":"' + getMyVar('视频二级分类', 'publish_time') + '","recommend":null,"pageNo":' + pg + ',"pageSize":10}';
            let data = post(url, body).data.dataList;
            data.forEach(data => {
                d.push({
                    title: data.videoInfo.videoTitle,
                    desc: data.publishTime + '  ' + parseInt(data.videoInfo.videoDuration / 60) + ':' + parseInt(data.videoInfo.videoDuration % 60),
                    img: getItem('Domain') + data.videoInfo.videoCoverImg + image,
                    url: data.videoId + vod,
                    col_type: 'movie_2',
                })
            })
        } catch (e) {
            log(e.message)
            csdown.token()
        }
        setResult(d)
    },
    topic: () => {
        var d = csdown.d;
        eval(csdown.rely(csdown.aes));
        var pg = getParam('page');
        try {
            if (MY_PAGE == 1) {
                let index_n = storage0.getItem('cate_')[4].childList[0].categoryId + '';
                putMyVar('index_topic', index_n)
                storage0.getItem('cate_')[4].childList.forEach(data => {
                    d.push({
                        title: getMyVar('topic', getMyVar('index_topic')) == data.categoryId + '' ? strong(data.categoryName, 'FF6699') : data.categoryName,
                        url: $('#noLoading#').lazyRule((title, id) => {
                            putMyVar('topic', id);
                            refreshPage(false);
                            return 'hiker://empty';
                        }, data.categoryName, data.categoryId + ''),
                        col_type: 'scroll_button',
                        extra: {
                            id: data.categoryId,
                            longClick: [],
                        }
                    })
                })
                d.push({
                    col_type: 'blank_block'
                })
                let 社区分类 = [{
                    title: '最新&最热&推荐&精华',
                    id: 'publish_time&view&publish_weight&favor'
                }]
                Cate(社区分类, '社区分类', d)
                let topicpage_url = getMyVar('host') + '/front/topic/page';
                let topicpage_body = '{"pageNo":' + pg + ',"pageSize":6,"title":null,"categoryId":null,"topicId":null,"recommend":1,"firstCategoryId":null,"secondCategoryId":"' + getMyVar('topic', getMyVar('index_topic')) + '","thirdCategoryId":null,"sort":null}';
                let topicpage_data = post(topicpage_url, topicpage_body).data.dataList;
                topicpage_data.forEach(data => {
                    d.push({
                        title: data.title,
                        desc: '0',
                        img: getItem('Domain') + data.topicCover + image,
                        url: 'hiker://empty?page=fypage@rule=js:$.require("csdown").qunerji()',
                        col_type: 'card_pic_3_center',
                        extra: {
                            id: data.topicId
                        }
                    })
                })
            }
            let topic_url = getMyVar('host') + '/front/article/page';
            let topic_body = '{"pageNo":' + pg + ',"pageSize":10,"mediaType":3,"publishDate":null,"payType":null,"topicId":null,"subjectId":null,"publishStatus":1,"recommend":null,"firstCategoryId":null,"secondCategoryId":"' + getMyVar('topic', getMyVar('index_topic')) + '","thirdCategoryId":null,"sort":"' + getMyVar('片库分类', 'publish_time') + '"}';
            let topic_data = post(topic_url, topic_body).data.dataList;
            topic_data.forEach(data => {
                d.push({
                    title: data.user.nickname,
                    desc: data.createTime,
                    img: 'https://630heiliao.cc/favicon.ico',
                    url: 'hiker://empty?page=fypage@rule=js:$.require("csdown").uperji()',
                    col_type: 'avatar',
                    extra: {
                        id: data.userId
                    }
                }, {
                    title: data.title,
                    desc: data.description,
                    url: 'hiker://empty@rule=js:$.require("csdown").topicerji()',
                    col_type: 'text_1',
                    extra: {
                        lineVisible: false,
                        id: data.articleId,
                    }
                })
                if (data.imagePreview) {
                    var content = data.content;
                    JSON.parse(data.imagePreview).forEach(data => {
                        if (data.type == 'image') {
                            d.push({
                                img: getItem('Domain') + data.imgUrl + image,
                                url: getItem('Domain') + data.imgUrl + image,
                                col_type: 'movie_3',
                            })
                        } else if (data.type == 'video') {
                            d.push({
                                title: strong('视频', 'FF6699'),
                                desc: '0',
                                img: getItem('Domain') + data.imgUrl + image,
                                url: $('noLoading#').lazyRule(content => {
                                    eval($.require("csdown").rely($.require("csdown").aes));
                                    let data = getItem('Domain') + JSON.parse(Decrypt(fetch(getItem('Domain') + content)))[0].mainUrl;
                                    return data;
                                }, content),
                                col_type: 'card_pic_1',
                            })
                        }
                    })
                }
                if (data.topic) {
                    d.push({
                        title: data.topic.title,
                        url: 'hiker://empty?page=fypage@rule=js:$.require("csdown").qunerji()',
                        col_type: 'flex_button',
                        extra: {
                            id: data.topic.topicId,
                        }
                    })
                }
            })
        } catch (e) {
            log(e.message)
            csdown.token()
        }
    },
    topicerji: () => {
        var d = csdown.d;
        eval(csdown.rely(csdown.aes));
        let id = MY_PARAMS.id;
        try {
            let url = getMyVar('host') + '/front/article/get';
            let body = '{"articleId":"' + id + '"}'
            let data = post(url, body).data;
            d.push({
                title: data.user.nickname,
                desc: data.createTime,
                img: 'https://630heiliao.cc/favicon.ico',
                url: 'hiker://empty?page=fypage@rule=js:$.require("csdown").uperji()',
                col_type: 'avatar',
                extra: {
                    id: data.userId
                }
            }, {
                title: data.title,
                url: 'hiker://empty',
                col_type: 'rich_text',
                extra: {
                    lineVisible: false,
                    id: data.articleId,
                }
            }, {
                title: data.description,
                col_type: 'rich_text',
            })
            if (data.imagePreview) {
                var content = data.content;
                JSON.parse(data.imagePreview).forEach(data => {
                    if (data.type == 'image') {
                        d.push({
                            img: getItem('Domain') + data.imgUrl + image,
                            url: getItem('Domain') + data.imgUrl + image,
                            col_type: 'pic_1_full',
                        })
                    } else if (data.type == 'video') {
                        d.push({
                            title: strong('视频', 'FF6699'),
                            desc: '0',
                            img: getItem('Domain') + data.imgUrl + image,
                            url: $('noLoading#').lazyRule(content => {
                                eval($.require("csdown").rely($.require("csdown").aes));
                                let data = getItem('Domain') + JSON.parse(Decrypt(fetch(getItem('Domain') + content)))[0].mainUrl;
                                return data;
                            }, content),
                            col_type: 'card_pic_1',
                        })
                    }
                })
            }
        } catch (e) {
            log(e.message)
            csdown.token()
        }
        setResult(d)
    },
    uperji: () => {
        var d = csdown.d;
        eval(csdown.rely(csdown.aes));
        let id = MY_PARAMS.id;
        let pg = getParam('page');
        try {
            let url = getMyVar('host') + '/front/article/pageByUser';
            let body = '{"pageNo":' + pg + ',"pageSize":10,"mediaType":3,"userId":"' + id + '","publishStatus":1,"sort":null}';
            let data = post(url, body).data.dataList;
            data.forEach(data => {
                d.push({
                    title: data.user.nickname,
                    desc: data.createTime,
                    img: 'https://630heiliao.cc/favicon.ico',
                    url: 'hiker://empty?page=fypage@rule=js:$.require("csdown").uperji()',
                    col_type: 'avatar',
                    extra: {
                        id: data.userId
                    }
                }, {
                    title: data.title,
                    desc: data.description,
                    url: 'hiker://empty@rule=js:$.require("csdown").topicerji()',
                    col_type: 'text_1',
                    extra: {
                        lineVisible: false,
                        id: data.articleId,
                    }
                })
                if (data.imagePreview) {
                    var content = data.content;
                    JSON.parse(data.imagePreview).forEach(data => {
                        if (data.type == 'image') {
                            d.push({
                                img: getItem('Domain') + data.imgUrl + image,
                                url: getItem('Domain') + data.imgUrl + image,
                                col_type: 'movie_3',
                            })
                        } else if (data.type == 'video') {
                            d.push({
                                title: strong('视频', 'FF6699'),
                                desc: '0',
                                img: getItem('Domain') + data.imgUrl + image,
                                url: $('noLoading#').lazyRule(content => {
                                    eval($.require("csdown").rely($.require("csdown").aes));
                                    let data = getItem('Domain') + JSON.parse(Decrypt(fetch(getItem('Domain') + content)))[0].mainUrl;
                                    return data;
                                }, content),
                                col_type: 'card_pic_1',
                            })
                        }
                    })
                }
                if (data.topic) {
                    d.push({
                        title: data.topic.title,
                        url: 'hiker://empty?page=fypage@rule=js:$.require("csdown").qunerji()',
                        col_type: 'flex_button',
                        extra: {
                            id: data.topic.topicId,
                        }
                    })
                }
            })
        } catch (e) {
            log(e.message)
            csdown.token()
        }
        setResult(d)
    },
    qunerji: () => {
        var d = csdown.d;
        eval(csdown.rely(csdown.aes));
        if (MY_PAGE == 1) {
            let 圈子分类 = [{
                title: '最新&最热&推荐&精华',
                id: 'publish_time&view&publish_weight&favor'
            }]
            Cate(圈子分类, '圈子分类', d)
        }
        let id = MY_PARAMS.id;
        let pg = getParam('page');
        try {
            let url = getMyVar('host') + '/front/topic/articlePage';
            let body = '{"pageNo":' + pg + ',"pageSize":10,"mediaType":3,"payType":null,"topicId":"' + id + '","publishStatus":1,"recommend":null,"sort":"' + getMyVar('圈子分类', 'publish_time') + '"}';
            let data = post(url, body).data.dataList;
            data.forEach(data => {
                d.push({
                    title: data.user.nickname,
                    desc: data.createTime,
                    img: 'https://630heiliao.cc/favicon.ico',
                    url: 'hiker://empty?page=fypage@rule=js:$.require("csdown").uperji()',
                    col_type: 'avatar',
                    extra: {
                        id: data.userId
                    }
                }, {
                    title: data.title,
                    desc: data.description,
                    url: 'hiker://empty@rule=js:$.require("csdown").topicerji()',
                    col_type: 'text_1',
                    extra: {
                        lineVisible: false,
                        id: data.articleId,
                    }
                })
                if (data.imagePreview) {
                    var content = data.content;
                    JSON.parse(data.imagePreview).forEach(data => {
                        if (data.type == 'image') {
                            d.push({
                                img: getItem('Domain') + data.imgUrl + image,
                                url: getItem('Domain') + data.imgUrl + image,
                                col_type: 'movie_3',
                            })
                        } else if (data.type == 'video') {
                            d.push({
                                title: strong('视频', 'FF6699'),
                                desc: '0',
                                img: getItem('Domain') + data.imgUrl + image,
                                url: $('noLoading#').lazyRule(content => {
                                    eval($.require("csdown").rely($.require("csdown").aes));
                                    let data = getItem('Domain') + JSON.parse(Decrypt(fetch(getItem('Domain') + content)))[0].mainUrl;
                                    return data;
                                }, content),
                                col_type: 'card_pic_1',
                            })
                        }
                    })
                }
                if (data.topic) {
                    d.push({
                        title: data.topic.title,
                        url: 'hiker://empty?page=fypage@rule=js:$.require("csdown").qunerji()',
                        col_type: 'flex_button',
                        extra: {
                            id: data.topic.topicId,
                        }
                    })
                }
            })
        } catch (e) {
            log(e.message)
            csdown.token()
        }
        setResult(d)
    },
    token: () => {
        eval(csdown.rely(csdown.aes));
        let requestId = generateRandomHex(32);
        setItem('deviceId', 'd39264e29d0575998842a124d5dd9345');
        let url_ = getMyVar('host') + '/front/login/deviceId';
        let t = Math.floor(Date.now());
        let data = Encrypt('{"merchantAcct":"sc04","deviceId":"' + getItem('deviceId') + '"}');
        let sign = md5('body' + data + 'appIdsc04requestId' + requestId + 'time' + t);
        let body = '{"requestId":"' + requestId + '","appId":"sc04","time":' + t + ',"body":"' + data + '","sign":"' + sign + '"}';
        let html = fetch(url_, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                'm-acct': 'sc04',
                'user-agent': 'Dart/3.4 (dart:io)',
            },
            body: body,
            method: 'POST'
        }).slice(1, -1);
        let token_data = JSON.parse(Decrypt(html));
        let token = token_data.data.token;
        putMyVar('token', token)
        refreshPage(false)
    },
}
$.exports = csdown
