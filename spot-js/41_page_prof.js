function profile_page(page_call_property) {
    if(urlFound && isSchool){
  
        const firstContactHTML =`
        <h2>まずは、講師への期待度をこちらからご選択ください！</h2>
        <div id="teacher-request-buttons">
        <div class="button-container" style="background-color: #19837C;">
            <input class="checkbox-input" type="checkbox" id="checkbox-request-now">
            <label for="checkbox-request-now">
            <button class="request-button" id="btn-request-now">ぜひ勤務の依頼をしたい</button>
            </label>
        </div>
        <div class="button-container" style="background-color: #19837C;">
            <input class="checkbox-input" type="checkbox" id="checkbox-request-later">
            <label for="checkbox-request-later">
            <button class="request-button" id="btn-request-later">今すぐではないが依頼したい</button>
            </label>
        </div>
        <div class="button-container" style="background-color: #19837C;">
            <input class="checkbox-input" type="checkbox" id="checkbox-request-confirm">
            <label for="checkbox-request-confirm">
            <button class="request-button" id="btn-request-confirm">確認したい事項がある</button>
            </label>
        </div>
        <div class="button-container" style="background-color: #19837C;">
            <input class="checkbox-input" type="checkbox" id="checkbox-no-need">
            <label for="checkbox-no-need">
            <button class="request-button" id="btn-no-need">この講師の紹介は不要です</button>
            </label>
        </div>
        </div>
        `
    
        const target = document.querySelector(".profile-tables")
        target.insertAdjacentHTML("beforebegin",firstContactHTML)



        // モーダル（フォームの外枠）の挿入
        const modalTemplate = `
        <div id="myModal" class="modal">
            <div class="modal-content form-container">
            </div>
        </div>`;
        document.getElementById("page-content").insertAdjacentHTML('beforeend', modalTemplate);
        const modal = document.getElementById("myModal");
  
  
        const buttons = document.querySelectorAll('.button-container');
        const messageInput = document.querySelector('#メッセージ');
    
        const messages = {
            'btn-request-now': `プロフィールを確認し、ぜひ、${newData["教室名"]}で勤務いただきたいと考えています。今日明日中に、提出いただくスケジュールを参考にシフトを依頼いたします！スケジュールに変更がありましたら、お早めにご修正ください。`,
            'btn-request-later': `プロフィールを確認し、ぜひ、${newData["教室名"]}で勤務いただきたいと考えています。直近スケジュールの調整が必要なため、【1週間以内に】連絡いたします。目安としては、〇〇頃からの勤務依頼を考えています。`,
            'btn-request-confirm': `プロフィールを確認し、とても興味を持っております。勤務依頼をするにあたって、〇〇についてご確認させていただきたいです。`,
            'btn-no-need': `以下の状況を教えて下さい（ここだけメッセージじゃなく選択フォーム） 1, まだ直接連絡をとっていない 2. 連絡済み、お断りは伝えていない 3. 連絡済み、お断りについても共有済み。`,
        }

        const chatSubmitAreaHTML =`
        <div class="chat-submit-area" style="display:none;">
            <form id="chatForm">
                <input type="hidden" id="会員ID" name="会員ID" value="9999992"><input type="hidden" id="講師名" name="講師名" value="小田涼平TEST"> 
                <input type="hidden" id="教室ID" name="教室ID" value="99999"><input type="hidden" id="教室名" name="教室名" value="ダミー教室"> 
                <div class="form-box" id="メッセージ-wrapper"> 
                    <textarea id="メッセージ" name="メッセージ" rows="4" cols="50"></textarea> 
                </div>
                <div class="form-box" id="chatButton-wrapper" style=""> 
                    <input type="submit" value="送信" class="submit-button"> 
                </div>
                </form>
        </div>
        `

        buttons.forEach(button => {
            button.addEventListener('click', function(event) {
                event.stopPropagation();

                // Uncheck all checkboxes
                const checkboxes = document.querySelectorAll('.checkbox-input');
                checkboxes.forEach(checkbox => checkbox.checked = false);
    
                // Check the checkbox related to the clicked button container
                const relatedCheckbox = this.querySelector('.checkbox-input');
                relatedCheckbox.checked = true;
    
                // Get the related button
                const relatedButton = this.querySelector('.request-button');
            
                // Change the color of button container to #19837C
                buttons.forEach(button => button.style.backgroundColor = "grey");
                this.style.backgroundColor = "#19837C";
  
                // Show and update the chat submit area in the modal
                const formContainer = modal.querySelector('.form-container');
                formContainer.innerHTML = chatSubmitAreaHTML;
                const messageInput = document.querySelector('#メッセージ');
                messageInput.value = messages[relatedButton.id];
                modal.style.display = "block";

                // Set the close button for the modal
                const closeButton = document.getElementsByClassName("close")[0];
                closeButton.onclick = () => {
                    modal.style.display = "none";
                };
  
            });
        });

        // Hide the modal when the area outside of the form is clicked
        window.onclick = function (event) {
            if (event.target == modal) {
            modal.style.display = "none";
            }
        };
    

        
    };
  };
  