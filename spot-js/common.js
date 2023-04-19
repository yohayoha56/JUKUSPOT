// すべてのプロパティ要素を取得
function extractProperties() {
  const propertiesContainer = document.querySelector(".notion-page__properties");
  const properties = Array.from(propertiesContainer.children);
  const extractedProperties = properties.map((property) => {
      const propertyElement = property.querySelector(".notion-page__property-name > span");
      const propertyName = propertyElement ? propertyElement.innerText : "";
      const propertyContent = property.querySelector(".notion-property");
      // データがない場合「空」データを入れる。
      if (!propertyContent) {
          return {
              name: propertyName,
              data: ""
          };
      }
      // データがある場合はプロパティに合わせてデータを取得
      let propertyData;
      if (propertyContent.classList.contains("notion-property__rollup")) {
          propertyData = Array.from(propertyContent.children).map((child) => {
              const childData = Array.from(child.querySelectorAll(".notion-semantic-string > span")).map(
                  (content) => content.innerText
              );
              return childData;
          });
      } else if (propertyContent.classList.contains("notion-property__relation")) {
          propertyData = Array.from(propertyContent.querySelectorAll(".notion-semantic-string > span")).map((relation) =>
              relation.innerText.trim()
          );
      } else {
          propertyData = propertyContent.querySelector(".notion-semantic-string > span")?.innerText || "";
      }
      return {
          name: propertyName,
          data: propertyData,
      };
  });
  return extractedProperties;
}
const newData = extractProperties();


// サイドメニューのコントロールスクリプト
document.addEventListener("DOMContentLoaded", function() {
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
});

