// 定义Aquarius对象，包含主要功能
const Aquarius = {
    d: [], // 数据数组，用于存储界面元素
    author: "Aries", // 作者信息
    version: "20250825", // 版本号

    // 依赖提取函数，用于从字符串中提取{}内的内容
    rely: (data) => {
        return data.match(/\{([\s\S]*)\}/)[0].replace(/\{([\s\S]*)\}/, '$1')
    },

    // 主界面函数
    home: () => {
        var d = Aquarius.d;

        // GitHub API 相关处理
        if (!storage0.getItem('githubapi')) {
            let github_url = 'https://api.github.com';
            let github_data = JSON.parse(fetch(github_url)).data;
            storage0.setItem('githubapi', github_data)
        }
        if (getMyVar('github_url') == '') {
            for (let item of storage0.getItem('githubapi')) {
                let data = JSON.parse(fetch(item, {
                            withStatusCode: true,
                            timeout: 5000,
                        }));
                if (data.statusCode == 200) {
                    putMyVar('github_url', item + '/');
                    break;
                }
            }
        }

        // 获取配置文件
        var config = JSON.parse(fetch(getMyVar('github_url') + base64Decode('aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3l1YW53YW5nb2trLTEvSGlLZXIvcmVmcy9oZWFkcy9tYWluL0hpa2VyL1NvdXJjZS8') + MY_RULE.title + '_config.txt'));
        var enable = config.enable;
        var enableUpdate = config.enableUpdate;
        var ver = config.version;

        // 检查是否启用
        if (enable == "0") {
            d.push({
                title: "跑路了",
                url: $().lazyRule(() => {
                    return "toast://跑路了"
                }),
                col_type: "text_center_1"
            })
            setResult(d);
        }

        // 强制更新检查
        if (ver != Aquarius.version && enableUpdate == "1") {
            showLoading('检测到新版本，更新中...')
            writeFile('hiker://files/rules/Aquarius/' + MY_RULE.title + '.js', fetch(getMyVar('github_url') + base64Decode('aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3l1YW53YW5nb2trLTEvSGlLZXIvcmVmcy9oZWFkcy9tYWluL0hpa2VyL1NvdXJjZS8') + MY_RULE.title + '.js'));
            java.lang.Thread.sleep(2000);
            hideLoading();
            toast('更新完成！');
            refreshPage();
        }

        // 获取剪贴板内容函数（代码来自：云盘君.简）
        function getClipboardText() {
            try {
                const Context = android.content.Context;
                const context = getCurrentActivity();
                // 获取系统剪贴板
                let clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE);
                // 返回数据
                let clipData = clipboard.getPrimaryClip();
                if (clipData != null && clipData.getItemCount() > 0) {
                    // 从数据集中获取（粘贴）第一条文本数据
                    let text = clipData.getItemAt(0).getText();
                    if (text != null) {
                        return String(text.toString());
                    }
                }
                return null;
            } catch (e) {
                return null;
            }
        }

        // 检查剪贴板内容
        let text = getClipboardText() || "";
        let url = (text.includes("￥base64") || text.includes("￥home_rule") || text.trim().startsWith("云")) ? text : "";
        if (url) {
            d.push({
                title: "检测到剪贴板含有小程序是否导入?\n" + url,
                img: "hiker://images/icon_cloud6",
                url: $("#noLoading#").lazyRule((input) => {
                    updateItem("code", {
                        extra: Object.assign(findItem("code").extra, {
                            defaultValue: input.toString()
                        })
                    })
                    return "hiker://empty";
                }, url),
                col_type: "text_icon"
            });
        }

        // 添加类型和模式选择按钮
        d.push({
            title: "类型：" + getItem("typeName", "默认"),
            url: $().lazyRule(() => {
                return "toast://暂不可用";
            }),
            col_type: "icon_2_round",
            pic_url: "hiker://images/icon_menu6",
            extra: {
                id: "yunType"
            }
        }, {
            title: "模式：" + getItem("filterName", "解密"),
            url: "select://" + JSON.stringify({
                title: "过滤模式设置",
                options: ["模式：加密", "模式：解密"],
                col: 2,
                js: $.toString(() => {
                    input = input.replace("模式：", "");
                    if (input == "加密") {
                        setItem("model", "jiami")
                        setItem("filterName", "加密")
                    } else if (input == "解密") {
                        setItem("model", "解密");
                        setItem("filterName", "解密")
                    }
                    updateItem("filterType", {
                        title: "模式：" + input
                    });
                })
            }),
            col_type: "icon_2_round",
            pic_url: "hiker://images/icon_setting6",
            extra: {
                id: "filterType"
            }
        });

        // 本地文件选择器
        d.push({
            title: "选择文件",
            url: $.toString(() => {
                eval($.require("Aquarius").rely($.require("Aquarius").fileSelect));
                return "fileSelect://" + fileSelect(input);
            }),
            col_type: "input",
            desc: "请选择文件",
            extra: {
                id: "fileSelect",
                onChange: $.toString(() => {
                    putMyVar("fileSelect", input);
                }),
                defaultValue: getMyVar("fileSelect", "/storage/emulated/0/"),
                backgroundColor: "#666666"
            }
        });

        // 代码输入和输出区域
        d.push({
            title: "Code",
            url: "",
            col_type: "input",
            desc: "请输入需要解析的规则",
            extra: {
                id: "code",
                type: "textarea",
                highlight: true,
                onChange: $.toString(() => {
                    putMyVar("code", input);
                }),
                defaultValue: getMyVar("code")
            }
        }, {
            title: "encode",
            url: "",
            col_type: "input",
            desc: "此处显示解析后的规则",
            extra: {
                id: "encode",
                type: "textarea",
                highlight: true,
                titleVisible: false,
                onChange: $.toString(() => {
                    putMyVar("encode", input);
                }),
                defaultValue: getMyVar("encode")
            }
        });

        // 转换按钮
        d.push({
            title: "转换",
            url: $().lazyRule(() => {
                try {
                    var code = getMyVar("code");
                    var encode = "";
                    if (code == null || code == "") {
                        return "toast://请输入需要解析的规则！";
                    }
                    // 支持远程url及本地url
                    if (code.startsWith("http://") || code.startsWith("https://") || code.startsWith("file://") || code.startsWith("/storage") || code.startsWith("/sdcard") || code.startsWith("hiker://files")) {
                        if (code.startsWith("/storage") || code.startsWith("/sdcard")) {
                            code = "file://" + code;
                        }
                        code = fetch(code);
                    }
                    // 使用更完善的判断方式
                    if (code.trim().startsWith("云")) {
                        code = parsePaste(code);
                    }
                    if (code.startsWith("[") && code.endsWith("]")) {
                        return "toast://不支持合集解密";
                    }
                    eval($.require("Aquarius").rely($.require("Aquarius").ruleJiexi));
                    encode = jiexi(code);
                    encode = updateRule(encode);
                    // 优化显示效果 返回string证明未解析
                    if (typeof(encode) == "string") {
                        encode = "海阔视界￥home_rule￥" + encode;
                    }
                    // 返回object类型证明解析过了是json 需要转为字符串
                    if (typeof(encode) == "object") {
                        encode = "海阔视界￥home_rule￥" + JSON.stringify(encode);
                    }
                    // 返回解析后的数据
                    updateItem("encode", {
                        extra: Object.assign(findItem("encode").extra, {
                            defaultValue: encode
                        })
                    })
                    return "toast://解析成功"
                } catch (e) {
                    // 错误提示
                    updateItem("encode", {
                        extra: Object.assign(findItem("encode").extra, {
                            defaultValue: "请检查规则是否正确\n默认模式不支持解析合集\n错误信息：" + e
                        })
                    })
                    return "hiker://empty";
                }
            }),
            col_type: "text_2",
            extra: {
                id: "enbutton"
            }
        });

        // 导入按钮
        d.push({
            title: "导入",
            url: $("#noLoading#").lazyRule(() => {
                var encode = getMyVar("encode");
                if (!encode) {
                    return "toast://内容为空"
                }
                if (encode.startsWith("hiker://")) {
                    encode = "海阔视界首页频道规则￥home_rule_url￥" + encode;
                }
                return "rule://" + base64Encode(encode);
            }),
            col_type: "text_2"
        });

        // 上传到云剪贴板
        d.push({
            title: "上传到云剪贴板",
            url: "select://" + JSON.stringify({
                title: "云剪贴板列表",
                options: getPastes(),
                col: 2,
                js: $.toString(() => {
                    var encode = getMyVar("encode");
                    if (encode) {
                        var encode = encode.replace("海阔视界￥home_rule￥", "");
                        var title = JSON.parse(encode).title;
                        // 优化显示内容
                        encode = "海阔视界规则分享，当前分享的是：小程序￥home_rule_v2￥base64://@" + title + "@" + base64Encode(encode);
                        if (input == "云剪贴板2" && encode.length >= 200000) {
                            return "toast://云剪贴2不支持超过20万字符"
                        }
                        var url = sharePaste(encode, input);
                        return "copy://" + url + "\n\n小程序：" + title;
                    } else {
                        return "toast://内容为空"
                    }
                })
            }),
            col_type: "text_2",
            extra: {
                id: "copy"
            }
        }, {
            title: "清空",
            url: $("#noLoading#").lazyRule(() => {
                updateItem("code", {
                    extra: Object.assign(findItem("code").extra, {
                        defaultValue: ""
                    })
                });
                updateItem("encode", {
                    extra: Object.assign(findItem("encode").extra, {
                        defaultValue: ""
                    })
                });
                updateItem("fileSelect", {
                    extra: Object.assign(findItem("fileSelect").extra, {
                        defaultValue: "/storage/emulated/0/"
                    })
                });
                return "toast://已清空"
            }),
            col_type: "text_2"
        });

        // 选择我的小程序
        d.push({
            title: "选择我的小程序",
            url: $("#noLoading#").lazyRule(() => {
                // 获取所有小程序列表
                let ruleName = [];
                let rules = JSON.parse(fetch("hiker://home"));
                rules.forEach((rule) => {
                    var title = rule.title;
                    // 过滤掉我的主页
                    if (title != "我的主页") {
                        ruleName.push(title);
                    }
                })
                return "select://" + JSON.stringify({
                    title: "我的小程序",
                    options: ruleName,
                    col: 2,
                    js: $.toString(() => {
                        var rule = "海阔视界￥home_rule￥" + fetch("hiker://home@" + input)
                            updateItem("code", {
                                extra: Object.assign(findItem("code").extra, {
                                    defaultValue: rule
                                })
                            })
                            return "toast://已选择" + input
                    })
                })
            }),
            col_type: "text_2"
        }, {
            title: "保存到本地",
            url: $("#noLoading#").lazyRule(() => {
                var encode = getMyVar("encode");
                if (!encode) {
                    return "toast://内容为空"
                }
                // 检测海阔标识头
                if (encode.startsWith("海阔视界￥home_rule￥")) {
                    var title = encode.replace("海阔视界￥home_rule￥", "");
                    title = JSON.parse(title).title
                        saveFile("hiker://files/share/" + title + ".hiker", encode, 0);
                    return "share://hiker://files/share/" + title + ".hiker"
                }
                return "toast://不要什么都乱保存啊！"
            }),
            col_type: "text_2",
            extra: {
                id: "saveFile"
            }
        });

        setResult(d);
    },

    // 文件选择功能
    fileSelect: $.toString(() => {
        function fileSelect(input) {
            updateItem("fileSelect", {
                extra: Object.assign(findItem("fileSelect").extra, {
                    defaultValue: input
                })
            })
            var code = readFile(input, 0);
            if (/^海阔视界.*\￥home_rule(_v2)?\￥/.test(code)) {
                updateItem("code", {
                    extra: Object.assign(findItem("code").extra, {
                        defaultValue: code
                    })
                })
            } else {
                updateItem("code", {
                    extra: Object.assign(findItem("code").extra, {
                        defaultValue: input
                    })
                })
            }
        }
    }),

    // AES加密工具
    AESUtils: $.toString(() => {
        const CIPHER_ALGORITHM = 'AES/ECB/PKCS5Padding';
        const DEFAULT_VALUE = '0';
        const SECRET_KEY_LENGTH = 32;
        const CHARSET_UTF8 = 'utf-8';
        eval(getCryptoJS());

        // 加密函数
        function encrypt(secretKey, data) {
            try {
                const key = getSecretKey(secretKey);
                const cipher = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(data), key, {
                    mode: CryptoJS.mode.ECB,
                    padding: CryptoJS.pad.Pkcs7
                });
                return base64Encode(cipher.ciphertext);
            } catch (e) {
                handleException(e);
                return null;
            }
        };

        // 解密函数
        function decrypt(secretKey, base64Data) {
            try {
                const key = getSecretKey(secretKey);
                const decodedData = base64Decode(base64Data);
                const cipherParams = CryptoJS.lib.CipherParams.create({
                    ciphertext: CryptoJS.enc.Hex.parse(decodedData.toString(CryptoJS.enc.Hex))
                });
                const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
                    mode: CryptoJS.mode.ECB,
                    padding: CryptoJS.pad.Pkcs7
                });
                return decrypted.toString(CryptoJS.enc.Utf8);
            } catch (e) {
                handleException(e);
                return null;
            }
        };

        // 获取密钥
        function getSecretKey(secretKey) {
            return CryptoJS.enc.Utf8.parse(toMakeKey(secretKey, SECRET_KEY_LENGTH, DEFAULT_VALUE));
        };

        // 生成密钥
        function toMakeKey(secretKey, length, text) {
            if (secretKey.length >= length) {
                return secretKey;
            }
            let paddedKey = secretKey;
            while (paddedKey.length < length) {
                paddedKey += text;
            }
            return paddedKey;
        };

        // Base64解码
        function base64Decode(data) {
            return CryptoJS.enc.Base64.parse(data);
        };

        // Base64编码
        function base64Encode(data) {
            return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Hex.parse(data.toString()));
        };

        // 异常处理
        function handleException(e) {
            console.error("Error: ", e);
        };
    }),

    // 规则解析功能
    ruleJiexi: $.toString(() => {
        // 解析小程序规则
        function jiexi(code) {
            var jsonCode = "";
            var ruleCode = "";
            try {
                // 兼容不存在海阔口令的小程序规则
                if (!/^(\{.*\})$/.test(code)) {
                    // 验证小程序版本及规则是否正确
                    var home_rule_version = code.match(/￥(\S*)￥/)[1];
                    if (home_rule_version == "") {
                        return "toast://请输入正确的规则"
                    }
                    // home_rule好像是明文
                    if (home_rule_version == "home_rule") {
                        // 去除海阔标识头
                        var ruleHeader = code.match(/海阔视界.*?￥home_rule￥/)[0];
                        code = code.replace(ruleHeader, "");
                    }
                    // home_rule_v2是base64加密规则
                    if (home_rule_version == "home_rule_v2") {
                        var codes = code.split("base64://");
                        code = codes[1];
                        var codeTitle = code.match(/^@(.*)@/)[0];
                        code = code.replace(codeTitle, "");
                        code = base64Decode(code);
                    }
                }
                ruleCode = code;
            } catch (e) {
                // 报错证明数据不是字符串类型需要转字符串查找违禁词
                ruleCode = JSON.stringify(code);
            }
            try {
                // 获取规则的json数据
                jsonCode = JSON.parse(code);
            } catch (e) {
                // 报错证明本来就是json类型
                jsonCode = code;
            }
            // 返回解析后的数据
            return jsonCode;
        }

        // 过滤违禁词
        function updateRule(jsonCode) {
            eval($.require("Aquarius").rely($.require("Aquarius").filterReplace));
            // 设定需要解密的节点
            var codeRule = ["find_rule", "searchFind", "detail_find_rule", "sdetail_find_rule", "preRule"]
            codeRule.forEach(s => {
                jsonCode[s] = replaceCode(jsonCode[s]);
            })
            // 对比其他页面中的代码违禁词
            var pageList = jsonCode.pages;
            // 兼容部分情况本就是json格式的规则
            try {
                pageList = JSON.parse(pageList);
            } catch (e) {
                pageList = jsonCode.pages;
            }
            if (pageList) {
                pageList.forEach((page) => {
                    // 对比其他页面中的代码违禁词
                    var pageRule = page.rule;
                    page.rule = replaceCode(pageRule);
                });
                jsonCode.pages = pageList;
            }
            // 返回过滤后的数据
            return jsonCode;
        }
    }),

    // 过滤替换功能
    filterReplace: $.toString(() => {
        function replaceCode(code) {
            if (getItem("model", "jiemi") == "jiami") {
                return jiamiCode(code);
            } else if ("model", "jiemi" == "jiemi") {
                return jiemiCode(code);
            }
        }

        // 加密代码
        function jiamiCode(code) {
            eval($.require("Aquarius").rely($.require("Aquarius").AESUtils));
            if (code != null && code != "") {
                // 转为字符串
                code = code.toString();
                // 解密规则
                var key = "hk6666666109";
                code = code.replace("js:", "");
                code = encrypt(key, code);
                code = "js:\nevalPrivateJS(\"" + code + "\");";
                return code;
            }
        }

        // 解密代码
        function jiemiCode(code) {
            eval($.require("Aquarius").rely($.require("Aquarius").AESUtils));
            if (code != null && code != "") {
                // 转为字符串
                code = code.toString();
                // 解密规则
                var code2 = "";
                var key = "hk6666666109"
                    // 尝试解密多层加密数据
                    do {
                        // 重构加解密算法
                        if (/evalPrivateJS\(['"]([^"']+)['"]\)/.test(code)) {
                            var c2 = code.match(/evalPrivateJS\(['"]([^"']+)['"]\)/)[1];
                            var yc2 = code.match(/evalPrivateJS\(['"]([^"']+)['"]\);?/)[0];
                            c2 = decrypt(key, c2);
                            code = code.replace(yc2, c2);
                        }
                    } while (/evalPrivateJS\(['"]([^"']+)['"]\)/.test(code))
                    return code;
            }
        }
    })
}

// 导出Aquarius对象
$.exports = Aquarius
