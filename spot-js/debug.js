
var target =document.getElementsByClassName("")


// デバッグページにおけるビュー調整
document.getElementsByClassName("super-content-wrapper")[0].style.display="block";
document.getElementsByClassName("notion-header")[0].style.display="block";
document.getElementsByClassName("notion-page__properties")[0].style.display="block";


// 外部リソースのURLを配列として定義します。
const resourceUrls = [
    
    'https://heys45.github.io/SAUCEED/spot-js/.js',
    'https://heys45.github.io/SAUCEED/spot-js/load.js',
    'https://heys45.github.io/SAUCEED/spot-js/load.js',
    'https://heys45.github.io/SAUCEED/spot-js/load.js',
    'https://heys45.github.io/SAUCEED/spot-js/load.js',
    'https://heys45.github.io/SAUCEED/spot-js/load.js',
    'https://heys45.github.io/SAUCEED/spot-js/load.js',
    'https://heys45.github.io/SAUCEED/spot-js/load.js',
    'https://heys45.github.io/SAUCEED/spot-js/load.js',
    'https://your-github-account.github.io/your-repo/external-script2.js',
    'https://your-github-account.github.io/your-repo/external-stylesheet1.css',
    'https://your-github-account.github.io/your-repo/external-stylesheet2.css',
  ];
  
  // 各リソースの最終更新日時を取得するPromiseを作成し、Promise.allで実行します。
  Promise.all(
    resourceUrls.map((url) =>
      fetch(url, { method: 'HEAD' }).then((response) => {
        if (response.ok) {
          const lastModified = new Date(response.headers.get('Last-Modified'));
          return lastModified;
        } else {
          console.error('リクエストが失敗しました:', response.status, response.statusText);
          return null;
        }
      })
    )
  )
    .then((lastModifiedDates) => {
      // 最新の更新日を取得して、表示します。
      const latestUpdate = lastModifiedDates.reduce((latest, current) => {
        return current && (!latest || current > latest) ? current : latest;
      }, null);
  
      if (latestUpdate) {
        document.getElementById('latest-update').textContent =
          '最終更新日時: ' + latestUpdate.toLocaleString('ja-JP');
      } else {
        document.getElementById('latest-update').textContent = '最終更新日時を取得できませんでした。';
      }
    })
    .catch((error) => {
      console.error('エラー:', error);
    });
  