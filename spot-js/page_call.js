// カスタムコードの表示を許可する
var A = document.getElementsByClassName("content-area")[0];
var B = document.getElementsByClassName("super-navbar")[0];
B.after(A);
A.style["margin-top"]=0;
A.style["visibility"]="visible";


// トップページの呼び出しーーーーーーーーーーーーーーーーーーーーーーーー

const page_call_property={
  url: 'https://script.google.com/macros/s/AKfycbxRVM-fFhzJj5CLMH6LrF1FEaFkYUlMY7LxmV5MuqYp0hcFUryhFPS5DW0ciWx5djk/exec',
  callback: top_page,
}
if(newData["ページタイプ"] === "school"){
  page_call_property["教室ID"]=newData["教室ID"];
}else if(newData["ページタイプ"] === "teacher"){
  page_call_property["会員ID"]=newData["名前"];
}
call_fetchData(page_call_property);

// サイドメニューの設定スクリプトーーーーーーーーーーーーーーーーーーーー
const menuData = [
  // ページ設定
  { id: "top-menu", title: "トップページ", hasChildElements: false, callback: top_page, url: 'https://script.google.com/macros/s/AKfycbxRVM-fFhzJj5CLMH6LrF1FEaFkYUlMY7LxmV5MuqYp0hcFUryhFPS5DW0ciWx5djk/exec' },
  { id: "shift-menu", title: "シフト依頼ページ", hasChildElements: true, callback: shift_page, url: 'https://script.google.com/macros/s/AKfycbwmCc5XeYXWjCXLiztYc45LFdaX-bdzjbET8KXZcWbfF5TVwKk-dQeokyOfKivAwlB9/exec' },
  { id: "kintai-menu", title: "勤怠確認ページ", hasChildElements: true, callback: kintai_page, url: 'https://script.google.com/macros/s/AKfycbzAg7bptaT9umlZy3ThuCtNbi2MLfrBRY_9R65NvwpoJmwJ3JuI2xrF3TzQeTGZG0WT/exec' },
  { id: "profile-menu", title: "講師プロフィール", hasChildElements: true, callback: profile_page, url: 'https://script.google.com/macros/s/AKfycbwGiAxM_6KK8T7qfRzZOLAIApa-1uLq9xm5iBe4ZyRDirHwTPmgoe4EkMYbNIAziFg/exec' },
];

// GASを起動するためのスクリプトーーーーーーーーーーーーーーーーーーーー
function call_fetchData(page_call_property) {
  const calldata = {
    "a":"a",
  };

  fetch(page_call_property["url"], {
    method: 'POST',
    headers: { 
      'Content-Type': 'text/plain',
    },
    body: JSON.stringify(calldata),
    mode: 'cors',
  })
  .then(response => response.text())
  .then(data => {
    var target = document.getElementById("page-content");
    target.innerHTML = data;

    // Execute callback function
    if (typeof page_call_property["callback"] === 'function') {
      page_call_property["callback"]();
    }
  });
}


// ここからサイドメニューの作成スクリプト
// ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
const menu = document.querySelector(".menu");

const page_title = document.createElement("h1");
page_title.style["font-size"]="16px";
if(newData["ページタイプ"] === "school"){
  page_title.textContent=newData["教室名"]+"管理ページ";
}else if(newData["ページタイプ"] === "teacher"){
  page_title.textContent=newData["講師名"]+"マイページ";
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
const hamburgerMenu = document.createElement('div');
hamburgerMenu.classList.add('hamburger-menu');
hamburgerMenu.innerHTML = '<span>≡</span>';
hamburgerMenu.style["font-size"]="36px"
hamburgerMenu.style["margin-top"]="-14px"
hamburgerMenu.style["color"]="#666"
hamburgerMenu.addEventListener('click', toggleSideBar);

const superNavBar = document.querySelector('.super-navbar__actions');
superNavBar.appendChild(hamburgerMenu);


window.addEventListener('resize', () => {
    const sideBar = document.querySelector('.side-bar');
    if (window.innerWidth <= 680) {
        sideBar.style.display = 'none';
    }
});

function toggleSideBar() {
  const sideBar = document.querySelector('.side-bar');
  sideBar.style.display = sideBar.style.display === 'none' ? 'block' : 'none';
}