// Default emoji id for Confluence glyphs that has no match to Fabric Emoji
const DEFAULT_EMOJI_ID = '2b50';

// Default ac:name for emoticons as a fallback is `blue-star`
const DEFAULT_EMOJI_ACNAME = 'blue-star';

// ac:hipchat-emoticon prefix when converting to Emoji ID
const HC_EMOTICON_PREFIX = 'atlassian-';

/**
 * Confluence glyphs ac:name of <ac:emoticon /> map to new emojis
 * {
 *   [ac:name] : ['emoji-id', 'emoji-shortName', 'emoji-fallback']
 *   ...
 * }
 * Glyphs that do not map to Fabric Emoji
 * will be mapped to Emoji Id '2b50' (:star:) with preserving ac:name as shortName attribute;
 */
const acNameToEmojiMap = {
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

export type NameToEmoji = keyof typeof acNameToEmojiMap;

export function acNameToEmoji(acName: NameToEmoji) {
  const emojiData = acNameToEmojiMap[acName];
  return emojiData
    ? {
        id: emojiData[0],
        shortName: emojiData[1],
        text: emojiData[2],
      }
    : {
        id: DEFAULT_EMOJI_ID,
        shortName: `:${acName}:`,
        text: '',
      };
}

export function emojiIdToAcName(emojiId: string) {
  const filterEmojis = (acName: keyof typeof acNameToEmojiMap) =>
    acNameToEmojiMap[acName] ? acNameToEmojiMap[acName][0] === emojiId : false;
  return (Object.keys(acNameToEmojiMap) as Array<
    keyof typeof acNameToEmoji
  >).filter(filterEmojis)[0];
}

export function acShortcutToEmoji(hipchatEmoticonShortName: string) {
  return {
    id: `${HC_EMOTICON_PREFIX}${hipchatEmoticonShortName}`,
    shortName: `:${hipchatEmoticonShortName}:`,
    text: '',
  };
}

function getAcNameFromShortName(shortName: string) {
  return shortName.slice(
    shortName[0] === ':' ? 1 : 0,
    shortName[shortName.length - 1] === ':' ? -1 : shortName.length,
  );
}

export function getEmojiAcName({
  id,
  shortName,
}: {
  id: string;
  shortName: string;
}) {
  if (DEFAULT_EMOJI_ID === id) {
    const possibleName = getAcNameFromShortName(shortName);
    if (possibleName in acNameToEmojiMap) {
      return possibleName;
    }
  }

  return emojiIdToAcName(id) || DEFAULT_EMOJI_ACNAME;
}
