import { defaultSchema } from '@atlaskit/adf-schema';
import WikiMarkupTransformer from '../../../index';

import {
  a,
  code,
  doc,
  em,
  hardBreak,
  p,
  strike,
  strong,
  subsup,
  textColor,
  underline,
} from '@atlaskit/editor-test-helpers/doc-builder';

describe('ADF => WikiMarkup - Paragraph', () => {
  const transformer = new WikiMarkupTransformer();

  test('should convert plain-text paragraph', () => {
    const node = doc(p('some plain text'))(defaultSchema);
    const wiki = transformer.encode(node);
    const adf = transformer.parse(wiki).toJSON();
    expect(adf).toEqual(node.toJSON());
  });

  test('should convert plain-text with hardBreak in paragraph', () => {
    const node = doc(
      p('the first line of text', hardBreak(), 'a new line of text'),
    )(defaultSchema);
    const wiki = transformer.encode(node);
    const adf = transformer.parse(wiki).toJSON();
    expect(adf).toEqual(node.toJSON());
  });

  test('should convert em to _emphasis_', () => {
    const node = doc(p('This is an ', em('emphasised'), ' word.'))(
      defaultSchema,
    );
    const wiki = transformer.encode(node);
    const adf = transformer.parse(wiki).toJSON();
    expect(adf).toEqual(node.toJSON());
  });

  test('should convert em to -- citation', () => {
    const node = doc(p('This is a ', em('-- citation')))(defaultSchema);
    const wiki = transformer.encode(node);
    const adf = transformer.parse(wiki).toJSON();
    expect(adf).toEqual(node.toJSON());
  });

  test('should convert strike mark to deleted', () => {
    const node = doc(p('This is an ', strike('strike')))(defaultSchema);
    const wiki = transformer.encode(node);
    const adf = transformer.parse(wiki).toJSON();
    expect(adf).toEqual(node.toJSON());
  });

  test('should convert underline mark to inserted', () => {
    const node = doc(p('This is an ', underline('underline')))(defaultSchema);
    const wiki = transformer.encode(node);
    const adf = transformer.parse(wiki).toJSON();
    expect(adf).toEqual(node.toJSON());
  });

  test('should convert code mark to monospace', () => {
    const node = doc(p('This is an ', code('monospace')))(defaultSchema);
    const wiki = transformer.encode(node);
    const adf = transformer.parse(wiki).toJSON();
    expect(adf).toEqual(node.toJSON());
  });

  test('should convert strong mark to bold', () => {
    const node = doc(p('This is an ', strong('strong')))(defaultSchema);
    const wiki = transformer.encode(node);
    const adf = transformer.parse(wiki).toJSON();
    expect(adf).toEqual(node.toJSON());
  });

  test('should convert sub mark to subscript', () => {
    const node = doc(p('This is an ', subsup({ type: 'sub' })('subscript')))(
      defaultSchema,
    );
    const wiki = transformer.encode(node);
    const adf = transformer.parse(wiki).toJSON();
    expect(adf).toEqual(node.toJSON());
  });

  test('should convert sup mark to superscript', () => {
    const node = doc(p('This is an ', subsup({ type: 'sup' })('superscript')))(
      defaultSchema,
    );
    const wiki = transformer.encode(node);
    const adf = transformer.parse(wiki).toJSON();
    expect(adf).toEqual(node.toJSON());
  });

  test('should convert link mark to link', () => {
    const node = doc(
      p('This is an ', a({ href: 'https://www.atlassian.com' })('link')),
    )(defaultSchema);
    const wiki = transformer.encode(node);
    const adf = transformer.parse(wiki).toJSON();
    expect(adf).toEqual(node.toJSON());
  });

  test('should convert color mark to color macro', () => {
    const node = doc(
      p('This is an ', textColor({ color: '#ffffff' })('colorful'), ' text'),
    )(defaultSchema);
    const wiki = transformer.encode(node);
    const adf = transformer.parse(wiki).toJSON();
    expect(adf).toEqual(node.toJSON());
  });

  test('should convert color with strong mark', () => {
    const node = doc(
      p(
        'This is an ',
        textColor({ color: '#ffffff' })(strong('strong colored')),
        ' text',
      ),
    )(defaultSchema);
    const wiki = transformer.encode(node);
    const adf = transformer.parse(wiki).toJSON();
    expect(adf).toEqual(node.toJSON());
  });

  test('should convert citation with strong mark', () => {
    const node = doc(
      p('This is an ', em(strong('-- strong citation')), ' text'),
    )(defaultSchema);
    const wiki = transformer.encode(node);
    const adf = transformer.parse(wiki).toJSON();
    expect(adf).toEqual(node.toJSON());
  });

  test('should convert link with strong mark', () => {
    const node = doc(
      p(
        'This is an ',
        strong(a({ href: 'https://www.atlassian.com' })()),
        ' text',
      ),
    )(defaultSchema);
    const wiki = transformer.encode(node);
    const adf = transformer.parse(wiki).toJSON();
    const originalJson = node.toJSON();
    expect(adf).toEqual(originalJson);
  });

  test('should convert two paragraph to different lines', () => {
    const node = doc(
      p('This is the first paragraph'),
      p('This is the second paragraph'),
    )(defaultSchema);
    const wiki = transformer.encode(node);
    const adf = transformer.parse(wiki).toJSON();
    expect(adf).toEqual(node.toJSON());
  });
});
