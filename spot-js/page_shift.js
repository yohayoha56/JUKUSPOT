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
      case "勤務不可": row.style["background-color"] = "#cccccc"; break;
    }
  }else if(newData["ページタイプ"] === "teacher"){
    switch(rowColorFlag){
      case "講師回答前": row.style["background-color"] = "#F4CCCC"; break;
      case "勤務不可": row.style["background-color"] = "#cccccc"; break;
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

// テーブルのボタンが押されたときにフォームを作成する（ここから300行）ーーーーーーーーーーーーーーーーーーーーー
function showModal(event) {
// #region ここから80行くらい、データとフォームの定義
  const button = event.target;
  const row = button.closest("tr");
  // ボタンが押された行のテーブルのデータを取得するーーーーーーーーーーーーーーーーーーーー
  const date = row.cells[0].innerText;
  const availability = row.cells[1].innerText;
  const availableTime = row.cells[2].innerText;
  const remarks = row.cells[3].innerText;
  const requestStatus = row.cells[4].innerText;
  let formTitle, formInfo, formGuide, formButton,schoolId,schoolName,teacherId,teacherName,formId
  let submitNone, requestNone, changeNone, answerNone

  // 押されたボタンのタイプによって、フォームタイトルなどを設定するーーーーーーーーーーーーー
    if (button.classList.contains("submit")) {//ーーーーーーーーーー
    formId = "submitForm"
    formTitle = `${date}｜スケジュール提出`
    formInfo = "提出中のスケジュール"
    formGuide = "↓ ｽｹｼﾞｭｰﾙをご記入ください"
    formButton = "ｽｹｼﾞｭｰﾙを提出する"
    requestNone = `style="display:none;"`
  } else if (button.classList.contains("request")) {//ーーーーーー
    formId = "requestForm"
    formTitle = `${date}｜${page_call_property["講師名"]}先生｜シフト依頼`
    formInfo = "講師の提出スケジュール"
    formGuide = "↓ 依頼内容をご記入ください"
    formButton = "シフトを依頼する"
    requestNone = `style="display:none;"`
  } else if (button.classList.contains("change")) {//ーーーーーーー
    formId = "changeForm"
    formTitle = `${date}｜${page_call_property["講師名"]}先生｜依頼修正`
    formInfo = "依頼中のシフト内容"
    formGuide = "↓ 依頼内容をご記入ください"
    formButton = "シフトを修正する"
    requestNone = `style="display:none;"`
  } else if (button.classList.contains("answer")) {//ーーーーーーー
    formId = "answerForm"
    formTitle = `${date}｜${page_call_property["教室名"]}｜依頼回答`
    formInfo = "教室からの依頼内容"
    formGuide = "↓ 回答内容をご記入ください"
    formButton = "回答を提出する"
    requestNone = `style="display:none;"`
  }//ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー

  // 講師ページか教室ページによって、値を整備するーーーーーーーーーーーーーーーーーーーーー
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
    { name: "休憩時間", type: "minute", value: "", inline: true, width: "160px", breakAfter:true,minMinute: 0, maxMinute: 120, stepMinute: 10},
    { name: "補足・備考", type: "textarea", value: "", inline: false ,width: "100%",},
  ];
// #endregion ここから80行くらい、データとフォームの定義
  
// #region ここから200行くらい、フォーム作成のテンプレート関数
  // フォームの作成ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー  
    // 基幹部分の作成
    const formContainer = document.querySelector(".form-container");
    formContainer.innerHTML = `<span class="close closeButton">&times;</span>`;
    const formHeader = createFormTitle(formTitle);
    formContainer.appendChild(formHeader);
  
    // 参考情報を挿入
    const additionalContent = createAdditionalContent(formInfo, availability, availableTime, remarks, formGuide);
    formContainer.appendChild(additionalContent);
  
    // フォーム要素を挿入
    const form = document.createElement("form");
    form.setAttribute("id", formId);
    formElements.forEach((element) => {
      form.appendChild(createFormField(element));
    });

    // 提出ボタンを挿入
    form.appendChild(createSubmitButton(formButton));
    formContainer.appendChild(form);
    form.addEventListener("submit", handleSubmit);

  // フォーム要素の作成ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー  


  // タイトル、ボタンの作成関数
  function createFormTitle(title) {
      const titleElement = document.createElement("h3");
      titleElement.textContent = title;
      return titleElement;
  }
  // 参考情報の作成関数
  function createAdditionalContent(formInfo, availability, availableTime, remarks, formGuide) {
    const additionalContent = document.createElement("div");
    additionalContent.setAttribute("id", "sankou-info");
  
    const additionalHeader = document.createElement("h4");
    additionalHeader.textContent = formInfo;
    additionalContent.appendChild(additionalHeader);
  
    const additionalList = document.createElement("ul");
    additionalList.innerHTML = `
      <li>スケジュール｜${availability}</li>
      <li>勤務可能時間｜${availableTime}</li>
      <li>補足・備考　｜${remarks}</li>
    `;
    additionalContent.appendChild(additionalList);
  
    const formGuideHeader = document.createElement("h4");
    formGuideHeader.textContent = formGuide;
    additionalContent.appendChild(formGuideHeader);
  
    return additionalContent;
  }

  // ボタンの作成関数
  function createSubmitButton(text) {
      // ボタンの作成
      const submitButton = document.createElement("input");
      submitButton.setAttribute("type", "submit");
      submitButton.setAttribute("value", text);
      submitButton.classList.add("submit-button");
      // ボタンの梱包
      const formBox = document.createElement("div");
      formBox.classList.add("form-box");
      formBox.appendChild(submitButton);

      return formBox;
  }

  // フォーム要素の作成関数
  function createFormField(element) {
      // ラベルの作成
      const label = document.createElement("label");
      label.setAttribute("for", element.name);
      label.classList.add("form-label");
      label.textContent = element.name + ":";

      let input;
      // ブロパティの作成（その他の自由記入もあり）
      if (element.type === "select") {//ーーーーーーーーーーーーーーー
          input = createSelectInput(element);
      } else if (element.type === "textarea") {//ーーーーーーーーーー
          input = document.createElement("textarea");
      } else if (element.type === "checkbox") {//ーーーーーーーーーー
          input = document.createElement("input");
          input.setAttribute("type", "checkbox");
          input.setAttribute("class", "hidden_checkbox");
          const checkmark = document.createElement("span")
      } else if (element.type === "time") {//ーーーーーーーーーーーー
          input = createCustomTimeInput(element);
      } else if (element.type === "minute") {//ーーーーーーーーーーー
          input= createCustomTimeInput2(element);
      } else {//ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
          input = document.createElement("input");
          input.setAttribute("type", element.type);
      }//ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
      input.setAttribute("id", element.name);
      input.setAttribute("name", element.name);
      input.value = element.value;
      
      // フォーム要素の梱包
      const formBox = document.createElement("div");
      formBox.appendChild(label);
      formBox.appendChild(input);
      formBox.classList.add("form-box");
      if (element.inline) { formBox.classList.add("inline-box");}
      formBox.setAttribute("id",`${element.name}-wrapper`);
      if (element.width) {  formBox.style.width = element.width;}
      if (element.breakAfter) {formBox.style["margin-right"] = `calc( 100% - ${element.width})`;}
      if (element.type === "hidden") { formBox.style.display = "none";}
      return formBox;
  }

  // セレクト要素の作成
  function createSelectInput(element) {
      const select = document.createElement("select");
      select.setAttribute("name", element.name);
      select.setAttribute("id", element.id);

      element.options.forEach(option => {
        const optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        if (option.disabled) {
          optionElement.setAttribute("disabled", "");
        }
        if (option.selected) {
          optionElement.setAttribute("selected", "");
        }
        select.appendChild(optionElement);
      });
      return select;
  }

  // 時間のインプット作成関数
  function createCustomTimeInput(element) {
      const hourSelect = document.createElement("select");
      hourSelect.setAttribute("name", element.name + "_hour");
      hourSelect.setAttribute("id", element.id + "_hour");

      const minuteSelect = document.createElement("select");
      minuteSelect.setAttribute("name", element.name + "_minute");
      minuteSelect.setAttribute("id", element.id + "_minute");

      // 時間の選択肢を生成
      const defaultHourOption = document.createElement("option");
      defaultHourOption.value = "";
      defaultHourOption.textContent = "--";
      hourSelect.appendChild(defaultHourOption);
      for (let hour = element.minHour; hour <= element.maxHour; hour++) {
        const hourOption = document.createElement("option");
        hourOption.value = hour;
        hourOption.textContent = hour;
        hourSelect.appendChild(hourOption);
      }
      // 分の選択肢を生成
      const defaultMinuteOption = document.createElement("option");
      defaultMinuteOption.value = "";
      defaultMinuteOption.textContent = "--";
      minuteSelect.appendChild(defaultMinuteOption);
      for (let minute = 0; minute < 60; minute += element.stepMinute) {
        const minuteOption = document.createElement("option");
        minuteOption.value = minute;
        minuteOption.textContent = minute;
        minuteSelect.appendChild(minuteOption);
      }
      // 時間のインプット要素まとめ
      const timeWrapper = document.createElement("div");
      timeWrapper.classList.add("time-wrapper")
      timeWrapper.appendChild(hourSelect);
      timeWrapper.appendChild(document.createTextNode("時"));
      timeWrapper.appendChild(minuteSelect);
      timeWrapper.appendChild(document.createTextNode("分"));

      return timeWrapper;
  }
  // minuteのインプット作成関数
  function createCustomTimeInput2(element){
    const select = document.createElement("select");
    const defaultMinuteOption = document.createElement("option");
    defaultMinuteOption.value = "";
    defaultMinuteOption.textContent = "--";
    select.appendChild(defaultMinuteOption);
    for (let minute = element.minMinute; minute <= element.maxMinute; minute += element.stepMinute) {
      const minuteOption = document.createElement("option");
      minuteOption.value = minute;
      minuteOption.textContent = minute;
      select.appendChild(minuteOption);
    }
    input =document.createElement("div");
    input.classList.add("time-wrapper")
    input.appendChild(select);
    input.appendChild(document.createTextNode("分"));

    return input
  }

  // モーダルを表示＆クローズボタンの設定
  modal.style.display = "block";
  const closeButton = document.getElementsByClassName("close")[0];
  closeButton.onclick = () => {
    modal.style.display = "none";
  };
// #endregion MyRegionName

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
        document.getElementById(targetId).remove();
        break;
      case 'changeForm':
        document.getElementById(targetId).remove();
        break;
      case 'answerForm':
        document.getElementById(targetId).remove();
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
      startTimeWrapper.querySelector("input").value = "";
      endTimeWrapper.querySelector("input").value = "";
    }
  });
}


}



// フォームのアクションを設定する関数ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー


const handleSubmit = async (event) => {
  event.preventDefault(); // デフォルトの送信をキャンセル
  clearValidationErrors(); // バリデーションをリフレッシュ

  const form = document.querySelector('form');
  const formId =form.id
  const formData = new FormData(form);
  const data = {};
  // FormDataオブジェクトから連想配列に変換
  for (const [key, value] of formData.entries()) {
      data[key] = value;
  }

  // バリデーションチェック
  let isValid = true;
  switch (formId) {
    case 'submitForm': 
      if (!data["勤務可否"]){ isValid = false;
        showValidationError(document.getElementById("勤務可否-wrapper"), "勤務可否を選択してください");
      } if(data["勤務可否"] === "勤務可能" && !data["勤務開始時間_hour"] || !data["勤務開始時間_hour"]){isValid = false;
        showValidationError(document.getElementById("勤務開始時間-wrapper"), "有効な時間にください");
      } if(data["勤務可否"] === "勤務可能" && !data["勤務終了時間_hour"] || !data["勤務終了時間_hour"]){isValid = false;
        showValidationError(document.getElementById("勤務終了時間-wrapper"), "有効な時間にください");
      } if(data["勤務可否"] === "調整中" && !data["補足・備考"]) {
        showValidationError(document.getElementById("補足・備考-wrapper"), "参考テキストを入力してください");
      }
      break;
    case 'requestForm': hosokuguide = "（教室から：シフト依頼時）"; break;
    case 'changeForm': hosokuguide = "（教室から：依頼取消時）"; break;
    case 'answerForm': hosokuguide = "（講師から：シフト回答時）"; break;
  }  

  if (isValid ==false){ return; }



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
    case 'submitForm': hosokuguide = "（講師から：ｽｹｼﾞｭｰﾙ提出時）"; break;
    case 'requestForm': hosokuguide = "（教室から：シフト依頼時）"; break;
    case 'changeForm': hosokuguide = "（教室から：依頼取消時）"; break;
    case 'answerForm': hosokuguide = "（講師から：シフト回答時）"; break;
  }  
  data["補足・備考"] = data["タイムスタンプ"].slice(5, -3)+hosokuguide+"\n" + data["補足・備考"];


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
};