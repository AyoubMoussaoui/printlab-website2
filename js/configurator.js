/* ==========================================================================
   PRINT LAB Trier: Design-Konfigurator (section #gestalten)

   Privacy: everything runs in the browser. The uploaded file and the
   preview image are only sent when the visitor submits the request form
   (anfrage.php). Nothing is stored or uploaded before that.

   Structure
     1. CONFIG        products, colours, print areas, limits
     2. TEXT          German / English strings
     3. HELPERS       colour maths, formatting
     4. IMAGE TOOLS   decoding, white background removal, trimming
     5. RENDERER      draws garment, design and guides on a <canvas>
     6. CONFIGURATOR  state, controls, touch / mouse / keyboard
     7. REQUEST       drawer, validation, submission
   ========================================================================== */
(function () {
  'use strict';

  const root = document.querySelector('[data-configurator]');
  if (!root) return;

  /* ------------------------------------------------------------------------
     1. CONFIG
     Colours and products must match what PRINT LAB really offers.
     Print areas: rectangle in the 500 × 560 drawing [x, y, width, height]
     plus its real size in cm, used for the size label and the DPI check.
     ------------------------------------------------------------------------ */
  const CONFIG = {
    endpoint: 'anfrage.php',
    whatsapp: '4915901378917',
    email: 'info@printlab-trier.de',
    maxFileBytes: 15 * 1024 * 1024,
    minDpi: 150,
    rasterMaxPx: 2000,          // longest side kept in memory for the preview
    snapshot: { width: 1000, height: 1120 },
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    rasterTypes: ['png', 'jpg', 'jpeg', 'webp'],
    vectorTypes: ['svg'],
    printOnlyTypes: ['pdf', 'ai', 'eps'],  // accepted, kept for the request, not previewed
    colors: [
      { id: 'black', de: 'Deep Black', en: 'Deep Black', hex: '#1B1B1D' },
      { id: 'white', de: 'Weiß', en: 'White', hex: '#F7F6F3' },
      { id: 'grey', de: 'Heather Grey', en: 'Heather Grey', hex: '#A5A8AD' },
      { id: 'navy', de: 'Navy', en: 'Navy', hex: '#1E2943' }
    ],
    products: {
      tshirt: {
        de: 'T-Shirt', en: 'T-shirt', formValue: 'T-Shirts',
        positions: {
          center: { view: 'front', area: [188, 128, 124, 155], cm: [28, 35], scale: 0.78, anchor: 'top', de: 'Brust mittig', en: 'Centre chest' },
          left: { view: 'front', area: [272, 118, 44, 44], cm: [10, 10], scale: 1, anchor: 'middle', de: 'Brust links', en: 'Left chest' },
          back: { view: 'back', area: [184, 106, 132, 176], cm: [30, 40], scale: 0.85, anchor: 'top', de: 'Rücken', en: 'Back' },
          neck: { view: 'back', area: [232, 82, 36, 18], cm: [8, 4], scale: 1, anchor: 'middle', de: 'Nacken', en: 'Neck' }
        }
      },
      hoodie: {
        de: 'Hoodie', en: 'Hoodie', formValue: 'Hoodies / Sweatshirts',
        positions: {
          center: { view: 'front', area: [198, 200, 104, 92], cm: [25, 22], scale: 0.85, anchor: 'top', de: 'Brust mittig', en: 'Centre chest' },
          left: { view: 'front', area: [280, 150, 42, 42], cm: [10, 10], scale: 1, anchor: 'middle', de: 'Brust links', en: 'Left chest' },
          back: { view: 'back', area: [188, 150, 124, 166], cm: [30, 40], scale: 0.85, anchor: 'top', de: 'Rücken', en: 'Back' }
        }
      }
    }
  };

  /* Garment drawings (500 × 560). bands = darker rib parts, seams = dashed
     stitching, cords = hoodie drawstrings, over = parts drawn on top. */
  const GARMENTS = {
    tshirt: {
      body: 'M200 58 C220 82 280 82 300 58 L372 80 C402 92 440 120 462 150 L418 218 L366 192 L362 516 C330 526 170 526 138 516 L134 192 L82 218 L38 150 C60 120 98 92 128 80 Z',
      front: {
        bands: ['M200 58 C220 82 280 82 300 58 C292 72 276 92 250 92 C224 92 208 72 200 58 Z'],
        seams: ['M128 80 C130 120 132 160 134 192', 'M372 80 C370 120 368 160 366 192', 'M140 500 C172 509 328 509 360 500', 'M50 166 L94 226', 'M450 166 L406 226']
      },
      back: {
        bands: ['M205 58 C225 66 275 66 295 58 C288 66 272 74 250 74 C228 74 212 66 205 58 Z'],
        seams: ['M128 80 C130 120 132 160 134 192', 'M372 80 C370 120 368 160 366 192', 'M140 500 C172 509 328 509 360 500', 'M50 166 L94 226', 'M450 166 L406 226']
      }
    },
    hoodie: {
      body: 'M172 88 L328 88 C366 96 398 114 416 152 C434 212 446 280 454 328 L412 342 C402 290 388 244 372 216 L370 498 C336 510 164 510 130 498 L128 216 C112 244 98 290 88 342 L46 328 C54 280 66 212 84 152 C102 114 134 96 172 88 Z',
      front: {
        under: ['M170 96 C164 40 208 12 250 12 C292 12 336 40 330 96 Z'],
        inner: 'M206 94 C206 56 226 38 250 38 C274 38 294 56 294 94 C280 104 220 104 206 94 Z',
        bands: ['M46 328 L88 342 L83 362 L41 348 Z', 'M454 328 L412 342 L417 362 L459 348 Z', 'M130 498 C164 510 336 510 370 498 L370 522 C336 534 164 534 130 522 Z'],
        seams: ['M172 388 L328 388 L352 476 L148 476 Z', 'M198 388 L176 476', 'M302 388 L324 476', 'M128 216 C126 170 140 124 172 92', 'M372 216 C374 170 360 124 328 92'],
        cords: ['M233 102 L229 196', 'M267 102 L271 196']
      },
      back: {
        bands: ['M46 328 L88 342 L83 362 L41 348 Z', 'M454 328 L412 342 L417 362 L459 348 Z', 'M130 498 C164 510 336 510 370 498 L370 522 C336 534 164 534 130 522 Z'],
        seams: ['M128 216 C126 170 140 124 172 92', 'M372 216 C374 170 360 124 328 92'],
        over: ['M176 96 C172 40 214 16 250 16 C286 16 328 40 324 96 C304 132 196 132 176 96 Z'],
        overSeams: ['M250 18 L250 124']
      }
    }
  };

  const W = 500;
  const H = 560;

  /* ------------------------------------------------------------------------
     2. TEXT
     ------------------------------------------------------------------------ */
  const TEXT = {
    de: {
      yourLogo: 'Dein Logo',
      maxArea: 'Druckbereich max. {w} × {h} cm',
      approx: 'ca. {w} × {h} cm',
      vector: 'Vektor-Datei ({type}) im Original für die Druckprüfung hinterlegt',
      lowRes: 'Achtung: Geringe Bildauflösung (ca. {dpi} dpi bei dieser Größe). Wir prüfen die Machbarkeit.',
      tooBig: 'Die Datei ist größer als 15 MB. Schick sie uns gerne per E-Mail oder WhatsApp.',
      badType: 'Dieses Format können wir nicht verarbeiten. Bitte nutze PNG, JPG, SVG oder PDF.',
      corrupt: 'Die Datei konnte nicht gelesen werden. Ist sie vielleicht beschädigt? Versuch es mit einer anderen Datei.',
      pixels: '{w} × {h} px',
      vectorMeta: 'Vektordatei',
      printOnlyMeta: 'Vorschau als Platzhalter',
      product: 'Produkt', color: 'Farbe', position: 'Position', size: 'Druckgröße', file: 'Datei', none: 'keine',
      total: 'Gesamt: {n} Stück',
      required: 'Bitte fülle dieses Feld aus.',
      email: 'Bitte gib eine gültige E-Mail-Adresse ein.',
      sizes: 'Bitte gib bei mindestens einer Größe eine Stückzahl an.',
      sending: 'Wird gesendet …',
      failed: 'Das Senden hat gerade nicht geklappt. Bitte versuch es noch einmal oder schick uns deine Anfrage per',
      rate: 'Du hast gerade schon mehrere Anfragen gesendet. Bitte versuch es später erneut oder schreib uns per',
      whatsapp: 'WhatsApp', or: 'oder', mail: 'E-Mail',
      canvas: 'Vorschau: {product} in {color}, {position}'
    },
    en: {
      yourLogo: 'Your logo',
      maxArea: 'Print area max. {w} × {h} cm',
      approx: 'approx. {w} × {h} cm',
      vector: 'Vector file ({type}) kept in its original form for the print check',
      lowRes: 'Note: low image resolution (approx. {dpi} dpi at this size). We will check if it prints well.',
      tooBig: 'The file is larger than 15 MB. Feel free to send it by email or WhatsApp.',
      badType: 'We cannot process this format. Please use PNG, JPG, SVG or PDF.',
      corrupt: 'The file could not be read. Maybe it is damaged? Please try another file.',
      pixels: '{w} × {h} px',
      vectorMeta: 'Vector file',
      printOnlyMeta: 'Preview as placeholder',
      product: 'Product', color: 'Colour', position: 'Position', size: 'Print size', file: 'File', none: 'none',
      total: 'Total: {n} pieces',
      required: 'Please fill in this field.',
      email: 'Please enter a valid email address.',
      sizes: 'Please enter a quantity for at least one size.',
      sending: 'Sending …',
      failed: 'Sending did not work just now. Please try again or send your request via',
      rate: 'You have already sent several requests. Please try again later or message us via',
      whatsapp: 'WhatsApp', or: 'or', mail: 'email',
      canvas: 'Preview: {product} in {color}, {position}'
    }
  };

  const lang = () => (document.documentElement.lang === 'en' ? 'en' : 'de');
  const t = (key, vars) => {
    let s = (TEXT[lang()] || TEXT.de)[key] || TEXT.de[key] || key;
    if (vars) Object.keys(vars).forEach((k) => { s = s.split('{' + k + '}').join(vars[k]); });
    return s;
  };

  /* ------------------------------------------------------------------------
     3. HELPERS
     ------------------------------------------------------------------------ */
  const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const luminance = (hex) => { const [r, g, b] = rgb(hex); return 0.299 * r + 0.587 * g + 0.114 * b; };
  const isLight = (hex) => luminance(hex) > 150;
  const mix = (hex, target, amount) => {
    const a = rgb(hex), b = rgb(target);
    return '#' + a.map((v, i) => Math.round(v + (b[i] - v) * amount).toString(16).padStart(2, '0')).join('');
  };
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const fmt = (n) => {
    const r = n >= 10 ? Math.round(n) : Math.round(n * 2) / 2;
    return lang() === 'de' ? String(r).replace('.', ',') : String(r);
  };
  const extOf = (name) => (String(name).split('.').pop() || '').toLowerCase();
  const fileSize = (bytes) => (bytes < 1024 * 1024
    ? Math.max(1, Math.round(bytes / 1024)) + ' KB'
    : (bytes / 1024 / 1024).toFixed(1).replace('.', lang() === 'de' ? ',' : '.') + ' MB');

  /* ------------------------------------------------------------------------
     4. IMAGE TOOLS
     ------------------------------------------------------------------------ */
  const ImageTools = {
    /** Decodes an image file. Resolves with an <img>, rejects if corrupt. */
    decode(file) {
      return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
        img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('decode')); };
        img.src = url;
      });
    },

    /** Draws an image into a canvas no larger than maxPx on its long side. */
    toCanvas(img, maxPx) {
      let w = img.naturalWidth, h = img.naturalHeight;
      if (!w || !h) { w = 1200; h = 1200; } // SVG without intrinsic size
      const scale = Math.min(1, maxPx / Math.max(w, h));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(w * scale));
      canvas.height = Math.max(1, Math.round(h * scale));
      canvas.getContext('2d', { willReadFrequently: true }).drawImage(img, 0, 0, canvas.width, canvas.height);
      return { canvas, scale };
    },

    /** True if the image edges are (almost) white and opaque. */
    hasWhiteBackground(canvas) {
      const { width: w, height: h } = canvas;
      const d = canvas.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, w, h).data;
      let white = 0, total = 0;
      const check = (x, y) => {
        const i = (y * w + x) * 4;
        total += 1;
        if (d[i + 3] > 245 && d[i] > 230 && d[i + 1] > 230 && d[i + 2] > 230) white += 1;
      };
      const step = Math.max(1, Math.floor(Math.max(w, h) / 200));
      for (let x = 0; x < w; x += step) { check(x, 0); check(x, h - 1); }
      for (let y = 0; y < h; y += step) { check(0, y); check(w - 1, y); }
      return total > 0 && white / total > 0.9;
    },

    /** Makes white connected to the image edge transparent (flood fill), so
        white details inside a logo stay white. Edges are softened. */
    removeWhite(source) {
      const canvas = ImageTools.copy(source);
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      const { width: w, height: h } = canvas;
      const img = ctx.getImageData(0, 0, w, h);
      const d = img.data;
      const seen = new Uint8Array(w * h);
      const stack = [];
      const white = (i) => d[i * 4 + 3] > 0 && d[i * 4] > 226 && d[i * 4 + 1] > 226 && d[i * 4 + 2] > 226;
      for (let x = 0; x < w; x += 1) stack.push(x, (h - 1) * w + x);
      for (let y = 0; y < h; y += 1) stack.push(y * w, y * w + w - 1);
      while (stack.length) {
        const i = stack.pop();
        if (seen[i] || !white(i)) continue;
        seen[i] = 1;
        d[i * 4 + 3] = 0;
        const x = i % w;
        if (x > 0) stack.push(i - 1);
        if (x < w - 1) stack.push(i + 1);
        if (i >= w) stack.push(i - w);
        if (i < w * (h - 1)) stack.push(i + w);
      }
      for (let i = 0; i < w * h; i += 1) {
        if (seen[i]) continue;
        const x = i % w;
        const edge = (x > 0 && seen[i - 1]) || (x < w - 1 && seen[i + 1]) || (i >= w && seen[i - w]) || (i < w * (h - 1) && seen[i + w]);
        if (!edge) continue;
        const min = Math.min(d[i * 4], d[i * 4 + 1], d[i * 4 + 2]);
        if (min > 170) d[i * 4 + 3] = Math.round(d[i * 4 + 3] * (255 - min) / 85);
      }
      ctx.putImageData(img, 0, 0);
      return canvas;
    },

    /** Crops transparent margins. Returns { canvas, x, y } of the crop. */
    trim(source) {
      const { width: w, height: h } = source;
      const d = source.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, w, h).data;
      let x0 = w, y0 = h, x1 = -1, y1 = -1;
      for (let y = 0; y < h; y += 1) {
        for (let x = 0; x < w; x += 1) {
          if (d[(y * w + x) * 4 + 3] > 10) {
            if (x < x0) x0 = x;
            if (x > x1) x1 = x;
            if (y < y0) y0 = y;
            if (y > y1) y1 = y;
          }
        }
      }
      if (x1 < 0) return { canvas: source, empty: true };
      const canvas = document.createElement('canvas');
      canvas.width = x1 - x0 + 1;
      canvas.height = y1 - y0 + 1;
      canvas.getContext('2d').drawImage(source, x0, y0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
      return { canvas, empty: false };
    },

    copy(source) {
      const c = document.createElement('canvas');
      c.width = source.width;
      c.height = source.height;
      c.getContext('2d', { willReadFrequently: true }).drawImage(source, 0, 0);
      return c;
    }
  };

  /* ------------------------------------------------------------------------
     5. RENDERER
     Draws in garment coordinates (500 × 560); the caller sets the transform.
     ------------------------------------------------------------------------ */
  const paths = {};
  const path = (d) => (paths[d] || (paths[d] = new Path2D(d)));

  const noise = (() => {
    const c = document.createElement('canvas');
    c.width = 128;
    c.height = 128;
    const ctx = c.getContext('2d');
    const img = ctx.createImageData(128, 128);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.random() * 255;
      img.data[i] = v; img.data[i + 1] = v; img.data[i + 2] = v;
      img.data[i + 3] = 38;
    }
    ctx.putImageData(img, 0, 0);
    return c;
  })();

  const canFilter = (() => { try { return 'filter' in document.createElement('canvas').getContext('2d'); } catch (e) { return false; } })();

  const Renderer = {
    /**
     * @param ctx      2D context with garment transform applied
     * @param scene    { product, view, color, design, rect, area, guides, snap }
     */
    draw(ctx, scene) {
      const g = GARMENTS[scene.product];
      const v = g[scene.view];
      const base = scene.color.hex;
      const light = isLight(base);
      const body = path(g.body);
      const outline = light ? 'rgba(0,0,0,0.20)' : 'rgba(0,0,0,0.45)';
      const band = light ? mix(base, '#000000', 0.10) : mix(base, '#FFFFFF', 0.07);
      const seam = light ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.12)';

      // Floor shadow
      ctx.save();
      const sh = ctx.createRadialGradient(250, 540, 10, 250, 540, 190);
      sh.addColorStop(0, 'rgba(0,0,0,0.20)');
      sh.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = sh;
      ctx.beginPath();
      ctx.ellipse(250, 540, 200, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Hood behind the body (front view)
      (v.under || []).forEach((d) => { Renderer.fill(ctx, d, mix(base, '#000000', light ? 0.06 : 0.0), outline); });

      // Body
      Renderer.fill(ctx, g.body, base, outline);

      // Fabric texture and the design, then light/shade over both
      ctx.save();
      ctx.clip(body);
      ctx.globalAlpha = light ? 0.22 : 0.28; // subtle cotton grain
      ctx.fillStyle = ctx.createPattern(noise, 'repeat');
      ctx.fillRect(0, 0, W, H);
      ctx.globalAlpha = 1;
      Renderer.design(ctx, scene, light);
      Renderer.shade(ctx, light);
      ctx.restore();

      // Hood opening, ribs, seams, cords, parts on top
      if (v.inner) Renderer.fill(ctx, v.inner, mix(base, '#000000', light ? 0.22 : 0.4), outline);
      (v.bands || []).forEach((d) => Renderer.fill(ctx, d, band, outline));
      Renderer.strokes(ctx, v.seams || [], seam, 1.3, [3, 4]);
      (v.over || []).forEach((d) => Renderer.fill(ctx, d, mix(base, light ? '#000000' : '#FFFFFF', 0.05), outline));
      Renderer.strokes(ctx, v.overSeams || [], seam, 1.3, [3, 4]);
      Renderer.strokes(ctx, v.cords || [], light ? '#FFFFFF' : '#ECE8E1', 3.2, []);

      if (scene.guides) Renderer.guides(ctx, scene, light);
    },

    fill(ctx, d, color, outline) {
      ctx.fillStyle = color;
      ctx.fill(path(d));
      ctx.lineWidth = 1;
      ctx.strokeStyle = outline;
      ctx.stroke(path(d));
    },

    strokes(ctx, list, color, width, dash) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.setLineDash(dash);
      list.forEach((d) => ctx.stroke(path(d)));
      ctx.restore();
    },

    /** Soft studio light: darker sides, lighter upper centre, a few folds */
    shade(ctx, light) {
      const side = ctx.createLinearGradient(40, 0, 460, 0);
      side.addColorStop(0, 'rgba(0,0,0,0.30)');
      side.addColorStop(0.24, 'rgba(0,0,0,0)');
      side.addColorStop(0.76, 'rgba(0,0,0,0)');
      side.addColorStop(1, 'rgba(0,0,0,0.30)');
      ctx.fillStyle = side;
      ctx.fillRect(0, 0, W, H);

      const vert = ctx.createLinearGradient(0, 60, 0, 540);
      vert.addColorStop(0, 'rgba(255,255,255,' + (light ? 0.10 : 0.06) + ')');
      vert.addColorStop(0.5, 'rgba(255,255,255,0)');
      vert.addColorStop(1, 'rgba(0,0,0,0.16)');
      ctx.fillStyle = vert;
      ctx.fillRect(0, 0, W, H);

      const glow = ctx.createRadialGradient(230, 210, 10, 230, 210, 260);
      glow.addColorStop(0, 'rgba(255,255,255,' + (light ? 0.16 : 0.07) + ')');
      glow.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      if (canFilter) {
        ctx.save();
        ctx.filter = 'blur(7px)';
        ctx.strokeStyle = 'rgba(0,0,0,' + (light ? 0.07 : 0.16) + ')';
        ctx.lineWidth = 9;
        ctx.lineCap = 'round';
        ['M150 230 C170 300 168 380 182 470', 'M352 236 C334 310 338 390 322 476', 'M200 470 C230 488 270 488 300 470'].forEach((d) => ctx.stroke(path(d)));
        ctx.restore();
      }
    },

    /** The uploaded design, a vector placeholder or the "Dein Logo" hint */
    design(ctx, scene, light) {
      const r = scene.rect;
      const ink = light ? '#1B1B1D' : '#F5F3EE';
      if (!scene.design) {
        const a = scene.area;
        ctx.save();
        ctx.setLineDash([6, 6]);
        ctx.lineWidth = 1.4;
        ctx.strokeStyle = light ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.45)';
        Renderer.roundRect(ctx, a.x, a.y, a.w, a.h, 6);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = light ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.75)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const fs = clamp(a.w / 6, 7, 22);
        ctx.font = '800 ' + fs + 'px Archivo, "Helvetica Neue", Arial, sans-serif';
        ctx.fillText(t('yourLogo'), a.x + a.w / 2, a.y + a.h / 2);
        ctx.restore();
        return;
      }
      if (scene.design.kind === 'print') {
        ctx.save();
        ctx.fillStyle = 'rgba(201,31,111,0.16)';
        ctx.strokeStyle = '#C91F6F';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 4]);
        Renderer.roundRect(ctx, r.x, r.y, r.w, r.h, 6);
        ctx.fill();
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = ink;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '800 ' + clamp(r.w / 3.4, 7, 34) + 'px Archivo, "Helvetica Neue", Arial, sans-serif';
        ctx.fillText(scene.design.type.toUpperCase(), r.x + r.w / 2, r.y + r.h / 2 - (r.h > 40 ? 6 : 0));
        if (r.h > 40) {
          ctx.font = '600 ' + clamp(r.w / 11, 6, 12) + 'px Archivo, "Helvetica Neue", Arial, sans-serif';
          ctx.fillText(t('vectorMeta'), r.x + r.w / 2, r.y + r.h / 2 + clamp(r.w / 6, 9, 22));
        }
        ctx.restore();
        return;
      }
      ctx.save();
      ctx.imageSmoothingQuality = 'high';
      ctx.globalAlpha = 0.97;
      ctx.drawImage(scene.design.image, r.x, r.y, r.w, r.h);
      ctx.restore();
    },

    guides(ctx, scene, light) {
      const a = scene.area;
      const c = light ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.6)';
      ctx.save();
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = c;
      Renderer.roundRect(ctx, a.x, a.y, a.w, a.h, 6);
      ctx.stroke();
      if (scene.snap) {
        ctx.setLineDash([]);
        ctx.strokeStyle = '#C91F6F';
        ctx.beginPath();
        ctx.moveTo(a.x + a.w / 2, a.y - 6);
        ctx.lineTo(a.x + a.w / 2, a.y + a.h + 6);
        ctx.stroke();
      }
      ctx.restore();
    },

    roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }
  };

  /* ------------------------------------------------------------------------
     6. CONFIGURATOR
     ------------------------------------------------------------------------ */
  const el = {
    stage: root.querySelector('[data-cfg-stage]'),
    canvas: root.querySelector('[data-cfg-canvas]'),
    views: root.querySelectorAll('input[name="cfg-view"]'),
    vectorBadge: root.querySelector('[data-cfg-vector]'),
    qualityBadge: root.querySelector('[data-cfg-quality]'),
    measure: root.querySelector('[data-cfg-measure]'),
    drop: root.querySelector('[data-cfg-drop]'),
    fileInput: root.querySelector('#cfg-file'),
    fileBox: root.querySelector('[data-cfg-file]'),
    fileType: root.querySelector('[data-cfg-file-type]'),
    fileName: root.querySelector('[data-cfg-file-name]'),
    fileMeta: root.querySelector('[data-cfg-file-meta]'),
    remove: root.querySelector('[data-cfg-remove]'),
    bgWrap: root.querySelector('[data-cfg-bg]'),
    bgToggle: root.querySelector('[data-cfg-bg-toggle]'),
    error: root.querySelector('[data-cfg-error]'),
    products: root.querySelector('[data-cfg-products]'),
    swatches: root.querySelector('[data-cfg-swatches]'),
    colorName: root.querySelector('[data-cfg-color-name]'),
    positions: root.querySelector('[data-cfg-positions]'),
    size: root.querySelector('[data-cfg-size]')
  };
  const ctx = el.canvas.getContext('2d');
  const startedAt = Date.now();

  const state = {
    product: 'tshirt',
    position: 'center',
    color: CONFIG.colors[0].id,
    scale: CONFIG.products.tshirt.positions.center.scale,
    cx: null,               // design centre in garment coordinates
    cy: null,
    file: null,             // original File, sent with the request
    design: null,           // { kind: 'raster'|'vector'|'print', image, w, h, srcScale, type }
    source: null,           // decoded canvas before background removal
    whiteBg: false,
    guides: false,
    snap: false
  };

  const product = () => CONFIG.products[state.product];
  const pos = () => product().positions[state.position];
  const color = () => CONFIG.colors.find((c) => c.id === state.color) || CONFIG.colors[0];
  const area = () => { const a = pos().area; return { x: a[0], y: a[1], w: a[2], h: a[3] }; };
  const pxPerCm = () => pos().area[2] / pos().cm[0];
  const label = (obj) => (lang() === 'en' ? obj.en : obj.de);

  /** Size and place of the design inside the print area (garment units) */
  function designRect() {
    const a = area();
    const ratio = state.design ? state.design.h / state.design.w : a.h / a.w;
    let w = a.w * state.scale;
    let h = w * ratio;
    if (h > a.h) { h = a.h; w = h / ratio; }
    if (state.cx === null) {
      state.cx = a.x + a.w / 2;
      state.cy = pos().anchor === 'top' ? a.y + h / 2 : a.y + a.h / 2;
    }
    state.cx = clamp(state.cx, a.x + w / 2, a.x + a.w - w / 2);
    state.cy = clamp(state.cy, a.y + h / 2, a.y + a.h - h / 2);
    return { x: state.cx - w / 2, y: state.cy - h / 2, w, h };
  }

  /* ---- Canvas sizing and the garment transform */
  let view = { s: 1, ox: 0, oy: 0, dpr: 1 };

  function layout() {
    const rect = el.canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    el.canvas.width = Math.round(rect.width * dpr);
    el.canvas.height = Math.round(rect.height * dpr);
    const top = 58, bottom = 44, side = 12; // room for the overlays
    const s = Math.min((rect.width - side * 2) / W, (rect.height - top - bottom) / H);
    view = { s, dpr, ox: (rect.width - W * s) / 2, oy: top + (rect.height - top - bottom - H * s) / 2 };
    draw();
  }

  let frame = 0;
  function draw() {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      const rect = designRect();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, el.canvas.width, el.canvas.height);
      ctx.setTransform(view.s * view.dpr, 0, 0, view.s * view.dpr, view.ox * view.dpr, view.oy * view.dpr);
      Renderer.draw(ctx, scene(rect, state.guides));
      updateInfo(rect);
    });
  }

  function scene(rect, guides) {
    return {
      product: state.product, view: pos().view, color: color(),
      design: state.design, rect, area: area(), guides, snap: state.snap
    };
  }

  /* ---- Size label, quality warning, vector badge, canvas label */
  function updateInfo(rect) {
    const p = pxPerCm();
    if (state.design) {
      el.measure.textContent = t('approx', { w: fmt(rect.w / p), h: fmt(rect.h / p) });
    } else {
      el.measure.textContent = t('maxArea', { w: pos().cm[0], h: pos().cm[1] });
    }
    let dpi = null;
    if (state.design && state.design.kind === 'raster') {
      const widthCm = rect.w / p;
      dpi = Math.round((state.design.w / state.design.srcScale) / (widthCm / 2.54));
    }
    el.qualityBadge.hidden = !(dpi && dpi < CONFIG.minDpi);
    if (!el.qualityBadge.hidden) el.qualityBadge.textContent = t('lowRes', { dpi });
    state.dpi = dpi;
    el.canvas.setAttribute('aria-label', t('canvas', { product: label(product()), color: label(color()), position: label(pos()) }));
  }

  /* ---- Controls built from CONFIG */
  function radio(name, value, text, checked) {
    const wrap = document.createElement('label');
    wrap.className = 'cfg__seg';
    const input = document.createElement('input');
    input.className = 'cfg__sr';
    input.type = 'radio';
    input.name = name;
    input.value = value;
    input.checked = checked;
    const span = document.createElement('span');
    span.textContent = text;
    wrap.append(input, span);
    return wrap;
  }

  function buildProducts() {
    el.products.textContent = '';
    Object.keys(CONFIG.products).forEach((id) => {
      el.products.appendChild(radio('cfg-product', id, label(CONFIG.products[id]), id === state.product));
    });
  }

  function buildPositions() {
    el.positions.textContent = '';
    const list = product().positions;
    const current = pos().view;
    Object.keys(list).filter((id) => list[id].view === current).forEach((id) => {
      el.positions.appendChild(radio('cfg-position', id, label(list[id]), id === state.position));
    });
    el.views.forEach((v) => { v.checked = v.value === current; });
  }

  function buildSwatches() {
    el.swatches.textContent = '';
    CONFIG.colors.forEach((c) => {
      const wrap = document.createElement('label');
      wrap.className = 'cfg__swatch';
      wrap.title = label(c);
      const input = document.createElement('input');
      input.className = 'cfg__sr';
      input.type = 'radio';
      input.name = 'cfg-color';
      input.value = c.id;
      input.checked = c.id === state.color;
      input.setAttribute('aria-label', label(c));
      const dot = document.createElement('span');
      dot.className = 'cfg__swatch-dot';
      dot.style.backgroundColor = c.hex;
      wrap.append(input, dot);
      el.swatches.appendChild(wrap);
    });
    el.colorName.textContent = label(color());
  }

  function setPosition(id) {
    state.position = id;
    state.scale = pos().scale;
    state.cx = null;
    el.size.value = Math.round(state.scale * 100);
    flashGuides();
    buildPositions();
    draw();
  }

  root.addEventListener('change', (e) => {
    const input = e.target;
    if (input.name === 'cfg-product') {
      state.product = input.value;
      const keep = product().positions[state.position] ? state.position : 'center';
      setPosition(keep);
    } else if (input.name === 'cfg-view') {
      const list = product().positions;
      if (pos().view !== input.value) setPosition(Object.keys(list).find((id) => list[id].view === input.value));
    } else if (input.name === 'cfg-position') {
      setPosition(input.value);
    } else if (input.name === 'cfg-color') {
      state.color = input.value;
      el.colorName.textContent = label(color());
      draw();
    }
  });

  el.size.addEventListener('input', () => {
    state.scale = Number(el.size.value) / 100;
    draw();
  });

  let guideTimer = 0;
  function flashGuides() {
    state.guides = true;
    clearTimeout(guideTimer);
    guideTimer = setTimeout(() => { state.guides = false; draw(); }, 900);
  }

  /* ---- File handling */
  function showError(message) {
    el.error.hidden = !message;
    el.error.textContent = message || '';
  }

  async function handleFile(file) {
    if (!file) return;
    showError('');
    const type = extOf(file.name);
    const known = [...CONFIG.rasterTypes, ...CONFIG.vectorTypes, ...CONFIG.printOnlyTypes];
    if (!known.includes(type)) { showError(t('badType')); return; }
    if (file.size > CONFIG.maxFileBytes) { showError(t('tooBig')); return; }

    let design;
    let meta;
    if (CONFIG.printOnlyTypes.includes(type)) {
      // PDF / AI / EPS: kept for the request, shown as a placeholder
      design = { kind: 'print', type, w: 4, h: 3, srcScale: 1 };
      meta = t('printOnlyMeta');
      state.source = null;
      state.whiteBg = false;
    } else {
      try {
        const img = await ImageTools.decode(file);
        const isVector = CONFIG.vectorTypes.includes(type);
        const { canvas, scale } = ImageTools.toCanvas(img, CONFIG.rasterMaxPx);
        state.source = { canvas, scale, kind: isVector ? 'vector' : 'raster', type };
        state.whiteBg = !isVector && ImageTools.hasWhiteBackground(canvas);
        design = prepareDesign();
        if (!design) throw new Error('empty');
        meta = isVector ? t('vectorMeta') : t('pixels', { w: img.naturalWidth, h: img.naturalHeight });
      } catch (err) {
        showError(t('corrupt'));
        return;
      }
    }

    state.file = file;
    state.design = design;
    state.cx = null;
    state.scale = pos().scale;
    el.size.value = Math.round(state.scale * 100);
    el.fileBox.hidden = false;
    el.fileType.textContent = type.toUpperCase().slice(0, 4);
    el.fileName.textContent = file.name;
    el.fileMeta.textContent = meta + ' · ' + fileSize(file.size);
    el.bgWrap.hidden = !state.whiteBg;
    el.bgToggle.checked = true;
    el.vectorBadge.hidden = design.kind !== 'print';
    if (design.kind === 'print') el.vectorBadge.textContent = t('vector', { type: type.toUpperCase() });
    flashGuides();
    draw();
  }

  /** Applies background removal and trimming to the decoded source */
  function prepareDesign() {
    const src = state.source;
    let canvas = src.canvas;
    if (state.whiteBg && el.bgToggle.checked) canvas = ImageTools.removeWhite(canvas);
    const trimmed = ImageTools.trim(canvas);
    if (trimmed.empty) return null;
    return { kind: src.kind, type: src.type, image: trimmed.canvas, w: trimmed.canvas.width, h: trimmed.canvas.height, srcScale: src.scale };
  }

  el.fileInput.addEventListener('change', () => {
    handleFile(el.fileInput.files[0]);
    el.fileInput.value = '';
  });

  el.bgToggle.addEventListener('change', () => {
    if (!state.source) return;
    state.design = prepareDesign() || state.design;
    draw();
  });

  el.remove.addEventListener('click', () => {
    state.file = null;
    state.design = null;
    state.source = null;
    state.cx = null;
    el.fileBox.hidden = true;
    el.bgWrap.hidden = true;
    el.vectorBadge.hidden = true;
    showError('');
    el.fileInput.focus();
    draw();
  });

  // Drag & drop a file onto the upload box or the stage
  [el.drop, el.stage].forEach((zone) => {
    zone.addEventListener('dragover', (e) => { e.preventDefault(); el.drop.classList.add('is-dragover'); });
    zone.addEventListener('dragleave', () => el.drop.classList.remove('is-dragover'));
    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      el.drop.classList.remove('is-dragover');
      if (e.dataTransfer && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
    });
  });

  /* ---- Gestures. A finger on the design drags it, two fingers resize it.
     Anywhere else a swipe still scrolls the page (important on phones,
     where the stage covers half the screen). */
  function toGarment(clientX, clientY) {
    const r = el.canvas.getBoundingClientRect();
    return { x: (clientX - r.left - view.ox) / view.s, y: (clientY - r.top - view.oy) / view.s };
  }

  function hitDesign(p, pad) {
    if (!state.design) return false;
    const r = designRect();
    return p.x >= r.x - pad && p.x <= r.x + r.w + pad && p.y >= r.y - pad && p.y <= r.y + r.h + pad;
  }

  let gesture = null; // { type: 'drag'|'pinch', ... }

  function moveTo(p) {
    const a = area();
    let cx = gesture.cx + (p.x - gesture.x);
    const center = a.x + a.w / 2;
    state.snap = Math.abs(cx - center) < 3;
    if (state.snap) cx = center;
    state.cx = cx;
    state.cy = gesture.cy + (p.y - gesture.y);
    draw();
  }

  function setScale(s) {
    state.scale = clamp(s, 0.15, 1);
    el.size.value = Math.round(state.scale * 100);
    draw();
  }

  function startGuides() { clearTimeout(guideTimer); state.guides = true; }
  function endGesture() {
    gesture = null;
    state.snap = false;
    el.canvas.classList.remove('is-dragging');
    flashGuides();
    draw();
  }

  // Touch
  const dist = (a, b) => Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  el.canvas.addEventListener('touchstart', (e) => {
    if (!state.design) return;
    if (e.touches.length === 2) {
      e.preventDefault();
      gesture = { type: 'pinch', d: dist(e.touches[0], e.touches[1]), scale: state.scale };
      startGuides();
      return;
    }
    const p = toGarment(e.touches[0].clientX, e.touches[0].clientY);
    if (e.touches.length === 1 && hitDesign(p, 14)) {
      e.preventDefault();
      gesture = { type: 'drag', x: p.x, y: p.y, cx: state.cx, cy: state.cy };
      startGuides();
    }
  }, { passive: false });

  el.canvas.addEventListener('touchmove', (e) => {
    if (!gesture) return;
    e.preventDefault();
    if (gesture.type === 'pinch' && e.touches.length >= 2) {
      setScale(gesture.scale * dist(e.touches[0], e.touches[1]) / gesture.d);
    } else if (gesture.type === 'drag') {
      moveTo(toGarment(e.touches[0].clientX, e.touches[0].clientY));
    }
  }, { passive: false });

  el.canvas.addEventListener('touchend', (e) => {
    if (!gesture) return;
    if (gesture.type === 'pinch' && e.touches.length === 1) {
      // Lifting one finger continues as a drag with the other one
      const p = toGarment(e.touches[0].clientX, e.touches[0].clientY);
      gesture = { type: 'drag', x: p.x, y: p.y, cx: state.cx, cy: state.cy };
      return;
    }
    if (e.touches.length === 0) endGesture();
  });
  el.canvas.addEventListener('touchcancel', endGesture);

  // Mouse (touch input is handled above)
  el.canvas.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    const p = toGarment(e.clientX, e.clientY);
    if (!hitDesign(p, 4)) return;
    e.preventDefault();
    el.canvas.setPointerCapture(e.pointerId);
    gesture = { type: 'drag', x: p.x, y: p.y, cx: state.cx, cy: state.cy };
    el.canvas.classList.add('is-dragging');
    startGuides();
  });
  el.canvas.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return;
    const p = toGarment(e.clientX, e.clientY);
    if (gesture && gesture.type === 'drag') moveTo(p);
    else el.canvas.classList.toggle('is-over-logo', hitDesign(p, 4));
  });
  el.canvas.addEventListener('pointerup', (e) => { if (e.pointerType !== 'touch' && gesture) endGesture(); });
  el.canvas.addEventListener('wheel', (e) => {
    if (!hitDesign(toGarment(e.clientX, e.clientY), 4)) return;
    e.preventDefault();
    setScale(state.scale * (e.deltaY < 0 ? 1.05 : 0.95));
  }, { passive: false });

  // Keyboard: arrows move, + / - resize
  el.canvas.addEventListener('keydown', (e) => {
    if (!state.design) return;
    const step = e.shiftKey ? 10 : 2;
    const moves = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    if (moves[e.key]) {
      e.preventDefault();
      designRect();
      state.cx += moves[e.key][0];
      state.cy += moves[e.key][1];
      flashGuides();
      draw();
    } else if (e.key === '+' || e.key === '=') { e.preventDefault(); setScale(state.scale + 0.05); }
    else if (e.key === '-') { e.preventDefault(); setScale(state.scale - 0.05); }
  });

  /* ---- Snapshot of the current design for the request */
  function snapshot(width, height) {
    const c = document.createElement('canvas');
    c.width = width;
    c.height = height;
    const sctx = c.getContext('2d');
    const bg = sctx.createRadialGradient(width / 2, height * 0.38, 10, width / 2, height * 0.38, height * 0.75);
    bg.addColorStop(0, '#FBFAF7');
    bg.addColorStop(1, '#DAD5CC');
    sctx.fillStyle = bg;
    sctx.fillRect(0, 0, width, height);
    const s = Math.min(width / W, height / H);
    sctx.setTransform(s, 0, 0, s, (width - W * s) / 2, (height - H * s) / 2);
    Renderer.draw(sctx, scene(designRect(), false));
    return c;
  }

  /* ---- Language switch and resizing */
  function relabel() {
    buildProducts();
    buildPositions();
    buildSwatches();
    if (state.file) {
      el.fileMeta.textContent = (state.design.kind === 'print' ? t('printOnlyMeta') : state.design.kind === 'vector' ? t('vectorMeta') : el.fileMeta.textContent.split(' · ')[0]) + ' · ' + fileSize(state.file.size);
      if (state.design.kind === 'print') el.vectorBadge.textContent = t('vector', { type: state.design.type.toUpperCase() });
    }
    draw();
  }
  document.addEventListener('printlab:lang', relabel);

  if ('ResizeObserver' in window) new ResizeObserver(layout).observe(el.canvas);
  else window.addEventListener('resize', layout);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);

  buildProducts();
  buildPositions();
  buildSwatches();
  el.size.value = Math.round(state.scale * 100);
  layout();

  /* ------------------------------------------------------------------------
     7. REQUEST
     ------------------------------------------------------------------------ */
  const dialog = root.querySelector('[data-cfg-dialog]');
  const form = root.querySelector('[data-cfg-form]');
  const r = {
    open: root.querySelector('[data-cfg-open]'),
    body: root.querySelector('[data-cfg-form-body]'),
    done: root.querySelector('[data-cfg-done]'),
    thumb: root.querySelector('[data-cfg-thumb]'),
    facts: root.querySelector('[data-cfg-facts]'),
    sizes: root.querySelector('[data-cfg-sizes]'),
    total: root.querySelector('[data-cfg-total]'),
    status: root.querySelector('[data-cfg-status]'),
    submit: root.querySelector('[data-cfg-submit]'),
    name: root.querySelector('#cfg-name'),
    email: root.querySelector('#cfg-email'),
    message: root.querySelector('#cfg-message'),
    honeypot: root.querySelector('#cfg-website')
  };

  CONFIG.sizes.forEach((size) => {
    const wrap = document.createElement('div');
    wrap.className = 'cfg-size';
    const id = 'cfg-size-' + size.toLowerCase();
    const lab = document.createElement('label');
    lab.className = 'cfg-size__label';
    lab.htmlFor = id;
    lab.textContent = size;
    const input = document.createElement('input');
    input.className = 'cfg-size__input';
    input.id = id;
    input.name = 'size_' + size;
    input.type = 'number';
    input.min = '0';
    input.max = '9999';
    input.step = '1';
    input.inputMode = 'numeric';
    input.placeholder = '0';
    input.addEventListener('focus', () => input.select());
    input.addEventListener('input', updateTotal);
    wrap.append(lab, input);
    r.sizes.appendChild(wrap);
  });

  function sizeValues() {
    const out = {};
    CONFIG.sizes.forEach((size) => {
      const v = parseInt(form.querySelector('[name="size_' + size + '"]').value, 10);
      out[size] = Number.isFinite(v) && v > 0 ? Math.min(v, 9999) : 0;
    });
    return out;
  }

  function updateTotal() {
    const values = sizeValues();
    const total = Object.values(values).reduce((a, b) => a + b, 0);
    r.total.textContent = total ? t('total', { n: total }) : '';
    CONFIG.sizes.forEach((size) => {
      form.querySelector('[name="size_' + size + '"]').classList.toggle('has-value', values[size] > 0);
    });
    if (total) setError('cfg-sizes', '');
    return total;
  }

  function setError(id, message) {
    const err = form.querySelector('[data-error-for="' + id + '"]');
    if (err) err.textContent = message || '';
    const input = form.querySelector('#' + id);
    if (input) {
      input.classList.toggle('is-invalid', Boolean(message));
      input.setAttribute('aria-invalid', message ? 'true' : 'false');
    }
  }

  function facts() {
    const rect = designRect();
    const p = pxPerCm();
    return [
      [t('product'), label(product())],
      [t('color'), label(color())],
      [t('position'), label(pos())],
      [t('size'), state.design ? t('approx', { w: fmt(rect.w / p), h: fmt(rect.h / p) }) : '–'],
      [t('file'), state.file ? state.file.name : t('none')]
    ];
  }

  function openDialog() {
    r.facts.textContent = '';
    facts().forEach(([k, v]) => {
      const dt = document.createElement('dt');
      dt.textContent = k;
      const dd = document.createElement('dd');
      dd.textContent = v;
      r.facts.append(dt, dd);
    });
    r.thumb.src = snapshot(260, 291).toDataURL('image/png');
    r.thumb.alt = el.canvas.getAttribute('aria-label');
    r.status.textContent = '';
    r.body.hidden = false;
    r.done.hidden = true;
    document.documentElement.classList.add('cfg-lock');
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    (r.name.value ? r.sizes.querySelector('input') : r.name).focus();
  }

  function closeDialog() {
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  }

  r.open.addEventListener('click', openDialog);
  root.querySelectorAll('[data-cfg-close]').forEach((b) => b.addEventListener('click', closeDialog));
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('cfg-lock');
    if (!r.done.hidden) {
      // After a successful request: clear quantities and note for the next one
      CONFIG.sizes.forEach((size) => { form.querySelector('[name="size_' + size + '"]').value = ''; });
      r.message.value = '';
      updateTotal();
    }
    r.open.focus();
  });
  // Click on the backdrop closes the drawer
  dialog.addEventListener('click', (e) => { if (e.target === dialog) closeDialog(); });

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  r.name.addEventListener('input', () => { if (r.name.value.trim()) setError('cfg-name', ''); });
  r.email.addEventListener('input', () => { if (EMAIL_RE.test(r.email.value.trim())) setError('cfg-email', ''); });

  function validate() {
    let first = null;
    const fail = (id, msg, focusEl) => { setError(id, msg); if (!first) first = focusEl; };
    if (!r.name.value.trim()) fail('cfg-name', t('required'), r.name); else setError('cfg-name', '');
    if (!EMAIL_RE.test(r.email.value.trim())) fail('cfg-email', r.email.value.trim() ? t('email') : t('required'), r.email); else setError('cfg-email', '');
    if (!updateTotal()) fail('cfg-sizes', t('sizes'), r.sizes.querySelector('input'));
    if (first) first.focus();
    return !first;
  }

  function summaryText() {
    const values = sizeValues();
    const sizes = CONFIG.sizes.filter((s) => values[s]).map((s) => s + ': ' + values[s]).join(', ');
    return facts().map(([k, v]) => k + ': ' + v).join('\n') + '\n' + sizes;
  }

  function showFailure(rateLimited) {
    r.status.textContent = '';
    r.status.append(document.createTextNode((rateLimited ? t('rate') : t('failed')) + ' '));
    const wa = document.createElement('a');
    wa.href = 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(summaryText());
    wa.target = '_blank';
    wa.rel = 'noopener noreferrer';
    wa.textContent = t('whatsapp');
    const mail = document.createElement('a');
    mail.href = 'mailto:' + CONFIG.email + '?subject=' + encodeURIComponent('Anfrage ' + label(product())) + '&body=' + encodeURIComponent(summaryText());
    mail.textContent = t('mail');
    r.status.append(wa, document.createTextNode(' ' + t('or') + ' '), mail, document.createTextNode('.'));
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (r.honeypot.value.trim() !== '') return;
    if (!validate()) return;

    const values = sizeValues();
    const total = Object.values(values).reduce((a, b) => a + b, 0);
    const rect = designRect();
    const p = pxPerCm();
    const data = new FormData();
    data.set('source', 'konfigurator');
    data.set('lang', lang());
    data.set('t', String(startedAt));
    data.set('name', r.name.value.trim());
    data.set('email', r.email.value.trim());
    data.set('message', r.message.value.trim());
    data.set('product', product().formValue);
    data.set('color', color().de);
    data.set('position', pos().de);
    data.set('view', pos().view === 'back' ? 'Hinten' : 'Vorne');
    data.set('quantity', String(total));
    CONFIG.sizes.forEach((s) => data.set('size_' + s, String(values[s])));
    data.set('has_design', state.file ? 'Ja' : 'Nein');
    if (state.design) data.set('print_size', 'ca. ' + fmt(rect.w / p).replace('.', ',') + ' × ' + fmt(rect.h / p).replace('.', ',') + ' cm');
    if (state.dpi) data.set('dpi', String(state.dpi));

    r.submit.disabled = true;
    r.status.textContent = '';
    r.submit.textContent = t('sending');
    try {
      if (state.file) {
        data.append('files[]', state.file, state.file.name);
        const blob = await new Promise((res) => snapshot(CONFIG.snapshot.width, CONFIG.snapshot.height).toBlob(res, 'image/png'));
        if (blob) {
          const name = 'Vorschau-' + product().de + '-' + color().de.replace(/\W+/g, '') + '-' + pos().de.replace(/\W+/g, '') + '.png';
          data.append('files[]', blob, name);
        }
      }
      const res = await fetch(CONFIG.endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      let body = {};
      try { body = await res.json(); } catch (err) { /* not JSON */ }
      if (res.status === 429) { showFailure(true); return; }
      if (!res.ok || body.ok !== true) throw new Error('HTTP ' + res.status);
      r.body.hidden = true;
      r.done.hidden = false;
      r.done.focus();
    } catch (err) {
      showFailure(false);
    } finally {
      r.submit.disabled = false;
      r.submit.textContent = (document.documentElement.lang === 'en') ? 'Send request' : 'Anfrage senden';
    }
  });
})();
