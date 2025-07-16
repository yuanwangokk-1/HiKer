const hhlz = {
    d: [],
    version: '20250316',
    rely: (data) => {
        return data.match(/\{([\s\S]*)\}/)[0].replace(/\{([\s\S]*)\}/, '$1')
    },
    home: () => {
        var d = hhlz.d;
        if (MY_PAGE == 1) {
            d.push({
                title: "搜索 ",
                url: $.toString(() => {
                    putMyVar('keyword', input)
                    return "hiker://empty?page=fypage&kw=" + input + '@rule=js:$.require("hhlz").search()'
                }),
                desc: "请输入搜索关键词",
                col_type: "input",
                extra: {
                    defaultValue: getMyVar('keyword', ''),
                }
            })
        };

        var pg = MY_URL.replace('hiker://empty##', '');
        var c1 = [{
            title: '推荐&漫画&小说&分类',
            id: '1&2&3&4&5',
            img: 'https://ghproxy.net/https://raw.githubusercontent.com/ls125781003/tubiao/main/more/47.png&https://ghproxy.net/https://raw.githubusercontent.com/ls125781003/tubiao/main/more/70.png&https://ghproxy.net/https://raw.githubusercontent.com/ls125781003/tubiao/main/more/78.png&https://ghproxy.net/https://raw.githubusercontent.com/ls125781003/tubiao/main/more/67.png'
        }];
        if (MY_PAGE == 1) {
            eval(hhlz.rely(hhlz.aes))
            Cate(c1, 'c1', d, 'icon_4');
            d.push({
                col_type: 'line',
            }, {
                col_type: 'big_blank_block',
            }, {
                col_type: 'big_blank_block',
            });
        }
        var 分类 = getMyVar('c1', '1');
        if (分类 == 1) {
            hhlz.recommend();
        } else if (分类 == 2) {
            hhlz.manhua()
        } else if (分类 == 3) {
            hhlz.novel()
        } else if (分类 == 4) {
            hhlz.shai()
        }
        setResult(d)
    },
    aes: $.toString(() => {
        //加载CryptoJS库
        eval(getCryptoJS())
        var t = Math.floor(Date.now() / 1000);
        //生成时间戳
        function getCurrentTimestamp() {
            return new Date().getTime();
        }
        //md5加密
        function md5(str) {
            return CryptoJS.MD5(str).toString();
        }
        //sha256加密
        function sha256(str) {
            return CryptoJS.SHA256(str).toString();
        }

        function color(txt) {
            return '<b><font color=' + '#FF6699' + '>' + txt + '</font></b>'
        }

        function strong(d, c) {
            return '‘‘’’<strong><font color=#' + (c || '000000') + '>' + d + '</font></strong>';
        }

        function Cate(list, n, d, col) {
            if (!col) {
                col = 'scroll_button';
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
                        title: (getMyVar(n, index_n) == id[index] + '' ? strong(title, 'FF6699') : title),
                        img: img[index],
                        url: $('#noLoading#').lazyRule((n, title, id) => {
                            putMyVar(n, id);
                            refreshPage(false);
                            return 'hiker://empty';
                        }, n, title, id[index] + ''),
                        col_type: col,
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
            const id = CryptoJS.enc.Utf8.parse("D2o4XyQeIFobJ4tS");
            const iv = CryptoJS.enc.Utf8.parse("sciCuBC7orQtDhTO");
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
            const id = CryptoJS.enc.Utf8.parse("D2o4XyQeIFobJ4tS");
            const iv = CryptoJS.enc.Utf8.parse("sciCuBC7orQtDhTO");
            var encrypted = CryptoJS.AES.encrypt(plaintext, id, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
            var ciphertext = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
            return ciphertext;
        }

        var lazy = $('').image(() => {
            const CryptoUtil = $.require("hiker://assets/crypto-java.js");
            let id = CryptoUtil.Data.parseUTF8("saIZXc4yMvq0Iz56");
            let iv = CryptoUtil.Data.parseUTF8("kbJYtBJUECT0oyjo");
            let textData = CryptoUtil.Data.parseInputStream(input);
            let encrypted = CryptoUtil.AES.decrypt(textData, id, {
                mode: "AES/CBC/PKCS7Padding",
                iv: iv
            });
            return encrypted.toInputStream();
        })

        function post(url, data0) {
            let data = Encrypt(data0);
            let body = '{"c":"' + data + '"}';
            let html = fetch(url, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                },
                body: body,
                method: 'POST'
            });
            let html1 = JSON.parse(html).data;
            let html2 = Decrypt(html1);
            return html2;
        }

        function vodDecrypt(url) {
            const key = CryptoJS.enc.Utf8.parse("saIZXc4yMvq0Iz56");
            let encryptedHexStr = CryptoJS.enc.Hex.parse(fetch(url, {
                toHex: true
            }));
            let decrypt = CryptoJS.AES.decrypt({
                ciphertext: encryptedHexStr
            }, key, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            });
            let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8).replace(/([A-Za-z0-9]+)-(\d{5})\.ts/g, url.split('index')[0] + '$1-$2.ts');

            writeFile('hiker://files/cache/video0.m3u8', decryptedStr);
            return getPath('hiker://files/cache/video0.m3u8') + '#' + url;
        }

        var vod = $('').lazyRule(() => {
            eval($.require('hhlz').rely($.require('hhlz').aes));
            let data0 = '{"product":"1","ver":"5.0.0","marketChannel":"luodiye","sign":"6E021A3AF0955814EC5AED84DE914185","sysVer":"10","appId":"1","osType":"2","time":"' + t + '","packageName":"cn.continue.me","proxyChannel":"luodiye","udid":"be4b3c9c-dcca-4544-8385-a9edbb060e68","video_id":"' + input + '"}'
            var url = getItem('host') + '/comic-video/catalog';
            var url1 = post(url, data0);
            let url2 = JSON.parse(url1).chapter_list[0].content;
            return vodDecrypt(url2)
        })
        var pics = $('').lazyRule(() => {
            eval($.require('hhlz').rely($.require('hhlz').aes));
            let comic_id = input.split('##')[1];
            let chapter_id = input.split('##')[0];
            let data0 = '{"comic_id":"' + comic_id + '","product":"1","ver":"5.0.0","marketChannel":"luodiye","sign":"2565C1DF2D4AEC522F4D5738142E41E3","sysVer":"10","appId":"1","osType":"2","time":"' + t + '","packageName":"cn.continue.me","proxyChannel":"luodiye","chapter_id":"' + chapter_id + '","udid":"be4b3c9c-dcca-4544-8385-a9edbb060e68"}'
            var url = getItem('host') + '/comic/chapter';
            var url1 = post(url, data0);
            let url2 = JSON.parse(url1).image_list;
            let img = [];
            url2.forEach(data => {
                img.push(data.img + lazy)
            })
            return "pics://" + img.join('&&')
        })

        var words = $('').lazyRule(() => {
            eval($.require('hhlz').rely($.require('hhlz').aes));
            let book_id = input.split('##')[1];
            let chapter_id = input.split('##')[0];
            let data0 = '{"product":"1","ver":"5.0.0","marketChannel":"luodiye","sign":"413E732F26BD1F130C5EF9640A2D958C","sysVer":"10","book_id":"' + book_id + '","appId":"1","osType":"2","time":"' + t + '","packageName":"cn.continue.me","proxyChannel":"luodiye","chapter_id":"' + chapter_id + '","udid":"be4b3c9c-dcca-4544-8385-a9edbb060e68"}'
            var url = getItem('host') + '/chapter/text';
            var url1 = post(url, data0);
            let url2 = JSON.parse(url1).content;
            return url2
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
    recommend: () => {
        var d = hhlz.d;
        eval(hhlz.rely(hhlz.aes))
        try {
            var data0 = '{"rankLimit":"10","product":"1","ver":"5.0.0","marketChannel":"luodiye","sign":"EB03A934638E973F518D4AB8012FCAED","sysVer":"10","appId":"1","osType":"2","limit":"10","time":"' + t + '","packageName":"cn.continue.me","proxyChannel":"luodiye","id":"1","page":"1","udid":"be4b3c9c-dcca-4544-8385-a9edbb060e68"}';
            var url = getItem('host') + '/top-recommend/index';
            var html2 = post(url, data0);
            //log(html2)
            var list = JSON.parse(html2).recommend_list;
            list.forEach(data => {
                if (!data.title.includes('影片')) {
                    d.push({
                        title: color(data.title),
                        img: 'hiker://images/icon_right5',
                        url: 'hiker://empty?page=fypage@rule=js:$.require("hhlz").manhuamore()',
                        col_type: 'text_icon',
                        extra: {
                            id: data.id,
                            url: getItem('host') + '/top-recommend/comic-recommend',
                        },
                    })
                    var works_list = data.works_list;
                    works_list.forEach(data => {
                        d.push({
                            title: data.name,
                            desc: data.tag[0].tab,
                            img: data.horizontal_cover + lazy,
                            url: 'hiker://empty?page=fypage&#immersiveTheme#@rule=js:$.require("hhlz").manhuaerji()',
                            col_type: "movie_2",
                            extra: {
                                id: data.comic_id,
                            },
                        })
                    })
                }
            })
        } catch (e) {
            log(e.message)
            if (getMyVar('a') == '') {
                eval(hhlz.rely(hhlz.aes))
                let data0 = '{"product":"1","ver":"5.0.0","appId":"1","osType":"2","marketChannel":"luodiye","sign":"33FC1F988DEFBF3D0903C794F130B0EB","sysVer":"10","time":"' + t + '","packageName":"cn.continue.me","proxyChannel":"luodiye","udid":"be4b3c9c-dcca-4544-8385-a9edbb060e68"}'
                let url = 'https://rrs0a03.ec8gsk.com/service/hhlz-domain';
                let html = post(url, data0);
                let domin_list = JSON.parse(html).api_domins;
                for (var item of domin_list) {
                    var data = JSON.parse(fetch(item + '/domain/check', {
                        withStatusCode: true,
                        timeout: 5000,
                    }));
                    if (data.statusCode == 200) {
                        setItem('host', item);
                        refreshPage(false);
                        toast('域名更新为：' + item);
                        putMyVar('a', '1')
                        break;
                    }
                }
            }
        }
    },
    manhua: () => {
        var d = hhlz.d;
        eval(hhlz.rely(hhlz.aes))
        var pg = MY_URL.replace('hiker://empty##', '');
        try {
            var data0 = '{"rankLimit":"30","product":"1","ver":"5.0.0","marketChannel":"luodiye","comic_channel_id":"9","sign":"8C9CBE2713439DAA8C02A43F692DF286","sysVer":"10","appId":"1","osType":"2","recommend_id":"62,30,12,29,24,50","limit":"4","time":"1742091262","packageName":"cn.continue.me","proxyChannel":"luodiye","page":"' + pg + '","udid":"be4b3c9c-dcca-4544-8385-a9edbb060e68"}';
            var url = getItem('host') + '/comic-channel-list/label-new';
            var html2 = post(url, data0);
            //log(html2)
            var label = JSON.parse(html2).label;
            label.forEach(data => {
                d.push({
                    title: color(data.label),
                    img: 'hiker://images/icon_right5',
                    url: 'hiker://empty?page=fypage@rule=js:$.require("hhlz").manhuamore()',
                    col_type: 'text_icon',
                    extra: {
                        id: data.recommend_id,
                        url: getItem('host') + '/comic/recommend',
                    },
                })
                var list = data.list;
                list.forEach(data => {
                    d.push({
                        title: data.name,
                        desc: data.finish_info,
                        img: data.vertical_cover + lazy,
                        url: 'hiker://empty?page=fypage&#immersiveTheme#@rule=js:$.require("hhlz").manhuaerji()',
                        col_type: "movie_3",
                        extra: {
                            id: data.comic_id,
                        },
                    })
                })
            })
        } catch (e) {
            log(e.message)
        }
    },
    manhuaerji: () => {
        var d = hhlz.d;
        eval(hhlz.rely(hhlz.aes))
        try {
            var pg = getParam('page');
            var id = MY_PARAMS.id;
            if (MY_PAGE == 1) {
                var data0 = '{"comic_id":"' + id + '","product":"1","ver":"5.0.0","marketChannel":"luodiye","sign":"3A4371CA3D397775E9422B764FACFFE8","sysVer":"10","appId":"1","osType":"2","time":"' + t + '","packageName":"cn.continue.me","proxyChannel":"luodiye","udid":"be4b3c9c-dcca-4544-8385-a9edbb060e68"}';
                var url = getItem('host') + '/cartoon/info';
                var html2 = post(url, data0);
                var comic = JSON.parse(html2).comic;
                d.push({
                    title: comic.name + '\n' + comic.finished + comic.flag,
                    desc: comic.author + '\n' + comic.description,
                    img: comic.vertical_cover + lazy,
                    url: comic.vertical_cover + lazy,
                    col_type: 'movie_1_vertical_pic_blur',
                })
                //var label=JSON.parse(html2).label;
            }
            let cate_body = '{"comic_id":"' + id + '","product":"1","ver":"5.0.0","marketChannel":"luodiye","sign":"911ED4AB904C19147EEF020270A8F41B","sysVer":"10","appId":"1","osType":"2","time":"' + t + '","packageName":"cn.continue.me","proxyChannel":"luodiye","page":"' + pg + '","udid":"be4b3c9c-dcca-4544-8385-a9edbb060e68"}';
            let cate_url = getItem('host') + '/comic/catalog';
            let cate_data = post(cate_url, cate_body);
            let chapter_list = JSON.parse(cate_data).chapter_list;
            chapter_list.forEach(data => {
                d.push({
                    title: data.chapter_title,
                    img: data.small_cover + lazy,
                    desc: data.updated_at,
                    url: data.chapter_id + '##' + id + pics,
                    col_type: 'movie_1_left_pic',
                })
            })
        } catch (e) {
            log(e.message)
        }
        setResult(d)
    },
    manhuamore: () => {
        var d = hhlz.d;
        eval(hhlz.rely(hhlz.aes))
        try {
            var pg = getParam('page');
            var id = MY_PARAMS.id;
            var url = MY_PARAMS.url;
            var data0 = '{"product":"1","ver":"5.0.0","marketChannel":"luodiye","sign":"54083C34747185362B022828286517F3","page_num":"' + pg + '","sysVer":"10","appId":"1","osType":"2","recommend_id":"' + id + '","time":"' + t + '","packageName":"cn.continue.me","proxyChannel":"luodiye","udid":"be4b3c9c-dcca-4544-8385-a9edbb060e68"}';
            var html2 = post(url, data0);
            var list = JSON.parse(html2).list.list;
            list.forEach(data => {
                d.push({
                    title: data.name,
                    desc: data.author + '\n' + data.finished + '\n' + data.description,
                    img: data.horizontal_cover + lazy,
                    url: 'hiker://empty?page=fypage&#immersiveTheme#@rule=js:$.require("hhlz").manhuaerji()',
                    col_type: "movie_1_left_pic",
                    extra: {
                        id: data.comic_id,
                    },
                })
            })
        } catch (e) {
            log(e.message)
        }
        setResult(d)
    },
    novel: () => {
        var d = hhlz.d;
        eval(hhlz.rely(hhlz.aes))
        var pg = MY_URL.replace('hiker://empty##', '');
        try {
            var data0 = '{"rankLimit":"30","product":"1","ver":"5.0.0","marketChannel":"luodiye","comic_channel_id":"9","sign":"8C9CBE2713439DAA8C02A43F692DF286","sysVer":"10","appId":"1","osType":"2","recommend_id":"62,30,12,29,24,50","limit":"4","time":"1742091262","packageName":"cn.continue.me","proxyChannel":"luodiye","page":"' + pg + '","udid":"be4b3c9c-dcca-4544-8385-a9edbb060e68"}';
            var url = getItem('host') + '/book-channel-list/label-new';
            var html2 = post(url, data0);
            //log(html2)
            var label = JSON.parse(html2).label;
            label.forEach(data => {
                d.push({
                    title: color(data.label),
                    img: 'hiker://images/icon_right5',
                    url: 'hiker://empty?page=fypage@rule=js:$.require("hhlz").novelmore()',
                    col_type: 'text_icon',
                    extra: {
                        id: data.recommend_id,
                        url: getItem('host') + '/book/recommend',
                    },
                })
                var list = data.list;
                list.forEach(data => {
                    d.push({
                        title: data.name,
                        desc: data.total_words + '  ' + data.tag[1].tab,
                        img: data.cover + lazy,
                        url: 'hiker://empty?page=fypage&#immersiveTheme#@rule=js:$.require("hhlz").novelerji()',
                        col_type: "movie_3",
                        extra: {
                            id: data.book_id,
                        },
                    })
                })
            })
        } catch (e) {
            log(e.message)
        }
    },
    novelerji: () => {
        var d = hhlz.d;
        eval(hhlz.rely(hhlz.aes))
        try {
            var pg = getParam('page');
            var id = MY_PARAMS.id;
            if (MY_PAGE == 1) {
                var data0 = '{"product":"1","ver":"5.0.0","marketChannel":"luodiye","sign":"5D6F92350609C579708DAD21F99E3B9B","sysVer":"10","book_id":"' + id + '","appId":"1","osType":"2","time":"' + t + '","packageName":"cn.continue.me","proxyChannel":"luodiye","udid":"be4b3c9c-dcca-4544-8385-a9edbb060e68"}';
                var url = getItem('host') + '/novel/info';
                var html2 = post(url, data0);
                var book = JSON.parse(html2).book;
                d.push({
                    title: book.name + '\n' + book.display_label,
                    desc: book.author + '\n' + book.description,
                    img: book.cover + lazy,
                    url: book.cover + lazy,
                    col_type: 'movie_1_vertical_pic_blur',
                })
                //var label=JSON.parse(html2).label;
            }
            let cate_body = '{"product":"1","ver":"5.0.0","marketChannel":"luodiye","sign":"8FE32545FCA442A25952383E39BD5C4F","orderby":"1","sysVer":"10","book_id":"' + id + '","appId":"1","osType":"2","time":"' + t + '","packageName":"cn.continue.me","proxyChannel":"luodiye","page":"' + pg + '","udid":"be4b3c9c-dcca-4544-8385-a9edbb060e68"}';
            let cate_url = getItem('host') + '/chapter/catalog';
            let cate_data = post(cate_url, cate_body);
            let chapter_list = JSON.parse(cate_data).chapter_list;
            chapter_list.forEach(data => {
                d.push({
                    title: data.chapter_title,
                    desc: data.updated_at,
                    url: 'hiker://empty?#readTheme#&#autoPage#@rule=js:' + $.toString(() => {
                        eval($.require('hhlz').rely($.require('hhlz').aes));
                        let d = [];
                        let book_id = MY_PARAMS.book_id;
                        let chapter_id = MY_PARAMS.chapter_id;
                        let data0 = '{"product":"1","ver":"5.0.0","marketChannel":"luodiye","sign":"413E732F26BD1F130C5EF9640A2D958C","sysVer":"10","book_id":"' + book_id + '","appId":"1","osType":"2","time":"' + t + '","packageName":"cn.continue.me","proxyChannel":"luodiye","chapter_id":"' + chapter_id + '","udid":"be4b3c9c-dcca-4544-8385-a9edbb060e68"}'
                        var url = getItem('host') + '/chapter/text';
                        var url1 = post(url, data0);
                        let text = JSON.parse(url1).content;
                        d.push({
                            title: text,
                            col_type: 'long_text',
                        })
                        setResult(d)
                    }),
                    col_type: 'text_1',
                    extra: {
                        chapter_id: data.chapter_id,
                        book_id: id,
                    }
                })
            })
        } catch (e) {
            log(e.message)
        }
        setResult(d)
    },
    novelmore: () => {
        var d = hhlz.d;
        eval(hhlz.rely(hhlz.aes))
        try {
            var pg = getParam('page');
            var id = MY_PARAMS.id;
            var url = MY_PARAMS.url;
            var data0 = '{"product":"1","ver":"5.0.0","marketChannel":"luodiye","sign":"54083C34747185362B022828286517F3","page_num":"' + pg + '","sysVer":"10","appId":"1","osType":"2","recommend_id":"' + id + '","time":"' + t + '","packageName":"cn.continue.me","proxyChannel":"luodiye","udid":"be4b3c9c-dcca-4544-8385-a9edbb060e68"}';
            var html2 = post(url, data0);
            var list = JSON.parse(html2).list.list;
            list.forEach(data => {
                d.push({
                    title: data.name,
                    desc: data.total_words,
                    img: data.cover + lazy,
                    url: 'hiker://empty?page=fypage&#immersiveTheme#@rule=js:$.require("hhlz").novelerji()',
                    col_type: "movie_3",
                    extra: {
                        id: data.book_id,
                    },
                })
            })
        } catch (e) {
            log(e.message)
        }
        setResult(d)
    },
    shai: () => {
        var d = hhlz.d;
        eval(hhlz.rely(hhlz.aes))
        var pg = MY_URL.replace('hiker://empty##', '');
        try {
            if (MY_PAGE == 1) {
                var 分类 = [{
                    title: '漫画&小说',
                    id: '1&2'
                }]
                var cat1 = [{
                    title: '全部&韩漫&日漫&3D漫画&全彩&Cosplay&写真&H漫&校园&乳交&口交&同人&出轨&榨精&母女&兽交&自慰&痴汉&真人&港漫&巨乳&\u4eba\u59bb&青春&剧情&萝莉&御姐&女仆&SM&百合&调教&同人志&NTR&多P&强迫&伪娘&男同&扶她&\u4e71\u4f26',
                    id: '&1&2&25&6&7&527&609&19&605&603&4&604&606&598&590&607&683&5&13&12&15&16&24&69&26&71&40&94&122&137&134&311&123&50&38&126&17'
                }]
                var cat2 = [{
                    title: '全部&长篇小说&短篇小说&武侠玄幻&灵异推理&网游小说&都市生活&现代情感&青春校园&\u4eba\u59bb熟妇&古文艳情&現代情感&师生&办公室 &\u4eba\u59bb&重口&偷情 &多人&凌辱&同人 &\u4e71\u4f26&换妻&巨乳&淫男欲女&丝袜性趣&家庭\u4e71\u4f26&调教',
                    id: '&124&122&20&131&112&151&149&150&152&109&155&133&121&110&6&144&142&140&138&130&129&128&117&116&4&113'
                }]
                var pay_status = [{
                    title: '全部&付费&免费',
                    id: '0&1&2'
                }]
                var finished = [{
                    title: '全部&连载中&已完结',
                    id: '&0&1'
                }]
                var recommend_flag = [{
                    title: '最新上架&最近更新&阅读热度&周热度',
                    id: '3&2&1&4'
                }]
                Cate(分类, '分类', d);
            }
            if (getMyVar('分类', '1') == 1) {
                if (MY_PAGE == 1) {
                    Cate(cat1, 'cat1', d);
                    Cate(pay_status, 'pay_status', d);
                    Cate(finished, 'finished', d);
                    Cate(recommend_flag, 'recommend_flag', d);
                }
                var data0 = '{"product":"1","ver":"5.0.0","recommend_flag":"' + getMyVar('recommend_flag', '3') + '","marketChannel":"luodiye","sign":"C2EA530C24AA69E45510ACB2B68CD67B","page_num":"1","sysVer":"10","finished":"' + getMyVar('finished', '') + '","pay_status":"' + getMyVar('pay_status', '0') + '","appId":"1","cat":"' + getMyVar('cat1', '') + '","osType":"2","order_by":"0","time":"' + t + '","packageName":"cn.continue.me","proxyChannel":"luodiye","page_num":"' + pg + '","udid":"be4b3c9c-dcca-4544-8385-a9edbb060e68"}';
                var url = getItem('host') + '/comic/list';
                var html2 = post(url, data0);
                var list = JSON.parse(html2).list.list;
                list.forEach(data => {
                    d.push({
                        title: data.name,
                        desc: data.finished + data.flag,
                        img: data.vertical_cover + lazy,
                        url: 'hiker://empty?page=fypage&#immersiveTheme#@rule=js:$.require("hhlz").manhuaerji()',
                        col_type: "movie_3",
                        extra: {
                            id: data.comic_id,
                        },
                    })
                })
            } else {
                if (MY_PAGE == 1) {
                    Cate(cat2, 'cat2', d);
                    Cate(pay_status, 'pay_status', d);
                    Cate(finished, 'finished', d);
                    Cate(recommend_flag, 'recommend_flag', d);
                }
                var data0 = '{"product":"1","ver":"5.0.0","recommend_flag":"' + getMyVar('recommend_flag', '3') + '","marketChannel":"luodiye","sign":"C2EA530C24AA69E45510ACB2B68CD67B","page_num":"1","sysVer":"10","finished":"' + getMyVar('finished', '') + '","pay_status":"' + getMyVar('pay_status', '0') + '","appId":"1","cat":"' + getMyVar('cat2', '') + '","osType":"2","order_by":"0","time":"' + t + '","packageName":"cn.continue.me","proxyChannel":"luodiye","page_num":"' + pg + '","udid":"be4b3c9c-dcca-4544-8385-a9edbb060e68"}';
                var url = getItem('host') + '/book/category-index';
                var html2 = post(url, data0);
                var list = JSON.parse(html2).list.list;
                list.forEach(data => {
                    d.push({
                        title: data.name,
                        desc: data.finished,
                        img: data.cover + lazy,
                        url: 'hiker://empty?page=fypage&#immersiveTheme#@rule=js:$.require("hhlz").novelerji()',
                        col_type: "movie_3",
                        extra: {
                            id: data.book_id,
                        },
                    })
                })
            }
        } catch (e) {
            log(e.message)
        }
    },
    search: () => {
        var d = hhlz.d;
        eval(hhlz.rely(hhlz.aes))
        var pg = getParam('page');
        try {
            if (MY_PAGE == 1) {
                var 搜索 = [{
                    title: '漫画&小说',
                    id: '1&2'
                }]
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
                Cate(搜索, '搜索', d);
            }
            if (getMyVar('搜索', '1') == 1) {
                var data0 = '{"product":"1","ver":"","marketChannel":"yingyongbao","sign":"4C0E57AE19EDBFB0BEBC4EB2D252BC93","page_num":"' + pg + '","sysVer":"10","appId":"1","osType":"2","time":"' + t + '","packageName":"cn.continue.me","proxyChannel":"yingyongbao","udid":"","keyword":"' + getMyVar('keyword') + '"}';
                var url = getItem('host') + '/comic/search';
                var html2 = post(url, data0);
                var list = JSON.parse(html2).list;
                list.forEach(data => {
                    d.push({
                        title: data.name,
                        desc: data.finished + data.flag,
                        img: data.vertical_cover + lazy,
                        url: 'hiker://empty?page=fypage&#immersiveTheme#@rule=js:$.require("hhlz").manhuaerji()',
                        col_type: "movie_3",
                        extra: {
                            id: data.comic_id,
                        },
                    })
                })
            } else {
                var data0 = '{"product":"1","ver":"","marketChannel":"yingyongbao","sign":"4C0E57AE19EDBFB0BEBC4EB2D252BC93","page_num":"' + pg + '","sysVer":"10","appId":"1","osType":"2","time":"' + t + '","packageName":"cn.continue.me","proxyChannel":"yingyongbao","udid":"","keyword":"' + getMyVar('keyword') + '"}';
                var url = getItem('host') + '/book/search';
                var html2 = post(url, data0);
                var list = JSON.parse(html2).list;
                list.forEach(data => {
                    d.push({
                        title: data.name,
                        desc: data.total_words + '  ' + data.tag[1].tab,
                        img: data.cover + lazy,
                        url: 'hiker://empty?page=fypage&#immersiveTheme#@rule=js:$.require("hhlz").novelerji()',
                        col_type: "movie_3",
                        extra: {
                            id: data.book_id,
                        },
                    })
                })
            }
        } catch (e) {

        }
        setResult(d)
    },
    video: () => {
        var d = hhlz.d;
        eval(hhlz.rely(hhlz.aes))
        var pg = MY_URL.replace('hiker://empty##', '');
        try {
            var data0 = '{"rankLimit":"30","product":"1","ver":"5.0.0","video_channel_id":"15","marketChannel":"luodiye","sign":"3EBD11F9527939E53C70C5AE9C89445F","sysVer":"10","appId":"1","osType":"2","recommend_id":"29,19,56,54,55,35","limit":"4","time":"' + t + '","packageName":"cn.continue.me","proxyChannel":"luodiye","page":"' + pg + '","udid":"be4b3c9c-dcca-4544-8385-a9edbb060e68"}';
            var url = getItem('host') + '/video-channel-list/label-new';
            var html2 = post(url, data0);
            //log(html2)
            var label = JSON.parse(html2).label;
            label.forEach(data => {
                d.push({
                    title: color(data.label),
                    img: 'hiker://images/icon_right5',
                    url: 'hiker://empty?page=fypage@rule=js:$.require("hhlz").videomore()',
                    col_type: 'text_icon',
                    extra: {
                        id: data.recommend_id,
                        url: getItem('host') + '/comic/recommend',
                    },
                })
                var list = data.list;
                list.forEach(data => {
                    d.push({
                        title: data.title,
                        desc: data.categoryName,
                        img: data.cover + lazy,
                        url: data.video_id + vod,
                        col_type: "movie_2",
                        extra: {
                            id: data.video_id,
                        },
                    })
                })
            })
        } catch (e) {
            log(e.message)
        }
    }
}
$.exports = hhlz