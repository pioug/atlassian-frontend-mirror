import { editorTestCase as test, expect } from '@af/editor-libra';
import {
  listStartingFrom3Adf,
  listStartingFrom2Point9Adf,
  listStartingFrom0Adf,
  listStartingFrom1Point9Adf,
} from './restart-numbered-lists.spec.ts-fixtures';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  ol,
  p,
  li,
  hardBreak,
} from '@atlaskit/editor-test-helpers/doc-builder';

test.describe('restart-numbered-lists', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',

      featureFlags: {
        restartNumberedLists: true,
      },
    },
  });

  test.describe('with order 3 ordered list adf', () => {
    test.use({
      adf: listStartingFrom3Adf,
    });

    // migrated skip config:
    test('restart-numbered-lists-copy-paste.ts: (Editor to Editor) copy pasting a list starting from 3 should paste a list starting from 3', async ({
      editor,
    }) => {
      await editor.selection.set({
        anchor: 5,
        head: 11,
      });
      await editor.copy();

      await editor.selection.set({
        anchor: 16,
        head: 16,
      });
      await editor.keyboard.press('Enter');
      await editor.paste();
      await expect(editor).toMatchDocument(
        // prettier-ignore
        doc(
          p(),
          ol({ order: 3 }).any,
          p(),
          ol({ order: 3 }).any,
        ),
      );
    });

    test('restart-numbered-lists.ts: typing "99." above an existing ordered list should join them and start from 99', async ({
      editor,
    }) => {
      await editor.selection.set({
        anchor: 1,
        head: 1,
      });

      await editor.keyboard.type('99. x');

      await expect(editor).toHaveDocument(
        // prettier-ignore
        doc(
          ol({ order: 99 })(
            li(p('x')),
            li(p('a')),
            li(p('b')),
          ),
          p(),
        ),
      );
    });

    test('restart-numbered-lists.ts: typing "99." below an existing ordered list should join them and start from the existing list start number', async ({
      editor,
    }) => {
      await editor.selection.set({
        anchor: 15,
        head: 15,
      });

      await editor.keyboard.type('99. x');

      await expect(editor).toHaveDocument(
        // prettier-ignore
        doc(
          p(),
          ol({ order: 3 })(
            li(p('a')),
            li(p('b')),
            li(p('x')),
          ),
        ),
      );
    });

    test('restart-numbered-lists.ts: splitting a list that starts from 3 (by pressing Enter) should create 2 lists that continue number sequence', async ({
      editor,
    }) => {
      await editor.selection.set({
        anchor: 6,
        head: 6,
      });

      await editor.keyboard.press('Enter');
      await editor.keyboard.press('Enter');

      await expect(editor).toHaveDocument(
        // prettier-ignore
        doc(
          p(),
          ol({ order: 3 })(
            li(p('a')),
          ),
          p(),
          ol({ order: 4 })(
            li(p('b')),
          ),
          p(),
        ),
      );
    });
  });

  test.describe('with order 2.9 ordered list adf', () => {
    test.use({
      adf: listStartingFrom2Point9Adf,
    });

    test('restart-numbered-lists-copy-paste.ts: (Editor to Editor) copy pasting a list starting from 2.9 should paste a list starting from 2', async ({
      editor,
    }) => {
      await editor.selection.set({
        anchor: 5,
        head: 11,
      });
      await editor.copy();

      await editor.selection.set({
        anchor: 16,
        head: 16,
      });
      await editor.keyboard.press('Enter');
      await editor.paste();
      await expect(editor).toMatchDocument(
        // prettier-ignore
        doc(
          p(),
          ol({ order: 2.9 }).any,
          p(),
          ol({ order: 2 }).any,
        ),
      );
    });
  });

  test('restart-numbered-lists-copy-paste.ts: (Plain text markdown to Editor) pasting a list starting from 99 should paste a list starting from 99', async ({
    editor,
  }) => {
    await editor.simulatePasteEvent({
      pasteAs: 'text/plain',
      text: `99. a\n100. b\n101. c`,
    });

    await expect(editor).toHaveDocument(
      // prettier-ignore
      doc(
        ol({ order: 99 })(
          li(p('a')),
          li(p('b')),
          li(p('c')),
        ),
      ),
    );
  });

  test('restart-numbered-lists-copy-paste.ts: (Plain text markdown to Editor) pasting a list starting from -3 should not paste a list', async ({
    editor,
  }) => {
    await editor.simulatePasteEvent({
      pasteAs: 'text/plain',
      text: `-3. a\n-2. b\n-1. c`,
    });

    await expect(editor).toHaveDocument(
      // prettier-ignore
      doc(
        p(
          '-3. a',
          hardBreak(),
          '-2. b',
          hardBreak(),
          '-1. c',
        ),
      ),
    );
  });

  test('restart-numbered-lists-copy-paste.ts: (HTML to Editor) pasting a list starting from 33 should paste a list starting from 33', async ({
    editor,
  }) => {
    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      html: `<ol start="33"><li>x</li><li>x</li><li>x</li></ol>`,
    });

    await expect(editor).toHaveDocument(
      // prettier-ignore
      doc(
        ol({ order: 33 })(
          li(p('x')),
          li(p('x')),
          li(p('x')),
        ),
      ),
    );
  });

  test('restart-numbered-lists-copy-paste.ts: (HTML to Editor) pasting a list with no start number should paste a list starting from 1', async ({
    editor,
  }) => {
    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      html: `<ol><li>x</li><li>x</li><li>x</li></ol>`,
    });

    await expect(editor).toHaveDocument(
      // prettier-ignore
      doc(
        ol({ order: 1 })(
          li(p('x')),
          li(p('x')),
          li(p('x')),
        ),
      ),
    );
  });

  test('restart-numbered-lists-copy-paste.ts: (Microsoft Word Online HTML to Editor) pasting a list starting from 99 should paste a list starting from 99', async ({
    editor,
  }) => {
    // simplified version of Word 365 HTML numbered list, as the original html causes copyAsHTML/paste() in webdriver to hang
    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      html: `<div><ol role="list" start="99"><li role="listitem"><p><span><span>A</span></span><span></span></p></li></ol></div><div><ol role="list" start="100"><li><p><span><span>B</span></span><span></span></p></li></ol></div>`,
    });

    // we expect each list item to become an ordered list, because Word HTML nests each <ol> inside a <div>
    // and we currently don't unroll/parse away that structure (so we end up with <ol start=99 /><ol start="100"/>...)
    await expect(editor).toHaveDocument(
      // prettier-ignore
      doc(
        ol({ order: 99 })(
          li(p('A')),
        ),
        ol({ order: 100 })(
          li(p('B')),
        ),
      ),
    );
  });

  // migrated skip config:
  test('restart-numbered-lists.ts: typing "99." inserts ordered list starting from 99', async ({
    editor,
  }) => {
    await editor.keyboard.type('99. ');

    await expect(editor).toHaveDocument(
      // prettier-ignore
      doc(
        ol({ order: 99 })(
          li(p()),
        ),
      ),
    );
  });

  test('restart-numbered-lists.ts: typing "0." inserts ordered list starting from 0', async ({
    editor,
  }) => {
    await editor.keyboard.type('0. ');

    await expect(editor).toHaveDocument(
      // prettier-ignore
      doc(
        ol({ order: 0 })(
          li(p()),
        ),
      ),
    );
  });

  test('restart-numbered-lists.ts: typing "-1." should not insert ordered list', async ({
    editor,
  }) => {
    await editor.keyboard.type('-1. ');

    await expect(editor).toHaveDocument(
      // prettier-ignore
      doc(
        p('-1. '),
      ),
    );
  });

  test('restart-numbered-lists.ts: typing "99." and extra text and pressing enter should continue incrementing from 99', async ({
    editor,
  }) => {
    await editor.keyboard.type('99. a');
    await editor.keyboard.press('Enter');
    await editor.keyboard.type('b');
    await editor.keyboard.press('Enter');
    await editor.keyboard.type('c');
    await editor.keyboard.press('Enter');

    await expect(editor).toHaveDocument(
      // prettier-ignore
      doc(
        ol({ order: 99 })(
          li(p('a')),
          li(p('b')),
          li(p('c')),
          li(p()),
        ),
      ),
    );
  });

  test.describe('with order 0 ordered list adf', () => {
    test.use({
      adf: listStartingFrom0Adf,
    });

    test('restart-numbered-lists.ts: splitting a list that starts from 0 (by pressing Enter) should create 2 lists that continue number sequence', async ({
      editor,
    }) => {
      await editor.selection.set({
        anchor: 6,
        head: 6,
      });

      await editor.keyboard.press('Enter');
      await editor.keyboard.press('Enter');

      await expect(editor).toHaveDocument(
        // prettier-ignore
        doc(
          p(),
          ol({ order: 0 })(
            li(p('a')),
          ),
          p(),
          ol({ order: 1 })(
            li(p('b')),
          ),
          p(),
        ),
      );
    });
  });

  test.describe('with order 1.9 ordered list adf', () => {
    test.use({
      adf: listStartingFrom1Point9Adf,
    });

    test('restart-numbered-lists.ts: splitting a list that starts from 1.9 (by pressing Enter) should create 2 lists that continue number sequence', async ({
      editor,
    }) => {
      await editor.selection.set({
        anchor: 6,
        head: 6,
      });

      await editor.keyboard.press('Enter');
      await editor.keyboard.press('Enter');

      await expect(editor).toHaveDocument(
        // prettier-ignore
        doc(
          p(),
          ol({ order: 1.9 })(
            li(p('a')),
          ),
          p(),
          ol({ order: 2 })(
            li(p('b')),
          ),
          p(),
        ),
      );
    });
  });
});
