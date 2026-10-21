/* KrishiSetu / Harvest Circle – Bilingual Agricultural Dictionary & Language Manager */
window.I18N = (() => {
  const LANGS = [
    { code: 'hi', label: 'हिन्दी', sub: 'Hindi' },
    { code: 'en', label: 'English', sub: 'English' },
    { code: 'mr', label: 'मराठी', sub: 'Marathi' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ', sub: 'Punjabi' },
    { code: 'kn', label: 'ಕನ್ನಡ', sub: 'Kannada' },
    { code: 'te', label: 'తెలుగు', sub: 'Telugu' }
  ];

  const DICT = {
    brand_sub: {
      hi: 'किसान साथी एवं फसल समूह',
      en: 'Farmer Cooperative & Harvest Pooling',
      mr: 'शेतकरी सहकारी आणि पीक गट',
      pa: 'ਕਿਸਾਨ ਸਹਿਕਾਰੀ ਅਤੇ ਫਸਲ ਪੂਲ',
      kn: 'ರೈತ ಸಹಕಾರಿ ಮತ್ತು ಬೆಳೆ ಒಕ್ಕೂಟ',
      te: 'రైతు సహకార మరియు పంట పూల్'
    },
    demo_badge: {
      hi: 'डेमो प्रोटोटाइप · सैंपल डेटा',
      en: 'Demo Prototype · Sample Data',
      mr: 'डेमो प्रोटोटाइप · नमुना डेटा',
      pa: 'ਡੈਮੋ ਪ੍ਰੋਟੋਟਾਈਪ · ਨਮੂਨਾ ਡਾਟਾ',
      kn: 'ಡೆಮೊ ಮಾದರಿ · ಮಾದರಿ ಡೇಟಾ',
      te: 'డెమో ప్రోటోటైప్ · నమూనా డేటా'
    },
    demo_notice: {
      hi: 'यह भारतीय किसान उत्पादक संगठनों (FPO) के लिए बनाया गया एक प्रोटोटाइप है। प्रदर्शित खरीदार और ईमेल परीक्षण मोड में हैं।',
      en: 'This is an active prototype for Farmer Producer Collectives. Buyer outreach and emails run in simulation test mode.',
      mr: 'हा शेतकरी उत्पादक संघटनांसाठी (FPO) प्रोटोटाइप आहे. खरेदीदार आणि ईमेल चाचणी मोडमध्ये आहेत.',
      pa: 'ਇਹ ਕਿਸਾਨ ਸੰਗਠਨਾਂ (FPO) ਲਈ ਇਕ ਪ੍ਰੋਟੋਟਾਈਪ ਹੈ। ਖਰੀਦਦਾਰ ਅਤੇ ਈਮੇਲ ਟੈਸਟ ਮੋਡ ਵਿੱਚ ਹਨ।',
      kn: 'ಇದು ರೈತ ಉತ್ಪಾದಕ ಸಂಸ್ಥೆಗಳಿಗಾಗಿ (FPO) ಮಾದರಿಯಾಗಿದೆ. ಖರೀದಿದಾರ ಮತ್ತು ಇಮೇಲ್ ಪರೀಕ್ಷಾ ಕ್ರಮದಲ್ಲಿದೆ.',
      te: 'ఇది రైతు ఉత్పత్తిదారుల సంఘాల (FPO) కొరకు ఒక నమూనా. కొనుగోలుదారులు మరియు ఈమెయిల్ పరీక్ష విధానంలో ఉన్నాయి.'
    },
    nav_home: { hi: 'डैशबोर्ड', en: 'Dashboard', mr: 'डॅशबोर्ड', pa: 'ਡੈਸ਼ਬੋਰਡ', kn: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', te: 'డ్యాష్‌బోర్డ్' },
    nav_pools: { hi: 'फसल समूह (पूल)', en: 'Crop Pools', mr: 'पीक पूल', pa: 'ਫਸਲ ਪੂਲ', kn: 'ಬೆಳೆ ಪೂಲ್', te: 'పంట పూల్స్' },
    nav_labour: { hi: 'खेत श्रमिक सेवा', en: 'Farm Labour', mr: 'शेतमजूर सेवा', pa: 'ਖੇਤ ਮਜ਼ਦੂਰ', kn: 'ಕೃಷಿ ಕಾರ್ಮಿಕರು', te: 'వ్యవసాయ కార్మికులు' },
    nav_gear: { hi: 'कृषि उपकरण व औजार', en: 'Farm Equipment', mr: 'कृषी उपकरणे', pa: 'ਖੇਤੀਬਾੜੀ ਔਜ਼ਾਰ', kn: 'ಕೃಷಿ ಉಪಕರಣಗಳು', te: 'వ్యవసాయ యంత్రాలు' },
    nav_logout: { hi: 'लॉग आउट', en: 'Log out', mr: 'लॉग आउट', pa: 'ਲਾਗ ਆਉਟ', kn: 'ಲಾಗ್ ಔಟ್', te: 'లాగ్ అవుట్' },
    login_tab: { hi: 'लॉग इन करें', en: 'Log In', mr: 'लॉग इन', pa: 'ਲਾਗ ਇਨ', kn: 'ಲಾಗಿನ್', te: 'లాగిన్' },
    register_tab: { hi: 'नया खाता बनाएं', en: 'Register', mr: 'नोंदणी करा', pa: 'ਨਵਾਂ ਖਾਤਾ', kn: 'ನೋಂದಣಿ', te: 'నమోదు' },
    phone_label: { hi: 'मोबाइल नंबर', en: 'Mobile Number', mr: 'मोबाईल नंबर', pa: 'ਮੋਬਾਈਲ ਨੰਬਰ', kn: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ', te: 'మొబైల్ నంబర్' },
    password_label: { hi: 'पासवर्ड', en: 'Password', mr: 'पासवर्ड', pa: 'ਪਾਸਵਰਡ', kn: 'ಪಾಸ್ವರ್ಡ್', te: 'పాస్‌వర్డ్' },
    state_label: { hi: 'राज्य', en: 'State', mr: 'राज्य', pa: 'ਰਾਜ', kn: 'ರಾಜ್ಯ', te: 'రాష్ట్రం' },
    village_label: { hi: 'गाँव / तहसील / मंडी', en: 'Village / Mandi / Tehsil', mr: 'गाव / तालुका / मंडी', pa: 'ਪਿੰਡ / ਤਹਿਸੀਲ / ਮੰਡੀ', kn: 'ಗ್ರಾಮ / ತಾಲೂಕು / ಮಂಡಿ', te: 'గ్రామం / మండలం / మార్కెట్' },
    land_label: { hi: 'कृषि भूमि (एकड़)', en: 'Land Size (Acres)', mr: 'शेती जमीन (एकर)', pa: 'ਜ਼ਮੀਨ (ਏਕੜ)', kn: 'ಕೃಷಿ ಭೂಮಿ (ಎಕರೆ)', te: 'వ్యవసాయ భూమి (ఎకరాలు)' },
    crop_label: { hi: 'आप मुख्य रूप से क्या उगाते हैं?', en: 'Major crops grown', mr: 'तुम्ही मुख्यत्वे काय पिकवता?', pa: 'ਤੁਸੀਂ ਕੀ ਬੀਜਦੇ ਹੋ?', kn: 'ನೀವು ಬೆಳೆಯುವ ಪ್ರಮುಖ ಬೆಳೆಗಳು', te: 'మీరు పండించే ప్రధాన పంటలు' },
    login_btn: { hi: 'खाते में प्रवेश करें', en: 'Sign In to Account', mr: 'खात्यात प्रवेश करा', pa: 'ਖਾਤੇ ਵਿੱਚ ਜਾਓ', kn: 'ಖಾತೆಗೆ ಪ್ರವೇಶಿಸಿ', te: 'ఖాతాలోకి ప్రవేశించండి' },
    register_btn: { hi: 'किसान खाता खोलें', en: 'Create Farmer Account', mr: 'शेतकरी खाते तयार करा', pa: 'ਕਿਸਾਨ ਖਾਤਾ ਬਣਾਓ', kn: 'ರೈತ ಖಾತೆ ತೆರೆಯಿರಿ', te: 'రైతు ఖాతా తెరవండి' }
  };

  let current = localStorage.getItem('hc_lang') || 'hi';

  function getLang() { return current; }
  function setLang(code) {
    current = code;
    localStorage.setItem('hc_lang', code);
    document.documentElement.lang = code;
    window.dispatchEvent(new CustomEvent('langchange', { detail: code }));
  }

  function t(key) {
    const entry = DICT[key];
    if (!entry) return key;
    return entry[current] || entry.en || entry.hi || key;
  }

  // Returns bilingual HTML: primary preferred language on top, secondary English below
  function bi(key, fallbackEn = '') {
    const entry = DICT[key];
    const primary = entry ? (entry[current] || entry.hi || fallbackEn) : fallbackEn;
    const secondary = entry ? (entry.en || fallbackEn) : fallbackEn;
    if (current === 'en') {
      return `<span class="bi-text"><span class="bi-main">${primary}</span></span>`;
    }
    return `<span class="bi-text"><span class="bi-main">${primary}</span><span class="bi-sub">${secondary}</span></span>`;
  }

  function selectorHtml() {
    return `<div class="lang-selector" aria-label="Select preferred language">
      <span class="lang-icon" aria-hidden="true">🌐</span>
      <select id="lang-picker" aria-label="Preferred Language">
        ${LANGS.map((l) => `<option value="${l.code}" ${l.code === current ? 'selected' : ''}>${l.label} (${l.sub})</option>`).join('')}
      </select>
    </div>`;
  }

  function attachPicker(root = document) {
    const picker = root.querySelector('#lang-picker');
    if (picker) {
      picker.value = current;
      picker.addEventListener('change', (e) => setLang(e.target.value));
    }
  }

  return { LANGS, getLang, setLang, t, bi, selectorHtml, attachPicker };
})();
