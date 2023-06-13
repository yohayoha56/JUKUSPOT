// 初期表示のコントロールスクリプトーーーーーーーーーーーーーーーーーー
// カスタム要素の出力 ＋ 余白エリアの除去
var A = document.getElementsByClassName("content-area")[0];
var B = document.getElementsByClassName("super-navbar")[0];
B.after(A);
A.style["margin-top"]=0;
A.style["visibility"]="visible";

var target = document.getElementById("page-content");
target.innerHTML = `
<div class="" style="display:flex;">
<img id="top-image" src='https://heys45.github.io/jukust/logo1.png' style="width: 400px; height: auto;" alt="Logo" style="object-fit:contain;object-position:left">
</div>
`
// 初回のトップページの呼び出し
const page_call_property= { "callback" : "top_page" }
call_fetchData(page_call_property);



// サイドメニューの設定スクリプトーーーーーーーーーーーーーーーーーーーー
const isSchool = newData["ページタイプ"] == "school";
const isTeacher = newData["ページタイプ"] == "teacher";


// ダミーページの事前判定用
const debugUrls = ['dummy'];
const currentUrl = window.location.href;
const urlFound = debugUrls.some(debugUrl => currentUrl.includes(debugUrl));

let menuData = [
  { id: "top_page",     title: "トップページ",                                 class: "single-menu" },
  { id: "shift_page",   title: isSchool ? "シフト依頼ページ" : "シフト管理ページ", class: "group-menu" },
  { id: "kintai_page",  title: "勤怠確認ページ",                                class: "group-menu" },
  { id: "profile_page", title: isSchool? "講師プロフィール" : "マイプロフィール",  class: isSchool ? "group-menu" : "single-menu" },
  ...(urlFound ? [//デバッグページの場合には読み込む
  { id: "chat_page", title: isSchool? "講師とメッセージ" : "教室とメッセージ",  class: "group-menu"},
  ] : [])
];


let childElementsData  = [];
if (isSchool) {
  const lastNameList = newData["講師[姓]一覧"];
  console.log(lastNameList)
  const firstNameList = newData["講師[名]一覧"];
  console.log(firstNameList)
  childElementsData = lastNameList.map((lastName, index) => `${lastName}${firstNameList[index]}`);
  console.log(childElementsData)
} else {
  childElementsData = newData["教室名一覧"];
}
const childElementsId = isSchool ? newData["講師ID一覧"] : newData["教室ID一覧"];
console.log(childElementsData)


// ここからサイドメニューの作成スクリプト
// ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
const menu = document.querySelector(".menu");

menuData.forEach((menuItemData) => {
  let menuHTML = `
    <li class="${menuItemData.class}" id="${menuItemData.id}">
      <div class="menu-item">${menuItemData.title}</div>
      ${menuItemData.class == "group-menu" ? `
      <ul class="child-menu">
        ${childElementsData.map((element, index) =>
          `<li data-id="${childElementsId[index]}">${element}</li>`
        ).join("")}
      </ul>` : ""}
    </li>
  `;

  menu.innerHTML += menuHTML;
});

// ここからサイドメニューのイベントリスナースクリプト
// ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
// アドイベントリスナーのテンプレート
function addEventListenerToMenu(menuSelector, eventHandler) {
  const menus = document.querySelectorAll(menuSelector);
  menus.forEach(menu => {
      menu.addEventListener('click', eventHandler);
});}
// チャイルドメニュー全てを非表示
addEventListenerToMenu(".menu-item", (e) => {
  document.querySelectorAll(".child-menu").forEach(element => {
      element.style.display="none";
});});
// クリックされたチャイルドメニュー表示
addEventListenerToMenu(".menu .group-menu .menu-item", (e) => {
  const parentElement = e.target.parentElement;
  parentElement.querySelector(".child-menu").style.display="block";
});
// シングルメニュークリック時のイベントハンドラ
addEventListenerToMenu(".menu .single-menu .menu-item", (e) => {
  const page_call_property = { "callback": e.target.closest('.single-menu').id };
  call_fetchData(page_call_property);
});
// チャイルドメニュークリック時のイベントハンドラ
addEventListenerToMenu(".menu .group-menu .child-menu li", (e) => {
  const page_call_property = {
    [isSchool ? "講師名" : "教室名"]: e.target.innerHTML,
    [isSchool ? "会員ID" : "教室ID"]: e.target.dataset.id,
    "callback": e.target.closest('.group-menu').id
  };
  call_fetchData(page_call_property);
});



// サイドバー関連の設定ーーーーーーーーーーーーーーーーーーーーーーーーーーー
const hamburgerMenu = document.getElementById('hamburger-menu');
hamburgerMenu.addEventListener('click', toggleSideBar);

function toggleSideBar() {
  const sideBar = document.querySelector('.side-bar');
  const menuIcon = document.querySelector('#hamburger-menu span');
  
  if (sideBar.style.display === 'none' || sideBar.style.display === '') {
    sideBar.style.display = 'block';
    menuIcon.textContent = '×';
    menuIcon.style["font-size"]="28px";
    menuIcon.style["margin-top"]="-5px";
  } else {
    sideBar.style.display = 'none';
    menuIcon.textContent = '≡';
    menuIcon.style["font-size"]="36px";
    menuIcon.style["margin-top"]="-14px";
  }
}


// GASを起動するためのスクリプトーーーーーーーーーーーーーーーーーーーー
function call_fetchData(page_call_property) {

  if(newData["ページタイプ"] == "school"){
    page_call_property["教室名"]=newData["教室名"];
    page_call_property["教室ID"]=newData["教室ID"]
  }
  if(newData["ページタイプ"] == "teacher"){
    page_call_property["講師名"]=newData["姓"]+newData["名"];
    page_call_property["会員ID"]=newData["会員ID"];
  }

  const data = {
    "講師名": page_call_property["講師名"],
    "会員ID": page_call_property["会員ID"],
    "教室名": page_call_property["教室名"],
    "教室ID": page_call_property["教室ID"],
    "callback": page_call_property["callback"],
    "ページタイプ": newData["ページタイプ"]
  };

  let url;
  switch (page_call_property["callback"]) {
    case "profile_page":
      url = 'https://script.google.com/macros/s/AKfycbwGiAxM_6KK8T7qfRzZOLAIApa-1uLq9xm5iBe4ZyRDirHwTPmgoe4EkMYbNIAziFg/exec'; break;
    case "chat_page":
      url = 'https://script.google.com/macros/s/AKfycbwLXeaxdJQgOwxL9zIlRBejQHBx6GUhhBfWrZ228CbBWG6aNbUOgodaZdYYEzStvM7Lig/exec'; break;
    default:
      url = 'https://script.google.com/macros/s/AKfycbwmCc5XeYXWjCXLiztYc45LFdaX-bdzjbET8KXZcWbfF5TVwKk-dQeokyOfKivAwlB9/exec';
  }
  
  // ガイドの挿入を実行する。
  insertGuide(page_call_property);

  // APIにて情報を取得
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain',},
    body: JSON.stringify(data),
    mode: 'cors',
  })
  .then(response => response.text())
  .then(data => {

    if(page_call_property["callback"]=="chat_page"){
      // チャットログの表示
      var target = document.querySelector(".chat-log-area");
      target.insertAdjacentHTML("beforeend",data)

    } else {
      // メインコンテンツの挿入
      var target = document.getElementById("page-content");
      target.insertAdjacentHTML("beforeend",data)
    }


    //　ガイド以外のカスタムコードを実行する
    if (typeof window[page_call_property["callback"]] === 'function') {
      window[page_call_property["callback"]](page_call_property);
    }
  });
}

