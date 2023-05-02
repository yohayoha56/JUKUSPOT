
  // デバッグページにおけるビュー調整
  // document.getElementsByClassName("super-content-wrapper")[0].style.display="block";
  // document.getElementsByClassName("notion-header")[0].style.display="block";
  // document.getElementsByClassName("notion-page__properties")[0].style.display="block";

  // 外部リソースのURLを配列として定義します。
  const baseUrl = 'https://heys45.github.io/SAUCEED/';
  const resourceUrls = [
    'spot-js/load.js',
    'spot-js/debug.js',
    'spot-js/page_top.js',
    'spot-js/page_shift.js',
    'spot-js/page_call.js',
    'spot-css/page_frame.css',
    'spot-css/progressbar.css',
    'spot-css/schedule_form.css',
    'spot-css/schedule_table.css',
    'spot-css/school.css',
  ].map(url => baseUrl + url);
  
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
  