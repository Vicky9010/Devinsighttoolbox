function fetchIPData(ip = '') {
    fetch(`https://ipapi.co/${ip}/json/`)
      .then(res => res.json())
      .then(data => {
        const info = [
          `IP Address: ${data.ip}`,
          `City: ${data.city}`,
          `Region: ${data.region}`,
          `Country: ${data.country_name}`,
          `ISP: ${data.org}`,
          `Timezone: ${data.timezone}`,
          `Latitude: ${data.latitude}`,
          `Longitude: ${data.longitude}`
        ];
        document.getElementById('ip-info').innerHTML = info.map(item => `<li class="list-group-item">${item}</li>`).join('');
  
        const map = L.map('map').setView([data.latitude, data.longitude], 12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap'
        }).addTo(map);
        L.marker([data.latitude, data.longitude]).addTo(map).bindPopup(ip ? `IP: ${data.ip}` : 'You are here!').openPopup();
      });
  }
  
  document.getElementById('ip-search').addEventListener('click', () => {
    const ip = document.getElementById('ip-input').value.trim();
    fetchIPData(ip);
  });
  
  fetchIPData(); // Load own IP on page load
  
  const editor = CodeMirror.fromTextArea(document.getElementById('code'), {
    mode: 'javascript',
    lineNumbers: true,
    theme: 'default'
  });
  
  document.getElementById('run-code').addEventListener('click', () => {
    const code = editor.getValue();
    const output = document.getElementById('output');
    output.innerHTML = '';
    const logs = [];
    const originalLog = console.log;
    console.log = (...args) => logs.push(args.join(' '));
  
    editor.operation(() => {
      for (let i = 0; i < editor.lineCount(); i++) {
        editor.removeLineClass(i, 'background', 'error-line');
      }
    });
  
    try {
      const result = eval(code);
      if (result !== undefined) logs.push(`Output: ${result}`);
    } catch (err) {
      logs.push(`Error: ${err.message}`);
      const match = err.stack.match(/<anonymous>:(\d+):(\d+)/);
      if (match) {
        const line = parseInt(match[1], 10) - 1;
        editor.addLineClass(line, 'background', 'error-line');
      }
    }
  
    console.log = originalLog;
    output.innerHTML = logs.map(line => `<div>> ${line}</div>`).join('');
  });
  
  document.getElementById('save-code').addEventListener('click', () => {
    localStorage.setItem('savedCode', editor.getValue());
    alert('Code saved!');
  });
  document.getElementById('load-code').addEventListener('click', () => {
    const saved = localStorage.getItem('savedCode');
    if (saved) editor.setValue(saved);
    else alert('No code found.');
  });
  
  document.getElementById('toggle-theme').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  });
  