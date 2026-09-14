/**
 * Confluence glyphs ac:name of <ac:emoticon /> map to new emojis
 * {
 *   [ac:name] : ['emoji-id', 'emoji-shortName', 'emoji-fallback']
 *   ...
 * }
 * Glyphs that do not map to Fabric Emoji
 * will be mapped to Emoji Id '2b50' (:star:) with preserving ac:name as shortName attribute;
 */
export const acNameToEmojiMap: {
	'blue-star': string[];
	'broken-heart': string[];
	cheeky: string[];
	cross: string[];
	'green-star': string[];
	heart: string[];
	information: string[];
	laugh: string[];
	'light-off': string[];
	'light-on': string[];
	minus: string[];
	plus: string[];
	question: string[];
	'red-star': string[];
	sad: string[];
	smile: string[];
	'thumbs-down': string[];
	'thumbs-up': string[];
	tick: string[];
	warning: string[];
	wink: string[];
	'yellow-star': string[];
} = {
	smile: ['1f642', ':slight_smile:', '\uD83D\uDE42'],
	sad: ['1f641', ':slight_frown:', '\uD83D\uDE41'],
	cheeky: ['1f61b', ':stuck_out_tongue:', '\uD83D\uDE1B'],
	laugh: ['1f600', ':grinning:', '\uD83D\uDE00'],
	wink: ['1f609', ':wink:', '\uD83D\uDE09'],
	information: ['2139', ':information_source:', '\u2139'],
	tick: ['2705', ':white_check_mark:', '\u2705'],
	cross: ['274c', ':x:', '\u274C'],
	warning: ['26a0', ':warning:', '\u26A0'],
	plus: ['2795', ':heavy_plus_sign:', '\u2795'],
	minus: ['2796', ':heavy_minus_sign:', '\u2796'],
	question: ['2753', ':question:', '\u003F'],
	'thumbs-up': ['1f44d', ':thumbsup:', '\uD83D\uDC4D'],
	'thumbs-down': ['1f44e', ':thumbsdown:', '\uD83D\uDC4E'],
	'light-on': ['1f4a1', ':bulb:', '\uD83D\uDCA1'],
	'yellow-star': ['2b50', ':star:', '\uD83D\uDC9B'],
	'light-off': ['1f6ab', ':no_entry_sign:', '\uD83D\uDEAB'],
	'red-star': ['2764', ':heart:', '\u2764\uFE0F'],
	'green-star': ['1f49a', ':green_heart:', '\uD83D\uDC9A'],
	'blue-star': ['1f499', ':blue_heart:', '\uD83D\uDC99'],
	heart: ['2764', ':heart:', '\u2764\uFE0F'],
	'broken-heart': ['1f494', ':broken_heart:', '\uD83D\uDC94'],
};
