import { schema } from '@atlaskit/adf-schema/test-helpers';
import {
  DocBuilder,
  code_block,
  doc,
  hardBreak,
  p,
  a,
  panel,
  status,
  strong,
  table,
  td,
  th,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { countMatches, getIndexMatch } from '../../matches-utils';

describe('RendererActions matches', () => {
  describe('#getIndexMatch', () => {
    describe('textContent', () => {
      test.each<
        [
          string, // Test name
          DocBuilder, // Doc builder
          string, // Expected textContent
        ]
      >([
        ['single paragraph', doc(p('Gummies Oat Cake')), 'Gummies Oat Cake'],
        [
          'line break',
          doc(p('Gingerbread'), p('Marshmallow')),
          'GingerbreadMarshmallow',
        ],
        [
          'hard break',
          doc(p('Tiramisu', hardBreak(), 'Marzipan')),
          'TiramisuMarzipan',
        ],
        [
          'across node boundary',
          doc(p('Chocolate cake'), panel()(p('Brownie'))),
          'Chocolate cakeBrownie',
        ],
        [
          'marks',
          doc(p('Cheesecake', strong('Pastry'), 'Jelly Cake')),
          'CheesecakePastryJelly Cake',
        ],
        [
          'tables',
          doc(
            table()(
              tr(th()(p('Header 1')), th()(p('Header 2'))),
              tr(td()(p('Cell 1')), td()(p('Cell 2'))),
              tr(td()(p('Cell 3')), td()(p('Cell 4'))),
            ),
          ),
          'Header 1Header 2Cell 1Cell 2Cell 3Cell 4',
        ],
        [
          'excludes invalid block nodes',
          doc(p('Muffin'), code_block()('IGNORED TEXT'), p('Lemon Drops')),
          'MuffinLemon Drops',
        ],
        [
          'excludes invalid inline nodes',
          doc(
            p(
              'Jelly',
              status({
                text: 'IGNORED TEXT',
                color: '#FFF',
                localId: 'dummy-status-id',
              }),
              'Apple Pie',
            ),
          ),
          'JellyApple Pie',
        ],
      ])('%s', (testName, docNode, expectedTextContent) => {
        const { textContent } = getIndexMatch(docNode(schema), schema, '', 0);
        expect(textContent).toEqual(expectedTextContent);
      });
    });

    describe('indexMatch and numMatches', () => {
      test.each<
        [
          string, // Test name
          DocBuilder, // Doc builder
          string, // Query text
          number, // Position of query
          { matchIndex: number; numMatches: number }, // Expected result
        ]
      >([
        [
          'paragraph start',
          doc(p('Gummies Oat Cake')),
          'Gummies',
          1,
          { matchIndex: 0, numMatches: 1 },
        ],

        [
          'paragraph middle',
          doc(p('Gummies Oat Cake')),
          'Oat',
          9,
          { matchIndex: 0, numMatches: 1 },
        ],
        [
          'paragraph end',
          doc(p('Gummies Oat Cake')),
          'Cake',
          13,
          { matchIndex: 0, numMatches: 1 },
        ],
        [
          'not found',
          doc(p('Gummies Oat Cake')),
          'Bun',
          9,
          { matchIndex: 0, numMatches: 0 },
        ],
        [
          'across node boundary',
          doc(p('Chocolate Cake'), panel()(p('Surprise'))),
          'CakeSurprise',
          9,
          { matchIndex: 0, numMatches: 1 },
        ],
        [
          'repeated content over one paragraph',
          doc(
            p('Oat Oat Oat Oat Oat Oat Oat Oat Oat Oat Oat Oat'),
            //                      TARGET ^^^
          ),
          'Oat',
          33,
          { matchIndex: 8, numMatches: 12 },
        ],
        [
          'repeated content over multiple paragraphs',
          doc(
            p('Gummies Oat cake'),
            p('Gummies Oat cake'),
            p('Gummies Oat cake'),
            //  TARGET ^^^
            p('Gummies Oat cake'),
          ),
          'Oat',
          45,
          { matchIndex: 2, numMatches: 4 },
        ],
        [
          'links',
          doc(
            p(
              'Test session link: ',
              a({
                href: 'https://www.google.com',
              })('https://www.google.com'),
            ),
          ),
          'https://www.google.com',
          20,
          { matchIndex: 0, numMatches: 1 },
        ],
        [
          'links with parameters',
          doc(
            p(
              'Test session link: ',
              a({
                href: 'https://www.google.com/results?page=1',
              })('https://www.google.com/results?page=1'),
            ),
          ),
          'results?page=1',
          43,
          { matchIndex: 0, numMatches: 1 },
        ],
        [
          'plain text links',
          doc(p('See results at: https://www.google.com/results?page=1')),
          'https://www.google.com/results?page=1',
          17,
          { matchIndex: 0, numMatches: 1 },
        ],
      ])('%s', (_testName, docNode, query, from, expectedMatch) => {
        const result = getIndexMatch(docNode(schema), schema, query, from);
        expect(result).toEqual(expect.objectContaining(expectedMatch));
      });
    });
  });

  describe('#countMatches', () => {
    test.each<[string, string, string, number]>([
      ['no match', 'dog', 'cat', 0],
      ['empty search', '', 'cat', 0],
      ['empty query', 'dog', '', 0],
      ['entire match', 'dog', 'dog', 1],
      ['repeated match', 'dogdogdog', 'dog', 3],
      ['repeated separated matches', 'dog cat dog cat dog cat', 'dog', 3],
      ['substring match', 'dogcatdog', 'cat', 1],
      ['case sensitive', 'DOG', 'dog', 0],
      ['case sensitive mixed', 'DOGdog', 'dog', 1],
      ['respects punctuation', 'd--o--g', 'dog', 0],
      ['respects punctuation in query', 'd-o-g!!!', 'd-o-g', 1],
      ['links', 'https://www.google.com/', 'https://www.google.com/', 1],
      [
        'links with parameters',
        'https://www.google.com/results?page=1',
        'results?page=1',
        1,
      ],
    ])('%s', (_testName, searchString, query, expected) => {
      expect(countMatches(searchString, query)).toEqual(expected);
    });
  });
});
