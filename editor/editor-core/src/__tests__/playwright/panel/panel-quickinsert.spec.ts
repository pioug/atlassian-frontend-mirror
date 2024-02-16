import { expect, editorTestCase as test } from '@af/editor-libra';
import { PanelType } from '@atlaskit/adf-schema';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  li,
  ol,
  p,
  panel,
  ul,
} from '@atlaskit/editor-test-helpers/doc-builder';

import {
  nestedNumberedListDocument,
  numberedListDocument,
} from '../../__fixtures__/base-adfs';

import {
  bulletListDocument,
  emptyDocument,
  listInsiderInfoPanel,
} from './__fixtures__/adf-documents';

test.use({
  editorProps: {
    appearance: 'full-page',
    allowPanel: true,
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

test.describe('quick-insert: numbered list', () => {
  test.use({
    adf: numberedListDocument,
    platformFeatureFlags: {
      'platform.editor.ordered-list-inserting-nodes_bh0vo': true,
    },
  });

  test('Insert Info panel in numbered list', async ({ editor }) => {
    await editor.selection.set({ anchor: 6, head: 6 });
    await editor.keyboard.type(' ');

    await editor.typeAhead.searchAndInsert('info');

    await expect(editor).toMatchDocument(
      doc(
        ol({ order: 1 })(li(p('one '))),
        panel({ panelType: PanelType.INFO })(p()),
        ol({ order: 2 })(li(p('two')), li(p('three'))),
      ),
    );
  });

  test('Insert Error panel in numbered list', async ({ editor }) => {
    await editor.selection.set({ anchor: 6, head: 6 });
    await editor.keyboard.type(' ');

    await editor.typeAhead.searchAndInsert('error');

    await expect(editor).toMatchDocument(
      doc(
        ol({ order: 1 })(li(p('one '))),
        panel({ panelType: PanelType.ERROR })(p()),
        ol({ order: 2 })(li(p('two')), li(p('three'))),
      ),
    );
  });

  test('Insert Warning panel in numbered list', async ({ editor }) => {
    await editor.selection.set({ anchor: 6, head: 6 });
    await editor.keyboard.type(' ');

    await editor.typeAhead.searchAndInsert('warn');

    await expect(editor).toMatchDocument(
      doc(
        ol({ order: 1 })(li(p('one '))),
        panel({ panelType: PanelType.WARNING })(p()),
        ol({ order: 2 })(li(p('two')), li(p('three'))),
      ),
    );
  });

  test('Insert Success panel in numbered list', async ({ editor }) => {
    await editor.selection.set({ anchor: 6, head: 6 });
    await editor.keyboard.type(' ');

    await editor.typeAhead.searchAndInsert('success');

    await expect(editor).toMatchDocument(
      doc(
        ol({ order: 1 })(li(p('one '))),
        panel({ panelType: PanelType.SUCCESS })(p()),
        ol({ order: 2 })(li(p('two')), li(p('three'))),
      ),
    );
  });

  test('Insert Note panel in numbered list', async ({ editor }) => {
    await editor.selection.set({ anchor: 6, head: 6 });
    await editor.keyboard.type(' ');

    await editor.typeAhead.searchAndInsert('note');

    await expect(editor).toMatchDocument(
      doc(
        ol({ order: 1 })(li(p('one '))),
        panel({ panelType: PanelType.NOTE })(p()),
        ol({ order: 2 })(li(p('two')), li(p('three'))),
      ),
    );
  });
});

test.describe('quick-insert: nested numbered list', () => {
  test.use({
    adf: nestedNumberedListDocument,
    platformFeatureFlags: {
      'platform.editor.ordered-list-inserting-nodes_bh0vo': true,
    },
  });

  test('Insert Info panel in nested numbered list', async ({ editor }) => {
    await editor.selection.set({ anchor: 16, head: 16 });
    await editor.keyboard.type(' ');

    await editor.typeAhead.searchAndInsert('info');

    await expect(editor).toMatchDocument(
      doc(
        ol({ order: 1 })(
          li(p('one'), ol({ order: 1 })(li(p('nested ')))),
          li(p('two')),
          li(p('three')),
        ),
        panel({ panelType: PanelType.INFO })(p()),
      ),
    );
  });

  test('Insert Error panel in nested numbered list', async ({ editor }) => {
    await editor.selection.set({ anchor: 16, head: 16 });
    await editor.keyboard.type(' ');

    await editor.typeAhead.searchAndInsert('error');

    await expect(editor).toMatchDocument(
      doc(
        ol({ order: 1 })(
          li(p('one'), ol({ order: 1 })(li(p('nested ')))),
          li(p('two')),
          li(p('three')),
        ),
        panel({ panelType: PanelType.ERROR })(p()),
      ),
    );
  });

  test('Insert Warning panel in nested numbered list', async ({ editor }) => {
    await editor.selection.set({ anchor: 16, head: 16 });
    await editor.keyboard.type(' ');

    await editor.typeAhead.searchAndInsert('warn');

    await expect(editor).toMatchDocument(
      doc(
        ol({ order: 1 })(
          li(p('one'), ol({ order: 1 })(li(p('nested ')))),
          li(p('two')),
          li(p('three')),
        ),
        panel({ panelType: PanelType.WARNING })(p()),
      ),
    );
  });

  test('Insert Success panel in nested numbered list', async ({ editor }) => {
    await editor.selection.set({ anchor: 16, head: 16 });
    await editor.keyboard.type(' ');

    await editor.typeAhead.searchAndInsert('success');

    await expect(editor).toMatchDocument(
      doc(
        ol({ order: 1 })(
          li(p('one'), ol({ order: 1 })(li(p('nested ')))),
          li(p('two')),
          li(p('three')),
        ),
        panel({ panelType: PanelType.SUCCESS })(p()),
      ),
    );
  });

  test('Insert Note panel in nested numbered list', async ({ editor }) => {
    await editor.selection.set({ anchor: 16, head: 16 });
    await editor.keyboard.type(' ');

    await editor.typeAhead.searchAndInsert('note');

    await expect(editor).toMatchDocument(
      doc(
        ol({ order: 1 })(
          li(p('one'), ol({ order: 1 })(li(p('nested ')))),
          li(p('two')),
          li(p('three')),
        ),
        panel({ panelType: PanelType.NOTE })(p()),
      ),
    );
  });
});

test.describe('quick-insert: numbered list', () => {
  test.use({
    adf: numberedListDocument,
    platformFeatureFlags: {
      'platform.editor.ordered-list-inserting-nodes_bh0vo': true,
    },
  });

  test('Insert Info panel in the middle of numbered list', async ({
    editor,
  }) => {
    await editor.selection.set({ anchor: 5, head: 5 });
    await editor.keyboard.type(' ');

    await editor.typeAhead.searchAndInsert('info');

    await expect(editor).toMatchDocument(
      doc(
        ol({ order: 1 })(li(p('on '))),
        panel({ panelType: 'info' })(p()),
        ol({ order: 2 })(li(p('e')), li(p('two')), li(p('three'))),
      ),
    );
  });

  test('Insert Info panel in the beginning of numbered list', async ({
    editor,
  }) => {
    await editor.selection.set({ anchor: 3, head: 3 });

    await editor.typeAhead.searchAndInsert('info');

    await expect(editor).toMatchDocument(
      doc(
        ol({ order: 1 })(li(p())),
        panel({ panelType: PanelType.INFO })(p()),
        ol({ order: 2 })(li(p('one')), li(p('two')), li(p('three'))),
      ),
    );
  });

  test('Insert Info panel in the end of numbered list', async ({ editor }) => {
    await editor.selection.set({ anchor: 22, head: 22 });
    await editor.keyboard.type(' ');

    await editor.typeAhead.searchAndInsert('info');

    await expect(editor).toMatchDocument(
      doc(
        ol({ order: 1 })(li(p('one')), li(p('two')), li(p('three '))),
        panel({ panelType: PanelType.INFO })(p()),
      ),
    );
  });
});

test.describe('quick-insert: nested numbered list', () => {
  test.use({
    adf: nestedNumberedListDocument,
    platformFeatureFlags: {
      'platform.editor.ordered-list-inserting-nodes_bh0vo': true,
    },
  });

  test('Insert Info panel in the middle of nested numbered list', async ({
    editor,
  }) => {
    await editor.selection.set({ anchor: 15, head: 15 });
    await editor.keyboard.type(' ');

    await editor.typeAhead.searchAndInsert('info');

    await expect(editor).toMatchDocument(
      doc(
        ol({ order: 1 })(
          li(p('one'), ol({ order: 1 })(li(p('neste d')))),
          li(p('two')),
          li(p('three')),
        ),
        panel({ panelType: PanelType.INFO })(p()),
      ),
    );
  });

  test('Insert Info panel in the beginning of nested numbered list', async ({
    editor,
  }) => {
    await editor.selection.set({ anchor: 10, head: 10 });

    await editor.typeAhead.searchAndInsert('info');

    await expect(editor).toMatchDocument(
      doc(
        ol({ order: 1 })(
          li(p('one'), ol({ order: 1 })(li(p('nested')))),
          li(p('two')),
          li(p('three')),
        ),
        panel({ panelType: PanelType.INFO })(p()),
      ),
    );
  });

  test('Insert Info panel in the end of nested numbered list', async ({
    editor,
  }) => {
    await editor.selection.set({ anchor: 16, head: 16 });
    await editor.keyboard.type(' ');

    await editor.typeAhead.searchAndInsert('info');

    await expect(editor).toMatchDocument(
      doc(
        ol({ order: 1 })(
          li(p('one'), ol({ order: 1 })(li(p('nested ')))),
          li(p('two')),
          li(p('three')),
        ),
        panel({ panelType: PanelType.INFO })(p()),
      ),
    );
  });
});

test.describe('quick-insert: numbered list inside a panel', () => {
  test.use({
    adf: listInsiderInfoPanel,
    platformFeatureFlags: {
      'platform.editor.ordered-list-inserting-nodes_bh0vo': true,
    },
  });

  test('Insert Info panel in the end of list inside panel should safe asserts', async ({
    editor,
  }) => {
    await editor.selection.set({ anchor: 7, head: 7 });
    await editor.keyboard.type(' ');

    await editor.typeAhead.searchAndInsert('info');

    await expect(editor).toMatchDocument(
      doc(
        panel({ panelType: PanelType.INFO })(
          ol({ order: 1 })(li(p('one ')), li(p('two')), li(p('three'))),
        ),
        panel({ panelType: PanelType.INFO })(p()),
      ),
    );
  });
});
