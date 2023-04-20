function kintai_create(){}
function profile_create(){}

function top_create(){
    const table = document.getElementById('fixed-table');
    const rows = Array.from(table.querySelectorAll('tbody > tr'));

    // 勤怠ステータスが "退勤報告済み" の行を抽出
    const reportedRows = rows.filter(row => {
        const statusCell = row.querySelector('td:nth-child(3)');
        return statusCell && statusCell.innerText === '退勤報告済み';
    });

    const formsContainer = document.getElementById('forms-container');


// 勤務承認フォームを作成
reportedRows.forEach(row => {
    const date = row.querySelector('td:nth-child(1)').innerText;
    const teacher = row.querySelector('td:nth-child(2)').innerText;
    const workTime = row.querySelector('td:nth-child(4)').innerText;
    const breakTime = row.querySelector('td:nth-child(5)').innerText;
    const remarks = row.querySelector('td:nth-child(6)').innerText;

    const formTemplate = `
    <div class="approval-form form-container">
        <h3>${date}｜${teacher}先生｜勤務承認フォーム</h3>
        <h4>勤務情報</h4>
        <ul>
            <li>・勤務依頼時間：${workTime}</li>
            <li>・休憩時間：${breakTime}</li>
            <li>・備考・補足：${remarks}</li>
        </ul>
        <form class="form-content">
            <input type="hidden" name="working_day" value="${date}">
            <input type="hidden" name="teacher_name" value="${teacher}">
            <input type="hidden" name="classroom_name" value="教室名">
            <input type="hidden" name="old_remarks" value="${remarks}">
            <input type="hidden" name="attendance_status" value="教室承認済み">
            <h4>↓勤務時間に変更があった場合には入力してください</h4>
            <!-- 勤務開始時間 -->
            <div class="form-row">
                <label for="start_hour">・勤務開始時間</label>
                <div class="form-inline">
                    <select id="start_hour" name="start_hour">
                    <!-- 8:00 ~ 22:00 の選択肢を生成 -->
                    <option value="">--</option>
                    </select>
                    <label for="start_minute">時</label>
                    <select id="start_minute" name="start_minute">
                    <option value="">--</option>
                    </select>分
                </div>
            </div>
            <!-- 勤務終了時間 -->
            <div class="form-row">
                <label for="end_hour">・勤務終了時間</label>
                <div class="form-inline">
                    <select id="end_hour" name="end_hour">
                    <!-- 8:00 ~ 22:00 の選択肢を生成 -->
                    <option value="">--</option>
                    </select>
                    <label for="end_minute">時</label>
                    <select id="end_minute" name="end_minute">
                    <option value="">--</option>
                    </select>分
                </div>
            </div>
            <!-- 休憩時間 -->
            <div class="form-row">
                <label for="break_time">・休憩時間</label>
                <div class="form-inline">
                <select id="break_time" name="break_time">
                <option value="">--</option>
                </select>分
            </div>
        </div>
        <!-- 補足・備考 -->
        <div class="form-row">
            <label for="remarks">・補足・備考</label>
            <textarea id="remarks" name="remarks"></textarea>
        </div>
        <div class="form-row buttons">
            <button type="submit">勤務を承認する</button>
        </div>
    </form>
</div>
`;
formsContainer.insertAdjacentHTML('beforeend', formTemplate);
});


    // フォームのオプション生成
    function addOptions(selectElement, start, end, step) {
        for (let i = start; i <= end; i += step) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            selectElement.appendChild(option);
        }
    }
    // 勤務開始時間 (時)
    const startHour = document.getElementById('start_hour');
    addOptions(startHour, 8, 22, 1);
    // 勤務開始時間 (分)
    const startMinute = document.getElementById('start_minute');
    addOptions(startMinute, 0, 50, 10);
    // 勤務終了時間 (時)
    const endHour = document.getElementById('end_hour');
    addOptions(endHour, 8, 22, 1);
    // 勤務終了時間 (分)
    const endMinute = document.getElementById('end_minute');
    addOptions(endMinute, 0, 50, 10);
    // 休憩時間
    const breakTime = document.getElementById('break_time');
    addOptions(breakTime, 0, 120, 10);

};



// フォームの送信をハンドルする関数
const handleSubmit = async (event) => {
    event.preventDefault(); // デフォルトの送信をキャンセル
    const form = document.querySelector('#myForm');
    const formData = new FormData(form);
    const data = {};
    // FormDataオブジェクトから連想配列に変換
    for (const [key, value] of formData.entries()) {
        data[key] = value;
    }
    // 更新用キー要素
    data["勤務日"] = data["working_day"]
    data["教室名"] = newData("教室名");
    data["講師名"] = data["teacher_name"]
    data["勤怠ステータス"] = data["attendance_status"]

    // 勤務開始時間、終了時間、休憩時間をdataに追加
    data["勤務開始時間"] = data["start_hour"] + ':' + (data["start_minute"] === '0' ? '00' : data["start_minute"]);
    data["勤務終了時間"] = data["end_hour"] + ':' + (data["end_minute"] === '0' ? '00' : data["end_minute"]);
    data["休憩時間"] = data["break_time"];

    // 日本時間のタイムスタンプを追加
    data["submitted_timestamp"] = new Date().toLocaleString("ja-JP");

    // 依頼取り消しを追加
    data["request_cancellation"] = false;

    
    let remarks_label ="";
    // 退勤時のプロパティ変更ーーーーーーーーーーーーーーーーーーーーーーー
    if(data["勤怠ステータス"] =="退勤報告済み"){
        remarks_label = "退勤報告時[from:講師]\n";
        if(data["勤務開始時間"]!="--"){
        remarks_label =data["old_remarks"]+"退勤報告時[from:講師]\n【勤務時間の変更申請】あり\n勤務時間："+data["勤務開始時間"]+"~"+data["勤務終了時間"] +"｜休憩時間："+data["休憩時間"]+"\n";
        }
    }
    // 承認時のプロパティ変更ーーーーーーーーーーーーーーーーーーーーーーー
    if(data["勤怠ステータス"] =="教室承認済み"){
        data["教室承認開始時刻"] = data["勤務開始時間"]
        data["教室承認終了時刻"] = data["勤務終了時間"]
        data["教室承認休憩時間"] = data["休憩時間"]
        remarks_label = "勤務承認時[from:教室]\n";
    }
    // 補足・備考のテキストに追記ーーーーーーーーーーーーーーーーーーーーー
    data["remarks"] = remarks_label + data["remarks"];


    // データ送信処理ーーーーーーーーーーーーーーーーーーーーーーーーーーー
    console.log(data);
    const response = await fetch("https://script.google.com/macros/s/AKfycbznZnFWKCGKkyWVdGF-G_1H7msAfozU4voXv4jM63GLfifPIzw1BQ96y-OxUI88pcdj/exec", {
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



