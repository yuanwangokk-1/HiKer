const Apollo = {
    version: "20251004",
    empty: 'hiker://empty',
    url: "https://missav.live/cn/",
    d: [],
    taskList: [],
    getRangeColors: function() {
        return '#' + ('00000' + (Math.random() * 0x1000000 << 0)
                .toString(16))
            .substr(-6);
    }, //随机颜色
    pageAdd: function(page) {
        if (getMyVar("page")) {
            putMyVar("page", (parseInt(page) + 1) + '');
        }
        return;
    }, //翻页
    pageMoveto: function(page, pages) {
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
            title: "第" + page + "页",
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
    }, //长按跳页
    data: {
        category: getMyVar('MissAV.category', '0'),
        subCate: getMyVar('MissAV.subCate', '0'),
    },
    baseParse: () => {
        putMyVar("MY_TYPE", "主页");
        var page = getMyVar("page", MY_PAGE + "")
        let categoryList = [{
            title: '推荐',
            path: '',
            type: 'video',
            sub: [{
                title: '今日热门',
                path: 'today-hot',
            }, {
                title: '本週热门',
                path: 'weekly-hot',
            }, {
                title: '本月热门',
                path: 'monthly-hot',
            }, {
                title: '最近更新',
                path: 'new',
            }, {
                title: '新作上市',
                path: 'release',
            }]
        }, {
            title: '中字',
            path: 'chinese-subtitle',
            type: 'video',
            sub: []
        }, {
            title: '无码',
            path: '',
            type: 'video',
            sub: [{
                title: '流出',
                path: 'uncensored-leak'
            }, {
                title: 'FC2',
                path: 'fc2'
            }, {
                title: 'HEYZO ',
                path: 'heyzo'
            }, {
                title: '东京热',
                path: 'tokyohot'
            }, {
                title: '一本道',
                path: '1pondo'
            }, {
                title: 'Caribbeancom',
                path: 'caribbeancom'
            }, {
                title: 'Caribbeancompr',
                path: 'caribbeancompr'
            }, {
                title: '10musume',
                path: '10musume'
            }, {
                title: 'pacopacomama',
                path: 'pacopacomama'
            }, {
                title: 'Gachinco',
                path: 'gachinco'
            }, {
                title: 'XXX-AV',
                path: 'xxxav'
            }, {
                title: '人妻斩',
                path: 'marriedslash'
            }, {
                title: '顽皮 4610',
                path: 'naughty4610'
            }, {
                title: '顽皮 0930',
                path: 'naughty0930'
            }, ]
        }, {
            title: '素人',
            path: '',
            type: 'video',
            sub: [{
                    title: 'SIRO',
                    path: 'siro'
                },
                {
                    title: 'LUXU',
                    path: 'luxu'
                },
                {
                    title: 'GANA',
                    path: 'gana'
                },
                {
                    title: 'PRESTIGE PREMIUM',
                    path: 'maan'
                },
                {
                    title: 'S-CUTE',
                    path: 'scute'
                },
                {
                    title: 'ARA',
                    path: 'ara'
                },
            ]
        }, {
            title: '国产',
            path: '',
            type: 'video',
            sub: [{
                title: '麻豆传媒',
                path: 'madou'
            }, {
                title: 'TWAV',
                path: 'twav'
            }, {
                title: 'Furuke',
                path: 'furuke'
            }, ]
        }, {
            title: 'VR',
            path: 'genres/VR',
            type: 'video',
            sub: []
        }, {
            title: 'AV影评',
            path: 'articles',
            type: 'articles',
            sub: []
        }, {
            title: '女优一览',
            path: 'actresses',
            type: 'avatar',
            sub: []
        }, {
            title: '女优排行',
            path: 'actresses/ranking',
            type: 'avatar',
            sub: []
        }, {
            title: '类型',
            path: 'genres',
            type: 'tags',
            sub: []
        }, {
            title: '发行商',
            path: 'makers',
            type: 'tags',
            sub: []
        }, {
            title: '更多',
            path: '',
            type: 'video',
            sub: [{
                title: '123AV',
                path: 'site/123av',
            }, {
                title: 'Njav',
                path: 'site/njav',
            }, {
                title: 'Supjav',
                path: 'site/supjav',
            }, ]
        }, ]
        const currentCate = categoryList[Apollo.data.category]
        let url
        var type = currentCate.type
        var path = currentCate.path
        if (currentCate.sub.length > 0) {
            url = getMyVar("url", Apollo.url + currentCate.sub[Apollo.data.subCate].path)
        } else {
            url = getMyVar("url", Apollo.url + currentCate.path)
        }
        url = url.replace(/(\?page=\d+|\&page=\d+|$)/, (match) => {
            if (match.startsWith('?') || match.startsWith('&')) {
                return match.charAt(0) + 'page=' + page;
            } else {
                if (page == 1) {
                    return ""
                }
                return (url.includes('?') ? '&page=' : '?page=') + page;
            }
        });
        Apollo.pageAdd(page)
        if (url.includes("search")) {
            type = "search"
        }
        log(url)
        if (MY_PAGE == 1) {
            categoryList.forEach((cate, index) => {
                Apollo.d.push({
                    title: parseInt(Apollo.data.category) === index ?
                        '‘‘’’' + cate.title.fontcolor("#FFFFFF") : cate.title,
                    url: $(Apollo.empty + "#noLoading#").lazyRule((index) => {
                        putMyVar("MissAV.category", index.toString())
                        putMyVar("MissAV.subCate", '0')
                        clearMyVar("url")
                        clearMyVar("page")
                        refreshPage(true)
                        return "hiker://empty"
                    }, index),
                    extra: {
                        'backgroundColor': parseInt(Apollo.data.category) === index ? Apollo.getRangeColors() : ''
                    },
                    col_type: 'scroll_button',
                })
            })
            if (currentCate.sub.length > 0) {
                Apollo.d.push({
                    col_type: 'blank_block',
                })
                currentCate.sub.forEach((cate, index) => {
                    Apollo.d.push({
                        title: parseInt(Apollo.data.subCate) === index ?
                            '‘‘’’' + cate.title.fontcolor("#FFFFFF") : cate.title,
                        url: $(Apollo.empty + "#noLoading#").lazyRule((index) => {
                            putMyVar("MissAV.subCate", index.toString());
                            clearMyVar("url")
                            clearMyVar("page")
                            refreshPage(true)
                            return "hiker://empty"
                        }, index),
                        extra: {
                            'backgroundColor': parseInt(Apollo.data.subCate) === index ? Apollo.getRangeColors() : ''
                        },
                        col_type: 'scroll_button',
                    })
                })
            }
        }
        const html = fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0)'
            }
        });
        //动态分类
        Apollo.DynamicSort(html)
        Apollo.ActorSort(url, html)
        //搜索
        if (page == 1) {
            Apollo.d.push({
                title: "🔍",
                url: $.toString((url) => {
                    if (input.trim() != "") {
                        putMyVar('keyword', input);
                        var searchUrl = getHome(url) + "/cn/search/" + input
                        putMyVar("url", searchUrl);
                        refreshPage();
                        return "hiker://empty"
                    } else {
                        return "confirm://搜索内容为空.js:'hiker://empty'"
                    }
                }, url),
                desc: '搜索...',
                col_type: "input",
                extra: {
                    defaultValue: getMyVar('keyword', '') || "",
                }
            });
        }

        switch (type) {
            case 'video':
                Apollo.videoType(html, page)
                break
            case 'articles':
                Apollo.articlesType(html, page)
                break
            case 'avatar':
                if ((path === 'actresses/ranking' && page == 1) || path !== 'actresses/ranking') {
                    Apollo.avatarType(html, page)
                }
                break
            case 'tags':
                Apollo.tagsType(html, page)
                break
            case 'search':
                if (MY_PAGE == 1) {
                    Apollo.d.push({
                        title: '““””' + "搜寻结果".fontcolor("#FF00FF"),
                        url: "hiker://empty",
                        col_type: "text_1",
                        extra: {
                            lineVisible: false
                        }
                    })
                    try {
                        Apollo.avatarType(html, page)
                    } catch {}
                    Apollo.d.push({
                        col_type: "blank_block"
                    })
                    try {
                        Apollo.videoType(html, page)
                    } catch {}
                } else {
                    try {
                        Apollo.videoType(html, page)
                    } catch {}
                }
                break
            default:
                Apollo.videoType(html, page)
        }
        setResult(Apollo.d)
    },

    //动态分类
    DynamicSort: (html) => {
        const 分类颜色 = Apollo.getRangeColors()
        const 大类定位 = ".mb-6:has(.relative)&&.relative"
        const 拼接分类 = ".mb-3&&.relative"
        const 小类定位 = "body&&.block"
        const 分类标题 = "Text"
        const 分类链接 = "a&&href"
        try {
            if (typeof(拼接分类) != 'undefined' && 拼接分类 != '') {
                var categories = pdfa(html, 大类定位).concat(pdfa(html, 拼接分类))
            } else {
                var categories = pdfa(html, 大类定位)
            }
        } catch {
            var categories = pdfa(html, 大类定位)
        }
        let init_cate = []
        for (let i = 0; i < 20; i++) {
            init_cate.push("0")
        }
        if (getMyVar("MY_TYPE") == "主页") {
            var cate_temp_json = getMyVar("sort", JSON.stringify(init_cate))
        } else {
            var cate_temp_json = getMyVar("ysort", JSON.stringify(init_cate))
        }
        var cate_temp = JSON.parse(cate_temp_json)

        if (MY_PAGE == 1) {
            Apollo.d.push({
                col_type: "blank_block"
            });
            categories.forEach((category, index) => {
                let sub_categories = pdfa(category, 小类定位);
                sub_categories.forEach((item, key) => {
                    let title = pdfh(item, 分类标题)
                    if (typeof(排除) != 'undefined' && 排除 != '') {
                        title = title.replace(new RegExp(排除, "g"), "")
                    };
                    Apollo.d.push({
                        title: key.toString() === cate_temp[index] ? '““””' + title.fontcolor(分类颜色) : title,
                        url: $(pdfh(item, 分类链接) + '#noLoading#').lazyRule((params) => {
                            params.cate_temp[params.index] = params.key.toString()
                            if (getMyVar("MY_TYPE") == "主页") {
                                putMyVar('sort', JSON.stringify(params.cate_temp));
                                putMyVar("url", input);
                            } else {
                                putMyVar('ysort', JSON.stringify(params.cate_temp));
                                putMyVar("yurl", input);
                            }
                            clearMyVar("page")
                            refreshPage(true)
                            return "hiker://empty"
                        }, {
                            cate_temp: cate_temp,
                            index: index,
                            key: key,
                            page: MY_PAGE,
                        }),
                        col_type: 'scroll_button',
                        extra: {
                            'backgroundColor': key.toString() === cate_temp[index] ? Apollo.getRangeColors() : ''
                        }
                    })
                })
                Apollo.d.push({
                    col_type: "blank_block"
                });
            })
        }
    },
    //女优sort
    ActorSort: (url, html) => {
        const 分类颜色 = Apollo.getRangeColors()
        const 大类定位 = "body&&.grid.mb-3&&select"
        const 拼接分类 = ""
        const 小类定位 = "body&&option"
        const 分类标题 = "Text"
        const 分类链接 = "option&&value"
        try {
            if (typeof(拼接分类) != 'undefined' && 拼接分类 != '') {
                var categories = pdfa(html, 大类定位).concat(pdfa(html, 拼接分类))
            } else {
                var categories = pdfa(html, 大类定位)
            }
        } catch {
            var categories = pdfa(html, 大类定位)
        }
        let init_cate = []
        for (let i = 0; i < 20; i++) {
            init_cate.push("0")
        }
        var cate_temp_json = getMyVar("asort", JSON.stringify(init_cate))
        var cate_temp = JSON.parse(cate_temp_json)

        if (MY_PAGE == 1) {
            Apollo.d.push({
                col_type: "blank_block"
            });
            categories.forEach((category, index) => {
                let sub_categories = pdfa(category, 小类定位);
                sub_categories.forEach((item, key) => {
                    let title = pdfh(item, 分类标题)
                    if (typeof(排除) != 'undefined' && 排除 != '') {
                        title = title.replace(new RegExp(排除, "g"), "")
                    };
                    Apollo.d.push({
                        title: key.toString() === cate_temp[index] ? '““””' + title.fontcolor(分类颜色) : title,
                        url: $(pdfh(item, 分类链接) + '#noLoading#').lazyRule((url, params) => {
                            params.cate_temp[params.index] = params.key.toString()
                            if (params.index == 0) {
                                input = input ? ("&height=" + input) : ""
                                url = url.replace(/\&height=.*(\&.*)?/, "$1") + input
                            }
                            if (params.index == 1) {
                                input = input ? ("&cup=" + input) : ""
                                url = url.replace(/\&cup=.*(\&.*)?/, "$1") + input
                            }
                            if (params.index == 2) {
                                input = input ? ("&age=" + input) : ""
                                url = url.replace(/\&age=.*(\&.*)?/, "$1") + input
                            }
                            if (params.index == 3) {
                                input = input ? ("&debut=" + input) : ""
                                url = url.replace(/\&debut=.*(\&.*)?/, "$1") + input
                            }
                            putMyVar('asort', JSON.stringify(params.cate_temp));
                            putMyVar("url", url);
                            clearMyVar("page")
                            refreshPage(true)
                            return "hiker://empty"
                        }, url, {
                            cate_temp: cate_temp,
                            index: index,
                            key: key,
                            page: MY_PAGE,
                        }),
                        col_type: 'scroll_button',
                        extra: {
                            'backgroundColor': key.toString() === cate_temp[index] ? Apollo.getRangeColors() : ''
                        }
                    })
                })
                Apollo.d.push({
                    col_type: "blank_block"
                });
            })
        }
    },
    //搜索
    searchParse: () => {
        log(MY_URL)
        if (MY_PAGE == 1) {
            Apollo.d.push({
                title: "——女优——",
                url: "hiker://empty"
            });
            try {
                Apollo.avatarType(getResCode());
            } catch {}
            Apollo.d.push({
                title: "——影片——",
                url: "hiker://empty"
            });
            try {
                Apollo.videoType(getResCode());
            } catch {}
        } else {
            try {
                Apollo.videoType(getResCode());
            } catch {}
        }
        setResult(Apollo.d)
    },

    //二级
    videoParse: (url) => {
        var html = fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0)'
            }
        });
        const title = pdfh(html, 'h1&&Text')
        log(url)
        //setPageTitle(title)

        Apollo.d.push({
            title: '““””' + title.fontcolor("#D2691E").small(),
            url: url,
            col_type: 'text_1',
            extra: {
                lineVisiable: false
            }
        })
        Apollo.d.push({
            desc: pdfh(html, '.text-secondary.break-all.line-clamp-2&&Text'),
            pic_url: pdfh(html, 'meta[property=og:image]&&content') + '@Referer=' + Apollo.url,
            url: $(Apollo.empty + '#noHistory#').lazyRule((html, url) => {
                eval(html.match(/eval.*?source.*\n/)[0])
                // 获取画质列表，并去最高画质
                let group_quality = "RESOLUTION=640x360\n360p/video.m3u8\nRESOLUTION=854x480\n480p/video.m3u8\nRESOLUTION=1280x720\n720p/video.m3u8\nRESOLUTION=1920x1080\n1080p/video.m3u8"
                hghest_quality = group_quality.match(/^(.*)\.m3u8$/gm).map(v => source.replace("playlist.m3u8", v))
                name_quality = group_quality.match(/RESOLUTION=.*$/gm).map(n => n.replace("RESOLUTION=", ""))
                // 按分辨率降序排序 分辨率 数组，并同时调整 hghest_quality
                var sortedData = name_quality.map((name, index) => ({
                    name,
                    url: hghest_quality[index]
                })).sort((a, b) => b.name.match(/(\d+)/)[1] - a.name.match(/(\d+)/)[1]);
                // 分开排序后的 names 和 urls 数组
                var sortedNames = sortedData.map(item => item.name);
                var sortedUrls = sortedData.map(item => item.url);
                let playlist = JSON.stringify({
                    names: sortedNames,
                    urls: sortedUrls,
                    headers: new Array(hghest_quality.length).fill({
                        Referer: getHome(url) + "/"
                    })
                });
                return playlist;
            }, html, Apollo.url),
            col_type: 'pic_1_full',
        })
        var content = pdfh(html, '.text-secondary.break-all.line-clamp-2&&Text');
        if (content.trim() != "") {
            Apollo.setDesc(content)
        }

        const text_secondary_list = pdfa(html, 'body&&.text-secondary')
        let num, actressesList, tagsList, series, makers, directors, labelsList
        text_secondary_list.forEach(item => {
            let current_title = pdfh(item, 'span&&Text')
            let actressName = '女优'
            if (current_title === '番号:') {
                num = pdfh(item, '.font-medium&&Text').replace("-UNCENSORED-LEAK", "").replace("-CHINESE-SUBTITLE", "")
            } else if (current_title === actressName + ':') {
                actressesList = pdfa(item, '.text-secondary&&a')
            } else if (current_title === '类型:') {
                tagsList = pdfa(item, '.text-secondary&&a')
            } else if (current_title === '系列:') {
                series = pdfa(item, '.text-secondary&&a')[0]
            } else if (current_title === '发行商:') {
                makers = pdfa(item, '.text-secondary&&a')[0]
            } else if (current_title === '导演:') {
                directors = pdfa(item, '.text-secondary&&a')[0]
            } else if (current_title === '标籤:') {
                labelsList = pdfa(item, '.text-secondary&&a')
            }
        })
        var 日期 = pdfh(html, 'body&&.text-secondary:matches(发行日期:)&&Text');
        if (日期.trim() != "") {
            Apollo.d.push({
                title: '‘‘’’' + 日期.fontcolor("#FF0000"),
                url: "hiker://search?rule=𝐉𝐚𝐯𝐃𝐁&s=" + num,
                col_type: 'text_1',
                extra: {
                    lineVisiable: false
                }
            })
        }
        if (num) {
            Apollo.d.push({
                title: "““””番号 : " + num.fontcolor("#1E90FF"),
                url: 'copy://' + num,
                col_type: 'text_1',
                extra: {
                    lineVisible: false
                },
            })
        }
        var 标题 = pdfh(html, 'body&&.text-secondary:matches(标题)&&Text');
        if (标题.trim() != "") {
            Apollo.d.push({
                title: 标题.fontcolor("#D2691E").small(),
                url: 'hiker://empty',
                col_type: 'rich_text',
                extra: {
                    lineVisiable: false
                }
            })
        }
        Apollo.d.push({
            col_type: 'line_blank'
        })
        if (actressesList) {
            actressesList.forEach((actresses, index) => {
                let title = pdfh(actresses, 'a&&Text')
                let url = pdfh(actresses, 'a&&href')
                Apollo.taskList.push({
                    func: Apollo.updateAvatar,
                    param: {
                        url: url,
                        index: 'avatar_' + index
                    },
                    id: 'avatar_' + index,
                })
                Apollo.d.push({
                    title: "““””" + title.fontcolor("#C71585"),
                    desc: '演员',
                    pic_url: Apollo.empty,
                    url: $(url + '?page=fypage#noHistory#').rule((title) => {
                        const Apollo = $.require('hiker://page/Apollo')
                        setPageTitle(title)
                        Apollo.yijiParse(MY_URL)
                        setResult(Apollo.d)
                    }, title),
                    col_type: 'icon_4_card',
                    extra: {
                        id: 'avatar_' + index,
                    }
                })
            })
            Apollo.d.push({
                col_type: 'line_blank'
            })
        }
        if (tagsList) {
            Apollo.d.push({
                title: '类型 : ',
                url: Apollo.empty,
                col_type: 'flex_button',
                extra: {
                    lineVisible: false
                },
            })
            tagsList.forEach(tag => {
                let tag_title = pdfh(tag, 'a&&Text')
                Apollo.d.push({
                    title: tag_title,
                    url: $(pdfh(tag, 'a&&href') + '?page=fypage#noHistory#').rule((tag_title) => {
                        const Apollo = $.require('hiker://page/Apollo')
                        setPageTitle(tag_title)
                        Apollo.yijiParse(MY_URL)
                        setResult(Apollo.d)
                    }, tag_title),
                    col_type: 'flex_button',
                    extra: {
                        'backgroundColor': Apollo.getRangeColors()
                    }
                })
            })

            Apollo.d.push({
                col_type: 'blank_block'
            })
        }
        if (series) {
            Apollo.d.push({
                title: '系列 : ',
                url: Apollo.empty,
                col_type: 'scroll_button',
                extra: {
                    lineVisible: false
                },
            })
            let series_title = pdfh(series, 'a&&Text')
            Apollo.d.push({
                title: series_title,
                url: $(pdfh(series, 'a&&href') + '?page=fypage#noHistory#').rule((series_title) => {
                    const Apollo = $.require('hiker://page/Apollo')
                    setPageTitle(series_title)
                    Apollo.yijiParse(MY_URL)
                    setResult(Apollo.d)
                }, series_title),
                col_type: 'scroll_button',
                extra: {
                    'backgroundColor': Apollo.getRangeColors()
                }
            })
            Apollo.d.push({
                col_type: 'blank_block'
            })
        }
        if (makers) {
            Apollo.d.push({
                title: '发行商 : ',
                url: Apollo.empty,
                col_type: 'scroll_button',
                extra: {
                    lineVisible: false
                },
            })
            let makers_title = pdfh(makers, 'a&&Text')
            Apollo.d.push({
                title: makers_title,
                url: $(pdfh(makers, 'a&&href') + '?page=fypage#noHistory#').rule((makers_title) => {
                    const Apollo = $.require('hiker://page/Apollo')
                    setPageTitle(makers_title)
                    Apollo.yijiParse(MY_URL)
                    setResult(Apollo.d)
                }, makers_title),
                col_type: 'scroll_button',
                extra: {
                    'backgroundColor': Apollo.getRangeColors()
                }
            })
            /*Apollo.d.push({
                col_type: 'line_blank'
            })*/
        }
        if (directors) {
            Apollo.d.push({
                title: '导演 : ',
                url: Apollo.empty,
                col_type: 'scroll_button',
                extra: {
                    lineVisible: false
                },
            })
            let directors_title = pdfh(directors, 'a&&Text')
            Apollo.d.push({
                title: directors_title,
                url: $(pdfh(directors, 'a&&href') + '?page=fypage#noHistory#').rule((directors_title) => {
                    const Apollo = $.require('hiker://page/Apollo')
                    setPageTitle(directors_title)
                    Apollo.yijiParse(MY_URL)
                    setResult(Apollo.d)
                }, directors_title),
                col_type: 'scroll_button',
                extra: {
                    'backgroundColor': Apollo.getRangeColors()
                }
            })
            Apollo.d.push({
                col_type: 'blank_block'
            })
        }
        if (labelsList) {
            Apollo.d.push({
                title: '标签 : ',
                url: Apollo.empty,
                col_type: 'scroll_button',
                extra: {
                    lineVisible: false
                },
            })
            labelsList.forEach(label => {
                let label_title = pdfh(label, 'a&&Text')
                Apollo.d.push({
                    title: label_title,
                    url: $(pdfh(label, 'a&&href') + '?page=fypage#noHistory#').rule((
                        label_title) => {
                        const Apollo = $.require('hiker://page/Apollo')
                        setPageTitle(label_title)
                        Apollo.yijiParse(MY_URL)
                        setResult(Apollo.d)
                    }, label_title),
                    col_type: 'scroll_button',
                    extra: {
                        'backgroundColor': Apollo.getRangeColors()
                    }
                })
            })
            Apollo.d.push({
                col_type: 'line_blank'
            })
        }

        const CiliList = pdfa(html, '.min-w-full&&tr')
        if (CiliList.length > 0) {
            Apollo.d.push({
                title: '本小站磁力' + CiliList.length + "条",
                url: Apollo.empty,
                col_type: 'text_center_1',
                extra: {
                    lineVisible: false
                },
            })
        } else {
            //Apollo.BTshowParse(num);
        }
        CiliList.forEach((item, index) => {
            Apollo.d.push({
                title: pdfh(item, 'a&&Text'),
                url: pdfh(item, 'a&&href'),
                desc: (index + 1).toString().padStart(2, "0") + "\t💽" + Apollo.formatNumber(pdfh('<table>' + item + '</table>', 'td,1&&Text')) + "📆" + pdfh('<table>' + item + '</table>', 'td,2&&Text'),
                pic_url: "https://img.vinua.cn/images/Ooz4R.jpeg",
                col_type: 'avatar'
            })
        })

        /*var path = url.match(/\/(?!.*\/)(.*$)/) ? url.match(/\/(?!.*\/)(.*$)/)[1] : num;
        var userId = pdfh(html, ".items-center.space-x-6&&a&&href").match(/\/(?!.*\/).*userId=(.*$)/)[1]
        // 获取当前的 10 位 Unix 时间戳
        let timestamp = Math.floor(Date.now() / 1000);
        var sign;
        var URL = `https://client-rapi-missav.recombee.com/missav-default/batch/?frontend_timestamp=${timestamp}&frontend_sign=${sign}`;

        var result = fetch(URL, {
            body: JSON.stringify({
                "requests": [{
                    "method": "POST",
                    "path": `/recomms/items/${path}/items/`,
                    "params": {
                        "targetUserId": userId,
                        "count": 16,
                        "scenario": "mobile-watch-next",
                        "returnProperties": true,
                        "includedProperties": [
                            "title_cn",
                            "duration",
                            "has_chinese_subtitle",
                            "is_uncensored_leak",
                            "dm"
                        ],
                        "cascadeCreate": true
                    }
                }],
                "distinctRecomms": true
            }),
            headers: {
                "Content-Type": "application/json",
            },
            method: 'POST'
        });
        log(result)
        const videoList = pdfa(html, '.grid.grid-cols-2.gap-5&&.relative')
        Apollo.d.push({
            title: '推荐视频',
            url: Apollo.empty,
            col_type: 'text_center_1',
            extra: {
                lineVisible: false
            },
        })
        videoList.forEach(item => {
            Apollo.d.push({
                title: pdfh(item, '.lozad&&alt'),
                url: $(pdfh(item, 'a&&href') + '#noHistory#').rule(() => {
                    const Apollo = $.require('hiker://page/Apollo')
                    Apollo.videoParse(MY_URL)
                    setResult(Apollo.d)
                    if (Apollo.taskList.length > 0) {
                        be(Apollo.taskList)
                    }
                }),
                pic_url: pdfh(item, '.lozad&&data-src') + '@Referer=' + Apollo.url,
                desc: pdfh(item, '.absolute&&Text'),
                col_type: 'movie_2'
            })
        })*/
        Apollo.d.push({
            title: '““””' + "我是有底线的".fontcolor("grey")
                .small(),
            url: Apollo.empty,
            col_type: "text_center_1",
            extra: {
                lineVisible: false
            }
        })
        setResult(Apollo.d)
    },
    formatNumber: function(input) {
        // 分离整数、小数和单位
        var regex = /(\d+)(\.\d+)?([a-zA-Z]+)/;
        var match = input.match(regex);
        if (match) {
            var integerPart = match[1].toString(); // 获取整数部分
            var decimalPart = match[2] ? match[2].slice(1).toString() : '0'; // 如果没小数部分，默认为 '0'
            var unitPart = match[3]; // 获取单位部分              
            // 对整数部分进行补零
            integerPart = integerPart.padStart(2, '0');
            // 对小数部分进行补零  
            decimalPart = decimalPart.padEnd(2, '0');
            // 合并结果
            return integerPart + '.' + decimalPart + unitPart;
        } else {
            return input
        }
    },
    BTshowParse: (识别码) => {
        try {
            var btsow = "https://btsow.motorcycles/search/" + 识别码
            var BTlist = pdfa(fetch(btsow), "body&&.data-list&&.row:not(.hidden-xs)");
            if (BTlist.length > 0) {
                Apollo.d.push({
                    title: 'BTshow磁力' + BTlist.length + "条",
                    url: btsow,
                    col_type: 'text_center_1',
                    extra: {
                        lineVisible: false
                    },
                })
            }
            BTlist.forEach((item, index) => {
                var url = getMyVar("BTcili");
                Apollo.d.push({
                    title: '<b><small><font color="#4682B4"> ' + pdfh(item, 'a&&title') + '</font></small>',
                    desc: (index + 1).toString().padStart(2, "0") + "\t💽" + Apollo.formatNumber(pdfh(item, '.size&&Text')) + "📆" + pdfh(item, '.date&&Text'),
                    img: "https://img.vinua.cn/images/Ocqpj.png",
                    url: "https:" + pdfh(item, 'a&&href') + $('').lazyRule(() => {
                        var url = pdfh(request(input, {}), '#magnetOpen&&a&&href');
                        putMyVar("BTcili", url)
                        return url
                    }),
                    col_type: "avatar",
                })
            })
        } catch {}
    },
    //一级.简
    yijiParse: (url) => {
        putMyVar("MY_TYPE", "一级")
        var page = getMyVar("page", MY_PAGE + "")
        try {
            var pages = pdfh(html, "body&&.mt-6.justify-between&&form&&Text").match(/\d+/)[0]
        } catch {
            var pages = 1
        }
        addListener("onClose", $.toString(() => {
            clearMyVar("yurl");
            clearMyVar("ysort");
            clearMyVar("page")
        }));
        url = getMyVar("yurl", url)
        url = url.replace(/(\?page=\d+|\&page=\d+|$)/, (match) => {
            if (match.startsWith('?') || match.startsWith('&')) {
                return match.charAt(0) + 'page=' + page;
            } else {
                return (url.includes('?') ? '&page=' : '?page=') + page;
            }
        });
        log(url)
        Apollo.pageAdd(page)
        const html = fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0)'
            }
        })
        try {
            var title = "““””" + pdfh(html, "body&&.rounded-full&&img&&alt").big().fontcolor("#FF1493");
            var img = pdfh(html, "body&&.rounded-full&&img&&src");
            var desc = "““””" + pdfh(html, ".mt-2.text-sm.text-nord9&&p&&Text").big().fontcolor("#4169E1") + "\n" + pdfh(html, ".mt-2.text-sm.text-nord9&&p,1&&Text").fontcolor("#00CED1").big();
            Apollo.d.push({
                title: title,
                desc: desc,
                img: img,
                url: "hiker://empty",
                col_type: "movie_1_vertical_pic"
            })
        } catch {}
        Apollo.DynamicSort(html)
        Apollo.videoType(html, page)
    },

    videoType: (html, page) => {
        try {
            var pages = pdfh(html, "body&&.mt-6.justify-between&&form&&Text").match(/\d+/)[0]
        } catch (e) {
            var pages = 1
        }
        const list = pdfa(html, 'body&&.thumbnail')
        list.forEach(item => {
            var title = pdfh(item, '.lozad&&alt');
            Apollo.d.push({
                title: title,
                url: $(pdfh(item, 'a&&href') + '#noHistory#').rule(() => {
                    const Apollo = $.require('hiker://page/Apollo')
                    Apollo.videoParse(MY_URL)
                    setResult(Apollo.d)
                    if (Apollo.taskList.length > 0) {
                        be(Apollo.taskList)
                    }
                }),
                pic_url: pdfh(item, '.lozad&&data-src').replace("cover-t", "cover-n") + '@Referer=' + Apollo.url,
                desc: pdfh(item, 'a&&alt').toUpperCase().replace("-CHINESE-SUBTITLE", "🀄️").replace("-UNCENSORED-LEAK", "✅🈚️") + "⏰" + pdfh(item, '.absolute,-1&&Text'),
                col_type: 'movie_2',
                extra: page ? {
                    longClick: Apollo.pageMoveto(page, pages),
                    pageTitle: title
                } : {
                    pageTitle: title
                }
            })
        })
    },

    articlesType: (html, page) => {
        try {
            var pages = pdfh(html, "body&&.mt-6.justify-between&&form&&Text").match(/\d+/)[0]
        } catch {
            var pages = 1
        }
        const list = pdfa(html, '.grid&&.rounded-lg')
        list.forEach(item => {
            Apollo.d.push({
                title: pdfh(item, 'img&&alt'),
                url: $(pdfh(item, 'a&&href') + '#noHistory#').rule(() => {
                    const Apollo = $.require('hiker://page/Apollo')
                    const html = fetch(MY_URL, {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0)'
                        }
                    })
                    Apollo.d.push({
                        title: pdfh(html, 'article&&Html'),
                        col_type: 'rich_text'
                    })
                    setResult(Apollo.d)
                }),
                pic_url: pdfh(item, 'img&&data-src') + '@Referer=' + Apollo.url,
                col_type: 'movie_2',
                extra: page ? {
                    longClick: Apollo.pageMoveto(page, pages)
                } : ""
            })
        })
    },


    avatarType: (html, page) => {
        try {
            var pages = pdfh(html, "body&&.mt-6.justify-between&&form&&Text").match(/\d+/)[0]
        } catch {
            var pages = 1
        }
        const list = pdfa(html, '.mx-auto.grid&&li')
        list.forEach(item => {
            Apollo.d.push({
                title: pdfh(item, '.space-y-2&&Text').replace(/\(.*\)/, "").replace("影片", ""),
                url: $(pdfh(item, 'a&&href') + '?page=fypage#noHistory#').rule(() => {
                    const Apollo = $.require('hiker://page/Apollo')
                    Apollo.yijiParse(MY_URL)
                    setResult(Apollo.d)
                }),
                //desc: 
                pic_url: pdfh(item, 'img&&src') ? (pdfh(item, 'img&&src') + '@Referer=' + Apollo.url) : "https://thumbsnap.com/i/sySMQ7Mg.jpg",
                col_type: 'card_pic_3',
                extra: page ? {
                    longClick: Apollo.pageMoveto(page, pages)
                } : ""
            })
        })
    },


    tagsType: (html, page) => {
        try {
            var pages = pdfh(html, "body&&.mt-6.justify-between&&form&&Text").match(/\d+/)[0]
        } catch {
            var pages = 1
        }
        const list = pdfa(html, '.gap-4&&div')
        list.forEach(item => {
            Apollo.d.push({
                title: pdfh(item, 'a&&Text'),
                url: $(pdfh(item, 'a&&href') + '?page=fypage#noHistory#').rule(() => {
                    const Apollo = $.require('hiker://page/Apollo')
                    Apollo.yijiParse(MY_URL)
                    setResult(Apollo.d)
                }),
                col_type: 'text_4',
                extra: page ? {
                    longClick: Apollo.pageMoveto(page, pages)
                } : ""
            })
        })
    },


    updateAvatar: (param) => {
        const actressesHtml = fetch(param.url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0)'
            }
        })
        updateItem({
            pic_url: pdfh(actressesHtml, '.object-cover.object-top.w-full.h-full&&src'),
            //col_type: 'card_pic_3',
            extra: {
                id: param.index
            }
        })
    },

    setDesc: (desc) => {
        function substr(str, maxLength) {
            let len = 0;
            for (let i = 0; i < str.length; i++) {
                if (str.charCodeAt(i) > 255) {
                    len += 2;
                } else {
                    len++;
                }
                if (len > maxLength) {
                    return str.slice(0, i) + '...';
                }
            }
            return str;
        }

        function setDesc(arr, desc, num) {
            //log(desc)
            if (desc == undefined) {
                return;
            }
            desc = desc.constructor == Array ? desc.join('<br>') : desc;
            if (desc.replace(/(<br>|\s+|<\/?p>|&nbsp;)/g, '').length == 0) {
                return;
            }

            const mark = 'desc';
            num = typeof(num) == 'undefined' ? 100 : num
            desc = desc.startsWith('　　') ? desc : '　　' + desc;
            desc = desc.replace(/'/g, "&#39;");
            desc = desc.replace(/\r\n/g, "<br>");
            desc = desc.replace(/\r/g, "<br>");
            desc = desc.replace(/\n/g, "<br>");
            let sdesc = substr(desc, num);

            var colors = {
                show: "#008B8B",
                hide: "#8A2BE2"
            }

            var lazy = $(`#noLoading#`).lazyRule((dc, sdc, m, cs) => {
                var show = storage0.getItem(m, '0');
                var title = findItem('desc').title;
                var re = /(<\/big><br>.*?>).+/g;
                var exp = '展开:';
                var ret = '收起:';
                if (show == '1') {
                    updateItem('desc', {
                        title: title
                            .replace(ret, exp)
                            .replace(re, '$1' + sdc + '</small>')
                            .replace(/(<\/big><br>\<font color=").*?(">)/, '$1' + cs.hide + '$2')

                    })
                    storage0.setItem(m, '0');
                } else {
                    updateItem('desc', {
                        title: title
                            .replace(exp, ret)
                            .replace(re, '$1' + dc + '</small>')
                            .replace(/(<\/big><br>\<font color=").*?(">)/, '$1' + cs.show + '$2')
                    })
                    storage0.setItem(m, '1');
                }
                return `hiker://empty`
            }, desc, sdesc, mark, colors)
            var sc = storage0.getItem(mark, '0') == '0' ? '展开:' : '收起:';
            var dc = storage0.getItem(mark, '0') == '0' ? sdesc : desc;
            var cs = storage0.getItem(mark, '0') == '0' ? colors.hide : colors.show;
            arr.push({
                title: '' + '<b><font color="">∷ 剧情简介	</font></b>' + "<middle><a style='text-decoration: none;' href='" + lazy + "'>" + sc + '</a></big><br><font color="' + cs + '">' + `${dc}` + '</small>',
                col_type: 'rich_text',
                extra: {
                    id: 'desc',
                    lineSpacing: 6,
                    textSize: 15,
                    lineVisible: true,
                }
            })
        }

        setDesc(Apollo.d, desc, 90);
    },
}
$.exports = Apollo
