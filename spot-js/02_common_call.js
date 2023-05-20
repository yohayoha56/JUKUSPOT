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

// サイドメニューの設定スクリプトーーーーーーーーーーーーーーーーーーーー
let menuData = [
  { id: "top_page", title: "トップページ", class: "single-menu" },
  { id: "shift_page", title: newData["ページタイプ"] == "school" ? "シフト依頼ページ ▼" : "シフト管理ページ ▼", class: "group-menu" },
  { id: "kintai_page", title: "勤怠確認ページ ▼", class: "group-menu" },
  { id: "profile_page", title: newData["ページタイプ"] == "school" ? "講師プロフィール ▼" : "マイプロフィール", class: newData["ページタイプ"] == "school" ? "group-menu" : "single-menu" },
];


// ここからサイドメニューの作成スクリプト
// ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
const childElementsData = newData["ページタイプ"] == "school" ? newData["講師名一覧"] : newData["教室名一覧"];
const childElementsId = newData["ページタイプ"] == "school" ? newData["講師ID一覧"] : newData["教室ID一覧"];


// ここからサイドメニューの作成スクリプト
// ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
const menu = document.querySelector(".menu");

menuData.forEach((menuItemData) => {
  const menuItem = document.createElement("li");
  menuItem.classList.add(menuItemData.class);
  menuItem.id = menuItemData.id;

  menuItem.innerHTML = `
    <div class="menu-item">${menuItemData.title}</div>
    ${menuItemData.class == "group-menu"? `
    <ul class="child-menu">
      ${childElementsData.map((element, index) =>
        `<li data-id="${childElementsId[index]}">${element}</li>`
      ).join("")}
    </ul>
    `: ``}
  `;

  menu.appendChild(menuItem);
});

// ここからサイドメニューのイベントリスナースクリプト
// ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
const Menus = document.querySelectorAll(".menu-item")
Menus.forEach((Menu) => {
  Menu.addEventListener("click", (e) => {
    document.querySelectorAll(".child-menu").forEach(element => {
      element.style.display="none";
    });
  });
});

const groupMenus = document.querySelectorAll(".menu .group-menu .menu-item")
groupMenus.forEach((groupMenu) => {
  groupMenu.addEventListener("click", (e) => {
    const parentElement =groupMenu.parentElement;
    parentElement.querySelector(".child-menu").style.display="block";
  });
});

const singleMenus = document.querySelectorAll(".menu .single-menu");
singleMenus.forEach((singleMenu) => {
  singleMenu.addEventListener("click", () => {
    const page_call_property={
      "callback" : singleMenu.id,
    }
    call_fetchData(page_call_property);
  });
});

const childMenus = document.querySelectorAll(".menu .group-menu .child-menu li");
childMenus.forEach((childMenu) => {
  childMenu.addEventListener("click", () => {
    // 親のgroup-menuのIDを取得する
    const parentId = childMenu.closest('.group-menu').id;

    const page_call_property={
      "callback" : parentId,
      "講師名" : newData["ページタイプ"] == "school" ? childMenu.innerHTML : "",
      "会員ID" : newData["ページタイプ"] == "school" ? childMenu.dataset.id : "",
      "教室名" : newData["ページタイプ"] == "teacher" ? childMenu.innerHTML : "",
      "教室ID" : newData["ページタイプ"] == "teacher" ? childMenu.dataset.id : "",
    }
    call_fetchData(page_call_property);
  });
});



// GASを起動するためのスクリプトーーーーーーーーーーーーーーーーーーーー
function call_fetchData(page_call_property) {
  const data = {
    "講師名": newData["ページタイプ"] == "teacher" ? newData["姓"]+newData["名"] : page_call_property["講師名"],
    "会員ID": newData["ページタイプ"] == "teacher" ? newData["会員ID"] : page_call_property["会員ID"],
    "教室名": newData["ページタイプ"] == "school" ? cnewData["教室名"] : page_call_property["教室名"],
    "教室ID": newData["ページタイプ"] == "school" ? cnewData["教室ID"] : page_call_property["教室ID"],
    "callback": page_call_property["callback"],
    "ページタイプ": newData["ページタイプ"]
  };

  let url;
  switch (page_call_property["callback"]) {
    case "profile_page":
      url = 'https://script.google.com/macros/s/AKfycbwGiAxM_6KK8T7qfRzZOLAIApa-1uLq9xm5iBe4ZyRDirHwTPmgoe4EkMYbNIAziFg/exec'; break;
    default:
      url = 'https://script.google.com/macros/s/AKfycbwmCc5XeYXWjCXLiztYc45LFdaX-bdzjbET8KXZcWbfF5TVwKk-dQeokyOfKivAwlB9/exec';
  }
  

  fetch(url, {
    method: 'POST',
    headers: { 
      'Content-Type': 'text/plain',
    },
    body: JSON.stringify(data),
    mode: 'cors',
  })
  .then(response => response.text())
  .then(data => {
    var target = document.getElementById("page-content");
    target.innerHTML = data;

    // Execute callback function
    if (typeof window[page_call_property["callback"]] === 'function') {
      window[page_call_property["callback"]]();
    }
  });
}



// 初期化関数を作成ーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
function initializeLayout() {
  const contentArea = document.querySelector('.content-area');
  const sideBar = document.querySelector('.side-bar');
  
  if (window.innerWidth <= 680) {
    contentArea.style.display = "block";
    sideBar.style.width = '100%';
    sideBar.style.height = 'auto';
    sideBar.style.top = '50px';
    sideBar.style.display = 'none';
    sideBar.style["background-color"] = 'white';
  } else {
    contentArea.style.display = "flex";
    sideBar.style.width = 'auto';
    sideBar.style.height = '60vh';
    sideBar.style.top = '0';
    sideBar.style.display = 'block';
    sideBar.style["background-color"] = '';
  }
}


// 初回読み込み時にinitializeLayout関数を呼び出す
initializeLayout()

// リサイズイベント時にも同じような処理を行う
let lastWindowWidth = window.innerWidth;
window.addEventListener('resize', () => {
  if (window.innerWidth <= 680 && lastWindowWidth > 680) {
    initializeLayout();
  } else if (window.innerWidth > 680 && lastWindowWidth <= 680) {
    initializeLayout();
  }

  lastWindowWidth = window.innerWidth;
});


// サイドバーの設定ーーーーーーーーーーーーーーーーーーーーーーーーーーー
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