(() => {
  const STATES = [
    'Madhya Pradesh', 'Maharashtra', 'Punjab', 'Haryana', 'Uttar Pradesh',
    'Gujarat', 'Rajasthan', 'Karnataka', 'Andhra Pradesh', 'Telangana',
    'Bihar', 'Chhattisgarh', 'Odisha', 'Tamil Nadu', 'West Bengal',
    'Assam', 'Himachal Pradesh', 'Jharkhand', 'Kerala', 'Uttarakhand', 'Other'
  ];

  const CROPS = [
    { id: 'Wheat', label: 'गेहूं (Wheat)', variety: 'Sharbati / Lokwan' },
    { id: 'Rice', label: 'धान / चावल (Paddy)', variety: 'Basmati / Sona Masoori' },
    { id: 'Cotton', label: 'कपास (Cotton)', variety: 'BT Hybrid' },
    { id: 'Soybean', label: 'सोयाबीन (Soybean)', variety: 'Yellow' },
    { id: 'Pulses', label: 'चना / दालें (Gram/Pulses)', variety: 'Desi Chana' },
    { id: 'Maize', label: 'मक्का (Maize)', variety: 'Kharif/Rabi' },
    { id: 'Sugarcane', label: 'गन्ना (Sugarcane)', variety: 'Co 0238' },
    { id: 'Mustard', label: 'सरसों (Mustard)', variety: 'Pusa' },
    { id: 'Onion', label: 'प्याज (Onion)', variety: 'Nashik Red' },
    { id: 'Potato', label: 'आलू (Potato)', variety: 'Kufri Jyoti' },
    { id: 'Millets', label: 'बाजरा / ज्वार (Millets)', variety: 'Desi' },
    { id: 'Groundnut', label: 'मूंगफली (Groundnut)', variety: 'Bold' }
  ];

  // If already logged in, redirect to app
  const nextUrl = () => {
    const n = localStorage.getItem('ks_next');
    localStorage.removeItem('ks_next');
    return n && n.startsWith('/join/') ? n : '/app';
  };
  if (localStorage.getItem('ks_token')) location.replace(nextUrl());

  const $ = (id) => document.getElementById(id);

  // Attach language selector
  if (window.I18N && $('hero-lang')) {
    $('hero-lang').innerHTML = I18N.selectorHtml();
    I18N.attachPicker($('hero-lang'));
  }

  $('r-state').insertAdjacentHTML('beforeend', STATES.map((s) => `<option value="${s}">${s}</option>`).join(''));
  $('crops').innerHTML = CROPS.map((c) => `
    <label class="crop" title="${c.variety}">
      <input type="checkbox" value="${c.id}">
      <span>${c.label}</span>
    </label>
  `).join('');

  const tabs = $('tabs');
  function show(which) {
    tabs.dataset.active = which;
    document.querySelectorAll('.tab').forEach((t) => t.classList.toggle('active', t.dataset.tab === which));
    $('login-form').classList.toggle('show', which === 'login');
    $('register-form').classList.toggle('show', which === 'register');
  }
  document.querySelectorAll('[data-tab]').forEach((b) => b.addEventListener('click', () => show(b.dataset.tab)));
  document.querySelectorAll('[data-go]').forEach((a) => a.addEventListener('click', () => show(a.dataset.go)));
  document.querySelectorAll('[data-toggle]').forEach((b) => b.addEventListener('click', () => {
    const i = $(b.dataset.toggle);
    i.type = i.type === 'password' ? 'text' : 'password';
    b.textContent = i.type === 'password' ? 'दिखाएं' : 'छिपाएं';
  }));

  async function submit(url, body, btn, errEl) {
    errEl.textContent = '';
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span>जांच हो रही है… Please wait</span>';
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'सत्यापन विफल रहा। पुनः प्रयास करें।');
      localStorage.setItem('ks_token', data.token);
      localStorage.setItem('ks_user', JSON.stringify(data.user));
      btn.innerHTML = '<span>सफल ✓ Welcome</span>';
      location.href = nextUrl();
    } catch (e) {
      errEl.textContent = e.message === 'Failed to fetch' ? 'सर्वर से संपर्क नहीं हो सका। इंटरनेट जांचें।' : e.message;
      btn.disabled = false;
      btn.innerHTML = originalText;
    }
  }

  $('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    submit('/api/login', {
      phone: $('l-phone').value,
      password: $('l-pass').value
    }, $('login-btn'), $('login-error'));
  });

  $('register-form').addEventListener('submit', (e) => {
    e.preventDefault();
    submit('/api/register', {
      name: $('r-name').value,
      phone: $('r-phone').value,
      password: $('r-pass').value,
      state: $('r-state').value,
      village: $('r-village').value,
      landSize: $('r-land').value,
      crops: [...document.querySelectorAll('#crops input:checked')].map((c) => c.value)
    }, $('register-btn'), $('register-error'));
  });
})();
