/* KrishiSetu – Farm Gear: OLX-style marketplace to rent out or sell tractors, machines & tools */
window.Gear = (() => {
  const K = () => window.KS;
  const esc = (s) => K().esc(s);
  const STATES = ['Andhra Pradesh','Assam','Bihar','Chhattisgarh','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Odisha','Punjab','Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','Uttarakhand','West Bengal','Other'];
  const CATS = [['Tractors','🚜'],['Power tillers','🛠️'],['Harvesters','🌾'],['Rotavators & cultivators','⚙️'],['Ploughs & harrows','🪓'],['Seed drills & planters','🌱'],['Sprayers','💨'],['Water pumps & irrigation','💧'],['Threshers & reapers','🌾'],['Trailers & carts','🛺'],['Power tools','🔌'],['Hand tools','🔨'],['Drones','🛸'],['Other','📦']];
  const catIco = (c) => (CATS.find(([k]) => k === c) || [0, '📦'])[1];
  const UNITS = [['hour', 'Per hour'], ['day', 'Per day'], ['week', 'Per week'], ['month', 'Per month'], ['acre', 'Per acre'], ['trip', 'Per trip']];
  const COND = { new: 'Brand new', good: 'Good', fair: 'Fair', old: 'Old / needs repair' };
  const money = (n) => '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2 });
  const ago = (d) => { const m = Math.round((Date.now() - new Date(d)) / 60000); return m < 60 ? Math.max(m, 1) + 'm ago' : m < 1440 ? Math.round(m / 60) + 'h ago' : Math.round(m / 1440) + 'd ago'; };

  function modal(html, cls = '') {
    const o = document.createElement('div');
    o.className = 'overlay';
    o.innerHTML = `<div class="modal ${cls}" role="dialog">${html}</div>`;
    const close = () => o.remove();
    o.addEventListener('click', (e) => { if (e.target === o || e.target.closest('[data-close]')) close(); });
    document.body.appendChild(o);
    return { el: o.firstChild, close };
  }

  const tags = (it) => (it.type === 'sale' ? '' : '<span class="gtag rent">FOR RENT</span>') + (it.type === 'rent' ? '' : '<span class="gtag sale">FOR SALE</span>');
  const prices = (it) => [
    it.type !== 'sale' ? `<div class="gp rent"><b>${money(it.rentRate)}</b><small>/ ${it.rentUnit}</small></div>` : '',
    it.type !== 'rent' ? `<div class="gp sale"><b>${money(it.salePrice)}</b><small>${it.negotiable ? 'negotiable' : 'fixed'}</small></div>` : '',
  ].join('');

  function card(it) {
    const near = it.nearScore >= 2 ? '<span class="nearb">📍 In your district</span>' : '';
    return `<article class="gcard" data-id="${it.id}" tabindex="0">
      <div class="gimg" style="background-image:url('${esc(it.photos[0])}')">${near}<div class="gtags">${tags(it)}</div>${it.photos.length > 1 ? `<span class="gcount">📷 ${it.photos.length}</span>` : ''}</div>
      <div class="gbody"><h3>${esc(it.title)}</h3>
        <div class="gprices">${prices(it)}</div>
        <small class="muted">${catIco(it.category)} ${esc(it.category)}${it.brand ? ' · ' + esc(it.brand) : ''}${it.year ? ' · ' + it.year : ''}</small>
        <div class="gfoot"><span>📍 ${esc([it.village, it.district, it.state].filter(Boolean).join(', '))}</span><span>${ago(it.createdAt)}</span></div></div></article>`;
  }

  function detail(it) {
    let idx = 0;
    const wa = 'https://wa.me/' + it.contactPhone.replace(/\D/g, '').replace(/^(\d{10})$/, '91$1') + '?text=' + encodeURIComponent(`Hi, I saw your "${it.title}" listing on KrishiSetu.`);
    const m = modal(`
      <div class="gal"><img id="gimg" src="${esc(it.photos[0])}" alt="${esc(it.title)}" />
        ${it.photos.length > 1 ? '<button class="gnav l" data-n="-1" aria-label="Previous">‹</button><button class="gnav r" data-n="1" aria-label="Next">›</button>' : ''}
        <div class="gtags">${tags(it)}</div><button class="gclose" data-close aria-label="Close">✕</button></div>
      ${it.photos.length > 1 ? `<div class="gthumbs">${it.photos.map((p, i) => `<img data-i="${i}" src="${esc(p)}" class="${i ? '' : 'on'}" alt="" />`).join('')}</div>` : ''}
      <h2>${esc(it.title)}</h2>
      <div class="gprices big">${prices(it)}</div>
      <div class="chips"><span class="skill">${catIco(it.category)} ${esc(it.category)}</span><span class="skill">Condition: ${COND[it.condition]}</span>${it.brand ? `<span class="skill">${esc(it.brand)}</span>` : ''}${it.year ? `<span class="skill">Year ${it.year}</span>` : ''}
        ${it.deposit ? `<span class="skill gold">Deposit ${money(it.deposit)}</span>` : ''}${it.operatorIncluded ? '<span class="skill">🧑‍🌾 Operator included</span>' : ''}${it.fuelIncluded ? '<span class="skill">⛽ Fuel included</span>' : ''}</div>
      ${it.description ? `<p class="gdesc">${esc(it.description)}</p>` : ''}
      <div class="seller"><div class="avatar sm">${esc((it.sellerName || '?')[0].toUpperCase())}</div><div class="mi"><b>${esc(it.sellerName)}</b><small>📍 ${esc([it.village, it.district, it.state].filter(Boolean).join(', '))} · posted ${ago(it.createdAt)}</small></div></div>
      <div class="pa"><a class="btn" href="tel:${esc(it.contactPhone)}">📞 Call ${esc(it.contactPhone)}</a>${it.whatsapp ? `<a class="btn wa" target="_blank" rel="noopener" href="${wa}">WhatsApp</a>` : ''}</div>`, 'gmodal');
    const img = m.el.querySelector('#gimg');
    const show = (i) => { idx = (i + it.photos.length) % it.photos.length; img.src = it.photos[idx]; m.el.querySelectorAll('.gthumbs img').forEach((t, j) => t.classList.toggle('on', j === idx)); };
    m.el.addEventListener('click', (e) => { const n = e.target.closest('[data-n]'); if (n) show(idx + Number(n.dataset.n)); const t = e.target.closest('[data-i]'); if (t) show(Number(t.dataset.i)); });
  }

  function tabs(on) {
    const t = [['market', '🔍 उपकरण खोजें · Browse Gear', '#/gear'], ['mine', '📋 मेरी लिस्टिंग · My Listings', '#/gear/mine']];
    return `<div class="seg ltabs">${t.map(([k, l, h]) => `<button type="button" class="${k === on ? 'on' : ''}" onclick="location.hash='${h}'">${l}</button>`).join('')}</div>`;
  }

  // ================= BROWSE =================
  async function market(root) {
    root.innerHTML = `
      <div class="demo-banner">
        <span>⚠️</span>
        <div>
          <strong>डेमो उपकरण एक्सचेंज (Sample Farm Gear):</strong>
          <span>ट्रैक्टर, कल्टीवेटर व औजार किराये पर लेने या देने की यह सेवा प्रोटोटाइप परीक्षण मोड में है।</span>
        </div>
      </div>
      <section class="mkt-hero gear-hero">
        <div class="mh-text">
          <span class="mh-eye">🚜 कृषि यंत्र व उपकरण · Farm Gear Exchange</span>
          <h1>कृषि मशीनें व औजार किराए पर लें या बेचें</h1>
          <p>ट्रैक्टर, रोटावेटर, रीपर, कल्टीवेटर और स्प्रेयर अपने नजदीकी किसानों से सीधे लें — फोन व व्हाट्सएप संपर्क उपलब्ध।</p>
        </div>
        <form class="mh-search" id="sf" role="search">
          <span>🔍</span>
          <input id="f-q" placeholder="उपकरण खोजें: महिंद्रा ट्रैक्टर, रोटावेटर, रीपर, कल्टीवेटर…" autocomplete="off" />
          <button class="btn sm" type="submit">खोजें · Search</button>
        </form>
        <div class="mh-chips" id="qc">
          <button type="button" data-s="" class="on">सभी (All)</button>
          ${CATS.map(([c, i]) => `<button type="button" data-s="${esc(c)}">${esc(c)}</button>`).join('')}
        </div>
      </section>
      <div class="mkt-bar">
        ${tabs('market')}
        <a class="btn sm" href="#/gear/new" id="post-ad">＋ उपकरण जोड़ें · List Gear</a>
      </div>
      <div class="seg" id="tseg">
        <button type="button" data-t="" class="on">सभी (All)</button>
        <button type="button" data-t="rent">🔑 केवल किराए हेतु (For Rent)</button>
        <button type="button" data-t="sale">🏷️ बिक्री हेतु (For Sale)</button>
      </div>
      <section class="filters lf">
        <select id="f-state"><option value="">All states</option>${STATES.map((s) => `<option ${s === K().user.state ? 'selected' : ''}>${s}</option>`).join('')}</select>
        <input id="f-dist" placeholder="District / area" />
        <input id="f-max" type="number" min="1" placeholder="Max ₹ price" />
        <select id="f-sort"><option value="near">Nearest first</option><option value="new">Newest</option><option value="cheap">Price: low to high</option><option value="dear">Price: high to low</option></select>
      </section>
      <div class="muted" id="count"></div>
      <section class="ggrid" id="grid"><div class="muted">Loading…</div></section>`;
    const $ = (s) => root.querySelector(s);
    let list = [], cat = '', type = '', timer;
    async function load() {
      const p = new URLSearchParams({ q: $('#f-q').value, category: cat, type, state: $('#f-state').value, district: $('#f-dist').value, maxPrice: $('#f-max').value, sort: $('#f-sort').value });
      try {
        list = (await K().api('/equipment?' + p)).items;
        $('#count').textContent = list.length + (list.length === 1 ? ' listing' : ' listings');
        $('#grid').innerHTML = list.length ? list.map(card).join('') : `<div class="empty"><div>🚜</div><h3>No listings found</h3><p>Try other filters — or post your own equipment.</p><a class="btn" href="#/gear/new">Post a listing</a></div>`;
      } catch (e) { $('#grid').innerHTML = `<div class="muted">${esc(e.message)}</div>`; }
    }
    const debounce = () => { clearTimeout(timer); timer = setTimeout(load, 300); };
    $('#sf').addEventListener('submit', (e) => { e.preventDefault(); load(); });
    $('#f-q').addEventListener('input', debounce);
    root.querySelectorAll('.lf input').forEach((x) => x.addEventListener('input', debounce));
    root.querySelectorAll('.lf select').forEach((x) => x.addEventListener('change', load));
    $('#qc').addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; cat = b.dataset.s; root.querySelectorAll('#qc button').forEach((x) => x.classList.toggle('on', x === b)); load(); });
    $('#tseg').addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; type = b.dataset.t; root.querySelectorAll('#tseg button').forEach((x) => x.classList.toggle('on', x === b)); load(); });
    $('#grid').addEventListener('click', (e) => { const c = e.target.closest('.gcard'); if (c) detail(list.find((i) => i.id === c.dataset.id)); });
    $('#grid').addEventListener('keydown', (e) => { const c = e.target.closest('.gcard'); if (c && e.key === 'Enter') detail(list.find((i) => i.id === c.dataset.id)); });
    load();
  }

  // ================= MY LISTINGS =================
  async function mine(root) {
    root.innerHTML = `<header class="topbar"><div><h1>My Listings 📋</h1><p>Manage the equipment you rent out or sell.</p></div><a class="btn" href="#/gear/new">＋ Post a listing</a></header>${tabs('mine')}<section class="ggrid" id="grid"><div class="muted">Loading…</div></section>`;
    const $ = (s) => root.querySelector(s);
    let list = [];
    async function load() {
      list = (await K().api('/equipment/mine')).items;
      $('#grid').innerHTML = list.length ? list.map((it) => `<div class="gwrap ${it.status !== 'available' ? 'off' : ''}">${card(it)}
        <div class="gmanage"><span class="badge ${it.status === 'available' ? 'st-open' : it.status === 'sold' ? 'st-agreed' : 'st-closed'}">${it.status === 'available' ? 'Live' : it.status === 'sold' ? 'Sold' : 'Paused'}</span>
          <a class="btn sm ghost" href="#/gear/edit/${it.id}">Edit</a>
          ${it.status === 'available' ? `<button class="btn sm ghost" data-st="unavailable" data-id="${it.id}">Pause</button><button class="btn sm sel" data-st="sold" data-id="${it.id}">Mark sold / rented</button>` : `<button class="btn sm" data-st="available" data-id="${it.id}">Make live</button>`}
          <button class="btn sm ghost selno" data-del="${it.id}">Delete</button></div></div>`).join('') :
        `<div class="empty"><div>📭</div><h3>You haven't listed anything</h3><p>Got an idle tractor, tiller or plough? Earn from it.</p><a class="btn" href="#/gear/new">Post a listing</a></div>`;
    }
    $('#grid').addEventListener('click', async (e) => {
      const s = e.target.closest('[data-st]'), d = e.target.closest('[data-del]');
      try {
        if (s) { await K().api(`/equipment/${s.dataset.id}/status`, { method: 'POST', body: { status: s.dataset.st } }); load(); }
        else if (d) { if (!confirm('Delete this listing?')) return; await K().api('/equipment/' + d.dataset.del, { method: 'DELETE' }); K().toast('Listing deleted'); load(); }
        else { const c = e.target.closest('.gcard'); if (c && !e.target.closest('.gmanage')) detail(list.find((i) => i.id === c.dataset.id)); }
      } catch (err) { K().toast(err.message, 'err'); }
    });
    await load();
  }

  // ---- client-side image downsizing (keeps uploads small for farmers on slow networks) ----
  function shrink(file, max = 1280) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const r = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * r); c.height = Math.round(img.height * r);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        c.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not read that photo.'))), 'image/jpeg', 0.82);
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('That file is not a valid image.')); };
      img.src = url;
    });
  }
  async function upload(blob) {
    const r = await fetch('/api/equipment/photo', { method: 'POST', headers: { 'Content-Type': 'image/jpeg', Authorization: 'Bearer ' + K().token }, body: blob });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d.error || 'Upload failed');
    return d.url;
  }

  // ================= CREATE / EDIT =================
  async function form(root, id) {
    const u = K().user;
    let it = { type: 'rent', category: 'Tractors', condition: 'good', rentUnit: 'day', state: u.state, village: u.village || '', contactPhone: u.phone, whatsapp: true, photos: [], negotiable: true };
    if (id) { try { it = (await K().api('/equipment/' + id)).item; if (!it.mine) throw new Error('Not yours'); } catch { return (location.hash = '#/gear/mine'); } }
    let type = it.type, rentUnit = it.rentUnit || 'day', photos = [...it.photos];
    const v = (x) => esc(x ?? '');
    root.innerHTML = `
      <header class="topbar"><div><h1>${id ? 'Edit listing' : 'Post a listing'} 🚜</h1><p>Rent out or sell your farm equipment.</p></div><a class="btn ghost" href="#/gear">← Back</a></header>
      <form class="formcard" id="gf" novalidate>
        <div class="field"><label>I want to</label><div class="seg" id="ty"><button type="button" data-t="rent" class="${type === 'rent' ? 'on' : ''}">🔑 Rent it out</button><button type="button" data-t="sale" class="${type === 'sale' ? 'on' : ''}">🏷️ Sell it</button><button type="button" data-t="both" class="${type === 'both' ? 'on' : ''}">Both</button></div></div>
        <div class="field"><label>Photos (up to 5 — the first is the cover)</label>
          <div class="photos" id="ph"></div>
          <input type="file" id="ph-in" accept="image/*" multiple hidden /></div>
        <div class="field"><label>Title</label><input id="g-title" maxlength="80" placeholder="e.g. Mahindra 575 DI Tractor with trolley" value="${v(it.title)}" /></div>
        <div class="row"><div class="field"><label>Category</label><select id="g-cat">${CATS.map(([c]) => `<option ${c === it.category ? 'selected' : ''}>${c}</option>`).join('')}</select></div>
          <div class="field"><label>Condition</label><select id="g-cond">${Object.entries(COND).map(([k, l]) => `<option value="${k}" ${k === it.condition ? 'selected' : ''}>${l}</option>`).join('')}</select></div></div>
        <div class="row"><div class="field"><label>Brand / model (optional)</label><input id="g-brand" maxlength="40" value="${v(it.brand)}" /></div>
          <div class="field"><label>Year (optional)</label><input id="g-year" type="number" min="1950" max="${new Date().getFullYear() + 1}" value="${v(it.year)}" /></div></div>
        <div class="field"><label>Description</label><textarea id="g-desc" rows="3" maxlength="1000" placeholder="Horsepower, attachments, usage hours, rental conditions…">${v(it.description)}</textarea></div>
        <fieldset class="pricebox" id="rentbox"><legend>🔑 Rent details</legend>
          <div class="row"><div class="field"><label>Rent amount (₹)</label><input id="g-rent" type="number" min="1" step="any" value="${v(it.rentRate)}" placeholder="e.g. 800" /></div>
            <div class="field"><label>Charged</label><select id="g-unit">${UNITS.map(([k, l]) => `<option value="${k}" ${k === rentUnit ? 'selected' : ''}>${l}</option>`).join('')}</select></div></div>
          <div class="row"><div class="field"><label>Security deposit (₹, optional)</label><input id="g-dep" type="number" min="0" value="${v(it.deposit)}" /></div>
            <div class="checks"><label><input type="checkbox" id="g-op" ${it.operatorIncluded ? 'checked' : ''} /> Operator included</label><label><input type="checkbox" id="g-fuel" ${it.fuelIncluded ? 'checked' : ''} /> Fuel included</label></div></div></fieldset>
        <fieldset class="pricebox" id="salebox"><legend>🏷️ Sale details</legend>
          <div class="row"><div class="field"><label>Selling price (₹)</label><input id="g-sale" type="number" min="1" step="any" value="${v(it.salePrice)}" placeholder="e.g. 450000" /></div>
            <div class="checks"><label><input type="checkbox" id="g-neg" ${it.negotiable ? 'checked' : ''} /> Price is negotiable</label></div></div></fieldset>
        <div class="row"><div class="field"><label>State</label><select id="g-state">${STATES.map((s) => `<option ${s === it.state ? 'selected' : ''}>${s}</option>`).join('')}</select></div>
          <div class="field"><label>District</label><input id="g-dist" maxlength="60" value="${v(it.district)}" /></div></div>
        <div class="row"><div class="field"><label>Village / town</label><input id="g-vill" maxlength="60" value="${v(it.village)}" /></div>
          <div class="field"><label>Contact phone</label><input id="g-phone" type="tel" value="${v(it.contactPhone)}" /></div></div>
        <div class="checks"><label><input type="checkbox" id="g-wa" ${it.whatsapp ? 'checked' : ''} /> This number is on WhatsApp</label></div>
        <div class="error" id="g-err" role="alert"></div>
        <button class="btn" type="submit" id="g-go">${id ? 'Save changes' : 'Publish listing'}</button>
      </form>`;
    const $ = (s) => root.querySelector(s);
    const sync = () => { $('#rentbox').hidden = type === 'sale'; $('#salebox').hidden = type === 'rent'; };
    sync();
    $('#ty').addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; type = b.dataset.t; root.querySelectorAll('#ty button').forEach((x) => x.classList.toggle('on', x === b)); sync(); });

    function drawPhotos(busy) {
      $('#ph').innerHTML = photos.map((p, i) => `<div class="ph" style="background-image:url('${esc(p)}')">${i === 0 ? '<span>Cover</span>' : ''}<button type="button" data-rm="${i}" aria-label="Remove photo">✕</button></div>`).join('')
        + (busy ? '<div class="ph busy">Uploading…</div>' : '')
        + (photos.length < 5 && !busy ? '<button type="button" class="ph add" id="ph-add"><b>＋</b><small>Add photo</small></button>' : '');
    }
    drawPhotos();
    $('#ph').addEventListener('click', (e) => {
      if (e.target.closest('#ph-add')) return $('#ph-in').click();
      const r = e.target.closest('[data-rm]'); if (r) { photos.splice(Number(r.dataset.rm), 1); drawPhotos(); }
    });
    $('#ph-in').addEventListener('change', async (e) => {
      const files = [...e.target.files].slice(0, 5 - photos.length); e.target.value = '';
      for (const f of files) {
        drawPhotos(true);
        try { photos.push(await upload(await shrink(f))); } catch (err) { K().toast(err.message, 'err'); }
      }
      drawPhotos();
    });

    $('#gf').addEventListener('submit', async (e) => {
      e.preventDefault(); $('#g-err').textContent = '';
      const btn = $('#g-go'); btn.disabled = true;
      const body = { type, photos, title: $('#g-title').value, category: $('#g-cat').value, condition: $('#g-cond').value, brand: $('#g-brand').value, year: $('#g-year').value, description: $('#g-desc').value,
        rentRate: $('#g-rent').value, rentUnit: $('#g-unit').value, deposit: $('#g-dep').value, operatorIncluded: $('#g-op').checked, fuelIncluded: $('#g-fuel').checked,
        salePrice: $('#g-sale').value, negotiable: $('#g-neg').checked, state: $('#g-state').value, district: $('#g-dist').value, village: $('#g-vill').value, contactPhone: $('#g-phone').value, whatsapp: $('#g-wa').checked };
      try {
        await K().api(id ? '/equipment/' + id : '/equipment', { method: id ? 'PUT' : 'POST', body });
        K().toast(id ? 'Listing updated ✅' : 'Listing published 🎉'); K().go('#/gear/mine');
      } catch (err) { $('#g-err').textContent = err.message; btn.disabled = false; }
    });
  }

  return { market, mine, form };
})();
