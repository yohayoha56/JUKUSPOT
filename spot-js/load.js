// const { redirect } = require("express/lib/response");

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
  

  if(newData["ページ表示名"]){
    let redata
    var targets = ["講師トップページ","講師スケジュール提出","講師シフト確定リスト","講師勤怠確認リスト","講師教室確認リスト","講師連絡確認リスト","講師プロフィール","講師よくある質問","講師シフト確定","講師勤怠確認","講師教室確認","講師連絡確認"];
    if(targets.includes(newData["ページ表示名"])){
      redata = {"redirectKey" : newData["会員ID"], "redirectTarget":"teacher"}
    }
    var targets = ["教室トップページ","教室シフト管理リスト","教室勤怠確認リスト","教室講師確認リスト","教室連絡確認リスト","教室プロフィール","教室よくある質問","教室シフト管理","教室勤怠管理","教室講師確認","教室連絡確認"];
    if(targets.includes(newData["ページ表示名"])){
      redata = {"redirectKey" : newData["教室ID"], "redirectTarget":"school"}
    }

    if (redata["redirectKey"]) {
      fetch("https://script.google.com/macros/s/AKfycbxRVM-fFhzJj5CLMH6LrF1FEaFkYUlMY7LxmV5MuqYp0hcFUryhFPS5DW0ciWx5djk/exec", {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(redata),
        mode: 'cors',
      })
      .then(response => response.text())
      .then(data => {
        window.location.href = data; // レスポンスのテキストを新しいURLとして設定
      });
    }
  }






  // URLの末尾指定
  let last_url = newData["ページタイプ"] == "school" ? "?juku-cr":"?koushi";
  let url = window.location.href;
  let baseUrl = url.split('?')[0]; // '?'を基にURLを分割し、その最初の部分（パラメータがない部分）を取得
  url = baseUrl + last_url ; // baseURLに新しいパラメータを追加
  window.history.pushState({}, '', url);
  

  // ヘッダーの画像生成
  let pc_logo_src = newData["ページタイプ"] == "school" ? 
    'https://heys45.github.io/jukust/logo2.png' : 'https://heys45.github.io/jukust/logo1.png';

  let sp_logo_src = newData["ページタイプ"] == "school" ? 
    'https://heys45.github.io/jukust/logo02.png' : 'https://heys45.github.io/jukust/logo01.png';

  let headerColor = newData["ページタイプ"] == "school" ? 
    "background-color:#33A614;color:white;":"";

  let headerTitle = newData["ページタイプ"] == "school" ? 
    `｜${newData["教室名"]}管理ページ`: `｜${newData["姓"]}${newData["名"]}先生マイページ`;

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
      <div class="super-navbar__actions ">
        <div id="hamburger-menu" style="font-size: 36px; margin-top: -14px;${headerColor}">
        <span>≡</span></div>
      </div>
    </nav>
  </div>
  `;
  let superHeader = document.querySelector(".super-navbar");
  superHeader.outerHTML = headerHTML;
  

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