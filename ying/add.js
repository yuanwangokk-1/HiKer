let d = [];
addListener("onClose", $.toString(() => {
    clearMyVar("namejs");
    clearMyVar("hostjs");
    clearMyVar("sourljs");
    clearMyVar("syjs");
    clearMyVar("fljs");
    clearMyVar("erjs");
    clearMyVar("sojs");
    clearMyVar("gyjs");
    clearMyVar("pdfg");
    clearMyVar("gs");
}));

d.push({
    desc: "必填*影视名称&&作者",
    col_type: "input",
    extra: {
        titleVisible: false,
        onChange: "putMyVar('namejs', input)",
        defaultValue: getMyVar('namejs')
    }
}, {
    desc: "必填*分类链接",
    col_type: "input",
    extra: {
        type: 'textarea',
        highlight: true,
        height: 1,
        onChange: 'putMyVar("hostjs", input)',
        defaultValue: getMyVar('hostjs')
    }
}, {
    desc: "必填*搜索链接",
    col_type: "input",
    extra: {
        type: 'textarea',
        highlight: true,
        height: 1,
        onChange: "putMyVar('sourljs',input)",
        defaultValue: getMyVar('sourljs')
    }
}, {
    desc: "选填-首页展示",
    col_type: "input",
    extra: {
        type: 'textarea',
        highlight: true,
        height: 1,
        onChange: "putMyVar('syjs',input)",
        defaultValue: getMyVar('syjs')
    }
}, {
    desc: "选填-分类页面",
    col_type: "input",
    extra: {
        type: 'textarea',
        highlight: true,
        height: 1,
        onChange: "putMyVar('fljs',input)",
        defaultValue: getMyVar('fljs')
    }
}, {
    desc: "选填-二级页面",
    col_type: "input",
    extra: {
        type: 'textarea',
        highlight: true,
        height: 1,
        onChange: "putMyVar('erjs',input)",
        defaultValue: getMyVar('erjs')
    }
}, {
    desc: "选填-搜索页面",
    col_type: "input",
    extra: {
        type: 'textarea',
        highlight: true,
        height: 1,
        onChange: "putMyVar('sojs',input)",
        defaultValue: getMyVar('sojs')
    }
}, {
    desc: "选填-公用函数",
    col_type: "input",
    extra: {
        type: 'textarea',
        highlight: true,
        height: 1,
        onChange: "putMyVar('gyjs',input)",
        defaultValue: getMyVar('gyjs', "")
    }
}, getMyVar("pdfg") == "1" ? {
    title: "上次编辑：" + timea.replace("T", " "),
    url: "hiker://empty",
    col_type: "text_center_1",
    extra: {
        lineVisible: false
    }
} : "", {
    title: getMyVar("gs", gsValue) + " 格式",
    url: $(["JS", "HOST"], 2, "规则格式").select(() => {
        putMyVar("gs", input);
        refreshPage(false);
        return "toast://已切换 " + input;
    }),
    col_type: "text_4"
}, {
    title: "测试",
    url: $(["首页", "分类", "搜索"], 3, "测试").select((syurl, d, sui) => {
        if (input == "首页") {
            return getMyVar("namejs") == "" && getMyVar("hostjs") == "" && getMyVar("syjs") == "" ? "toast://正确填写后再测试" : $("hiker://empty##noRecordHistory##noHistory#").rule((syurl, d, sui) => {
                let syurl;
                try {
                    let sy = new Function(syurl);
                    syurl = sy();
                } catch (e) {
                    syurl = syurl;
                }

                sui = sui.replace(/&&.*/, "");

                if (getMyVar("syjs") != "*") {
                    require(config.依赖);
                    xsy(syurl, d, sui);
                } else {
                    putMyVar("flurl", syurl);
                    require(config.依赖);
                    fenlei()
                }

            }, syurl, d, sui)
        } else if (input == "搜索") {
            return getMyVar("namejs") == "" && getMyVar("sourljs") == "" && getMyVar("sojs") == "" ? "toast://正确填写后再测试" : $(getMyVar("Mysou", "我的")).input(() => {
                putMyVar("Mysou", input);
                require(config.依赖);
                return sourl();
            });
        } else if (input == "分类") {
            return getMyVar("namejs") == "" && getMyVar("hostjs") == "" && getMyVar("fljs") == "" ? "toast://正确填写后再测试" : getMyVar("syjs") == "*" ? "toast://测试首页即为分类！" : $(syurl + "#noLoading#").lazyRule((url) => {
                let url;
                try {
                    let sy = new Function(url);
                    url = sy(url);
                } catch (e) {
                    url = url;
                }


                clearMyVar("Mysou");
                clearMyVar("Myurl.title");
                //putMyVar("Myurl.url", url);
                return $("hiker://empty#" + url + "#noRecordHistory##noHistory##fypage").rule(() => {
                    require(config.依赖);
                    fenlei()
                });
            }, syurl);
        }
    }, getMyVar("hostjs"), d, getMyVar("namejs")),
    col_type: "text_4"
}, {
    title: "助手",
    url: "hiker://debug?url=",
    col_type: "text_4"
}, {
    title: "保存",
    url: $("#noLoading#").lazyRule((file, Json) => {
        let dataArray = Json;

        function time() {
            const date = new Date();
            const num = date.getDay(); //num为星期几
            const [year, month, day, hours, minutes, seconds] = [date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()].map(v => v < 10 ? `0${v}` : v);
            const riqi = year + "-" + month + "-" + day;
            const shijian = hours + ":" + minutes + ":" + seconds;
            return riqi + "T" + shijian;
        }

        // 获取变量值
        let name = getMyVar('namejs');
        let sourl = getMyVar('sourljs')
        let host = getMyVar('hostjs');
        let sy = getMyVar('syjs');
        let fl = getMyVar('fljs');
        let er = getMyVar('erjs');
        let so = getMyVar('sojs');
        let gy = getMyVar('gyjs');
        let time = time();

        // 准备新对象
        let newItem = {
            "name": name,
            "host": host,
            "sourl": sourl,
            "sy": sy,
            "fl": fl,
            "er": er,
            "so": so,
            "time": time,
            "ttl": "",
            "fbhost": "",
            "gy": gy
        };

        //查找数组中是否有与新对象同名
        let existingItem = dataArray.find(item => item.name === name);
        //同名且包含"off"属性的对象
        let hasOff = existingItem && existingItem.hasOwnProperty("off");
        //同名且包含"gs"属性的对象
        let hasGs = existingItem && existingItem.hasOwnProperty("gs");

        if (hasOff) {
            newItem.off = existingItem.off; // 如果找到同名对象且有"off"属性，则继承其值
        } else {
            newItem.off = "1"; // 如果没有找到同名对象或同名对象不含"off"属性，则设置默认值"1"
        }

        if (hasGs) {
            newItem.gs = getMyVar("gs", existingItem.gs);
        } else {
            newItem.gs = getMyVar("gs", "JS");
        }


        // 将新对象插入数组开头
        dataArray.unshift(newItem);

        if (name == "") {
            return "toast://名称不能为空！";
        } else if (host == "" && sourl == "") {
            return "toast://链接不能为空！";
        }


        function exname(arr) {
            const map = new Map(); // 用于储存最大url值对应的名字 
            const maxUrlMap = new Map();
            arr.forEach(item => {
                const cleanedName = item.name.replace(/&&.*/g, ""); // 只取"&&"前的部分进行比较 
                // 更新或添加到maxUrlMap，确保储存的是url最大的项 
                if (!maxUrlMap.has(cleanedName) || parseInt(maxUrlMap.get(cleanedName).url) < parseInt(item.url)) {
                    maxUrlMap.set(cleanedName, item);
                }
            }); // 构建结果数组，直接使用maxUrlMap的值，这样可以保证name是原始的（包含"&&"后面的部分） 
            const result = Array.from(maxUrlMap.values());
            return result;
        }

        function Names(array) {
            const names = array.map(item => item.name.replace(/&&.*/g, ""));
            return new Set(names).size !== names.length;
        }
        //log(Names(dataArray)); // 输出: true，因为名字"Alice"重复了

        if (Names(dataArray) && getMyVar("pdfg") != "1") {
            return $(name.replace(/&&.*/g, "") + " - 名称已重复，建议修改名称，确认覆盖？").confirm((exname, dataArray, file) => {
                saveFile(file, JSON.stringify(exname(dataArray)));
                back(true);
                return "toast://保存成功！";
            }, exname, dataArray, file)
        } else {
            saveFile(file, JSON.stringify(exname(dataArray)));
            back(true);
            return "toast://保存成功！";
        }

        return "hiker://empty";
    }, file, Json),
    col_type: "text_4"
}, {
    title: "<br>",
    col_type: "rich_text"
});
setResult(d);