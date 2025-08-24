let proxys = [
    "https://ghproxy.net/",
    "https://ghproxy.cc/",
    "https://ghp.ci/",
    "https://github.ednovas.xyz/",
    "https://gh-proxy.com/",
    "https://github.moeyy.xyz/",
    "https://gh.api.99988866.xyz/",
    "https://cf.ghproxy.cc/"
]
function shuffleArray(array) {
    array.sort(() => Math.random() - 0.5);
    return array;
}

function getproxy(proxys) {
    showLoading("查找中...");
    shuffleArray(proxys);
    let url = 'https://raw.githubusercontent.com/src48597962/hk/refs/heads/master/require.js';
    for(let i=0;i<proxys.length;i++){
        let content = fetch(proxys[i]+url, {timeout:5000});
        if (content && content.includes('relyfile')) {
            hideLoading();
            return proxys[i];
        }
    }
    hideLoading();
    return '';
}
