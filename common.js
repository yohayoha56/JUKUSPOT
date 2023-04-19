// すべてのプロパティ要素を取得
const properties = document.querySelectorAll('.notion-page__property');

// 新しいデータを格納する空のオブジェクトを作成
const newData = {};

// 各プロパティ要素に対して処理を実行
properties.forEach(property => {
  const keyElement = property.querySelector('.notion-property__key');
  const valueElement = property.querySelector('.notion-property__value');
  const rollupElement = property.querySelector('.notion-property__rollup');

  if (keyElement) {
    const key = keyElement.textContent.trim();

    if (valueElement) {
      newData[key] = valueElement.textContent.trim();
    } else if (rollupElement) {
      const rollupData = [];
      const links = rollupElement.querySelectorAll('.notion-link');

      links.forEach(link => {
        const title = link.textContent.trim();
        rollupData.push(title);
      });

      newData[key] = rollupData;
    } else {
      newData[key] = null;
    }
  }
});

// 整形された newData オブジェクトをコンソールに出力
console.log(newData);