// モーダルの挿入



// テーブルボタンにモーダル呼び出し機能の追加






// シフト関連フォーム作成スクリプトの起動スクリプト
const btns = document.querySelectorAll("shift-table-top button");
btns.forEach((button) => {
  button.addEventListener("click", showModalForm);
});

// 特に、講師名や教室名が追加されるので、その行ずれに注意をする必要がある。
function showModalForm(event) {

    // クリック要素の情報を取得
    const formFlag =event.target.classList
    const row = event.target.closest("tr");
    const date = row.cells[0].innerText;
    const remarks = row.cells[5].innerHTML; 

    let teacherName , schoolName , formId, formTitle, formInfo, formGuide, formButton

    if (formFlag.contains("change")) {
        teacherName = row.cells[2].innerText
        formId = "changeForm"
        formTitle = `${date}｜${teacherName}先生｜依頼修正`
        formInfo = "依頼中のシフト内容"
        formButton = "シフトを修正する"
    } else if (formFlag.contains("answer")) {
        schoolName = row.cells[2].innerText
        formId = "answerForm"
        formTitle = `${date}｜${schoolName}｜依頼回答`
        formInfo = "教室からの依頼内容"
        formButton = "回答を提出する"
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
      }
      </ul>
    `;

    // フォーム中身の作成
    const form = document.createElement("form");
    form.setAttribute("id", "answerForm");
    // フォーム要素のデフォルト定義
    const formElements = [
        { name: "勤務日", type: "hidden", value: date },
        { name: "フォームタイプ", type: "hidden", value: formId },
        { name: "会員ID", type: "hidden", value: teacherId },
        { name: "講師名", type: "hidden", value: teacherName },
        { name: "教室ID", type: "hidden", value: schoolId },
        { name: "教室名", type: "hidden", value: schoolName }, //ここからカスタムを挿入
        { name: "補足・備考", type: "textarea", value: "", width: "100%", },
        { name: "submitButton", type: "submit", value: formButton }, //ボタンテキスト変更
    ];
    
    // フォーム要素のカスタム定義
    if (formFlag.contains("change")) {
        let addElement1 = 
          { name: "依頼取り消し", type: "select", value: "", inline: true, width: "180px", breakAfter: true, options: [
              { value: "", text: "取り消ししない" },{ value: "依頼を取り消す", text: "依頼を取り消す" }]}
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

    formElements.forEach((element) => {
      form.appendChild(makeFormElement(element));
    });
    formContainer.appendChild(form)
    form.addEventListener("submit", (event) => handleValidation(event, remarks, row));

    // モーダル非表示スクリプト
    modal.style.display = "block";
    const closeButton = document.getElementsByClassName("close")[0];
    closeButton.onclick = () => {
      modal.style.display = "none";
    };
}


const handleValidation = async (event, remarks, row) => {
    // フォーム送信時アクションの設定する関数ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
    event.preventDefault(); // デフォルトの送信をキャンセル
    const form = event.target;
    const formData = new FormData(form);

    // Formの回答をdataに格納
    const data = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }

    // バリデーション処理
    clearValidationErrors(); 
    let isValid = true;
    // 修正フォームの場合 
    if (form.id=="changeForm" && data["依頼取り消し"] == "依頼を取り消す") {
        data["取り消し"] = true;
    } else if(form.id=="changeForm" ){
        if (!data["勤務開始時間_hour"] || !data["勤務開始時間_hour"]) {
            isValid = false;
            showValidationError(document.getElementById("勤務開始時間-wrapper"), "有効な時間にしてください");
          } if (!data["勤務終了時間_hour"] || !data["勤務終了時間_hour"]) {
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

    if (isValid == false) { return; }



    // データの整理
    data["勤務開始時間"] = data["勤務開始時間_hour"] + ':'
      + (data["勤務開始時間_minute"] === '0' ? '00' : data["勤務開始時間_minute"]);
    data["勤務終了時間"] = data["勤務終了時間_hour"] + ':'
      + (data["勤務終了時間_minute"] === '0' ? '00' : data["勤務終了時間_minute"]);

    data["タイムスタンプ"] = new Date().toLocaleString("ja-JP", {
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    });

    let hosokuguide
    switch (form.id) {
      case 'changeForm': hosokuguide = " [↓教室：依頼取消時] "; break;
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
        row.cells[1].innerText = data["依頼への回答"];
        row.cells[5].innerHTML = data["補足・備考"];
        row.cells[6].innerText = "回答済み";
        row.style["background-color"] = "#FFF2CC";
    }

    
    fetchdata(data)
    modal.style.display = "none";

};


// バリデーションリフレッシュ関数
function clearValidationErrors() {
    const errorMessages = document.getElementsByClassName("error-message");
    while (errorMessages[0]) {
        errorMessages[0].parentNode.removeChild(errorMessages[0]);
    }
}
// バリデーション表示関数
function showValidationError(element, message) {
    const errorMessage = document.createElement("div");
    errorMessage.classList.add("error-message");
    errorMessage.textContent = message;
    errorMessage.style.color = "red";
    errorMessage.style.fontSize = "0.8rem";
    errorMessage.style.marginTop = "4px";
    element.appendChild(errorMessage);
}

function fetchdata(data){
    // データの送信処理
    fetch("https://script.google.com/macros/s/AKfycbwWfeARqEk-kQyWqXYMmnVuVmgTzE4fhe8tK425-9a5NC6UQ52K_44h0W2d-e3Egx4T/exec", {
    method: 'POST',
    headers: {
        'Content-Type': 'text/plain',
    },
    body: JSON.stringify(data),
    mode: 'cors', //CORS対応
    });
}


// const handlePostValidation = async (data, formId, remarks) => {
//     // データの整理
//     data["勤務開始時間"] = data["勤務開始時間_hour"] + ':'
//       + (data["勤務開始時間_minute"] === '0' ? '00' : data["勤務開始時間_minute"]);
//     data["勤務終了時間"] = data["勤務終了時間_hour"] + ':'
//       + (data["勤務終了時間_minute"] === '0' ? '00' : data["勤務終了時間_minute"]);

//     data["タイムスタンプ"] = new Date().toLocaleString("ja-JP", {
//       year: "numeric", month: "2-digit", day: "2-digit",
//       hour: "2-digit", minute: "2-digit", second: "2-digit",
//     });

//     let hosokuguide
//     switch (formId) {
//       case 'submitForm': hosokuguide = " [↓講師：ｽｹｼﾞｭｰﾙ提出時] "; break;
//       case 'requestForm': hosokuguide = " [↓教室：シフト依頼時] "; break;
//       case 'changeForm': hosokuguide = " [↓教室：依頼取消時] "; break;
//       case 'answerForm': hosokuguide = " [↓講師：シフト回答時] "; break;
//     }
//     if (remarks == "-") { remarks = "" } else { remarks = remarks + "<br>" }
//     if (data["補足・備考"] != "") {
//       data["補足・備考"] = `${remarks}<span style="color:#0D5D63;">${hosokuguide}</span><br>${data["補足・備考"]}`;
//     } else { data["補足・備考"] = "-" }

//     // データの送信処理
//     fetch("https://script.google.com/macros/s/AKfycbwWfeARqEk-kQyWqXYMmnVuVmgTzE4fhe8tK425-9a5NC6UQ52K_44h0W2d-e3Egx4T/exec", {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'text/plain',
//     },
//     body: JSON.stringify(data),
//     mode: 'cors', //CORS対応
//     });
// };