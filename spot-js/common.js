// カスタムコードの表示を許可する
var A = document.getElementsByClassName("content-area")[0];
var B = document.getElementsByClassName("super-navbar")[0];
B.after(A);
A.style["margin-top"]=0;
A.style["visibility"]="visible";



const page_call_property={
  url: 'https://script.google.com/macros/s/AKfycby3NXLDwulCHtHIoZJD_1ok5DkZy9x8A2EV-2D9psdnFghRLbbUbs0PF5qkzqK1JZrD/exec',
  callback: top_page,
}
call_fetchData(page_call_property);

// サイドメニュー作成スクリプトーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
const menuData = [
  // ページ設定
  { id: "top-menu", title: "トップページ", hasChildElements: false, callback: top_page, url: 'https://script.google.com/macros/s/AKfycby3NXLDwulCHtHIoZJD_1ok5DkZy9x8A2EV-2D9psdnFghRLbbUbs0PF5qkzqK1JZrD/exec' },
  { id: "shift-menu", title: "シフト依頼ページ", hasChildElements: true, callback: shift_page, url: 'https://script.google.com/macros/s/AKfycby3NXLDwulCHtHIoZJD_1ok5DkZy9x8A2EV-2D9psdnFghRLbbUbs0PF5qkzqK1JZrD/exec' },
  { id: "kintai-menu", title: "勤怠確認ページ", hasChildElements: true, callback: kintai_page, url: 'https://script.google.com/macros/s/AKfycbzAg7bptaT9umlZy3ThuCtNbi2MLfrBRY_9R65NvwpoJmwJ3JuI2xrF3TzQeTGZG0WT/exec' },
  { id: "profile-menu", title: "講師プロフィール", hasChildElements: true, callback: profile_page, url: 'https://script.google.com/macros/s/AKfycbwGiAxM_6KK8T7qfRzZOLAIApa-1uLq9xm5iBe4ZyRDirHwTPmgoe4EkMYbNIAziFg/exec' },
];

const menu = document.querySelector(".menu");
menuData.forEach((menuItemData) => {
  // テンプレメニューの制作ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
  const menuItem = document.createElement("li");
  menuItem.classList.add("group-menu");
  menuItem.id = menuItemData.id;

  const menuTitle = document.createElement("div");
  menuTitle.classList.add("menu-item");
  menuTitle.textContent = menuItemData.title;
  menuItem.appendChild(menuTitle);

  if (menuItemData.hasChildElements) {
    const childMenu = document.createElement("ul");
    childMenu.classList.add("child-menu");
    menuItem.appendChild(childMenu);

    // 小要素のプロパティ配列を準備するーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
    const childElementsData = [
      ...(newData["ページタイプ"] === "school" ? [
        elements = newData['講師名一覧'], label="会員id", ids = newData['講師ID一覧'],
      ]:[]),
      ...(newData["ページタイプ"] === "school" ? [
      elements = newData['教室名一覧'], label="教室id", ids = newData['教室ID一覧'],
      ]:[]),
    ];

    // ここから子要素のliを作成していく
    childElementsData.forEach((childElementData) => {
      const childElement = document.createElement("li");
      childElement.textContent = childElementData.elements;

      // 小要素にアドイベントリスナーを追加
      childElement.addEventListener("click", (e) => {
        page_call_property["url"]= menuItemData.url;
        page_call_property["callback"] = menuItemData.callback;
        page_call_property[childElementData.label] =childElementData.id;
        call_fetchData(page_call_property);
      });
      childMenu.appendChild(childElement);
    });
  }else{
    menuTitle.addEventListener("click", (e) => {
      page_call_property["url"]= menuItemData.url;
      page_call_property["callback"] = menuItemData.callback;
      call_fetchData(page_call_property);
    });
  }
  menu.appendChild(menuItem);

  // サイドメニューのプルダウンを設定ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
  const menuItems = document.querySelectorAll(".group-menu .menu-item");
  menuItems.forEach(menuItem => {
    menuItem.addEventListener("click", () => {
      const childMenu = menuItem.nextElementSibling;
      if (!childMenu || !childMenu.classList.contains("child-menu")) {
        return;
      }

      // 他の子メニューを閉じる
      menuItems.forEach((otherMenuItem) => {
        const otherChildMenu = otherMenuItem.nextElementSibling;
        if (!otherChildMenu || !otherChildMenu.classList.contains("child-menu")) {
          return;
        }
        if (otherMenuItem !== menuItem) {
          otherChildMenu.style.display = "none";
        }
      });

      // クリックされた子メニューの表示状態を切り替える
      childMenu.style.display = childMenu.style.display === "block" ? "none" : "block";
    });
  });
});



// GASを起動するためのスクリプト
function call_fetchData(page_call_property) {
  fetch(page_call_property["url"], {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
    },
    body: JSON.stringify({
      "講師ID": page_call_property["講師id"],
      "教室ID": page_call_property["教室id"]
    }),
    mode: 'cors',
  })
  .then(response => response.text())
  .then(data => {
  var target = document.getElementById("page-content");
  target.innerHTML = data;
  
// callback関数を実行
if (typeof page_call_property["callback"] === 'function') {
  page_call_property["callback"]();
}
});
}
