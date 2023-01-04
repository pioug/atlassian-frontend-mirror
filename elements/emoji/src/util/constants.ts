import { CategoryId } from '../components/picker/categories';

export const customCategory = 'CUSTOM';
export const frequentCategory = 'FREQUENT';
export const customType = 'SITE';

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

export const emojiPickerWidth = 350;

export const sizeGap = 80;

export const defaultEmojiPickerSize = 'medium';

export const emojiPickerMinHeight = 260;
export const emojiPickerHeight = 295;
export const emojiPickerListHeight = emojiPickerHeight - 58; // picker height - actions height

export const emojiPickerPreviewHeight = 54;
export const emojiPickerHeightWithPreview =
  emojiPickerHeight + emojiPickerPreviewHeight;

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

export const defaultListLimit = 50;

export const migrationUserId = 'hipchat_migration_emoticons';

export const analyticsEmojiPrefix = 'atlassian.fabric.emoji.picker';

// This is the base sampling rate in Emoji
export const SAMPLING_RATE_EMOJI_RENDERED_EXP = 20;
// This rate is used in fetching emoji resource
export const SAMPLING_RATE_EMOJI_RESOURCE_FETCHED_EXP = 100;
