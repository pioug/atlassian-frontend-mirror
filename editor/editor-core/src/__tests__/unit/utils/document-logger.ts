import {
  doc,
  p,
  date,
  panel,
  status,
  emoji,
  table,
  tr,
  th,
  td,
  underline,
  strong,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import schema from '@atlaskit/editor-test-helpers/schema';
import { getDocStructure } from '../../../utils/document-logger';

const checkDocument = (doc: DocBuilder, expected: any) => {
  const document = doc(schema);
  expect(getDocStructure(document)).toEqual(expected);
};

describe('document logger', () => {
  it('gets document structure for one block node', () => {
    checkDocument(doc(p()), {
      type: 'doc',
      pos: 0,
      nodeSize: 4,
      content: [{ type: 'paragraph', pos: 1, nodeSize: 2 }],
    });
  });

  it('gets document structure for multiple block nodes', () => {
    checkDocument(doc(p(), p()), {
      type: 'doc',
      pos: 0,
      nodeSize: 6,
      content: [
        { type: 'paragraph', pos: 1, nodeSize: 2 },
        { type: 'paragraph', pos: 3, nodeSize: 2 },
      ],
    });
  });

  it('gets document structure for nested block nodes', () => {
    checkDocument(doc(panel({ panelType: 'info' })(p())), {
      type: 'doc',
      pos: 0,
      nodeSize: 6,
      content: [
        {
          type: 'panel',
          pos: 1,
          nodeSize: 4,
          content: [{ type: 'paragraph', pos: 2, nodeSize: 2 }],
        },
      ],
    });
  });

  it('gets document structure for inline nodes', () => {
    checkDocument(
      doc(
        p(
          'hello',
          status({ text: 'success', color: 'green', localId: 'abc' }),
          date({ timestamp: Date.now() }),
        ),
      ),
      {
        type: 'doc',
        pos: 0,
        nodeSize: 11,
        content: [
          {
            type: 'paragraph',
            pos: 1,
            nodeSize: 9,
            content: [
              { type: 'text', pos: 1, nodeSize: 5 },
              { type: 'status', pos: 6, nodeSize: 1 },
              { type: 'date', pos: 7, nodeSize: 1 },
            ],
          },
        ],
      },
    );
  });

  it('gets document structure for marks', () => {
    checkDocument(
      doc(
        p(
          underline('underlined'),
          strong('bold'),
          underline(strong('bold and underline')),
        ),
      ),
      {
        type: 'doc',
        pos: 0,
        nodeSize: 36,
        content: [
          {
            type: 'paragraph',
            pos: 1,
            nodeSize: 34,
            content: [
              { type: 'text', marks: ['underline'], pos: 1, nodeSize: 10 },
              { type: 'text', marks: ['strong'], pos: 11, nodeSize: 4 },
              {
                type: 'text',
                marks: ['strong', 'underline'],
                pos: 15,
                nodeSize: 18,
              },
            ],
          },
        ],
      },
    );
  });

  it('gets document structure for multiple block nodes and inline nodes', () => {
    checkDocument(
      doc(
        p(
          'hello',
          status({ text: 'success', color: 'green', localId: 'abc' }),
          date({ timestamp: Date.now() }),
        ),
        p('hi', emoji({ shortName: ':grinning:', text: '😀' })()),
      ),
      {
        type: 'doc',
        pos: 0,
        nodeSize: 16,
        content: [
          {
            type: 'paragraph',
            pos: 1,
            nodeSize: 9,
            content: [
              { type: 'text', pos: 1, nodeSize: 5 },
              { type: 'status', pos: 6, nodeSize: 1 },
              { type: 'date', pos: 7, nodeSize: 1 },
            ],
          },
          {
            type: 'paragraph',
            pos: 10,
            nodeSize: 5,
            content: [
              { type: 'text', pos: 10, nodeSize: 2 },
              { type: 'emoji', pos: 12, nodeSize: 1 },
            ],
          },
        ],
      },
    );
  });

  it('gets document structure for table', () => {
    checkDocument(
      doc(
        table()(
          tr(th({})(p('Animal'))),
          tr(td({})(p('bilby'))),
          tr(td({})(p('quokka'))),
        ),
      ),
      {
        type: 'doc',
        pos: 0,
        nodeSize: 39,
        content: [
          {
            type: 'table',
            pos: 1,
            nodeSize: 37,
            content: [
              {
                type: 'tableRow',
                pos: 2,
                nodeSize: 12,
                content: [
                  {
                    type: 'tableHeader',
                    pos: 3,
                    nodeSize: 10,
                    content: [
                      {
                        type: 'paragraph',
                        pos: 4,
                        nodeSize: 8,
                        content: [{ type: 'text', pos: 4, nodeSize: 6 }],
                      },
                    ],
                  },
                ],
              },
              {
                type: 'tableRow',
                pos: 14,
                nodeSize: 11,
                content: [
                  {
                    type: 'tableCell',
                    pos: 15,
                    nodeSize: 9,
                    content: [
                      {
                        type: 'paragraph',
                        pos: 16,
                        nodeSize: 7,
                        content: [{ type: 'text', pos: 16, nodeSize: 5 }],
                      },
                    ],
                  },
                ],
              },
              {
                type: 'tableRow',
                pos: 25,
                nodeSize: 12,
                content: [
                  {
                    type: 'tableCell',
                    pos: 26,
                    nodeSize: 10,
                    content: [
                      {
                        type: 'paragraph',
                        pos: 27,
                        nodeSize: 8,
                        content: [{ type: 'text', pos: 27, nodeSize: 6 }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    );
  });
});
