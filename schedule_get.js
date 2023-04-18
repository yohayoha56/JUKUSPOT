
function schedule_get(e) {
  var teacherId = e.target.getAttribute('会員ID'); // クリックされたliのvalue属性の値を取得
  var ouboId = e.target.getAttribute('応募ID'); // クリックされたliのvalue属性の値を取得

  // POSTリクエストの送信
  fetch("https://script.google.com/macros/s/AKfycbwmCc5XeYXWjCXLiztYc45LFdaX-bdzjbET8KXZcWbfF5TVwKk-dQeokyOfKivAwlB9/exec", {
    method: 'POST',
    headers: {
        'Content-Type': 'text/plain',
    },
    body: JSON.stringify({
      "講師ID": teacherId, // 検索条件にクリックされたliのvalueの値を代入
      "応募ID": ouboId // 応募IDを追加
  }),
    mode: 'cors', //CORS対応
  })
  .then(response => response.text()) 
  .then(data => {
    var target = document.getElementById("page-content");
    target.innerHTML =data;
    })
};
// li要素を取得し、クリックイベントを登録
var liElements = document.querySelectorAll('#shift-menu .child-menu li');
liElements.forEach(li => {
  li.addEventListener('click', schedule_get);
});