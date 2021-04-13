import { defaultSchema } from '@atlaskit/adf-schema';
import WikiMarkupTransformer from '../../../index';
import { doc, mention, p } from '@atlaskit/editor-test-helpers/doc-builder';

describe('ADF => WikiMarkup - Mention', () => {
  const transformer = new WikiMarkupTransformer();

  test('should convert mention node WITHOUT context', () => {
    const node = doc(
      p(
        'Hey ',
        mention({ id: 'supertong' })(),
        ', please take a look at this.',
      ),
    )(defaultSchema);
    const wiki = transformer.encode(node);
    const adf = transformer.parse(wiki).toJSON();
    expect(adf.content[0].content[1].attrs.id).toEqual('accountid:supertong');
  });

  test('should convert mention node WITH context', () => {
    const adfContext = {
      conversion: {
        mentionConversion: {
          supertong: 'prefix:supertong',
        },
      },
    };
    const wikiContext = {
      conversion: {
        mentionConversion: {
          'prefix:supertong': 'supertong',
        },
      },
    };
    const node = doc(
      p(
        'Hey ',
        mention({ id: 'supertong' })(),
        ', please take a look at this.',
      ),
    )(defaultSchema);
    const wiki = transformer.encode(node, adfContext);
    const adf = transformer.parse(wiki, wikiContext).toJSON();
    expect(adf).toEqual(node.toJSON());
  });
});
