// ============================================================================
// IEDO Visual — Interactive Simulations for all 14 Topics
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Render KaTeX Math
  const tryRenderMath = () => {
    if (window.renderMathInElement) {
      window.renderMathInElement(document.body, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '\\(', right: '\\)', display: false }
        ],
        throwOnError: false
      });
    } else {
      setTimeout(tryRenderMath, 100);
    }
  };
  tryRenderMath();

  // 2. Theme Toggle & Mobile Sidebar with Backdrop
  const themeToggle = document.getElementById('themeToggle');
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', current === 'light' ? 'dark' : 'light');
  });

  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');

  function toggleMobileMenu(forceState) {
    const isOpen = typeof forceState === 'boolean' ? forceState : !sidebar.classList.contains('open');
    sidebar.classList.toggle('open', isOpen);
    if (sidebarBackdrop) sidebarBackdrop.classList.toggle('active', isOpen);
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => toggleMobileMenu());
  }
  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', () => toggleMobileMenu(false));
  }

  // 3. Sidebar Quick Filter / Search
  const topicSearch = document.getElementById('topicSearch');
  const navGroups = document.querySelectorAll('.nav-group');
  if (topicSearch) {
    topicSearch.addEventListener('input', () => {
      const q = topicSearch.value.trim().toLowerCase();
      navGroups.forEach(group => {
        let visibleCount = 0;
        group.querySelectorAll('li').forEach(li => {
          const text = li.textContent.toLowerCase();
          const match = !q || text.includes(q);
          li.style.display = match ? '' : 'none';
          if (match) visibleCount++;
        });
        group.style.display = visibleCount > 0 ? '' : 'none';
      });
    });
  }

  // 4. Active Nav Link, Top Progress Bar & Back-to-Top Button on Scroll
  const sections = document.querySelectorAll('.intro-edo-box, .central-case-box, .topic-card');
  const topicCards = document.querySelectorAll('.topic-card');
  const navLinks = document.querySelectorAll('.nav-link');
  const scrollProgress = document.getElementById('scrollProgress');
  const progressLabel = document.getElementById('progressLabel');
  const progressPercent = document.getElementById('progressPercent');
  const backToTop = document.getElementById('backToTop');

  function updateScrollUI() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const pct = Math.min(100, Math.max(0, Math.round((scrollTop / docHeight) * 100)));

    if (scrollProgress) scrollProgress.style.width = `${pct}%`;
    if (progressPercent) progressPercent.textContent = `${pct}%`;
    if (backToTop) backToTop.classList.toggle('visible', scrollTop > 420);

    let currentId = 'o-que-e-edo';
    let currentTopicNum = 1;
    sections.forEach(sec => {
      const top = sec.getBoundingClientRect().top;
      if (top < 260) {
        currentId = sec.id;
        if (sec.id.startsWith('t')) {
          currentTopicNum = parseInt(sec.id.slice(1), 10) || 1;
        }
      }
    });

    if (progressLabel) {
      progressLabel.textContent = currentId.startsWith('t')
        ? `Leitura: Tópico ${currentTopicNum} / 14`
        : 'Introdução & Caso Central';
    }

    navLinks.forEach(link => {
      const isActive = link.getAttribute('href') === `#${currentId}`;
      link.classList.toggle('active', isActive);
    });
  }

  window.addEventListener('scroll', updateScrollUI, { passive: true });
  updateScrollUI();

  navLinks.forEach(link => {
    link.addEventListener('click', () => toggleMobileMenu(false));
  });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 5. Smooth Card Reveal on Scroll (IntersectionObserver)
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    topicCards.forEach(card => {
      card.classList.add('reveal-init');
      observer.observe(card);
    });
  }

  // 6. Live Numeric Badge on Every Range Slider
  document.querySelectorAll('.control-group input[type="range"]').forEach(slider => {
    const badge = document.createElement('span');
    badge.className = 'slider-val';
    const updateBadge = () => {
      const step = parseFloat(slider.step) || 1;
      const decimals = step < 0.1 ? 2 : (step < 1 ? 1 : 0);
      badge.textContent = parseFloat(slider.value).toFixed(decimals);
    };
    updateBadge();
    slider.addEventListener('input', updateBadge);
    slider.parentElement.appendChild(badge);
  });

  // 7. High-DPI (Retina) Canvas Upgrade & Touch-to-Mouse Bridge
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  document.querySelectorAll('canvas').forEach(c => {
    const logicalW = c.width;
    const logicalH = c.height;
    if (dpr > 1) {
      c.width = logicalW * dpr;
      c.height = logicalH * dpr;
      const ctx = c.getContext('2d');
      ctx.scale(dpr, dpr);
      Object.defineProperty(c, 'width', { get: () => logicalW });
      Object.defineProperty(c, 'height', { get: () => logicalH });
    }

    // Forward touch interactions to mouse events for mobile responsiveness
    const forwardTouch = (touchEvent, mouseType) => {
      if (!touchEvent.touches || touchEvent.touches.length === 0) return;
      const touch = touchEvent.touches[0];
      c.dispatchEvent(new MouseEvent(mouseType, {
        clientX: touch.clientX,
        clientY: touch.clientY,
        bubbles: true
      }));
    };
    c.addEventListener('touchstart', e => {
      forwardTouch(e, 'click');
      forwardTouch(e, 'mousemove');
    }, { passive: true });
    c.addEventListener('touchmove', e => {
      forwardTouch(e, 'mousemove');
    }, { passive: true });
  });

  // Helper for Coordinate Mapping on Canvas
  function createMapper(w, h, xMin, xMax, yMin, yMax) {
    return {
      toX: x => ((x - xMin) / (xMax - xMin)) * w,
      toY: y => h - ((y - yMin) / (yMax - yMin)) * h,
      fromX: px => xMin + (px / w) * (xMax - xMin),
      fromY: py => yMin + ((h - py) / h) * (yMax - yMin)
    };
  }

  function drawAxes(ctx, w, h, map, xLabel = 't', yLabel = 'y') {
    ctx.save();
    ctx.strokeStyle = 'rgba(196, 181, 253, 0.09)';
    ctx.lineWidth = 1;

    // Grid lines
    for (let x = -10; x <= 10; x += 1) {
      const px = map.toX(x);
      if (px >= 0 && px <= w) {
        ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, h); ctx.stroke();
      }
    }
    for (let y = -10; y <= 10; y += 1) {
      const py = map.toY(y);
      if (py >= 0 && py <= h) {
        ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(w, py); ctx.stroke();
      }
    }

    // Main Axes
    ctx.strokeStyle = '#5b5075';
    ctx.lineWidth = 1.5;
    const y0 = map.toY(0);
    const x0 = map.toX(0);
    if (y0 >= 0 && y0 <= h) {
      ctx.beginPath(); ctx.moveTo(0, y0); ctx.lineTo(w, y0); ctx.stroke();
    }
    if (x0 >= 0 && x0 <= w) {
      ctx.beginPath(); ctx.moveTo(x0, 0); ctx.lineTo(x0, h); ctx.stroke();
    }

    ctx.fillStyle = '#fbbf24';
    ctx.font = '700 11px "JetBrains Mono", monospace';
    ctx.fillText(xLabel, w - 20, Math.min(Math.max(y0 - 6, 14), h - 6));
    ctx.fillText(yLabel, Math.min(Math.max(x0 + 6, 6), w - 26), 14);
    ctx.restore();
  }

  // ==========================================================================
  // TOPIC 1: (dy/dt) - Taxa de Variação (Slope Field + Tangent Vector)
  // ==========================================================================
  (() => {
    const canvas = document.getElementById('canvas-t1');
    const ctx = canvas.getContext('2d');
    const tSlider = document.getElementById('t1-slider');
    const cSlider = document.getElementById('t1-c');
    const status = document.getElementById('t1-status');
    const w = canvas.width, h = canvas.height;
    const map = createMapper(w, h, -3.5, 3.5, -2.6, 2.6);

    // ODE: dy/dt = -0.5y + cos(t)
    // Exact solution: y(t) = C*e^(-0.5t) + 0.4*cos(t) + 0.8*sin(t)
    const f = (t, y) => -0.5 * y + Math.cos(t);
    const ySol = (t, C) => C * Math.exp(-0.5 * t) + 0.4 * Math.cos(t) + 0.8 * Math.sin(t);

    function draw() {
      ctx.clearRect(0, 0, w, h);
      drawAxes(ctx, w, h, map, 't', 'y(t)');

      // Slope Field
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.32)';
      ctx.lineWidth = 1.2;
      for (let t = -3.2; t <= 3.2; t += 0.45) {
        for (let y = -2.2; y <= 2.2; y += 0.45) {
          const slope = f(t, y);
          const angle = Math.atan(slope);
          const dt = 0.14 * Math.cos(angle);
          const dy = 0.14 * Math.sin(angle);
          ctx.beginPath();
          ctx.moveTo(map.toX(t - dt), map.toY(y - dy));
          ctx.lineTo(map.toX(t + dt), map.toY(y + dy));
          ctx.stroke();
        }
      }

      const C = parseFloat(cSlider.value);
      const t0 = parseFloat(tSlider.value);

      // Solution curve y(t)
      ctx.strokeStyle = '#2dd4bf';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      for (let t = -3.5; t <= 3.5; t += 0.04) {
        const px = map.toX(t), py = map.toY(ySol(t, C));
        if (t === -3.5) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Tangent at t0
      const y0 = ySol(t0, C);
      const slope = f(t0, y0);
      const isRising = slope >= 0;
      const tangColor = isRising ? '#bef264' : '#ff6b4a';

      const dtSpan = 0.85;
      ctx.strokeStyle = tangColor;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(map.toX(t0 - dtSpan), map.toY(y0 - slope * dtSpan));
      ctx.lineTo(map.toX(t0 + dtSpan), map.toY(y0 + slope * dtSpan));
      ctx.stroke();

      // Point (t0, y0)
      ctx.fillStyle = tangColor;
      ctx.beginPath();
      ctx.arc(map.toX(t0), map.toY(y0), 6, 0, Math.PI * 2);
      ctx.fill();

      const stateText = Math.abs(slope) < 0.05 ? 'Estacionária (≈ 0)' : (isRising ? 'Subindo (dy/dt > 0)' : 'Descendo (dy/dt < 0)');
      status.textContent = `Em t = ${t0.toFixed(1)}, y = ${y0.toFixed(2)}  ⇒  dy/dt = ${slope >= 0 ? '+' : ''}${slope.toFixed(2)} (${stateText})`;
    }

    tSlider.addEventListener('input', draw);
    cSlider.addEventListener('input', draw);
    canvas.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      const px = (e.clientX - rect.left) * (w / rect.width);
      const tVal = Math.max(-3, Math.min(3, map.fromX(px)));
      tSlider.value = tVal.toFixed(1);
      tSlider.dispatchEvent(new Event('input'));
    });
    draw();
  })();

  // ==========================================================================
  // TOPIC 2: Teorema de Existência e Unicidade (TEU)
  // ==========================================================================
  (() => {
    const canvas = document.getElementById('canvas-t2');
    const ctx = canvas.getContext('2d');
    const btnOk = document.getElementById('t2-btn-ok');
    const btnBreak = document.getElementById('t2-btn-break');
    const status = document.getElementById('t2-status');
    const w = canvas.width, h = canvas.height;
    const map = createMapper(w, h, -2.5, 2.5, -2.2, 2.2);

    let mode = 'ok';
    let userPoint = { t0: -0.5, y0: 1.2 };

    function draw() {
      ctx.clearRect(0, 0, w, h);
      drawAxes(ctx, w, h, map, 't', 'y');

      if (mode === 'ok') {
        // y' = -y + t => y(t) = t - 1 + C*e^(-t)
        // Family of curves that NEVER cross
        const cList = [-2, -1, -0.3, 0.4, 1.2, 2.2];
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
        ctx.lineWidth = 1.5;
        cList.forEach(C => {
          ctx.beginPath();
          for (let t = -2.5; t <= 2.5; t += 0.05) {
            const y = t - 1 + C * Math.exp(-t);
            if (t === -2.5) ctx.moveTo(map.toX(t), map.toY(y));
            else ctx.lineTo(map.toX(t), map.toY(y));
          }
          ctx.stroke();
        });

        // User selected PVI curve
        const CUser = (userPoint.y0 - userPoint.t0 + 1) * Math.exp(userPoint.t0);
        ctx.strokeStyle = '#bef264';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let t = -2.5; t <= 2.5; t += 0.04) {
          const y = t - 1 + CUser * Math.exp(-t);
          if (t === -2.5) ctx.moveTo(map.toX(t), map.toY(y));
          else ctx.lineTo(map.toX(t), map.toY(y));
        }
        ctx.stroke();

        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(map.toX(userPoint.t0), map.toY(userPoint.y0), 6, 0, Math.PI * 2);
        ctx.fill();

        status.textContent = `PVI (${userPoint.t0.toFixed(1)}, ${userPoint.y0.toFixed(1)}): f e ∂f/∂y contínuas ⇒ 1 ÚNICA curva passa pelo ponto!`;
      } else {
        // Mode 'break': y' = 3*y^(2/3) => ∂f/∂y = 2 / y^(1/3) explodes at y = 0!
        // Highlight danger line y = 0
        ctx.fillStyle = 'rgba(251, 113, 133, 0.15)';
        ctx.fillRect(0, map.toY(0.25), w, map.toY(-0.25) - map.toY(0.25));

        // Solution 1: y(t) = 0 (Horizontal line)
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, map.toY(0));
        ctx.lineTo(w, map.toY(0));
        ctx.stroke();

        // Solution 2: y(t) = (t - t0)^3 passing through (0, 0) and other shifts
        [-1.0, 0.0, 0.9].forEach((shift, idx) => {
          ctx.strokeStyle = idx === 1 ? '#ff6b4a' : 'rgba(251, 113, 133, 0.4)';
          ctx.lineWidth = idx === 1 ? 3 : 1.5;
          ctx.beginPath();
          for (let t = -2.5; t <= 2.5; t += 0.03) {
            const y = Math.pow(t - shift, 3);
            if (t === -2.5) ctx.moveTo(map.toX(t), map.toY(y));
            else ctx.lineTo(map.toX(t), map.toY(y));
          }
          ctx.stroke();
        });

        // Intersection point (0,0)
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(map.toX(0), map.toY(0), 6.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ff6b4a';
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.fillText('Quebra de Unicidade em (0,0): y₁=0 e y₂=t³ se cruzam!', 12, 24);
        status.textContent = `Em y = 0: ∂f/∂y = 2/y^(1/3) → ∞. Duas soluções (y = 0 e y = t³) saem do mesmo ponto!`;
      }
    }

    btnOk.addEventListener('click', () => {
      mode = 'ok';
      btnOk.classList.add('active');
      btnBreak.classList.remove('active');
      draw();
    });
    btnBreak.addEventListener('click', () => {
      mode = 'break';
      btnBreak.classList.add('active');
      btnOk.classList.remove('active');
      draw();
    });
    canvas.addEventListener('click', e => {
      const rect = canvas.getBoundingClientRect();
      const px = (e.clientX - rect.left) * (w / rect.width);
      const py = (e.clientY - rect.top) * (h / rect.height);
      userPoint = { t0: map.fromX(px), y0: map.fromY(py) };
      if (mode !== 'ok') {
        mode = 'ok';
        btnOk.classList.add('active');
        btnBreak.classList.remove('active');
      }
      draw();
    });
    draw();
  })();

  // ==========================================================================
  // TOPIC 3: Linearidade & Superposição
  // ==========================================================================
  (() => {
    const canvas = document.getElementById('canvas-t3');
    const ctx = canvas.getContext('2d');
    const btns = document.querySelectorAll('[data-t3]');
    const status = document.getElementById('t3-status');
    const w = canvas.width, h = canvas.height;
    const map = createMapper(w, h, 0, 6.28, -2.4, 2.4);

    let mode = 'lin';

    function draw() {
      ctx.clearRect(0, 0, w, h);
      drawAxes(ctx, w, h, map, 't', 'y');

      if (mode === 'lin') {
        // y1 = cos(t), y2 = 0.8*sin(t), y1 + y2 is also a solution!
        const drawCurve = (fn, color, width, dash = []) => {
          ctx.save();
          ctx.strokeStyle = color;
          ctx.lineWidth = width;
          ctx.setLineDash(dash);
          ctx.beginPath();
          for (let t = 0; t <= 6.28; t += 0.04) {
            const y = fn(t);
            if (t === 0) ctx.moveTo(map.toX(t), map.toY(y));
            else ctx.lineTo(map.toX(t), map.toY(y));
          }
          ctx.stroke();
          ctx.restore();
        };

        drawCurve(t => Math.cos(t), '#2dd4bf', 2, [5, 4]);
        drawCurve(t => 0.8 * Math.sin(t), '#bef264', 2, [5, 4]);
        drawCurve(t => Math.cos(t) + 0.8 * Math.sin(t), '#fbbf24', 3);

        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.fillText('Amarela = y₁ + y₂ (Superposição funciona nas Lineares!)', 14, 24);
        status.textContent = '✅ Linear (grau 1 em y e y\'\'): A soma c₁y₁ + c₂y₂ também é solução!';
      } else if (mode === 'non1') {
        // y' = y^2 => y1 = 1/(3.2 - t). Explosive non-linear behavior!
        ctx.strokeStyle = '#ff6b4a';
        ctx.lineWidth = 2.8;
        ctx.beginPath();
        for (let t = 0; t <= 2.75; t += 0.03) {
          const y = 1 / (3.0 - t);
          if (t === 0) ctx.moveTo(map.toX(t), map.toY(y));
          else ctx.lineTo(map.toX(t), map.toY(y));
        }
        ctx.stroke();

        // Asymptote at t = 3
        ctx.strokeStyle = 'rgba(251, 113, 133, 0.5)';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(map.toX(3), 0);
        ctx.lineTo(map.toX(3), h);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#ff6b4a';
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.fillText('Potência y² quebra a linearidade e explode em t = 3!', 14, 24);
        status.textContent = '❌ Não-Linear: O termo y² tem grau 2. Superposição falha: (2y)′ ≠ (2y)²!';
      } else {
        // y'' + sin(y) = 0 vs y'' + y = 0
        ctx.strokeStyle = '#2dd4bf';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        for (let t = 0; t <= 6.28; t += 0.04) {
          const y = 1.9 * Math.cos(t);
          if (t === 0) ctx.moveTo(map.toX(t), map.toY(y));
          else ctx.lineTo(map.toX(t), map.toY(y));
        }
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 2.8;
        ctx.beginPath();
        for (let t = 0; t <= 6.28; t += 0.04) {
          const y = 1.9 * Math.cos(0.76 * t); // non-linear period slowdown for large angle pendulum
          if (t === 0) ctx.moveTo(map.toX(t), map.toY(y));
          else ctx.lineTo(map.toX(t), map.toY(y));
        }
        ctx.stroke();

        ctx.fillStyle = '#c084fc';
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.fillText('y dentro de sen(y) atrasa o período em grandes amplitudes!', 14, 24);
        status.textContent = '❌ Não-Linear: y está preso dentro de sen(y). Só é linear se aproximarmos sen(y) ≈ y!';
      }
    }

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        mode = btn.getAttribute('data-t3');
        draw();
      });
    });
    draw();
  })();

  // ==========================================================================
  // TOPIC 4: Variáveis Separáveis
  // ==========================================================================
  (() => {
    const canvas = document.getElementById('canvas-t4');
    const ctx = canvas.getContext('2d');
    const btns = document.querySelectorAll('[data-t4]');
    const cSlider = document.getElementById('t4-c');
    const status = document.getElementById('t4-status');
    const w = canvas.width, h = canvas.height;
    const map = createMapper(w, h, -3.5, 3.5, -2.3, 2.3);

    let mode = 'circle';

    function draw() {
      ctx.clearRect(0, 0, w, h);
      drawAxes(ctx, w, h, map, 't', 'y');
      const C = parseFloat(cSlider.value);

      if (mode === 'circle') {
        // y' = -t/y => t^2 + y^2 = R^2
        [0.8, 1.4, 2.0, 2.6].forEach(r => {
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          for (let a = 0; a <= Math.PI * 2; a += 0.05) {
            const px = map.toX(r * Math.cos(a));
            const py = map.toY(r * Math.sin(a));
            if (a === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();
        });

        ctx.strokeStyle = '#bef264';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2; a += 0.04) {
          const px = map.toX(C * 0.65 * Math.cos(a));
          const py = map.toY(C * 0.65 * Math.sin(a));
          if (a === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
        status.textContent = `Separando: ∫ y dy = ∫ -t dt  ⇒  t² + y² = ${(C * 0.65).toFixed(2)}²`;
      } else if (mode === 'hyp') {
        // y' = y/t => ln|y| = ln|t| + C => y = C*t
        [-1.5, -0.7, 0.4, 1.2].forEach(k => {
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(map.toX(-3.5), map.toY(-3.5 * k));
          ctx.lineTo(map.toX(3.5), map.toY(3.5 * k));
          ctx.stroke();
        });
        const k = (C - 1.8);
        ctx.strokeStyle = '#2dd4bf';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(map.toX(-3.5), map.toY(-3.5 * k));
        ctx.lineTo(map.toX(3.5), map.toY(3.5 * k));
        ctx.stroke();
        status.textContent = `Separando: ∫ (1/y) dy = ∫ (1/t) dt  ⇒  y(t) = ${k.toFixed(2)}·t`;
      } else {
        // y' = -t*y => y = C*e^(-t^2/2)
        [-1.8, -1.0, 1.0, 1.8].forEach(k => {
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          for (let t = -3.5; t <= 3.5; t += 0.05) {
            const y = k * Math.exp(-0.5 * t * t);
            if (t === -3.5) ctx.moveTo(map.toX(t), map.toY(y));
            else ctx.lineTo(map.toX(t), map.toY(y));
          }
          ctx.stroke();
        });
        const k = C - 1.2;
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let t = -3.5; t <= 3.5; t += 0.04) {
          const y = k * Math.exp(-0.5 * t * t);
          if (t === -3.5) ctx.moveTo(map.toX(t), map.toY(y));
          else ctx.lineTo(map.toX(t), map.toY(y));
        }
        ctx.stroke();
        status.textContent = `Separando: ∫ (1/y) dy = ∫ -t dt  ⇒  y(t) = ${k.toFixed(2)}·e^(-t²/2)`;
      }
    }

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        mode = btn.getAttribute('data-t4');
        draw();
      });
    });
    cSlider.addEventListener('input', draw);
    draw();
  })();

  // ==========================================================================
  // TOPIC 5: Equações Exatas (Curvas de Nível Ψ(t,y) = C)
  // ==========================================================================
  (() => {
    const canvas = document.getElementById('canvas-t5');
    const ctx = canvas.getContext('2d');
    const cSlider = document.getElementById('t5-c');
    const status = document.getElementById('t5-status');
    const w = canvas.width, h = canvas.height;
    const map = createMapper(w, h, -2.5, 2.5, -2.2, 2.2);

    // Ψ(t,y) = t^2*y + t + y^2 = C
    const psi = (t, y) => t * t * y + t + y * y;

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const targetC = parseFloat(cSlider.value);

      // Draw Heatmap & Contour band for Ψ(t,y)
      const step = 4;
      for (let px = 0; px < w; px += step) {
        for (let py = 0; py < h; py += step) {
          const t = map.fromX(px);
          const y = map.fromY(py);
          const val = psi(t, y);
          const diff = Math.abs(val - targetC);

          if (diff < 0.14) {
            ctx.fillStyle = '#bef264';
            ctx.fillRect(px, py, step, step);
          } else if (Math.abs((val * 2) % 1) < 0.08) {
            ctx.fillStyle = 'rgba(56, 189, 248, 0.22)';
            ctx.fillRect(px, py, step, step);
          }
        }
      }

      drawAxes(ctx, w, h, map, 't', 'y');

      ctx.fillStyle = '#bef264';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText(`Curva de Nível ativa: Ψ(t,y) = t²y + t + y² = ${targetC.toFixed(2)}`, 12, 22);
      status.textContent = `∂M/∂y = 2t  e  ∂N/∂t = 2t  ⇒  Exata! Solução percorre a altitude constante C = ${targetC.toFixed(2)}`;
    }

    cSlider.addEventListener('input', draw);
    draw();
  })();

  // ==========================================================================
  // TOPIC 6: Semiexata (Fator Integrante μ(y) = y^α)
  // ==========================================================================
  (() => {
    const canvas = document.getElementById('canvas-t6');
    const ctx = canvas.getContext('2d');
    const alphaSlider = document.getElementById('t6-alpha');
    const fixBtn = document.getElementById('t6-fix-btn');
    const status = document.getElementById('t6-status');
    const w = canvas.width, h = canvas.height;

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const alpha = parseFloat(alphaSlider.value);
      // Original: y dt + (2t - y) dy = 0
      // Multiplied by y^alpha: y^(1+alpha) dt + (2t*y^alpha - y^(1+alpha)) dy = 0
      // dM/dy = (1 + alpha)*y^alpha,  dN/dt = 2*y^alpha
      const coefM = 1 + alpha;
      const coefN = 2.0;
      const isExact = Math.abs(coefM - coefN) < 0.05;

      // Draw a visual Balance Scale on the canvas
      const cx = w / 2, cy = 125;
      const tilt = (coefN - coefM) * 0.28; // radians

      // Base pillar
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cx, cy - 30);
      ctx.lineTo(cx, cy + 75);
      ctx.moveTo(cx - 45, cy + 75);
      ctx.lineTo(cx + 45, cy + 75);
      ctx.stroke();

      // Beam
      ctx.save();
      ctx.translate(cx, cy - 25);
      ctx.rotate(tilt);

      const beamColor = isExact ? '#bef264' : '#ff6b4a';
      ctx.strokeStyle = beamColor;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(-130, 0);
      ctx.lineTo(130, 0);
      ctx.stroke();

      // Left Pan (∂(μM)/∂y)
      ctx.fillStyle = 'rgba(30, 41, 59, 0.95)';
      ctx.strokeStyle = beamColor;
      ctx.lineWidth = 2;
      ctx.fillRect(-175, 18, 95, 42);
      ctx.strokeRect(-175, 18, 95, 42);
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillText(`∂(μM)/∂y`, -160, 36);
      ctx.fillStyle = beamColor;
      ctx.fillText(`${coefM.toFixed(1)}·y^${alpha.toFixed(1)}`, -155, 53);

      // Right Pan (∂(μN)/∂t)
      ctx.fillStyle = 'rgba(30, 41, 59, 0.95)';
      ctx.fillRect(80, 18, 95, 42);
      ctx.strokeRect(80, 18, 95, 42);
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(`∂(μN)/∂t`, 98, 36);
      ctx.fillStyle = beamColor;
      ctx.fillText(`${coefN.toFixed(1)}·y^${alpha.toFixed(1)}`, 98, 53);

      ctx.restore();

      // Top label
      ctx.fillStyle = isExact ? '#bef264' : '#fbbf24';
      ctx.font = 'bold 13px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        isExact
          ? '✔ BALANÇA EQUILIBRADA! Com μ(y) = y¹, a EDO virou Exata!'
          : '⚖️ Ajuste o Fator Integrante μ(y) = y^α até igualar as derivadas cruzadas',
        cx,
        28
      );
      ctx.textAlign = 'left';

      status.textContent = isExact
        ? `α = 1.0 ⇒ μ(y) = y¹: ∂(μM)/∂y = 2y = ∂(μN)/∂t (EQUAÇÃO EXATA!)`
        : `α = ${alpha.toFixed(1)} ⇒ ∂(μM)/∂y = ${coefM.toFixed(1)}y^${alpha.toFixed(1)} ≠ ∂(μN)/∂t = 2.0y^${alpha.toFixed(1)}`;
    }

    alphaSlider.addEventListener('input', draw);
    fixBtn.addEventListener('click', () => {
      alphaSlider.value = '1';
      alphaSlider.dispatchEvent(new Event('input'));
    });
    draw();
  })();

  // ==========================================================================
  // TOPIC 7: Lineares de 1ª Ordem (y' + p*y = q)
  // ==========================================================================
  (() => {
    const canvas = document.getElementById('canvas-t7');
    const ctx = canvas.getContext('2d');
    const pSlider = document.getElementById('t7-p');
    const qSlider = document.getElementById('t7-q');
    const status = document.getElementById('t7-status');
    const w = canvas.width, h = canvas.height;
    const map = createMapper(w, h, 0, 5, -2.5, 3.8);

    function draw() {
      ctx.clearRect(0, 0, w, h);
      drawAxes(ctx, w, h, map, 't', 'y(t)');

      const p = parseFloat(pSlider.value);
      const q = parseFloat(qSlider.value);
      const yEq = q / p;

      // Steady state asymptote y_p = q/p
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(0, map.toY(yEq));
      ctx.lineTo(w, map.toY(yEq));
      ctx.stroke();
      ctx.setLineDash([]);

      // Family of solutions y(t) = q/p + C*e^(-p*t)
      [-2.0, -0.8, 0.5, 2.2, 3.4].forEach((y0, idx) => {
        const C = y0 - yEq;
        ctx.strokeStyle = idx === 4 ? '#2dd4bf' : 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = idx === 4 ? 2.8 : 1.6;
        ctx.beginPath();
        for (let t = 0; t <= 5; t += 0.04) {
          const y = yEq + C * Math.exp(-p * t);
          if (t === 0) ctx.moveTo(map.toX(t), map.toY(y));
          else ctx.lineTo(map.toX(t), map.toY(y));
        }
        ctx.stroke();
      });

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText(`Equilíbrio Particular y_p = q/p = ${yEq.toFixed(2)}`, 14, 22);
      status.textContent = `μ(t) = e^(${p.toFixed(1)}t)  ⇒  y(t) = ${yEq.toFixed(2)} + C·e^(-${p.toFixed(1)}t)`;
    }

    pSlider.addEventListener('input', draw);
    qSlider.addEventListener('input', draw);
    draw();
  })();

  // ==========================================================================
  // TOPIC 8: Bernoulli (Substituição v = y^(1-n))
  // ==========================================================================
  (() => {
    const canvas = document.getElementById('canvas-t8');
    const ctx = canvas.getContext('2d');
    const nSlider = document.getElementById('t8-n');
    const y0Slider = document.getElementById('t8-y0');
    const status = document.getElementById('t8-status');
    const w = canvas.width, h = canvas.height;
    const map = createMapper(w, h, 0, 4.5, 0, 2.5);

    function draw() {
      ctx.clearRect(0, 0, w, h);
      drawAxes(ctx, w, h, map, 't', 'y(t) e v(t)');

      const n = parseInt(nSlider.value, 10);
      const y0 = parseFloat(y0Slider.value);
      const v0 = Math.pow(y0, 1 - n);

      // ODE: y' - y = -y^n => Linearized for v = y^(1-n): v' + (n-1)v = (n-1)
      // Solution for v(t): v(t) = 1 + (v0 - 1)*e^(-(n-1)t)
      // Solution for y(t): y(t) = v(t)^(1/(1-n))

      // Plot v(t) (Linearized variable)
      ctx.strokeStyle = '#2dd4bf';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      for (let t = 0; t <= 4.5; t += 0.04) {
        const v = 1 + (v0 - 1) * Math.exp(-(n - 1) * t);
        if (t === 0) ctx.moveTo(map.toX(t), map.toY(Math.min(v, 2.45)));
        else ctx.lineTo(map.toX(t), map.toY(Math.min(v, 2.45)));
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Plot y(t) (Actual Bernoulli Curve)
      ctx.strokeStyle = '#bef264';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let t = 0; t <= 4.5; t += 0.04) {
        const v = 1 + (v0 - 1) * Math.exp(-(n - 1) * t);
        const y = Math.pow(Math.max(v, 0.01), 1 / (1 - n));
        if (t === 0) ctx.moveTo(map.toX(t), map.toY(y));
        else ctx.lineTo(map.toX(t), map.toY(y));
      }
      ctx.stroke();

      ctx.fillStyle = '#bef264';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText('Verde Sólida: y(t) (Bernoulli)', 14, 22);
      ctx.fillStyle = '#2dd4bf';
      ctx.fillText(`Azul Tracejada: v(t) = y^(${1 - n}) (Linearizada!)`, 14, 38);

      status.textContent = `Expoente n = ${n}  ⇒  Substituição v = y^(1-${n}) = y^(${1 - n}) transforma em EDO Linear!`;
    }

    nSlider.addEventListener('input', draw);
    y0Slider.addEventListener('input', draw);
    draw();
  })();

  // ==========================================================================
  // TOPIC 9: Equação de Segunda Ordem (PVI: Posição y(0) e Inclinação y'(0))
  // ==========================================================================
  (() => {
    const canvas = document.getElementById('canvas-t9');
    const ctx = canvas.getContext('2d');
    const y0Slider = document.getElementById('t9-y0');
    const v0Slider = document.getElementById('t9-v0');
    const status = document.getElementById('t9-status');
    const w = canvas.width, h = canvas.height;
    const map = createMapper(w, h, 0, 6.28, -3.2, 3.2);

    function draw() {
      ctx.clearRect(0, 0, w, h);
      drawAxes(ctx, w, h, map, 't', 'y(t)');

      const y0 = parseFloat(y0Slider.value);
      const v0 = parseFloat(v0Slider.value);

      // Ghost curves with same y(0) = y0 but different initial slopes v0
      [-2.5, -1.2, 0, 1.2, 2.5].forEach(ghostV => {
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.22)';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        for (let t = 0; t <= 6.28; t += 0.04) {
          const y = y0 * Math.cos(t) + ghostV * Math.sin(t);
          if (t === 0) ctx.moveTo(map.toX(t), map.toY(y));
          else ctx.lineTo(map.toX(t), map.toY(y));
        }
        ctx.stroke();
      });

      // Active curve: y(t) = y0*cos(t) + v0*sin(t)
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let t = 0; t <= 6.28; t += 0.04) {
        const y = y0 * Math.cos(t) + v0 * Math.sin(t);
        if (t === 0) ctx.moveTo(map.toX(t), map.toY(y));
        else ctx.lineTo(map.toX(t), map.toY(y));
      }
      ctx.stroke();

      // Initial velocity arrow at t = 0
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(map.toX(0), map.toY(y0));
      ctx.lineTo(map.toX(0.8), map.toY(y0 + 0.8 * v0));
      ctx.stroke();

      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(map.toX(0), map.toY(y0), 6, 0, Math.PI * 2);
      ctx.fill();

      status.textContent = `y(0) = ${y0.toFixed(1)}, y'(0) = ${v0.toFixed(1)}  ⇒  y(t) = ${y0.toFixed(1)}·cos(t) + ${v0.toFixed(1)}·sen(t)`;
    }

    y0Slider.addEventListener('input', draw);
    v0Slider.addEventListener('input', draw);
    draw();
  })();

  // ==========================================================================
  // TOPIC 10: Homogêneas com Coeficientes Constantes (3 casos de Δ)
  // ==========================================================================
  (() => {
    const canvas = document.getElementById('canvas-t10');
    const ctx = canvas.getContext('2d');
    const btns = document.querySelectorAll('[data-t10]');
    const status = document.getElementById('t10-status');
    const w = canvas.width, h = canvas.height;

    let mode = 'under';

    function draw() {
      ctx.clearRect(0, 0, w, h);

      // Left Panel (width 145px): Complex Plane of Roots r1, r2
      const cpW = 140;
      ctx.fillStyle = '#0b1120';
      ctx.fillRect(0, 0, cpW, h);
      ctx.strokeStyle = '#1e293b';
      ctx.strokeRect(0, 0, cpW, h);

      // Complex plane axes
      const cx = 85, cy = h / 2;
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(10, cy); ctx.lineTo(cpW - 10, cy);
      ctx.moveTo(cx, 15); ctx.lineTo(cx, h - 15);
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 10px Inter, sans-serif';
      ctx.fillText('Re(r)', cpW - 32, cy - 5);
      ctx.fillText('Im(r)', cx + 5, 22);

      // Right Panel: Time response y_h(t)
      const map = {
        toX: t => cpW + 15 + (t / 7) * (w - cpW - 25),
        toY: y => h / 2 - (y / 1.4) * (h / 2 - 20)
      };

      ctx.strokeStyle = '#334155';
      ctx.beginPath();
      ctx.moveTo(map.toX(0), map.toY(0));
      ctx.lineTo(map.toX(7), map.toY(0));
      ctx.stroke();

      if (mode === 'over') {
        // Δ > 0: r1 = -0.4, r2 = -1.8
        ctx.fillStyle = '#2dd4bf';
        ctx.beginPath(); ctx.arc(cx - 18, cy, 5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx - 55, cy, 5, 0, Math.PI * 2); ctx.fill();

        ctx.strokeStyle = '#2dd4bf';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let t = 0; t <= 7; t += 0.05) {
          const y = 1.5 * Math.exp(-0.5 * t) - 0.5 * Math.exp(-2.0 * t);
          if (t === 0) ctx.moveTo(map.toX(t), map.toY(y));
          else ctx.lineTo(map.toX(t), map.toY(y));
        }
        ctx.stroke();
        status.textContent = 'Δ > 0 (2 Raízes Reais r₁ ≠ r₂): y_h = c₁e^(r₁t) + c₂e^(r₂t) — Decai sem oscilar!';
      } else if (mode === 'crit') {
        // Δ = 0: r1 = r2 = -0.8 (Double root -> t*e^(rt))
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath(); ctx.arc(cx - 34, cy, 7, 0, Math.PI * 2); ctx.fill();

        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let t = 0; t <= 7; t += 0.05) {
          const y = (1 + 1.8 * t) * Math.exp(-0.9 * t);
          if (t === 0) ctx.moveTo(map.toX(t), map.toY(y));
          else ctx.lineTo(map.toX(t), map.toY(y));
        }
        ctx.stroke();
        status.textContent = 'Δ = 0 (Raiz Dupla r₁ = r₂): y_h = c₁e^(rt) + c₂·t·e^(rt) — Multiplicamos a 2ª por t!';
      } else {
        // Δ < 0: r = -0.35 ± 3i
        ctx.fillStyle = '#bef264';
        ctx.beginPath(); ctx.arc(cx - 20, cy - 55, 5.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx - 20, cy + 55, 5.5, 0, Math.PI * 2); ctx.fill();

        // Envelope ±e^(-0.35t)
        ctx.strokeStyle = 'rgba(52, 211, 153, 0.35)';
        ctx.setLineDash([4, 4]);
        [1, -1].forEach(sign => {
          ctx.beginPath();
          for (let t = 0; t <= 7; t += 0.05) {
            const env = sign * 1.15 * Math.exp(-0.35 * t);
            if (t === 0) ctx.moveTo(map.toX(t), map.toY(env));
            else ctx.lineTo(map.toX(t), map.toY(env));
          }
          ctx.stroke();
        });
        ctx.setLineDash([]);

        ctx.strokeStyle = '#bef264';
        ctx.lineWidth = 2.8;
        ctx.beginPath();
        for (let t = 0; t <= 7; t += 0.03) {
          const y = 1.15 * Math.exp(-0.35 * t) * Math.cos(3.2 * t);
          if (t === 0) ctx.moveTo(map.toX(t), map.toY(y));
          else ctx.lineTo(map.toX(t), map.toY(y));
        }
        ctx.stroke();
        status.textContent = 'Δ < 0 (Complexas α ± iβ): y_h = e^(αt)[c₁cos(βt) + c₂sen(βt)] — Oscila dentro do envelope!';
      }
    }

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        mode = btn.getAttribute('data-t10');
        draw();
      });
    });
    draw();
  })();

  // ==========================================================================
  // TOPIC 11: Coeficientes Indeterminados (Chute & Ressonância)
  // ==========================================================================
  (() => {
    const canvas = document.getElementById('canvas-t11');
    const ctx = canvas.getContext('2d');
    const btns = document.querySelectorAll('[data-t11]');
    const status = document.getElementById('t11-status');
    const w = canvas.width, h = canvas.height;
    const map = createMapper(w, h, 0, 10, -3.2, 3.2);

    let mode = 'cos';

    function draw() {
      ctx.clearRect(0, 0, w, h);
      drawAxes(ctx, w, h, map, 't', 'y_p(t)');

      if (mode === 'cos') {
        // Normal forced oscillation
        ctx.strokeStyle = '#2dd4bf';
        ctx.lineWidth = 2.8;
        ctx.beginPath();
        for (let t = 0; t <= 10; t += 0.04) {
          const y = 1.4 * Math.cos(2.2 * t);
          if (t === 0) ctx.moveTo(map.toX(t), map.toY(y));
          else ctx.lineTo(map.toX(t), map.toY(y));
        }
        ctx.stroke();
        status.textContent = 'Sem colisão com y_h: Chute y_p = A·cos(ωt) + B·sen(ωt) mantém amplitude constante!';
      } else if (mode === 'res') {
        // Resonance collision: y_p = 0.3 * t * sin(2.5*t)
        ctx.strokeStyle = 'rgba(251, 113, 133, 0.4)';
        ctx.setLineDash([4, 4]);
        [1, -1].forEach(s => {
          ctx.beginPath();
          ctx.moveTo(map.toX(0), map.toY(0));
          ctx.lineTo(map.toX(10), map.toY(s * 3.0));
          ctx.stroke();
        });
        ctx.setLineDash([]);

        ctx.strokeStyle = '#ff6b4a';
        ctx.lineWidth = 2.8;
        ctx.beginPath();
        for (let t = 0; t <= 10; t += 0.03) {
          const y = 0.3 * t * Math.sin(3.0 * t);
          if (t === 0) ctx.moveTo(map.toX(t), map.toY(y));
          else ctx.lineTo(map.toX(t), map.toY(y));
        }
        ctx.stroke();
        status.textContent = '⚡ COLISÃO COM y_h! Multiplicamos o chute por t: y_p = t·(A cos ωt + B sen ωt). Amplitude cresce!';
      } else {
        // Polynomial forcing + transient
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2.8;
        ctx.beginPath();
        for (let t = 0; t <= 10; t += 0.04) {
          const yp = 0.25 * t - 0.5;
          const y = yp + 1.2 * Math.exp(-0.4 * t) * Math.cos(2.5 * t);
          if (t === 0) ctx.moveTo(map.toX(t), map.toY(y));
          else ctx.lineTo(map.toX(t), map.toY(y));
        }
        ctx.stroke();
        status.textContent = 'Para g(t) polinomial (grau 1): Chute y_p = At + B serve como rampa guia da solução!';
      }
    }

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        mode = btn.getAttribute('data-t11');
        draw();
      });
    });
    draw();
  })();

  // ==========================================================================
  // TOPIC 12: Variação de Parâmetros (y'' + y = sec(t))
  // ==========================================================================
  (() => {
    const canvas = document.getElementById('canvas-t12');
    const ctx = canvas.getContext('2d');
    const tSlider = document.getElementById('t12-t');
    const status = document.getElementById('t12-status');
    const w = canvas.width, h = canvas.height;
    const map = createMapper(w, h, -1.45, 1.45, -1.8, 2.2);

    function draw() {
      ctx.clearRect(0, 0, w, h);
      drawAxes(ctx, w, h, map, 't', 'y_p(t)');

      // Vertical asymptotes of sec(t) at ±pi/2 ≈ ±1.57
      ctx.strokeStyle = 'rgba(251, 113, 133, 0.45)';
      ctx.setLineDash([4, 4]);
      [-1.38, 1.38].forEach(asympt => {
        ctx.beginPath();
        ctx.moveTo(map.toX(asympt), 0);
        ctx.lineTo(map.toX(asympt), h);
        ctx.stroke();
      });
      ctx.setLineDash([]);

      // Forcing g(t) = sec(t) (faint rose)
      ctx.strokeStyle = 'rgba(251, 113, 133, 0.4)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      for (let t = -1.3; t <= 1.3; t += 0.02) {
        const g = 1 / Math.cos(t);
        if (t === -1.3) ctx.moveTo(map.toX(t), map.toY(g));
        else ctx.lineTo(map.toX(t), map.toY(g));
      }
      ctx.stroke();

      // Particular solution y_p(t) = cos(t)*ln(cos(t)) + t*sin(t)
      const ypFn = t => Math.cos(t) * Math.log(Math.cos(t)) + t * Math.sin(t);
      ctx.strokeStyle = '#bef264';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let t = -1.32; t <= 1.32; t += 0.02) {
        const y = ypFn(t);
        if (t === -1.32) ctx.moveTo(map.toX(t), map.toY(y));
        else ctx.lineTo(map.toX(t), map.toY(y));
      }
      ctx.stroke();

      const t0 = parseFloat(tSlider.value);
      const u1 = Math.log(Math.cos(t0));
      const u2 = t0;
      const yp0 = ypFn(t0);

      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(map.toX(t0), map.toY(yp0), 6, 0, Math.PI * 2);
      ctx.fill();

      status.textContent = `Em t = ${t0.toFixed(2)}: u₁(t) = ${u1.toFixed(2)}, u₂(t) = ${u2.toFixed(2)}  ⇒  y_p(t) = ${yp0.toFixed(2)}`;
    }

    tSlider.addEventListener('input', draw);
    draw();
  })();

  // ==========================================================================
  // TOPIC 13: Modelagem: Sistema Massa-Mola e Circuito RLC (Animated!)
  // ==========================================================================
  (() => {
    const canvas = document.getElementById('canvas-t13');
    const ctx = canvas.getContext('2d');
    const dampSlider = document.getElementById('t13-damp');
    const kSlider = document.getElementById('t13-k');
    const status = document.getElementById('t13-status');
    const w = canvas.width, h = canvas.height;

    let animTime = 0;

    function getDisplacement(t, gamma, k) {
      // m = 1, x'' + gamma*x' + k*x = 0, x(0) = 1, x'(0) = 0
      const delta = gamma * gamma - 4 * k;
      if (delta < -0.001) {
        const alpha = -gamma / 2;
        const beta = Math.sqrt(-delta) / 2;
        return Math.exp(alpha * t) * (Math.cos(beta * t) - (alpha / beta) * Math.sin(beta * t));
      } else if (Math.abs(delta) <= 0.001) {
        const r = -gamma / 2;
        return (1 - r * t) * Math.exp(r * t);
      } else {
        const r1 = (-gamma + Math.sqrt(delta)) / 2;
        const r2 = (-gamma - Math.sqrt(delta)) / 2;
        const c1 = r2 / (r2 - r1);
        const c2 = -r1 / (r2 - r1);
        return c1 * Math.exp(r1 * t) + c2 * Math.exp(r2 * t);
      }
    }

    function animate() {
      ctx.clearRect(0, 0, w, h);
      const gamma = parseFloat(dampSlider.value);
      const k = parseFloat(kSlider.value);
      const delta = gamma * gamma - 4 * k;

      animTime = (animTime + 0.04) % 8.5;
      const xNow = getDisplacement(animTime, gamma, k);

      // 1. Left Box: Physical Spring-Mass System
      const springX = 55;
      const ceilingY = 20;
      const massY = 115 - xNow * 52;

      // Ceiling
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(25, ceilingY); ctx.lineTo(85, ceilingY); ctx.stroke();

      // Spring coils
      ctx.strokeStyle = '#2dd4bf';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(springX, ceilingY);
      const coils = 9;
      for (let i = 1; i <= coils; i++) {
        const py = ceilingY + ((massY - 18 - ceilingY) * i) / (coils + 1);
        const offset = (i % 2 === 0 ? -12 : 12);
        ctx.lineTo(springX + offset, py);
      }
      ctx.lineTo(springX, massY - 18);
      ctx.stroke();

      // Mass block
      ctx.fillStyle = '#2dd4bf';
      ctx.fillRect(springX - 22, massY - 18, 44, 36);
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText('m / L', springX - 14, massY + 4);

      // 2. Right Panel: Wave Plot x(t) = q(t)
      const plotX0 = 125, plotW = w - 140;
      const midY = 115;

      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(plotX0, midY); ctx.lineTo(plotX0 + plotW, midY); ctx.stroke();

      ctx.strokeStyle = '#bef264';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      for (let t = 0; t <= 8.5; t += 0.05) {
        const px = plotX0 + (t / 8.5) * plotW;
        const py = midY - getDisplacement(t, gamma, k) * 52;
        if (t === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Current time marker dot linked to mass
      const curPx = plotX0 + (animTime / 8.5) * plotW;
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(springX + 22, massY); ctx.lineTo(curPx, massY); ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#fbbf24';
      ctx.beginPath(); ctx.arc(curPx, massY, 5.5, 0, Math.PI * 2); ctx.fill();

      // Regime label
      let regime = 'Subamortecido (Δ < 0 — Oscila)';
      if (Math.abs(delta) <= 0.1) regime = 'Criticamente Amortecido (Δ = 0)';
      else if (delta > 0.1) regime = 'Superamortecido (Δ > 0 — Não oscila)';
      else if (gamma === 0) regime = 'Harmônico Simples (Sem perdas: γ = R = 0)';

      status.textContent = `${regime} | Δ = b²-4ac = ${delta.toFixed(2)}`;
      requestAnimationFrame(animate);
    }

    animate();
  })();

  // ==========================================================================
  // TOPIC 14: Crescimento e Decaimento (dP/dt = kP)
  // ==========================================================================
  (() => {
    const canvas = document.getElementById('canvas-t14');
    const ctx = canvas.getContext('2d');
    const kSlider = document.getElementById('t14-k');
    const p0Slider = document.getElementById('t14-p0');
    const status = document.getElementById('t14-status');
    const w = canvas.width, h = canvas.height;
    const map = createMapper(w, h, 0, 6, 0, 100);

    function draw() {
      ctx.clearRect(0, 0, w, h);
      drawAxes(ctx, w, h, map, 't', 'P(t)');

      const k = parseFloat(kSlider.value);
      const P0 = parseFloat(p0Slider.value);

      // Exponential curve P(t) = P0 * e^(k*t)
      const curveColor = k >= 0 ? '#bef264' : '#ff6b4a';
      ctx.strokeStyle = curveColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let t = 0; t <= 6; t += 0.04) {
        const P = P0 * Math.exp(k * t);
        if (t === 0) ctx.moveTo(map.toX(t), map.toY(Math.min(P, 98)));
        else ctx.lineTo(map.toX(t), map.toY(Math.min(P, 98)));
      }
      ctx.stroke();

      // Initial point (0, P0)
      ctx.fillStyle = '#2dd4bf';
      ctx.beginPath();
      ctx.arc(map.toX(0), map.toY(P0), 5.5, 0, Math.PI * 2);
      ctx.fill();

      if (Math.abs(k) > 0.02) {
        const tChar = Math.log(2) / Math.abs(k);
        const pTarget = k > 0 ? P0 * 2 : P0 * 0.5;

        if (tChar <= 6 && pTarget <= 98) {
          ctx.strokeStyle = '#fbbf24';
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(map.toX(tChar), map.toY(0));
          ctx.lineTo(map.toX(tChar), map.toY(pTarget));
          ctx.lineTo(map.toX(0), map.toY(pTarget));
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(map.toX(tChar), map.toY(pTarget), 6, 0, Math.PI * 2);
          ctx.fill();
        }

        if (k > 0) {
          status.textContent = `Crescimento (k = +${k.toFixed(2)}): P(t) = ${P0}·e^(${k.toFixed(2)}t) | Tempo de Duplicação T_dup = ln(2)/k = ${tChar.toFixed(2)}`;
        } else {
          status.textContent = `Decaimento (k = ${k.toFixed(2)}): P(t) = ${P0}·e^(${k.toFixed(2)}t) | Meia-Vida T_1/2 = ln(2)/|k| = ${tChar.toFixed(2)}`;
        }
      } else {
        status.textContent = `k = 0.00 (População Constante): dP/dt = 0  ⇒  P(t) = ${P0}`;
      }
    }

    kSlider.addEventListener('input', draw);
    p0Slider.addEventListener('input', draw);
    draw();
  })();

  // ==========================================================================
  // Edge TTS (pt-BR-ThalitaNeural) Hybrid Instant Audio & Speech Assistant
  // ==========================================================================
  (() => {
    const ttsToggle = document.getElementById('ttsToggle');
    const ttsCheckbox = document.getElementById('ttsCheckbox');
    const sidebarTtsCard = document.getElementById('sidebarTtsCard');
    const sidebarVoiceBadge = document.getElementById('sidebarVoiceBadge');
    const sidebarVoiceName = document.getElementById('sidebarVoiceName');
    const ttsSpeedSelect = document.getElementById('ttsSpeedSelect');
    const ttsDockSpeedSelect = document.getElementById('ttsDockSpeedSelect');
    const ttsFloatingDock = document.getElementById('ttsFloatingDock');
    const ttsDockTitle = document.getElementById('ttsDockTitle');
    const ttsDockSub = document.getElementById('ttsDockSub');
    const ttsStopBtn = document.getElementById('ttsStopBtn');
    const ttsCloseBtn = document.getElementById('ttsCloseBtn');

    let isTtsActive = false;
    let currentSpeed = 1.0;
    let cachedVoiceInfo = null;
    let currentController = null;
    let currentHighlightedEl = null;

    // Single reusable HTML5 Audio instance for zero-latency MP3 playback
    const audioPlayer = new Audio();

    // 1. Voice Speed Control (Synced across sidebar card and dock)
    function setSpeed(speedVal) {
      currentSpeed = parseFloat(speedVal) || 1.0;
      if (ttsSpeedSelect) ttsSpeedSelect.value = String(currentSpeed);
      if (ttsDockSpeedSelect) ttsDockSpeedSelect.value = String(currentSpeed);
      if (audioPlayer) audioPlayer.playbackRate = currentSpeed;
      try {
        localStorage.setItem('iedo_tts_speed', String(currentSpeed));
      } catch (err) {}
    }

    // Restore saved speed
    try {
      const savedSpeed = localStorage.getItem('iedo_tts_speed');
      if (savedSpeed) setSpeed(savedSpeed);
    } catch (err) {}

    if (ttsSpeedSelect) {
      ttsSpeedSelect.addEventListener('change', (e) => setSpeed(e.target.value));
    }
    if (ttsDockSpeedSelect) {
      ttsDockSpeedSelect.addEventListener('change', (e) => setSpeed(e.target.value));
    }

    // Audio Player Events
    audioPlayer.addEventListener('play', () => {
      if (ttsFloatingDock) ttsFloatingDock.classList.add('speaking');
      if (ttsStopBtn) ttsStopBtn.disabled = false;
    });

    audioPlayer.addEventListener('ended', () => {
      onPlaybackEnded();
    });

    audioPlayer.addEventListener('pause', () => {
      if (audioPlayer.currentTime >= audioPlayer.duration) {
        onPlaybackEnded();
      }
    });

    // 2. Web Speech API Voice Resolution (Fallback for custom selected text)
    function resolveVoice() {
      if (!('speechSynthesis' in window)) return null;
      const voices = window.speechSynthesis.getVoices() || [];
      if (voices.length === 0) return null;

      // Priority 1: Thalita Neural
      const thalita = voices.find(v => {
        const name = (v.name || '').toLowerCase();
        const uri = (v.voiceURI || '').toLowerCase();
        return name.includes('thalita') || uri.includes('thalita') || uri.includes('pt-br-thalitaneural');
      });
      if (thalita) return { voice: thalita, label: 'Thalita Neural (pt-BR)', isThalita: true };

      // Priority 2: High quality pt-BR natural / neural voices
      const msNatural = voices.find(v => {
        const name = (v.name || '').toLowerCase();
        const lang = (v.lang || '').replace('_', '-').toLowerCase();
        return lang.startsWith('pt') && (name.includes('natural') || name.includes('online') || name.includes('neural') || name.includes('francisca') || name.includes('antonio'));
      });
      if (msNatural) return { voice: msNatural, label: `${msNatural.name.slice(0, 18)} (pt-BR)`, isThalita: false };

      // Priority 3: Any pt-BR voice
      const ptBr = voices.find(v => {
        const lang = (v.lang || '').replace('_', '-').toLowerCase();
        return lang === 'pt-br';
      });
      if (ptBr) return { voice: ptBr, label: `${ptBr.name.replace(/Google/i, '').trim().slice(0, 18)} (pt-BR)`, isThalita: false };

      // Priority 4: Any Portuguese voice (pt)
      const ptAny = voices.find(v => {
        const lang = (v.lang || '').replace('_', '-').toLowerCase();
        return lang.startsWith('pt');
      });
      if (ptAny) return { voice: ptAny, label: `${ptAny.name.replace(/Google/i, '').trim().slice(0, 18)} (pt)`, isThalita: false };

      // CRITICAL: NEVER fallback to voices[0] which could be Spanish (es), French (fr), etc.!
      // By returning voice: null, utterance.voice remains unset and the browser utilizes its default pt-BR handler.
      return { voice: null, label: 'Padrão (pt-BR)', isThalita: false };
    }

    function updateVoiceUI() {
      cachedVoiceInfo = resolveVoice();
      if (sidebarVoiceName) {
        sidebarVoiceName.textContent = 'Thalita Neural (Instantâneo)';
      }
      if (sidebarVoiceBadge) {
        sidebarVoiceBadge.title = 'Áudio pré-carregado em MP3 com a voz neural Thalita do Edge TTS (0ms de espera!)';
        sidebarVoiceBadge.style.borderColor = 'var(--accent-mint)';
        sidebarVoiceBadge.style.color = 'var(--accent-mint)';
      }
      if (ttsDockSub && !ttsFloatingDock.classList.contains('speaking')) {
        ttsDockSub.textContent = `Clique em qualquer texto para ouvir (Thalita Neural · ${currentSpeed}x)`;
      }
    }

    updateVoiceUI();
    if ('speechSynthesis' in window && window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoiceUI;
    }

    // 3. Mathematical text cleaner for SpeechSynthesis fallback
    function sanitizeForSpeech(raw) {
      if (!raw) return '';
      return raw
        .replace(/\\frac\{dy\}\{dt\}|dy\/dt/gi, ' derivada de y sobre d t ')
        .replace(/\\frac\{dP\}\{dt\}|dP\/dt/gi, ' derivada de P sobre d t ')
        .replace(/\\frac\{\\partial M\}\{\\partial y\}|M_y\b/gi, ' derivada parcial de M em relação a y ')
        .replace(/\\frac\{\\partial N\}\{\\partial t\}|N_t\b/gi, ' derivada parcial de N em relação a t ')
        .replace(/\\tilde\{M\}_y|M̃_y/gi, ' M til y ')
        .replace(/\\tilde\{N\}_t|Ñ_t/gi, ' N til t ')
        .replace(/\\frac\{\\partial f\}\{\\partial y\}|\\partial f\/\\partial y/gi, ' derivada parcial de f em relação a y ')
        .replace(/\\sum\s*F/gi, ' soma das forças ')
        .replace(/W\(y_1,\s*y_2\)/gi, ' Wronskiano de y um e y dois ')
        .replace(/y_1'|y_1\x27/gi, ' y um linha ')
        .replace(/y_2'|y_2\x27/gi, ' y dois linha ')
        .replace(/y'''/g, ' y três linhas ')
        .replace(/y''/g, ' y duas linhas ')
        .replace(/y'/g, ' y linha ')
        .replace(/x''/g, ' x duas linhas ')
        .replace(/x'/g, ' x linha ')
        .replace(/q''/g, ' q duas linhas ')
        .replace(/q'/g, ' q linha ')
        .replace(/y_p/gi, ' y particular ')
        .replace(/y_h/gi, ' y homogênea ')
        .replace(/y_0|y\(0\)/gi, ' y no instante zero ')
        .replace(/y'\(0\)|y'\s*\(0\)/gi, ' y linha no instante zero ')
        .replace(/PVI/g, ' P V I ')
        .replace(/TEU/g, ' T E U ')
        .replace(/EDOs/gi, ' E D Ós ')
        .replace(/EDO/gi, ' E D O ')
        .replace(/RLC/gi, ' R L C ')
        .replace(/\\implies|⇒|⟹/g, ' implica em ')
        .replace(/\\approx|≈/g, ' aproximadamente ')
        .replace(/\\neq|≠/g, ' diferente de ')
        .replace(/\\leq|≤/g, ' menor ou igual a ')
        .replace(/\\geq|≥/g, ' maior ou igual a ')
        .replace(/>\s*0/g, ' maior que zero ')
        .replace(/<\s*0/g, ' menor que zero ')
        .replace(/\\pm|±/g, ' mais ou menos ')
        .replace(/\\cdot|·/g, ' vezes ')
        .replace(/\\Delta|Δ/g, ' delta ')
        .replace(/\\lambda|λ/g, ' lambda ')
        .replace(/\\omega_0|ω_0/g, ' ômega zero ')
        .replace(/\\omega|ω/g, ' ômega ')
        .replace(/\\gamma|γ/g, ' gama ')
        .replace(/\\alpha|α/g, ' alfa ')
        .replace(/\\beta|β/g, ' beta ')
        .replace(/\\mu|μ/g, ' mi ')
        .replace(/\\Psi|Ψ/g, ' psi ')
        .replace(/\\Phi|Φ/g, ' fi ')
        .replace(/e\^/g, ' e elevado a ')
        .replace(/\^2/g, ' ao quadrado ')
        .replace(/\^3/g, ' ao cubo ')
        .replace(/T_\{1\/2\}|T_1\/2/g, ' meia-vida ')
        .replace(/T_dup|T_\{dup\}/g, ' tempo de duplicação ')
        .replace(/\s+/g, ' ')
        .trim();
    }

    function extractTextFromElement(el) {
      if (!el) return '';
      const clone = el.cloneNode(true);
      clone.querySelectorAll('.katex-mathml').forEach(m => m.remove());
      clone.querySelectorAll('button, input, select, canvas, script, style, .sidebar, .tts-floating-dock, .mobile-toggle, .back-to-top').forEach(m => m.remove());
      return sanitizeForSpeech(clone.innerText || clone.textContent || '');
    }

    // 4. Play Preloaded MP3 Audio (Instant zero-wait)
    function playPreloadedAudio(audioKey, element) {
      stopAllAudio();
      setHighlight(element);

      const audioSrc = `audio/${audioKey}.mp3`;
      audioPlayer.src = audioSrc;
      audioPlayer.playbackRate = currentSpeed;

      if (ttsDockTitle) {
        const preview = element.innerText ? element.innerText.trim().slice(0, 40) : audioKey;
        ttsDockTitle.textContent = `Ouvindo: "${preview}..."`;
      }
      if (ttsDockSub) {
        ttsDockSub.textContent = `Voz: Thalita Neural (Áudio Instantâneo · ${currentSpeed}x)`;
      }

      const playPromise = audioPlayer.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn(`Audio ${audioSrc} failed, falling back to Web Speech API:`, err);
          const fallbackText = extractTextFromElement(element);
          playSpeechFallback(fallbackText);
        });
      }
    }

    // 5. SpeechSynthesis Fallback (for custom text selections)
    function playSpeechFallback(text) {
      if (!('speechSynthesis' in window) || !text || text.length < 2) return;
      window.speechSynthesis.cancel();

      const sentences = text.match(/[^.!?;\n]+[.!?;\n]+|[^.!?;\n]+$/g) || [text];
      const chunks = [];
      for (let s of sentences) {
        s = s.trim();
        if (!s) continue;
        if (s.length > 180) {
          const parts = s.split(/,\s+/);
          let buf = '';
          for (const p of parts) {
            if ((buf + ', ' + p).length < 160) {
              buf = buf ? buf + ', ' + p : p;
            } else {
              if (buf) chunks.push(buf);
              buf = p;
            }
          }
          if (buf) chunks.push(buf);
        } else {
          chunks.push(s);
        }
      }

      if (chunks.length === 0) return;

      let chunkIdx = 0;
      let aborted = false;

      function speakNextChunk() {
        if (aborted || chunkIdx >= chunks.length) {
          onPlaybackEnded();
          return;
        }

        const utterance = new SpeechSynthesisUtterance(chunks[chunkIdx]);
        const voiceObj = (cachedVoiceInfo && cachedVoiceInfo.voice) ? cachedVoiceInfo : resolveVoice();
        if (voiceObj && voiceObj.voice) {
          utterance.voice = voiceObj.voice;
        }
        utterance.lang = 'pt-BR';
        utterance.rate = currentSpeed;
        utterance.pitch = 1.0;

        utterance.onstart = () => {
          if (chunkIdx === 0) {
            if (ttsFloatingDock) ttsFloatingDock.classList.add('speaking');
            if (ttsStopBtn) ttsStopBtn.disabled = false;
          }
        };

        utterance.onend = () => {
          chunkIdx++;
          speakNextChunk();
        };

        utterance.onerror = (e) => {
          if (e.error === 'interrupted' || e.error === 'canceled') return;
          onPlaybackEnded();
        };

        window.speechSynthesis.speak(utterance);
      }

      speakNextChunk();

      currentController = {
        abort: () => {
          aborted = true;
          window.speechSynthesis.cancel();
          onPlaybackEnded();
        }
      };
    }

    function setHighlight(el) {
      if (currentHighlightedEl) {
        currentHighlightedEl.classList.remove('tts-reading-highlight');
      }
      currentHighlightedEl = el;
      if (currentHighlightedEl) {
        currentHighlightedEl.classList.add('tts-reading-highlight');
      }
    }

    function onPlaybackEnded() {
      if (ttsFloatingDock) ttsFloatingDock.classList.remove('speaking');
      if (ttsStopBtn) ttsStopBtn.disabled = true;
      if (currentHighlightedEl) {
        currentHighlightedEl.classList.remove('tts-reading-highlight');
        currentHighlightedEl = null;
      }
      if (ttsDockTitle) ttsDockTitle.textContent = 'Leitor por Clique Ativo';
      if (ttsDockSub) {
        ttsDockSub.textContent = `Clique em qualquer texto para ouvir (Thalita Neural · ${currentSpeed}x)`;
      }
    }

    function stopAllAudio() {
      if (audioPlayer) {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
      }
      if (currentController) {
        currentController.abort();
        currentController = null;
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      onPlaybackEnded();
    }

    // 6. Toggle State Management
    function setTtsState(enabled) {
      isTtsActive = Boolean(enabled);
      document.body.classList.toggle('tts-active', isTtsActive);

      if (ttsCheckbox) ttsCheckbox.checked = isTtsActive;
      if (sidebarTtsCard) sidebarTtsCard.classList.toggle('active', isTtsActive);
      if (ttsToggle) {
        ttsToggle.classList.toggle('active', isTtsActive);
        const label = ttsToggle.querySelector('.tts-btn-label');
        if (label) label.textContent = isTtsActive ? 'Voz: ON' : 'Voz: OFF';
      }
      if (ttsFloatingDock) {
        ttsFloatingDock.classList.toggle('visible', isTtsActive);
      }

      if (!isTtsActive) {
        stopAllAudio();
      } else {
        updateVoiceUI();
      }

      try {
        localStorage.setItem('iedo_tts_active', isTtsActive ? '1' : '0');
      } catch (err) {}
    }

    if (ttsToggle) {
      ttsToggle.addEventListener('click', () => setTtsState(!isTtsActive));
    }
    if (ttsCheckbox) {
      ttsCheckbox.addEventListener('change', (e) => setTtsState(e.target.checked));
    }
    if (ttsCloseBtn) {
      ttsCloseBtn.addEventListener('click', () => setTtsState(false));
    }
    if (ttsStopBtn) {
      ttsStopBtn.addEventListener('click', stopAllAudio);
    }
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isTtsActive) {
        stopAllAudio();
      }
    });

    // Restore saved user preference (defaults to off)
    try {
      if (localStorage.getItem('iedo_tts_active') === '1') {
        setTtsState(true);
      }
    } catch (err) {}

    // 7. Global Click Handler on ANY Text
    document.addEventListener('click', (e) => {
      if (!isTtsActive) return;

      // Ignore interactive controls, dock, canvas, sidebar navigation
      if (e.target.closest('button, input, select, canvas, .tts-floating-dock, #mobileMenuBtn, #themeToggle, .sidebar')) {
        return;
      }

      // 1. Manual user text selection prioritized
      const selection = window.getSelection ? window.getSelection().toString().trim() : '';
      if (selection && selection.length > 1) {
        stopAllAudio();
        const clean = sanitizeForSpeech(selection);
        if (ttsDockTitle) ttsDockTitle.textContent = `Lendo seleção: "${clean.slice(0, 36)}..."`;
        if (ttsDockSub) ttsDockSub.textContent = `Voz: Sintetizada (${currentSpeed}x)`;
        playSpeechFallback(clean);
        return;
      }

      // 2. Click on element with pre-rendered MP3 audio
      const audioTarget = e.target.closest('[data-audio]');
      if (audioTarget) {
        const audioKey = audioTarget.getAttribute('data-audio');
        if (audioKey) {
          playPreloadedAudio(audioKey, audioTarget);
          return;
        }
      }

      // 3. Fallback to nearest readable container via SpeechSynthesis
      const targetEl = e.target.closest('p, h1, h2, h3, h4, h5, h6, li, td, th, blockquote, .step-box, .case-application, .mini-example, .intro-use-item, .drone-spec-item, .intro-compare-card, .formula-box, .badge') || (e.target.innerText && e.target.innerText.trim().length > 0 ? e.target : null);

      if (!targetEl) return;
      const text = extractTextFromElement(targetEl);
      if (!text || text.length < 2) return;

      stopAllAudio();
      setHighlight(targetEl);
      if (ttsDockTitle) ttsDockTitle.textContent = `Lendo: "${text.slice(0, 36)}..."`;
      playSpeechFallback(text);
    });
  })();
});
