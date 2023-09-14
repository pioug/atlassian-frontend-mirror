import { editorTestCase as test, expect } from '@af/editor-libra';
import {
  infoPanelWithTextBelowExpand,
  infoPanelWithTextBelowLayout,
  infoPanelWithTextBelowTable,
  infoPanelWithTextBelowParagraph,
} from './__fixtures__/adf-documents-panel';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  panel,
  p,
  expand,
  layoutSection,
  layoutColumn,
  table,
  tr,
  th,
  td,
} from '@atlaskit/editor-test-helpers/doc-builder';

const cases = [
  // isolating nodes
  {
    nodeAbovePanel: 'expand',
    adf: infoPanelWithTextBelowExpand,
    selectionForStartOfPanelContent: { anchor: 6, head: 6 },
    expected: {
      document: doc(
        expand({ title: '', __expanded: true })(p()),
        p('first line in panel'),
        panel({ panelType: 'info' })(p('second line in panel')),
      ),
      selection: { anchor: 5, head: 5, type: 'text' },
    },
  },
  {
    nodeAbovePanel: 'layout',
    adf: infoPanelWithTextBelowLayout,
    selectionForStartOfPanelContent: { anchor: 12, head: 12 },
    expected: {
      document: doc(
        layoutSection(
          layoutColumn({ width: 50 })(p()),
          layoutColumn({ width: 50 })(p()),
        ),
        p('first line in panel'),
        panel({ panelType: 'info' })(p('second line in panel')),
      ),
      selection: { anchor: 11, head: 11, type: 'text' },
    },
  },
  {
    nodeAbovePanel: 'table',
    adf: infoPanelWithTextBelowTable,
    selectionForStartOfPanelContent: { anchor: 46, head: 46 },
    expected: {
      document: doc(
        table({
          isNumberColumnEnabled: false,
          layout: 'default',
          localId: 'localId',
        })(
          tr(th({})(p()), th({})(p()), th({})(p())),
          tr(td({})(p()), td({})(p()), td({})(p())),
          tr(td({})(p()), td({})(p()), td({})(p())),
        ),
        p('first line in panel'),
        panel({ panelType: 'info' })(p('second line in panel')),
      ),
      selection: { anchor: 45, head: 45, type: 'text' },
    },
  },
  // non-isolating nodes
  {
    nodeAbovePanel: 'paragraph',
    adf: infoPanelWithTextBelowParagraph,
    selectionForStartOfPanelContent: { anchor: 20, head: 20 },
    expected: {
      document: doc(
        p('line above panel'),
        p('first line in panel'),
        panel({ panelType: 'info' })(p('second line in panel')),
      ),
      selection: { anchor: 19, head: 19, type: 'text' },
    },
  },
];

cases.forEach(
  ({ nodeAbovePanel, adf, selectionForStartOfPanelContent, expected }) => {
    test.describe(`Panel - Backspace at start of panel content - When panel below ${nodeAbovePanel}`, () => {
      test.use({
        adf,
        editorProps: {
          appearance: 'full-page',
          allowPanel: true,
          allowLayouts: true,
          allowTables: true,
          allowExpand: true,
        },
      });

      test('Lifts first paragraph out of the panel into the top level document when backspace is pressed', async ({
        editor,
      }) => {
        // Move cursor to start of panel content
        await editor.selection.set(selectionForStartOfPanelContent);

        // Press backspace
        await editor.keyboard.press('Backspace');

        // Assert that the first line of text in the panel has been moved to the top level document
        await expect(editor).toHaveDocument(expected.document);

        // Assert that selection is now at the start of the line of text that was lifted out of the panel
        await expect(editor).toHaveSelection(expected.selection);
      });
    });
  },
);
