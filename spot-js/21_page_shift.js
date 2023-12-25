function shift_page(page_call_property) {

  // テーブルの行の色をステータスに応じて変更
  // #region 
  const tableRows = document.querySelectorAll('#schedule-table tr:not(:first-child)');
  tableRows.forEach(row => {
    const rowColorFlag = row.querySelector('td:nth-child(2)').textContent;
    const rowColorFlag2 = row.querySelector('td:nth-child(5)').textContent;
    if (newData["ページタイプ"] === "school") {
      switch (rowColorFlag) {
        case "勤務可能": row.style["background-color"] = "#FFF2CC"; break;
        case "勤務不可": row.style["background-color"] = "#dddddd"; break;
      }
      switch (rowColorFlag2) {
        case "勤務確定": row.style["background-color"] = "#CCF2F4"; break;
        case "勤務不可": row.style["background-color"] = "#dddddd"; break;
      }
    } else if (newData["ページタイプ"] === "teacher") {
      switch (rowColorFlag) {
        case "講師提出前": row.style["background-color"] = "#F4CCCC"; break;
        case "勤務不可": row.style["background-color"] = "#dddddd"; break;
      }
      switch (rowColorFlag2) {
        case "勤務確定": row.style["background-color"] = "#CCF2F4"; break;
        case "勤務不可": row.style["background-color"] = "#dddddd"; break;
      }
    }
  });
  const tableRows2 = document.querySelectorAll('#shift-table tr:not(:first-child)');
  tableRows2.forEach(row => {
    const rowColorFlag = row.querySelector('td:nth-child(2)').textContent;
    if (newData["ページタイプ"] === "school") {
      switch (rowColorFlag) {
        case "勤務確定": row.style["background-color"] = "#CCF2F4"; break;
        case "勤務不可": row.style["background-color"] = "#dddddd"; break;
        case "調整中": row.style["background-color"] = "#FFF2CC"; break;
      }
    } else if (newData["ページタイプ"] === "teacher") {
      switch (rowColorFlag) {
        case "勤務確定": row.style["background-color"] = "#CCF2F4"; break;
        case "勤務不可": row.style["background-color"] = "#dddddd"; break;
        case "調整中": row.style["background-color"] = "#FFF2CC"; break;
        case "講師回答前": row.style["background-color"] = "#F4CCCC"; break;
      }
    }
  });
  // #endregion 


// モーダルの挿入ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
  // #region 
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
  // #endregion 

  // ページ情報の定義
  const schoolId = newData["ページタイプ"] == "school" ?
    newData["教室ID"] : page_call_property["教室ID"];
  const schoolName = newData["ページタイプ"] == "school" ?
    newData["教室名"] : page_call_property["教室名"];
  const teacherId = newData["ページタイプ"] == "school" ?
    page_call_property["会員ID"] : newData["会員ID"];
  const teacherName = newData["ページタイプ"] == "school" ?
    page_call_property["講師名"] : newData["姓"] + newData["名"];


  console.log(schoolId)
  console.log(schoolName)
  console.log(teacherId)
  console.log(teacherName)


  // ngを含むボタンにイベントリスナーを追加
  const ngBtns = document.querySelectorAll("table button.ng");
  ngBtns.forEach((button) => {
    button.addEventListener("click", showNgModal);
  });

  function showNgModal(event) {

    const button = event.target;
    const row = button.closest("tr");
    // ボタンが押された行のテーブルのデータを取得する①
    const date = row.cells[0].innerText;
    // フォームタイトルなどの定義
    let message =""
    let nganouncetext=""
    if (button.classList.contains("kinmuhuka")) {//ーーーーーーーーーー
      message=`＜${date}＞の勤務依頼をお願いしたいです。【勤務不可】から【調整中】に変更してください。`
      nganouncetext="講師の回答は「勤務不可」です。。"
    } else if (button.classList.contains("iraihuka")) {//ーーーーーーーーーー
      message=`＜${date}＞の勤務依頼をお願いしたいです。【勤務不可】から【勤務可能】に変更してください。`
      nganouncetext="スケジュール回答は「勤務不可」です。"
    }

    const chatSubmitAreaHTML =`
    <span class="close closeButton">&times;</span>
    <div class="chat-submit-area" style="padding: 10px 0;" >
        <form id="chatForm">
            <p style="padding:10px 0;font-weight:bold;" class="ng-anounce"></p>
            <p style="padding:10px 0:"><i class="fa-solid fa-circle-arrow-down"></i>こちらから講師に変更依頼のメッセージを送れます。<br>必要に応じて修正し、送信ボタンを押してください。</p>
            <input type="hidden" id="会員ID" name="会員ID" value=""><input type="hidden" id="講師名" name="講師名" value=""> 
            <input type="hidden" id="教室ID" name="教室ID" value=""><input type="hidden" id="教室名" name="教室名" value=""> 
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
    const hiddenElements = form.querySelectorAll(":scope > input")
    for( let hiddenElement of hiddenElements){
        const id = hiddenElement.id
        hiddenElement.value=page_call_property[id]
    }
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



  // ngを含まない全てのrequestボタンにイベントリスナーを追加  
  const btns = document.querySelectorAll("table button:not(.ng)");
  btns.forEach((button) => {
    button.addEventListener("click", showModal);
  });


  function showModal(event) {
    // #region データとフォーム要素の定義ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー    
    const button = event.target;
    const row = button.closest("tr");
    const date = row.cells[0].innerText;


    let formId, formTitle, formInfo, formButton
    // フォームタイトルなどの定義
    if (button.classList.contains("submit")) {//ーーーーーーーーーー
      formId = "submitForm"
      formTitle = `${date}｜スケジュール提出`
      formInfo = "提出中のスケジュール"
      formButton = "ｽｹｼﾞｭｰﾙを提出する"
    } else if (button.classList.contains("request")) {//ーーーーーー
      formId = "requestForm"
      formTitle = `${date}｜${teacherName}先生｜シフト依頼`
      formInfo = "講師の提出スケジュール"
      formButton = "シフトを依頼する"
    } else if (button.classList.contains("change")) {//ーーーーーーー
      formId = "changeForm"
      formTitle = `${date}｜${teacherName}先生｜依頼修正`
      formInfo = "依頼中のシフト内容"
      formButton = "シフトを修正する"
    } else if (button.classList.contains("answer")) {//ーーーーーーー
      formId = "answerForm"
      formTitle = `${date}｜${schoolName}｜依頼回答`
      formInfo = "教室からの依頼内容"
      formButton = "回答を提出する"
    }//ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー

    const remarks = (formId == "submitForm" || formId == "requestForm") ?
      row.cells[3].innerHTML : row.cells[4].innerHTML;

    // フォーム要素の定義
    const formElements = [
      { name: "勤務日", type: "hidden", value: date },
      { name: "会員ID", type: "hidden", value: teacherId },
      { name: "講師名", type: "hidden", value: teacherName },
      { name: "教室ID", type: "hidden", value: schoolId },
      { name: "教室名", type: "hidden", value: schoolName },
      {
        name: "勤務可否", type: "select", value: "", inline: true,width: "100%", breakAfter: true, options: [
          { value: "", text: "選択してください" },
          { value: "勤務可能", text: "勤務可能" },
          { value: "勤務不可", text: "勤務不可" },
          { value: "調整中", text: "調整中" },
        ]
      },
      {
        name: "講師回答", type: "select", value: "", inline: true,width: "100%", breakAfter: true, options: [
          { value: "", text: "選択してください" },
          { value: "勤務確定", text: "勤務確定" },
          { value: "勤務不可", text: "勤務不可" },
          { value: "調整中", text: "調整中" },
        ]
      },
      {
        name: "依頼取り消し", type: "select", value: "", inline: true,width: "100%", breakAfter: true, options: [
          { value: "依頼を取り消す", text: "依頼を取り消す" },
          { value: "", text: "依頼を修正する" },
        ]
      },
      { name: "勤務開始時間", type: "time", value: "", inline: true, width: "160px", minHour: 8, maxHour: 22, stepMinute: 10 },
      { name: "勤務終了時間", type: "time", value: "", inline: true, width: "160px", minHour: 8, maxHour: 22, stepMinute: 10 },
      { name: "休憩時間", type: "minute", value: "", inline: true, width: "160px", minMinute: 0, maxMinute: 120, stepMinute: 10 },
      { name: "補足・備考", type: "textarea", value: "", width: "100%", },
      { name: "submitButton", type: "submit", value: formButton, width: "100%" },
    ];
    // #endregion データとフォーム要素の定義ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー

    // #region フォームの作成ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
    // 挿入箇所=formContainerの定義
    const formContainer = document.querySelector(".form-container");
    formContainer.innerHTML = `
      <span class="close closeButton">&times;</span>
      <h3>${formTitle}</h3>
      <h4>${formInfo}</h4>
      <ul>
      ${(formId == "submitForm" || formId == "requestForm") ?
        `<li>スケジュール｜${row.cells[1].innerText}</li>
        <li>勤務可能時間｜${row.cells[2].innerText}</li>
        <li>補足・備考　｜${row.cells[3].innerHTML}</li>`
        :
        `<li>講師の回答　｜${row.cells[1].innerText}</li>
        <li>勤務依頼時間｜${row.cells[2].innerText}（休：${row.cells[3].innerText}）</li>
        <li>補足・備考　｜${row.cells[4].innerHTML}</li>`
      }
      </ul>
    `;

    // フォーム要素を挿入
    const form = document.createElement("form");
    form.setAttribute("id", formId);
    formElements.forEach((element) => {
      form.appendChild(makeFormElement(element));
    });
    formContainer.appendChild(form)
    form.addEventListener("submit", (event) => handleSubmit(event, remarks, row));



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
          document.getElementById("依頼取り消し-wrapper").remove();
          document.getElementById("勤務開始時間-wrapper").style.display = "none";
          document.getElementById("勤務終了時間-wrapper").style.display = "none";
          submitFormAdd()
          break;
        case 'requestForm':
          document.getElementById("勤務可否-wrapper").remove();
          document.getElementById("講師回答-wrapper").remove();
          document.getElementById("依頼取り消し-wrapper").remove();
          break;
        case 'changeForm':
          document.getElementById("勤務可否-wrapper").remove();
          document.getElementById("講師回答-wrapper").remove();
          changeFormAdd()
          break;
        case 'answerForm':
          document.getElementById("勤務可否-wrapper").remove();
          document.getElementById("勤務開始時間-wrapper").remove();
          document.getElementById("勤務終了時間-wrapper").remove();
          document.getElementById("休憩時間-wrapper").remove();
          document.getElementById("依頼取り消し-wrapper").remove();
          break;
      }
    }

    // フォームの回答状況に応じたアラート表示スクリプト
    function showWorkStatusAlert(element, classname, message) {
      const alertMessage = document.createElement("div");
      alertMessage.className = classname;
      alertMessage.style.color = "red";
      alertMessage.style.fontSize = "0.8rem";
      alertMessage.style.marginTop = "4px";
      alertMessage.innerHTML = message;
      element.prepend(alertMessage);
    }

    // フォームのカスタマイズ機能
    function submitFormAdd() {
      document.getElementById("勤務可否").addEventListener("change", function () {
        const workStatus = this.value;
        const startTimeWrapper = document.getElementById("勤務開始時間-wrapper");
        const endTimeWrapper = document.getElementById("勤務終了時間-wrapper");
        console.log(workStatus)
        // Remove previous alerts
        startTimeWrapper.style.display = "none";
        endTimeWrapper.style.display = "none";
        const alertMessages = document.querySelectorAll(".work-status-alert");
        alertMessages.forEach(element => { element.remove() });

        if (workStatus === "勤務可能") {
          startTimeWrapper.style.display = "block";
          endTimeWrapper.style.display = "block";
        } else if(workStatus === "勤務不可") {
          const alertArea = document.getElementById("submitButton-wrapper");
          showWorkStatusAlert( alertArea, "work-status-alert", "勤務不可に設定すると、教室はシフト依頼ができなくなります。<br>勤務可能になった場合は再度変更してください。");
        }
        
      });
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
    // if (button.classList.contains("is-confirmed")) {//ーーーーーーーーーー
    //   const alertArea = document.getElementById("changeForm");
    //   showWorkStatusAlert(alertArea, "is-confirmde-alert" , "確定済みのシフトです。修正すると、【確定前】の状態になり、再び講師の回答が必要になります。<br>トラブル防止のため、確定済みのシフト変更時は、事前に講師の了承を得るようにして下さい");
    // }



    // #endregion フォームのカスタマイズーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
  }

  const validateForm = (data, formId) => {
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

    switch (formId) {
      case 'submitForm':
        if (!data["勤務可否"]) {
          isValid = false;
          showValidationError(document.getElementById("勤務可否-wrapper"), "勤務可否を選択してください");
        }
        if (data["勤務可否"] === "勤務可能" && (!data["勤務開始時間_hour"] || !data["勤務開始時間_minute"])) {
          isValid = false;
          showValidationError(document.getElementById("勤務開始時間-wrapper"), "有効な時間にしてください");
        }
        if (data["勤務可否"] === "勤務可能" && (!data["勤務終了時間_hour"] || !data["勤務終了時間_minute"])) {
          isValid = false;
          showValidationError(document.getElementById("勤務終了時間-wrapper"), "有効な時間にしてください");
        }
        var startTime = parseInt(data["勤務開始時間_hour"]) * 60 + parseInt(data["勤務開始時間_minute"]);
        var endTime = parseInt(data["勤務終了時間_hour"]) * 60 + parseInt(data["勤務終了時間_minute"]);
        if (startTime >= endTime) {
          isValid = false;
          showValidationError(document.getElementById("勤務終了時間-wrapper"), "終了時間は開始時間より後に設定してください");
        }
        break;
      // 勤務可否が設定されていないとエラー
      case 'requestForm':
        if (!data["勤務開始時間_hour"] || !data["勤務開始時間_minute"]) {
          isValid = false;
          showValidationError(document.getElementById("勤務開始時間-wrapper"), "有効な時間にしてください");
        }
        if (!data["勤務終了時間_hour"] || !data["勤務終了時間_minute"]) {
          isValid = false;
          showValidationError(document.getElementById("勤務終了時間-wrapper"), "有効な時間にしてください");
        }
        var startTime = parseInt(data["勤務開始時間_hour"]) * 60 + parseInt(data["勤務開始時間_minute"]);
        var endTime = parseInt(data["勤務終了時間_hour"]) * 60 + parseInt(data["勤務終了時間_minute"]);
        if (startTime >= endTime) {
          isValid = false;
          showValidationError(document.getElementById("勤務終了時間-wrapper"), "終了時間は開始時間より後に設定してください");
        }
        if (!data["休憩時間"]) {
          isValid = false;
          showValidationError(document.getElementById("休憩時間-wrapper"), "有効な時間にしてください");
        }
        break;
      case 'changeForm':
        if (data["依頼取り消し"] == "依頼を取り消す") {
          data["取り消し"] = true;
        } else {
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
        ; break;
      case 'answerForm':
        if (!data["講師回答"]) {
          isValid = false;
          showValidationError(document.getElementById("講師回答-wrapper"), "勤務可否を回答してください");
        }
        ; break;
    }

    return isValid
  }




  const handleSubmit = async (event, remarks, row) => {
    // フォーム送信時アクションの設定する関数ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
    event.preventDefault(); // デフォルトの送信をキャンセル
    const form = event.target;
    const formId = form.id
    const formData = new FormData(form);
    const data = {};
    // FormDataオブジェクトから連想配列に変換
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }

    // バリデーションチェック
    const isValid = validateForm(data, formId);
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
    switch (formId) {
      case 'submitForm': hosokuguide = " [↓講師：ｽｹｼﾞｭｰﾙ提出時] "; break;
      case 'requestForm': hosokuguide = " [↓教室：シフト依頼時] "; break;
      case 'changeForm': hosokuguide = data["取り消し"] == true?" [↓教室：依頼取消時] ":" [↓教室：依頼修正時] "; break;
      case 'answerForm': hosokuguide = " [↓講師：シフト回答時] "; break;
    }
    if (remarks == "-") { remarks = "" } else { remarks = remarks + "<br>" }
    if (data["補足・備考"] != "") {
      data["補足・備考"] = `${remarks}<span style="color:#0D5D63;">${hosokuguide}</span><br>${data["補足・備考"]}`;
    } else { data["補足・備考"] = "-" }

    const submitButton = document.querySelector(".submit-button");
    const responseMessage = document.createElement("div");
    responseMessage.classList.add("response-message");
    submitButton.parentNode.insertBefore(responseMessage, submitButton.nextSibling);
    responseMessage.textContent = "処理中です。このままお待ちください。";



    if (formId == "requestForm"){
      data["企業ID"] = newData["企業ID"]
    } 
    if (formId == "submitForm") {
      row.cells[1].innerText = data["勤務可否"];
      row.cells[2].innerText = data["勤務開始時間"] + "〜" + data["勤務終了時間"];
      row.cells[3].innerHTML = data["補足・備考"];
      row.cells[4].innerHTML = "提出済";
      row.style["background-color"] = "#FFF2CC";
      modal.style.display = "none";
      const response = await fetch("https://script.google.com/macros/s/AKfycbzoSyzV6hPn6CrVnon7fIErmmbo8qWi6bLiv0m3NsKKLolup6F01QR8Yd-zvQ8L_xo-/exec", {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(data),
        mode: 'cors', //CORS対応
      });
    } else if (formId == "changeForm") {
      if (data["取り消し"] == true) {
        row.cells[5].innerText = "取り消し済み";
        row.style["background-color"] = "rgb(221, 221, 221)";
      } else {
        row.cells[2].innerText = data["勤務開始時間"] + "〜" + data["勤務終了時間"];
        row.cells[3].innerText = data["休憩時間"] + "分";
        row.cells[4].innerHTML = data["補足・備考"];
        row.cells[5].innerText = "修正済み";
        row.style["background-color"] = "#FFF2CC";
      }
      modal.style.display = "none";
      const response = await fetch("https://script.google.com/macros/s/AKfycbzoSyzV6hPn6CrVnon7fIErmmbo8qWi6bLiv0m3NsKKLolup6F01QR8Yd-zvQ8L_xo-/exec", {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(data),
        mode: 'cors', //CORS対応
      });
    } else if (formId == "answerForm") {
      row.cells[1].innerText = data["依頼への回答"];
      row.cells[4].innerHTML = data["補足・備考"];
      row.cells[5].innerText = "回答済み";
      row.style["background-color"] = "#FFF2CC";
      modal.style.display = "none";
      const response = await fetch("https://script.google.com/macros/s/AKfycbzoSyzV6hPn6CrVnon7fIErmmbo8qWi6bLiv0m3NsKKLolup6F01QR8Yd-zvQ8L_xo-/exec", {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(data),
        mode: 'cors', //CORS対応
      });

    } else {

      // フォームの無効化とボタンの色を変更
      form.querySelectorAll("input, button").forEach((element) => element.setAttribute("disabled", "disabled"));
      submitButton.style.backgroundColor = "#aaaaaa";

      try {
        // データの送信
        const response = await fetch("https://script.google.com/macros/s/AKfycbzoSyzV6hPn6CrVnon7fIErmmbo8qWi6bLiv0m3NsKKLolup6F01QR8Yd-zvQ8L_xo-/exec", {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain',
          },
          body: JSON.stringify(data),
          mode: 'cors', //CORS対応
        });

        const text = await response.text();
        if (text.includes("Success")) {
          responseMessage.textContent = "提出が完了しました。最新の情報に更新されるので、このままお待ちください。";
          responseMessage.style.color = "";
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

      }
    }

  };
};