// モーダルの表示・非表示
const modal = document.getElementById("myModal");
const btns = document.querySelectorAll(".request");
const span = document.getElementsByClassName("close")[0];

function showModal() {
  modal.style.display = "block";
}
function closeModal() {
  modal.style.display = "none";
}

// 全てのrequestボタンにイベントリスナーを追加
btns.forEach(element => {
    console.log("push")
    element.addEventListener('click', showModal);
});
span.onclick = closeModal;
window.onclick = function(event) {
  if (event.target == modal) {
    closeModal();
  }
}


// フォームの送信をハンドルする関数
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
    data["勤務開始時間"] = data["start_hour"] + ':' + data["start_minute"];
    data["勤務終了時間"] = data["end_hour"] + ':' + data["end_minute"];
    data["休憩時間"] = data["break_time"];
    // 補足・備考のテキストに追記
    data["remarks"] = "[教室から｜シフト依頼時]\n" + data["remarks"];
    console.log(data);
    const response = await fetch("", {
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