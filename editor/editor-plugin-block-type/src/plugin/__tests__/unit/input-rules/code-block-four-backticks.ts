import {
  bulletList as bulletListAdf,
  listItem as listItemAdf,
  panel as panelAdf,
  table as tableAdf,
  tableCell as tableCellAdf,
  tableRow as tableRowAdf,
} from '@atlaskit/adf-schema';
import type {
  DocBuilder,
  NextEditorPlugin,
} from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  br,
  doc,
  hardBreak,
  li,
  p,
  panel,
  table,
  td,
  tr,
  ul,
} from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { insertText } from '@atlaskit/editor-test-helpers/transactions';

import { blockTypePlugin } from '../../../index';

const mockNodesPlugin: NextEditorPlugin<'nodesPlugin'> = ({}) => ({
  name: 'nodesPlugin',
  nodes() {
    return [
      { name: 'panel', node: panelAdf(true) },
      { name: 'table', node: tableAdf },
      { name: 'tableRow', node: tableRowAdf },
      { name: 'tableCell', node: tableCellAdf },
      { name: 'listItem', node: listItemAdf },
      { name: 'bulletList', node: bulletListAdf },
    ];
  },
});

interface InputOutput {
  initial: DocBuilder;
  expected: DocBuilder;
}

export type TestCase = [string, InputOutput];

const LOCAL_TABLE_ID = 'test-table-local-id';

const testCases: TestCase[] = [
  [
    'the beginning of the paragraph',
    { initial: p('```{<>}'), expected: p('````') },
  ],
  [
    'the end of a paragraph for text',
    {
      initial: p('text before ```{<>}'),
      expected: p('text before ````'),
    },
  ],
  [
    'the beginning of the paragraph with four backticks already',
    { initial: p('````{<>}'), expected: p('`````') },
  ],
  [
    'the end of a paragraph for text with four backticks already',
    {
      initial: p('text before ````{<>}'),
      expected: p('text before `````'),
    },
  ],
  [
    'a paragraph with a hard break between',
    {
      initial: p('break line', hardBreak(), '```{<>}'),
      expected: p('break line', hardBreak(), '````'),
    },
  ],
  [
    'a paragraph with a hard break between and text before',
    {
      initial: p('break line', hardBreak(), 'with text before ```{<>}'),
      expected: p('break line', hardBreak(), 'with text before ````'),
    },
  ],
  [
    'a table cell',
    {
      initial: table({ localId: LOCAL_TABLE_ID })(tr(td({})(p('```{<>}')))),
      expected: table({ localId: LOCAL_TABLE_ID })(tr(td({})(p('````')))),
    },
  ],
  [
    'a table cell with text before',
    {
      initial: table({ localId: LOCAL_TABLE_ID })(
        tr(td({})(p('text before ```{<>}'))),
      ),
      expected: table({ localId: LOCAL_TABLE_ID })(
        tr(td({})(p('text before ````'))),
      ),
    },
  ],
  [
    'a table cell with a hardbreak',
    {
      initial: table({ localId: LOCAL_TABLE_ID })(
        tr(td({})(p('text ', hardBreak(), '```{<>}'))),
      ),
      expected: table({ localId: LOCAL_TABLE_ID })(
        tr(td({})(p('text ', hardBreak(), '````'))),
      ),
    },
  ],
  [
    'a table cell with a hardbreak and text before',
    {
      initial: table({ localId: LOCAL_TABLE_ID })(
        tr(td({})(p('text', hardBreak(), 'text before ```{<>}'))),
      ),
      expected: table({ localId: LOCAL_TABLE_ID })(
        tr(td({})(p('text', hardBreak(), 'text before ````'))),
      ),
    },
  ],
  [
    'a table cell with bullet list',
    {
      initial: table({ localId: LOCAL_TABLE_ID })(
        tr(td({})(ul(li(p('```{<>}'))))),
      ),
      expected: table({ localId: LOCAL_TABLE_ID })(
        tr(td({})(ul(li(p('````'))))),
      ),
    },
  ],
  [
    'a paragraph with a break',
    {
      initial: p('love a good break ', br(), '```{<>}'),
      expected: p('love a good break ', br(), '````'),
    },
  ],
  [
    'a paragraph with a break and text before',
    {
      initial: p('love a good break ', br(), 'text before ```{<>}'),
      expected: p('love a good break ', br(), 'text before ````'),
    },
  ],
  [
    'a panel',
    {
      initial: panel({ type: 'info' })(p('```{<>}')),
      expected: panel({ type: 'info' })(p('````')),
    },
  ],
  [
    'a panel with text before',
    {
      initial: panel({ type: 'info' })(p('text before ```{<>}')),
      expected: panel({ type: 'info' })(p('text before ````')),
    },
  ],
];

describe('inputrules', () => {
  const createEditor = createProsemirrorEditorFactory();

  const editor = (doc: DocBuilder) =>
    createEditor({
      featureFlags: {},
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add(mockNodesPlugin)
        .add(blockTypePlugin),
    });

  describe('four or more backticks', () => {
    describe.each<TestCase>(testCases)(
      'when "`" is appended',
      (label, testCase) => {
        it(`should not convert to a code block for ${label}`, () => {
          const { editorView, sel } = editor(doc(testCase.initial));

          insertText(editorView, '`', sel);

          expect(editorView.state.doc).toEqualDocument(doc(testCase.expected));
        });
      },
    );
  });
});
