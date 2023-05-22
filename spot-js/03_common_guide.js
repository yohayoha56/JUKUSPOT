function insertGuide(page_call_property){
    // ページによって、トップ部分にガイドの挿入を行うための関数
    switch (page_call_property["callback"]) {
        case "top_page":
              // トップページのガイドなどの挿入ーーーーーーーーーーーーーーーーーーーーーーーーーーー
            var target = document.getElementById("page-content");
            const topHTML =`
            <div class="" style="padding-left:70px;display:flex;flex-wrap:wrap; margin-top:20px;align-items:end;font-size:24px;">
            <img id="top-image" src="https://heys45.github.io/jukust/logo1.png" style="width: 400px; height: auto;margin-left:-70px;" alt="Logo">
            <p style="margin:0 0 6px 12px;font-weight:bold;color:#666;">${newData["ページタイプ"] == "school"?`教室トップページ`:`講師トップページ`}</p>
            </div>
            <div style="padding:20px 0px;">
            <p>
                スポットバイトのご利用ありがとうございます。<br>
                ${newData["ページタイプ"] == "school"?`
                講師プロフィール・シフト確認は左のタブをクリックしてください。<br>
                勤務確定／勤務依頼中のシフトは下記よりご確認ください。<br>
                `:`
                このページでは 出勤 / 退勤 の報告とこれからの勤務予定の確認ができます。教室からの勤務依頼への回答も可能です。<br>
                まずは、スケジュール提出を、左の "シフト管理ページ" よりお願い致します。
                `}
            </div>
            `
            target.insertAdjacentHTML("afterbegin",topHTML)

            // トップページのガイドなどの挿入ーーーーーーーーーーーーーーーーーーーーーーーーーーー

            if(newData["ページタイプ"]== "teacher"&& !newData["口座番号（半角数字）"]){
            const formURL ="https://docs.google.com/forms/d/e/1FAIpQLSdshC5GsKHZhps40FNkEShsnnat6-B4Y_EQdRHk0XlXpwV9mg/viewform?usp=pp_url"
            let kojinFormHTML =`
            <div>
            <a href="${formURL}&entry.1339375578=${newData["会員ID"]}">
                勤務開始のため、個人情報と給与振り込み口座の情報を提出してください。
            </a>
            </div>
            `
            document.getElementById("page-content").insertAdjacentHTML("afterbegin",kojinFormHTML)
            }






        break;
        case "shift_page":
        break;
        case "kintai_page":
        case "profile_page": 
        
        
        
        break;
    }












}