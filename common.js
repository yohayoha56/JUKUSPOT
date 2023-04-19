const properties = document.querySelectorAll('.notion-page__property');
const newData = {};
properties.forEach((property) => {
  const keyElement = property.querySelector('.notion-page__property-name span');
  if (keyElement) {
    const key = keyElement.textContent;
    const valueElement = property.querySelector('.notion-semantic-string span');
    const rollupElement = property.querySelector('.notion-property__rollup');
    if (valueElement) {
      const value = valueElement.textContent || null;
      newData[key] = value;
    } else if (rollupElement) {
      const values = Array.from(rollupElement.querySelectorAll('.notion-property__title, .notion-property__text'))
        .map((titleElement) => {
          const linkElement = titleElement.querySelector('.notion-link');
          if (linkElement) {
            return {
              id: linkElement.getAttribute('href').replace('/', ''),
              title: titleElement.querySelector('.notion-semantic-string span').textContent
            };
          } else {
            return titleElement.querySelector('.notion-semantic-string span').textContent;
          }
        });
      newData[key] = values;
    } else {
      newData[key] = null;
    }
  }
});
if(newData["ページタイプ"]="school"){}

console.log(newData);

