import type { CategoryId } from '../components/picker/categories';

export const customCategory = 'CUSTOM';
export const frequentCategory = 'FREQUENT';
export const customType = 'SITE';
export const searchCategory = 'SEARCH';
export const yourUploadsCategory = 'USER_CUSTOM';

export const customTitle = 'allUploadsCustomCategory';
export const userCustomTitle = 'userUploadsCustomCategory';

export const dataURLPrefix = 'data:';
export const deleteEmojiLabel = 'delete-emoji';

/**
 * A constant used in sorting/ordering to represent a number 'obviously much bigger than any item in the set being handled'.
 * This is used instead of Number.MAX_VALUE since subtraction of MAX_VALUE from itself occassionaly doesn't equal zero exactly :-(
 */
export const MAX_ORDINAL = 100000;

export const defaultEmojiHeight = 20;

export type EmojiPickerWidth = 350;
export const emojiPickerWidth: EmojiPickerWidth = 350;

export const sizeGap = 80;

export const defaultEmojiPickerSize = 'medium';

export const emojiPickerMinHeight = 260;
export const emojiPickerHeight = 295;
export const emojiPickerListHeight = emojiPickerHeight - 58; // picker height - actions height

export const emojiPickerPreviewHeight = 54;
export const emojiPickerHeightWithPreview = emojiPickerHeight + emojiPickerPreviewHeight;

export const localStoragePrefix = 'fabric.emoji';
export const selectedToneStorageKey = `${localStoragePrefix}.selectedTone`;
export const defaultCategories: CategoryId[] = [
	'PEOPLE',
	'NATURE',
	'FOODS',
	'ACTIVITY',
	'PLACES',
	'OBJECTS',
	'SYMBOLS',
	'FLAGS',
];

export enum KeyboardKeys {
	ArrowLeft = 'ArrowLeft',
	ArrowRight = 'ArrowRight',
	ArrowUp = 'ArrowUp',
	ArrowDown = 'ArrowDown',
	PageUp = 'PageUp',
	PageDown = 'PageDown',
	Home = 'Home',
	End = 'End',
	Enter = 'Enter',
	Tab = 'Tab',
	Space = ' ',
	Backspace = 'Backspace',
}

// Used to search available emoji in the picker list to focus
export enum KeyboardNavigationDirection {
	Down = 'Down',
	Up = 'Up',
	Left = 'Left',
	Right = 'Right',
}

export const CATEGORYSELECTOR_KEYBOARD_KEYS_SUPPORTED: string[] = [
	KeyboardKeys.ArrowRight,
	KeyboardKeys.ArrowLeft,
	KeyboardKeys.Home,
	KeyboardKeys.End,
];

export const EMOJI_KEYBOARD_KEYS_SUPPORTED: string[] = [
	KeyboardKeys.Enter,
	KeyboardKeys.Backspace,
	KeyboardKeys.Space,
];

export const TONESELECTOR_KEYBOARD_KEYS_SUPPORTED: string[] = [
	KeyboardKeys.Enter,
	KeyboardKeys.Tab,
	KeyboardKeys.Space,
];

export const EMOJIPICKERLIST_KEYBOARD_KEYS_SUPPORTED: string[] = [
	KeyboardKeys.ArrowRight,
	KeyboardKeys.ArrowLeft,
	KeyboardKeys.Home,
	KeyboardKeys.End,
	KeyboardKeys.ArrowUp,
	KeyboardKeys.ArrowDown,
	KeyboardKeys.PageUp,
	KeyboardKeys.PageDown,
];

export const DEFAULT_TONE = 0;

export const defaultListLimit = 50;

export const migrationUserId = 'hipchat_migration_emoticons';

export const analyticsEmojiPrefix = 'atlassian.fabric.emoji.picker';

export const EMOJI_LIST_COLUMNS = 8;

export const EMOJI_LIST_PAGE_COUNT = 5;

export const EMOJI_SEARCH_DEBOUNCE = 150;

// This is the base sampling rate in Emoji
export const SAMPLING_RATE_EMOJI_RENDERED_EXP = 20;
// This rate is used in fetching emoji resource
export const SAMPLING_RATE_EMOJI_RESOURCE_FETCHED_EXP = 100;
