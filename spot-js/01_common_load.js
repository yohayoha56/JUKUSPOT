// const { redirect } = require("express/lib/response");

function waitForProperties() {
  let timeoutId;
  return new Promise((resolve, reject) => {
    const checkProperties = () => {
      const propertiesContainer = document.querySelector(".notion-page__properties");
      if (propertiesContainer) {
        clearTimeout(timeoutId);  // 成功したらタイムアウトをクリアします
        resolve(propertiesContainer);
      } else if (!timeoutId) {  // timeoutId が未設定ならタイムアウトを設定します
        timeoutId = setTimeout(() => reject('timeout'), 3000);
      } else {  // それ以外の場合は再試行を続けます
        setTimeout(checkProperties, 50);
      }
    };
    checkProperties();
  });
}

function handleTimeout() {
  // タイムアウトが発生したときに実行する処理をここに書きます
  console.log("Time out occurred!");

  //新しいデータオブジェクトを作成する
  let newData2 = {};
  let scriptElement = document.getElementById("__NEXT_DATA__");
  let jsonText = scriptElement.textContent || scriptElement.innerText;
  let jsonData = JSON.parse(jsonText);
  let firstBlock = Object.values(jsonData.props.pageProps.records.block)[0];
  let propertySort = firstBlock.propertySort;
  let propertyValues = firstBlock.propertyValues;
  for (let prop of propertySort) {
    // propertySortのnameをkey、propertyでpropertyValuesを検索したものをvalueとして新しいデータを作成する
    newData2[prop.name] = propertyValues[prop.property];
  }
  console.log(newData2)

}


let paramsID, paramsP;
waitForProperties().then((propertiesContainer) => {
  // プロパティをnewDataに格納する
  newData = extractProperties(propertiesContainer);

  // リダイレクト用スクリプトーーーーーーーーーーーーーーーーーーーーー
  async function checkRedirect(newData) {
    let redata;
    var targets = ["講師トップページ", "講師スケジュール提出", "講師シフト確定リスト", "講師勤怠確認リスト", "講師教室確認リスト", "講師連絡確認リスト", "講師プロフィール", "講師よくある質問", "講師シフト確定", "講師勤怠確認", "講師教室確認", "講師連絡確認"];
    if (targets.includes(newData["ページ表示名"])) {
      redata = {
        "redirectKey": newData["会員ID"],
        "redirectTarget": "teacher"
      }
    }
    var targets = ["教室トップページ", "教室シフト管理リスト", "教室勤怠確認リスト", "教室講師確認リスト", "教室連絡確認リスト", "教室プロフィール", "教室よくある質問", "教室シフト管理", "教室勤怠管理", "教室講師確認", "教室連絡確認"];
    if (targets.includes(newData["ページ表示名"])) {
      redata = {
        "redirectKey": newData["教室ID"],
        "redirectTarget": "school"
      }
    }
  
    if (redata["redirectKey"]) {
      const response = await fetch("https://script.google.com/macros/s/AKfycbzf92xEy7MxA4rYnF7ClvNv7Dy3oyQPvrnbD-w-us8yzys1qT5BZNP1EMdyVgXSwM6gmQ/exec", {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(redata),
        mode: 'cors',
      });
  
      const data = await response.text();
      window.location.href = data; 
    }
  }
  if (newData["ページ表示名"]) { checkRedirect(newData);}
  // リダイレクト用スクリプト（終わり）ーーーーーーーーーーーーーーーー

  let last_url = newData["ページタイプ"] == "school" ? "?juku-cr":"?koushi";
  let url = window.location.href;
  // URLからクエリパラメータを取得
  let urlObj = new URL(url);
  let params = new URLSearchParams(urlObj.search);
  paramsP = params.get("p");
  paramsID = params.get("id");

  // URLの変換処理（後ろに教室講師のフラグをつけてあげる）

  let baseUrl = url.split('?')[0]; // '?'を基にURLを分割し、その最初の部分（パラメータがない部分）を取得
  url = baseUrl + last_url ; // baseURLに新しいパラメータを追加
  window.history.pushState({}, '', url);
  

  // ヘッダーの画像生成
  let pc_logo_src = newData["ページタイプ"] == "school" ? 
    'https://yohayoha56.github.io/JUKUSPOT/logo2.png' : 'https://yohayoha56.github.io/JUKUSPOT/logo1.png';

  let sp_logo_src = newData["ページタイプ"] == "school" ? 
    'https://yohayoha56.github.io/JUKUSPOT/logo02.png' : 'https://yohayoha56.github.io/JUKUSPOT/logo01.png';

  let headerColor = newData["ページタイプ"] == "school" ? 
    "background-color:#33A614;color:white;":"";
  let hamburgerColor = newData["ページタイプ"] == "school" ? 
    "background-color:white;color:#33A614;":"background-color:#33A614;color:white;";

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
      <div class="super-navbar__actions" style="display: flex;align-items: center;${hamburgerColor}">
        <div id="hamburger-menu" style="font-size: 36px; margin-top: -14px;">
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
    'https://yohayoha56.github.io/JUKUSPOT/spot-css/progressbar.css',
    'https://yohayoha56.github.io/JUKUSPOT/spot-css/page_frame.css',
    'https://yohayoha56.github.io/JUKUSPOT/spot-css/page_content.css',
    'https://yohayoha56.github.io/JUKUSPOT/spot-css/schedule_form.css',
    'https://yohayoha56.github.io/JUKUSPOT/spot-css/spot_table.css',
    'https://yohayoha56.github.io/JUKUSPOT/spot-css/spot_form.css',
    'https://yohayoha56.github.io/JUKUSPOT/spot-css/spot_chat.css',
    'https://yohayoha56.github.io/JUKUSPOT/spot-css/spot_profile.css',
    ...(newData["ページタイプ"] === "school" ? [//教室ページのみ
    ] : []),
  ];
  
  // 外部スクリプトの読み込み設定②
  const scripts = [
    'https://yohayoha56.github.io/JUKUSPOT/spot-js/91_func_form.js',
    'https://yohayoha56.github.io/JUKUSPOT/spot-js/11_page_top.js',
    'https://yohayoha56.github.io/JUKUSPOT/spot-js/21_page_shift.js',
    'https://yohayoha56.github.io/JUKUSPOT/spot-js/31_page_chat.js',
    'https://yohayoha56.github.io/JUKUSPOT/spot-js/41_page_prof.js',
    'https://yohayoha56.github.io/JUKUSPOT/spot-js/03_common_guide.js',
    'https://yohayoha56.github.io/JUKUSPOT/spot-js/02_common_call.js',
    "https://kit.fontawesome.com/ae75e0f159.js", // Font Awesome
    ...(newData["ページタイプ"] === "school" ? [
    ] : []),
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