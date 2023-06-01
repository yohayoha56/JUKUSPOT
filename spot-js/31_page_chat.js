// トップページのGASレスポンスを受け取った後に行う処理。
function chat_page(page_call_property) {

// 出勤フォームの表示用に今日の日付を定義
const now = new Date();
const nowInTokyo = new Date(now.toLocaleString('en-US', {timeZone: 'Asia/Tokyo'}));

const form = getElementById("chatForm")
form.addEventListener("submit", (event) => handleSubmit(event));

const hiddenElements = form.querySelectorAll("input")
for( let hiddenElement of hiddenElements){
    const id = hiddenElement.id
    hiddenElement.value=newData["id"]
}



async function handleSubmit(event) {
  // フォーム送信時アクションの設定する関数ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
  event.preventDefault(); // デフォルトの送信をキャンセル
  const form = event.target;
  const formData = new FormData(form);
  const data = {};
  // FormDataオブジェクトから連想配列に変換
  for (const [key, value] of formData.entries()) {
      data[key] = value;
  }

  // データの整理ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー  
  data["タイムスタンプ"] = new Date().toLocaleString("ja-JP", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });

  const response = await fetch("https://script.google.com/macros/s/AKfycbwWfeARqEk-kQyWqXYMmnVuVmgTzE4fhe8tK425-9a5NC6UQ52K_44h0W2d-e3Egx4T/exec", {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
    },
    body: JSON.stringify(data),
    mode: 'cors', //CORS対応
  });

};

}