import {
  atlassianEmojis,
  newEmojiRepository,
  grinEmoji,
  evilburnsEmoji,
  standardEmojis,
} from './_test-data';

describe('#test data', () => {
  const emojiRepository = newEmojiRepository();

  it('expected standard emojis', () => {
    expect(standardEmojis.length).toEqual(80);
  });

  it('expected atlassian emojis', () => {
    expect(atlassianEmojis.length).toEqual(14);
  });

  it('expected grin emoji', () => {
    const emoji = grinEmoji;
    expect(emoji).not.toEqual(undefined);
    if (emoji) {
      expect(emoji.id).toEqual('1f601');
      expect(emoji.shortName).toEqual(':grin:');
    }
  });

  it('expected evilburns emojis', () => {
    const emoji = evilburnsEmoji;
    expect(emoji).not.toEqual(undefined);
    if (emoji) {
      expect(emoji.id).toEqual('atlassian-evilburns');
      expect(emoji.shortName).toEqual(':evilburns:');
    }
  });

  it('expected grin emoji', () => {
    const emoji = emojiRepository.findById('1f601');
    expect(emoji).not.toEqual(undefined);
    if (emoji) {
      expect(emoji.id).toEqual('1f601');
      expect(emoji.shortName).toEqual(':grin:');
    }
  });

  it('expected evilburns emojis', () => {
    const emoji = emojiRepository.findById('atlassian-evilburns');
    expect(emoji).not.toEqual(undefined);
    if (emoji) {
      expect(emoji.id).toEqual('atlassian-evilburns');
      expect(emoji.shortName).toEqual(':evilburns:');
    }
  });
});
