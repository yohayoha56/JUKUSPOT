function fetchData(e, url) {
  teacherId = e.target.getAttribute('会員ID');
  ouboId = e.target.getAttribute('応募ID');

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
    },
    body: JSON.stringify({
      "講師ID": teacherId,
      "応募ID": ouboId
    }),
    mode: 'cors',
  })
  .then(response => response.text())
  .then(data => {
    var target = document.getElementById("page-content");
    target.innerHTML = data;
  });
}

var liElements = document.querySelectorAll('#kintai-menu .child-menu li');
liElements.forEach(li => {
  li.addEventListener('click', (e) => fetchData(e, "https://script.google.com/macros/s/AKfycbzAg7bptaT9umlZy3ThuCtNbi2MLfrBRY_9R65NvwpoJmwJ3JuI2xrF3TzQeTGZG0WT/exec"));
});

var liElements = document.querySelectorAll('#profile-menu .child-menu li');
liElements.forEach(li => {
  li.addEventListener('click', (e) => fetchData(e, "https://script.google.com/macros/s/AKfycbwGiAxM_6KK8T7qfRzZOLAIApa-1uLq9xm5iBe4ZyRDirHwTPmgoe4EkMYbNIAziFg/exec"));
});









function modifyTable() {
  const tableRows = document.querySelectorAll('#kintai-table tbody tr:not(:first-child)');

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
        availabilityCell.innerHTML = '<button class="adjusting">未提出</button>';
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
