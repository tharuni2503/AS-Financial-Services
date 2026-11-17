/* ==========================================================================
   AS Financial — public site interactions
   ========================================================================== */
(function () {
  'use strict';

  const DEFAULT_SETTINGS = {
    businessName: 'AS Financial Services and Solutions',
    tagline: 'Your Goals, Our Solutions',
    phone: '+91 91827 03079',
    phoneRaw: '919182703079',
    email: 'asfinancialservicesandsolution@gmail.com',
    address: 'Panchavati Colony Road No. 1, Medipalli, Hyderabad, Telangana 500098',
    hours: 'Mon – Sat · 9:30 AM – 7:00 PM',
    whatsapp: '919182703079'
  };

  /* ---------- storage helpers ---------- */
  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }

  const settings = Object.assign({}, DEFAULT_SETTINGS, read('as_settings', {}));

  /* ---------- inject business details ---------- */
  function setAnchorText(el, key) {
    const val = settings[key];
    if (val == null) return;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let n;
    while ((n = walker.nextNode())) { if (n.nodeValue.trim()) nodes.push(n); }
    if (!nodes.length) return;
    if (key === 'phone') {
      nodes.forEach(node => { node.nodeValue = node.nodeValue.replace(/(?:\+?91[\s-]*)?\d{5}[\s-]*\d{5}/, val); });
    } else if (key === 'email') {
      nodes.forEach(node => { node.nodeValue = node.nodeValue.replace(/[\w.+-]+@[\w.-]+\.\w+/, val); });
    } else if (key === 'address') {
      nodes[nodes.length - 1].nodeValue = val;
    }
  }

  function applySettings() {
    document.querySelectorAll('[data-setting]').forEach(el => {
      const key = el.getAttribute('data-setting');
      if (settings[key] == null) return;
      if (el.tagName === 'A') {
        if (key === 'phone') {
          el.href = 'tel:+' + (settings.phoneRaw || settings.phone).replace(/[^\d]/g, '');
        } else if (key === 'email') {
          el.href = 'mailto:' + settings.email;
        } else if (key === 'address') {
          el.href = 'https://maps.google.com/?q=' + encodeURIComponent(settings.address);
          el.target = '_blank';
          el.rel = 'noopener';
        } else if (key === 'whatsapp') {
          el.href = 'https://wa.me/' + settings.whatsapp + '?text=' + encodeURIComponent('Hi AS Financial, I would like to know more about your loan services.');
        }
        if (key === 'phone' || key === 'email' || key === 'address') setAnchorText(el, key);
      } else {
        el.textContent = settings[key];
      }
    });
    const wa = document.querySelector('[data-wa-link]');
    if (wa) wa.href = 'https://wa.me/' + settings.whatsapp + '?text=' + encodeURIComponent(wa.dataset.waLink || 'Hi AS Financial, I need help with a loan.');
  }
  applySettings();

  /* ---------- toast ---------- */
  window.asToast = function (message, type) {
    let host = document.querySelector('.as-toast-host');
    if (!host) {
      host = document.createElement('div');
      host.className = 'as-toast-host';
      host.style.cssText = 'position:fixed;left:50%;bottom:26px;transform:translateX(-50%);z-index:400;display:grid;gap:8px;width:min(92vw,420px)';
      document.body.appendChild(host);
    }
    const t = document.createElement('div');
    t.style.cssText = 'background:' + (type === 'error' ? '#b3423a' : '#0d2b4e') + ';color:#fff;padding:13px 18px;border-radius:12px;font-size:.84rem;font-weight:600;box-shadow:0 18px 40px -18px rgba(7,28,51,.6);display:flex;gap:9px;align-items:center;opacity:0;transform:translateY(10px);transition:.25s';
    t.innerHTML = '<svg class="icon" style="width:18px;height:18px;flex:none" aria-hidden="true"><use href="#i-' + (type === 'error' ? 'alert' : 'check-circle') + '"></use></svg><span></span>';
    t.querySelector('span').textContent = message;
    host.appendChild(t);
    requestAnimationFrame(() => { t.style.opacity = '1'; t.style.transform = 'none'; });
    setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateY(8px)'; setTimeout(() => t.remove(), 300); }, 3600);
  };

  /* ---------- header ---------- */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- mobile nav ---------- */
  document.querySelectorAll('[data-menu-open]').forEach(btn => {
    btn.addEventListener('click', () => {
      const nav = document.querySelector('.mobile-nav');
      if (!nav) return;
      nav.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });
  document.querySelectorAll('[data-menu-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const nav = document.querySelector('.mobile-nav');
      if (!nav) return;
      nav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ---------- reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
        });
      }, { threshold: 0.08, rootMargin: '120px 0px -20px 0px' });
      revealEls.forEach(el => io.observe(el));
      // Safety net: never leave content hidden if the observer misses an element.
      setTimeout(() => revealEls.forEach(el => el.classList.add('in')), 2400);
    } else {
      revealEls.forEach(el => el.classList.add('in'));
    }
  }

  /* ---------- FAQ ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-q');
    const panel = item.querySelector('.faq-a');
    if (!btn || !panel) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      const parent = item.parentElement;
      if (parent) {
        parent.querySelectorAll('.faq-item.open').forEach(other => {
          if (other !== item) {
            other.classList.remove('open');
            other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
            other.querySelector('.faq-a').style.maxHeight = '';
          }
        });
      }
      item.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
      panel.style.maxHeight = isOpen ? '' : panel.scrollHeight + 'px';
    });
  });

  /* ---------- partner tabs ---------- */
  document.querySelectorAll('[data-partner-tabs]').forEach(wrap => {
    const tabs = wrap.querySelectorAll('.partner-tab');
    const tiles = document.querySelectorAll('[data-partner-grid] .logo-tile');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const f = tab.dataset.filter;
        tiles.forEach(tile => {
          const show = f === 'all' || tile.dataset.category === f;
          tile.classList.toggle('hide', !show);
        });
      });
    });
  });



  /* ---------- counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const decimals = (el.dataset.decimals | 0);
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        const dur = 1300;
        const start = performance.now();
        function tick(now) {
          const p = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          const val = target * eased;
          el.textContent = prefix + val.toLocaleString('en-IN', { maximumFractionDigits: decimals, minimumFractionDigits: decimals }) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        co.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(el => co.observe(el));
  }

  /* ---------- currency helpers ---------- */
  function inr(n) {
    return '₹' + Math.round(n).toLocaleString('en-IN');
  }
  function compact(n) {
    if (n >= 10000000) return '₹' + (n / 10000000).toFixed(2).replace(/\.00$/, '') + ' Cr';
    if (n >= 100000) return '₹' + (n / 100000).toFixed(2).replace(/\.00$/, '') + ' L';
    return inr(n);
  }
  window.asInr = inr;
  window.asCompact = compact;

  function emiOf(P, annualRate, months) {
    const r = annualRate / 12 / 100;
    if (r === 0) return P / months;
    return P * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1);
  }

  /* ---------- calculators ---------- */
  document.querySelectorAll('[data-calculator]').forEach(root => {
    const amount = root.querySelector('[data-calc="amount"]');
    const rate = root.querySelector('[data-calc="rate"]');
    const tenure = root.querySelector('[data-calc="tenure"]');
    if (!amount || !rate || !tenure) return;
    const isFull = root.dataset.calculator === 'full';
    const out = {
      emi: root.querySelector('[data-out="emi"]'),
      interest: root.querySelector('[data-out="interest"]'),
      total: root.querySelector('[data-out="total"]'),
      principal: root.querySelector('[data-out="principal"]'),
      interestPct: root.querySelector('[data-out="interestPct"]'),
      principalPct: root.querySelector('[data-out="principalPct"]'),
      principalPct2: root.querySelector('[data-out="principalPct2"]'),
      barPrincipal: root.querySelector('[data-out="barPrincipal"]'),
      barInterest: root.querySelector('[data-out="barInterest"]'),
      amountLabel: root.querySelector('[data-label="amount"]'),
      rateLabel: root.querySelector('[data-label="rate"]'),
      tenureLabel: root.querySelector('[data-label="tenure"]'),
      donutPrincipal: root.querySelector('[data-donut="principal"]'),
      donutInterest: root.querySelector('[data-donut="interest"]'),
      schedule: root.querySelector('[data-schedule]') || (isFull ? document.querySelector('[data-schedule]') : null)
    };

    let unit = 'years';

    function paintRange(el) {
      const min = parseFloat(el.min), max = parseFloat(el.max), val = parseFloat(el.value);
      const pct = ((val - min) / (max - min)) * 100;
      el.style.setProperty('--fill', pct + '%');
    }

    function calc() {
      const P = parseFloat(amount.value);
      const annualRate = parseFloat(rate.value);
      const rawTenure = parseFloat(tenure.value);
      const months = unit === 'months' ? Math.max(1, Math.round(rawTenure)) : Math.max(1, Math.round(rawTenure * 12));
      const emi = emiOf(P, annualRate, months);
      const total = emi * months;
      const interest = total - P;
      const interestPct = (interest / total) * 100;

      if (out.emi) out.emi.textContent = inr(emi).replace('₹', '₹ ');
      if (out.interest) out.interest.textContent = inr(interest);
      if (out.total) out.total.textContent = inr(total);
      if (out.principal) out.principal.textContent = inr(P);
      if (out.interestPct) out.interestPct.textContent = interestPct.toFixed(1) + '%';
      if (out.principalPct) out.principalPct.textContent = (100 - interestPct).toFixed(1) + '%';
      if (out.principalPct2) out.principalPct2.textContent = (100 - interestPct).toFixed(0) + '%';
      if (out.barPrincipal) out.barPrincipal.style.width = (100 - interestPct) + '%';
      if (out.barInterest) out.barInterest.style.width = interestPct + '%';
      if (out.amountLabel) out.amountLabel.textContent = compact(P);
      if (out.rateLabel) out.rateLabel.textContent = annualRate.toFixed(2) + '% p.a.';
      if (out.tenureLabel) out.tenureLabel.textContent = unit === 'months'
        ? rawTenure + (rawTenure === 1 ? ' month' : ' months')
        : rawTenure + (rawTenure === 1 ? ' year' : ' years');

      // donut (r=52, circumference 326.7)
      const C = 326.73;
      if (out.donutPrincipal) out.donutPrincipal.style.strokeDasharray = ((100 - interestPct) / 100 * C) + ' ' + C;
      if (out.donutInterest) {
        out.donutInterest.style.strokeDasharray = (interestPct / 100 * C) + ' ' + C;
        out.donutInterest.style.strokeDashoffset = (-(100 - interestPct) / 100 * C) + '';
      }

      if (out.schedule) {
        let balance = P;
        let rows = '';
        const r = annualRate / 12 / 100;
        for (let y = 1; y <= Math.ceil(months / 12); y++) {
          let interestY = 0, principalY = 0;
          for (let m = 0; m < 12 && (y - 1) * 12 + m < months; m++) {
            const iPart = balance * r;
            const pPart = emi - iPart;
            interestY += iPart;
            principalY += pPart;
            balance -= pPart;
          }
          rows += `<tr><td>Year ${y}</td><td>${inr(principalY)}</td><td>${inr(interestY)}</td><td>${inr(Math.max(0, balance))}</td></tr>`;
        }
        out.schedule.innerHTML = rows;
      }

      root.querySelectorAll('input[type="range"]').forEach(paintRange);
    }

    amount.addEventListener('input', calc);
    rate.addEventListener('input', calc);
    tenure.addEventListener('input', calc);

    root.querySelectorAll('[data-tenure-unit]').forEach(btn => {
      btn.addEventListener('click', () => {
        root.querySelectorAll('[data-tenure-unit]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        unit = btn.dataset.tenureUnit;
        const current = parseFloat(tenure.value) || 0;
        if (unit === 'months') {
          tenure.min = 12; tenure.max = 360; tenure.step = 6;
          tenure.value = Math.min(360, Math.round(current * 12));
        } else {
          tenure.min = 1; tenure.max = 30; tenure.step = 1;
          tenure.value = Math.max(1, Math.round(current / 12));
        }
        calc();
      });
    });

    calc();
  });

  /* ---------- lead persistence ---------- */
  const statusDefault = 'New';
  function saveLead(payload) {
    const leads = read('as_leads', []);
    const lead = Object.assign({
      id: 'ASL-' + String(Date.now()).slice(-6),
      status: statusDefault,
      priority: 'Medium',
      source: 'Website',
      owner: 'Unassigned',
      createdAt: new Date().toISOString(),
      notes: []
    }, payload);
    leads.unshift(lead);
    try { localStorage.setItem('as_leads', JSON.stringify(leads)); } catch (e) {}
    return lead;
  }
  window.asSaveLead = saveLead;

  document.querySelectorAll('[data-lead-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = (data.get('name') || '').toString().trim();
      const phone = (data.get('phone') || '').toString().trim();
      if (!name || !phone) {
        asToast('Please add your name and mobile number.', 'error');
        return;
      }
      if (!/^[0-9+\-\s]{10,15}$/.test(phone)) {
        asToast('Please enter a valid 10-digit mobile number.', 'error');
        return;
      }
      saveLead({
        name,
        phone,
        email: (data.get('email') || '').toString().trim(),
        product: data.get('product') || 'General enquiry',
        amount: data.get('amount') || '',
        income: data.get('income') || '',
        employment: data.get('employment') || '',
        city: data.get('city') || 'Hyderabad',
        message: data.get('message') || '',
        source: form.dataset.source || 'Website form'
      });
      const success = form.querySelector('.form-success');
      if (success) {
        success.classList.add('show');
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      form.reset();
      asToast('Thank you, ' + name.split(' ')[0] + '! Our advisor will call you within 30 minutes.');
      const popup = form.closest('.popup-overlay');
      if (popup) setTimeout(() => closePopup(popup), 1800);
    });
  });

  /* ---------- popup ---------- */
  function openPopup(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add('open');
    document.body.style.overflow = 'hidden';
    const first = el.querySelector('input, select, textarea');
    if (first) setTimeout(() => first.focus(), 120);
  }
  function closePopup(el) {
    if (!el) return;
    el.classList.remove('open');
    document.body.style.overflow = '';
  }
  document.querySelectorAll('[data-popup-open]').forEach(btn => {
    btn.addEventListener('click', (e) => { e.preventDefault(); openPopup(btn.dataset.popupOpen); });
  });
  document.querySelectorAll('[data-popup-close]').forEach(btn => {
    btn.addEventListener('click', () => closePopup(btn.closest('.popup-overlay')));
  });
  document.querySelectorAll('.popup-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closePopup(overlay); });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') document.querySelectorAll('.popup-overlay.open').forEach(closePopup);
  });

  /* ---------- year ---------- */
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  /* ---------- active nav ---------- */
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link[href], .m-link[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path) a.setAttribute('aria-current', 'page');
  });
})();
