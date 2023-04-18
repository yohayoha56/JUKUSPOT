
function schedule_get(e) {
  var teacherId = e.target.getAttribute('会員ID'); // クリックされたliのvalue属性の値を取得
  var ouboId = e.target.getAttribute('応募ID'); // クリックされたliのvalue属性の値を取得

  // POSTリクエストの送信
  fetch("https://script.google.com/macros/s/AKfycbwmCc5XeYXWjCXLiztYc45LFdaX-bdzjbET8KXZcWbfF5TVwKk-dQeokyOfKivAwlB9/exec", {
    method: 'POST',
    headers: {
        'Content-Type': 'text/plain',
    },
    body: JSON.stringify({
      "講師ID": teacherId, // 検索条件にクリックされたliのvalueの値を代入
      "応募ID": ouboId // 応募IDを追加
  }),
    mode: 'cors', //CORS対応
  })
  .then(response => response.text()) 
  .then(data => {
    var target = document.getElementById("page-content");
    target.innerHTML =data;
    modifyTable()
    })
};

// li要素を取得し、クリックイベントを登録
var liElements = document.querySelectorAll('#shift-menu .child-menu li');
liElements.forEach(li => {
  li.addEventListener('click', schedule_get);
});


function modifyTable() {
  const tableRows = document.querySelectorAll('#schedule-table tbody tr:not(:first-child)');

  tableRows.forEach(row => {
    const availabilityCell = row.querySelector('td:nth-child(2)');
    const requestStatusCell = row.querySelector('td:nth-child(5)');

    // 勤務可否列の変更
    switch (availabilityCell.textContent) {
      case '勤務不可':
        availabilityCell.innerHTML = '<button class="unavailable">勤務不可</button>';
        break;
      case '調整中':
        availabilityCell.innerHTML = '<button class="adjusting">調整中</button>';
        break;
      case '講師回答前':
        availabilityCell.innerHTML = '<button class="adjusting">講師回答前</button>';
        break;
      case '一部勤務可能':
        availabilityCell.innerHTML = '<button class="partially-available">勤務可能</button>';
        break;
      case '終日勤務可能':
        availabilityCell.innerHTML = '<button class="available">勤務可能</button>';
        break;
    }

    // 依頼状況列の変更
    if (availabilityCell.textContent === '勤務不可') {
      requestStatusCell.innerHTML = '<button class="request-not-possible">依頼不可</button>';
    } else if (requestStatusCell.textContent === '勤務確定') {
      requestStatusCell.innerHTML = '<button class="confirmed">勤務確定</button>';
    } else if (requestStatusCell.textContent === '講師回答前' || requestStatusCell.textContent === '調整希望') {
      requestStatusCell.innerHTML = '<button class="modify">依頼修正</button>';
    } else {
      requestStatusCell.innerHTML = '<button class="request">新規依頼</button>';
    }
  });
}
