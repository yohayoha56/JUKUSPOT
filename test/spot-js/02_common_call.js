// 初期表示のコントロールスクリプトーーーーーーーーーーーーーーーーーー
// カスタム要素の出力 ＋ 余白エリアの除去
var A = document.getElementsByClassName("content-area")[0];
var B = document.getElementsByClassName("super-navbar")[0];
B.after(A);
A.style["margin-top"]=0;
A.style["visibility"]="visible";



var target = document.getElementById("page-content");


// 条件分岐の判定フラグーーーーーーーーーーーーーーーーーーーー
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
  { id: "chat_page", title: isSchool? "講師とメッセージ" : "教室とメッセージ",  class: "group-menu"},
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

console.log('newData :' + newData);
console.log('サイドメニュー用childElementsData :' + childElementsData);



// 初回のトップページの呼び出し
let page_call_property
if(menuData.map(menu => menu.id).includes(paramsP) && childElementsId.includes(paramsID)){
  const matchingIndex = childElementsId.indexOf(paramsID); 
  const matchingData = childElementsData[matchingIndex]; 

  page_call_property = {
    "callback" : paramsP,
    [isSchool ? "講師名" : "教室名"]: matchingData,
    [isSchool ? "会員ID" : "教室ID"]: paramsID
  };

} else {
  page_call_property= { "callback" : "top_page" }
}
call_fetchData(page_call_property);




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

document.getElementsByTagName("body")[0].insertAdjacentHTML("afterbegin",'<div id="overlay"></div>')
const overlay = document.getElementById("overlay");
overlay.addEventListener('click', toggleSideBar);

function toggleSideBar() {
  const sideBar = document.querySelector('.side-bar');
  const menuIcon = document.querySelector('#hamburger-menu span');
  const overlay = document.getElementById("overlay")
  
  if (sideBar.style.display === 'none' || sideBar.style.display === '') {
    sideBar.style.display = 'block';
    overlay.style.display = "block"
    menuIcon.textContent = '×';
    menuIcon.style["font-size"]="28px";
    menuIcon.style["margin-top"]="-5px";
  } else {
    sideBar.style.display = 'none';
    overlay.style.display = "none"
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
    page_call_property["ページタイプ"]= "school"
  }
  if(newData["ページタイプ"] == "teacher"){
    page_call_property["講師名"]=newData["姓"]+newData["名"];
    page_call_property["会員ID"]=newData["会員ID"];
    page_call_property["ページタイプ"]= "teacher"
  }

  const data = {
    "講師名": page_call_property["講師名"],
    "会員ID": page_call_property["会員ID"],
    "教室名": page_call_property["教室名"],
    "教室ID": page_call_property["教室ID"],
    "callback": page_call_property["callback"],
    "ページタイプ": newData["ページタイプ"]
  };
  console.log("data object:", data);
  
  let url;
  console.log("url", url);
  switch (page_call_property["callback"]) {
    case "profile_page":
      url = 'https://script.google.com/macros/s/AKfycbxcs2Vwu5jn_aBo5KzM6vdiO1ZNc2wb0ipcGW4-GhTr5YxAnVqmLT1596K665nqCwiNJQ/exec'; break;
    case "chat_page":
      url = 'https://script.google.com/macros/s/AKfycbxU7pF3PXCoyKKBZQDVFWLm4z3GH7j0Wbl4FsBFiBK8A2mmr4AVj94DWi9aZIjcnj6JEw/exec'; break;
    case "top_page":
      url = 'https://script.google.com/macros/s/AKfycbyHtQ0lHZ7K1uxmvTWhhDs9yohvMBJskH8klBKRQgJrm3_FBBPue1zqZid3Jo49Ua25/exec'; break;
    default:
      url = 'https://script.google.com/macros/s/AKfycbzBT17jaCrN-NFAuUo4ZZyoEdUWlpWhR0s6BYOHDZEhMZMcdPxKE3jOJYhMzSiuUjM0/exec';
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

    const loadArea = document.getElementById("loading")
    if(loadArea){loadArea.remove()}

    const data2 = JSON.parse(data);
    console.log(data2.callback)
    
    // Callbackが一致する場合のみデータ出力を行う
    if(data2.callback == page_call_property["callback"]) {
      if(page_call_property["callback"]=="chat_page"){
        // チャットログの表示
        var target = document.querySelector(".chat-log-area");
        target.insertAdjacentHTML("beforeend",data2.html)

      } else {  // メインコンテンツの挿入
        var target = document.getElementById("page-content");
        target.insertAdjacentHTML("beforeend",data2.html)
      }
      //　ガイド以外のカスタムコードを実行する
      if (typeof window[page_call_property["callback"]] === 'function') {
        window[page_call_property["callback"]](page_call_property);
      }
    }
  });
}


