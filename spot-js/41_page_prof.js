
function profile_page(page_call_property) {
  if(urlFound && isSchool){
    console.log("test")

    const firstContactHTML =`
    <div id="teacher-request-buttons">
    <div class="button-container">
        <input class="checkbox-input" type="checkbox" id="checkbox-request-now">
        <label for="checkbox-request-now">
        <button class="request-button" id="btn-request-now">ぜひ勤務の依頼をしたい</button>
        </label>
    </div>
    <div class="button-container">
        <input class="checkbox-input" type="checkbox" id="checkbox-request-later">
        <label for="checkbox-request-later">
        <button class="request-button" id="btn-request-later">今すぐではないが依頼したい</button>
        </label>
    </div>
    <div class="button-container">
        <input class="checkbox-input" type="checkbox" id="checkbox-request-confirm">
        <label for="checkbox-request-confirm">
        <button class="request-button" id="btn-request-confirm">確認したい事項がある</button>
        </label>
    </div>
    <div class="button-container">
        <input class="checkbox-input" type="checkbox" id="checkbox-no-need">
        <label for="checkbox-no-need">
        <button class="request-button" id="btn-no-need">この講師の紹介は不要です</button>
        </label>
    </div>
    </div>



    <div id="message-box" style="display:none;">
        <textarea id="message-input" rows="4" cols="50"></textarea>
        <button id="send-message">この内容で講師にメッセージを送る</button>
    </div>
    `

    const target = document.querySelector(".profile-tables")
    target.insertAdjacentHTML("beforebegin",firstContactHTML)

    const buttons = document.querySelectorAll('.request-button');
    const messageBox = document.getElementById('message-box');
    const messageInput = document.getElementById('message-input');

    const messages = {
        'btn-request-now': `プロフィールを確認し、ぜひ、${newData["教室名"]}で勤務いただきたいと考えています。今日明日中に、提出いただくスケジュールを参考にシフトを依頼いたします！スケジュールに変更がありましたら、お早めにご修正ください。`,
        'btn-request-later': `プロフィールを確認し、ぜひ、${newData["教室名"]}で勤務いただきたいと考えています。直近スケジュールの調整が必要なため、【1週間以内に】連絡いたします。目安としては、〇〇頃からの勤務依頼を考えています。`,
        'btn-request-confirm': `プロフィールを確認し、とても興味を持っております。勤務依頼をするにあたって、〇〇についてご確認させていただきたいです。`,
        'btn-no-need': `以下の状況を教えて下さい（ここだけメッセージじゃなく選択フォーム） 1, まだ直接連絡をとっていない 2. 連絡済み、お断りは伝えていない 3. 連絡済み、お断りについても共有済み。`,
    }


    buttons.forEach(button => {
        button.addEventListener('click', function() {
          // Uncheck all checkboxes
          const checkboxes = document.querySelectorAll('.checkbox-input');
          checkboxes.forEach(checkbox => checkbox.checked = false);
      
          // Check the checkbox related to the clicked button
          const relatedCheckbox = document.getElementById('checkbox-' + this.id.split('-')[1]);
          relatedCheckbox.checked = true;
      
          // Show and update the message box
          messageBox.style.display = "block";
          messageInput.value = messages[this.id];
        });
      });
      


  }  











};
