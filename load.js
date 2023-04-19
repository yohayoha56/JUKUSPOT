// 外部CSSの読み込み
function loadStylesheet(url) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = url;
    document.head.appendChild(link);
  }

  const stylesheets = [
    'https://heys45.github.io/SAUCEED/progressbar.css',
    'https://heys45.github.io/SAUCEED/sidemenue.css',
    'https://heys45.github.io/SAUCEED/schedule_form.css',
    'https://heys45.github.io/SAUCEED/schedule_table.css',
  ];
  stylesheets.forEach((url) => loadStylesheet(url));


// 外部JSの読み込み
  function loadScript(url, delay = 3000) {
    setTimeout(() => {
      var script = document.createElement('script');
      script.defer = true;
      script.src = url;
      document.body.appendChild(script);
    }, delay);
  }

  const scripts = [
    'https://heys45.github.io/SAUCEED/common.js',
    'https://heys45.github.io/SAUCEED/school_top.js',
    'https://heys45.github.io/SAUCEED/schedule_get.js',
    'https://heys45.github.io/SAUCEED/kintai_get.js',
    'https://heys45.github.io/SAUCEED/form_control.js?111',
  ];
  scripts.forEach((url) => loadScript(url));

// プロパティの出力
  setTimeout(() => {
    console.log(newData);
  }, 5000);