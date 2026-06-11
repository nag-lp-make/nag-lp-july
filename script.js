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

  // すべての data-button-name 要素にクリック計測を付与
  document.querySelectorAll('[data-button-name]').forEach(function (el) {
    el.addEventListener('click', function () {
      var name = el.getAttribute('data-button-name');
      var log = getLog();
      log.push({ name: name, time: new Date().toISOString() });
      saveLog(log);
    });
  });

  // クリック履歴表示
  document.getElementById('showHistory').addEventListener('click', function () {
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
