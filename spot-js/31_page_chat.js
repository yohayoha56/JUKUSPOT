// トップページのGASレスポンスを受け取った後に行う処理。
function chat_page(page_call_property) {


// メッセージ提出フォームに初期値の付与
const form = document.getElementById("chatForm")
const hiddenElements = form.querySelectorAll(":scope > input")
for( let hiddenElement of hiddenElements){
    const id = hiddenElement.id
    hiddenElement.value=page_call_property[id]
}

// 既読処理の実行（⭐️メッセージ提出フォームの初期値の付与の後）
readCheck(form)


// チャットの送信機能、メッセージ生成機能の追加
form.addEventListener("submit", (event) => handleSubmit(event));

  
// 更新するボタンの設定
const reloadButton = document.querySelector('.reload-button');
reloadButton.addEventListener('click', handleReloadButtonClick);
function handleReloadButtonClick() {
    call_fetchData(page_call_property);
}




async function handleSubmit(event) {
    // フォーム送信時アクションの設定する関数ーーーーーーーーーーーーーーーーーーーーーーーー
    event.preventDefault(); // デフォルトの送信をキャンセル
    const form = event.target;
    const formData = new FormData(form);
    const data = {};
    // FormDataオブジェクトから連想配列に変換
    for (const [key, value] of formData.entries()) {
        data[key] = value;
    }

    // データの整理ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー 
    data["ページタイプ"] = newData["ページタイプ"]
    data["タイムスタンプ"] = new Date().toLocaleString("ja-JP", {
        year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit", second: "2-digit",
    });

    // メッセージの出力ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー

    // メッセージの日付を取得
    let date = new Date(data["タイムスタンプ"]);
    let formattedDate = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();

    // メッセージの最後の日付を取得
    const dayElements = document.querySelectorAll(".day-line .date-text");
    const lastDate = dayElements[dayElements.length -1].textContent
    let addHTML


    // 日付が初めてのものであれば、<div class="day-line">を追加
    if (formattedDate !== lastDate) {
        addHTML +=`<div class="day-line"><hr>
                    <span class="date-text">${formattedDate}</span>
                <hr></div>`;
        previousDate = formattedDate;
    }

    // メッセージの送信者によってclassを設定、　既読フラグでフラグ設定、　提出時刻（時分）

    let timestamp = date.getHours() + ":" + ("0" + date.getMinutes()).slice(-2);
    let icon = data["ページタイプ"]== "school" ? "fa-solid fa-school" : "fas fa-user";


    // メッセージHTMLを追加
    addHTML +=`<div class="chat-log sent">
                <div class="icon-box"><div class="icon-container"><i class="${icon}"></i></div></div>
                <div class="chat-box">${data["メッセージ"]}</div>
                <div class="info-box">
                <span class="read-flag">  </span>
                <span class="timestamp">${timestamp}
                </span></div>
            </div>`;

    const chatArea = document.querySelector(".chat-log-area")
    chatArea.insertAdjacentHTML("beforeend",addHTML)
    
    const textarea = document.getElementById("メッセージ");
    textarea.value = "";


    // データの送信ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー 

    const response = await fetch( "https://script.google.com/macros/s/AKfycbwc5wu1HOL0RkT7WOWO5jrLbVBskvNEiqV8gwias6gMCs0yFCSW45t6-lp8VbelwRl3/exec", {
        method: 'POST',
        headers: {
        'Content-Type': 'text/plain',
        },
        body: JSON.stringify(data),
        mode: 'cors', //CORS対応
    });

};


async function readCheck(form) {
    // フォーム送信時アクションの設定する関数ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
    const formData = new FormData(form);
    const data = {};
    // FormDataオブジェクトから連想配列に変換
    for (const [key, value] of formData.entries()) {
        data[key] = value;
    }
  
    // データの整理ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー 
    data["ページタイプ"] = newData["ページタイプ"]
    data["既読フラグ"] = true

    // データの送信ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー 
  
    const response = await fetch( "https://script.google.com/macros/s/AKfycbwc5wu1HOL0RkT7WOWO5jrLbVBskvNEiqV8gwias6gMCs0yFCSW45t6-lp8VbelwRl3/exec", {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify(data),
      mode: 'cors', //CORS対応
    });
  
};

}