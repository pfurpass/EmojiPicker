# EmojiPicker.js

> A flexible, event-driven emoji picker library for the web.  
> Zero dependencies. Full developer control. Framework agnostic.
> https://pfurpass.github.io/EmojiPicker/

```js
const picker = new EmojiPicker({ container: '#btn' })
picker.on('emojiClick', (emoji) => console.log(emoji.char)) // 😂
```

---

## Table of Contents

- [Installation](#installation)
- [Setup — Two Files](#setup--two-files)
- [Quick Start](#quick-start)
- [Configuration Options](#configuration-options)
- [Events](#events)
- [Methods](#methods)
- [Emoji Object](#emoji-object)
- [Modes](#modes)
- [Skin Tone Support](#skin-tone-support)
- [Theming & CSS Variables](#theming--css-variables)
- [Custom Emojis](#custom-emojis)
- [Helper: attachToInput()](#helper-attachtoinput)
- [Favorites & getTopFavorites()](#favorites--gettopfavorites)
- [i18n / Localization](#i18n--localization)
- [TypeScript](#typescript)
- [Framework Integration](#framework-integration)
- [Recipes / Examples](#recipes--examples)
- [Accessibility](#accessibility)
- [Browser Support](#browser-support)
- [How It Works Internally](#how-it-works-internally)

---

## Installation

### npm

```bash
npm install @schwitzerskills/emojipicker
```

### CDN (jsDelivr)

```html
<script src="https://cdn.jsdelivr.net/npm/@schwitzerskills/emojipicker/emoji-picker.js"></script>
```

---

## Setup — Two Files

> **Important:** The library needs two files to work.

| File | Purpose |
|------|---------|
| `emoji-picker.js` | The picker core (~5 KB) |
| `emoji-data.json` | All emoji data (~850 KB, loaded once, cached forever) |

Both files must be accessible at the same URL path. The library auto-detects `emoji-data.json` relative to its own `<script src>` tag.

**If you use npm / a bundler**, copy `emoji-data.json` to your public/static folder and pass the URL manually:

```js
new EmojiPicker({
  container: '#btn',
  dataUrl: '/static/emoji-data.json'  // or your CDN URL
})
```

**If you use CDN**, both files are already on jsDelivr — no config needed:

```html
<script src="https://cdn.jsdelivr.net/npm/@schwitzerskills/emojipicker/emoji-picker.js"></script>
```

**How the caching works:**

1. First visit → `emoji-data.json` is fetched once (~850 KB)
2. Data is stored in **IndexedDB** on the user's device
3. Every visit after that → loaded from IndexedDB in milliseconds, zero network request

---

## Quick Start

### CDN / Vanilla JS

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My App</title>
</head>
<body>

  <input type="text" id="message" placeholder="Type a message...">
  <button id="emoji-btn">😊</button>

  <script src="https://cdn.jsdelivr.net/npm/@schwitzerskills/emojipicker/emoji-picker.js"></script>
  <script>
    const picker = new EmojiPicker({ container: '#emoji-btn' })
    picker.on('emojiClick', (emoji) => {
      document.querySelector('#message').value += emoji.char
    })
  </script>

</body>
</html>
```

### npm / Bundler (Vite, Webpack, etc.)

```js
import EmojiPicker from '@schwitzerskills/emojipicker'

const picker = new EmojiPicker({
  container: '#emoji-btn',
  dataUrl:   '/public/emoji-data.json'   // adjust to your setup
})

picker.on('emojiClick', (emoji) => {
  document.querySelector('#message').value += emoji.char
})
```

### One-liner with `attachToInput()`

```js
import EmojiPicker from '@schwitzerskills/emojipicker'

// Automatically adds a 😊 button and inserts emoji at cursor
EmojiPicker.attachToInput('#message')
```

---

## Configuration Options

All properties are optional.

```js
const picker = new EmojiPicker({
  container:    '#my-button',
  theme:        'auto',
  mode:         'dropdown',
  locale:       'en',
  search:       true,
  recentEmojis: true,
  maxRecent:    24,
  skinTone:     'default',
  customEmojis: [],
  perRow:       8,
  emojiSize:    28,
  autoClose:    true,
  dataUrl:      null,
})
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `container` | `string \| HTMLElement` | `null` | Trigger element — toggles picker on click |
| `theme` | `string` | `'auto'` | `'light'`, `'dark'`, or `'auto'` |
| `mode` | `string` | `'dropdown'` | See [Modes](#modes) |
| `locale` | `string` | `'en'` | UI language — see [i18n](#i18n--localization) |
| `search` | `boolean` | `true` | Show/hide search input |
| `recentEmojis` | `boolean` | `true` | Track recents in IndexedDB |
| `maxRecent` | `number` | `24` | Max recent emojis to store |
| `skinTone` | `string` | `'default'` | Default skin tone |
| `customEmojis` | `array` | `[]` | Custom emoji definitions |
| `perRow` | `number` | `8` | Grid columns |
| `emojiSize` | `number` | `28` | Emoji size in px (`--ep-size`) |
| `autoClose` | `boolean` | `true` | Close after selecting |
| `dataUrl` | `string` | `null` | Custom URL to `emoji-data.json` |

---

## Events

```js
picker.on(eventName, handler)   // add listener
picker.off(eventName, handler)  // remove listener
```

### `emojiClick`

Fired when the user selects an emoji. The main event you'll use.

```js
picker.on('emojiClick', (emoji, mouseEvent) => {
  console.log(emoji.char)     // "😂"
  console.log(emoji.name)     // "face_with_tears_of_joy"
  console.log(emoji.category) // "Smileys & Emotion"
  console.log(emoji.unicode)  // "1F602"
  console.log(emoji.skinTone) // null | "medium" | ...
})
```

### `emojiHover`

Fired when hovering over an emoji.

```js
picker.on('emojiHover', (emoji, mouseEvent) => {
  myPreview.textContent = emoji.char + '  ' + emoji.name
})
```

### `pickerOpen` / `pickerClose`

```js
picker.on('pickerOpen',  () => console.log('opened'))
picker.on('pickerClose', () => console.log('closed'))
```

### `categoryChange`

```js
picker.on('categoryChange', ({ category }) => {
  console.log('Switched to:', category) // "Food & Drink"
})
```

### `search`

```js
picker.on('search', ({ query }) => {
  console.log('User typed:', query)
})
```

---

## Methods

All methods return `this` (chainable), except `destroy()` and the async methods.

```js
picker.open()              // open
picker.close()             // close
picker.toggle()            // toggle
picker.setTheme('dark')    // switch theme
picker.setLocale('de')     // switch language
picker.destroy()           // remove from DOM, clean up listeners
```

**Async methods:**

```js
// Returns top N most-clicked emojis
const favs = await picker.getTopFavorites(8)
// → [{ name, char, count }, ...]

// Clear recent history
await picker.clearRecent()

// Clear favorite click counts
await picker.clearFavorites()
```

**Static methods:**

```js
// Attach to any input (see section below)
EmojiPicker.attachToInput('#message', opts)

// Pre-warm: fetch + cache data without showing any UI
// Call this on app startup so first open is instant
await EmojiPicker.preload({ dataUrl: '/static/emoji-data.json' })
```

**Chaining:**

```js
new EmojiPicker({ container: '#btn' })
  .on('emojiClick',  (e) => insertEmoji(e.char))
  .on('pickerOpen',  ()  => analytics.track('picker_opened'))
  .on('pickerClose', ()  => analytics.track('picker_closed'))
```

---

## Emoji Object

Every emoji-related event provides this structure:

```js
{
  char:     "👍🏽",           // emoji character, skin tone applied
  name:     "thumbs_up",     // snake_case identifier
  category: "People & Body", // category name
  unicode:  "1F44D",         // base code point (hex)
  skinTone: "medium",        // null if default
  isCustom: false            // true for custom image emojis
}
```

---

## Modes

### `dropdown` *(default)*

Floating panel anchored to the trigger element. Closes on outside click or `Esc`.

```js
new EmojiPicker({ container: '#btn', mode: 'dropdown' })
```

### `inline`

Always visible, embedded inside the container. `autoClose` is ignored.

```js
new EmojiPicker({ container: '#my-div', mode: 'inline', autoClose: false })
```

```html
<div id="my-div"></div>  <!-- Picker renders here -->
```

### `popup`

Centers in the viewport — ideal for modals or custom trigger logic.

```js
const picker = new EmojiPicker({ mode: 'popup' })
document.getElementById('btn').addEventListener('click', () => picker.open())
```

---

## Skin Tone Support

Users can pick a skin tone in the footer. Set a default in options:

```js
new EmojiPicker({ skinTone: 'medium-dark' })
```

| Value | Example |
|-------|---------|
| `'default'` | 👍 |
| `'light'` | 👍🏻 |
| `'medium-light'` | 👍🏼 |
| `'medium'` | 👍🏽 |
| `'medium-dark'` | 👍🏾 |
| `'dark'` | 👍🏿 |

---

## Theming & CSS Variables

```css
.ep-picker {
  --ep-bg:         #16192a;       /* picker background */
  --ep-surface:    #1e2236;       /* surface / hover bg */
  --ep-border:     rgba(255,255,255,0.07);
  --ep-text:       #e2e6f5;
  --ep-text-dim:   #636b86;
  --ep-accent:     #6c63ff;       /* active tab, focus rings */
  --ep-hover:      rgba(108,99,255,0.13);
  --ep-size:       28px;          /* emoji size */
  --ep-radius:     18px;          /* picker border-radius */
}
```

### Built-in themes

```js
new EmojiPicker({ theme: 'light' })    // light
new EmojiPicker({ theme: 'dark' })     // dark
new EmojiPicker({ theme: 'auto' })     // follows OS

picker.setTheme('dark')                // switch at runtime
```

### Custom brand color

```css
.ep-picker {
  --ep-accent:     #e91e8c;
  --ep-hover:      rgba(233,30,140,0.10);
  --ep-active-tab: rgba(233,30,140,0.18);
}
```

---

## Custom Emojis

Add your own GIFs, PNGs or SVGs alongside the standard set:

```js
new EmojiPicker({
  customEmojis: [
    { name: 'party_parrot', url: '/assets/parrot.gif'  },
    { name: 'company_logo', url: '/assets/logo.png'    },
    { name: 'custom_star',  url: 'https://cdn.example.com/star.svg' }
  ]
})
```

They appear in a dedicated **Custom** tab. Click event returns:

```js
{ char: null, name: 'party_parrot', category: 'custom', isCustom: true }
```

---

## Helper: attachToInput()

Wraps any `<input>` or `<textarea>` and handles cursor-position insertion automatically.

```js
// Basic
EmojiPicker.attachToInput('#message')

// With options
EmojiPicker.attachToInput('#chat-box', {
  theme:    'dark',
  skinTone: 'medium',
  dataUrl:  '/static/emoji-data.json'
})

// Returns the picker instance
const picker = EmojiPicker.attachToInput('#editor')
picker.on('emojiClick', () => updateCharCount())
```

---

## Favorites & getTopFavorites()

Every emoji click is counted and stored in IndexedDB. Use this to build "most used" sections, reaction quick-bars, or analytics.

```js
// Get top 8 most-clicked emojis
const favs = await picker.getTopFavorites(8)
// → [{ name: 'thumbs_up', char: '👍', count: 42 }, ...]

// Render a quick-access bar
favs.forEach(({ char }) => {
  const btn = document.createElement('button')
  btn.textContent = char
  quickBar.appendChild(btn)
})

// Reset counts
await picker.clearFavorites()
```

---

## i18n / Localization

### Built-in languages

| Code | Language |
|------|----------|
| `en` | English *(default)* |
| `de` | German |
| `fr` | French |
| `es` | Spanish |
| `pt` | Portuguese |
| `ja` | Japanese |

```js
// Set at construction
new EmojiPicker({ locale: 'de' })

// Switch at runtime (re-renders if open)
picker.setLocale('fr')
```

### Add a custom language

```js
EmojiPicker.LOCALES['nl'] = {
  search:    'Zoek emoji…',
  noResults: 'Geen resultaten voor',
  noRecent:  'Nog geen recente emojis',
  recent:    'Recent gebruikt',
  custom:    'Aangepast',
  loading:   'Laden…',
  categories: {
    recent: 'Recent', 'Smileys & Emotion': 'Smileys', 'People & Body': 'Mensen',
    'Animals & Nature': 'Natuur', 'Food & Drink': 'Eten', Activities: 'Activiteiten',
    'Travel & Places': 'Reizen', Objects: 'Objecten', Symbols: 'Symbolen',
    Flags: 'Vlaggen', custom: 'Aangepast'
  },
  skinTones: {
    default: 'Standaard', light: 'Licht', 'medium-light': 'Medium licht',
    medium: 'Medium', 'medium-dark': 'Medium donker', dark: 'Donker'
  }
}

new EmojiPicker({ locale: 'nl' })
```

---

## TypeScript

The package ships with a `.d.ts` file. No `@types/` package needed.

```ts
import EmojiPicker, { EmojiObject, EmojiPickerOptions, FavoriteEmoji } from '@schwitzerskills/emojipicker'

const options: EmojiPickerOptions = {
  container: '#btn',
  theme:     'auto',
  locale:    'de',
  dataUrl:   '/static/emoji-data.json'
}

const picker = new EmojiPicker(options)

picker.on('emojiClick', (emoji: EmojiObject) => {
  console.log(emoji.char, emoji.name)
})

const favs: FavoriteEmoji[] = await picker.getTopFavorites(10)
```

---

## Framework Integration

### React

```tsx
import { useEffect, useRef } from 'react'
import EmojiPicker, { EmojiObject } from '@schwitzerskills/emojipicker'

interface Props {
  onSelect: (emoji: EmojiObject) => void
}

export function EmojiButton({ onSelect }: Props) {
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!btnRef.current) return
    const picker = new EmojiPicker({
      container: btnRef.current,
      theme:     'auto',
      dataUrl:   '/static/emoji-data.json'
    })
    picker.on('emojiClick', onSelect)
    return () => picker.destroy()
  }, [onSelect])

  return <button ref={btnRef} type="button">😊</button>
}
```

### Next.js

`EmojiPicker` uses `window` and `document` internally, so it must only run on the client.

**Option A — dynamic import (recommended):**

```tsx
// components/EmojiButton.tsx  ← client-only wrapper
'use client'
import { useEffect, useRef } from 'react'
import EmojiPicker from '@schwitzerskills/emojipicker'

export default function EmojiButton({ onSelect }) {
  const btnRef = useRef(null)
  useEffect(() => {
    const picker = new EmojiPicker({ container: btnRef.current, dataUrl: '/emoji-data.json' })
    picker.on('emojiClick', onSelect)
    return () => picker.destroy()
  }, [onSelect])
  return <button ref={btnRef}>😊</button>
}
```

```tsx
// app/page.tsx  or  pages/index.tsx
import dynamic from 'next/dynamic'

const EmojiButton = dynamic(() => import('../components/EmojiButton'), { ssr: false })
```

**Option B — App Router `'use client'` directive:**

```tsx
'use client'
// useEffect only runs in the browser — safe without ssr:false
```

### Vue 3

```vue
<template>
  <button ref="btnRef">😊</button>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import EmojiPicker, { EmojiObject } from '@schwitzerskills/emojipicker'

const emit   = defineEmits<{ select: [emoji: EmojiObject] }>()
const btnRef = ref<HTMLButtonElement | null>(null)
let picker: EmojiPicker | null = null

onMounted(() => {
  picker = new EmojiPicker({ container: btnRef.value!, dataUrl: '/emoji-data.json' })
  picker.on('emojiClick', (emoji) => emit('select', emoji))
})

onUnmounted(() => picker?.destroy())
</script>
```

### Svelte

```svelte
<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte'
  import EmojiPicker from '@schwitzerskills/emojipicker'

  const dispatch = createEventDispatcher()
  let btnEl: HTMLButtonElement
  let picker: EmojiPicker

  onMount(() => {
    picker = new EmojiPicker({ container: btnEl, dataUrl: '/emoji-data.json' })
    picker.on('emojiClick', (emoji) => dispatch('select', emoji))
  })

  onDestroy(() => picker?.destroy())
</script>

<button bind:this={btnEl}>😊</button>
```

---

## Recipes / Examples

### Insert at cursor in a textarea

```js
const textarea = document.querySelector('#editor')
const picker   = new EmojiPicker({ container: '#btn' })

picker.on('emojiClick', (emoji) => {
  const s = textarea.selectionStart
  const e = textarea.selectionEnd
  textarea.value =
    textarea.value.slice(0, s) + emoji.char + textarea.value.slice(e)
  textarea.setSelectionRange(s + emoji.char.length, s + emoji.char.length)
  textarea.focus()
})
```

### Copy to clipboard

```js
picker.on('emojiClick', (emoji) => {
  navigator.clipboard.writeText(emoji.char).then(() => showToast('Copied!'))
})
```

### Send to a server

```js
picker.on('emojiClick', (emoji) => {
  fetch('/api/reactions', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ messageId, emoji: emoji.name, char: emoji.char })
  })
})
```

### Preload data on app startup

```js
// Call once at app init — data is fetched and cached in IndexedDB.
// Every picker opened after this is instant.
EmojiPicker.preload({ dataUrl: '/static/emoji-data.json' })
```

### Quick-access bar from favorites

```js
const bar = document.getElementById('quick-bar')

async function renderFavBar() {
  const favs = await picker.getTopFavorites(6)
  bar.innerHTML = favs.map(({ char, name }) =>
    `<button title="${name}" onclick="insertEmoji('${char}')">${char}</button>`
  ).join('')
}

picker.on('pickerClose', renderFavBar)
```

### Analytics

```js
picker.on('pickerOpen',     ()             => analytics.track('picker_opened'))
picker.on('emojiClick',     ({ name })     => analytics.track('emoji_used',    { name }))
picker.on('search',         ({ query })    => analytics.track('emoji_search',  { query }))
picker.on('categoryChange', ({ category }) => analytics.track('category_view', { category }))
```

---

## Accessibility

- `role="dialog"` + `aria-modal="true"` on the picker
- `role="tablist"` on category tabs, `aria-selected` on active tab
- `role="grid"` + `role="gridcell"` on emoji grid
- `aria-label` on every emoji button
- `aria-live="polite"` on category label and preview
- `Esc` closes the picker
- Focus moves to the search input on open
- `type="button"` on all buttons — safe inside `<form>` elements

---

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome | 80+ |
| Firefox | 78+ |
| Safari | 14+ |
| Edge | 80+ |
| iOS Safari | 14+ |
| Android Chrome | 80+ |

Requires **IndexedDB** for caching — available in all modern browsers, gracefully degraded if blocked (e.g. Firefox private mode with `resistFingerprinting`).

---

## How It Works Internally

```
First visit:
  emoji-picker.js (~5 KB) loads instantly
  ↓
  picker.open() is called
  ↓
  emoji-data.json is fetched (~850 KB, one time only)
  ↓
  data is stored in IndexedDB

Every visit after:
  emoji-picker.js loads
  ↓
  picker.open() → data loads from IndexedDB in <5ms
  ↓
  zero network request for emoji data
```

**IndexedDB stores:**

| Store | Contents | Key |
|-------|----------|-----|
| `cache` | Full emoji data JSON | `'emojidata'` |
| `recent` | Last used emojis + timestamps | `name` |
| `favorites` | Click counts per emoji | `name` |

**Emoji support detection:**

The library uses a canvas-based test to detect which Unicode Emoji version the OS supports, then hides emojis that would render as broken boxes. Tests run once per session and are cached in memory.

---

## package.json

No separate ESM build is needed. The UMD bundle handles `require()`, `import`, and `<script>` tags.

```json
{
  "name": "@schwitzerskills/emojipicker",
  "version": "2.0.0",
  "main":    "emoji-picker.js",
  "browser": "emoji-picker.js",
  "types":   "emoji-picker.d.ts",
  "exports": {
    ".": {
      "require": "./emoji-picker.js",
      "import":  "./emoji-picker.js",
      "types":   "./emoji-picker.d.ts"
    }
  },
  "files": [
    "emoji-picker.js",
    "emoji-picker.d.ts",
    "emoji-data.json"
  ]
}
```

---

## License

Apache
