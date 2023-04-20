// 外部CSSの読み込みーーーーーーーーーーーーーーーーーーーーーーーーーーー

function loadStylesheet(url) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = url;
    document.head.appendChild(link);
}
// CSS読み込みの順番大事。　★先に表示を整えてからマージンを解除している。
const stylesheets = [
  'https://heys45.github.io/SAUCEED/spot-css/progressbar.css',
  'https://heys45.github.io/SAUCEED/spot-css/page_frame.css',
  'https://heys45.github.io/SAUCEED/spot-css/schedule_form.css',
  'https://heys45.github.io/SAUCEED/spot-css/schedule_table.css',
];
stylesheets.forEach((url) => loadStylesheet(url));


// 教室用JS
var stylesheets2 =[];
if(newData["ページタイプ"]="school"){
stylesheets2 = [
  'https://heys45.github.io/SAUCEED/spot-css/school.css',
];
}
stylesheets.forEach((url) => loadStylesheet(url));


// 外部JSの読み込みーーーーーーーーーーーーーーーーーーーーーーーーーーー
function loadScript(url, delay) {
  setTimeout(() => {
    var script = document.createElement('script');
    script.defer = true;
    script.src = url;
    document.body.appendChild(script);
  }, delay);
}

// 共通JS
const scripts = [
  'https://heys45.github.io/SAUCEED/spot-js/common.js',
  'https://heys45.github.io/SAUCEED/spot-js/debug.js',
];

scripts.forEach((url) => loadScript(url,2000));

// 教室用JS
var scripts2 =[];
if(newData["ページタイプ"]="school"){
scripts2 = [
  'https://heys45.github.io/SAUCEED/spot-js/school_top.js',
  'https://heys45.github.io/SAUCEED/spot-js/schedule_get.js',
  'https://heys45.github.io/SAUCEED/spot-js/kintai_get.js',
  'https://heys45.github.io/SAUCEED/spot-js/form_control.js',
];
}
scripts2.forEach((url) => loadScript(url,3000));