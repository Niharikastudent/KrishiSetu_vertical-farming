/* KrishiSetu
   Client-side Standalone Mock API & Persistence Engine for GitHub Pages
   Enables complete interactive experience (login, pools, voting, chat, labour, gear)
   without requiring a Node.js server. */

(() => {
  const isStaticHost =
    location.hostname.endsWith('github.io') ||
    location.protocol === 'file:' ||
    location.hostname === 'localhost' && location.port !== '3000';

  if (!isStaticHost) return;

  console.log('[KrishiSetu] GitHub Pages client-side mode active.');

  // Default seed data
  const DEFAULT_USERS = [
    {
      id: 'demo-farmer-1',
      name: 'Ramesh Patil',
      phone: '9876543210',
      state: 'Madhya Pradesh',
      village: 'Sehore',
      crops: ['Wheat', 'Soybean', 'Gram'],
      landSize: 4.5,
      createdAt: new Date().toISOString()
    },
    {
      id: 'demo-farmer-2',
      name: 'Sunita Devi',
      phone: '9854821142',
      state: 'Madhya Pradesh',
      village: 'Ashta',
      crops: ['Wheat', 'Soybean'],
      landSize: 3.0,
      createdAt: new Date().toISOString()
    }
  ];

  const DEFAULT_POOLS = [
    {
      id: 'pool-wheat-2026',
      code: 'WHT942',
      name: 'Sehore Sharbati Wheat Collective',
      crop: 'Wheat (गेहूं)',
      variety: 'Sharbati Bold Grade-A',
      state: 'Madhya Pradesh',
      district: 'Sehore',
      harvestDate: new Date(Date.now() + 6 * 24 * 3600 * 1000).toISOString().split('T')[0],
      status: 'negotiating',
      agreedPrice: 2650,
      totalQuantity: 280,
      memberCount: 7,
      createdBy: 'demo-farmer-1',
      createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      members: [
        { userId: 'demo-farmer-1', name: 'Ramesh Patil', phone: '9876543210', quantity: 45, priceVote: 2650, joinedAt: new Date().toISOString() },
        { userId: 'demo-farmer-2', name: 'Sunita Devi', phone: '9854821142', quantity: 35, priceVote: 2650, joinedAt: new Date().toISOString() },
        { userId: 'demo-farmer-3', name: 'Jagdish Yadav', phone: '9823104921', quantity: 60, priceVote: 2600, joinedAt: new Date().toISOString() },
        { userId: 'demo-farmer-4', name: 'Kailash Meena', phone: '9893411204', quantity: 50, priceVote: 2650, joinedAt: new Date().toISOString() }
      ],
      messages: [
        { id: 'm1', senderId: 'demo-farmer-1', senderName: 'Ramesh Patil', text: 'राम-राम किसान साथियों! मंडी में शरबती गेहूं का भाव ₹2,450 चल रहा है। हम 280 क्विंटल का लॉट ₹2,650 में मिल को सीधे ऑफ़र कर सकते हैं।', createdAt: new Date(Date.now() - 3600000).toISOString() },
        { id: 'm2', senderId: 'demo-farmer-2', senderName: 'Sunita Devi', text: 'सहमति है। भोपाल की आटा मिल से बात चल रही है, ₹2,650 सही रहेगा। सभी वोट करें।', createdAt: new Date(Date.now() - 1800000).toISOString() }
      ]
    },
    {
      id: 'pool-soybean-2026',
      code: 'SOY518',
      name: 'Malwa Yellow Soybean Pool',
      crop: 'Soybean (सोयाबीन)',
      variety: 'JS-9560 Yellow Standard',
      state: 'Madhya Pradesh',
      district: 'Dewas',
      harvestDate: new Date(Date.now() + 18 * 24 * 3600 * 1000).toISOString().split('T')[0],
      status: 'open',
      agreedPrice: null,
      totalQuantity: 150,
      memberCount: 4,
      createdBy: 'demo-farmer-2',
      createdAt: new Date().toISOString(),
      members: [
        { userId: 'demo-farmer-2', name: 'Sunita Devi', phone: '9854821142', quantity: 50, priceVote: null, joinedAt: new Date().toISOString() },
        { userId: 'demo-farmer-1', name: 'Ramesh Patil', phone: '9876543210', quantity: 40, priceVote: null, joinedAt: new Date().toISOString() }
      ],
      messages: [
        { id: 'sm1', senderId: 'demo-farmer-2', senderName: 'Sunita Devi', text: 'सोयाबीन समूह में स्वागत है। 200 क्विंटल पूरा होते ही सॉल्वेंट एक्सट्रैक्शन प्लांट को कोटेशन भेजेंगे।', createdAt: new Date().toISOString() }
      ]
    }
  ];

  const DEFAULT_LABOUR = [
    {
      id: 'lab-1',
      userId: 'demo-farmer-3',
      name: 'Kailash & Group (4 Workers)',
      phone: '9893411204',
      state: 'Madhya Pradesh',
      village: 'Sehore',
      skills: ['Wheat Harvesting', 'Threshing', 'Loading'],
      ratePerDay: 450,
      available: true,
      bio: '4 कुशल कृषि श्रमिकों का दल। कटाई और गहाई का 10 वर्ष का अनुभव। स्वयं के हंसिया व औजार।'
    },
    {
      id: 'lab-2',
      userId: 'demo-farmer-4',
      name: 'Santosh Kumar',
      phone: '9781203491',
      state: 'Madhya Pradesh',
      village: 'Ashta',
      skills: ['Pesticide Spraying', 'Tractor Driving'],
      ratePerDay: 500,
      available: true,
      bio: 'स्प्रेयर मशीन चालक। सभी प्रकार के कीटनाशक व खरपतवारनाशक का सुरक्षित छिड़काव।'
    }
  ];

  const DEFAULT_GEAR = [
    {
      id: 'gear-1',
      userId: 'demo-farmer-1',
      ownerName: 'Ramesh Patil',
      phone: '9876543210',
      title: 'Mahindra 575 DI Tractor (45 HP)',
      category: 'Tractors',
      type: 'rent',
      rentRate: 600,
      rentUnit: 'hour',
      state: 'Madhya Pradesh',
      district: 'Sehore',
      village: 'Sehore',
      available: true,
      description: 'ट्रैक्टर के साथ कल्टीवेटर और ट्रॉली उपलब्ध है। प्रति घंटा ₹600। डीजल किसान का।'
    },
    {
      id: 'gear-2',
      userId: 'demo-farmer-2',
      ownerName: 'Sunita Devi',
      phone: '9854821142',
      title: 'Rotavator 6 Feet (Shaktiman)',
      category: 'Rotavators & cultivators',
      type: 'rent',
      rentRate: 1500,
      rentUnit: 'day',
      state: 'Madhya Pradesh',
      district: 'Sehore',
      village: 'Ashta',
      available: true,
      description: 'खेत की जुताई के लिए उत्तम स्थिति में रोटावेटर। प्रति दिन ₹1,500।'
    }
  ];

  // Helper storage keys
  const getStore = (k, def) => {
    try {
      const v = localStorage.getItem('ks_mock_' + k);
      return v ? JSON.parse(v) : def;
    } catch { return def; }
  };
  const setStore = (k, v) => {
    try { localStorage.setItem('ks_mock_' + k, JSON.stringify(v)); } catch {}
  };

  if (!localStorage.getItem('ks_mock_initialized')) {
    setStore('users', DEFAULT_USERS);
    setStore('pools', DEFAULT_POOLS);
    setStore('labour', DEFAULT_LABOUR);
    setStore('gear', DEFAULT_GEAR);
    setStore('initialized', true);
  }

  // Intercept fetch
  const originalFetch = window.fetch;
  window.fetch = async function (input, init = {}) {
    const urlStr = typeof input === 'string' ? input : input?.url || '';
    
    // Only intercept /api calls
    if (!urlStr.includes('/api/')) {
      return originalFetch.apply(this, arguments);
    }

    const path = urlStr.replace(/^https?:\/\/[^\/]+/, '').replace(/^.*\/api/, '/api');
    const method = (init.method || 'GET').toUpperCase();
    let body = {};
    if (init.body) {
      try { body = typeof init.body === 'string' ? JSON.parse(init.body) : init.body; } catch {}
    }

    const jsonRes = (data, status = 200) => {
      return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' }
      });
    };

    const errRes = (msg, status = 400) => jsonRes({ error: msg }, status);

    // Get current user from token
    const token = localStorage.getItem('ks_token');
    let currentUser = null;
    if (token) {
      try { currentUser = JSON.parse(localStorage.getItem('ks_user') || 'null'); } catch {}
    }

    // 1. /api/login
    if (path === '/api/login' && method === 'POST') {
      const users = getStore('users', DEFAULT_USERS);
      const phone = String(body.phone || '').trim();
      let user = users.find((u) => u.phone === phone);
      if (!user) {
        user = {
          id: 'user-' + Date.now(),
          name: 'Farmer ' + phone.slice(-4),
          phone: phone,
          state: 'Madhya Pradesh',
          village: 'Sehore',
          crops: ['Wheat'],
          landSize: 4.0,
          createdAt: new Date().toISOString()
        };
        users.push(user);
        setStore('users', users);
      }
      return jsonRes({ token: 'mock-token-' + user.id, user });
    }

    // 2. /api/register
    if (path === '/api/register' && method === 'POST') {
      const users = getStore('users', DEFAULT_USERS);
      const user = {
        id: 'user-' + Date.now(),
        name: body.name || 'Farmer',
        phone: body.phone,
        state: body.state || 'Madhya Pradesh',
        village: body.village || 'Village',
        crops: body.crops || ['Wheat'],
        landSize: Number(body.landSize) || null,
        createdAt: new Date().toISOString()
      };
      users.push(user);
      setStore('users', users);
      return jsonRes({ token: 'mock-token-' + user.id, user }, 201);
    }

    // 3. /api/me
    if (path === '/api/me' && method === 'GET') {
      if (!currentUser) return errRes('Unauthorized', 401);
      return jsonRes({ user: currentUser });
    }

    // 4. /api/pools
    if (path.startsWith('/api/pools') && method === 'GET') {
      const pools = getStore('pools', DEFAULT_POOLS);
      const u = new URL(urlStr, 'http://localhost');
      const scope = u.searchParams.get('scope');
      if (scope === 'mine' && currentUser) {
        const mine = pools.filter((p) => p.members?.some((m) => m.userId === currentUser.id || m.phone === currentUser.phone) || p.createdBy === currentUser.id);
        return jsonRes({ pools: mine.length ? mine : pools.slice(0, 1) });
      }
      return jsonRes({ pools });
    }

    // 5. /api/pools (create)
    if (path === '/api/pools' && method === 'POST') {
      const pools = getStore('pools', DEFAULT_POOLS);
      const pool = {
        id: 'pool-' + Date.now(),
        code: Math.random().toString(36).substring(2, 8).toUpperCase(),
        name: body.name,
        crop: body.crop,
        variety: body.variety || '',
        state: body.state || currentUser?.state,
        district: body.district || currentUser?.village,
        harvestDate: body.harvestDate,
        status: 'open',
        agreedPrice: null,
        totalQuantity: Number(body.quantity) || 50,
        memberCount: 1,
        createdBy: currentUser?.id,
        createdAt: new Date().toISOString(),
        members: [{ userId: currentUser?.id, name: currentUser?.name, phone: currentUser?.phone, quantity: Number(body.quantity) || 50, priceVote: null, joinedAt: new Date().toISOString() }],
        messages: [{ id: 'm-' + Date.now(), senderId: currentUser?.id, senderName: currentUser?.name, text: 'समूह बनाया गया (Pool created). साथियों का स्वागत है!', createdAt: new Date().toISOString() }]
      };
      pools.unshift(pool);
      setStore('pools', pools);
      return jsonRes({ pool }, 201);
    }

    // 6. /api/pools/:id
    const poolDetailMatch = path.match(/^\/api\/pools\/([^\/]+)$/);
    if (poolDetailMatch && method === 'GET') {
      const pools = getStore('pools', DEFAULT_POOLS);
      const id = poolDetailMatch[1];
      const pool = pools.find((p) => p.id === id) || pools[0];
      return jsonRes({
        pool,
        members: pool.members || [],
        messages: pool.messages || [],
        suggestedPrices: [
          { crop: pool.crop, msp: 2275, marketAverage: 2450, recommendedMin: 2550 }
        ]
      });
    }

    // 7. /api/pools/:id/vote
    const voteMatch = path.match(/^\/api\/pools\/([^\/]+)\/vote$/);
    if (voteMatch && method === 'POST') {
      const pools = getStore('pools', DEFAULT_POOLS);
      const pool = pools.find((p) => p.id === voteMatch[1]) || pools[0];
      const voteVal = Number(body.price);
      pool.agreedPrice = voteVal;
      pool.status = 'price_agreed';
      pool.messages.push({
        id: 'm-' + Date.now(),
        senderId: currentUser?.id,
        senderName: currentUser?.name,
        text: `📊 सर्वसम्मति भाव प्रस्ताव: ₹${voteVal}/क्विंटल (Vote registered by ${currentUser?.name || 'Farmer'})`,
        createdAt: new Date().toISOString()
      });
      setStore('pools', pools);
      return jsonRes({ ok: true, pool });
    }

    // 8. /api/pools/:id/messages
    const msgMatch = path.match(/^\/api\/pools\/([^\/]+)\/messages$/);
    if (msgMatch && method === 'POST') {
      const pools = getStore('pools', DEFAULT_POOLS);
      const pool = pools.find((p) => p.id === msgMatch[1]) || pools[0];
      const msg = {
        id: 'm-' + Date.now(),
        senderId: currentUser?.id,
        senderName: currentUser?.name || 'Farmer',
        text: body.text,
        createdAt: new Date().toISOString()
      };
      pool.messages = pool.messages || [];
      pool.messages.push(msg);
      setStore('pools', pools);
      return jsonRes({ message: msg });
    }

    // 9. /api/pools/:id/send-quote
    const quoteMatch = path.match(/^\/api\/pools\/([^\/]+)\/send-quote$/);
    if (quoteMatch && method === 'POST') {
      const pools = getStore('pools', DEFAULT_POOLS);
      const pool = pools.find((p) => p.id === quoteMatch[1]) || pools[0];
      pool.status = 'quote_sent';
      pool.messages.push({
        id: 'mq-' + Date.now(),
        senderId: 'system',
        senderName: 'KrishiSetu Buyer Outreach',
        text: `📨 कोटेशन 3 सत्यापित आटा/दाल मिलों को भेजा गया (Quote sent to registered flour/dal mills @ ₹${pool.agreedPrice}/qtl).`,
        createdAt: new Date().toISOString()
      });
      setStore('pools', pools);
      return jsonRes({ ok: true, pool });
    }

    // 10. /api/labour
    if (path.startsWith('/api/labour') && method === 'GET') {
      const listings = getStore('labour', DEFAULT_LABOUR);
      return jsonRes({ listings, profile: listings.find((l) => l.userId === currentUser?.id) || null });
    }
    if (path === '/api/labour/profile' && method === 'POST') {
      const listings = getStore('labour', DEFAULT_LABOUR);
      let profile = listings.find((l) => l.userId === currentUser?.id);
      if (!profile) {
        profile = { id: 'lab-' + Date.now(), userId: currentUser?.id };
        listings.unshift(profile);
      }
      Object.assign(profile, body, { name: currentUser?.name, phone: currentUser?.phone });
      setStore('labour', listings);
      return jsonRes({ profile });
    }

    // 11. /api/equipment
    if (path.startsWith('/api/equipment') && method === 'GET') {
      const items = getStore('gear', DEFAULT_GEAR);
      return jsonRes({ items });
    }
    if (path === '/api/equipment' && method === 'POST') {
      const items = getStore('gear', DEFAULT_GEAR);
      const item = {
        id: 'gear-' + Date.now(),
        userId: currentUser?.id,
        ownerName: currentUser?.name || 'Farmer',
        phone: currentUser?.phone,
        title: body.title,
        category: body.category || 'Tractors',
        type: body.type || 'rent',
        rentRate: Number(body.rentRate) || null,
        rentUnit: body.rentUnit || 'day',
        state: currentUser?.state || 'Madhya Pradesh',
        village: currentUser?.village || 'Sehore',
        available: true,
        description: body.description || ''
      };
      items.unshift(item);
      setStore('gear', items);
      return jsonRes({ item }, 201);
    }

    return jsonRes({ ok: true });
  };
})();
