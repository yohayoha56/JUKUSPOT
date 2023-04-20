// 0.05秒ごとにsuper.soのドキュメント生成状況を確認する。
function waitForProperties() {
  return new Promise((resolve) => {
    const propertiesContainer = document.querySelector(".notion-page__properties");
    if (!propertiesContainer) {
      setTimeout(() => resolve(waitForProperties()), 50);
    } else {
      resolve(propertiesContainer);
    }
  });
}


waitForProperties().then((propertiesContainer) => {
  // プロパティをnewDataに格納する
  newData = extractProperties(propertiesContainer);
  console.log(newData)
  // 共通スタイルシートとスクリプトを読み込む
  const commonStylesheets = [
    'https://heys45.github.io/SAUCEED/spot-css/progressbar.css',
    'https://heys45.github.io/SAUCEED/spot-css/page_frame.css',
    'https://heys45.github.io/SAUCEED/spot-css/schedule_form.css',
    'https://heys45.github.io/SAUCEED/spot-css/schedule_table.css',
  ];
  commonStylesheets.forEach(loadStylesheet);

  const commonScripts = [
    'https://heys45.github.io/SAUCEED/spot-js/common.js',
    'https://heys45.github.io/SAUCEED/spot-js/debug.js',
  ];
  commonScripts.forEach(loadScript);

  // 教室ページ用のスタイルシートとスクリプトを読み込む
  console.log(newData["ページタイプ"])
  if (newData["ページタイプ"] === "school") {
    console.log("ページタイプ：school")
    const schoolStylesheets = [
      'https://heys45.github.io/SAUCEED/spot-css/school.css',
    ];
    schoolStylesheets.forEach(loadStylesheet);

    const schoolScripts = [
      'https://heys45.github.io/SAUCEED/spot-js/school_top.js',
      'https://heys45.github.io/SAUCEED/spot-js/schedule_get.js',
      'https://heys45.github.io/SAUCEED/spot-js/kintai_get.js',
      'https://heys45.github.io/SAUCEED/spot-js/form_control.js',
    ];
    schoolScripts.forEach(loadScript);
  }else{
    console.log("ページタイプ：not-school")
  }
});


// ここからはページプロパティを取得するスクリプトーーーーーーーーーーーーーーーーーーーー
function extractProperties(propertiesContainer) {
  const properties = Array.from(propertiesContainer.children);
  let newData = {};
  properties.forEach((property) => {
    const propertyElement = property.querySelector(".notion-page__property-name > span");
    const propertyName = propertyElement ? propertyElement.innerText : "";
    const propertyContent = property.querySelector(".notion-property");

    if (!propertyContent) {
      newData[propertyName] = "";
    } else {
      let propertyData; 

      if (propertyContent.classList.contains("notion-property__rollup")) {
        propertyData = Array.from(propertyContent.children).map((child) => {
          return Array.from(child.querySelectorAll(".notion-semantic-string > span")).map(
            (content) => content.innerText
          );
        });
      } else if (propertyContent.classList.contains("notion-property__relation")) {
        propertyData = Array.from(propertyContent.querySelectorAll(".notion-semantic-string > span")).map((relation) =>
          relation.innerText.trim()
        );
      } else {
        propertyData = propertyContent.querySelector(".notion-semantic-string > span")?.innerText || "";
      }

      newData[propertyName] = propertyData;
    }
  });

  return newData;
}


// ここからはCSSとJSを読み込むためのスクリプトーーーーーーーーーーーーーーーーーーーーー
// 外部CSSの読み込み
function loadStylesheet(url) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = url;
  document.head.appendChild(link);
}
// 外部JSの読み込み
function loadScript(url) {
  const script = document.createElement('script');
  script.defer = true;
  script.src = url;
  document.body.appendChild(script);
}
