function makeFormElement(e) {
    const { type, name, value, inline, width, breakAfter, options, minHour, maxHour, stepMinute, minMinute, maxMinute } = e;
  
    // options の disabled と selected を処理
    const processedOptions = options && options.map(option => ({
      ...option,
      disabled: option.disabled ? ' disabled' : '',
      selected: option.selected ? ' selected' : ''
    }));
  
    // ラベルの作成
    const label = `
      <label for="${name}" class="form-label">
        ${name}:
      </label>
    `;
  
    let formElement;
  
    if (type === "select") {
        // セレクト要素の作成ーーーーーーーーーーーーーーーーーーーーーーーーーーー
        const optionsHTML = processedOptions.map(option => `
            <option value="${option.value}"${option.disabled}${option.selected}>
            ${option.text}
            </option>`).join("");
  
        formElement = `<select name="${name}" id="${name}">${optionsHTML}</select>`;
    } else if (type === "time") {
        // 時間入力ボックスの作成ーーーーーーーーーーーーーーーーーーーーーーーーー
        const hours = Array.from({length: maxHour - minHour + 1}, (_, i) => i + minHour)
            .map(hour => `<option value="${hour}">${hour}</option>`).join("");
    
        const minutes = Array.from({length: 60 / stepMinute}, (_, i) => i * stepMinute)
            .map(minute => `<option value="${minute}">${minute}</option>`).join("");
    
        formElement = `
            <div class="time-wrapper">
            <select name="${name}_hour" id="${name}_hour">
                <option value="">--</option>
                ${hours}
            </select>
            時
            <select name="${name}_minute" id="${name}_minute">
                <option value="">--</option>
                ${minutes}
            </select>
            分
            </div>
        `;
    } else if (type === "minute") {
        // 時間入力ボックス２の作成ーーーーーーーーーーーーーーーーーーーーーーーーー
        const minutes = Array.from({length: (maxMinute - minMinute) / stepMinute + 1}, (_, i) => i * stepMinute + minMinute)
            .map(minute => `<option value="${minute}">${minute}</option>`).join("");
    
        formElement = `
            <div class="time-wrapper">
            <select name="${name}" id="${name}">
                <option value="">--</option>
                ${minutes}
            </select>
            分
            </div>
        `;
    } else if (type === "textarea") {
        // テキストエリア要素の作成ーーーーーーーーーーーーーーーーーーーーーーーー
        formElement = `<textarea id="${name}" name="${name}"></textarea>`;
    } else if (type === "checkbox") {
        // チェックボックスの作成ーーーーーーーーーーーーーーーーーーーーーーーーー
        formElement = `
            <input type="checkbox" id="${name}" name="${name}" class="hidden_checkbox">
            <span></span>`;
    } else if (type === "submit") {
        // 送信ボタンの作成ーーーーーーーーーーーーーーーーーーーーーーーーーーーー
        formElement = `<input type="submit" value="${text}" class="submit-button">`;
    } else {
        //その他のインプット要素の作成ーーーーーーーーーーーーーーーーーーーーーーー
        formElement = `<input type="${type}" id="${name}" name="${name}" value="${value}">`;
    }

    // フォーム要素の梱包
    const formBoxClass = `form-box``${inline ? " inline-box" : ""}`;
    const formBoxStyle = `${width ? `width: ${width};`: ""}${breakAfter ?`margin-right: calc(100% - ${width});` : ""}${type === "hidden" ? "display: none;" : ""}`;
    
    const formBox =`
    <div class="${formBoxClass}" id="${name}-wrapper" style="${formBoxStyle}"> 
        ${label}
        ${formElement} 
    </div> 
    `;

    const parser = new DOMParser();
    const formBoxDom = parser.parseFromString(formBox, "text/html").body.firstChild;
    return formBoxDom;

}

