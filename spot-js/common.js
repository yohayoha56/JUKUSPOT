// カスタムコードの表示を許可する
var A = document.getElementsByClassName("content-area")[0];
var B = document.getElementsByClassName("super-navbar")[0];
B.after(A);
A.style["margin-top"]=0;
A.style["visibility"]="visible";



const page_call_property={
  url: 'https://script.google.com/macros/s/AKfycby3NXLDwulCHtHIoZJD_1ok5DkZy9x8A2EV-2D9psdnFghRLbbUbs0PF5qkzqK1JZrD/exec',
  callback: top_page,
  教室ID: newData["教室ID"]
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


  // 小要素があるリストの設定（プルダウン機能を設定する）ーーーーーーーーー
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
            elements: element,
            label: "会員ID",
            ids: newData["講師ID一覧"][index],
          }))
        : []),
      ...(newData["ページタイプ"] === "teacher"
        ? newData["教室名一覧"].map((element, index) => ({
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
        call_fetchData(page_call_property);
      });
      childMenu.appendChild(childElement);
    });
  }else{
  // 親要素のみの場合を設定
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

function pulldown(childMenu){
  var target = document.querySelectorAll(".child-menu");
  target.forEach(element => {
    element.style.display="none";
  });
  if(childMenu !=null){
    childMenu.style.display="block"
  }
}



// GASを起動するためのスクリプト
function call_fetchData(page_call_property) {
  fetch(page_call_property["url"], {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
    },
    body: JSON.stringify({
      "講師ID": page_call_property["講師ID"],
      "教室ID": page_call_property["教室ID"]
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
