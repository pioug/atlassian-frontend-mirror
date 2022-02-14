import { Slice } from 'prosemirror-model';
import {
  doc,
  p,
  panel,
  inlineCard,
  blockCard,
  hardBreak,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { clipboardTextSerializer } from '../../pm-plugins/clipboard-text-serializer';

const atlassianUrl = 'http://www.atlassian.com/';

const cardAdfAttrs = {
  url: atlassianUrl,
};

const inlineCardAdf = {
  type: 'inlineCard',
  attrs: cardAdfAttrs,
};

import defaultSchema from '@atlaskit/editor-test-helpers/schema';

describe('clipboardTextSerializer', () => {
  it('should serialize a paragraph with plain text correctly', () => {
    const slice = new Slice(doc(p('hello world'))(defaultSchema).content, 1, 1);

    const text = clipboardTextSerializer(slice);
    expect(text).toMatchInlineSnapshot(`"hello world"`);
  });

  it('should serialize an inline card to its url', () => {
    const inlineCardRefsNode = inlineCard(inlineCardAdf.attrs)();

    const slice = new Slice(
      doc(p('text before ', '{<node>}', inlineCardRefsNode, ' text after'))(
        defaultSchema,
      ).content,
      1,
      1,
    );

    const text = clipboardTextSerializer(slice);
    expect(text).toMatchInlineSnapshot(
      `"text before http://www.atlassian.com/ text after"`,
    );
  });
  it('should serialize a block card without surrounding text to its url without newlines', () => {
    const slice = new Slice(
      doc(blockCard({ url: atlassianUrl })())(defaultSchema).content,
      1,
      1,
    );

    const text = clipboardTextSerializer(slice);
    expect(text).toMatchInlineSnapshot(`"http://www.atlassian.com/"`);
  });

  it('should serialize a block card to its url and add newlines', () => {
    const slice = new Slice(
      doc(
        p('text before '),
        blockCard({ url: atlassianUrl })(),
        p('text after'),
      )(defaultSchema).content,
      1,
      1,
    );

    const text = clipboardTextSerializer(slice);
    expect(text).toMatchInlineSnapshot(`
      "text before 

      http://www.atlassian.com/

      text after"
    `);
  });

  it('should serialize an unknown block node in a satisfactory way', () => {
    const slice = new Slice(
      doc(
        p('before'),
        panel({ panelType: 'info' })(p('panel content')),
        p('after'),
      )(defaultSchema).content,
      1,
      1,
    );

    const text = clipboardTextSerializer(slice);
    expect(text).toMatchInlineSnapshot(`
      "before

      panel content

      after"
    `);
  });
  it('should insert a newline for a hard break', () => {
    const slice = new Slice(
      doc(p('before', hardBreak(), 'after'))(defaultSchema).content,
      1,
      1,
    );

    const text = clipboardTextSerializer(slice);
    expect(text).toMatchInlineSnapshot(`
      "before
      after"
    `);
  });
});
