import { defaultSchema } from '@atlaskit/adf-schema';
import WikiMarkupTransformer from '../../../index';
import { EM_DASH } from '../../../char';

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
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert plain-text with hardBreak in paragraph', () => {
    const node = doc(
      p('the first line of text', hardBreak(), 'a new line of text'),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert em to _emphasis_', () => {
    const node = doc(p('This is an ', em('emphasised'), ' word.'))(
      defaultSchema,
    );
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert em to -- citation', () => {
    const node = doc(p('This is a ', em(`${EM_DASH} citation`)))(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert strike mark to deleted', () => {
    const node = doc(p('This is an ', strike('strike')))(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert underline mark to inserted', () => {
    const node = doc(p('This is an ', underline('underline')))(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert code mark to monospace', () => {
    const node = doc(p('This is an ', code('monospace')))(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert strong mark to bold', () => {
    const node = doc(p('This is an ', strong('strong')))(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert sub mark to subscript', () => {
    const node = doc(p('This is an ', subsup({ type: 'sub' })('subscript')))(
      defaultSchema,
    );
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert sup mark to superscript', () => {
    const node = doc(p('This is an ', subsup({ type: 'sup' })('superscript')))(
      defaultSchema,
    );
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert link mark to link', () => {
    const node = doc(
      p('This is an ', a({ href: 'https://www.atlassian.com' })('link')),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert color mark to color macro', () => {
    const node = doc(
      p('This is an ', textColor({ color: '#FFFFFF' })('colorful'), ' text'),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert color with strong mark', () => {
    const node = doc(
      p(
        'This is an ',
        textColor({ color: '#FFFFFF' })(strong('strong colored')),
        ' text',
      ),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert citation with strong mark', () => {
    const node = doc(
      p('This is an ', em(strong(`${EM_DASH} strong citation`)), ' text'),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert link with strong mark', () => {
    const node = doc(
      p(
        'This is an ',
        a({ href: 'https://www.atlassian.com' })(
          strong('strong Atlassian link'),
        ),
        ' text',
      ),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert two paragraph to different lines', () => {
    const node = doc(
      p('This is the first paragraph'),
      p('This is the second paragraph'),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('[CS-206] should convert mixed text format', () => {
    const node = doc(
      p(
        strong('Some '),
        textColor({ color: '#6554c0' })(strong('text with ')),
        textColor({ color: '#6554c0' })(strong(underline('bold and'))),
        textColor({ color: '#6554c0' })(strong(' underline and')),
        strong(' '),
        em(strong(underline('color'))),
      ),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('[CS-293] escape macro formatter characters', () => {
    const node = doc(p('this is not a \\{macro}'))(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('[CS-293] escape media formatter characters', () => {
    const node = doc(p('this is not a !file.txt!'))(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('[CS-293] escape link/mention/file link formatter characters', () => {
    const node = doc(p('this is not a [~mention]'))(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('[ADFS-725] should strip null chars', () => {
    const node = doc(p('Hello \0 World'))(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });
});
