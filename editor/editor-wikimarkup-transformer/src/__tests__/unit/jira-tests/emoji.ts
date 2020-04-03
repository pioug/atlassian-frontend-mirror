import { defaultSchema } from '@atlaskit/adf-schema';
import { doc, emoji, hardBreak, p } from '@atlaskit/editor-test-helpers';
import {
  adfEmojiItems,
  wikiToAdfEmojiMapping,
} from '../../../parser/tokenize/emoji';
import { checkParseEncodeRoundTrips } from '../_test-helpers';

// Nodes

const findEmojiConfig = (markup: string) => {
  const emojiId = wikiToAdfEmojiMapping[markup];
  if (emojiId) {
    return adfEmojiItems[emojiId];
  }
  throw new TypeError('No emoji found!');
};

describe('WikiMarkup Transformer', () => {
  describe('standard emojis', () => {
    const WIKI_NOTATION = `just an smiley face :) and another one :-( and finally :D`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          'just an smiley face ',
          emoji(findEmojiConfig(':)'))(),
          ' and another one ',
          emoji(findEmojiConfig(':-('))(),
          ' and finally ',
          emoji(findEmojiConfig(':D'))(),
        ),
      ),
    );
  });

  describe('standard emojis multiline', () => {
    const WIKI_NOTATION = `some smiley faces here:\n:-)\n:-(\n:)\n;-)\n:D\n:P\n:p`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          'some smiley faces here:',
          hardBreak(),
          emoji(findEmojiConfig(':-)'))(),
          hardBreak(),
          emoji(findEmojiConfig(':-('))(),
          hardBreak(),
          emoji(findEmojiConfig(':)'))(),
          hardBreak(),
          emoji(findEmojiConfig(';-)'))(),
          hardBreak(),
          emoji(findEmojiConfig(':D'))(),
          hardBreak(),
          emoji(findEmojiConfig(':P'))(),
          hardBreak(),
          emoji(findEmojiConfig(':p'))(),
        ),
      ),
    );
  });

  describe('warning emoji', () => {
    const WIKI_NOTATION = `(!) Warning(!)`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          emoji(findEmojiConfig('(!)'))(),
          ' Warning',
          emoji(findEmojiConfig('(!)'))(),
        ),
      ),
    );
  });

  describe('info emoji', () => {
    const WIKI_NOTATION = `(i)&nbsp;`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p(emoji(findEmojiConfig('(i)'))(), '&nbsp;')),
    );
  });

  describe('non emoji double quotes', () => {
    const WIKI_NOTATION = `(")`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('(")')),
    );
  });

  describe('non emoji single quotes', () => {
    const WIKI_NOTATION = `(')`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p("(')")),
    );
  });

  // @TODO Defect - not escaping this
  describe.skip('non emoji escaped bracket', () => {
    const WIKI_NOTATION = `\\(-)`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('&#40;-)')),
    );
  });
});
