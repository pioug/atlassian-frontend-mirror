import { OnLifecycle } from '../src/components/typeahead/EmojiTypeAheadComponent';
import debug, { enableLogger } from '../src/util/logger';
import { OnEmojiEvent, OnToneSelected, EmojiUpload } from '../src/types';
import { OnUploadEmoji } from '../src/components/common/EmojiUploadPicker';
import { emoji, UsageClearEmojiResource } from '@atlaskit/util-data-test';
import EmojiRepository from '../src/api/EmojiRepository';

const storyData = emoji.storyData;

enableLogger(true);

export const onOpen: OnLifecycle = () => debug('picker opened');

export const onClose: OnLifecycle = () => debug('picker closed');

export const onSelection: OnEmojiEvent = (emojiId, emoji) =>
  debug('emoji selected', emojiId, emoji);

export const onToneSelected: OnToneSelected = (variation: number) =>
  debug('tone selected', variation);

export const onUploadEmoji: OnUploadEmoji = (upload: EmojiUpload) =>
  debug('uploaded emoji', upload);

export const onUploadCancelled = () => debug('upload cancelled');

// FIXME FAB-1732 - extract or replace with third-party implementation
export const toJavascriptString = (obj: any): string => {
  if (typeof obj === 'object') {
    if (Array.isArray(obj)) {
      let arrString = '[\n';
      for (let i = 0; i < obj.length; i++) {
        arrString += `  ${toJavascriptString(obj[i])},\n`;
      }
      arrString += ']';
      return arrString;
    }
    let objString = '{\n';
    Object.keys(obj).forEach(key => {
      objString += `  ${key}: ${toJavascriptString(obj[key])},\n`;
    });
    objString += '}';
    return objString;
  } else if (typeof obj === 'string') {
    return `'${obj}'`;
  }
  return obj.toString();
};

export const {
  lorem,
  getEmojiResourceWithStandardAndAtlassianEmojis,
  loggedUser,
  getEmojis,
  getEmojiResource,
} = storyData;

export const getUsageClearEmojiResource: () => UsageClearEmojiResource =
  storyData.getUsageClearEmojiResource;
export const getEmojiRepository: () => EmojiRepository =
  storyData.getEmojiRepository;
