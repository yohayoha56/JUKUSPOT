// カスタムコードの表示を許可する
var A = document.getElementsByClassName("content-area")[0];
var B = document.getElementsByClassName("super-navbar")[0];
B.after(A);
A.style["margin-top"]=0;
A.style["visibility"]="visible";


// トップページの呼び出しーーーーーーーーーーーーーーーーーーーーーーーー

const page_call_property={
  url: 'https://script.google.com/macros/s/AKfycbwmCc5XeYXWjCXLiztYc45LFdaX-bdzjbET8KXZcWbfF5TVwKk-dQeokyOfKivAwlB9/exec', 
  callback: "top_page",
}
if(newData["ページタイプ"] === "school"){
  page_call_property["教室ID"]=newData["教室ID"];
}else if(newData["ページタイプ"] === "teacher"){
  page_call_property["会員ID"]=newData["会員ID"];
}
call_fetchData(page_call_property);

// サイドメニューの設定スクリプトーーーーーーーーーーーーーーーーーーーー
let menuData
if(newData["ページタイプ"] === "school"){
menuData = [
  // ページ設定
  { id: "top-menu", title: "トップページ", hasChildElements: false, callback: "top_page", url: 'https://script.google.com/macros/s/AKfycbwmCc5XeYXWjCXLiztYc45LFdaX-bdzjbET8KXZcWbfF5TVwKk-dQeokyOfKivAwlB9/exec' },
  { id: "shift-menu", title: "シフト依頼ページ", hasChildElements: true, callback: "shift_page", url: 'https://script.google.com/macros/s/AKfycbwmCc5XeYXWjCXLiztYc45LFdaX-bdzjbET8KXZcWbfF5TVwKk-dQeokyOfKivAwlB9/exec' },
  { id: "kintai-menu", title: "勤怠確認ページ", hasChildElements: true, callback: "kintai_page", url: 'https://script.google.com/macros/s/AKfycbwmCc5XeYXWjCXLiztYc45LFdaX-bdzjbET8KXZcWbfF5TVwKk-dQeokyOfKivAwlB9/exec' },
  { id: "profile-menu", title: "講師プロフィール", hasChildElements: true, callback: "profile_page", url: 'https://script.google.com/macros/s/AKfycbwGiAxM_6KK8T7qfRzZOLAIApa-1uLq9xm5iBe4ZyRDirHwTPmgoe4EkMYbNIAziFg/exec' },
];
}else if(newData["ページタイプ"] === "teacher"){
  menuData = [
    // ページ設定
    { id: "top-menu", title: "トップページ", hasChildElements: false, callback: "top_page", url: 'https://script.google.com/macros/s/AKfycbwmCc5XeYXWjCXLiztYc45LFdaX-bdzjbET8KXZcWbfF5TVwKk-dQeokyOfKivAwlB9/exec' },
    { id: "shift-menu", title: "シフト管理ページ", hasChildElements: true, callback: "shift_page", url: 'https://script.google.com/macros/s/AKfycbwmCc5XeYXWjCXLiztYc45LFdaX-bdzjbET8KXZcWbfF5TVwKk-dQeokyOfKivAwlB9/exec' },
    { id: "kintai-menu", title: "勤怠確認ページ", hasChildElements: true, callback: "kintai_page", url: 'https://script.google.com/macros/s/AKfycbwmCc5XeYXWjCXLiztYc45LFdaX-bdzjbET8KXZcWbfF5TVwKk-dQeokyOfKivAwlB9/exec' },
    { id: "profile-menu", title: "講師プロフィール", hasChildElements: false, callback: "profile_page", url: 'https://script.google.com/macros/s/AKfycbwGiAxM_6KK8T7qfRzZOLAIApa-1uLq9xm5iBe4ZyRDirHwTPmgoe4EkMYbNIAziFg/exec' },
  ];
}
// もと勤怠
// https://script.google.com/macros/s/AKfycbzAg7bptaT9umlZy3ThuCtNbi2MLfrBRY_9R65NvwpoJmwJ3JuI2xrF3TzQeTGZG0WT/exec

// GASを起動するためのスクリプトーーーーーーーーーーーーーーーーーーーー
function call_fetchData(page_call_property) {
  const data = {
    "会員ID": page_call_property["会員ID"],
    "教室ID": page_call_property["教室ID"],
    "講師名": page_call_property["講師名"],
    "教室名": page_call_property["教室名"],
    "callback": page_call_property["callback"],
    "ページタイプ": newData["ページタイプ"]
    
  };

  fetch(page_call_property["url"], {
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


// ここからサイドメニューの作成スクリプト
// ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
const menu = document.querySelector(".menu");

const page_title = document.createElement("h1");
if(newData["ページタイプ"] === "school"){
  page_title.innerHTML=newData["教室名"]+'<span style="display:inline-block;">管理ページ</span>';
}else if(newData["ページタイプ"] === "teacher"){
  page_title.innerHTML=newData["姓"]+newData["名"]+'<span style="display:inline-block;">マイページ</span>';
}
menu.appendChild(page_title);





menuData.forEach((menuItemData) => {
  // メニューの大枠を作成ーーーーーーーーーーーーーーーーーーーーーーー
  const menuItem = document.createElement("li");
  menuItem.classList.add("group-menu");
  menuItem.id = menuItemData.id;

  const menuTitle = document.createElement("div");
  menuTitle.classList.add("menu-item");
  menuTitle.textContent = menuItemData.title;
  menuItem.appendChild(menuTitle);

  // 小要素があるメニューーーーーーーーーーーーーーーーーーーーーーーー
  if (menuItemData.hasChildElements) {
    const childMenu = document.createElement("ul");
    childMenu.classList.add("child-menu");
    menuItem.appendChild(childMenu);

    menuTitle.addEventListener("click", () => {
      pulldown(childMenu);
    });

    // 子要素のプロパティ配列を準備するーーーーーーーーーーーーーーーーーー
    const childElementsData = [
      ...(newData["ページタイプ"] === "school"
        ? newData["講師名一覧"].map((element, index) => ({
            label2:"講師名",
            elements: element,
            label: "会員ID",
            ids: newData["講師ID一覧"][index],
          }))
        : []),
      ...(newData["ページタイプ"] === "teacher"
        ? newData["教室名一覧"].map((element, index) => ({
            label2:"教室名",
            elements: element,
            label: "教室ID",
            ids: newData["教室ID一覧"][index],
          }))
        : []),
    ];
    console.log(childElementsData)

    // 小要素の作成、アドイベントリスナーの設定を行うーーーーーーーーーーー
    childElementsData.forEach((childElementData) => {
      const childElement = document.createElement("li");
      childElement.textContent = childElementData["elements"];
      childElement.addEventListener("click", (e) => {
        page_call_property["url"]= menuItemData.url;
        page_call_property["callback"] = menuItemData.callback;
        page_call_property[childElementData["label"]] =childElementData["ids"];
        page_call_property[childElementData["label2"]]=childElementData["elements"];
        call_fetchData(page_call_property);
      });
      childMenu.appendChild(childElement);
    });
  }else{
  // 親要素のみのメニューーーーーーーーーーーーーーーーーーーーーーーー
    menuTitle.addEventListener("click", (e) => {
      page_call_property["url"]= menuItemData.url;
      page_call_property["callback"] = menuItemData.callback;
      call_fetchData(page_call_property);
    });
    menuTitle.addEventListener("click", () => {
      pulldown();
    });
  }
  menu.appendChild(menuItem);
});

// プルダウンの設定ーーーーーーーーーーーーーーーーーーーーーーーーーーー
function pulldown(childMenu){
  var target = document.querySelectorAll(".child-menu");
  target.forEach(element => {
    element.style.display="none";
  });
  if(childMenu !=null){
    childMenu.style.display="block"
  }
}



// サイドバーの設定ーーーーーーーーーーーーーーーーーーーーーーーーーーー
const hamburgerMenu = document.getElementById('hamburger-menu');
hamburgerMenu.addEventListener('click', toggleSideBar);

let lastWindowWidth = window.innerWidth;

window.addEventListener('resize', () => {
  if (window.innerWidth <= 680) {
    if (lastWindowWidth > 680) {
      const contentArea = document.querySelector('.content-area');
      contentArea.style.display ="block";
      const sideBar = document.querySelector('.side-bar');
      sideBar.style.width = '100%';
      sideBar.style.height = 'auto';
      sideBar.style.top = '50px';
      sideBar.style.display = 'none';
      sideBar.style["background-color"] = 'white';
    }
  } else {
    if (lastWindowWidth <= 680) {
      const contentArea = document.querySelector('.content-area');
      contentArea.style.display ="flex";
      const sideBar = document.querySelector('.side-bar');
      sideBar.style.width = 'auto';
      sideBar.style.height = '60vh';
      sideBar.style.top = '0';
      sideBar.style.display = 'block';
      sideBar.style["background-color"] = '';
    }
  }
  lastWindowWidth = window.innerWidth;
});

// 初期表示時にリサイズイベントをトリガーする
window.dispatchEvent(new Event('resize'));

function toggleSideBar() {
  const sideBar = document.querySelector('.side-bar');
  const menuIcon = document.querySelector('.hamburger-menu span');
  
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
