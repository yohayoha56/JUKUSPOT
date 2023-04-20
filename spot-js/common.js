var A = document.getElementsByClassName("content-area")[0];
var B = document.getElementsByClassName("super-navbar")[0];
B.after(A);
A.style["margin-top"]=0;
A.style["visibility"]="visible";



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

