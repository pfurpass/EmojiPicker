// Type definitions for @schwitzerskills/emojipicker v2.0
// https://github.com/schwitzerskills/emojipicker

export interface EmojiObject {
  /** The emoji character with skin tone applied, e.g. "😂" or "👍🏽" */
  char: string | null;
  /** Snake_case identifier, e.g. "face_with_tears_of_joy" */
  name: string;
  /** Category name, e.g. "Smileys & Emotion" */
  category: string;
  /** Base Unicode code point in hex, e.g. "1F602" */
  unicode: string | null;
  /** Active skin tone, null if default */
  skinTone: SkinTone | null;
  /** true for custom (image-based) emojis */
  isCustom: boolean;
}

export interface FavoriteEmoji {
  name:  string;
  char:  string | null;
  count: number;
}

export interface CustomEmoji {
  name: string;
  url:  string;
}

export type Theme    = 'light' | 'dark' | 'auto';
export type Mode     = 'dropdown' | 'inline' | 'popup';
export type Locale   = 'en' | 'de' | 'fr' | 'es' | 'pt' | 'ja' | string;
export type SkinTone = 'default' | 'light' | 'medium-light' | 'medium' | 'medium-dark' | 'dark';

export interface EmojiPickerOptions {
  /**
   * Trigger element — CSS selector string or DOM node.
   * Clicking this element will toggle the picker open/closed.
   */
  container?: string | HTMLElement | null;

  /** Color theme. Defaults to `'auto'` (follows OS preference). */
  theme?: Theme;

  /** Display mode. Defaults to `'dropdown'`. */
  mode?: Mode;

  /** UI locale / language. Defaults to `'en'`. */
  locale?: Locale;

  /** Show the search input. Defaults to `true`. */
  search?: boolean;

  /** Track recently used emojis in IndexedDB. Defaults to `true`. */
  recentEmojis?: boolean;

  /** Maximum number of recent emojis to remember. Defaults to `24`. */
  maxRecent?: number;

  /** Default skin tone modifier. Defaults to `'default'`. */
  skinTone?: SkinTone;

  /** Custom image-based emojis to add alongside the standard set. */
  customEmojis?: CustomEmoji[];

  /** Number of emoji columns in the grid. Defaults to `8`. */
  perRow?: number;

  /** Base emoji size in pixels (maps to `--ep-size`). Defaults to `28`. */
  emojiSize?: number;

  /** Automatically close the picker after an emoji is selected. Defaults to `true`. */
  autoClose?: boolean;

  /**
   * URL to the `emoji-data.json` file.
   * Auto-detected from the `<script src>` tag by default.
   * Override when using a CDN or a custom path.
   *
   * @example 'https://cdn.jsdelivr.net/npm/@schwitzerskills/emojipicker/emoji-data.json'
   */
  dataUrl?: string | null;
}

export type EventName = 'emojiClick' | 'emojiHover' | 'pickerOpen' | 'pickerClose' | 'categoryChange' | 'search';

export type EmojiEventHandler     = (emoji: EmojiObject, event: MouseEvent) => void;
export type SimpleHandler         = () => void;
export type CategoryChangeHandler = (payload: { category: string }) => void;
export type SearchHandler         = (payload: { query: string }) => void;

export interface LocaleStrings {
  search:    string;
  noResults: string;
  noRecent:  string;
  recent:    string;
  custom:    string;
  loading:   string;
  categories: Record<string, string>;
  skinTones:  Record<SkinTone, string>;
}

declare class EmojiPicker {
  /** Emoji data schema version — used for IndexedDB cache invalidation. */
  static readonly DATA_VERSION: string;

  /**
   * Available locale strings.
   * Add or override: `EmojiPicker.LOCALES['nl'] = { ... }`
   */
  static LOCALES: Record<string, LocaleStrings>;

  constructor(options?: EmojiPickerOptions);

  // ---- Event system -------------------------------------------------------

  on(event: 'emojiClick',      handler: EmojiEventHandler):     this;
  on(event: 'emojiHover',      handler: EmojiEventHandler):     this;
  on(event: 'pickerOpen',      handler: SimpleHandler):         this;
  on(event: 'pickerClose',     handler: SimpleHandler):         this;
  on(event: 'categoryChange',  handler: CategoryChangeHandler): this;
  on(event: 'search',          handler: SearchHandler):         this;
  on(event: EventName,         handler: (...args: any[]) => void): this;

  off(event: EventName, handler: (...args: any[]) => void): this;

  // ---- Public methods -----------------------------------------------------

  /** Open the picker. */
  open(): this;

  /** Close the picker. */
  close(): this;

  /** Toggle the picker open/closed. */
  toggle(): this;

  /** Remove the picker from the DOM and clean up all event listeners. */
  destroy(): void;

  /**
   * Switch the color theme at runtime.
   * @param theme  'light' | 'dark' | 'auto'
   */
  setTheme(theme: Theme): this;

  /**
   * Switch the UI locale at runtime. Re-renders the picker if it is open.
   * @param locale  A key from `EmojiPicker.LOCALES`
   */
  setLocale(locale: Locale): this;

  /**
   * Returns the top N most-clicked emojis, sorted descending by click count.
   * Data is persisted in IndexedDB.
   * @param n  Number of results (default 8)
   */
  getTopFavorites(n?: number): Promise<FavoriteEmoji[]>;

  /** Clear all recent emojis from IndexedDB. */
  clearRecent(): Promise<this>;

  /** Clear all favorite click-count data from IndexedDB. */
  clearFavorites(): Promise<this>;

  // ---- Static helpers -----------------------------------------------------

  /**
   * Convenience method — wraps any `<input>` or `<textarea>` and automatically
   * inserts the selected emoji at the cursor position.
   *
   * @param selector  CSS selector string or DOM element
   * @param options   EmojiPickerOptions (optional)
   * @returns         The EmojiPicker instance
   *
   * @example
   * EmojiPicker.attachToInput('#message', { theme: 'dark' })
   */
  static attachToInput(
    selector: string | HTMLInputElement | HTMLTextAreaElement,
    options?: EmojiPickerOptions
  ): EmojiPicker | null;

  /**
   * Pre-warm: fetches and caches emoji data in IndexedDB without rendering
   * any UI. Call this on app startup so the first picker open is instant.
   *
   * @example
   * // In your app entry point:
   * EmojiPicker.preload({ dataUrl: '/static/emoji-data.json' })
   */
  static preload(options?: Pick<EmojiPickerOptions, 'dataUrl' | 'locale'>): Promise<EmojiPicker>;
}

export default EmojiPicker;
export { EmojiPicker };