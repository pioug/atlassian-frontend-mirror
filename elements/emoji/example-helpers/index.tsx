import { OnLifecycle } from '../src/components/typeahead/EmojiTypeAheadComponent';
import debug, { enableLogger } from '../src/util/logger';
import { OnEmojiEvent, OnToneSelected, EmojiUpload } from '../src/types';
import { OnUploadEmoji } from '../src/components/common/EmojiUploadPicker';

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

export const lorem = `
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur tincidunt,
  lorem eu vestibulum sollicitudin, erat nibh ornare purus, et sollicitudin lorem
  felis nec erat. Quisque quis ligula nisi. Cras nec dui vestibulum, pretium massa ut,
  egestas turpis. Quisque finibus eget justo a mollis. Mauris quis varius nisl. Donec
  aliquet enim vel eros suscipit porta. Vivamus quis molestie leo. In feugiat felis mi,
  ac varius odio accumsan ac. Pellentesque habitant morbi tristique senectus et netus et
  malesuada fames ac turpis egestas. Mauris elementum mauris ac leo porta venenatis.
  Integer hendrerit lacus vel faucibus sagittis. Mauris elit urna, tincidunt at aliquet
  sit amet, convallis placerat diam. Mauris id aliquet elit, non posuere nibh. Curabitur
  ullamcorper lectus mi, quis varius libero ultricies nec. Quisque tempus neque ligula,
  a semper massa dignissim nec.
`;
