function shift_page() {

// 教室・講師に応じてスケジュールテーブルの調整ーーーーーーーーーーーーーーーーーーーーーーーーーーーーー

// テーブルの行の色をステータスに応じて変更
// #region 
const tableRows = document.querySelectorAll('#schedule-table tr:not(:first-child)');
tableRows.forEach(row => {
  const rowColorFlag = row.querySelector('td:nth-child(2)').textContent;
  if(newData["ページタイプ"] === "school"){
    switch(rowColorFlag){
      case "勤務可能": row.style["background-color"] = "#FFF2CC"; break;
      case "勤務不可": row.style["background-color"] = "#dddddd"; break;
    }
  }else if(newData["ページタイプ"] === "teacher"){
    switch(rowColorFlag){
      case "講師回答前": row.style["background-color"] = "#F4CCCC"; break;
      case "勤務不可": row.style["background-color"] = "#dddddd"; break;
    }
  }
});
// #endregion 

// モーダル（フォームの外枠）の挿入ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
// #region 
const modalTemplate=`
<div id="myModal" class="modal">
    <div class="modal-content form-container">
    </div>
</div>`;
document.getElementById("page-content").insertAdjacentHTML('beforeend', modalTemplate);
const modal = document.getElementById("myModal");

// 全てのrequestボタンにイベントリスナーを追加  
const btns = document.querySelectorAll("table button");
btns.forEach((button) => {
button.addEventListener("click", showModal);
});

// フォーム外がクリックされた時にフォームを非表示にする
window.onclick = function(event) {
  if (event.target == modal) {
    closeModal();
  }
}
// #endregion 


function showModal(event) {
// #region データとフォーム要素の定義ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
  const button = event.target;
  const row = button.closest("tr");
  // ボタンが押された行のテーブルのデータを取得する
  const date = row.cells[0].innerText;
  const availability = row.cells[1].innerText;
  const availableTime = row.cells[2].innerText;
  const remarks = row.cells[3].innerText;
  const requestStatus = row.cells[4].innerText;
  let formId, formTitle, formInfo, formGuide, formButton
  let schoolId,schoolName,teacherId,teacherName

  // 講師ページか教室ページによって、値を整備する
  if(newData["ページタイプ"] === "school"){//ーーーーーーーーーーーー
    schoolId = newData["教室ID"]
    schoolName = newData["教室名"]
    teacherId = page_call_property["会員ID"]
    teacherName = page_call_property["講師名"]
  }else if(newData["ページタイプ"] === "teacher"){//ーーーーーーーー
    schoolId = page_call_property["教室ID"]
    schoolName = page_call_property["教室名"]
    teacherId = newData["会員ID"]
    teacherName = newData["姓"]+ newData["名"]
  }//ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー

  // フォームタイトルなどの定義
    if (button.classList.contains("submit")) {//ーーーーーーーーーー
    formId = "submitForm"
    formTitle = `${date}｜スケジュール提出`
    formInfo = "提出中のスケジュール"
    formGuide = "↓ ｽｹｼﾞｭｰﾙをご記入ください"
    formButton = "ｽｹｼﾞｭｰﾙを提出する"
  } else if (button.classList.contains("request")) {//ーーーーーー
    formId = "requestForm"
    formTitle = `${date}｜${teacherName}先生｜シフト依頼`
    formInfo = "講師の提出スケジュール"
    formGuide = "↓ 依頼内容をご記入ください"
    formButton = "シフトを依頼する"
  } else if (button.classList.contains("change")) {//ーーーーーーー
    formId = "changeForm"
    formTitle = `${date}｜${teacherName}先生｜依頼修正`
    formInfo = "依頼中のシフト内容"
    formGuide = "↓ 依頼内容をご記入ください"
    formButton = "シフトを修正する"
  } else if (button.classList.contains("answer")) {//ーーーーーーー
    formId = "answerForm"
    formTitle = `${date}｜${schoolName}｜依頼回答`
    formInfo = "教室からの依頼内容"
    formGuide = "↓ 回答内容をご記入ください"
    formButton = "回答を提出する"
  }//ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー

  // フォーム要素の定義
  const formElements = [
    { name: "勤務日", type: "hidden", value: date },
    { name: "会員ID", type: "hidden", value: teacherId },
    { name: "講師名", type: "hidden", value: teacherName },
    { name: "教室ID", type: "hidden", value: schoolId },
    { name: "教室名", type: "hidden", value: schoolName },
    { name: "勤務可否", type: "select", value: "", inline: true, width: "180px",breakAfter:true, options: [
      { value: "", text: "選択してください" },
      { value: "勤務可能", text: "勤務可能" },
      { value: "勤務不可", text: "勤務不可" },
      { value: "調整中", text: "調整中" },
    ]},
    { name: "講師回答", type: "select", value: "", inline: true, width: "180px",breakAfter:true, options: [
      { value: "", text: "選択してください" },
      { value: "勤務可能", text: "勤務可能" },
      { value: "勤務不可", text: "勤務不可" },
      { value: "調整中", text: "調整中" },
    ]},
    { name: "勤務開始時間", type: "time", value: "", inline: true, width: "160px" ,minHour: 8, maxHour: 22, stepMinute: 10},
    { name: "勤務終了時間", type: "time", value: "", inline: true, width: "160px" ,minHour: 8, maxHour: 22, stepMinute: 10},
    { name: "休憩時間", type: "minute", value: "", inline: true, width: "160px",minMinute: 0, maxMinute: 120, stepMinute: 10},
    { name: "補足・備考", type: "textarea", value: "",width: "100%",},
    { name: "submitButton", type: "submit", value: formButton },
  ];
// #endregion データとフォーム要素の定義ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
  
  // #region フォームの作成ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
    // 挿入箇所=formContainerの定義
    const formContainer = document.querySelector(".form-container");

    // 閉じるボタン、フォームタイトル、参考情報、ガイドの作成
    formContainer.innerHTML = `
      <span class="close closeButton">&times;</span>
      <h3>${formTitle}</h3>
      <h4>${formInfo}</h4>
      <ul>
        <li>スケジュール｜${availability}</li>
        <li>勤務可能時間｜${availableTime}</li>
        <li>補足・備考　｜${remarks}</li>
      </ul>
    `;
  
    // フォーム要素を挿入
    const form = document.createElement("form");
    form.setAttribute("id", formId);
    formElements.forEach((element) => {
      form.appendChild(makeFormElement(element));
    });
    formContainer.appendChild(form)
    form.addEventListener("submit", (event) => handleSubmit(event, remarks));


  // #endregion フォームの作成ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー  

  // #region フォームのカスタマイズーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー


      // モーダルを表示＆クローズボタンの設定
      modal.style.display = "block";
      const closeButton = document.getElementsByClassName("close")[0];
      closeButton.onclick = () => {
        modal.style.display = "none";
      };

      removeElementById(formId)
      function removeElementById(formId) {
        switch (formId) {
          case 'submitForm':
            document.getElementById("講師回答-wrapper").remove();
            document.getElementById("休憩時間-wrapper").remove();
            document.getElementById("勤務開始時間-wrapper").style.display="none";
            document.getElementById("勤務終了時間-wrapper").style.display="none";
            submitFormAdd()
            break;
          case 'requestForm':
            document.getElementById("勤務可否-wrapper").remove();
            document.getElementById("講師回答-wrapper").remove();
            minuteFormAdd()
            break;
          case 'changeForm':
            document.getElementById("勤務可否-wrapper").remove();
            document.getElementById("講師回答-wrapper").remove();
            minuteFormAdd()
            changeFormAdd()
            break;
          case 'answerForm':
            document.getElementById("勤務可否-wrapper").remove();
            document.getElementById("勤務開始時間-wrapper").remove();
            document.getElementById("勤務終了時間-wrapper").remove();
            document.getElementById("休憩時間-wrapper").remove();
            break;
        }
      }

    // フォームのカスタマイズ機能
    function submitFormAdd(){
      document.getElementById("勤務可否").addEventListener("change", function () {
        const workStatus = this.value;
        const startTimeWrapper = document.getElementById("勤務開始時間-wrapper");
        const endTimeWrapper = document.getElementById("勤務終了時間-wrapper");
        if (workStatus === "勤務可能") {
          startTimeWrapper.style.display = "block";
          endTimeWrapper.style.display = "block";
        } else {
          startTimeWrapper.style.display = "none";
          endTimeWrapper.style.display = "none";
        }
      });
    }

    // フォームのカスタマイズ機能
    function changeFormAdd(){
      const formBoxes = document.querySelectorAll('.form-box');
      const lastFormBox = formBoxes[formBoxes.length - 1];
      const cancelButtonBox = lastFormBox.cloneNode(true);
      const cancelButton = cancelButtonBox.querySelector('input');
      cancelButton.innerText = '依頼を取消する';
      cancelButton.classList.add ="cancel-button";
      buttonBox.parentNode.insertBefore(cancelButtonBox, lastFormBox.nextSibling);
    }
// #endregion フォームのカスタマイズーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
}



const handleSubmit = async (event,remarks) => {
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
    case 'submitForm': 
      if (!data["勤務可否"]){ isValid = false;
        showValidationError(document.getElementById("勤務可否-wrapper"), "勤務可否を選択してください");
      } if(data["勤務可否"] === "勤務可能" && !data["勤務開始時間_hour"] || !data["勤務開始時間_hour"]){isValid = false;
        showValidationError(document.getElementById("勤務開始時間-wrapper"), "有効な時間にしてください");
      } if(data["勤務可否"] === "勤務可能" && !data["勤務終了時間_hour"] || !data["勤務終了時間_hour"]){isValid = false;
        showValidationError(document.getElementById("勤務終了時間-wrapper"), "有効な時間にしてください");
      } if(data["勤務可否"] === "調整中" && !data["補足・備考"]) {
        showValidationError(document.getElementById("補足・備考-wrapper"), "参考テキストを入力してください");
      }
      break;
    case 'requestForm':
      if(!data["勤務開始時間_hour"] || !data["勤務開始時間_hour"]) {
        showValidationError(document.getElementById("勤務開始時間-wrapper"), "有効な時間にしてください");
      } if(!data["勤務終了時間_hour"] || !data["勤務終了時間_hour"]) {
        showValidationError(document.getElementById("勤務終了時間-wrapper"), "有効な時間にしてください");
      } if(!data["休憩時間"]) {
        showValidationError(document.getElementById("休憩時間-wrapper"), "有効な時間にしてください");
      }
      break;
    case 'changeForm': 
      if (clickedButton.classList.contains('cancel-button')) {
        data["取り消し"]= true ;
      } else {
        if(!data["勤務開始時間_hour"] || !data["勤務開始時間_hour"]) {
          showValidationError(document.getElementById("勤務開始時間-wrapper"), "有効な時間にしてください");
        } if(!data["勤務終了時間_hour"] || !data["勤務終了時間_hour"]) {
          showValidationError(document.getElementById("勤務終了時間-wrapper"), "有効な時間にしてください");
        } if(!data["休憩時間"]) {
          showValidationError(document.getElementById("休憩時間-wrapper"), "有効な時間にしてください");
        }
      }

    ; break;
    case 'answerForm':
      if (!data["講師回答"]){ isValid = false;
        showValidationError(document.getElementById("講師回答-wrapper"), "勤務可否を回答してください");
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
  switch (formId) {
    case 'submitForm': hosokuguide = " [講師：ｽｹｼﾞｭｰﾙ提出時] "; break;
    case 'requestForm': hosokuguide = " [教室：シフト依頼時] "; break;
    case 'changeForm': hosokuguide = " [教室：依頼取消時] "; break;
    case 'answerForm': hosokuguide = " [講師：シフト回答時] "; break;
  }  
  data["補足・備考"] = remarks+data["タイムスタンプ"].slice(5, -3)+hosokuguide+"\n" + data["補足・備考"];


  const submitButton = document.querySelector(".submit-button");
  const responseMessage = document.createElement("div");
  responseMessage.classList.add("response-message");
  
  // フォームの無効化とボタンの色を変更
  form.querySelectorAll("input, button").forEach((element) => element.setAttribute("disabled", "disabled"));
  submitButton.style.backgroundColor = "#aaaaaa";
  
  try {
    // データの送信
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
      responseMessage.textContent = "提出が完了しました";
      responseMessage.style.color = "green";
      form.reset(); // フォームの入力値をリセット
      call_fetchData(page_call_property); // レスポンスを受け取り次第、call_fetchData を起動
    } else {
      responseMessage.textContent = "エラーが発生しました。運営に問い合わせてください。";
      responseMessage.style.color = "red";
    }
  } catch (error) {
    responseMessage.textContent = "エラーが発生しました。運営に問い合わせてください。";
    responseMessage.style.color = "red";
    console.error(`エラーメッセージ: ${error}`);
  } finally {
    // フォームとボタンを再度有効化し、ボタンの色を元に戻す
    form.querySelectorAll("input, button").forEach((element) => element.removeAttribute("disabled"));
    submitButton.style.backgroundColor = ""; // ボタンの背景色を元に戻す
  
    // レスポンスメッセージをボタンの下に表示
    submitButton.parentNode.insertBefore(responseMessage, submitButton.nextSibling);
  }
};
};