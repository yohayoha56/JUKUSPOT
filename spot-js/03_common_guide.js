function insertGuide(page_call_property){
    // ページによって、トップ部分にガイドの挿入を行うための関数

    let pageTitle,pageGuide
    const isSchool = newData["ページタイプ"] == "school";
    const isTeacher = newData["ページタイプ"] == "teacher";

    switch (page_call_property["callback"]) {
        case "top_page":
            pageTitle = isSchool?`教室トップページ`:`講師トップページ`;
            pageGuide = isSchool?`
            スポットバイトのご利用ありがとうございます。<br>
            講師プロフィール・シフト確認は左のタブをクリックしてください。<br>
            勤務確定／勤務依頼中のシフトは下記よりご確認ください。
            `:`
            このページでは 出勤 / 退勤 の報告とこれからの勤務予定の確認ができます。教室からの勤務依頼への回答も可能です。<br>
            まずは、スケジュール提出を、左の<span>シフト管理ページ</span>よりお願い致します。
            `;

            // トップページのガイドなどの挿入ーーーーーーーーーーーーーーーーーーーーーーーーーーー
            var target = document.getElementById("page-content");
            target.innerHTML =`
            <div class="" style="padding-left:70px;display:flex;flex-wrap:wrap; margin-top:20px;align-items:end;font-size:24px;">
            <img id="top-image" src="https://heys45.github.io/jukust/logo1.png" style="width: 400px; height: auto;margin-left:-70px;" alt="Logo">
            <p style="margin:0 0 6px 12px;font-weight:bold;color:#666;">${pageTitle}</p>
            </div>
            <div style="padding:20px 0px;" class="page-guide-wrapper">
            <p>${pageGuide}</p>
            </div>
            `
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
            target.insertAdjacentHTML("beforeend",kojinFormHTML);
            }

        break;
        case "shift_page":
            pageTitle = isSchool?`シフト依頼ページ`:`シフト管理ページ`;
            pageGuide = isSchool?`
            【シフト依頼方法】<br>
            ①下記より講師スケジュールをご確認ください。<br>
            ②勤務依頼したい日程の右側から<span>新規依頼する</span> ボタンをクリックしてください。<br>
            ③ポップアップが表示されますので、プルダウンで勤務開始時間／終了時間・休憩時間を入力し<span>シフトを依頼する </span>ボタンをクリックしてください。<br>
            ④講師の回答があるまでしばらくお待ちください。<br>
            ※講師から回答が遅い場合は直接ご連絡ください。<br>
            ※システムエラーなどお困りの場合はチャットよりお問い合わせください。
            `:`
            【スケジュール提出方法】<br>
            ①右側の<span>提出する</span>ボタンをクリックしてください。<br>
            ②ポップアップが表示されますので、勤務の可否を登録してください。<br>
            ・勤務可能／勤務不可／調整中　※勤務可能な場合は可能な時間を入力してください。<br>
            ③<span>スケジュールを提出する</span>ボタンをクリックすると提出完了です。<br>
            ④教室からのシフト決定まで今しばらくお待ちください。<br>
            （通常3〜4営業日で確定のご連絡をしております。ご不明点はチャットよりお問い合わせください。）<br>
            ※教室から勤務依頼確定後のキャンセルは原則不可となっております。<br>
            ※変更がある場合は速やかに<span>変更する</span>ボタンより変更の登録をお願い致します。
            `;

            // トップページのガイドなどの挿入ーーーーーーーーーーーーーーーーーーーーーーーーーーー
            var target = document.getElementById("page-content");
            target.innerHTML =`
            <div class="" style="padding-left:70px;display:flex;flex-wrap:wrap; margin-top:20px;align-items:end;font-size:24px;">
            <img id="top-image" src="https://heys45.github.io/jukust/logo1.png" style="width: 400px; height: auto;margin-left:-70px;" alt="Logo">
            <p style="margin:0 0 6px 12px;font-weight:bold;color:#666;">${pageTitle}</p>
            </div>
            <div style="padding:20px 0px;" class="page-guide-wrapper">
            <p>${pageGuide}</p>
            </div>
            `
        break;
        case "kintai_page":
            pageTitle = `勤怠確認ページ`;
            pageGuide = isSchool?`
                勤務が完了したシフトが表示されます。
            `:`
                勤務が完了したシフトが表示されます。
            `;

            // トップページのガイドなどの挿入ーーーーーーーーーーーーーーーーーーーーーーーーーーー
            var target = document.getElementById("page-content");
            target.innerHTML =`
            <div class="" style="padding-left:70px;display:flex;flex-wrap:wrap; margin-top:20px;align-items:end;font-size:24px;">
            <img id="top-image" src="https://heys45.github.io/jukust/logo1.png" style="width: 400px; height: auto;margin-left:-70px;" alt="Logo">
            <p style="margin:0 0 6px 12px;font-weight:bold;color:#666;">${pageTitle}</p>
            </div>
            <div style="padding:20px 0px;" class="page-guide-wrapper">
            <p>${pageGuide}</p>
            </div>
            `
            break;
        case "profile_page": 
            pageTitle = isSchool?`講師プロフィール`:`マイプロフィール`;
            pageGuide = isSchool?`
                登録されているプロフィール情報が表示されます。<br>
                指導可能科目は、講師登録時の任意選択となっています。最新の指導可能科目は講師に直接ご確認ください。<br>
            `:`
                登録されているプロフィール情報が表示されます。<br>
            `;

            // トップページのガイドなどの挿入ーーーーーーーーーーーーーーーーーーーーーーーーーーー
            var target = document.getElementById("page-content");
            target.innerHTML =`
            <div class="" style="padding-left:70px;display:flex;flex-wrap:wrap; margin-top:20px;align-items:end;font-size:24px;">
            <img id="top-image" src="https://heys45.github.io/jukust/logo1.png" style="width: 400px; height: auto;margin-left:-70px;" alt="Logo">
            <p style="margin:0 0 6px 12px;font-weight:bold;color:#666;">${pageTitle}</p>
            </div>
            <div style="padding:20px 0px;" class="page-guide-wrapper">
            <p>${pageGuide}</p>
            </div>
            `
        break;
    }


}