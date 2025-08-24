// author@LoyDgIk
// 该插件仅供娱乐，是作者学习研究代码的副产物，插件可能纯在一些漏洞与不合理的设计，请谨慎用于实际项目。
// 已知问题，用弹窗播放视频链接，不会有播放记录。进入子页面有历史记录，但没有足迹。
//引入Java类
const XPopup = com.lxj.xpopup.XPopup;
const XPopupCallback = com.lxj.xpopup.interfaces.XPopupCallback;
const DetailUIHelper = com.example.hikerview.ui.detail.DetailUIHelper;
const DisplayUtil = com.example.hikerview.utils.DisplayUtil;
const ActivityManager = com.example.hikerview.ui.ActivityManager;
const R = com.example.hikerview.R;
const Integer = java.lang.Integer;
const ArrayList = java.util.ArrayList;
const Runnable = java.lang.Runnable;
const Bookmark = com.example.hikerview.model.Bookmark;

let BookmarkFolderPopup = com.example.hikerview.ui.home.view.BookmarkFolderPopup;

const InputPopup = com.example.hikerview.ui.view.popup.InputPopup
const ConfirmPopup = com.example.hikerview.ui.view.popup.ConfirmPopup;

const SettingMenuPopup = com.example.hikerview.ui.setting.SettingMenuPopup;
const OfficeItem = com.example.hikerview.ui.setting.office.OfficeItem;
const CustomBottomRecyclerViewPopup = com.example.hikerview.ui.view.CustomBottomRecyclerViewPopup;
const CustomCenterRecyclerViewPopup = com.example.hikerview.ui.view.CustomCenterRecyclerViewPopup;
const CustomRecyclerViewPopup = com.example.hikerview.ui.view.CustomRecyclerViewPopup;
const FileDetailPopup = com.example.hikerview.ui.setting.file.FileDetailPopup;
const CustomCopyPopup = com.example.hikerview.ui.view.CustomCopyPopup;
const CustomColorPopup = com.example.hikerview.ui.view.CustomColorPopup;
const Class = java.lang.Class;
const AutoImportHelper = com.example.hikerview.utils.AutoImportHelper;
const PageParser = com.example.hikerview.service.parser.PageParser;

const UrlDetector = com.example.hikerview.ui.browser.model.UrlDetector;
const PlayerChooser = com.example.hikerview.ui.video.PlayerChooser;
const VideoChapter = com.example.hikerview.ui.video.VideoChapter;
const FJSON = com.alibaba.fastjson.JSON;

const ToastMgr = com.example.hikerview.utils.ToastMgr;
const ChefSnackbar = com.example.hikerview.ui.view.toast.ChefSnackbar;
const ThreadTool = com.example.hikerview.utils.ThreadTool;
const AlertDialog = Packages.androidx.appcompat.app.AlertDialog;
const DialogUtil = com.example.hikerview.utils.view.DialogUtil;
const HeavyTaskUtil = com.example.hikerview.utils.HeavyTaskUtil;

const BiometricManager = Packages.androidx.biometric.BiometricManager;
const BiometricPrompt = Packages.androidx.biometric.BiometricPrompt;
const ContextCompat = Packages.androidx.core.content.ContextCompat;
const Build = android.os.Build;
let JSContext = org.mozilla.javascript.Context;
let JSContextVer = JSContext.getCurrentContext().getLanguageVersion();

if (typeof MY_RULE === "undefined") {
    MY_RULE = null;
}
if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
    throw Error("hikerPop只能在android8.0及以上运行");
}
//适配嗅觉浏览器
let cannotTouchUI = false;
if (typeof MY_NAME !== "undefined" && MY_NAME === "嗅觉浏览器") {
    cannotTouchUI = true;
    BookmarkFolderPopup = com.example.hikerview.ui.bookmark.BookmarkFolderPopup;
}

function getContext() {
    return typeof getCurrentActivity === "function" ? getCurrentActivity() : ActivityManager.getInstance().getCurrentActivity();
}
//获取上下文
const startActivity = getContext();

let useStartActivity = true;

function getArticleListFragment(activity) {
    //let activity = getCurrentActivity();    
    try {
        if (activity instanceof com.example.hikerview.ui.home.MainActivity) {
            let MainActivity = activity.getClass();
            let field = MainActivity.getDeclaredField("viewPagerAdapter");
            field.setAccessible(true);
            let viewPagerAdapter = field.get(activity);
            let articleListFragment = viewPagerAdapter.getClass().getMethod("getCurrentFragment").invoke(viewPagerAdapter);
            return articleListFragment || null;
        } else if (activity instanceof com.example.hikerview.ui.home.FilmListActivity) {
            let FilmListActivity = activity.getClass();
            let field = FilmListActivity.getDeclaredField("articleListFragment");
            field.setAccessible(true);
            let articleListFragment = field.get(activity);
            return articleListFragment;
        } else {
            return null;
        }
    } catch (e) {
        return null;
    }
}
const currentArticleListFragment = getArticleListFragment(startActivity);

function clickItem(af, position, url) {
    let click = af.getClass().getDeclaredMethod("clickItem", android.view.View, java.lang.Integer.TYPE, java.lang.String, java.lang.Boolean.TYPE, java.lang.String);
    click.setAccessible(true);
    click.invoke(af, null, java.lang.Integer.valueOf(position), url, true, "");
}


function getActivityContext() {
    return useStartActivity ? startActivity : getContext();
}

function setUseStartActivity(bool) {
    useStartActivity = !!bool;
    return this;
}

function newSimpleCallback({
    beforeDismiss,
    beforeShow,
    onBackPressed,
    onCreated,
    onDismiss,
    onDrag,
    onKeyBoardStateChanged,
    onShow
}) {
    return new XPopupCallback({
        beforeDismiss(basePopupView) {
            tryCallBack(beforeDismiss, [basePopupView], true);
        },
        beforeShow(basePopupView) {
            tryCallBack(beforeShow, [basePopupView], true);
        },
        onBackPressed(basePopupView) {
            if (typeof onBackPressed === "function") {
                return !!tryCallBack(onBackPressed, [basePopupView], true);
            } else {
                return false;
            }
        },
        onCreated(basePopupView) {
            tryCallBack(onCreated, [basePopupView], true);
        },
        onDismiss(basePopupView) {
            tryCallBack(onDismiss, [basePopupView], true);
        },
        onDrag(basePopupView, value, percent, upOrLeft) {
            tryCallBack(onDrag, [basePopupView, value, percent, upOrLeft], true);
        },
        onKeyBoardStateChanged(basePopupView, height) {
            tryCallBack(onKeyBoardStateChanged, [basePopupView, height], true);
        },
        onShow(basePopupView) {
            tryCallBack(onKeyBoardStateChanged, [basePopupView], true);
        }
    });
}

function getVideoChapter(playList) {
    let videoChapterClass = new VideoChapter().getClass();
    return FJSON.parseArray(JSON.stringify(playList), videoChapterClass);
}

function playVideos(playList, pos) {
    if (!Array.isArray(playList)) {
        if ($.type(playList) === "object") {
            playList = [playList];
        } else {
            return false;
        }
    }

    let videoChapter = getVideoChapter(playList);
    if (pos !== void 0 && pos >= 0 && pos < videoChapter.size()) {
        videoChapter.get(pos).setUse(true);
    }
    PlayerChooser.startPlayer(getActivityContext(), videoChapter);
    return true;
}

function toNextPage(url) {
    try {
        let rule = getParam("rule", "", url);
        if (!rule && MY_RULE) {
            url = buildUrl(url, {
                rule: MY_RULE.title
            });
        }
        if (Object.keys(AutoImportHelper).includes("lambda$couldCloudImport$2")) {
            AutoImportHelper.lambda$couldCloudImport$2(url);
        } else {
            let autoImportHelperClass = new AutoImportHelper().getClass();
            let couldCloudImportMethod = autoImportHelperClass.getDeclaredMethod("lambda$couldCloudImport$2", Class.forName("java.lang.String"));
            couldCloudImportMethod.setAccessible(true);
            couldCloudImportMethod.invoke(null, url);
        }
    } catch (e) {
        toast(e.toString());
    }
}

function toPalyPage(url, title) {
    try {
        PlayerChooser.startPlayer(getActivityContext(), title || url, url);
    } catch (e) {
        toast(e.toString());
    }
}

function throwError(e) {
    let message = "",
        lineNumber = -1;
    if (e instanceof Error) {
        message = e.message;
        lineNumber = e.lineNumber;
    } else {
        message = String(e);
    }
    log(message);
    setError("\n行数：" + lineNumber + "\n详情：" + message);
}

function tryNewCallBack(callBack, args, noDeal) {
    HeavyTaskUtil.executeNewTask(new Runnable({
        run() {
            try {
                checkJsVer();
                if (callBack == null) {
                    return;
                }
                args = args || [];
                let res = callBack.apply(null, args);
                if (noDeal) return;
                dealUrlSimply(res, args[0]);
            } catch (e) {
                throwError(e);
            }
        }
    }));
}

function runOnNewThread(func) {
    tryNewCallBack(func);
}

function tryCallBack(callBack, args, noDeal) {
    try {
        checkJsVer();
        if (callBack == null) {
            return;
        }
        args = args || [];
        let res = callBack.apply(null, args);
        //log(res)
        if (noDeal) return res;

        dealUrlSimply(res, args[0]);
    } catch (e) {
        throwError(e);
    }
}

function dealUrlSimply(url, title) {
    if (typeof url !== "string" || !url) return;
    if (currentArticleListFragment && typeof MY_POSITION !== "undefined" && MY_POSITION > -1) {
        clickItem(currentArticleListFragment, MY_POSITION, url);
    } else {
        if (PageParser.isPageUrl(url)) {
            return toNextPage(url);
        } else if (!DetailUIHelper.dealUrlSimply(getActivityContext(), null, MY_RULE, null, url || "", null, null) && UrlDetector.isVideoOrMusic(url)) {
            return toPalyPage(url, typeof title === "string" ? title : url);
        }
    }
}

function checkJsVer() {
    let cx = JSContext.getCurrentContext();
    if (!cx.getLanguageVersion()) {
        try {

        } catch (e) {
            log(e.toString())
        }
        cx.setLanguageVersion(JSContextVer);
    }
}

function getDefaultValue(v, type, defaultValue) {
    if ($.type(v) !== type) return defaultValue;
    return v || defaultValue;
}

function getNumberValue(v, func, defaultValue) {
    if (!($.type(v) === "number" || func(v))) return defaultValue;
    return v;
}

function getStringArray(arr, defaultValue) {
    if ($.type(arr) !== "array") return defaultValue;
    return arr.map(v => String(v));
}

function checkStringArray(arr) {
    arr.forEach((v, i) => arr[i] = String(v));
}

function getNumberArray(arr, defaultValue) {
    if ($.type(arr) !== "array") return defaultValue;
    return arr.map(v => Number(v) || 0);
}

function getBookList(arr) {
    let list = new ArrayList();
    for (let it of arr) {
        let bookmark = new Bookmark();
        bookmark.setTitle(it.title || "");
        bookmark.setDir(false);
        bookmark.setUrl(it.url || it.title || "");
        bookmark.setIcon(it.icon || "");
        list.add(bookmark);
    }
    return list;
}

function builderXPopup(context) {
    return new XPopup.Builder(context || getActivityContext())
        .borderRadius(DisplayUtil.dpToPx(getActivityContext(), 16));
}

function dpToPx(dp) {
    return DisplayUtil.dpToPx(getActivityContext(), dp);
}

function runOnUI(func) {
    ThreadTool.INSTANCE.runOnUI(new Runnable({
        run() {
            checkJsVer();
            try {
                func();
            } catch (e) {
                throwError(e);
            }
        }
    }));
}
const showOnUI = cannotTouchUI ? pop => runOnUI(() => pop.show()) : pop => pop.show();

function updateRecordsBottom(records) {
    const DefaultItemAnimator = Packages.androidx.recyclerview.widget.DefaultItemAnimator;
    const MyStatusBarUtil = com.example.hikerview.utils.MyStatusBarUtil;
    const UpdateRecordsAdapter = com.example.hikerview.ui.setting.updaterecords.UpdateRecordsAdapter;
    const GridLayoutManager = Packages.androidx.recyclerview.widget.GridLayoutManager;
    const RecordDetail = com.example.hikerview.ui.setting.updaterecords.RecordDetail;

    let myRecordDetail = new JavaAdapter(com.lxj.xpopup.core.BottomPopupView, {
        rules: [],
        getImplLayoutId() {
            return R.layout.activit_ad_list;
        },
        onCreate() {
            this.super$onCreate();
            let recyclerView = this.findViewById(R.id.ad_list_recycler_view);
            this.recyclerView = recyclerView;
            recyclerView.setItemAnimator(new DefaultItemAnimator());
            this.findViewById(R.id.ad_list_title_text).setText("更新日志");
            let button = this.findViewById(R.id.ad_list_add);
            button.setText("知道啦");
            button.setOnClickListener(() => {
                this.dismiss();
            });
            let statusBarHeight = MyStatusBarUtil.getStatusBarHeight(getActivityContext()) + DisplayUtil.dpToPx(getActivityContext(), 86);
            let findView2 = this.findViewById(R.id.ad_list_bg);
            //this.findView(0x7f0a007c).setOnClickListener(new -$.Lambda.UpdateRecordsActivity.RJCabNcRtjM6-f9zjjTJnyOIczg(this));
            let layoutParams = findView2.getLayoutParams();
            layoutParams.topMargin = statusBarHeight;
            findView2.setLayoutParams(layoutParams);

            this.adapter = new UpdateRecordsAdapter(getActivityContext(), this.rules);
            this.recyclerView.setLayoutManager(new GridLayoutManager(getActivityContext(), 1));
            this.recyclerView.setAdapter(this.adapter);
            try {
                for (let it of records) {
                    let recordDetail = new RecordDetail();
                    recordDetail.setType(1);
                    recordDetail.setDetail(String(it.title || ""));
                    this.rules.push(recordDetail);
                    for (let item of (it.records || [])) {
                        let recordDetail2 = new RecordDetail();
                        recordDetail2.setType(2);
                        recordDetail2.setDetail(String(item || ""));
                        this.rules.push(recordDetail2);
                    }
                }
            } catch (e) {
                log(e.toString());
                setError(e);
            }

        }
    }, getActivityContext());

    let pop = new builderXPopup().asCustom(myRecordDetail);
    showOnUI(pop);
    return pop;
}

function findRecyclerView(viewGroup) {
    for (let i = 0; i < viewGroup.getChildCount(); i++) {
        let child = viewGroup.getChildAt(i);
        let name = child.getClass().getSimpleName();

        if (name == "RecyclerView") {
            return child;
        }
        if (child instanceof android.view.ViewGroup) {
            let res;
            if ((res = findRecyclerView(child))) {
                return res;
            }
        }
    }
}


function selectAttachList(id, {
    click,
    options,
}) {
    if (typeof id !== "string" || !id) return null;
    options = getStringArray(options, []);
    let context = getActivityContext();
    let recyclerView = findRecyclerView(context.findViewById(android.R.id.content));
    //log(recyclerView===null);
    if (recyclerView == null) return null;
    let list = recyclerView.getAdapter().getList();
    let i = 0;
    let ii = -1
    for (let it of list) {
        if (id == it.getBaseExtra().getId()) {
            ii = i;
            break;
        }
        i++;
    }
    if (ii < 0) return null;
    let mg = recyclerView.getLayoutManager();

    let pop = builderXPopup(getContext())
        .atView(mg.getChildAt(ii))
        .asAttachList(options, null, (position, text) => {
            tryCallBack(getDefaultValue(click, "function", null), [text, position]);
        });
    showOnUI(pop);
    return pop;
}

function loading(title) {
    let pop = builderXPopup()
        .asLoading(getDefaultValue(title, "string", null), 0);
    showOnUI(pop);
    return pop;
}

function selectCenterMark({
    click,
    title,
    options,
    icons,
    noAutoDismiss,
    position
}) {
    options = getStringArray(options, []);
    icons = getNumberArray(icons, null);
    let pop = builderXPopup()
        .autoDismiss(!noAutoDismiss)
        .asCenterList(getDefaultValue(title, "string", null), options, icons, getNumberValue(position, v => v % 1 === 0 && v < options.length && v >= -1, -1), (index, value) => {
            tryCallBack(getDefaultValue(click, "function", null), [value, index]);
        });
    showOnUI(pop);
    return pop;
}

function selectBottomMark({
    click,
    title,
    options,
    icons,
    noAutoDismiss,
    position
}) {
    options = getStringArray(options, []);
    icons = getNumberArray(icons, null);
    let pop = builderXPopup()
        .moveUpToKeyboard(false)
        .autoDismiss(!noAutoDismiss)
        .asBottomList(getDefaultValue(title, "string", null), options, icons, getNumberValue(position, v => v % 1 === 0 && v < options.length && v >= -1, -1), (index, value) => {
            tryCallBack(getDefaultValue(click, "function", null), [value, index]);
        });
    showOnUI(pop);
    return pop;
}

function selectCenter({
    click,
    longClick,
    title,
    options,
    columns,
    position
}) {
    let clickListener = new CustomCenterRecyclerViewPopup.ClickListener({
        onLongClick(value, index) {
            tryCallBack(getDefaultValue(longClick, "function", null), [value, index]);
        },
        click(value, index) {
            tryCallBack(getDefaultValue(click, "function", null), [value, index]);
        }
    });
    options = getStringArray(options, []);
    let custom = new CustomCenterRecyclerViewPopup(getActivityContext())
        .withTitle(getDefaultValue(title, "string", "请选择"))
        .with(options, getDefaultValue(columns, "number", 3), clickListener);
    if (position !== void 0) {
        custom.withSelectedIndex(getNumberValue(position, v => v < options.length && v >= -1, -1));
    }
    let pop = builderXPopup()
        .asCustom(custom);
    showOnUI(pop);
    return pop;
}

function selectBottom({
    click,
    longClick,
    title,
    options,
    columns,
    height,
    noAutoDismiss,
}) {
    let clickListener = new CustomRecyclerViewPopup.ClickListener({
        onLongClick(value, index) {
            tryCallBack(getDefaultValue(longClick, "function", null), [value, index]);
        },
        click(value, index) {
            tryCallBack(getDefaultValue(click, "function", null), [value, index]);
        }
    });
    options = getStringArray(options, []);
    let custom = new CustomRecyclerViewPopup(getActivityContext())
        .withTitle(getDefaultValue(title, "string", "请选择"))
        .height(getNumberValue(height, v => v <= 1 && v > 0, 0.75))
        .dismissAfterClick(!noAutoDismiss).with(options, getDefaultValue(columns, "number", 3), clickListener);
    let pop = builderXPopup()
        .moveUpToKeyboard(false)
        .asCustom(custom);
    showOnUI(pop);
    return pop;
}

function IconExtraMenu(click) {
    this.create = function(parentView, args) {
        const Gravity = android.view.Gravity;
        const ImageView = android.widget.ImageView;
        const LinearLayout = android.widget.LinearLayout;

        let menuIcon = new ImageView(getActivityContext());
        let menuIconLayoutParams = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, 65);
        menuIconLayoutParams.gravity = Gravity.CENTER_VERTICAL;
        menuIconLayoutParams.setMargins(0, 0, 10, 0);
        menuIcon.setLayoutParams(menuIconLayoutParams);
        menuIcon.setId(R.id.menu_icon);
        menuIcon.setPadding(4, 4, 4, 4);
        //menuIcon.setVisibility(android.view.View.GONE);
        menuIcon.setImageResource(R.drawable.home_left_menu);
        if (typeof click === "function") {
            menuIcon.setOnClickListener(new android.view.View.OnClickListener({
                onClick() {
                    tryCallBack(click, args);
                }
            }));
        }

        return menuIcon;
    }
}

function selectCenterIcon({
    click,
    title,
    iconList,
    columns,
    position,
    extraMenu
}) {
    let clickListener = new BookmarkFolderPopup.ClickListener({
        onLongClick(value, index) {},
        click(value, index) {
            tryCallBack(getDefaultValue(click, "function", null), [value, index]);
        }
    });
    iconList = getDefaultValue(iconList, "array", []);
    iconList = getBookList(iconList);

    let custom = new BookmarkFolderPopup(getActivityContext())
        .withTitle(getDefaultValue(title, "string", "请选择"))
        .with(iconList, getDefaultValue(columns, "number", 2), clickListener);
    if (position !== void 0) {
        custom.withSelectedIndex(getNumberValue(position, v => v < iconList.size() && v >= -1, -1));
    }
    XPopup.setAnimationDuration(200);
    let pop = builderXPopup();
    if (extraMenu instanceof IconExtraMenu) {
        pop.setPopupCallback(newSimpleCallback({
            onCreated(basePopupView) {
                let linearLayout = basePopupView.getChildAt(0).getChildAt(0).getChildAt(0);
                try {
                    if (linearLayout) {
                        const LinearLayout = android.widget.LinearLayout;
                        let item = extraMenu.create(linearLayout, []);
                        linearLayout.addView(item);
                    }
                } catch (e) {
                    log(e.toString());
                }
            }
        }))
    }
    pop = pop.asCustom(custom);
    showOnUI(pop);
    return pop;
}

function inputTwoRow({
    title,
    titleHint,
    urlHint,
    titleDefault,
    urlDefault,
    confirm,
    cancel,
    hideCancel,
    noAutoSoft
}) {
    let okListener = new InputPopup.OkListener({
        ok(text1, text2) {
            tryCallBack(getDefaultValue(confirm, "function", null), [text1, text2]);
        }
    });
    let cancelListener = new InputPopup.CancelListener({
        cancel() {
            tryCallBack(getDefaultValue(cancel, "function", null));
        }
    });
    let custom = new InputPopup(getActivityContext())
        .bind(
            getDefaultValue(title, "string", "输入框"),
            getDefaultValue(titleHint, "string", null),
            getDefaultValue(titleDefault, "string", null),
            getDefaultValue(urlHint, "string", null),
            getDefaultValue(urlDefault, "string", null),
            okListener
        )
        .setCancelListener(cancelListener);
    let pop = builderXPopup()
        .autoOpenSoftInput(!noAutoSoft)
        .autoFocusEditText(!noAutoSoft);
    if (hideCancel) {
        pop.setPopupCallback(newSimpleCallback({
            onCreated(basePopupView) {
                let cancelTextView = basePopupView.findViewById(R.id.tv_cancel);
                if (cancelTextView) {
                    cancelTextView.setVisibility(8);
                }
                let dividerView = basePopupView.findViewById(R.id.xpopup_divider_h);
                if (dividerView) {
                    dividerView.setVisibility(8);
                }
            }
        }));
    }
    pop = pop
        .asCustom(custom);
    showOnUI(pop);
    return pop;
}

function inputAutoRow({
    title,
    hint,
    confirm,
    cancel,
    okTitle,
    cancelTitle,
    defaultValue,
    hideCancel,
    noAutoSoft
}) {
    let okListener = new ConfirmPopup.OkListener({
        ok(text) {
            tryCallBack(getDefaultValue(confirm, "function", null), [text]);
        },
        cancel() {
            tryCallBack(getDefaultValue(cancel, "function", null));
        }
    });
    let custom = new ConfirmPopup(getActivityContext()).bind(getDefaultValue(title, "string", "输入框"), getDefaultValue(hint, "string", ""), okListener)
        .setBtn(getDefaultValue(okTitle, "string", "确认"), getDefaultValue(cancelTitle, "string", "取消"));
    let pop = builderXPopup()
        .autoOpenSoftInput(!noAutoSoft)
        .autoFocusEditText(!noAutoSoft);

    pop.setPopupCallback(newSimpleCallback({
        onCreated(basePopupView) {
            defaultValue = getDefaultValue(defaultValue, "string", null);
            if (defaultValue) {
                let titleEdit = basePopupView.findViewById(R.id.edit_title);
                if (titleEdit) {
                    titleEdit.setText(defaultValue);
                }
            }
            if (hideCancel) {
                let cancelTextView = basePopupView.findViewById(R.id.tv_cancel);
                if (cancelTextView) {
                    cancelTextView.setVisibility(8);
                }
                let dividerView = basePopupView.findViewById(R.id.xpopup_divider_h);
                if (dividerView) {
                    dividerView.setVisibility(8);
                }
            }
        }
    }));

    pop = pop
        .asCustom(custom);
    showOnUI(pop);
    return pop;
}

function inputConfirm({
    title,
    content,
    defaultValue,
    hint,
    confirm,
    cancel,
    textarea,
    maxTextarea,
    hideCancel,
    noAutoSoft
}) {
    let pop = builderXPopup()
        .autoOpenSoftInput(!noAutoSoft)
        .autoFocusEditText(!noAutoSoft);
    if (hideCancel) {
        pop.setPopupCallback(newSimpleCallback({
            onCreated(basePopupView) {
                let cancelTextView = basePopupView.findViewById(R.id.tv_cancel);
                if (cancelTextView) {
                    cancelTextView.setVisibility(8);
                }
                let dividerView = basePopupView.findViewById(R.id.xpopup_divider2);
                if (dividerView) {
                    dividerView.setVisibility(8);
                }
            }
        }));
    }
    pop = pop.asInputConfirm(getDefaultValue(title, "string", null), getDefaultValue(content, "string", null), getDefaultValue(defaultValue, "string", null), getDefaultValue(hint, "string", null), (text) => {
        tryCallBack(getDefaultValue(confirm, "function", null), [text]);
    }, (text) => {
        tryCallBack(getDefaultValue(cancel, "function", null), [text]);
    }, maxTextarea ? R.layout.xpopup_confirm_input_max : (textarea ? R.layout.xpopup_confirm_input : 0));
    showOnUI(pop);
    return pop;
}

function confirm({
    title,
    content,
    confirm,
    cancel,
    okTitle,
    cancelTitle,
    hideCancel
}) {
    let pop = builderXPopup()
        .asConfirm(getDefaultValue(title, "string", null), getDefaultValue(content, "string", ""), getDefaultValue(cancelTitle, "string", "取消"), getDefaultValue(okTitle, "string", "确认"), () => {
            tryCallBack(getDefaultValue(confirm, "function", null));
        }, () => {
            tryCallBack(getDefaultValue(cancel, "function", null));
        }, !!hideCancel);
    showOnUI(pop);
    return pop;
}

function SettingItem(...arr) {
    if (arr.length === 0) return new OfficeItem("");
    else if (arr.length === 1) return new OfficeItem(String(arr[0]));
    else if (arr.length === 2 && typeof arr[1] === "boolean") return new OfficeItem(String(arr[0]), arr[1] ? 1 : -1);
    else if (arr.length === 2) return new OfficeItem(String(arr[0]), String(arr[1]));
    else if (arr.length === 3) return new OfficeItem(String(arr[0]), arr[1] ? 1 : -1, String(arr[2]));
}

function selectBottomSettingMenu({
    click,
    options,
    onDismiss
}) {
    let onItemClickListener = new SettingMenuPopup.OnItemClickListener({
        onClick(str, officeItem, consumer) {
            tryCallBack(getDefaultValue(click, "function", null), [str, officeItem, () => consumer.accept(officeItem)]);
        }
    });
    options = options.filter(v => v instanceof OfficeItem);
    let arrayList = new ArrayList();
    options.forEach(v => arrayList.add(v));

    let custom = new SettingMenuPopup(getActivityContext(), "设置", arrayList, null, onItemClickListener);
    let pop = builderXPopup()
        .moveUpToKeyboard(false)
        .setPopupCallback(newSimpleCallback({
            onDismiss() {
                tryCallBack(onDismiss);
            }
        }))
        .asCustom(custom);
    showOnUI(pop);
    return pop;
}
 
selectBottomSettingMenu.SettingItem = SettingItem;


function ResExtraInputBox({
    hint,
    click,
    title,
    onChange,
    defaultValue,
    titleVisible
}) {
    let search;
    let edit;
    this.create = function(parentView, args) {
        args = Array.isArray(args) ? args : [];
        let inputItem = android.view.LayoutInflater.from(getActivityContext()).inflate(R.layout.item_input, parentView, false);
        search = inputItem.findViewById(R.id.search);
        edit = inputItem.findViewById(R.id.edit);
        let clearBtn = inputItem.findViewById(R.id.clearBtn);
        let divider = inputItem.findViewById(R.id.divider);
        let pop_input_edit_bg = inputItem.findViewById(R.id.pop_input_edit_bg);
        let search_suggest = inputItem.findViewById(R.id.search_suggest);
        if (typeof title === "string" && title) {
            search.setText(title);
        } else {
            search.setText("确定");
        }
        if (typeof titleVisible === "boolean" && !titleVisible) {
            search.setText("");
            search.setPadding(0, 0, 0, 0);
            search.setVisibility(4);
            divider.setVisibility(4);
        }
        if (typeof click === "function") {
            search.setOnClickListener(new android.view.View.OnClickListener({
                onClick() {
                    tryCallBack(click, [String(edit.getText())].concat(args));
                }
            }));
        }

        if (typeof hint === "string" && hint) {
            edit.setHint(hint);
        }

        if (typeof onChange === "function") {
            edit.addTextChangedListener(new android.text.TextWatcher({
                onTextChanged() {},
                beforeTextChanged() {},
                afterTextChanged(s) {
                    let text;
                    if (s) {
                        text = String(s.toString());
                        tryCallBack(onChange, [text].concat(args), true);
                    }
                }
            }));
        }
        if (typeof defaultValue === "string") {
            edit.setText(defaultValue);
            let len = defaultValue.length;
            edit.setSelection(len, len);
        }
        return inputItem;
    }
    this.setTitle = (title) => {
        if (search && typeof title === "string") {
            search.setText(title);
        }
    }
    this.setDefaultValue = (defaultValue) => {
        if (edit && typeof defaultValue === "string") {
            edit.setText(defaultValue);
            let len = defaultValue.length;
            edit.setSelection(len, len);
        }
    }
    this.setHint = (hint) => {
        if (edit && typeof hint === "string" && hint) {
            edit.setHint(hint);
        }
    }
}

function selectBottomResIcon({
    click,
    menuClick,
    title,
    iconList,
    columns,
    height,
    noAutoDismiss,
    extraInputBox,
    position,
    toPosition,
    beforeShow
}) {
    let clickListener = new CustomCenterRecyclerViewPopup.ClickListener({
        onLongClick(value, index) {},
        click(value, index) {}
    });
    iconList = getDefaultValue(iconList, "array", []);
    let booksList = getBookList(iconList);
    let rv = null,
        tv = null;

    let scrollToPosition = (pos, isScroll) => {
        if (typeof pos === "number" && rv && pos < booksList.length && pos >= -1) {
            if (isScroll) {
                rv.smoothScrollToPosition(pos);
            } else {
                rv.scrollToPosition(pos);
            }
        }
    };
    let setTitle = title => {
        if (tv) tv.setText(String(title)); 
    }
    let custom = new CustomBottomRecyclerViewPopup(getActivityContext())
        .withTitle(getDefaultValue(title, "string", "请选择"))
        .withHeight(getNumberValue(height, v => v <= 1 && v > 0, 0.75))
        .dismissWhenClick(!noAutoDismiss)
        .with([], getDefaultValue(columns, "number", 2), clickListener)
        .withOnCreateCallback((basePopupView) => {
            try {
                let recyclerView = basePopupView.findViewById(R.id.recyclerView);
                tv = custom.findViewById(R.id.title);
                let linearLayout;
                if (recyclerView) {
                    rv = recyclerView;
                    recyclerView.setAdapter(iconAdapter);
                    Packages.androidx.core.view.ViewCompat.setBackground(recyclerView, Packages.androidx.core.content.ContextCompat.getDrawable(getActivityContext(), R.drawable.bg_round_all_rice));
                }
                if (recyclerView && (linearLayout = recyclerView.getParent()) && extraInputBox instanceof ResExtraInputBox) {
                    let inputItem = extraInputBox.create(linearLayout, [resOptionsManage]);
                    let params = inputItem.getLayoutParams();
                    params.setMargins(35, 0, 35, 0);
                    inputItem.setLayoutParams(params);
                    linearLayout.addView(inputItem, 1);
                }
                scrollToPosition(toPosition);
            } catch (e) {
                log(e.toString());
            }
        });
    let iconAdapter = new com.example.hikerview.ui.home.view.BookmarkFolderAdapter(getActivityContext(), booksList, (v, i) => {
        let item = booksList.get(i);
        let items = {
            icon: String(item.getIcon()),
            title: String(item.getTitle())
        };
        let func = () => tryCallBack(getDefaultValue(click, "function", null), [items, Number(i), resOptionsManage]);
        if (noAutoDismiss) {
            func();
        } else {
            custom.dismissWith(func);
        }
    }, false);
    iconAdapter.setSelectedIndex(getNumberValue(position, v => v < iconList.length && v >= -1, -1));
    let resOptionsManage = {
        setTitle: setTitle,
        scrollToPosition: scrollToPosition,
        getSize: () => Number(booksList.length),
        change(list, position) {
            booksList.length = 0;
            Object.assign(booksList, getBookList(list));
            if (position !== void 0) {
                iconAdapter.setSelectedIndex(getNumberValue(position, v => v < iconList.length && v >= -1, -1));
            }
            iconAdapter.notifyDataSetChanged();
        },
        setSelectedIndex(position) {
            iconAdapter.setSelectedIndex(getNumberValue(position, v => v < iconList.length && v >= -1, -1));
            iconAdapter.notifyDataSetChanged();
        },
        removed(pos) {
            if (pos >= booksList.size()) {
                throw new Error("pos大于列表长度");
            }
            iconAdapter.notifyItemRemoved(pos);
        },
        changeColumns: custom.changeSpanCount.bind(custom)
    }
    if (typeof menuClick === "function") {
        custom.withMenu(new android.view.View.OnClickListener({
            onClick() {
                tryCallBack(getDefaultValue(menuClick, "function", null), [resOptionsManage]);
            }
        }));
    }
    let pop = builderXPopup();
    pop.setPopupCallback(newSimpleCallback({
        beforeShow(basePopupView) {
            scrollToPosition(toPosition);
            tryCallBack(getDefaultValue(beforeShow, "function", null), [pop, resOptionsManage]);
        }
    }));
    pop = pop.moveUpToKeyboard(false).asCustom(custom);
    showOnUI(pop);
    return pop;
}

function selectBottomRes({
    click,
    longClick,
    menuClick,
    title,
    options,
    columns,
    height,
    noAutoDismiss,
    extraInputBox,
    toPosition,
    beforeShow
}) {
    let clickListener = new CustomCenterRecyclerViewPopup.ClickListener({
        onLongClick(value, index) {
            tryCallBack(getDefaultValue(longClick, "function", null), [value, index, resOptionsManage]);
        },
        click(value, index) {
            tryCallBack(getDefaultValue(click, "function", null), [value, index, resOptionsManage]);
        }
    });
    const list = getStringArray(options, []);
    let rv = null,
        tv = null;
    let scrollToPosition = (pos, isScroll) => {
        if (typeof pos === "number" && rv && pos < list.length && pos >= -1) {
            if (isScroll) {
                rv.smoothScrollToPosition(pos);
            } else {
                rv.scrollToPosition(pos);
            }
        }
    };
    let setTitle = title => {
        if (tv) tv.setText(String(title));
    }
    let custom = new CustomBottomRecyclerViewPopup(getActivityContext())
        .withTitle(getDefaultValue(title, "string", "请选择"))
        .withHeight(getNumberValue(height, v => v <= 1 && v > 0, 0.75))
        .dismissWhenClick(!noAutoDismiss)
        .with(list, getDefaultValue(columns, "number", 2), clickListener)
        .withOnCreateCallback((basePopupView) => {
            let recyclerView = basePopupView.findViewById(R.id.recyclerView);
            rv = recyclerView;
            tv = custom.findViewById(R.id.title);
            let linearLayout;
            if (recyclerView && (linearLayout = recyclerView.getParent()) && extraInputBox instanceof ResExtraInputBox) {

                let inputItem = extraInputBox.create(linearLayout, [resOptionsManage]);
                let params = inputItem.getLayoutParams();
                params.setMargins(35, 0, 35, 0);
                inputItem.setLayoutParams(params);
                linearLayout.addView(inputItem, 1);
            }
        });
    let resOptionsManage = {
        list: list,
        setTitle: setTitle,
        scrollToPosition: scrollToPosition,
        change() {
            checkStringArray(list);
            custom.notifyDataChange();
        },
        removed(pos) {
            checkStringArray(list);
            if (pos >= list.length) {
                throw new Error("pos大于列表长度");
            }
            custom.notifyDataRemoved(pos);
        },
        changeColumns: custom.changeSpanCount.bind(custom)
    }
    if (typeof menuClick === "function") {
        custom.withMenu(new android.view.View.OnClickListener({
            onClick() {
                tryCallBack(getDefaultValue(menuClick, "function", null), [resOptionsManage]);
            }
        }));
    }
    let pop = builderXPopup();
    pop.setPopupCallback(newSimpleCallback({
        beforeShow(basePopupView) {
            scrollToPosition(toPosition);
            tryCallBack(getDefaultValue(beforeShow, "function", null), [pop, resOptionsManage]);
        }
    }));
    pop = pop.moveUpToKeyboard(false).asCustom(custom);
    showOnUI(pop);
    return pop;
}

function infoBottom({
    title,
    options,
    click,
    longClick
}) {
    let clickListener = new com.example.hikerview.ui.setting.file.FileDetailAdapter.OnClickListener({
        click(value) {
            tryCallBack(getDefaultValue(click, "function", null), [value]);
        },
        longClick(view, value) {
            tryCallBack(getDefaultValue(longClick, "function", null), [value]);
        }
    });

    let custom = new FileDetailPopup(
            getActivityContext(),
            getDefaultValue(title, "string", null),
            getStringArray(options, [])
        )
        .withClickListener(clickListener);
    let pop = builderXPopup()
        .moveUpToKeyboard(false)
        .asCustom(custom);
    showOnUI(pop);
    return pop;
}

function copyBottom(title, content) {
    if (cannotTouchUI) return null;
    let custom = new CustomCopyPopup(getActivityContext())
        .with(
            getDefaultValue(title, "string", null),
            getDefaultValue(content, "string", ""),
        );
    let pop = builderXPopup()
        .moveUpToKeyboard(false)
        .asCustom(custom);
    showOnUI(pop);
    return pop;
}

function selectCenterColor(colors, callBack) {
    if (typeof colors === "function") {
        callBack = colors;
    }
    colors = getStringArray(colors, []);
    let custom = new CustomColorPopup(getActivityContext());
    custom.setColorSelect(new CustomColorPopup.OnColorSelect({
        select(value) {
            tryCallBack(getDefaultValue(callBack, "function", null), [value]);
        }
    }));
    let pop = builderXPopup()
        .setPopupCallback(newSimpleCallback({
            onCreated(basePopupView) {
                const count = colors.length > 8 ? 8 : colors.length;
                for (let i = 0; i < count; i++) {
                    if (colors[i]) {
                        let color = android.graphics.Color.parseColor(colors[i]);
                        let relativeLayout = basePopupView.findViewById(R.id["color" + (i + 1) + "_bg"]);
                        relativeLayout.setTag(colors[i]);
                        relativeLayout.getChildAt(0).setCardBackgroundColor(color);
                        relativeLayout.getChildAt(1).setTextColor(color);
                    }
                }
            }
        }))
        .asCustom(custom);
    showOnUI(pop);
    return pop;
}

function chefSnackbarMake({
    content,
    duration,
    confirm,
    cancel,
    okTitle,
    cancelTitle
}) {
    let decorView = getContext().getWindow().getDecorView();
    ChefSnackbar.Companion.make(decorView)
        .setText(getDefaultValue(content, "string", ""))
        .setDuration(getDefaultValue(okTitle, "number", 0))
        .setAction(getDefaultValue(okTitle, "string", "确认"), function() {
            tryCallBack(getDefaultValue(confirm, "function", null));
        })
        .setCancelButton(getDefaultValue(cancelTitle, "string", "取消"), function() {
            tryCallBack(getDefaultValue(cancel, "function", null));
        })
        .show();
}

function toastMeg(text, type) {
    switch (type) {
        case toastMeg.LC:
            ToastMgr.longCenter(getContext(), String(text));
            break;
        case toastMeg.SC:
            ToastMgr.shortCenter(getContext(), String(text));
            break;
        case toastMeg.LB:
            ToastMgr.longBottomCenter(getContext(), String(text));
            break;
        case toastMeg.SC:
        default:
            ToastMgr.shortBottomCenter(getContext(), String(text));
            break;
    }
}
toastMeg.LC = 1;
toastMeg.SC = 2;
toastMeg.LB = 3;
toastMeg.SB = 4;

function getClipTopData() {
    try {
        const Context = android.content.Context;
        const context = getContext();
        let clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE);
        let clipData = clipboard.getPrimaryClip();
        if (clipData != null && clipData.getItemCount() > 0) {
            let text = clipData.getItemAt(0).getText();
            if (text != null) {
                return String(text.toString());
            }
        }
        return "";
    } catch (e) {
        log(e.toString());
        return "";
    }
}

function confirmSync({
    title,
    content,
    okTitle,
    cancelTitle,
    hideCancel,
    noDismissOnBack,
    noDismissOnBlank
}) {
    let countDownLatch = new java.util.concurrent.CountDownLatch(1);
    let result = false;
    showOnUI(
        builderXPopup()
        .dismissOnTouchOutside(!noDismissOnBlank)
        .dismissOnBackPressed(!noDismissOnBack)
        .setPopupCallback(newSimpleCallback({
            onDismiss(basePopupView) {
                countDownLatch.countDown();
            }
        }))
        .asConfirm(getDefaultValue(title, "string", null), getDefaultValue(content, "string", ""), getDefaultValue(cancelTitle, "string", "取消"), getDefaultValue(okTitle, "string", "确认"), () => {
            result = true;
        }, () => {
            result = false;
        }, !!hideCancel)
    );
    countDownLatch.await();
    return result;
}

function inputConfirmSync({
    title,
    content,
    defaultValue,
    hint,
    textarea,
    maxTextarea,
    hideCancel,
    noAutoSoft,
    noDismissOnBack,
    noDismissOnBlank
}) {
    let countDownLatch = new java.util.concurrent.CountDownLatch(1);
    let result = "";
    showOnUI(
        builderXPopup()
        .autoOpenSoftInput(!noAutoSoft)
        .autoFocusEditText(!noAutoSoft)
        .dismissOnTouchOutside(!noDismissOnBlank)
        .dismissOnBackPressed(!noDismissOnBack)
        .setPopupCallback(newSimpleCallback({
            onCreated(basePopupView) {
                if (hideCancel) {
                    let cancelTextView = basePopupView.findViewById(R.id.tv_cancel);
                    if (cancelTextView) {
                        cancelTextView.setVisibility(8);
                    }
                    let dividerView = basePopupView.findViewById(R.id.xpopup_divider2);
                    if (dividerView) {
                        dividerView.setVisibility(8);
                    }
                }
            },
            onDismiss(basePopupView) {
                countDownLatch.countDown();
            }
        }))
        .asInputConfirm(getDefaultValue(title, "string", null), getDefaultValue(content, "string", null), getDefaultValue(defaultValue, "string", null), getDefaultValue(hint, "string", null), (text) => {
            result = text;
        }, null, maxTextarea ? R.layout.xpopup_confirm_input_max : (textarea ? R.layout.xpopup_confirm_input : 0))
    );
    countDownLatch.await();
    return result;
}

function dialogShowOnUI(dialogBuilder, callBack) {
    runOnUI(() => {
        let dialog = dialogBuilder.create();
        DialogUtil.INSTANCE.showAsCard(getActivityContext(), dialog);
        if (callBack) {
            callBack(dialog);
        }

    });
}

function setAlertDialogButton({
    rightTitle,
    rightClick,
    leftTitle,
    leftClick,
    centerTitle,
    centerClick
}, dialogBuilder, getParam) {
    if (rightTitle || rightClick) {
        rightClick = getDefaultValue(rightClick, "function", null);
        dialogBuilder.setPositiveButton(getDefaultValue(rightTitle, "string", "确认"), (dialog) => {
            tryCallBack(rightClick, getParam(dialog));
        });
    }
    if (leftTitle || leftClick) {
        leftClick = getDefaultValue(leftClick, "function", null);
        dialogBuilder.setNeutralButton(getDefaultValue(leftTitle, "string", "忽略"), (dialog) => {
            tryCallBack(leftClick, getParam(dialog));
        });
    }
    if (centerTitle || centerClick) {
        centerClick = getDefaultValue(centerClick, "function", null);
        dialogBuilder.setNegativeButton(getDefaultValue(centerTitle, "string", "取消"), (dialog) => {
            tryCallBack(centerClick, getParam(dialog));
        });
    }
}

function setAlertDialogButtonTitle({
    rightTitle,
    rightClick,
    leftTitle,
    leftClick,
    centerTitle,
    centerClick
}, dialogBuilder) {
    if (rightTitle || rightClick) {
        dialogBuilder.setPositiveButton(getDefaultValue(rightTitle, "string", "确认"), null);
    }
    if (leftTitle || leftClick) {
        dialogBuilder.setNeutralButton(getDefaultValue(leftTitle, "string", "忽略"), null);
    }
    if (centerTitle || centerClick) {
        dialogBuilder.setNegativeButton(getDefaultValue(centerTitle, "string", "取消"), null);
    }
}

function setAlertDialogButtonFunc({
    rightTitle,
    rightClick,
    leftTitle,
    leftClick,
    centerTitle,
    centerClick
}, dialog, getParam) {
    const DialogInterface = android.content.DialogInterface;
    if (rightTitle || rightClick) {
        rightClick = getDefaultValue(rightClick, "function", null);
        dialog.getButton(DialogInterface.BUTTON_POSITIVE).setOnClickListener(() => {
            tryCallBack(rightClick, getParam(dialog));
        });
    }
    if (leftTitle || leftClick) {
        leftClick = getDefaultValue(leftClick, "function", null);
        dialog.getButton(DialogInterface.BUTTON_NEUTRAL).setOnClickListener(() => {
            tryCallBack(leftClick, getParam(dialog));
        });
    }
    if (centerTitle || centerClick) {
        centerClick = getDefaultValue(centerClick, "function", null);
        dialog.getButton(DialogInterface.BUTTON_NEGATIVE).setOnClickListener(() => {
            tryCallBack(centerClick, getParam(dialog));
        });
    }
}

function multiChoice({
    title,
    options,
    checkedIndexs,
    noAutoDismiss,
    onChoice,
}) {
    options = getStringArray(options, []);
    checkedIndexs = getDefaultValue(checkedIndexs, "array", []);
    let checkedItems = new Array(options.length).fill(false);
    checkedIndexs.forEach(i => checkedItems[i] = true);
    checkedItems.length = options.length;
    onChoice = getDefaultValue(onChoice, "function", null);
    let setItemChecked = (dialog, newcheckedIndexs) => {
        if (!Array.isArray(newcheckedIndexs)) return;

        checkedItems.fill(false);
        newcheckedIndexs.forEach(i => checkedItems[i] = true);

        let listView = dialog.getListView();

        for (let i = 0; i < options.length; i++) {
            listView.setItemChecked(i, checkedItems[i]);
        }
        listView.getAdapter().notifyDataSetChanged();
    };
    let dialogBuilder = new AlertDialog.Builder(getActivityContext())
        .setTitle(getDefaultValue(title, "string", null))
        .setMultiChoiceItems(options, checkedItems, (v, i, b) => {
            checkedItems[i] = b;
            tryCallBack(onChoice, [i, b]);
        });

    if (noAutoDismiss) {
        setAlertDialogButtonTitle(arguments[0], dialogBuilder);
        dialogShowOnUI(dialogBuilder, (dialog) => {
            setAlertDialogButtonFunc(arguments[0], dialog, () => [options, checkedItems, setItemChecked.bind(null, dialog), dialog.dismiss.bind(dialog)]);
        });
    } else {
        setAlertDialogButton(arguments[0], dialogBuilder, () => [options, checkedItems]);
        dialogShowOnUI(dialogBuilder);
    }
}

function getSeekAndLayout(max, pos, onChange) {
    const Bundle = android.os.Bundle;
    const LinearLayout = android.widget.LinearLayout;
    const SeekBar = android.widget.SeekBar;
    const TextView = android.widget.TextView;
    const Gravity = android.view.Gravity;
    const View = android.view.View;
    const LayoutParams = android.view.ViewGroup.LayoutParams;
    const RelativeLayout = android.widget.RelativeLayout;
    const ImageView = android.widget.ImageView;
    const Spanned = android.text.Spanned;
    const Html = android.text.Html;
    let linearLayout = new LinearLayout(getActivityContext());
    linearLayout.setOrientation(LinearLayout.VERTICAL);
    linearLayout.setLayoutParams(new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT));
    linearLayout.setPadding(65, 50, 60, 50);

    let titleStart = new TextView(getActivityContext());
    titleStart.setId(View.generateViewId());
    titleStart.setLayoutParams(new LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT));
    titleStart.setTextSize(17);
    titleStart.setPadding(0, 0, 0, 20);
    let initText = tryCallBack(onChange, [pos, max, Html.fromHtml], true);
    if (typeof initText === "string" || initText instanceof Spanned) {
        titleStart.setText(initText);
    }
    let relativeLayout = new RelativeLayout(getActivityContext());
    relativeLayout.setLayoutParams(new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT));

    let startImgStart = new ImageView(getActivityContext());
    startImgStart.setId(View.generateViewId());
    startImgStart.setLayoutParams(new LayoutParams(32, 32));
    startImgStart.setPadding(4, 4, 4, 4);
    startImgStart.setImageResource(R.drawable.ic_arrow_start);

    let startImgEnd = new ImageView(getActivityContext());
    startImgEnd.setId(View.generateViewId());
    startImgEnd.setLayoutParams(new LayoutParams(32, 32));
    startImgEnd.setPadding(4, 4, 4, 4);
    startImgEnd.setImageResource(R.drawable.ic_arrow_end);

    let seekBar = new SeekBar(getActivityContext());
    seekBar.setLayoutParams(new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT));
    seekBar.setMax(max);
    seekBar.setProgress(pos);

    linearLayout.addView(titleStart);
    linearLayout.addView(relativeLayout);

    let layoutParams = new RelativeLayout.LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT);
    layoutParams.addRule(RelativeLayout.CENTER_VERTICAL, RelativeLayout.TRUE);
    startImgStart.setLayoutParams(layoutParams);
    relativeLayout.addView(startImgStart);

    layoutParams = new RelativeLayout.LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT);
    layoutParams.addRule(RelativeLayout.ALIGN_PARENT_END, RelativeLayout.TRUE);
    layoutParams.addRule(RelativeLayout.CENTER_VERTICAL, RelativeLayout.TRUE);
    startImgEnd.setLayoutParams(layoutParams);
    relativeLayout.addView(startImgEnd);

    layoutParams = new RelativeLayout.LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT);
    layoutParams.addRule(RelativeLayout.END_OF, startImgStart.getId());
    layoutParams.addRule(RelativeLayout.START_OF, startImgEnd.getId());
    layoutParams.addRule(RelativeLayout.CENTER_VERTICAL, RelativeLayout.TRUE);
    seekBar.setLayoutParams(layoutParams);
    relativeLayout.addView(seekBar);

    startImgStart.setOnClickListener(() => {
        let progress = seekBar.getProgress();
        if (progress <= 0 || progress > max) {
            return;
        }
        seekBar.setProgress(progress - 1);
    });
    startImgEnd.setOnClickListener(() => {
        let progress = seekBar.getProgress();
        if (progress < 0 || progress >= max) {
            return;
        }
        seekBar.setProgress(progress + 1);
    });
    seekBar.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener({
        onProgressChanged(seekBar, progress, fromUser) {
            let res = tryCallBack(onChange, [progress, max, Html.fromHtml], true);
            if (typeof res === "string" || initText instanceof Spanned) {
                titleStart.setText(res);
            }
        },
        onStartTrackingTouch(seekBar) {},
        onStopTrackingTouch(seekBar) {}
    }));
    return [seekBar, linearLayout];
}

function seekCenter({
    title,
    max,
    pos,
    onChange,
}) {
    max = parseInt(max), pos = parseInt(pos) || 0;
    if (!max || max < pos || pos < 0) {
        throw Error("max和pos必须为整数，且max>0,max>=pos>=0");
    }
    let builder = new AlertDialog.Builder(getActivityContext());
    builder.setTitle(getDefaultValue(title, "string", null));
    let [seekBar, linearLayout] = getSeekAndLayout(max, pos, onChange);
    setAlertDialogButton(arguments[0], builder, () => [Number(seekBar.getProgress()), max]);
    builder.setView(linearLayout);
    dialogShowOnUI(builder);
}

function canBiometric() {
    return Number(BiometricManager.from(getActivityContext()).canAuthenticate())
}

function checkByBiometric(success) {
    if (typeof success !== "function") return;
    let can = canBiometric();
    if (can !== 0) return can;
    runOnUI(() => {
        com.example.hikerview.ui.setting.office.MoreSettingOfficer.INSTANCE.checkByBiometric(getActivityContext(), () => {
            tryCallBack(success, [], true);
        });
    });
}


function decodeQRCode(path) {
    let result = null;
    try {
        let bitmap = android.graphics.BitmapFactory.decodeFile(path);
        if (bitmap == null) return result;
        let hints = new java.util.Hashtable();
        let width = bitmap.getWidth();
        let height = bitmap.getHeight();
        let pixels = java.lang.reflect.Array.newInstance(java.lang.Class.forName("java.lang.Integer"), width * height);
        pixels = java.util.Arrays.stream(pixels).mapToInt(v => 0).toArray();
        bitmap.getPixels(pixels, 0, width, 0, 0, width, height);
        let source = new com.google.zxing.RGBLuminanceSource(width, height, pixels);
        let binaryBitmap = new com.google.zxing.BinaryBitmap(new com.google.zxing.common.HybridBinarizer(source));
        let decodedResult = new com.google.zxing.MultiFormatReader().decode(binaryBitmap, hints);
        result = String(decodedResult.getText());
    } catch (e) {}
    return result;
}


$.exports = {
    confirm,
    inputAutoRow,
    inputConfirm,
    selectCenter,
    selectCenterMark,
    selectBottom,
    selectBottomMark,
    IconExtraMenu,
    selectCenterIcon,
    inputTwoRow,
    selectBottomSettingMenu,
    selectBottomRes,
    ResExtraInputBox,
    infoBottom,
    copyBottom,
    selectCenterColor,
    confirmSync,
    inputConfirmSync,
    icon: R.drawable,
    chefSnackbarMake,
    toastMeg,
    playVideos,
    getClipTopData,
    multiChoice,
    seekCenter,
    setUseStartActivity,
    runOnNewThread,
    runOnUIThread: runOnUI,
    canBiometric,
    checkByBiometric,
    decodeQRCode,
    selectAttachList,
    selectBottomResIcon,
    updateRecordsBottom
};