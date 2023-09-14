import { editorTestCase as test, expect } from '@af/editor-libra';
import { PanelType } from '@atlaskit/adf-schema';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  panel,
  p,
  ul,
  li,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  bulletListDocument,
  emptyDocument,
} from './__fixtures__/adf-documents';

test.use({
  editorProps: {
    appearance: 'full-page',
    allowPanel: true,
    allowNewInsertionBehaviour: true,
  },
});

test.describe('quick-insert: Empty document', () => {
  test.use({
    adf: emptyDocument,
  });

  test('Insert Info panel in empty document', async ({ editor }) => {
    await editor.typeAhead.searchAndInsert('info');

    await expect(editor).toMatchDocument(
      doc(panel({ panelType: PanelType.INFO })(p())),
    );
  });

  test('Insert error panel in empty document', async ({ editor }) => {
    await editor.typeAhead.searchAndInsert('error');

    await expect(editor).toMatchDocument(
      doc(panel({ panelType: PanelType.ERROR })(p())),
    );
  });

  test('Insert warn panel in empty document', async ({ editor }) => {
    await editor.typeAhead.searchAndInsert('warn');

    await expect(editor).toMatchDocument(
      doc(panel({ panelType: PanelType.WARNING })(p())),
    );
  });

  test('Insert success panel in empty document', async ({ editor }) => {
    await editor.typeAhead.searchAndInsert('success');

    await expect(editor).toMatchDocument(
      doc(panel({ panelType: PanelType.SUCCESS })(p())),
    );
  });

  test('Insert note panel in empty document', async ({ editor }) => {
    await editor.typeAhead.searchAndInsert('note');

    await expect(editor).toMatchDocument(
      doc(panel({ panelType: PanelType.NOTE })(p())),
    );
  });
});

test.describe('quick-insert: Bullet list', () => {
  test.use({
    adf: bulletListDocument,
  });

  test('Insert Info panel in empty document', async ({ editor }) => {
    await editor.typeAhead.searchAndInsert('info');

    await expect(editor).toMatchDocument(
      doc(ul(li(p())), panel({ panelType: PanelType.INFO })(p())),
    );
  });

  test('Insert error panel in empty document', async ({ editor }) => {
    await editor.typeAhead.searchAndInsert('error');

    await expect(editor).toMatchDocument(
      doc(ul(li(p())), panel({ panelType: PanelType.ERROR })(p())),
    );
  });

  test('Insert warn panel in empty document', async ({ editor }) => {
    await editor.typeAhead.searchAndInsert('warn');

    await expect(editor).toMatchDocument(
      doc(ul(li(p())), panel({ panelType: PanelType.WARNING })(p())),
    );
  });

  test('Insert success panel in empty document', async ({ editor }) => {
    await editor.typeAhead.searchAndInsert('success');

    await expect(editor).toMatchDocument(
      doc(ul(li(p())), panel({ panelType: PanelType.SUCCESS })(p())),
    );
  });

  test('Insert note panel in empty document', async ({ editor }) => {
    await editor.typeAhead.searchAndInsert('note');

    await expect(editor).toMatchDocument(
      doc(ul(li(p())), panel({ panelType: PanelType.NOTE })(p())),
    );
  });
});
