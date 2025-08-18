const hhlz = {
    d: [],
    version: '0',
    home: () => {
        var d = hhlz.d;
        d.push({
            title:'已跑路，请自行删除',
            url:'hiker://empty',
            col_type:'text_center_1'
        })
        setResult(d)
    }
}
$.exports = hhlz
