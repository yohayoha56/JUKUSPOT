function kintai_page() {};
function profile_page() {};

// トップページのGASレスポンスを受け取った後に行う処理。
function top_page() {
// フォームの作成ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
const table = document.getElementById("work-table")
const rows = Array.from(table.querySelectorAll('tr:not(:first-child)'));
const formsContainer = document.getElementById('forms-container');
// 出勤フォームの表示用に今日の日付を定義
const now = new Date();
const nowInTokyo = new Date(now.toLocaleString('en-US', {timeZone: 'Asia/Tokyo'}));

rows.forEach(row => {
    
    const date = row.querySelector('td:nth-child(1)').innerText;
    const nowStatus = row.querySelector('td:nth-child(2)').innerText;
    const teacherId = newData["ページタイプ"] == "school"?"":newData["会員ID"];
    const teacherName = newData["ページタイプ"] == "school"?
        row.querySelector('td:nth-child(3)').innerText : newData["姓"]+ newData["名"];
    const schoolId = newData["ページタイプ"] == "school"?newData["教室ID"]:"";
    const schoolName = newData["ページタイプ"] == "school"? 
        newData["教室名"] : row.querySelector('td:nth-child(3)').innerText;;
    const workTime = row.querySelector('td:nth-child(4)').innerText;
    const breakTime = row.querySelector('td:nth-child(5)').innerText;
    const remarks = row.querySelector('td:nth-child(6)').innerText;

    const rowDate = new Date(date+"T00:00:00+09:00");

    let formId, formTitle, formInfo, formGuide, formButton, newStatus

    console.log(rowDate)
    console.log(nowInTokyo)
    console.log(newData["ページタイプ"])
    console.log(nowStatus)

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
        formTitle = `${date}｜${schoolName}｜出勤報告`
        formInfo = "勤務予定の内容"
        formGuide = "↓出勤報告をしてください"
        formButton = "出勤を報告する"
        newStatus = "出勤報告済み"

    } else if (nowStatus === '出勤報告済み') {
        //出勤報告フォーム概要の定義
        formId = "checkOutForm"
        formTitle = `${date}｜${schoolName}｜退勤報告`
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
        { value: "", text: "選択してください" },
        { value: "変更なし", text: "変更なし" },
        { value: "変更あり", text: "変更あり" },
        ]},
        { name: "勤務開始時間", type: "time", value: "", inline: true, width: "160px" ,minHour: 8, maxHour: 22, stepMinute: 10},
        { name: "勤務終了時間", type: "time", value: "", inline: true, width: "160px" ,minHour: 8, maxHour: 22, stepMinute: 10},
        { name: "休憩時間", type: "minute", value: "", inline: true, width: "160px", minMinute: 0, maxMinute: 120, stepMinute: 10},
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
    form.addEventListener("submit", (event) => handleSubmit(event, remarks,row));

    // 挿入箇所=formContainerの定義
    formsContainer.appendChild(formContainer)


    // 表示設定
    form.querySelector("#勤務開始時間-wrapper").style.display="none"
    form.querySelector("#勤務終了時間-wrapper").style.display="none"
    form.querySelector("#休憩時間-wrapper").style.display="none"
    if(formId == "checkInForm"){
        form.querySelector("#勤務時間の変更-wrapper").style.display="none"
    }
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
    
});



// フォームなしの時、見出し削除ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
const h2Element = document.querySelector("#forms-container h2");

if (!document.querySelector("#forms-container .form-container")) {
    h2Element.style.display = "none";
}



async function handleSubmit(event,remarks,row) {
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
      } if(data["勤務時間の変更"] === "変更あり" &&( !data["勤務開始時間_hour"] || !data["勤務開始時間_hour"])){isValid = false;
        showValidationError(form.querySelector("#勤務開始時間-wrapper"), "有効な時間にしてください");
      } if(data["勤務時間の変更"] === "変更あり" &&( !data["勤務終了時間_hour"] || !data["勤務終了時間_hour"])){isValid = false;
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
      } if(data["勤務時間の変更"] === "変更あり" &&( !data["勤務開始時間_hour"] || !data["勤務開始時間_hour"])){isValid = false;
        showValidationError(form.querySelector("#勤務開始時間-wrapper"), "有効な時間にしてください");
      } if(data["勤務時間の変更"] === "変更あり" &&( !data["勤務終了時間_hour"] || !data["勤務終了時間_hour"])){isValid = false;
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

    hosokutime= `
    <span style="color:#800000;">
      ${formId=="approvalForm"?"勤務時間修正有：":"勤務時間変更申請有："}
      ${row.cells[3].innerText}（休：${row.cells[4].innerText}）→${data["勤務開始時間"]}〜${data["勤務終了時間"]}（休：${data["休憩時間"]}）
    </span><br>
    `
  }

  let hosokuguide
  switch (formId) {
    case 'approvalForm': hosokuguide = " [↓教室：勤務承認時] "; break;
    case 'checkInForm': hosokuguide = " [↓講師：出勤報告時] "; break;
    case 'checkOutForm': hosokuguide = " [↓講師：退勤報告時] "; break;
  }  
  if(remarks=="-"){remarks=""}else{remarks=remarks+"<br>"}
  if(data["補足・備考"]!=""){
    data["補足・備考"] = `${remarks}<span style="color:#0D5D63;">${hosokuguide}</span><br>${hosokutime}${data["補足・備考"]}`;
  } else {data["補足・備考"] = "-"}



  row.cells[1].innerText = data["勤怠ステータス"];
  row.cells[5].innerHTML = data["補足・備考"];
  row.style["background-color"] = "#FFF2CC";
  let h3Content = form.parentNode.querySelector('h3').textContent;
  form.parentNode.innerHTML = `<h3>${h3Content}</h3><p>提出が完了しました。</p>`;

  const response = await fetch("https://script.google.com/macros/s/AKfycbwWfeARqEk-kQyWqXYMmnVuVmgTzE4fhe8tK425-9a5NC6UQ52K_44h0W2d-e3Egx4T/exec", {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
    },
    body: JSON.stringify(data),
    mode: 'cors', //CORS対応
  });


  // const submitButton = document.querySelector(".submit-button");
  // const responseMessage = document.createElement("div");
  // responseMessage.classList.add("response-message");

  // // フォームの無効化とボタンの色を変更
  // form.querySelectorAll("input, button").forEach((element) => element.setAttribute("disabled", "disabled"));
  // submitButton.style.backgroundColor = "#aaaaaa";
  
  // try {
  //   // データの送信
  //   const response = await fetch("https://script.google.com/macros/s/AKfycbwWfeARqEk-kQyWqXYMmnVuVmgTzE4fhe8tK425-9a5NC6UQ52K_44h0W2d-e3Egx4T/exec", {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'text/plain',
  //     },
  //     body: JSON.stringify(data),
  //     mode: 'cors', //CORS対応
  //   });
  
  //   const text = await response.text();
  //   if (text.includes("Success")) {
  //     responseMessage.textContent = "提出が完了しました";
  //     responseMessage.style.color = "green";
  //     form.reset(); // フォームの入力値をリセット
  //     call_fetchData(page_call_property); // レスポンスを受け取り次第、call_fetchData を起動
  //   } else {
  //     responseMessage.textContent = "エラーが発生しました。運営に問い合わせてください。";
  //     responseMessage.style.color = "red";
  //   }
  // } catch (error) {
  //   responseMessage.textContent = "エラーが発生しました。運営に問い合わせてください。";
  //   responseMessage.style.color = "red";
  //   console.error(`エラーメッセージ: ${error}`);
  // } finally {
  //   // フォームとボタンを再度有効化し、ボタンの色を元に戻す
  //   form.querySelectorAll("input, button").forEach((element) => element.removeAttribute("disabled"));
  //   submitButton.style.backgroundColor = ""; // ボタンの背景色を元に戻す
  
  //   // レスポンスメッセージをボタンの下に表示
  //   submitButton.parentNode.insertBefore(responseMessage, submitButton.nextSibling);
  // }
};
}