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
call_fetchData({ "callback" : top_page } );



// サイドメニューの設定スクリプトーーーーーーーーーーーーーーーーーーーー
const isSchool = newData["ページタイプ"] == "school";
const isTeacher = newData["ページタイプ"] == "teacher";

let menuData = [
  { id: "top_page", title: "トップページ", class: "single-menu" },
  { id: "shift_page", title: isSchool ? "シフト依頼ページ　▼" : "シフト管理ページ　▼", class: "group-menu" },
  { id: "kintai_page", title: "勤怠確認ページ　▼", class: "group-menu" },
  { id: "profile_page", title: isSchool? "講師プロフィール　▼" : "マイプロフィール", class: isSchool ? "group-menu" : "single-menu" },
];

const childElementsData = isSchool ? newData["講師名一覧"] : newData["教室名一覧"];
const childElementsId = isSchool ? newData["講師ID一覧"] : newData["教室ID一覧"];


// ここからサイドメニューの作成スクリプト
// ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
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
      "講師名" : isSchool ? childMenu.innerHTML : "",
      "会員ID" : isSchool ? childMenu.dataset.id : "",
      "教室名" : isTeacher ? childMenu.innerHTML : "",
      "教室ID" : isTeacher ? childMenu.dataset.id : "",
    }
    call_fetchData(page_call_property);
  });
});


// GASを起動するためのスクリプトーーーーーーーーーーーーーーーーーーーー
function call_fetchData(page_call_property) {
  const data = {
    "講師名": isTeacher ? newData["姓"]+newData["名"] : page_call_property["講師名"],
    "会員ID": isTeacher ? newData["会員ID"] : page_call_property["会員ID"],
    "教室名": isSchool ? cnewData["教室名"] : page_call_property["教室名"],
    "教室ID": isSchool ? cnewData["教室ID"] : page_call_property["教室ID"],
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