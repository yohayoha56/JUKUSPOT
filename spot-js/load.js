// 0.05秒ごとにsuper.soのドキュメント生成状況を確認する。ーーーーーーーーーーーー
function extractProperties() {
  return new Promise((resolve) => {
    const propertiesContainer = document.querySelector(".notion-page__properties");
    if (!propertiesContainer) {
      setTimeout(() => resolve(extractProperties()), 50);
    } else {
      const extractedProperties = get_properties()
      resolve(extractedProperties);
    }
  });
}

// ページプロパティの取得
function get_properties(){
  const properties = Array.from(propertiesContainer.children);
  const extractedProperties = properties.map((property) => {
      const propertyElement = property.querySelector(".notion-page__property-name > span");
      const propertyName = propertyElement ? propertyElement.innerText : "";
      const propertyContent = property.querySelector(".notion-property");
      // データがない場合「空」データを入れる。
      if (!propertyContent) {
          return {
              name: propertyName,
              data: ""
          };
      }
      // データがある場合はプロパティに合わせてデータを取得
      let propertyData;
      if (propertyContent.classList.contains("notion-property__rollup")) {
          propertyData = Array.from(propertyContent.children).map((child) => {
              const childData = Array.from(child.querySelectorAll(".notion-semantic-string > span")).map(
                  (content) => content.innerText
              );
              return childData;
          });
      } else if (propertyContent.classList.contains("notion-property__relation")) {
          propertyData = Array.from(propertyContent.querySelectorAll(".notion-semantic-string > span")).map((relation) =>
              relation.innerText.trim()
          );
      } else {
          propertyData = propertyContent.querySelector(".notion-semantic-string > span")?.innerText || "";
      }
      return {
          name: propertyName,
          data: propertyData,
      };
  });
  return extractedProperties;
}

// ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
// ここからはページプロパティの取得が出来次第実行する
extractProperties().then((extractedProperties) => {
  const newData = extractedProperties;

  // 全ページ共通のスクリプトとスタイルシートを読み込む
  const stylesheets = [
    'https://heys45.github.io/SAUCEED/spot-css/progressbar.css',
    'https://heys45.github.io/SAUCEED/spot-css/page_frame.css',
    'https://heys45.github.io/SAUCEED/spot-css/schedule_form.css',
    'https://heys45.github.io/SAUCEED/spot-css/schedule_table.css',
  ];
  stylesheets.forEach(loadStylesheet);

  const scripts = [
    'https://heys45.github.io/SAUCEED/spot-js/common.js',
    'https://heys45.github.io/SAUCEED/spot-js/debug.js',
  ];
  scripts.forEach(loadScript);

  // 教室ページのスクリプト読み込み
  if (newData["ページタイプ"] === "school") {
    const stylesheets2 = [
      'https://heys45.github.io/SAUCEED/spot-css/school.css',
    ];
    stylesheets2.forEach(loadStylesheet);

    const scripts2 = [
      'https://heys45.github.io/SAUCEED/spot-js/school_top.js',
      'https://heys45.github.io/SAUCEED/spot-js/schedule_get.js',
      'https://heys45.github.io/SAUCEED/spot-js/kintai_get.js',
      'https://heys45.github.io/SAUCEED/spot-js/form_control.js',
    ];
    scripts2.forEach(loadScript);
  }
});


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
