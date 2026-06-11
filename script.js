(function () {
  var STORAGE_KEY = 'nag_click_log';

  function getLog() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  function saveLog(log) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
    } catch (e) {}
  }

  function formatDate(iso) {
    var d = new Date(iso);
    var pad = function (n) { return String(n).padStart(2, '0'); };
    return d.getFullYear() + '/' +
           pad(d.getMonth() + 1) + '/' +
           pad(d.getDate()) + ' ' +
           pad(d.getHours()) + ':' +
           pad(d.getMinutes()) + ':' +
           pad(d.getSeconds());
  }

  // DOM読み取りをまとめて先行実施（強制リフロー防止）
  var trackingEls = Array.from(document.querySelectorAll('[data-button-name]'));
  var buttonNames = trackingEls.map(function (el) {
    return el.getAttribute('data-button-name');
  });
  var historyBtn = document.getElementById('showHistory');

  // イベントリスナー登録（DOM書き込み）をまとめて実施
  trackingEls.forEach(function (el, i) {
    el.addEventListener('click', function () {
      var log = getLog();
      log.push({ name: buttonNames[i], time: new Date().toISOString() });
      saveLog(log);
    });
  });

  historyBtn.addEventListener('click', function () {
    var log = getLog();
    if (log.length === 0) {
      alert('クリック履歴はまだありません。');
      return;
    }
    var lines = log.map(function (entry, i) {
      return (i + 1) + '. ' + formatDate(entry.time) + '\n   ' + entry.name;
    });
    alert('【クリック履歴】\n\n' + lines.join('\n\n'));
  });
})();
