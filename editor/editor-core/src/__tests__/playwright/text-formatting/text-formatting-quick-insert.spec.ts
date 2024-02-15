import { expect, editorTestCase as test } from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, h1, li, ol, p } from '@atlaskit/editor-test-helpers/doc-builder';

import {
  nestedNumberedListDocument,
  numberedListDocument,
} from '../../__fixtures__/base-adfs';

test.use({
  editorProps: {
    appearance: 'full-page',
    allowTextAlignment: true,
    smartLinks: {
      allowBlockCards: true,
      allowEmbeds: true,
    },
  },
  platformFeatureFlags: {
    'platform.editor.ordered-list-inserting-nodes_bh0vo': true,
  },
});

test.describe('quick-insert: numbered list', () => {
  test.use({
    adf: numberedListDocument,
  });

  test('Insert Heading one in numbered list', async ({ editor }) => {
    await editor.selection.set({ anchor: 6, head: 6 });
    await editor.keyboard.type(' ');

    await editor.typeAhead.search('h1');
    await editor.keyboard.press('Enter');

    await expect(editor).toMatchDocument(
      doc(
        ol({ order: 1 })(li(p('one '))),
        h1(),
        ol({ order: 2 })(li(p('two')), li(p('three'))),
      ),
    );
  });

  test('Insert Heading one in the middle of numbered list', async ({
    editor,
  }) => {
    await editor.selection.set({ anchor: 5, head: 5 });
    await editor.keyboard.type(' ');

    await editor.typeAhead.search('h1');
    await editor.keyboard.press('Enter');

    await expect(editor).toMatchDocument(
      doc(
        ol({ order: 1 })(li(p('on '))),
        h1(),
        ol({ order: 2 })(li(p('e')), li(p('two')), li(p('three'))),
      ),
    );
  });

  test('Insert Heading one in the beginning of numbered list', async ({
    editor,
  }) => {
    await editor.selection.set({ anchor: 3, head: 3 });

    await editor.typeAhead.search('h1');
    await editor.keyboard.press('Enter');

    await expect(editor).toMatchDocument(
      doc(
        ol({ order: 1 })(li(p())),
        h1(),
        ol({ order: 2 })(li(p('one')), li(p('two')), li(p('three'))),
      ),
    );
  });

  test('Insert Heading one in the end of numbered list', async ({ editor }) => {
    await editor.selection.set({ anchor: 22, head: 22 });
    await editor.keyboard.type(' ');

    await editor.typeAhead.search('h1');
    await editor.keyboard.press('Enter');

    await expect(editor).toMatchDocument(
      doc(ol({ order: 1 })(li(p('one')), li(p('two')), li(p('three '))), h1()),
    );
  });
});

test.describe('quick-insert: nested numbered list', () => {
  test.use({
    adf: nestedNumberedListDocument,
  });

  test('Insert Heading one in nested numbered list', async ({ editor }) => {
    await editor.selection.set({ anchor: 16, head: 16 });
    await editor.keyboard.type(' ');

    await editor.typeAhead.search('h1');
    await editor.keyboard.press('Enter');

    await expect(editor).toMatchDocument(
      doc(
        ol({ order: 1 })(
          li(p('one'), ol({ order: 1 })(li(p('nested ')))),
          li(p('two')),
          li(p('three')),
        ),
        h1(),
      ),
    );
  });

  test('Insert Heading one in the middle of nested numbered list', async ({
    editor,
  }) => {
    await editor.selection.set({ anchor: 15, head: 15 });
    await editor.keyboard.type(' ');

    await editor.typeAhead.search('h1');
    await editor.keyboard.press('Enter');

    await expect(editor).toMatchDocument(
      doc(
        ol({ order: 1 })(
          li(p('one'), ol({ order: 1 })(li(p('neste d')))),
          li(p('two')),
          li(p('three')),
        ),
        h1(),
      ),
    );
  });

  test('Insert Heading one in the beginning of nested numbered list', async ({
    editor,
  }) => {
    await editor.selection.set({ anchor: 10, head: 10 });

    await editor.typeAhead.search('h1');
    await editor.keyboard.press('Enter');

    await expect(editor).toMatchDocument(
      doc(
        ol({ order: 1 })(
          li(p('one'), ol({ order: 1 })(li(p('nested')))),
          li(p('two')),
          li(p('three')),
        ),
        h1(),
      ),
    );
  });

  test('Insert Heading one in the end of nested numbered list', async ({
    editor,
  }) => {
    await editor.selection.set({ anchor: 16, head: 16 });
    await editor.keyboard.type(' ');

    await editor.typeAhead.search('h1');
    await editor.keyboard.press('Enter');

    await expect(editor).toMatchDocument(
      doc(
        ol({ order: 1 })(
          li(p('one'), ol({ order: 1 })(li(p('nested ')))),
          li(p('two')),
          li(p('three')),
        ),
        h1(),
      ),
    );
  });
});
