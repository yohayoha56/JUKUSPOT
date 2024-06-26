// トップページのGASレスポンスを受け取った後に行う処理。
function chat_page(page_call_property) {
  console.log("chat_page function started", page_call_property);

  // スクロールエリア
  const scrollArea = document.querySelector('.chat-log-area');
  scrollArea.scrollTop = scrollArea.scrollHeight;
  console.log("Scroll area adjusted");

  // 講師の電話番号出力
  const phoneNumber = document.getElementById("call-number")
  const phoneNumberHTML = `
    <div class="phoneArea" style="background:rgb(255, 242, 204);padding:4px 12px;">
      <p><span>⚠️</span>急ぎの連絡の場合は、${ newData["ページタイプ"]== "school" ? "講師の携帯番号" : "教室の電話番号"}<span>${phoneNumber.innerHTML}</span>に直接ご連絡ください</p>
    </div>
  `
  if(document.querySelector("phoneArea")){document.querySelector("phoneArea").remove()}
  scrollArea.insertAdjacentHTML("beforebegin",phoneNumberHTML);
  phoneNumber.remove();
  console.log("Phone number area updated");

  // メッセージ提出フォームに初期値の付与
  const form = document.getElementById("chatForm")
  const hiddenElements = form.querySelectorAll(":scope > input")
  for( let hiddenElement of hiddenElements){
    const id = hiddenElement.id
    hiddenElement.value=page_call_property[id]
    console.log(`Set hidden input ${id} to ${page_call_property[id]}`);
  }
  
  // メッセージリロードボタンの設定
  const reloadButton = document.querySelector('.reload-button');
  reloadButton.addEventListener('click', handleReloadButtonClick);
  function handleReloadButtonClick() {
    console.log("Reload button clicked");
    call_fetchData(page_call_property);
  }

  // メッセージエリアの設定
  let textarea = document.getElementById('メッセージ');
  textarea.addEventListener('focus', function() {
    this.classList.add('expanded');
    console.log("Textarea focused and expanded");
  });
  textarea.addEventListener('blur', function() {
    if (this.value == "") {
      this.classList.remove('expanded');
      console.log("Textarea blurred and contracted");
    }
  });
  textarea.addEventListener('input', function() {
    this.classList.add('expanded');
    console.log("Textarea input detected and expanded");
  });

  // チャットの送信機能、メッセージ生成機能の追加
  form.addEventListener("submit", (event) => handleSubmit(event));

  async function handleSubmit(event) {
    console.log("handleSubmit function called");
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }
    console.log("Form data:", data);

    if (!data["メッセージ"] || data["メッセージ"].trim() === '') {
      console.log("Empty message, returning");
      return;
    }

    // データの整理
    data["ページタイプ"] = newData["ページタイプ"]
    data["タイムスタンプ"] = new Date().toLocaleString("ja-JP", {
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    });
    console.log("Processed data:", data);

    // メッセージの出力
    let date = new Date(data["タイムスタンプ"]);
    let formattedDate = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
    console.log("Formatted date:", formattedDate);

    const dayElements = document.querySelectorAll(".day-line .date-text");
    let addHTML =""
    if (dayElements.length > 0 && formattedDate !== dayElements[dayElements.length -1].textContent) {
      addHTML +=`<div class="day-line"><hr>
                  <span class="date-text">${formattedDate}</span>
                <hr></div>`;
      console.log("New day line added");
    }

    let timestamp = date.getHours() + ":" + ("0" + date.getMinutes()).slice(-2);
    let icon = data["ページタイプ"]== "school" ? "fa-solid fa-school" : "fas fa-user";

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
    scrollArea.scrollTop = scrollArea.scrollHeight;
    console.log("Message added to chat area");
    
    const textarea = document.getElementById("メッセージ");
    textarea.value = "";
    textarea.classList.remove('expanded');
    console.log("Textarea cleared and contracted");

    // データの送信
    try {
      console.log("Sending data to server...");
      const response = await fetch("https://script.google.com/macros/s/AKfycbx0ERuKrsfIl_ci92tlFNJEP41w1bUo1vunwYy7Na2Sto87tq84Th27Iea76c4cgRpR/exec", {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(data),
        mode: 'cors',
      });
      console.log("Server response:", response);
      const responseData = await response.json();
      console.log("Response data:", responseData);
    } catch (error) {
      console.error("Error in fetch:", error);
    }
  }

  // 既読処理の実行
  readCheck(form);

  async function readCheck(form) {
    console.log("readCheck function called");
    const formData = new FormData(form);
    const data = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }
    console.log("Read check data:", data);
  
    data["ページタイプ"] = newData["ページタイプ"]
    data["既読フラグ"] = true
    console.log("Processed read check data:", data);

    try {
      console.log("Sending read check data to server...");
      const response = await fetch("https://script.google.com/macros/s/AKfycbx_CTJEdTTBdVyIpAvzN4zDz2zXcydnP4cXwSk-hZfm-0iWUImJ3VcXcce2JBfGa5wdBw/exec", {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(data),
        mode: 'cors',
      });
      console.log("Server response for read check:", response);
      const responseData = await response.json();
      console.log("Read check response data:", responseData);
    } catch (error) {
      console.error("Error in read check fetch:", error);
    }
  }
}
