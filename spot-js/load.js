waitForProperties().then((propertiesContainer) => {
  // プロパティをnewDataに格納する
  newData = extractProperties(propertiesContainer);

  // 外部スクリプト読み込みの事前判定
  const debugUrls = ['dummy'];
  const currentUrl = window.location.href;
  const urlFound = debugUrls.some(debugUrl => currentUrl.includes(debugUrl));

  // 外部スクリプトの読み込み設定①
  const stylesheets = [
    'https://heys45.github.io/SAUCEED/spot-css/progressbar.css',
    'https://heys45.github.io/SAUCEED/spot-css/page_frame.css',
    'https://heys45.github.io/SAUCEED/spot-css/schedule_form.css',
    'https://heys45.github.io/SAUCEED/spot-css/spot_table.css',
    ...(newData["ページタイプ"] === "school" ? [//教室ページのみ
    ] : []),
  ];
  
  // 外部スクリプトの読み込み設定②
  const scripts = [
    'https://heys45.github.io/SAUCEED/spot-js/form_common.js',
    'https://heys45.github.io/SAUCEED/spot-js/page_top.js',
    'https://heys45.github.io/SAUCEED/spot-js/page_shift.js',
    'https://heys45.github.io/SAUCEED/spot-js/page_call.js',
    ...(newData["ページタイプ"] === "school" ? [
    ] : []),
    ...(urlFound ? [//デバッグページの場合には読み込む
    'https://heys45.github.io/SAUCEED/spot-js/debug.js',
  ] : [])
  ];

  // 外部スクリプトの読み込み（JSのみ非同期で読み込み）
  stylesheets.forEach(loadStylesheet);
  (async function loadScriptsInOrder() {
    for (const scriptUrl of scripts) {
      await loadScript(scriptUrl);
    }
  })();
});

// 0.05秒ごとにsuper.soのドキュメント生成状況を確認ーーーーーーーーーーーーーーーーーー
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
        propertyData = Array.from(propertyContent.children).flatMap((child) => {
          // ロールアップの子要素がタイトルの場合
          if (child.classList.contains("notion-property")) {
            return Array.from(child.querySelectorAll(".notion-semantic-string .notion-semantic-string > span")).map(
              (content) => content.innerText
            );
          // ロールアップの子要素がタイトル以外の場合
          } else {
            return Array.from(child.querySelectorAll(".notion-semantic-string > span")).map(
              (content) => content.innerText
            );
          }
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
  newData["名前"] = document.getElementsByTagName("h1")[0];
  return newData;
}
// ここからはCSSとJSを読み込むためのスクリプトーーーーーーーーーーーーーーーーーーーーー
function loadStylesheet(url) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = url;
  document.head.appendChild(link);
}
// loadScript関数にPromiseを返すように変更
function loadScript(url) {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.defer = true;
    script.src = url;
    script.onload = () => resolve();
    document.body.appendChild(script);
  });
}