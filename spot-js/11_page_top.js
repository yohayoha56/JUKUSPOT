function kintai_page(page_call_property) {};

// トップページのGASレスポンスを受け取った後に行う処理。
function top_page(page_call_property) {

  // テーブルの行の色をステータスに応じて変更
  // #region 
  const tableRows = document.querySelectorAll('#work-table tr:not(:first-child)');
  tableRows.forEach(row => {
    const rowColorFlag = row.querySelector('td:nth-child(2)').textContent;
    if (newData["ページタイプ"] == "school") {
      switch (rowColorFlag) {
        case "出勤報告済み": row.style["background-color"] = "#FFF2CC"; break;
        case "退勤報告済み": row.style["background-color"] = "#FFF2CC"; break;
      }
    } else if (newData["ページタイプ"] == "teacher") {
      switch (rowColorFlag) {
        case "出勤報告済み": row.style["background-color"] = "#FFF2CC"; break;
        case "退勤報告済み": row.style["background-color"] = "#CCF2F4"; break;
      }
    }
  });
  const tableRows2 = document.querySelectorAll('#shift-table-top tr:not(:first-child)');
  tableRows2.forEach(row => {
    const rowColorFlag = row.querySelector('td:nth-child(2)').textContent;
    if (newData["ページタイプ"] === "school") {
      switch (rowColorFlag) {
        case "勤務不可": row.style["background-color"] = "#dddddd"; break;
        case "調整中": row.style["background-color"] = "#FFF2CC"; break;
      }
    } else if (newData["ページタイプ"] === "teacher") {
      switch (rowColorFlag) {
        case "勤務不可": row.style["background-color"] = "#dddddd"; break;
        case "調整中": row.style["background-color"] = "#FFF2CC"; break;
        case "講師回答前": row.style["background-color"] = "#F4CCCC"; break;
      }
    }
  });
  // #endregion 

  

  // 出勤、退勤、、承認フォームの作成ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
  const table = document.getElementById("work-table")
  const rows = Array.from(table.querySelectorAll('tr:not(:first-child)'));
  const formsContainer = document.getElementById('forms-container');

  // 出勤フォームの表示条件に使う、今日の日付を定義（出勤日が今日以前だと、出勤フォームを作成。）
  const now = new Date();
  const nowInTokyo = new Date(now.toLocaleString('en-US', {timeZone: 'Asia/Tokyo'}));

  rows.forEach(row => {
    
    const date = row.querySelector('td:nth-child(1)').innerText;
    const nowStatus = row.querySelector('td:nth-child(2)').innerText;
    const teacherId = newData["ページタイプ"] == "school"? "" : newData["会員ID"];
    const teacherName = newData["ページタイプ"] == "school"?
        row.querySelector('td:nth-child(3)').innerText : newData["姓"]+newData["名"];
    const schoolId = newData["ページタイプ"] == "school"? newData["教室ID"] : "";
    const schoolName = newData["ページタイプ"] == "school"? 
        newData["教室名"] : row.querySelector('td:nth-child(3)').innerText;;
    const workTime = row.querySelector('td:nth-child(4)').innerText;
    const breakTime = row.querySelector('td:nth-child(5)').innerText;
    const remarks = row.querySelector('td:nth-child(6)').innerHTML;
    const rowDate = new Date(date+"T00:00:00+09:00");
    const newstart = row.dataset.newstart
    const newfin = row.dataset.newfin
    const newbreak = row.dataset.newbreak




    let formId, formTitle, formInfo, formGuide, formButton, newStatus

    if (newData["ページタイプ"] == "school" && nowStatus == '退勤報告済み') {
        //教室承認フォーム概要の定義
        formId = "approvalForm"
        formTitle = `${date}｜${teacherName}先生`
        formInfo = "勤務予定の内容"
        formGuide = "↓勤務時間の変更がある場合は記入してください"
        formButton = "勤務を承認する"
        newStatus = "教室承認済み"
    } else if (newData["ページタイプ"] == "teacher") {
    if (nowStatus == '勤務予定' && rowDate <= nowInTokyo) {
        //出勤報告フォーム概要の定義
        formId = "checkInForm"
        formTitle = `${date}｜出勤報告`
        formInfo = "勤務予定の内容"
        formGuide = "↓出勤報告をしてください"
        formButton = "出勤を報告する"
        newStatus = "出勤報告済み"

    } else if (nowStatus === '出勤報告済み') {
        //出勤報告フォーム概要の定義
        formId = "checkOutForm"
        formTitle = `${date}｜退勤報告`
        formInfo = "勤務予定の内容"
        formGuide = "↓退勤報告をしてください"
        formButton = "退勤を報告する"
        newStatus = "退勤報告済み"   
    } else {return;} } else {return;}
    

    // 勤怠ステータスの値によって、作成するフォームのを変更
    const formElements = [
        { name: "勤務日", type: "hidden", value: date },
        { name: "会員ID", type: "hidden", value: teacherId },
        { name: "講師名", type: "hidden", value: teacherName },
        { name: "教室ID", type: "hidden", value: schoolId },
        { name: "教室名", type: "hidden", value: schoolName },
        { name: "勤怠ステータス", type: "hidden", value: newStatus },
        { name: "勤務時間の変更", type: "select", value: "", flexbox: true, width: "100%", options: [
        { value: "", text: "選択してください" }, { value: "変更なし", text: "変更なし" }, { value: "変更あり", text: "変更あり" },
        ]},
        { name: "勤務開始時間", type: "time", value: "", inline: true, width: "160px" ,minHour: 8, maxHour: 22, stepMinute: 1},
        { name: "勤務終了時間", type: "time", value: "", inline: true, width: "160px" ,minHour: 8, maxHour: 22, stepMinute: 1},
        { name: "休憩時間", type: "minute", value: "", inline: true, width: "160px", minMinute: 0, maxMinute: 120, stepMinute: 1},
        { name: "補足・備考", type: "textarea", value: "",width: "100%",},
        { name: "submitButton", type: "submit", value: formButton },
    ];


    // #region フォームの作成ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
    // 挿入箇所=formContainerの定義
    const formContainer = document.createElement("div");
    formContainer.classList.add("form-container")
    formContainer.classList.add(formId+"-wrapper")

    // フォームタイトル、参考情報、ガイドの作成
    formContainer.innerHTML = `
      <h3>${formTitle}</h3>
      <h4>${formInfo}</h4>
      <ul>
        ${(newData["ページタイプ"] === "teacher") ? `<li>教室：${schoolName} </li>`:''}
        <li>勤務依頼時間：${workTime} </li>
        <li>休憩時間：${breakTime} </li>
        <li>備考・補足：<br>${remarks}</li>
      </ul>
    `;
    
    // フォーム要素を挿入
    const form = document.createElement("form");
    form.setAttribute("id", formId);
    formElements.forEach((element) => {
        form.appendChild(makeFormElement(element));
    });
    formContainer.appendChild(form)
    form.addEventListener("submit", (event) => handleSubmit3(event, remarks,row));

    // 挿入箇所=formContainerの定義
    formsContainer.appendChild(formContainer)

    // 表示設定
    form.querySelector("#勤務開始時間-wrapper").style.display="none"
    form.querySelector("#勤務終了時間-wrapper").style.display="none"
    form.querySelector("#休憩時間-wrapper").style.display="none"

    if(formId == "checkInForm"){
        form.querySelector("#勤務時間の変更-wrapper").style.display="none"
    }

    if(formId == "approvalForm" && newbreak!=""){
      form.querySelector("#勤務時間の変更-wrapper").innerHTML +='<span style="color:#800000;white-space:wrap">講師から勤務時間の変更申請があります。 修正の必要があれば、修正の上、「勤務を承認する」をクリックしてください。</span>'
      form.querySelector("#勤務時間の変更").value='変更あり'
      form.querySelector("#勤務時間の変更").style.display='none'
      form.querySelector("#勤務開始時間-wrapper").style.display="inline-block"
      form.querySelector("#勤務終了時間-wrapper").style.display="inline-block"
      form.querySelector("#休憩時間-wrapper").style.display="inline-block"
      form.querySelector("#勤務開始時間-wrapper #勤務開始時間_hour").value = newstart.split(":")[0];
      form.querySelector("#勤務開始時間-wrapper #勤務開始時間_minute").value = newstart.split(":")[1]== "00" ? "0" : newstart.split(":")[1];
      form.querySelector("#勤務終了時間-wrapper #勤務終了時間_hour").value = newfin.split(":")[0];
      form.querySelector("#勤務終了時間-wrapper #勤務終了時間_minute").value = newfin.split(":")[1]== "00" ? "0" : newfin.split(":")[1];
      form.querySelector("#休憩時間-wrapper #休憩時間").value = newbreak;
    }

    if(form.querySelector("#勤務時間の変更")){
      form.querySelector("#勤務時間の変更").addEventListener("change", function () {
          const timeChange = this.value;
          console.log(timeChange)
          if(timeChange == "変更あり"){
              console.log(this.parentNode)
              console.log(this.parentNode.parentNode)
              console.log(this.parentNode.parentNode.querySelector("#勤務開始時間-wrapper"))
              this.parentNode.parentNode.querySelector("#勤務開始時間-wrapper").style.display="inline-block"
              this.parentNode.parentNode.querySelector("#勤務終了時間-wrapper").style.display="inline-block"
              this.parentNode.parentNode.querySelector("#休憩時間-wrapper").style.display="inline-block"
          } else {
              this.parentNode.parentNode.querySelector("#勤務開始時間-wrapper").style.display="none"
              this.parentNode.parentNode.querySelector("#勤務終了時間-wrapper").style.display="none"
              this.parentNode.parentNode.querySelector("#休憩時間-wrapper").style.display="none"
          }
      });
    }
    
});



// フォームなしの時、見出し削除ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
const h2Element = document.querySelector("#forms-container h2");

if (!document.querySelector("#forms-container .form-container")) {
    h2Element.style.display = "none";
}


//お知らせを取得する 
fetch("https://script.google.com/macros/s/AKfycbxSfCODgSpHzlWAjOkvzQ2HUwjchLbm-uMXTdM6jAERj1E_qq8u0vbc21fIX5V8UKd7ig/exec", {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain',},
    body: JSON.stringify(page_call_property),
    mode: 'cors',
  })
  .then(response => response.text())
  .then(data => {
    const loadArea2 = document.getElementById("loading2")
    if(loadArea2){loadArea2.remove()}

    const newsArea = document.getElementById("news-log-area")
    newsArea.innerHTML = data;

    let messageElements = document.querySelectorAll(".news-message");
    messageElements.forEach((element) => {
        element.addEventListener("click", function() {
            let classroomName = this.innerText.replace(/\[.*?\]\s*/, "").trim(); // Remove the unread messages count and get the classroom name
            let classroomId = this.getAttribute("data-id"); // Get the classroom id from the data-id attribute

            page_call_property[isSchool ? "講師名" : "教室名"] = classroomName;
            page_call_property[isSchool ? "会員ID" : "教室ID"] = classroomId;
            page_call_property["callback"] = "chat_page";

            call_fetchData(page_call_property);
        });
    });
  });





async function handleSubmit3(event,remarks,row) {
  // フォーム送信時アクションの設定する関数ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
  event.preventDefault(); // デフォルトの送信をキャンセル
  const form = event.target;
  const formId =form.id
  const formData = new FormData(form);
  const data = {};
  // FormDataオブジェクトから連想配列に変換
  for (const [key, value] of formData.entries()) {
      data[key] = value;
  }

  clearValidationErrors(); // バリデーションをリフレッシュ
  // バリデーションチェックーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
  let isValid = true;
  switch (formId) {
    case 'approvalForm': 
      if (!data["勤務時間の変更"]){ isValid = false;
        showValidationError(form.querySelector("#勤務時間の変更-wrapper"), "変更有無の回答をしてください");
      } if(data["勤務時間の変更"] === "変更あり" &&( !data["勤務開始時間_hour"] || !data["勤務開始時間_minute"])){isValid = false;
        showValidationError(form.querySelector("#勤務開始時間-wrapper"), "有効な時間にしてください");
      } if(data["勤務時間の変更"] === "変更あり" &&( !data["勤務終了時間_hour"] || !data["勤務終了時間_minute"])){isValid = false;
        showValidationError(form.querySelector("#勤務終了時間-wrapper"), "有効な時間にしてください");
      } if(data["勤務時間の変更"] === "変更あり" && !data["休憩時間"]) {isValid = false;
        showValidationError(form.querySelector("#休憩時間-wrapper"), "有効な時間にしてください");
      }
      break;
    case 'checkInForm':
      break;
    case 'checkOutForm': 
      if (!data["勤務時間の変更"]){ isValid = false;
        showValidationError(form.querySelector("#勤務時間の変更-wrapper"), "変更有無の回答をしてください");
      } if(data["勤務時間の変更"] === "変更あり" &&( !data["勤務開始時間_hour"] || !data["勤務開始時間_minute"])){isValid = false;
        showValidationError(form.querySelector("#勤務開始時間-wrapper"), "有効な時間にしてください");
      } if(data["勤務時間の変更"] === "変更あり" &&( !data["勤務終了時間_hour"] || !data["勤務終了時間_minute"])){isValid = false;
        showValidationError(form.querySelector("#勤務終了時間-wrapper"), "有効な時間にしてください");
      } if(data["勤務時間の変更"] === "変更あり" && !data["休憩時間"]) {isValid = false;
        showValidationError(form.querySelector("#休憩時間-wrapper"), "有効な時間にしてください");
      }
      break;
    case 'answerForm':
      if (!data["講師回答"]){ isValid = false;
        showValidationError(form.querySelector("#講師回答-wrapper"), "勤務可否を回答してください");
      }
    ; break;
  }  

  if (isValid ==false){ return; }
// バリデーションの処理ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
function showValidationError(element, message) {
    const errorMessage = document.createElement("div");
    errorMessage.classList.add("error-message");
    errorMessage.textContent = message;
    errorMessage.style.color = "red";
    errorMessage.style.fontSize = "0.8rem";
    errorMessage.style.marginTop = "4px";
    element.appendChild(errorMessage);
    }
    
    function clearValidationErrors() {
    const errorMessages = document.getElementsByClassName("error-message");
    while (errorMessages[0]) {
        errorMessages[0].parentNode.removeChild(errorMessages[0]);
    }
}



  // データの整理ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー  
  data["フォームタイプ"] = formId
  data["タイムスタンプ"] = new Date().toLocaleString("ja-JP", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });


  let hosokutime = "";
  if(data["勤務開始時間_hour"]){
    data["勤務開始時間"] = data["勤務開始時間_hour"] + ':' 
      + (data["勤務開始時間_minute"] === '0' ? '00' : data["勤務開始時間_minute"]);
    data["勤務終了時間"] = data["勤務終了時間_hour"] + ':' 
      + (data["勤務終了時間_minute"] === '0' ? '00' : data["勤務終了時間_minute"]);

    hosokutime= `<span style="color:#800000;">${formId=="approvalForm"?"勤務時間修正有：":"勤務時間変更申請有："}${row.cells[3].innerText}（休：${row.cells[4].innerText}）→${data["勤務開始時間"]}〜${data["勤務終了時間"]}（休：${data["休憩時間"]}分）</span><br>`
  }

  let hosokuguide
  switch (formId) {
    case 'approvalForm': hosokuguide = " [↓教室：勤務承認時] "; break;
    case 'checkInForm': hosokuguide = " [↓講師：出勤報告時] "; break;
    case 'checkOutForm': hosokuguide = " [↓講師：退勤報告時] "; break;
  }  
  if(remarks=="-"){remarks=""}else{remarks=remarks+"<br>"}
  if(data["補足・備考"]!="" || hosokutime!=""){
    data["補足・備考"] = `${remarks}<span style="color:#0D5D63;">${hosokuguide}</span><br>${hosokutime}${data["補足・備考"]}`;
  } else {data["補足・備考"] = "-"}



  row.cells[1].innerText = data["勤怠ステータス"];
  row.cells[5].innerHTML = data["補足・備考"];
  row.style["background-color"] = "#FFF2CC";
  let h3Content = form.parentNode.querySelector('h3').textContent;
  form.parentNode.innerHTML = `<h3>${h3Content}</h3><p>提出が完了しました。</p>`;

  const response = await fetch("https://script.google.com/macros/s/AKfycbzoSyzV6hPn6CrVnon7fIErmmbo8qWi6bLiv0m3NsKKLolup6F01QR8Yd-zvQ8L_xo-/exec", {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
    },
    body: JSON.stringify(data),
    mode: 'cors', //CORS対応
  });

};


// モーダルの挿入ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
const modalTemplate = `
<div id="myModal" class="modal">
    <div class="modal-content form-container">
    </div>
</div>`;
document.getElementById("page-content").insertAdjacentHTML('beforeend', modalTemplate);
const modal = document.getElementById("myModal");


  // フォーム外がクリックされた時にフォームを非表示にする
  window.onclick = function (event) {
    if (event.target == modal) { modal.style.display = "none";}
  }

  // ngを含まない全てのrequestボタンにイベントリスナーを追加  
  const btns = document.querySelectorAll("#shift-table-top button:not(.ng)");
  btns.forEach((button) => {
    button.addEventListener("click", showModal);
  });
  // ngを含むボタンにイベントリスナーを追加
  const ngBtns = document.querySelectorAll("#shift-table-top button.ng");
  ngBtns.forEach((button) => {
    button.addEventListener("click", showNgModal);
  });

  function showNgModal(event) {

    const button = event.target;
    const row = button.closest("tr");
    const formFlag =event.target.classList
    console.log(formFlag)
    // ボタンが押された行のテーブルのデータを取得する①
    const date = row.cells[0].innerText;
    // フォームタイトルなどの定義
    let message =""
    let nganouncetext=""
    if (button.classList.contains("kinmuhuka")) {//ーーーーーーーーーー
      message=`＜${date}＞の勤務依頼をお願いしたいです。【勤務不可】から【調整中】に変更してください。`
      nganouncetext="講師の回答は「勤務不可」です。"
    } else if (button.classList.contains("iraihuka")) {//ーーーーーーーーーー
      message=`＜${date}＞の勤務依頼をお願いしたいです。【勤務不可】から【勤務可能】に変更してください。`
      nganouncetext="スケジュール回答は「勤務不可」です。"
    }

    let teacherId, teacherName ,schoolId, schoolName

    if (newData["ページタイプ"]=="school") {
        teacherId = "" 
        teacherName = row.cells[2].innerText
        schoolId = newData["教室ID"]
        schoolName = newData["教室名"] 
    } else if (newData["ページタイプ"]=="teacher") {
        teacherId = newData["会員ID"];
        teacherName =newData["姓"]+ newData["名"];
        schoolId = "";
        schoolName = row.cells[2].innerText
    }

    const chatSubmitAreaHTML =`
    <span class="close closeButton">&times;</span>
    <div class="chat-submit-area" style="padding: 10px 0;" >
        <form id="chatForm">
            <p style="padding:10px 0;font-weight:bold;" class="ng-anounce"></p>
            <p style="padding:10px 0:"><i class="fa-solid fa-circle-arrow-down"></i>こちらから講師に変更依頼のメッセージを送れます。<br>必要に応じて修正し、送信ボタンを押してください。</p>
            <input type="hidden" id="会員ID" name="会員ID" value="${teacherId}"><input type="hidden" id="講師名" name="講師名" value="${teacherName}"> 
            <input type="hidden" id="教室ID" name="教室ID" value="${schoolId}"><input type="hidden" id="教室名" name="教室名" value="${schoolName}"> 
            <div class="form-box" id="メッセージ-wrapper"  style="width:100%;"> 
                <textarea id="メッセージ" name="メッセージ" rows="4" cols="50"></textarea> 
            </div>
            <div class="form-box" id="chatButton-wrapper" style=""> 
                <input type="submit" value="送信" class="submit-button"> 
            </div>
        </form>
    </div>
    `
    const formContainer = modal.querySelector('.form-container');
    formContainer.innerHTML = chatSubmitAreaHTML;

    const messageInput = document.querySelector('#メッセージ');
    messageInput.value = message;

    const nganounce = document.querySelector('.ng-anounce');
    nganounce.innerHTML =nganouncetext


    modal.style.display = "block";
    const closeButton = document.getElementsByClassName("close")[0];
    closeButton.onclick = () => {
        modal.style.display = "none";
    };

    // チャットの送信機能、メッセージ生成機能の追加ーーーーーーーーーーーーーー
    const form = document.getElementById("chatForm")

    form.addEventListener("submit", (event) => handleSubmit2(event));

  }

  async function handleSubmit2(event) {
    // フォーム送信時アクションの設定する関数ーーーーーーーーーーーーーーーーーーーーーーーー
    event.preventDefault(); // デフォルトの送信をキャンセル
    const form = event.target;
    const formData = new FormData(form);
    const data = {};
    // FormDataオブジェクトから連想配列に変換
    for (const [key, value] of formData.entries()) {  data[key] = value;}
    // メッセージが未入力、もしくはスペースや改行のみの場合はスクリプトを終了
    if (!data["メッセージ"] || data["メッセージ"].trim() === '') { return;}
    // データの整理ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー 
    data["ページタイプ"] = newData["ページタイプ"]
    data["タイムスタンプ"] = new Date().toLocaleString("ja-JP", {
        year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit", second: "2-digit",
    });
    // get the response body
    const submitButtonWrapper = document.querySelector("#chatButton-wrapper");
    const messageElement = document.createElement("p");
    messageElement.textContent = "送信中です。送信完了すると閉じます";
    submitButtonWrapper.after(messageElement);
    
    setTimeout(() => {
      // モーダルを閉じるコード
      const modal = document.getElementById("myModal");
      modal.style.display = "none";
    }, 3000);
    // データの送信ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー 
    const response = await fetch( "https://script.google.com/macros/s/AKfycbx0ERuKrsfIl_ci92tlFNJEP41w1bUo1vunwYy7Na2Sto87tq84Th27Iea76c4cgRpR/exec", {
        method: 'POST',
        headers: {
        'Content-Type': 'text/plain',
        },
        body: JSON.stringify(data),
        mode: 'cors', //CORS対応
    });

    

  };  



// 特に、講師名や教室名が追加されるので、その行ずれに注意をする必要がある。
function showModal(event) {

    // クリック要素の情報を取得
    const button = event.target;
    const row = event.target.closest("tr");
    const date = row.cells[0].innerText;

    const formFlag =event.target.classList
    const remarks = row.cells[5].innerHTML; 

    let teacherId, teacherName ,schoolId, schoolName , formId, formTitle, formInfo, formGuide, formButton

    if (formFlag.contains("change")) {
        teacherId = "" 
        teacherName = row.cells[2].innerText
        schoolId = newData["教室ID"]
        schoolName = newData["教室名"] 
        formId = "changeForm"
        formTitle = `${date}｜${teacherName}先生｜依頼修正`
        formInfo = "依頼中のシフト内容"
        formButton = "シフトを修正する"
    } else if (formFlag.contains("answer")) {
        teacherId = newData["会員ID"];
        teacherName =newData["姓"]+ newData["名"];
        schoolId = "";
        schoolName = row.cells[2].innerText
        formId = "answerForm"
        formTitle = `${date}｜${schoolName}｜依頼回答`
        formInfo = "教室からの依頼内容"
        formButton = "回答を提出する"
    }


    // フォーム要素のデフォルト定義
    const formElements = [
        { name: "勤務日", type: "hidden", value: date },
        { name: "フォームタイプ", type: "hidden", value: formId },
        { name: "会員ID", type: "hidden", value: teacherId },
        { name: "講師名", type: "hidden", value: teacherName },
        { name: "教室ID", type: "hidden", value: schoolId },
        { name: "教室名", type: "hidden", value: schoolName }, //ここからカスタムを挿入
        { name: "補足・備考", type: "textarea", value: "", width: "100%", },
        { name: "submitButton", type: "submit", value: formButton, width: "100%"  }, //ボタンテキスト変更
    ];

    // フォーム要素のカスタム定義
    if (formFlag.contains("change")) {
      let addElement1 = 
        { name: "依頼取り消し", type: "select", value: "", inline: true, width: "100%", breakAfter: true, options: [
          { value: "依頼を取り消す", text: "依頼を取り消す" },{ value: "", text: "依頼を修正する" },]}
      let addElement2 = 
        { name: "勤務開始時間", type: "time", value: "", inline: true, width: "160px", minHour: 8, maxHour: 22, stepMinute: 10 }
      let addElement3 = 
        { name: "勤務終了時間", type: "time", value: "", inline: true, width: "160px", minHour: 8, maxHour: 22, stepMinute: 10 }
      let addElement4 = 
        { name: "休憩時間", type: "minute", value: "", inline: true, width: "160px", minMinute: 0, maxMinute: 120, stepMinute: 10 }
      formElements.splice(6, 0, addElement1, addElement2, addElement3, addElement4,);
    } else if (formFlag.contains("answer")) {
        let addElement1 = 
          { name: "講師回答", type: "select", value: "", inline: true, width: "180px", breakAfter: true, options: [
              { value: "", text: "選択してください" },{ value: "勤務確定", text: "勤務確定" },
              { value: "勤務不可", text: "勤務不可" },{ value: "調整中", text: "調整中" },]}
        formElements.splice(6, 0, addElement1);
    }
  
    // フォーム外枠の作成
    const formContainer = document.querySelector(".modal-content.form-container");
    formContainer.innerHTML = `
      <span class="close closeButton">&times;</span>
      <h3>${formTitle}</h3>
      <h4>${formInfo}</h4>
      <ul>
        <li>講師の回答　｜${row.cells[1].innerText}</li>
        <li>勤務依頼時間｜${row.cells[3].innerText}（休：${row.cells[4].innerText}）</li>
        <li>補足・備考　｜${row.cells[5].innerHTML}</li>
      </ul>
    `;

    // フォーム中身の作成
    const form = document.createElement("form");
    form.setAttribute("id", formId);
    formElements.forEach((element) => {
      form.appendChild(makeFormElement(element));
    });
    formContainer.appendChild(form)
    form.addEventListener("submit", (event) => handleSubmit(event, remarks, row));


    // モーダル非表示スクリプト
    modal.style.display = "block";
    const closeButton = document.getElementsByClassName("close")[0];
    closeButton.onclick = () => {
      modal.style.display = "none";
    };

    if (formFlag.contains("change")){
      changeFormAdd();
    }


    // フォームの回答状況に応じたアラート表示スクリプト
    function showWorkStatusAlert(element,classname, message) {
      const alertMessage = document.createElement("div");
      alertMessage.className = classname;
      alertMessage.style.color = "red";
      alertMessage.style.fontSize = "0.8rem";
      alertMessage.style.marginTop = "4px";
      alertMessage.innerHTML = message;
      element.prepend(alertMessage);
    }

    function changeFormAdd(){
      const cancellationWrapper = document.getElementById("依頼取り消し-wrapper");
      showWorkStatusAlert(cancellationWrapper, "work-status-alert", "▼ 依頼修正時は、「依頼を修正する」を選択してください");
      const startTimeWrapper = document.getElementById("勤務開始時間-wrapper");
      const endTimeWrapper = document.getElementById("勤務終了時間-wrapper");
      const breakTimeWrapper = document.getElementById("休憩時間-wrapper");
      startTimeWrapper.style.display = "none";
      endTimeWrapper.style.display = "none";    
      breakTimeWrapper.style.display = "none";

      const cancellationSelect = document.querySelector('[name="依頼取り消し"]');
      cancellationSelect.addEventListener("change", function () {
        const cancellationStatus = this.value;
        if (cancellationStatus === "") {
          const alertMessages = document.querySelectorAll(".work-status-alert");
          alertMessages.forEach(element => { element.style.display = "none"; });
          startTimeWrapper.style.display = "block";
          endTimeWrapper.style.display = "block";
          breakTimeWrapper.style.display = "block";

        } else {
          const alertMessages = document.querySelectorAll(".work-status-alert");
          alertMessages.forEach(element => { element.style.display = "block"; });
          startTimeWrapper.style.display = "none";
          endTimeWrapper.style.display = "none";    
          breakTimeWrapper.style.display = "none";
        }
      });

      const submitButton = document.querySelector(".submit-button");
      submitButton.value = "修正内容を確認";
      submitButton.type = "button";

      submitButton.addEventListener("click", function() {
        // フォームデータの取得
        const formData = new FormData(form);
        const data = {};
        for (const [key, value] of formData.entries()) {
          data[key] = value;
        }
        // バリデーションチェック
        const isValid = validateForm(data, formId);
        if (isValid == false) { return; }

        setTimeout(() => {
          this.value = "シフトを修正する";
          this.type = "submit";
          const alertArea = document.getElementById("submitButton-wrapper");
          showWorkStatusAlert(alertArea, "is-confirmde-alert" , "【まだ完了していません】シフト確定後、講師との合意のないシフト修正・シフト取消は、法律上休業補償が必要となる場合があります。<br>特に、前日・当日については、電話で必ず合意を取ってください。");
        }, 500);  // 1秒後に実行
      });
    }

    if (button.classList.contains("is-ng")) {//ーーーーーーーーーー
      const alertArea = document.getElementById("answerForm");
      showWorkStatusAlert(alertArea, "is-ng-alert" , "教室に勤務不可と伝えているシフトです。<br>トラブル防止のため、一度【勤務不可】と回答したシフトを変更する際は、事前に教室の了承を得るようにして下さい");
    }
}


const validateForm = (data, form) => {
  // バリデーション事前定義ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
  function showValidationError(element, message) {
    const errorMessage = document.createElement("div");
    errorMessage.classList.add("error-message");
    errorMessage.textContent = message;
    errorMessage.style.color = "red";
    errorMessage.style.fontSize = "0.8rem";
    errorMessage.style.marginTop = "4px";
    element.appendChild(errorMessage);
  }

  function clearValidationErrors() {
    const errorMessages = document.getElementsByClassName("error-message");
    while (errorMessages[0]) {
      errorMessages[0].parentNode.removeChild(errorMessages[0]);
    }
  }

  clearValidationErrors(); // バリデーションをリフレッシュ
  let isValid = true;

  if (form.id=="changeForm" && data["依頼取り消し"] == "依頼を取り消す") {
      data["取り消し"] = true;
  } else if(form.id=="changeForm" ){
      if (!data["勤務開始時間_hour"] || !data["勤務開始時間_minute"]) {
          isValid = false;
          showValidationError(document.getElementById("勤務開始時間-wrapper"), "有効な時間にしてください");
        } if (!data["勤務終了時間_hour"] || !data["勤務終了時間_minute"]) {
          isValid = false;
          showValidationError(document.getElementById("勤務終了時間-wrapper"), "有効な時間にしてください");
          var startTime = parseInt(data["勤務開始時間_hour"]) * 60 + parseInt(data["勤務開始時間_minute"]);
          var endTime = parseInt(data["勤務終了時間_hour"]) * 60 + parseInt(data["勤務終了時間_minute"]);
          if (startTime >= endTime) {
            isValid = false;
            showValidationError(document.getElementById("勤務終了時間-wrapper"), "終了時間は開始時間より後に設定してください");
          }
        } if (!data["休憩時間"]) {
          isValid = false;
          showValidationError(document.getElementById("休憩時間-wrapper"), "有効な時間にしてください");
        }
  }
  // 回答フォームの場合
  if (form.id=="answerForm" && !data["講師回答"]) {
      isValid = false;
      showValidationError(document.getElementById("講師回答-wrapper"), "勤務可否を回答してください");
  }
  return isValid
}



const handleSubmit = async (event, remarks, row) => {
    // フォーム送信時アクションの設定する関数ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
    event.preventDefault(); // デフォルトの送信をキャンセル
    const form = event.target;
    const formId = form.id //⭐️⭐️⭐️
    const formData = new FormData(form);
    const data = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }
    
    // バリデーションチェック
    const isValid = validateForm(data, form);
    if (isValid == false) { return; }


    // データの整理ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
    data["勤務開始時間"] = data["勤務開始時間_hour"] + ':'
      + (data["勤務開始時間_minute"] === '0' ? '00' : data["勤務開始時間_minute"]);
    data["勤務終了時間"] = data["勤務終了時間_hour"] + ':'
      + (data["勤務終了時間_minute"] === '0' ? '00' : data["勤務終了時間_minute"]);

    data["フォームタイプ"] = formId
    data["タイムスタンプ"] = new Date().toLocaleString("ja-JP", {
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    });

    let hosokuguide
    switch (form.id) {
      case 'changeForm': hosokuguide = data["取り消し"] == true?" [↓教室：依頼取消時] ":" [↓教室：依頼修正時] "; break;
      case 'answerForm': hosokuguide = " [↓講師：シフト回答時] "; break;
    }
    if (remarks == "-") { remarks = "" } else { remarks = remarks + "<br>" }
    if (data["補足・備考"] != "") {
      data["補足・備考"] = `${remarks}<span style="color:#0D5D63;">${hosokuguide}</span><br>${data["補足・備考"]}`;
    } else { data["補足・備考"] = "-" }


    // 送信結果の事前表示
    if (form.id == "changeForm") {
        if (data["取り消し"] == true) {
          row.cells[6].innerText = "取り消し済み";
          row.style["background-color"] = "rgb(221, 221, 221)";
        } else {
          row.cells[3].innerText = data["勤務開始時間"] + "〜" + data["勤務終了時間"];
          row.cells[4].innerText = data["休憩時間"] + "分";
          row.cells[5].innerHTML = data["補足・備考"];
          row.cells[6].innerText = "修正済み";
          row.style["background-color"] = "#FFF2CC";
        }
    }
    if (form.id == "answerForm") {
        row.cells[1].innerText = data["講師回答"];
        row.cells[5].innerHTML = data["補足・備考"];
        row.cells[6].innerText = "回答済み";
        row.style["background-color"] = "#FFF2CC";
    }

    
    fetchdata(data)
    modal.style.display = "none";

};


function fetchdata(data){
    // データの送信処理
    fetch("https://script.google.com/macros/s/AKfycbzoSyzV6hPn6CrVnon7fIErmmbo8qWi6bLiv0m3NsKKLolup6F01QR8Yd-zvQ8L_xo-/exec", {
    method: 'POST',
    headers: {
        'Content-Type': 'text/plain',
    },
    body: JSON.stringify(data),
    mode: 'cors', //CORS対応
    });
}


}