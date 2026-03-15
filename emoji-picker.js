/**
 * EmojiPicker.js v2.0
 * https://github.com/schwitzerskills/emojipicker
 *
 * Usage:
 *   const picker = new EmojiPicker({ container: '#btn', theme: 'auto' })
 *   picker.on('emojiClick', (emoji) => console.log(emoji.char))
 *
 * Events:  emojiClick | emojiHover | pickerOpen | pickerClose | categoryChange | search
 * Methods: open() | close() | toggle() | destroy() | setTheme(t) | setLocale(l)
 *          getTopFavorites(n) | clearRecent() | clearFavorites()
 * Static:  EmojiPicker.attachToInput(selector, opts)
 *          EmojiPicker.preload(opts)
 */

(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    root.EmojiPicker = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function () {
  'use strict';

  /* ==========================================================================
     i18n  —  add more locales or override via EmojiPicker.LOCALES['xx'] = {...}
     ========================================================================== */
  const LOCALES = {
    en: {
      search: 'Search emoji…', noResults: 'No results for', noRecent: 'No recent emojis yet',
      recent: 'Recently Used', custom: 'Custom', loading: 'Loading…',
      categories: {
        recent: 'Recent', 'Smileys & Emotion': 'Smileys', 'People & Body': 'People',
        'Animals & Nature': 'Nature', 'Food & Drink': 'Food', Activities: 'Activities',
        'Travel & Places': 'Travel', Objects: 'Objects', Symbols: 'Symbols', Flags: 'Flags', custom: 'Custom'
      },
      skinTones: { default: 'Default', light: 'Light', 'medium-light': 'Medium Light', medium: 'Medium', 'medium-dark': 'Medium Dark', dark: 'Dark' }
    },
    de: {
      search: 'Emoji suchen…', noResults: 'Keine Ergebnisse für', noRecent: 'Noch keine Emojis verwendet',
      recent: 'Zuletzt verwendet', custom: 'Eigene', loading: 'Lädt…',
      categories: {
        recent: 'Zuletzt', 'Smileys & Emotion': 'Smileys', 'People & Body': 'Menschen',
        'Animals & Nature': 'Natur', 'Food & Drink': 'Essen', Activities: 'Aktivitäten',
        'Travel & Places': 'Reisen', Objects: 'Objekte', Symbols: 'Symbole', Flags: 'Flaggen', custom: 'Eigene'
      },
      skinTones: { default: 'Standard', light: 'Hell', 'medium-light': 'Mittelhell', medium: 'Mittel', 'medium-dark': 'Mitteldunkel', dark: 'Dunkel' }
    },
    fr: {
      search: 'Rechercher…', noResults: 'Aucun résultat pour', noRecent: 'Aucun emoji récent',
      recent: 'Récents', custom: 'Personnalisé', loading: 'Chargement…',
      categories: {
        recent: 'Récents', 'Smileys & Emotion': 'Smileys', 'People & Body': 'Personnes',
        'Animals & Nature': 'Nature', 'Food & Drink': 'Nourriture', Activities: 'Activités',
        'Travel & Places': 'Voyages', Objects: 'Objets', Symbols: 'Symboles', Flags: 'Drapeaux', custom: 'Personnalisé'
      },
      skinTones: { default: 'Défaut', light: 'Clair', 'medium-light': 'Moyen clair', medium: 'Moyen', 'medium-dark': 'Moyen foncé', dark: 'Foncé' }
    },
    es: {
      search: 'Buscar emoji…', noResults: 'Sin resultados para', noRecent: 'Sin emojis recientes',
      recent: 'Recientes', custom: 'Personalizados', loading: 'Cargando…',
      categories: {
        recent: 'Recientes', 'Smileys & Emotion': 'Emoticonos', 'People & Body': 'Personas',
        'Animals & Nature': 'Naturaleza', 'Food & Drink': 'Comida', Activities: 'Actividades',
        'Travel & Places': 'Viajes', Objects: 'Objetos', Symbols: 'Símbolos', Flags: 'Banderas', custom: 'Personalizados'
      },
      skinTones: { default: 'Predeterminado', light: 'Claro', 'medium-light': 'Medio claro', medium: 'Medio', 'medium-dark': 'Medio oscuro', dark: 'Oscuro' }
    },
    pt: {
      search: 'Pesquisar emoji…', noResults: 'Sem resultados para', noRecent: 'Sem emojis recentes',
      recent: 'Recentes', custom: 'Personalizados', loading: 'Carregando…',
      categories: {
        recent: 'Recentes', 'Smileys & Emotion': 'Sorrisos', 'People & Body': 'Pessoas',
        'Animals & Nature': 'Natureza', 'Food & Drink': 'Comida', Activities: 'Atividades',
        'Travel & Places': 'Viagens', Objects: 'Objetos', Symbols: 'Símbolos', Flags: 'Bandeiras', custom: 'Personalizados'
      },
      skinTones: { default: 'Padrão', light: 'Claro', 'medium-light': 'Médio claro', medium: 'Médio', 'medium-dark': 'Médio escuro', dark: 'Escuro' }
    },
    ja: {
      search: '絵文字を検索…', noResults: '結果なし:', noRecent: '最近使用した絵文字はありません',
      recent: '最近使用', custom: 'カスタム', loading: '読み込み中…',
      categories: {
        recent: '最近', 'Smileys & Emotion': '笑顔', 'People & Body': '人物',
        'Animals & Nature': '自然', 'Food & Drink': '食べ物', Activities: 'アクティビティ',
        'Travel & Places': '旅行', Objects: 'オブジェクト', Symbols: '記号', Flags: '旗', custom: 'カスタム'
      },
      skinTones: { default: 'デフォルト', light: '薄い', 'medium-light': 'やや薄い', medium: '普通', 'medium-dark': 'やや濃い', dark: '濃い' }
    }
  };

  /* ==========================================================================
     IndexedDB  —  replaces localStorage for recents, favorites, and data cache
     ========================================================================== */
  const EmojiDB = {
    NAME: 'emojipicker_v2',
    VER:  1,
    _db:  null,

    open() {
      if (this._db) return Promise.resolve(this._db);
      return new Promise((res, rej) => {
        const req = indexedDB.open(this.NAME, this.VER);
        req.onupgradeneeded = e => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains('cache'))     db.createObjectStore('cache');
          if (!db.objectStoreNames.contains('recent'))    db.createObjectStore('recent',    { keyPath: 'name' });
          if (!db.objectStoreNames.contains('favorites')) db.createObjectStore('favorites', { keyPath: 'name' });
        };
        req.onsuccess = () => { this._db = req.result; res(this._db); };
        req.onerror   = () => rej(req.error);
      });
    },

    _run(stores, mode, fn) {
      return this.open().then(db => new Promise((res, rej) => {
        const tx  = db.transaction(stores, mode);
        const req = fn(tx.objectStore(Array.isArray(stores) ? stores[0] : stores));
        req.onsuccess = () => res(req.result);
        req.onerror   = () => rej(req.error);
      }));
    },

    get(store, key)      { return this._run(store, 'readonly',  s => s.get(key)); },
    put(store, val, key) { return this._run(store, 'readwrite', s => key !== undefined ? s.put(val, key) : s.put(val)); },
    del(store, key)      { return this._run(store, 'readwrite', s => s.delete(key)); },
    getAll(store)        { return this._run(store, 'readonly',  s => s.getAll()); },
    clear(store)         { return this._run(store, 'readwrite', s => s.clear()); },
  };

  /* ==========================================================================
     Emoji Support Detection  —  canvas-based, detects unsupported glyphs
     ========================================================================== */
  const EmojiSupport = {
    _cache: {},
    _ctx:   null,

    _getCtx() {
      if (!this._ctx) {
        const c = document.createElement('canvas');
        c.width = c.height = 2;
        this._ctx = c.getContext('2d');
      }
      return this._ctx;
    },

    /** Returns true if the OS can render this emoji character */
    test(emoji) {
      if (this._cache[emoji] !== undefined) return this._cache[emoji];
      try {
        const ctx = this._getCtx();
        ctx.clearRect(0, 0, 2, 2);
        ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, 2, 2);
        ctx.font = '1.5px serif'; ctx.fillStyle = '#000';
        ctx.fillText(emoji, 0, 1.5);
        const px = ctx.getImageData(0, 0, 2, 2).data;
        let ok = false;
        for (let i = 0; i < px.length; i += 4) {
          if (px[i] < 245 || px[i+1] < 245 || px[i+2] < 245) { ok = true; break; }
        }
        return (this._cache[emoji] = ok);
      } catch { return (this._cache[emoji] = true); }
    },

    /**
     * Filter emoji list to only those the OS can render.
     * Uses version sentinels to avoid testing every emoji individually.
     * Emojis with `v` property > maxVersion are hidden.
     */
    filter(emojis) {
      if (this._maxFloat === undefined) {
        const sentinels = [
          { v: 15.1, e: '🙂\u200D\u2195\uFE0F' },
          { v: 15.0, e: '🫨' },
          { v: 14.0, e: '🫠' },
          { v: 13.1, e: '😶\u200D🌫️' },
          { v: 13.0, e: '🥲' },
          { v: 12.0, e: '🥰' },
          { v: 11.0, e: '🧡' },
        ];
        this._maxFloat = 11.0;
        for (const { v, e } of sentinels) {
          if (this.test(e)) { this._maxFloat = v; break; }
        }
      }
      const max = this._maxFloat;
      return emojis.filter(e => !e.v || parseFloat(e.v) <= max);
    }
  };

  /* ==========================================================================
     EventEmitter
     ========================================================================== */
  class EventEmitter {
    constructor() { this._ev = {}; }
    on(e, fn)     { (this._ev[e] = this._ev[e] || []).push(fn); return this; }
    off(e, fn)    { if (this._ev[e]) this._ev[e] = this._ev[e].filter(h => h !== fn); return this; }
    emit(e, ...a) { (this._ev[e] || []).slice().forEach(h => h(...a)); return this; }
  }

  /* ==========================================================================
     Constants
     ========================================================================== */
  const SKIN_TONES = [
    { name: 'default',      modifier: '',          label: '🖐️'  },
    { name: 'light',        modifier: '\u{1F3FB}', label: '🖐🏻' },
    { name: 'medium-light', modifier: '\u{1F3FC}', label: '🖐🏼' },
    { name: 'medium',       modifier: '\u{1F3FD}', label: '🖐🏽' },
    { name: 'medium-dark',  modifier: '\u{1F3FE}', label: '🖐🏾' },
    { name: 'dark',         modifier: '\u{1F3FF}', label: '🖐🏿' },
  ];

  const CAT_ICONS = {
    recent: '🕐', 'Smileys & Emotion': '😊', 'People & Body': '👋',
    'Animals & Nature': '🐶', 'Food & Drink': '🍕', Activities: '⚽',
    'Travel & Places': '✈️', Objects: '💡', Symbols: '❤️', Flags: '🏳️', custom: '✨'
  };

  /* ==========================================================================
     EmojiPicker
     ========================================================================== */
  class EmojiPicker extends EventEmitter {

    static DATA_VERSION = '2.0';
    static LOCALES      = LOCALES;

    static _defaults = {
      theme:        'auto',
      mode:         'dropdown',
      locale:       'en',
      search:       true,
      recentEmojis: true,
      maxRecent:    24,
      skinTone:     'default',
      customEmojis: [],
      container:    null,
      perRow:       8,
      emojiSize:    28,
      autoClose:    true,
      dataUrl:      null,
    };

    constructor(opts = {}) {
      super();
      this.options      = { ...EmojiPicker._defaults, ...opts };
      this._t           = LOCALES[this.options.locale] || LOCALES.en;
      this._open        = false;
      this._cat         = 'recent';
      this._query       = '';
      this._tone        = SKIN_TONES.find(s => s.name === this.options.skinTone) || SKIN_TONES[0];
      this._triggerEl   = null;
      this._pickerEl    = null;
      this._data        = null;
      this._flat        = null;
      this._dataPromise = null;
      this._setup();
    }

    /* ------------------------------------------------------------------
       Setup
       ------------------------------------------------------------------ */
    _setup() {
      if (this.options.container) {
        const el = typeof this.options.container === 'string'
          ? document.querySelector(this.options.container)
          : this.options.container;
        if (el) {
          this._triggerEl = el;
          el.addEventListener('click', e => { e.stopPropagation(); this.toggle(); });
        }
      }

      document.addEventListener('click', e => {
        if (!this._open || !this._pickerEl) return;
        if (!this._pickerEl.contains(e.target) && (!this._triggerEl || !this._triggerEl.contains(e.target))) this.close();
      });

      document.addEventListener('keydown', e => {
        if (this._open && e.key === 'Escape') { e.preventDefault(); this.close(); }
      });

      // Start background data fetch immediately
      this._fetchData();

      if (this.options.mode === 'inline') this._render();
    }

    /* ------------------------------------------------------------------
       Data loading
       ------------------------------------------------------------------ */
    _resolveUrl() {
      if (this.options.dataUrl) return this.options.dataUrl;
      const scripts = document.querySelectorAll('script[src]');
      for (const s of scripts) {
        if (s.src && /emoji-picker/.test(s.src))
          return s.src.replace(/emoji-picker\.js(\?.*)?$/, 'emoji-data.json');
      }
      return './emoji-data.json';
    }

    _fetchData() {
      if (this._dataPromise) return this._dataPromise;
      this._dataPromise = (async () => {
        // 1. Try IndexedDB cache first
        try {
          const cached = await EmojiDB.get('cache', 'emojidata');
          if (cached && cached.v === EmojiPicker.DATA_VERSION) {
            this._data = cached.d;
            this._buildFlat();
            return;
          }
        } catch {}

        // 2. Fetch from network
        try {
          const res  = await fetch(this._resolveUrl());
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const json = await res.json();
          this._data = json;
          this._buildFlat();
          // Cache asynchronously
          EmojiDB.put('cache', { v: EmojiPicker.DATA_VERSION, d: json }, 'emojidata').catch(() => {});
        } catch (err) {
          console.warn('[EmojiPicker] Failed to load emoji data:', err);
          this._data = {};
        }
      })();
      return this._dataPromise;
    }

    _buildFlat() {
      this._flat = [];
      for (const [cat, arr] of Object.entries(this._data || {}))
        for (const e of arr) this._flat.push({ ...e, category: cat });
    }

    /* ------------------------------------------------------------------
       Render
       ------------------------------------------------------------------ */
    _render() {
      if (this._pickerEl) this._pickerEl.remove();

      const isDark = this.options.theme === 'dark' ||
        (this.options.theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);

      const el = document.createElement('div');
      el.className = `ep-picker ${isDark ? 'ep-dark' : 'ep-light'}`;
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-label', 'Emoji Picker');
      el.setAttribute('aria-modal', 'true');
      el.addEventListener('click', e => e.stopPropagation());

      if (this.options.mode === 'inline') {
        el.classList.add('ep-inline');
        const c = typeof this.options.container === 'string'
          ? document.querySelector(this.options.container)
          : this.options.container;
        (c || document.body).appendChild(el);
      } else {
        el.classList.add('ep-floating');
        document.body.appendChild(el);
      }

      el.innerHTML   = this._buildHTML();
      this._pickerEl = el;
      this._bindEvents();
      this._position();

      if (this._data) {
        this._buildTabs();
        this._renderCat(this._cat);
      } else {
        this._showSkeleton();
        this._fetchData().then(() => {
          this._buildTabs();
          this._renderCat(this._cat);
        });
      }
    }

    _buildHTML() {
      const skinBtns = SKIN_TONES.map(t => `
        <button class="ep-skin-btn${t.name === this._tone.name ? ' ep-active' : ''}"
          data-skin="${t.name}" type="button"
          title="${this._t.skinTones[t.name]}"
          aria-label="${this._t.skinTones[t.name]}">${t.label}</button>`).join('');

      return `<div class="ep-inner">
        ${this.options.search ? `
          <div class="ep-search-row">
            <div class="ep-search-wrap">
              <svg class="ep-search-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1.5"/>
                <path d="M14 14l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              <input class="ep-search" type="text"
                placeholder="${this._t.search}" aria-label="${this._t.search}"
                autocomplete="off" spellcheck="false" autocorrect="off">
              <button class="ep-search-clear" type="button" aria-label="Clear" style="display:none">✕</button>
            </div>
          </div>` : ''}
        <div class="ep-cats" role="tablist" aria-label="Emoji categories"></div>
        <div class="ep-category-label" aria-live="polite"></div>
        <div class="ep-grid-wrap"><div class="ep-grid" role="grid" aria-label="Emoji grid"></div></div>
        <div class="ep-footer">
          <div class="ep-skin-tones" role="group" aria-label="Skin tone">${skinBtns}</div>
          <div class="ep-preview" aria-live="polite">
            <span class="ep-preview-char" aria-hidden="true"></span>
            <span class="ep-preview-name"></span>
          </div>
        </div>
      </div>`;
    }

    _buildTabs() {
      const el = this._pickerEl && this._pickerEl.querySelector('.ep-cats');
      if (!el) return;
      const cats = ['recent', ...Object.keys(this._data || {})];
      if (this.options.customEmojis && this.options.customEmojis.length) cats.push('custom');

      el.innerHTML = cats.map((cat, i) => `
        <button class="ep-cat-tab${i === 0 ? ' ep-active' : ''}"
          data-cat="${cat}" type="button" role="tab"
          aria-selected="${i === 0}"
          aria-label="${this._t.categories[cat] || cat}"
          title="${this._t.categories[cat] || cat}">${CAT_ICONS[cat] || '✨'}</button>`).join('');

      el.querySelectorAll('.ep-cat-tab').forEach(tab =>
        tab.addEventListener('click', () => {
          const cat = tab.dataset.cat;
          this._cat = cat; this._query = '';
          if (this.options.search) {
            const inp = this._pickerEl.querySelector('.ep-search');
            const clr = this._pickerEl.querySelector('.ep-search-clear');
            if (inp) inp.value = '';
            if (clr) clr.style.display = 'none';
          }
          this._setActiveTab(cat);
          this._renderCat(cat);
          this.emit('categoryChange', { category: cat });
        })
      );
    }

    _bindEvents() {
      const el = this._pickerEl;

      // Search
      if (this.options.search) {
        const inp = el.querySelector('.ep-search');
        const clr = el.querySelector('.ep-search-clear');
        inp && inp.addEventListener('input', e => {
          this._query = e.target.value.trim();
          if (clr) clr.style.display = this._query ? 'flex' : 'none';
          this._query ? this._renderSearch(this._query) : this._renderCat(this._cat);
          if (this._query) this.emit('search', { query: this._query });
        });
        clr && clr.addEventListener('click', () => {
          inp.value = ''; this._query = '';
          clr.style.display = 'none';
          this._renderCat(this._cat);
          inp.focus();
        });
      }

      // Skin tones
      el.querySelectorAll('.ep-skin-btn').forEach(btn =>
        btn.addEventListener('click', () => {
          this._tone = SKIN_TONES.find(s => s.name === btn.dataset.skin) || SKIN_TONES[0];
          el.querySelectorAll('.ep-skin-btn').forEach(b => b.classList.remove('ep-active'));
          btn.classList.add('ep-active');
          this._query ? this._renderSearch(this._query) : this._renderCat(this._cat);
        })
      );

      // Emoji grid — fully delegated
      const grid = el.querySelector('.ep-grid');
      if (grid) {
        grid.addEventListener('click', e => {
          const btn = e.target.closest('.ep-emoji-btn');
          if (btn) this._onEmojiClick(JSON.parse(btn.dataset.emoji), e);
        });
        grid.addEventListener('mouseover', e => {
          const btn = e.target.closest('.ep-emoji-btn');
          if (!btn) return;
          const d = JSON.parse(btn.dataset.emoji);
          const pc = el.querySelector('.ep-preview-char');
          const pn = el.querySelector('.ep-preview-name');
          if (pc) pc.textContent = d.char || '';
          if (pn) pn.textContent = d.name.replace(/_/g, ' ');
          this.emit('emojiHover', d, e);
        });
        grid.addEventListener('mouseout', () => {
          const pc = el.querySelector('.ep-preview-char');
          const pn = el.querySelector('.ep-preview-name');
          if (pc) pc.textContent = '';
          if (pn) pn.textContent = '';
        });
      }
    }

    /* ------------------------------------------------------------------
       Grid rendering
       ------------------------------------------------------------------ */
    _showSkeleton() {
      const grid = this._pickerEl && this._pickerEl.querySelector('.ep-grid');
      if (grid) grid.innerHTML = Array(32).fill('<div class="ep-skeleton"></div>').join('');
    }

    async _renderCat(cat) {
      const grid  = this._pickerEl && this._pickerEl.querySelector('.ep-grid');
      const label = this._pickerEl && this._pickerEl.querySelector('.ep-category-label');
      if (!grid) return;
      if (!this._data) { this._showSkeleton(); return; }

      let emojis = [];
      if (cat === 'recent') {
        try {
          const rows = await EmojiDB.getAll('recent');
          rows.sort((a, b) => b.ts - a.ts);
          emojis = rows.slice(0, this.options.maxRecent);
        } catch {}
        if (label) label.textContent = emojis.length ? this._t.recent : this._t.noRecent;
      } else if (cat === 'custom') {
        emojis = (this.options.customEmojis || []).map(c => ({
          char: null, name: c.name, category: 'custom', unicode: null, isCustom: true, url: c.url
        }));
        if (label) label.textContent = this._t.custom;
      } else {
        const raw = (this._data[cat] || []).map(e => ({ ...e, category: cat }));
        emojis = EmojiSupport.filter(raw).map(e => ({ ...e, char: this._applyTone(e) }));
        if (label) label.textContent = this._t.categories[cat] || cat;
      }

      this._paint(grid, emojis, emojis.length ? null : this._t.noRecent);
    }

    _renderSearch(query) {
      const grid  = this._pickerEl && this._pickerEl.querySelector('.ep-grid');
      const label = this._pickerEl && this._pickerEl.querySelector('.ep-category-label');
      if (!grid || !this._flat) return;

      const q = query.toLowerCase();
      const results = this._flat
        .filter(e =>
          e.name.toLowerCase().includes(q) ||
          e.name.replace(/_/g, ' ').toLowerCase().includes(q) ||
          (e.kw && e.kw.some(k => k.toLowerCase().includes(q))))
        .slice(0, 72)
        .map(e => ({ ...e, char: this._applyTone(e) }));

      if (label) label.textContent = results.length
        ? `"${query}" — ${results.length}`
        : `${this._t.noResults} "${query}"`;

      this._paint(grid, results, results.length ? null : `${this._t.noResults} "${query}"`);
    }

    _paint(grid, emojis, emptyMsg) {
      grid.innerHTML = '';
      if (emptyMsg || !emojis.length) {
        grid.innerHTML = `<div class="ep-empty">${emptyMsg || ''}</div>`;
        return;
      }
      const frag = document.createDocumentFragment();
      for (const e of emojis) {
        const btn = document.createElement('button');
        btn.className = 'ep-emoji-btn';
        btn.type      = 'button';
        btn.setAttribute('role', 'gridcell');
        btn.setAttribute('aria-label', e.name.replace(/_/g, ' '));
        btn.setAttribute('title', e.name.replace(/_/g, ' '));
        const payload = {
          char:     e.char || null,
          name:     e.name,
          category: e.category,
          unicode:  e.unicode || (e.char ? e.char.codePointAt(0).toString(16).toUpperCase() : null),
          skinTone: this._tone.name === 'default' ? null : this._tone.name,
          isCustom: !!e.isCustom
        };
        btn.dataset.emoji = JSON.stringify(payload);
        if (e.isCustom && e.url) {
          const img = document.createElement('img');
          img.src = e.url; img.alt = e.name;
          img.style.cssText = 'width:var(--ep-size,28px);height:var(--ep-size,28px);object-fit:contain;pointer-events:none';
          btn.appendChild(img);
        } else {
          btn.textContent = e.char;
        }
        frag.appendChild(btn);
      }
      grid.appendChild(frag);
    }

    _applyTone(e) {
      if (!e.skinnable || this._tone.name === 'default') return e.char;
      const cp = [...e.char];
      return cp.length ? cp[0] + this._tone.modifier + cp.slice(1).join('') : e.char;
    }

    _setActiveTab(cat) {
      if (!this._pickerEl) return;
      this._pickerEl.querySelectorAll('.ep-cat-tab').forEach(t => {
        const active = t.dataset.cat === cat;
        t.classList.toggle('ep-active', active);
        t.setAttribute('aria-selected', active);
      });
    }

    _position() {
      if (!this._pickerEl || this.options.mode === 'inline') return;
      const el = this._pickerEl;
      if (!this._triggerEl) {
        el.style.cssText += ';position:fixed;top:50%;left:50%;transform:translate(-50%,-50%)';
        return;
      }
      requestAnimationFrame(() => {
        const r  = this._triggerEl.getBoundingClientRect();
        const pw = el.offsetWidth  || 352;
        const ph = el.offsetHeight || 450;
        let top  = r.bottom + 8;
        let left = r.left;
        if (top  + ph > window.innerHeight) top  = Math.max(8, r.top - ph - 8);
        if (left + pw > window.innerWidth)  left = Math.max(8, window.innerWidth - pw - 8);
        el.style.top  = `${top}px`;
        el.style.left = `${left}px`;
      });
    }

    /* ------------------------------------------------------------------
       Emoji click handler
       ------------------------------------------------------------------ */
    async _onEmojiClick(data, event) {
      // IndexedDB: increment favorite count
      try {
        const prev = await EmojiDB.get('favorites', data.name);
        await EmojiDB.put('favorites', {
          name:  data.name,
          char:  data.char,
          count: ((prev && prev.count) || 0) + 1
        });
      } catch {}

      // IndexedDB: update recents
      if (this.options.recentEmojis && !data.isCustom) {
        try {
          await EmojiDB.put('recent', { ...data, ts: Date.now() });
          const all = await EmojiDB.getAll('recent');
          all.sort((a, b) => b.ts - a.ts);
          for (const old of all.slice(this.options.maxRecent))
            await EmojiDB.del('recent', old.name);
        } catch {}
      }

      // Pop animation
      if (this._pickerEl) {
        const safe = JSON.stringify(data).replace(/'/g, "\\'");
        const btn  = this._pickerEl.querySelector(`[data-emoji='${safe}']`);
        if (btn) { btn.classList.add('ep-pop'); setTimeout(() => btn.classList.remove('ep-pop'), 300); }
      }

      this.emit('emojiClick', data, event);
      if (this.options.autoClose && this.options.mode !== 'inline') this.close();
    }

    /* ------------------------------------------------------------------
       Public API
       ------------------------------------------------------------------ */
    open() {
      if (this._open) return this;
      this._open = true;
      if (!this._pickerEl) this._render();
      this._pickerEl.style.display = '';
      this._pickerEl.classList.add('ep-visible');
      this._cat = 'recent';
      if (this._data) { this._buildTabs(); this._renderCat('recent'); }
      this._position();
      this.emit('pickerOpen');
      setTimeout(() => {
        const s = this._pickerEl && this._pickerEl.querySelector('.ep-search');
        if (s && this.options.search) s.focus();
      }, 60);
      return this;
    }

    close() {
      if (!this._open) return this;
      this._open = false;
      if (this._pickerEl) this._pickerEl.classList.remove('ep-visible');
      this.emit('pickerClose');
      return this;
    }

    toggle()  { return this._open ? this.close() : this.open(); }

    destroy() {
      if (this._pickerEl) { this._pickerEl.remove(); this._pickerEl = null; }
      this._ev = {};
    }

    setTheme(theme) {
      this.options.theme = theme;
      if (this._pickerEl) {
        const dark = theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        this._pickerEl.classList.toggle('ep-dark',  dark);
        this._pickerEl.classList.toggle('ep-light', !dark);
      }
      return this;
    }

    setLocale(locale) {
      this.options.locale = locale;
      this._t = LOCALES[locale] || LOCALES.en;
      if (this._pickerEl) {
        const was = this._open;
        this._pickerEl.remove(); this._pickerEl = null; this._open = false;
        if (was) this.open();
        else if (this.options.mode === 'inline') this._render();
      }
      return this;
    }

    /** Returns top N emojis by click count */
    async getTopFavorites(n = 8) {
      try {
        const all = await EmojiDB.getAll('favorites');
        return all.sort((a, b) => b.count - a.count).slice(0, n);
      } catch { return []; }
    }

    async clearRecent() {
      try { await EmojiDB.clear('recent'); } catch {}
      if (this._cat === 'recent' && this._pickerEl) this._renderCat('recent');
      return this;
    }

    async clearFavorites() {
      try { await EmojiDB.clear('favorites'); } catch {}
      return this;
    }

    /* ------------------------------------------------------------------
       Static helpers
       ------------------------------------------------------------------ */
    static attachToInput(selector, opts = {}) {
      const input = typeof selector === 'string' ? document.querySelector(selector) : selector;
      if (!input) return null;

      const wrap = document.createElement('span');
      wrap.style.cssText = 'position:relative;display:inline-flex;align-items:center;gap:4px';
      input.parentNode.insertBefore(wrap, input);
      wrap.appendChild(input);

      const btn = document.createElement('button');
      btn.type = 'button'; btn.textContent = '😊';
      btn.setAttribute('aria-label', 'Open emoji picker');
      btn.style.cssText = 'background:none;border:none;cursor:pointer;font-size:22px;padding:4px;line-height:1;border-radius:6px;transition:transform 0.15s;flex-shrink:0';
      btn.addEventListener('mouseenter', () => (btn.style.transform = 'scale(1.2)'));
      btn.addEventListener('mouseleave', () => (btn.style.transform = 'scale(1)'));
      wrap.appendChild(btn);

      const picker = new EmojiPicker({ container: btn, mode: 'dropdown', ...opts });
      picker.on('emojiClick', emoji => {
        if (!emoji.char) return;
        const s = input.selectionStart != null ? input.selectionStart : input.value.length;
        const e = input.selectionEnd   != null ? input.selectionEnd   : s;
        input.value = input.value.slice(0, s) + emoji.char + input.value.slice(e);
        const pos = s + emoji.char.length;
        input.setSelectionRange(pos, pos);
        input.focus();
        input.dispatchEvent(new Event('input',  { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
      return picker;
    }

    /** Warm up: fetches and caches emoji data without showing any UI */
    static async preload(opts = {}) {
      const p = new EmojiPicker(opts);
      await p._fetchData();
      return p;
    }
  }

  /* ==========================================================================
     CSS
     ========================================================================== */
  if (!document.getElementById('ep-styles')) {
    const s = document.createElement('style');
    s.id = 'ep-styles';
    s.textContent = `
.ep-picker {
  --ep-bg:         #16192a;
  --ep-surface:    #1e2236;
  --ep-border:     rgba(255,255,255,0.07);
  --ep-text:       #e2e6f5;
  --ep-text-dim:   #636b86;
  --ep-accent:     #6c63ff;
  --ep-hover:      rgba(108,99,255,0.13);
  --ep-active-tab: rgba(108,99,255,0.22);
  --ep-size:       28px;
  --ep-radius:     18px;
  --ep-shadow:     0 24px 64px rgba(0,0,0,0.55),0 0 0 1px rgba(255,255,255,0.06);
  --ep-search-bg:  rgba(255,255,255,0.04);
  font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
}
.ep-picker.ep-light {
  --ep-bg:         #fff;
  --ep-surface:    #f4f5fa;
  --ep-border:     rgba(0,0,0,0.07);
  --ep-text:       #1a1d2e;
  --ep-text-dim:   #8b93ad;
  --ep-accent:     #5b52f0;
  --ep-hover:      rgba(91,82,240,0.08);
  --ep-active-tab: rgba(91,82,240,0.13);
  --ep-search-bg:  rgba(0,0,0,0.04);
  --ep-shadow:     0 16px 48px rgba(0,0,0,0.14),0 0 0 1px rgba(0,0,0,0.06);
}
.ep-picker.ep-floating {
  position:fixed;z-index:2147483647;width:352px;
  display:none;opacity:0;
  transform:translateY(8px) scale(0.96);
  transform-origin:top left;
  transition:opacity .16s ease,transform .16s ease;
  pointer-events:none;
}
.ep-picker.ep-floating.ep-visible {
  display:block;opacity:1;transform:none;pointer-events:auto;
}
.ep-picker.ep-inline { position:relative;width:100%; }
.ep-inner {
  background:var(--ep-bg);border-radius:var(--ep-radius);
  box-shadow:var(--ep-shadow);border:1px solid var(--ep-border);
  overflow:hidden;display:flex;flex-direction:column;
}
.ep-search-row { padding:12px 12px 8px; }
.ep-search-wrap { position:relative;display:flex;align-items:center; }
.ep-search-icon { position:absolute;left:10px;width:14px;height:14px;color:var(--ep-text-dim);pointer-events:none; }
.ep-search {
  width:100%;background:var(--ep-search-bg);border:1px solid var(--ep-border);
  border-radius:10px;color:var(--ep-text);font-size:13px;font-family:inherit;
  padding:8px 30px 8px 30px;outline:none;
  transition:border-color .15s,box-shadow .15s;
}
.ep-search:focus { border-color:var(--ep-accent);box-shadow:0 0 0 3px rgba(108,99,255,0.15); }
.ep-search::placeholder { color:var(--ep-text-dim); }
.ep-search-clear {
  position:absolute;right:8px;background:none;border:none;color:var(--ep-text-dim);
  cursor:pointer;font-size:11px;padding:3px 5px;border-radius:4px;
  display:flex;align-items:center;transition:color .12s;
}
.ep-search-clear:hover { color:var(--ep-text); }
.ep-cats {
  display:flex;padding:2px 8px 0;gap:1px;
  border-bottom:1px solid var(--ep-border);
  overflow-x:auto;scrollbar-width:none;
}
.ep-cats::-webkit-scrollbar { display:none; }
.ep-cat-tab {
  flex:none;background:none;border:none;cursor:pointer;
  font-size:17px;padding:8px 8px 6px;border-radius:8px 8px 0 0;
  transition:background .12s,transform .1s;line-height:1;position:relative;outline:none;
}
.ep-cat-tab:hover { background:var(--ep-hover);transform:scale(1.12); }
.ep-cat-tab.ep-active { background:var(--ep-active-tab); }
.ep-cat-tab.ep-active::after {
  content:'';position:absolute;bottom:0;left:50%;transform:translateX(-50%);
  width:16px;height:2px;border-radius:2px 2px 0 0;background:var(--ep-accent);
}
.ep-category-label {
  font-size:10px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;
  color:var(--ep-text-dim);padding:8px 14px 2px;min-height:24px;
}
.ep-grid-wrap {
  height:264px;overflow-y:auto;padding:4px 8px 8px;
  scrollbar-width:thin;scrollbar-color:var(--ep-border) transparent;
}
.ep-grid-wrap::-webkit-scrollbar { width:4px; }
.ep-grid-wrap::-webkit-scrollbar-thumb { background:var(--ep-border);border-radius:2px; }
.ep-grid { display:grid;grid-template-columns:repeat(8,1fr);gap:1px; }
.ep-emoji-btn {
  background:none;border:none;cursor:pointer;
  font-size:var(--ep-size);line-height:1;padding:4px;border-radius:8px;
  transition:background .08s,transform .1s;
  display:flex;align-items:center;justify-content:center;
  user-select:none;outline:none;aspect-ratio:1;
  -webkit-tap-highlight-color:transparent;
}
.ep-emoji-btn:hover { background:var(--ep-hover);transform:scale(1.22);z-index:1;position:relative; }
.ep-emoji-btn:active { transform:scale(0.88); }
.ep-emoji-btn.ep-pop { animation:ep-pop .28s cubic-bezier(.36,.07,.19,.97); }
@keyframes ep-pop {
  0%  { transform:scale(1); }
  35% { transform:scale(1.45); }
  65% { transform:scale(0.82); }
  100%{ transform:scale(1); }
}
.ep-skeleton {
  aspect-ratio:1;border-radius:8px;
  background:linear-gradient(90deg,var(--ep-surface) 25%,var(--ep-border) 50%,var(--ep-surface) 75%);
  background-size:200% 100%;animation:ep-shimmer 1.4s infinite;
}
@keyframes ep-shimmer { 0%{background-position:200% 0}100%{background-position:-200% 0} }
.ep-empty,.ep-loading {
  grid-column:1/-1;padding:32px 12px;
  text-align:center;color:var(--ep-text-dim);font-size:13px;
}
.ep-footer {
  border-top:1px solid var(--ep-border);padding:7px 10px;
  display:flex;align-items:center;gap:8px;
}
.ep-skin-tones { display:flex;gap:3px; }
.ep-skin-btn {
  background:none;border:2px solid transparent;cursor:pointer;
  padding:1px;border-radius:50%;font-size:15px;line-height:1;
  transition:border-color .12s,transform .1s;outline:none;
}
.ep-skin-btn:hover { transform:scale(1.18);border-color:var(--ep-border); }
.ep-skin-btn.ep-active { border-color:var(--ep-accent); }
.ep-preview {
  flex:1;display:flex;align-items:center;gap:6px;
  justify-content:flex-end;min-height:22px;overflow:hidden;
}
.ep-preview-char { font-size:20px;line-height:1;flex-shrink:0; }
.ep-preview-name { font-size:11px;color:var(--ep-text-dim);overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }
`;
    document.head.appendChild(s);
  }

  return EmojiPicker;

})); // UMD end