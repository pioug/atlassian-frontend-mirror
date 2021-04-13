import { defaultSchema } from '@atlaskit/adf-schema';
import WikiMarkupTransformer from '../../../index';

import {
  doc,
  mediaGroup,
  media,
  mediaSingle,
  a,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { Context } from '../../../interfaces';

const wikiContext: Context = {
  conversion: {
    mediaConversion: {
      'file1.txt': { transform: 'abc-1' },
      'file2.txt': { transform: 'abc-2' },
      'file3.txt': { transform: 'abc-3' },
    },
  },
};
const adfContext: Context = {
  conversion: {
    mediaConversion: {
      'abc-1': { transform: 'file1.txt' },
      'abc-2': { transform: 'file2.txt' },
      'abc-3': { transform: 'file3.txt' },
    },
  },
};
//roundtripping currently doesn't take into account centering
//and the sizes of the media thumbnail, as well as grouping.
//Ignoring for now.
describe('ADF => WikiMarkup - Media', () => {
  const transformer = new WikiMarkupTransformer(defaultSchema);

  test.skip('should convert mediaGroup node and back', () => {
    const node = doc(
      mediaGroup(
        media({ id: 'file1.txt', type: 'file', collection: '' })(),
        media({ id: 'file2.txt', type: 'file', collection: '' })(),
      ),
    )(defaultSchema);
    const wiki = transformer.encode(node, adfContext);
    const adf = transformer.parse(wiki, wikiContext).toJSON();
    expect(adf).toEqual(node.toJSON());
  });

  test('should preserve alt text', () => {
    const node = doc(
      mediaSingle()(
        media({
          id: 'abc-1',
          type: 'file',
          collection: '',
          alt: 'Hello world',
          width: 200,
          height: 183,
        })(),
      ),
    )(defaultSchema);
    const wiki = transformer.encode(node, adfContext);
    const adf = transformer.parse(wiki, wikiContext).toJSON();
    expect(adf).toEqual(node.toJSON());
  });

  test('should preserve media links', () => {
    const node = doc(
      mediaSingle({ layout: 'center' })(
        a({ href: 'google.com' })(
          media({
            id: 'abc-1',
            type: 'file',
            collection: '',
            alt: 'Hello world',
            width: 200,
            height: 183,
          })(),
        ),
      ),
    )(defaultSchema);
    const wiki = transformer.encode(node, adfContext);
    const adf = transformer.parse(wiki, wikiContext).toJSON();
    expect(adf).toEqual(node.toJSON());
  });
});

describe('WikiMarkup => ADF - Media', () => {
  const transformer = new WikiMarkupTransformer(defaultSchema);
  const expected = doc(
    mediaGroup(
      media({ id: 'abc-1', type: 'file', collection: '' })(),
      media({ id: 'abc-2', type: 'file', collection: '' })(),
      media({ id: 'abc-3', type: 'file', collection: '' })(),
    ),
  )(defaultSchema);
  test('should convert attachment links to mediaGroup nodes', () => {
    const wiki = `[^file1.txt] [^file2.txt] [^file3.txt]`;
    const adf = transformer.parse(wiki, wikiContext);
    expect(adf.toJSON()).toEqual(expected.toJSON());
  });
  test('should convert attachment links with newlines to mediaGroup nodes', () => {
    const wiki = `[^file1.txt]\r\n[^file2.txt]\r\n[^file3.txt]`;
    const adf = transformer.parse(wiki, wikiContext);
    expect(adf.toJSON()).toEqual(expected.toJSON());
  });
});
