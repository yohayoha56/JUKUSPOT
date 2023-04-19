// すべてのプロパティ要素を取得
const properties = document.querySelectorAll('.notion-page__property');
console.log('プロパティ要素:', properties);

// 新しいデータを格納する空のオブジェクトを作成
const newData = {};

// 各プロパティ要素に対して処理を実行
properties.forEach((property, index) => {
  console.log(`プロパティ要素 ${index}:`, property);

  const keyElement = property.querySelector('.notion-page__property-name');
  const valueElement = property.querySelector('.notion-property__text');
  const rollupElement = property.querySelector('.notion-property__relation');
  const rollupTextElements = property.querySelectorAll('.notion-property__rollup .notion-property__text');

  if (keyElement) {
    const key = keyElement.textContent.trim();
    console.log(`キー要素 ${index}:`, keyElement, key);

    if (valueElement) {
      const value = valueElement.textContent.trim();
      newData[key] = value;
      console.log(`値要素 ${index}:`, valueElement, value);
    } else if (rollupElement) {
      const rollupData = [];
      const links = rollupElement.querySelectorAll('.notion-link');
      console.log(`ロールアップ要素 ${index}:`, rollupElement, links);

      links.forEach(link => {
        const title = link.textContent.trim();
        rollupData.push(title);
        console.log('リンク要素:', link, title);
      });

      newData[key] = rollupData;
    } else if (rollupTextElements.length > 0) {
      const rollupTextData = [];
      rollupTextElements.forEach(textElement => {
        const textValue = textElement.textContent.trim();
        rollupTextData.push(textValue);
        console.log('ロールアップテキスト要素:', textElement, textValue);
      });

      newData[key] = rollupTextData;
    } else {
      newData[key] = null;
    }
  }
});

// 整形された newData オブジェクトをコンソールに出力
console.log('新しいデータ:', newData);
