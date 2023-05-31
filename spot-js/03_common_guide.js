function insertGuide(page_call_property){
    // ページによって、トップ部分にガイドの挿入を行うための関数
    const {title, guide} = getPageTitleAndGuide(newData["ページタイプ"], page_call_property["callback"]);

    // ページタイトル＋サービスロゴ＋ガイドの挿入ーーーーーーーーーーーーーーーーーーーーーーーーーーー
    var target = document.getElementById("page-content");
    target.innerHTML =`
    <div class="" style="padding-left:70px;display:flex;flex-wrap:wrap; margin-top:20px;align-items:end;font-size:24px;">
    <img id="top-image" src="https://heys45.github.io/jukust/logo1.png" style="max-width: 400px; width: 100%; height: auto;margin-left:-70px;" alt="Logo">
    <p style="margin:0 0 6px 12px;font-weight:bold;color:#666;">${title}</p>
    </div>
    <div style="padding:20px 0px;" class="page-guide-wrapper">
    <p>${guide}</p>
    </div>
    `

    if(page_call_property["callback"]=="top_page"&& newData["ページタイプ"]== "teacher"&& !newData["口座番号（半角数字）"]){
        const formURL ="https://docs.google.com/forms/d/e/1FAIpQLSdshC5GsKHZhps40FNkEShsnnat6-B4Y_EQdRHk0XlXpwV9mg/viewform?usp=pp_url"
        let kojinFormHTML =`<div><a href="${formURL}&entry.1339375578=${newData["会員ID"]}">
                                勤務開始のため、個人情報と給与振り込み口座の情報を提出してください。
                            </a></div>`
        target.insertAdjacentHTML("beforeend",kojinFormHTML);
    }
    if(page_call_property["callback"]=="chat_page"){
        let chatAreaHTML =`<style>
        .chat-header {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          background-color: #1B7871;
          color: white;
          padding: 0.5em;
          gap: 0.5em;
        }
        
        .chat-title {
          flex: 1 0 auto;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .reload-time, .reload-button {
          white-space: nowrap;
        }
        
        .reload-button {
          background-color: white;
          color: #1B7871;
          padding: 3px 10px;
          border-radius: 10px;
        }
      
        .chat-log-area {
          display: flex;
          flex-direction: column;
        }
      
        .chat-log {
          display: flex;
          flex-direction: row-reverse;
        }
      
        .info-box {
          display: flex;
          flex-direction: column;
          align-items: start;
          justify-content: flex-start;
          width: 60px;
          color: #B9B9B9;
        }
      
        .chat-box {
          display: inline-block;
          max-width: 400px;
          color: #1B7871;
        }
      
        .sent .chat-box {
          background-color: #DFF4F0;
        }
      
        .received .chat-box {
          background-color: white;
        }
        
      </style>
      
      
      <div class="chat-area">
        <div class="chat-header">
          <span class="chat-title">〜〜教室とのチャット履歴</span>
          <span class="reload-time">5/23 9:00時点</span>
          <span class="reload-button" >更新する</span>
        </div>
        <div class="chat-log-area">
          <div class="chat-log sent">
            <div class="chat-box" style="display: inline-block;max-width: 400px;">メッセージが入ります</div>
            <div class="info-box"><span class="read-flag">既読</span><span class="timestamp">10:00</span></div>      
          </div>
          <div class="chat-log received" style="padding:3px 8px;">
            <div class="chat-box" style="display: inline-block;max-width: 400px;">メッセージが入ります</div>
            <div class="info-box"><span class="read-flag">既読</span><span class="timestamp">10:00</span></div>
          </div>
          <div class="chat-log sent">
            <div class="chat-box" style="display: inline-block;max-width: 400px;">メッセージが入ります</div>
            <div class="info-box"><span class="read-flag">既読</span><span class="timestamp">10:00</span></div>      
          </div>
          <div class="chat-log received" style="padding:3px 8px;">
            <div class="chat-box" style="display: inline-block;max-width: 400px;">メッセージが入ります</div>
            <div class="info-box"><span class="read-flag">既読</span><span class="timestamp">10:00</span></div>
          </div>
        </div>
        <div class="chat-submit-area">
          <form id="chatForm">
            <div class="form-box" id="会員ID-wrapper" style="display: none;"> 
              <label for="会員ID" class="form-label">会員ID:</label>
              <input type="hidden" id="会員ID" name="会員ID" value=""> 
            </div>
            <div class="form-box" id="講師名-wrapper" style="display: none;"> 
              <label for="講師名" class="form-label">講師名:</label>
              <input type="hidden" id="講師名" name="講師名" value=""> 
            </div>
            <div class="form-box" id="教室ID-wrapper" style="display: none;"> 
              <label for="教室ID" class="form-label">教室ID:</label>
              <input type="hidden" id="教室ID" name="教室ID" value=""> 
            </div>
            <div class="form-box" id="教室名-wrapper" style="display: none;">     
              <label for="教室名" class="form-label">教室名:</label>
              <input type="hidden" id="教室名" name="教室名" value=""> 
            </div>
            <div class="form-box" id="メッセージ-wrapper" style="width: 100%;"> 
              <label for="メッセージ" class="form-label">
                補足・備考:
              </label>
              <textarea id="メッセージ" name="メッセージ"></textarea> 
            </div>
            <div class="form-box" id="chatButton-wrapper" style=""> 
                <input type="submit" value="送信" class="submit-button"> 
            </div>
          </form>
        </div>
      </div>`
        target.insertAdjacentHTML("beforeend",chatAreaHTML);
    }

}

// ページタイプとコールバックに基づいてページタイトルとガイドを返す関数ーーーーーーーーーーーーーーー
function getPageTitleAndGuide(pageType, callback) {
    let titlesAndGuides = {
        "school": { //教室ページの定義ーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
            "top_page": {
                "title": "教室トップページ",
                "guide": "スポットバイトのご利用ありがとうございます。<br>講師プロフィール・シフト確認は左のタブをクリックしてください。<br>勤務確定／勤務依頼中のシフトは下記よりご確認ください。"
            },
            "shift_page": {
                "title": "シフト依頼ページ",
                "guide": `
                【シフト依頼方法】<br>①下記より講師スケジュールをご確認ください。<br>②勤務依頼したい日程の右側から<span>新規依頼する</span> ボタンをクリックしてください。<br>
                ③ポップアップが表示されますので、プルダウンで勤務開始時間／終了時間・休憩時間を入力し<span>シフトを依頼する </span>ボタンをクリックしてください。<br>
                ④講師の回答があるまでしばらくお待ちください。<br>※講師から回答が遅い場合は直接ご連絡ください。<br>※システムエラーなどお困りの場合はチャットよりお問い合わせください。
                `
            },
            "kintai_page": {
                "title": "過去勤怠確認ページ",
                "guide": "勤務が完了したシフトが表示されます。"
            },
            "profile_page": {
                "title": "講師プロフィール",
                "guide": "登録されているプロフィール情報が表示されます。<br>指導可能科目は、講師登録時の任意選択となっています。最新の指導可能科目は講師に直接ご確認ください。"
            },
            "chat_page": {
                "title": "講師連絡ページ",
                "guide": "登録されている講師とのチャット連絡が可能です。"
            },
        },
        "teacher": { //講師ページの定義ーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
            "top_page": {
                "title": "講師トップページ",
                "guide": "このページでは 出勤 / 退勤 の報告とこれからの勤務予定の確認ができます。教室からの勤務依頼への回答も可能です。<br>まずは、スケジュール提出を、左の<span>シフト管理ページ</span>よりお願い致します。"
            },
            "shift_page": {
                "title": "講師トップページ",
                "guide": `
                【スケジュール提出方法】<br>①右側の<span>提出する</span>ボタンをクリックしてください。<br>②ポップアップが表示されますので、勤務の可否を登録してください。<br>
                ・勤務可能／勤務不可／調整中　※勤務可能な場合は可能な時間を入力してください。<br>③<span>スケジュールを提出する</span>ボタンをクリックすると提出完了です。<br>
                ④教室からのシフト決定まで今しばらくお待ちください。<br>（通常3〜4営業日で確定のご連絡をしております。ご不明点はチャットよりお問い合わせください。）<br>
                ※教室から勤務依頼確定後のキャンセルは原則不可となっております。<br>※変更がある場合は速やかに<span>変更する</span>ボタンより変更の登録をお願い致します。
                `
            },
            "kintai_page": {
                "title": "過去勤怠確認ページ",
                "guide": "勤務が完了したシフトが表示されます。"
            },
            "profile_page": {
                "title": "講師プロフィール",
                "guide": "登録されているプロフィール情報が表示されます。"
            },
            "chat_page": {
                "title": "教室連絡ページ",
                "guide": "登録されている教室とのチャット連絡が可能です。"
            },
        }
    };

    return titlesAndGuides[pageType][callback];
}