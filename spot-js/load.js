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


waitForProperties().then((propertiesContainer) => {
  // プロパティをnewDataに格納する
  newData = extractProperties(propertiesContainer);

  // 外部スクリプト読み込みの事前判定
  const debugUrls = ['dummy'];
  const currentUrl = window.location.href;
  const urlFound = debugUrls.some(debugUrl => currentUrl.includes(debugUrl));


  // ヘッダーの画像生成
  let pc_logo_src = newData["ページタイプ"] == "school" ? 
    'https://heys45.github.io/jukust/logo2.png' : 'https://heys45.github.io/jukust/logo1.png';

  let sp_logo_src = newData["ページタイプ"] == "school" ? 
    'https://heys45.github.io/jukust/logo02.png' : 'https://heys45.github.io/jukust/logo01.png';

  let headerColor = newData["ページタイプ"] == "school" ? 
    "background-color:#33A614;color:white;":"";

  let headerTitle = newData["ページタイプ"] == "school" ? 
    `｜${newData["教室名"]}管理ページ`: `｜${newData["姓"]}${newData["名"]}マイページ`;

  let headerHTML =`
  <div class="super-navbar minimal" style="position:sticky;${headerColor}">
    <nav aria-label="Main" data-orientation="horizontal" dir="ltr" class="super-navbar__content">
      <div class="notion-link super-navbar__logo">
        <div class="super-navbar__logo-image" style="display:flex;">
          <img id="pc_logo" src="${pc_logo_src}" style="width: 151px; height: 32px; position: relative;" alt="Logo" style="object-fit:contain;object-position:left">
          <img id="sp_logo" src="${sp_logo_src}" style="width: 32px; height: 32px; position: relative;" alt="Logo" style="object-fit:contain;object-position:left">
          <h1>${headerTitle}</h1>
        </div>
      </div>
      <div style="position:relative">
        <ul data-orientation="horizontal" class="super-navbar__item-list" dir="ltr"></ul>
      </div>
      <div class="super-navbar__actions "><a class="notion-link" target="_blank" rel="noopener noreferrer">
          <div class="super-navbar__cta">ページ更新</div>
        </a>
        <div class="hamburger-menu" style="font-size: 36px; margin-top: -14px; color: rgb(102, 102, 102);"><span>≡</span>
        </div>
      </div>
    </nav>
  </div>
  `;

  let superHeader = document.querySelector(".super-navbar");
  superHeader.outerHTML = headerHTML;


  // URLの末尾指定
  let last_url = newData["ページタイプ"] == "school" ? 
  "?juku-cr":"?teacher";

  let url = window.location.href;
  url += last_url ; // 'your_string' は追加したい任意の文字列です
  window.history.pushState({}, '', url);
  

  // 外部スクリプトの読み込み設定①
  const stylesheets = [
    'https://heys45.github.io/SAUCEED/spot-css/progressbar.css',
    'https://heys45.github.io/SAUCEED/spot-css/page_frame.css',
    'https://heys45.github.io/SAUCEED/spot-css/schedule_form.css',
    'https://heys45.github.io/SAUCEED/spot-css/spot_table.css',
    'https://heys45.github.io/SAUCEED/spot-css/spot_form.css',
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