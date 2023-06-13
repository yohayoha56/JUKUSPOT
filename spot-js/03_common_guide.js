function insertGuide(page_call_property){
    
    let headerTitle = newData["ページタイプ"] == "school" ? 
    `｜${newData["教室名"]}管理ページ`: `｜${newData["姓"]}${newData["名"]}先生マイページ`;

    // ページによって、トップ部分にガイドの挿入を行うための関数
    const {title, guide} = getPageTitleAndGuide(newData["ページタイプ"], page_call_property["callback"]);


    

    // ページタイトル＋サービスロゴ＋ガイドの挿入ーーーーーーーーーーーーーーーーーーーーーーーーーーー
    var target = document.getElementById("page-content");
    target.innerHTML =`
    <div class="Breadcrumbs">
        ${headerTitle}>${title}>${newData["ページタイプ"] == "school" ? `${page_call_property["講師名"]}先生`:page_call_property["教室名"]}
    </div>
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


    // ダミーページの事前判定用
    const debugUrls = ['dummy'];
    const currentUrl = window.location.href;
    const urlFound = debugUrls.some(debugUrl => currentUrl.includes(debugUrl));

    // お知らせ欄出力
    if(page_call_property["callback"]=="top_page" && urlFound){

    let newsHTML =`
    <div class="news-area">
        <div class="chat-header">
          <span class="chat-title"><i class="fa-solid fa-bullhorn"></i>お知らせ一覧</span>
        </div>
        <div class="chat-log-area">
        <!-- ここにお知らせログを表示する -->
            <div class="news-log">
                <div class="info-box">
                    <span class="timestamp">16:10</span>
                    <span class="category">16:10</span>
                </div>
                <div class="news-box">
                    お知らせが入ります。
                </div>              
            </div>
            <div class="news-log">
                <div class="info-box">
                    <span class="timestamp">16:10</span>
                    <span class="category">16:10</span>
                </div>
                <div class="news-box">
                    お知らせが入ります。
                </div>              
            </div>
            <div class="news-log">
                <div class="info-box">
                    <span class="timestamp">16:10</span>
                    <span class="category">16:10</span>
                </div>
                <div class="news-box">
                    お知らせが入ります。
                </div>              
            </div>

        </div>
    </div>
    `
    target.insertAdjacentHTML("beforeend",newsHTML);
    }


    if(page_call_property["callback"]=="chat_page"){
        let chatAreaHTML =`
      <div class="chat-area">
        <div class="chat-header">
          <span class="chat-title"><i class="fa-solid fa-message" style="color:white;"></i>
          ${newData["ページタイプ"]=="school"?`${page_call_property["講師名"]}先生`:`${page_call_property["教室名"]}`}とのチャット履歴</span>
          <span class="reload-time">
          ${new Date().toLocaleString("ja-JP", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit"})}時点</span>
          <span class="reload-button" ><i class="fa-solid fa-rotate-right" style="color: #1B7871;"></i> 更新する</span>
        </div>
        <div class="chat-log-area">
        <!-- ここにチャットのログを表示する -->
        </div>
        <div class="chat-submit-area">
          <form id="chatForm">
            <input type="hidden" id="会員ID" name="会員ID" value=""><input type="hidden" id="講師名" name="講師名" value=""> 
            <input type="hidden" id="教室ID" name="教室ID" value=""><input type="hidden" id="教室名" name="教室名" value=""> 
            <div class="form-box" id="メッセージ-wrapper"> 
              <textarea id="メッセージ" name="メッセージ"></textarea> 
            </div>
            <div class="form-box" id="chatButton-wrapper" style=""> 
                <input type="submit" value="送信" class="submit-button"> 
            </div>
          </form>
          </div>
          <p>チャットで送信した内容はメールでも${newData["ページタイプ"]=="school"?"講師":"教室"}に通知されます。</p>
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
                "title": "シフト管理ページ",
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