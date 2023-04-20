// 各ページの設定
const pages = [
  {
    id: 'top-menu',
    url: 'https://script.google.com/macros/s/AKfycby3NXLDwulCHtHIoZJD_1ok5DkZy9x8A2EV-2D9psdnFghRLbbUbs0PF5qkzqK1JZrD/exec',
    callback: top_create
  },
  {
    id: 'kintai-menu',
    childClass: 'child-menu',
    url: 'https://script.google.com/macros/s/AKfycbzAg7bptaT9umlZy3ThuCtNbi2MLfrBRY_9R65NvwpoJmwJ3JuI2xrF3TzQeTGZG0WT/exec',
    callback: kintai_create
  },
  {
    id: 'profile-menu',
    childClass: 'child-menu',
    url: 'https://script.google.com/macros/s/AKfycbwGiAxM_6KK8T7qfRzZOLAIApa-1uLq9xm5iBe4ZyRDirHwTPmgoe4EkMYbNIAziFg/exec',
    callback: profile_create
  }
];


// 各ページにイベントリスナーを追加
pages.forEach(addEventListeners);


// イベントリスナーを追加する関数
function addEventListeners(page) {
  const selector = page.childClass ? `#${page.id} .${page.childClass} li` : `#${page.id}`;
  const liElements = document.querySelectorAll(selector);

  liElements.forEach(li => {
    li.addEventListener('click', (e) => school_fetchData(e, page.url, page.callback));
  });
}

// GASを起動するためのスクリプト
function school_fetchData(e, url, callback) {
  teacherId = e.target.getAttribute('会員ID');
  ouboId = e.target.getAttribute('応募ID');
  schoolId =

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
    },
    body: JSON.stringify({
      "講師ID": teacherId,
      "応募ID": ouboId,
      "教室ID": newData["教室ID"]
    }),
    mode: 'cors',
  })
  .then(response => response.text())
  .then(data => {
    var target = document.getElementById("page-content");
    target.innerHTML = data;

  // callback関数を実行
  if (typeof callback === 'function') {
    callback();
  }
  });


}
