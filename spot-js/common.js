var A = document.getElementsByClassName("content-area")[0];
var B = document.getElementsByClassName("super-navbar")[0];
B.after(A);
A.style["margin-top"]=0;
A.style["visibility"]="visible";



// サイドメニュー作成スクリプト
const childMenus = document.querySelectorAll('.child-menu');
childMenus.forEach(menu => menu.innerHTML = '');

const pageType = newData['ページタイプ'];
let elements, ids,label;

if (pageType === 'school') {
  elements = newData['講師名一覧'];
  label="会員id";
  ids = newData['講師ID一覧'];
} else if (pageType === 'teacher') {
  elements = [newData['教室名一覧']];
  label="教室id";
  ids = [newData['教室ID一覧']];
} 

childMenus.forEach(menu => {
  elements.forEach((element, index) => {
    const menuItem = document.createElement('li');
    menuItem.setAttribute(label, ids[index]);
    menuItem.textContent = element;
    menu.appendChild(menuItem);
  });
});



// サイドメニューのコントロールスクリプト
const menuItems = document.querySelectorAll(".group-menu");

menuItems.forEach((menuItem) => {
  menuItem.querySelector(".menu-item").addEventListener("click", () => {
    const childMenu = menuItem.querySelector(".child-menu");

    // 他の子メニューを閉じる
    menuItems.forEach((otherMenuItem) => {
      if (otherMenuItem !== menuItem) {
        otherMenuItem.querySelector(".child-menu").style.display = "none";
      }
    });

    // クリックされた子メニューの表示状態を切り替える
    childMenu.style.display = childMenu.style.display === "block" ? "none" : "block";
  });
});

