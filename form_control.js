// モーダルの表示・非表示
const modal = document.getElementById("myModal");
const span = document.getElementsByClassName("close")[0];

// requestボタンのアドイベントリスナーはschedule_get.jsで設定
// 全てのrequestボタンにイベントリスナーを追加  
// const btns = document.querySelectorAll(".request");
// btns.forEach((button) => {
//   button.addEventListener("click", showModal);
// });

// テーブルのボタンが押されたときに呼び出される関数
function showModal(event) {
    const button = event.target;
    const row = button.closest("tr");
  
    // 各列の値を取得
    workDate = row.cells[0].innerText;
    const availability = row.cells[1].innerText;
    const availableTime = row.cells[2].innerText;
    const remarks = row.cells[3].innerText;
    const requestStatus = row.cells[4].innerText;
  
    const title = document.querySelector('#myModal h3');
    title.textContent = `${workDate}｜[講師名]先生｜シフト依頼フォーム`;

    const submitSchedule = document.getElementById("submit-schedule");
    submitSchedule.getElementsByTagName("span")[0].textContent =`・スケジュール｜${availability}`
    submitSchedule.getElementsByTagName("span")[1].textContent =`・勤務可能時間｜${availableTime}`
    submitSchedule.getElementsByTagName("span")[2].textContent =`・補足・備考　｜${remarks}`

    // 依頼状況に応じてモーダルの依頼取り消しボタンを制御  
    if (requestStatus === "依頼修正") {
        cancelButton.style.display ="block";
    } else if (requestStatus === "新規依頼") {
        cancelButton.style.display ="none";
    }
  
    // モーダルを表示
    modal.style.display = "block";
  }


// モーダルの非表示設定
function closeModal() {
  modal.style.display = "none";
}

span.onclick = closeModal;
window.onclick = function(event) {
  if (event.target == modal) {
    closeModal();
  }
}


// フォームの送信をハンドルする関数
var workDate ="";
const handleSubmit = async (event) => {
    event.preventDefault(); // デフォルトの送信をキャンセル
    const form = document.querySelector('#myForm');
    const formData = new FormData(form);
    const data = {};
    // FormDataオブジェクトから連想配列に変換
    for (const [key, value] of formData.entries()) {
        data[key] = value;
    }
    // 勤務開始時間、終了時間、休憩時間をdataに追加
    data["勤務開始時間"] = data["start_hour"] + ':' + (data["start_minute"] === '0' ? '00' : data["start_minute"]);
    data["勤務終了時間"] = data["end_hour"] + ':' + (data["end_minute"] === '0' ? '00' : data["end_minute"]);
    data["休憩時間"] = data["break_time"];

    // 日本時間のタイムスタンプを追加
    data["submitted_timestamp"] = new Date().toLocaleString("ja-JP");

    // 勤務日を取得
    data["work_date"] = workDate;

    // 依頼取り消しを追加
    data["request_cancellation"] = false;
    // 補足・備考のテキストに追記
    data["remarks"] = "[教室から｜シフト依頼時]\n" + data["remarks"];
    console.log(data);
    const response = await fetch("https://script.google.com/macros/s/AKfycbwWfeARqEk-kQyWqXYMmnVuVmgTzE4fhe8tK425-9a5NC6UQ52K_44h0W2d-e3Egx4T/exec", {
        method: 'POST',
        headers: {
        'Content-Type': 'text/plain',
        },
        body: JSON.stringify(data),
        mode: 'cors', //CORS対応
    });

    const text = await response.text();
    if (text.includes("Success")) {
        console.log('データが正常に送信されました');
        form.reset(); // フォームの入力値をリセット
    } else {
        console.error(`エラーメッセージ: ${text}`);
    }
};
const form = document.querySelector('#myForm');
form.addEventListener('submit', handleSubmit);



// 依頼取り消しの操作
function handleRequestCancellation() {
    if (confirm("本当に依頼を取り消しますか？")) {
      const data = {
        "依頼取り消し": true,
        "work_date": workDate
      };
      console.log(data);
  
      // POSTリクエストを送信
      (async () => {
        const response = await fetch("https://script.google.com/macros/s/AKfycbwWfeARqEk-kQyWqXYMmnVuVmgTzE4fhe8tK425-9a5NC6UQ52K_44h0W2d-e3Egx4T/exec", {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain',
          },
          body: JSON.stringify(data),
          mode: 'cors',
        });
  
        const text = await response.text();
        if (text.includes("Success")) {
          console.log('データが正常に送信されました');
          form.reset(); // フォームの入力値をリセット
        } else {
          console.error(`エラーメッセージ: ${text}`);
        }
      })();
  
      closeModal();
    }
  }
  const cancelButton = document.getElementById("cancelButton");
  cancelButton.addEventListener('click', handleRequestCancellation);
  