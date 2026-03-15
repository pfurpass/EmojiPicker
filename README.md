# EmojiPicker.js

> A flexible, event-driven emoji picker library for the web.  
> Zero dependencies. Full developer control. Framework agnostic.

```js
const picker = new EmojiPicker({ container: '#btn' })
picker.on('emojiClick', (emoji) => console.log(emoji.char)) // 😂
```

---

## Table of Contents

- [Installation](#installation)
- [Module Formats](#module-formats)
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
- [Framework Integration](#framework-integration)
- [Recipes / Examples](#recipes--examples)
- [Accessibility](#accessibility)
- [Browser Support](#browser-support)

---

## Installation

```bash
npm install @schwitzerskills/emojipicker
# or
yarn add @schwitzerskills/emojipicker
# or
pnpm add @schwitzerskills/emojipicker
```

---

## Module Formats

The library ships as a **UMD build** and supports all environments out of the box.

### CommonJS (Node.js / bundlers)

```js
const EmojiPicker = require('emojipicker-js')
```

### ES Module

```js
import EmojiPicker from 'emojipicker-js'
```

### Browser global (CDN / script tag)

```html
<script src="emoji-picker.js"></script>
<script>
  const picker = new EmojiPicker({ container: '#btn' })
</script>
```

### AMD (RequireJS)

```js
define(['emojipicker-js'], function(EmojiPicker) {
  const picker = new EmojiPicker({ container: '#btn' })
})
```

The `package.json` fields are set up accordingly:

```json
{
  "main":    "emoji-picker.js",
  "module":  "emoji-picker.esm.js",
  "browser": "emoji-picker.js",
  "exports": {
    ".": {
      "import":  "./emoji-picker.esm.js",
      "require": "./emoji-picker.js"
    }
  }
}
```

---

## Quick Start

**Step 1 — Add a trigger button to your HTML:**

```html
<button id="emoji-btn">😊</button>
<input type="text" id="message" placeholder="Type a message...">

<script src="emoji-picker.js"></script>
```

**Step 2 — Initialize and listen for events:**

```html
<script>
  const picker = new EmojiPicker({
    container: '#emoji-btn',
    theme: 'auto'
  })

  picker.on('emojiClick', (emoji) => {
    document.querySelector('#message').value += emoji.char
  })
</script>
```

That's it. Clicking `#emoji-btn` opens the picker. Clicking an emoji fires `emojiClick`.

---

## Configuration Options

All properties are optional.

```js
const picker = new EmojiPicker({
  container:    '#my-button',   // Trigger element (CSS selector or DOM node)
  theme:        'auto',         // 'light' | 'dark' | 'auto'
  mode:         'dropdown',     // 'dropdown' | 'inline' | 'popup'
  search:       true,           // Show search input
  recentEmojis: true,           // Track & show recently used emojis
  maxRecent:    24,             // Max number of recent emojis to store
  skinTone:     'default',      // Default skin tone (see Skin Tone Support)
  customEmojis: [],             // Array of custom emoji objects
  perRow:       8,              // Emojis per row in the grid
  emojiSize:    28,             // Emoji size in pixels
  autoClose:    true,           // Close picker after selecting an emoji
})
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `container` | `string \| HTMLElement` | `null` | Element that triggers open/close on click |
| `theme` | `string` | `'auto'` | Color theme: `'light'`, `'dark'`, or `'auto'` |
| `mode` | `string` | `'dropdown'` | Display mode (see [Modes](#modes)) |
| `search` | `boolean` | `true` | Show/hide the search input |
| `recentEmojis` | `boolean` | `true` | Enable recent emojis tab (uses localStorage) |
| `maxRecent` | `number` | `24` | Max recent emojis to remember |
| `skinTone` | `string` | `'default'` | Default skin tone modifier |
| `customEmojis` | `array` | `[]` | Custom emoji definitions |
| `perRow` | `number` | `8` | Grid columns |
| `emojiSize` | `number` | `28` | Emoji size in px |
| `autoClose` | `boolean` | `true` | Auto-close picker on emoji select |

---

## Events

The library is fully event-driven. Attach any number of listeners to any event.

```js
picker.on(eventName, handler)
picker.off(eventName, handler)  // Remove a specific listener
```

### `emojiClick`

Fired when the user clicks/selects an emoji. This is the main event you'll use.

```js
picker.on('emojiClick', (emoji, mouseEvent) => {
  console.log(emoji.char)     // "😂"
  console.log(emoji.name)     // "face_with_tears_of_joy"
  console.log(emoji.category) // "Smileys & Emotion"
  console.log(emoji.unicode)  // "1F602"
  console.log(emoji.skinTone) // null | "light" | "medium" | ...
})
```

### `emojiHover`

Fired when the user hovers over an emoji.

```js
picker.on('emojiHover', (emoji, mouseEvent) => {
  myPreview.textContent = `${emoji.char}  ${emoji.name}`
})
```

### `pickerOpen`

```js
picker.on('pickerOpen', () => {
  console.log('Picker opened')
})
```

### `pickerClose`

```js
picker.on('pickerClose', () => {
  console.log('Picker closed')
})
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
  console.log('Searching for:', query)
})
```

---

## Methods

All methods return `this` (chainable, except `destroy()`).

```js
picker.open()            // Open the picker
picker.close()           // Close the picker
picker.toggle()          // Toggle open/close
picker.setTheme('dark')  // Switch theme at runtime
picker.destroy()         // Remove from DOM and clean up all listeners
```

**Chaining:**

```js
new EmojiPicker({ container: '#btn', theme: 'light' })
  .on('emojiClick', (e) => addEmoji(e.char))
  .on('pickerOpen', () => analytics.track('emoji_picker_opened'))
```

---

## Emoji Object

Every emoji-related event provides this data structure:

```js
{
  char:     "👍🏽",           // The emoji character (with skin tone applied)
  name:     "thumbs_up",     // Snake_case identifier
  category: "People & Body", // Category name
  unicode:  "1F44D",         // Base Unicode code point (hex)
  skinTone: "medium",        // null if default, otherwise the tone name
  isCustom: false            // true for custom emojis
}
```

---

## Modes

### `dropdown` *(default)*

Opens as a floating panel anchored to the trigger element. Closes on outside click or `Esc`.

```js
new EmojiPicker({ container: '#btn', mode: 'dropdown' })
```

### `inline`

Always visible, embedded directly inside the container element. `autoClose` is ignored.

```js
new EmojiPicker({ container: '#my-div', mode: 'inline', autoClose: false })
```

```html
<div id="my-div"></div>  <!-- Picker renders here -->
```

### `popup`

Positions itself in the center of the viewport. Useful for modal-style pickers without a fixed trigger.

```js
const picker = new EmojiPicker({ mode: 'popup' })
document.getElementById('open-btn').addEventListener('click', () => picker.open())
```

---

## Skin Tone Support

Users can select a skin tone in the picker footer. Set a default via options:

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

The selected tone is reflected in `emoji.char` and reported in `emoji.skinTone`.

---

## Theming & CSS Variables

Override CSS variables to match any design system:

```css
.ep-picker {
  --ep-bg:         #0f1117;
  --ep-surface:    #1a1d2e;
  --ep-surface2:   #21253a;
  --ep-border:     rgba(255,255,255,0.08);
  --ep-text:       #e4e7f3;
  --ep-text-dim:   #6b738f;
  --ep-accent:     #6c63ff;
  --ep-hover:      rgba(108,99,255,0.12);
  --ep-size:       28px;   /* Emoji size */
  --ep-radius:     16px;   /* Picker border radius */
}
```

### Built-in themes

```js
new EmojiPicker({ theme: 'light' })   // Light
new EmojiPicker({ theme: 'dark' })    // Dark
new EmojiPicker({ theme: 'auto' })    // Follows OS preference

picker.setTheme('dark')               // Switch at runtime
```

### Custom accent color

```css
.ep-picker {
  --ep-accent:     #e91e8c;
  --ep-hover:      rgba(233, 30, 140, 0.1);
  --ep-active-tab: rgba(233, 30, 140, 0.15);
}
```

---

## Custom Emojis

Add your own images, GIFs or SVGs alongside the standard set:

```js
new EmojiPicker({
  customEmojis: [
    { name: 'party_parrot', url: '/assets/parrot.gif' },
    { name: 'company_logo', url: '/assets/logo.png' },
    { name: 'custom_star',  url: 'https://example.com/star.svg' }
  ]
})
```

Custom emojis appear in their own **Custom** tab. The click event returns:

```js
{
  char:     null,
  name:     'party_parrot',
  category: 'custom',
  isCustom: true
}
```

---

## Helper: attachToInput()

Wraps any `<input>` or `<textarea>` and inserts the selected emoji at the cursor position automatically.

```js
// Attach by selector
EmojiPicker.attachToInput('#message-input')

// With options
EmojiPicker.attachToInput('#chat-box', {
  theme: 'dark',
  skinTone: 'medium'
})

// Returns the picker instance for further event binding
const picker = EmojiPicker.attachToInput('#my-input')
picker.on('emojiClick', (emoji) => {
  counter.textContent = myInput.value.length
})
```

---

## Framework Integration

### React

Works out of the box with a standard `import`. Initialize inside `useEffect` so the library only runs in the browser.

```jsx
import { useEffect, useRef } from 'react'
import EmojiPicker from 'emojipicker-js'

function EmojiButton({ onSelect }) {
  const btnRef = useRef(null)

  useEffect(() => {
    const picker = new EmojiPicker({
      container: btnRef.current,
      theme: 'auto'
    })
    picker.on('emojiClick', onSelect)

    return () => picker.destroy() // clean up on unmount
  }, [onSelect])

  return <button ref={btnRef}>😊</button>
}
```

### Next.js

EmojiPicker uses `window` and `document` internally, so it must only run on the client. There are two ways to handle this:

**Option A — dynamic import (recommended):**

```jsx
// components/EmojiButton.jsx
import { useEffect, useRef } from 'react'
import EmojiPicker from 'emojipicker-js'

export default function EmojiButton({ onSelect }) {
  const btnRef = useRef(null)
  useEffect(() => {
    const picker = new EmojiPicker({ container: btnRef.current })
    picker.on('emojiClick', onSelect)
    return () => picker.destroy()
  }, [onSelect])
  return <button ref={btnRef}>😊</button>
}
```

```jsx
// pages/index.jsx or any page
import dynamic from 'next/dynamic'

const EmojiButton = dynamic(() => import('../components/EmojiButton'), {
  ssr: false  // prevents server-side execution
})
```

**Option B — useEffect guard (also safe):**

```jsx
useEffect(() => {
  // useEffect only runs in the browser, so this is always safe.
  // Add typeof window check only if you import EmojiPicker outside of useEffect.
  const picker = new EmojiPicker({ container: btnRef.current })
  picker.on('emojiClick', onSelect)
  return () => picker.destroy()
}, [onSelect])
```

### Vue 3

```vue
<template>
  <button ref="btnRef">😊</button>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import EmojiPicker from 'emojipicker-js'

const emit = defineEmits(['select'])
const btnRef = ref(null)
let picker = null

onMounted(() => {
  picker = new EmojiPicker({ container: btnRef.value, theme: 'auto' })
  picker.on('emojiClick', (emoji) => emit('select', emoji))
})

onUnmounted(() => picker?.destroy())
</script>
```

### Svelte

```svelte
<script>
  import { onMount, onDestroy, createEventDispatcher } from 'svelte'
  import EmojiPicker from 'emojipicker-js'

  const dispatch = createEventDispatcher()
  let btnEl
  let picker

  onMount(() => {
    picker = new EmojiPicker({ container: btnEl, theme: 'auto' })
    picker.on('emojiClick', (emoji) => dispatch('select', emoji))
  })

  onDestroy(() => picker?.destroy())
</script>

<button bind:this={btnEl}>😊</button>
```

### Vanilla JS (no bundler)

```html
<script src="https://cdn.example.com/emoji-picker.js"></script>
<script>
  const picker = new EmojiPicker({ container: '#btn', theme: 'auto' })
  picker.on('emojiClick', (emoji) => {
    document.querySelector('#input').value += emoji.char
  })
</script>
```

---

## Recipes / Examples

### Insert emoji at cursor in a textarea

```js
const textarea = document.querySelector('#editor')
const picker = new EmojiPicker({ container: '#emoji-trigger' })

picker.on('emojiClick', (emoji) => {
  const start = textarea.selectionStart
  const end   = textarea.selectionEnd
  textarea.value =
    textarea.value.substring(0, start) +
    emoji.char +
    textarea.value.substring(end)
  textarea.setSelectionRange(
    start + emoji.char.length,
    start + emoji.char.length
  )
  textarea.focus()
})
```

### Copy to clipboard

```js
picker.on('emojiClick', (emoji) => {
  navigator.clipboard.writeText(emoji.char).then(() => {
    showToast(`Copied ${emoji.char}`)
  })
})
```

### Send emoji reaction to a server

```js
picker.on('emojiClick', (emoji) => {
  fetch('/api/reactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messageId: currentMessageId,
      emoji:     emoji.name,
      char:      emoji.char
    })
  })
})
```

### Multiple pickers on the same page

```js
// Minimal reaction picker
const reactionPicker = new EmojiPicker({
  container:    '#reaction-btn',
  search:       false,
  recentEmojis: false,
  autoClose:    true
})

// Full editor picker
const editorPicker = new EmojiPicker({
  container: '#editor-btn',
  search:    true,
  skinTone:  'medium'
})
```

### Track analytics

```js
picker.on('pickerOpen',     ()             => analytics.track('picker_opened'))
picker.on('emojiClick',     (emoji)        => analytics.track('emoji_used',    { name: emoji.name }))
picker.on('search',         ({ query })    => analytics.track('emoji_search',  { query }))
picker.on('categoryChange', ({ category }) => analytics.track('category_view', { category }))
```

### Dynamically switch themes

```js
document.querySelector('#theme-toggle').addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark')
  picker.setTheme(isDark ? 'dark' : 'light')
})
```

---

## Accessibility

- All interactive elements have `aria-label` and `role` attributes
- The emoji grid uses `role="grid"` and `role="gridcell"`
- The picker uses `role="dialog"` with `aria-label`
- Category tabs use `role="tablist"`
- Preview area uses `aria-live="polite"` for screen reader announcements
- `Esc` closes the picker
- Focus moves to the search input on open

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

Requires `localStorage` for recent emojis — gracefully disabled if unavailable (e.g. private browsing).

---

## Categories

| Tab | Category | Example |
|-----|----------|---------|
| 🕐 | Recently Used | *dynamic* |
| 😊 | Smileys & Emotion | 😀 😂 🥰 😎 |
| 👋 | People & Body | 👋 💪 🙏 🤝 |
| 🐶 | Animals & Nature | 🐶 🦊 🌸 🌈 |
| 🍕 | Food & Drink | 🍕 🍜 🍺 🧋 |
| ⚽ | Activities | ⚽ 🎮 🎸 🏆 |
| ✈️ | Travel & Places | ✈️ 🚀 🏖️ 🏰 |
| 💡 | Objects | 💡 💻 📷 🔑 |
| ❤️ | Symbols | ❤️ ✅ ♻️ 💯 |
| 🏳️ | Flags | 🏳️‍🌈 🇺🇸 🇩🇪 🇯🇵 |

---

## License
Apache — free