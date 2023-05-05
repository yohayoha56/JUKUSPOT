// 山手線の駅データと運賃データ
const yamanoteLineStations = [
    "品川", "大崎", "五反田", "目黒", "恵比寿", "渋谷", "原宿", "代々木", "新宿", "新大久保", "高田馬場", "目白", "池袋", "大塚", "巣鴨", "駒込", "田端", "西日暮里", "日暮里", "鶯谷", "上野", "御徒町", "秋葉原", "神田", "東京", "有楽町", "新橋", "浜松町", "田町", "品川"
  ];
  
  const yamanoteLineFares = [
    140, 140, 160, 160, 170, 170, 170, 180, 180, 190, 190, 200, 200, 200, 210, 210, 220, 220, 220, 230, 230, 230, 240, 240, 250
  ];

  // カテゴリ選択時に山手線の駅選択肢を表示する関数を追加
  function showYamanoteLineStations() {
    const categorySelect = document.getElementById("カテゴリ");
    const fare_box = document.createElement("div");
    fare_box.style.display="none";
    fare_box.setAttribute("id","fare-display")
    document.getElementById("タグ-wrapper").after(fare_box);
    categorySelect.addEventListener("change", function () {
      if (this.value === "交通費") {
        const fareDisplay = document.getElementById("fare-display");
        fareDisplay.innerHTML = createYamanoteLineStationSelector();
        fareDisplay.style.display = "block";
        document.getElementById("station1").addEventListener("change", calculateFare);
        document.getElementById("station2").addEventListener("change", calculateFare);
      } else {
        document.getElementById("fare-display").style.display = "none";
      }
    });
  }

  // 山手線の駅選択肢のHTMLを生成
  function createYamanoteLineStationSelector() {
    let selectorHTML = `
      <label for="station1">駅1:</label>
      <select id="station1" name="station1">
        <option value="">選択してください</option>`;
    
    yamanoteLineStations.forEach(station => {
      selectorHTML += `<option value="${station}">${station}</option>`;
    });


    selectorHTML += `
      </select>
      <label for="station2">駅2:</label>
      <select id="station2" name="station2">
      <option value="">選択してください</option>`;

      yamanoteLineStations.forEach(station => {
        selectorHTML += `<option value="${station}">${station}</option>`;
      });
      
      selectorHTML += `
        </select>
        <p id="fare-result"></p>
      `;
      return selectorHTML;
    }

    // 選択された駅間の運賃を計算して表示する関数
    function calculateFare() {
    const station1 = document.getElementById("station1").value;
    const station2 = document.getElementById("station2").value;
    if (station1 !== "" && station2 !== "") {
        const station1Index = yamanoteLineStations.indexOf(station1);
        const station2Index = yamanoteLineStations.indexOf(station2);
        const distance = Math.abs(station1Index - station2Index);
        const fare = yamanoteLineFares[distance - 1];
        
        document.getElementById("fare-result").innerHTML = `運賃は${fare}円です。`;
      }
    }

