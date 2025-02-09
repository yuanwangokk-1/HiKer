let file = "hiker://files/rules/FYZG/fyzg.json";

function pat() {
    let zso;
    try {
        zso = JSON.parse(readFile(file));
    } catch (e) {
        zso = {};
        log(e.toString());
    }
    ;
    return zso;
};

let week = ["日", "一", "二", "三", "四", "五", "六"];

//当前周
function WeekDay(week) {
    const weekDays = week;
    return weekDays[new Date().getDay()];
};

//链接相同去重
function addObj(array, newObj) {
    const exIndex = array.findIndex(item => item.url === newObj.url);
    if (exIndex === -1) {
        // 如果链接不存在，添加新对象
        array.unshift(newObj);
    } else {
        // 如果链接已存在，覆盖旧对象
        array[exIndex] = newObj;
    }
};

//日期时间
function ymdhm() {
    const date = new Date();
    const num = date.getDay();
    const [year, month, day, hours, minutes] = [date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes()].map(v => v < 10 ? `0${v}` : v);
    const riqi = year + "-" + month + "-" + day;
    const shijian = hours + ":" + minutes;
    return riqi + "#" + shijian + "#" + num;
};

//按周推后日期
function NextSaturday(zhou) {
    let weekMap = {
        '日': 0,
        '一': 1,
        '二': 2,
        '三': 3,
        '四': 4,
        '五': 5,
        '六': 6
    };
    let num = weekMap[zhou]; // 直接获取对应的数字
    // 获取当前日期
    const today = new Date();
    const dayOfWeek = today.getDay(); // 获取当前是星期几
    // 计算距离上一个指定星期几的天数差
    let daysDiff = (dayOfWeek - num + 7) % 7;
    // 获取上一个指定星期几的日期
    const specificDay = new Date(today);
    specificDay.setDate(today.getDate() - daysDiff);
    // 格式化日期
    const year = specificDay.getFullYear();
    const month = String(specificDay.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1
    const day = String(specificDay.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

//时间差
function Time(startDate, endDate, updateType) {
    // 将字符串日期转换为Date对象
    let date1 = new Date(startDate); // 当前日期
    let date2 = new Date(endDate); // 之前日期
    // 验证日期是否有效
    if (isNaN(date1.getTime()) || isNaN(date2.getTime())) {
        console.error("无效的日期格式");
        return null;
    }
    // 修正时间偏差，确保结果的准确性
    let utcHours = date2.getUTCHours();
    utcHours += 1;
    date2.setUTCHours(utcHours);
    // 计算两个日期之间的时间差（毫秒）
    let diff = Math.abs(date2.getTime() - date1.getTime());
    // 将差值转换为(周/天)数
    let days = parseInt(diff / (1000 * 60 * 60 * 24 * (updateType === "周更" ? 7 : 1)));
    console.log(updateType === "周更" ? `周更-距上次更新隔了 ${days} 周` : `日更-距上次更新隔了 ${days} 天`);
    return days;
};

//更新集数
function Update(ymday, qday, gen, get) {
    // 更新时间间隔
    let Day = WeekDay(week);
    let Days = Time(qday, ymday, gen);

    // 读取文件内容
    let data = pat();
    let arr = data[get] || [];
    // 更新数组中的数据
    for (let i = 0; i < arr.length; i++) {
        let zou = arr[i].week;
        let gjs = arr[i].gj;

        if ((zou === getMyVar("li", Day) && gen === "周更") || (zou === "0" && gen === "日更")) {
            let desc = arr[i].desc;
            let desz = arr[i].desz;

            // 如果 desz 不存在，直接进行更新操作
            if (desz == "") {
                desc = (parseInt(desc) + parseInt(Days) * parseInt(gjs)).toString(); // 先转为数值进行运算，再转回字符串
            } else {
                // 如果 desz 存在，进行比较
                if (parseInt(desc) + parseInt(Days) * parseInt(gjs) >= desz) {
                    desc = desz;
                } else {
                    desc = (parseInt(desc) + parseInt(Days) * parseInt(gjs)).toString();
                }
            }
            // 更新 arr[i] 的 desc 和 riqi
            arr[i].desc = desc;
            arr[i].riqi = ymday;
        }
    }
    ;
    data[get] = arr;
    saveFile(file, JSON.stringify(data));
};

//更新追更
function UPzg(get, gen) {
    let lizso = pat()[get] || [];

    function getDates(lizso, week) {
        return lizso ? lizso.filter(li => li.week === week).map(li => li.riqi) : ["null"];
    };

    function update(currentDate, targetDate, updateType) {
        if (currentDate > targetDate) {
            Update(currentDate, targetDate, updateType, get);
        }
        ;
    };
    let Day = WeekDay(week);
    let zqi = getDates(lizso, getMyVar("li", Day));
    let rqi = getDates(lizso, "0");
    let Saturday = NextSaturday(getMyVar("li", Day));

    if (gen == "周更") {
        update(Saturday, zqi[0], "周更");
    } else if (gen == "日更") {
        update(ymdhm().split("#")[0], rqi[0], "日更");
    }
    ;
};

//汉字转数字
let chnNumChar = {
    零: 0,
    一: 1,
    二: 2,
    两: 2,
    三: 3,
    四: 4,
    五: 5,
    六: 6,
    七: 7,
    八: 8,
    九: 9
};

let chnNameValue = {
    十: {
        value: 10,
        secUnit: false
    },
    百: {
        value: 100,
        secUnit: false
    },
    千: {
        value: 1000,
        secUnit: false
    },
    万: {
        value: 10000,
        secUnit: true
    },
    亿: {
        value: 100000000,
        secUnit: true
    }
};

function ChineseToNumber(chnStr) {
    var rtn = 0;
    var section = 0;
    var number = 0;
    var secUnit = false;
    var str = chnStr.split('');

    for (var i = 0; i < str.length; i++) {
        var num = chnNumChar[str[i]];
        if (typeof num !== 'undefined') {
            number = num;
            if (i === str.length - 1) {
                section += number;
            }
            ;
        } else {
            var unit = chnNameValue[str[i]].value;
            secUnit = chnNameValue[str[i]].secUnit;

            // 添加以下代码来处理单个单位字符的情况
            if (number === 0 && !secUnit) {
                section = unit;
            } else {
                section += (number * unit);
                if (secUnit) {
                    rtn += section;
                    section = 0;
                }
                ;
            }
            ;
            number = 0;
        }
        ;
    }
    ;
    return rtn + section;
};

//匹配数字
function extractNumber(desc, p) {
    // 先尝试匹配阿拉伯数字
    const matchArabic = p == "x" ? desc.match(/(\d+)(?:集|话|回|期|卷|章).*/) : desc.match(/(\d+)/);
    if (matchArabic) {
        return matchArabic[1];
    }
    ;

    // 如果没有匹配到阿拉伯数字，尝试匹配中文数字
    const matchChinese = p == "x" ? desc.match(/([零一二三四五六七八九十百千]+)(?:集|话|回|期|卷|章).*/) : desc.match(/([零一二三四五六七八九十百千]+)/);
    if (matchChinese) {
        return ChineseToNumber(matchChinese[1]);
    }
    // 如果都没有匹配到，返回其他默认值

    return p == "x" ? "请手动输入" : desc.substring(0, 15);
};

//修改
let Xg = (name, title, desc, img, url, Title, zuji, gen, wek, gj, gs, desz) => {

    return $("#noLoading#").lazyRule((name, title, desc, img, url, Title, zuji, gen, wek, gj, gs, desz) => {
        require(config.依赖.replace(/[^/]*$/, "public.js"));

        function add(名称, 更新, 总集, 周, 更集, 更时, name) {
            let get = name == "影视" ? "ys" : name == "小说" ? "xs" : name == "其它" ? "qt" : name == "漫画" ? "mh" : "ts";
            let zso = pat();
            ['ys', 'xs', 'mh', 'ts', 'qt'].forEach(key => {
                zso[key] = zso[key] || [];
            });
            let time;
            if (gen == "周更") {
                time = NextSaturday(周);
            } else if (gen == "日更") {
                time = ymdhm().split("#")[0];
            }
            ;
            let obj = {
                title: 名称,
                desc: 更新,
                desz: 总集,
                img: img,
                url: url,
                pageTitle: Title,
                week: 周,
                gj: 更集,
                gs: 更时,
                zuji: zuji,
                riqi: time
            };
            addObj(zso[get], obj);

            saveFile(file, JSON.stringify(zso));

            if (getMyVar("fys", "") == "0") {
                refreshPage(false);
                return "toast://修改成功"
            } else {
                ;
                return "toast://已添加 " + gen;
            }
            ;
        };

        function generate(wek, gj, gs) {
            if (gen === "周更") {
                return `${wek},${gj},${gs},${name}`;
            } else if (gen === "日更") {
                return `${gj},${gs},${name}`;
            } else {
                return `${name}`;
            }
        };
        let Default = getMyVar("fys", "") == "0" ? generate(wek, gj, gs) : generate(WeekDay(week), "1", "10");

        const hikerPop = $.require(config.依赖.replace(/[^/]*$/, "hikerPop.js"));

        hikerPop.inputTwoRow({
            titleHint: "名称，最新，总集",
            titleDefault: `${title},${gen != "完更" && getMyVar("fys", "") != "0" ? extractNumber(desc, "x") : desc.substring(0, 15)}${desz != "" && desz != undefined ? "," + desz : ""}`,
            urlHint: gen == "周更" ? "周几，集数，时间，类型" : gen == "日更" ? "集数，时间，类型" : "类型",
            urlDefault: Default,
            noAutoSoft: false, //自动打开输入法
            title: `${name} - ${title}`,
            //hideCancel: true,
            confirm(s1, s2) {
                if (s1 == "" || s2 == "") return "toast://不能为空";
                try {
                    let na = s1.split(",");
                    let zou = s2.split(",");

                    let min1 = parseInt(na[1]);
                    let min2 = parseInt(na[2]);
                    if (!/^[^,]*,\d+(?!0+$)(?:,\d+(?=$))?$/.test(s1) && gen !== "完更") return "toast://输入集数为非正确数字";

                    if (!/^[^,]*,.*/.test(s1) && gen == "完更") return "toast://要留1个英文逗号";

                    if (min2 < min1) return "toast://总集不能<最新集";

                    if (!/^[日一二三四五六],(\d),(\d{2}|\d{4})(,(?!$).*)?$/.test(s2) && gen == "周更" || !/^(\d),(\d{2}|\d{4})(,(?!$).*)?$/.test(s2) && gen == "日更") return gen == "周更" ? "toast://输入一到日之内，周更集数、时间为数字" : "toast://输入日更集数、时间为数字";

                    let 名称 = na[0].substring(0, 15);
                    let 更新 = na[1];
                    let 总集 = na.length > 2 ? na[2] : "";
                    let 周;
                    let 更集;
                    let 更时;
                    let 类型;
                    if (gen == "周更") {
                        周 = zou[0];
                        更集 = zou[1];
                        更时 = zou[2];
                        类型 = zou[3];
                    } else if (gen == "日更") {
                        周 = "0";
                        更集 = zou[0];
                        更时 = zou[1];
                        类型 = zou[2]
                    } else {
                        周 = "1";
                        更集 = "";
                        更时 = "";
                        类型 = s2;
                    }
                    ;
                    hikerPop.runOnNewThread(() => {
                        return add(名称, 更新, 总集, 周, 更集, 更时, 类型);
                    })
                } catch (e) {
                    return "toast://输入有误";
                }
                ;
            },
            cancel() {
                return "toast://取消";
            }
        })

        return "hiker://empty";
    }, name, title, desc, img, url, Title, zuji, gen, wek, gj, gs, desz)
};

//加入追更
let jrzg = (name, title, desc, img, url, Title, zuji, gen, wek, gj, gs, desz) => {

    let get = name == "影视" ? "ys" : name == "小说" ? "xs" : name == "其它" ? "qt" : name == "漫画" ? "mh" : "ts";

    let zso = pat();
    ['ys', 'xs', 'mh', 'ts', 'qt'].forEach(key => {
        zso[key] = zso[key] || [];
    });
    let found = zso[get].some(item => item.url === url);

    if (found && getMyVar("fys", "") != "0") {
        return $("追更已存在，是否覆盖 ？").confirm((name, title, desc, img, url, Title, zuji, gen, wek, gj, gs, desz) => {
            require(config.依赖.replace(/[^/]*$/, "public.js"));
            return Xg(name, title, desc, img, url, Title, zuji, gen, wek, gj, gs, desz);

        }, name, title, desc, img, url, Title, zuji, gen, wek, gj, gs, desz);
    } else {
        return Xg(name, title, desc, img, url, Title, zuji, gen, wek, gj, gs, desz);
    }
    ;
};

//记录足迹
function zuji(get, url, tit) {
    try {
        let zuji = extractNumber(tit, "z");
        let list = JSON.parse(readFile(file));
        const Arr = list[get].map(function (item) {
            if (base64Decode(item['url']).split("#imm")[0].split("##")[1] == url) {
                item['zuji'] = zuji;
            }
            return item;
        });
        list[get] = Arr;
        saveFile(file, JSON.stringify(list));
    } catch (e) {
        log(e.toString());
    }
    ;
};

//历史记录
function History(url, get) {
    let json = JSON.parse(fetch("hiker://history"));
    let zu = [];
    for (let li of json) {
        if (li.params == null) continue;
        let par = JSON.parse(li.params);
        let ur;
        try {
            ur = par.url.replace(/.*ty##/, "").replace(/#imm.*/, "");
        } catch (e) {
        }
        ;

        if (base64Encode(ur) == base64Encode(base64Decode(url).match(/.*ty##(.*?)#imm.*/)[1])) {

            if (li.lastClick != undefined) {
                zu.push(li.lastClick.split("@")[0].replace(/.*>(\d+)<.*/, "$1"));
            } else {
                zu.push("无记录");
            }
            ;
        } else {
            zu.push("无记录");
        }
        ;
    }
    ;
    let zuji = extractNumber(zu[0], "z");
    let list = JSON.parse(readFile(file));
    const Arr = list[get].map(function (item) {
        if (item['url'] == url) {
            if (item['zuji'] != zuji && zuji != "无记录" || item['zuji'] == "无记录" && zuji != "无记录") {
                item['zuji'] = zuji;
            }
            ;
        }
        ;
        return item;
    });
    list[get] = Arr;
    saveFile(file, JSON.stringify(list));
    return zuji;
};

//删除
let ex = (get, tit, url) => {
    return $("确认删除  " + tit + " ？").confirm((get, file, tit, url) => {
        let list = JSON.parse(readFile(file));
        const result = list[get].filter(item => {
            return !(item.url == url);
        });
        list[get] = result;
        saveFile(file, JSON.stringify(list));
        refreshPage(false);
        return "toast://已删除: " + tit;
    }, get, file, tit, url);
};

//移动
let Yd = (get, url, wek) => {
    return $("#noLoading#").lazyRule((get, file, url, wek) => {

        // 辅助函数：获取当前周的项目
        function getCurrentWeekItems(list, get, wek) {
            const arr = list[get];
            return arr.filter(item => item.week.startsWith(wek));
        }

        // 辅助函数：获取目标索引
        function getTargetIndex(arr, wek, targetUrl) {
            let count = 0;
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].week === wek) {
                    if (arr[i].url === targetUrl) {
                        return i;
                    }
                    count++;
                }
            }
            return -1;
        };

        const list = JSON.parse(readFile(file));
        if (!list) return "hiker://empty";

        const currentWeekItems = getCurrentWeekItems(list, get, wek);
        const coun = currentWeekItems.length;

        const array = Array.from({
            length: coun
        }, (_, index) => index + 1);

        const target = currentWeekItems.find(item => item.url === url);
        if (!target) {
            console.error("未找到目标元素");
            return "hiker://empty";
        }

        const index = currentWeekItems.findIndex(item => item.url === target.url);

        const hikerPop = $.require(config.依赖.replace(/[^/]*$/, "hikerPop.js"));
        hikerPop.selectCenterMark({
            options: array,
            title: "选择要移动的位置",
            position: index,
            icons: new Array(coun).fill(hikerPop.icon.main_menu_home),
            click(a) {
                const targetIndex = getTargetIndex(list[get], wek, target.url);
                if (targetIndex === -1) {
                    console.error("找不到目标索引，无法移动元素");
                    return "hiker://empty";
                }

                const newIndex = getTargetIndex(list[get], wek, currentWeekItems[parseInt(a) - 1].url);
                if (newIndex === -1) {
                    console.error("找不到新位置索引，无法移动元素");
                    return "hiker://empty";
                }

                // 将元素从原位置删除
                list[get].splice(targetIndex, 1);
                // 将元素添加到目标位置
                list[get].splice(newIndex, 0, target);

                saveFile(file, JSON.stringify(list));
                refreshPage(false);
                return "toast://移动至第 " + a + " 位";
            }
        });
        return "hiker://empty";
    }, get, file, url, wek)
};

//封面
let Fm = (get, i, tit, url) => {
    let List = [];
    List.push({
        title: "更换",
        desc: "输 入 封 面 链 接",
        col_type: "input",
        url: $.toString((get, file, url) => {
            let arr = JSON.parse(readFile(file));
            const Arr = arr[get].map(function (item) {
                if (item['url'] == url) {
                    item['img'] = input;
                }
                ;
                return item;
            });
            arr[get] = Arr;
            if (/^http/.test(input)) {
                saveFile(file, JSON.stringify(arr));
                refreshPage(false);
                return "toast://设置成功！";
            } else {
                return "hiker://empty";
            }
        }, get, file, url),
        extra: {
            cls: "cls_fyfmsc"
        }
    });

    let r = request('https://m.douban.com/search/?query=' + encodeURIComponent(tit))
    let list = pdfa(r, ".search-results&&img");

    for (let i in list) {
        let pic = pdfh(list[i], "img&&src");
        List.push({
            pic: pic,
            url: $("#noLoading#").lazyRule((pic, get, file, url) => {
                let arr = JSON.parse(readFile(file));
                const Arr = arr[get].map(function (item) {
                    if (item['url'] == url) {
                        item['img'] = pic;
                    }
                    ;
                    return item;
                });
                arr[get] = Arr;
                saveFile(file, JSON.stringify(arr));
                refreshPage(false);
                return "toast://设置成功！"
            }, pic, get, file, url),
            col_type: "pic_3",
            extra: {
                cls: "cls_fyfmsc"
            }
        });
    }
    ;
    List.push({
        title: "点击上方图片更换封面",
        col_type: "text_center_1",
        url: "hiker://empty",
        extra: {
            cls: "cls_fyfmsc"
        }
    });
    deleteItemByCls("cls_fyfmsc");
    addItemAfter("id_fyfmxz" + i, List);
};

//分享
let Fx = (get, tit, url) => {
    return $(["完整编码", "文件Hiker", "文件TXT"].concat(getPastes()), 2, tit).select((get, file, tit, url) => {
        let list = JSON.parse(readFile(file));
        const result = list[get].filter(item => {
            return item.url == url;
        });
        let resb64 = base64Encode(JSON.stringify(result));
        let getPass = (tit, rule, type) => "海阔视界，「" + tit + "」风影追更分享，复制整条口令自动导入$" + rule + "$" + type + "$" + get + "@import=js:$.require('import?rule='+" + JSON.stringify(MY_RULE.title) + ")(input)";

        if (input == "完整编码") {
            return "copy://" + getPass(tit, resb64, "1");
        } else if (getPastes().includes(input)) {
            let share = sharePaste(resb64, input);
            return "copy://" + getPass(tit, base64Encode(share), "2");
        } else {
            let path = "hiker://files/_cache/风影追更 - " + tit + (input === "文件Hiker" ? "hiker" : "txt");
            writeFile(path, getPass(tit, resb64, "3"));
            return "share://" + path;
        }
        ;
    }, get, file, tit, url)
};

//分享全部
let Fxq = (get) => {
    return $(["文件Hiker", "文件TXT"].concat(getPastes()), 2, "分享方式").select((get, file) => {
        let list = JSON.parse(readFile(file));
        let result;
        let len;
        if (get !== "qb") {
            result = list[get];
            len = result.length;
        } else {
            result = list;
            len = Object.values(list).reduce((sum, array) => sum + array.length, 0);
        }
        ;

        let resb64 = base64Encode(JSON.stringify(result));
        let getPass = (len, rule, type) => "海阔视界，「风影追更 - 共" + len + "条」风影追更分享，复制整条口令自动导入$" + rule + "$" + type + "$" + get + "@import=js:$.require('import?rule='+" + JSON.stringify(MY_RULE.title) + ")(input)";

        if (getPastes().includes(input)) {
            let share = sharePaste(resb64, input);
            return "copy://" + getPass(len, base64Encode(share), "2");
        } else {
            let path = "hiker://files/_cache/风影追更 - 共" + len + "条" + (input === "文件Hiker" ? "hiker" : "txt");
            writeFile(path, getPass(len, resb64, "1"));
            return "share://" + path;
        }
        ;
    }, get, file)
};

//调整
let Tz = (names, title, desc, img, url, Title, zuji, gen, wek, gj, gs, desz) => {
    let arr = wek == "0" ? ["调至周更", "调至完更"] : wek == "1" ? ["调至周更", "调至日更"] : ["调至日更", "调至完更"];
    return $(arr, 2, "调整追更").select((names, title, desc, img, url, Title, zuji, gen, wek, gj, gs, desz) => {
        require(config.依赖.replace(/[^/]*$/, "public.js"));
        if (input == "调至周更") {
            return jrzg(names, title, desc, img, url, Title, zuji, "周更", WeekDay(week), gj, gs, desz);
        } else if (input == "调至日更") {
            return jrzg(names, title, desc, img, url, Title, zuji, "日更", "0", gj, gs, desz);
        } else if (input == "调至完更") {
            return jrzg(names, title, desc, img, url, Title, zuji, "完更", "1", gj, gs, desz);
        }
        ;
    }, names, title, desc, img, url, Title, zuji, gen, wek, gj == "" ? "1" : gj, gs == "" ? "10" : gs, desz);
};
