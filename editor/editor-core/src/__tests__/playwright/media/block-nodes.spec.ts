import { editorTestCase as test, expect } from '@af/editor-libra';
import {
  adfMediaSingleWithLinkInALayoutColumn,
  adfMediaSingleWithLinkInATable,
  adfMediaSingleWithLinkInAListItem,
  adfMediaSingleWithLinkInAnExpand,
  adfMediaSingleWithLinkMarkInABodiedExtension,
  adfMediaSingleWithLinkInANestedExpand,
} from './block-nodes.spec.ts-fixtures';

test.describe('media inside block nodes', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowExtension: true,
      allowLayouts: true,
      allowTables: true,
      allowExpand: true,
      media: {
        allowMediaSingle: true,
        allowLinking: true,
        allowResizing: false,
      },
    },
  });

  test.describe('when with media single inside a layout column', () => {
    test.use({
      adf: adfMediaSingleWithLinkInALayoutColumn,
    });

    test('should load', async ({ editor }) => {
      await expect(editor).toMatchDocumentSnapshot();
    });
  });

  test.describe('with media single inside a table cell', () => {
    test.use({ adf: adfMediaSingleWithLinkInATable });

    test('should load', async ({ editor }) => {
      await expect(editor).toMatchDocumentSnapshot();
    });
  });
  test.describe('with media single inside a list item', () => {
    test.use({ adf: adfMediaSingleWithLinkInAListItem });

    test('should load', async ({ editor }) => {
      await expect(editor).toMatchDocumentSnapshot();
    });
  });
  test.describe('with media single inside an expand', () => {
    test.use({ adf: adfMediaSingleWithLinkInAnExpand });

    test('should load', async ({ editor }) => {
      await expect(editor).toMatchDocumentSnapshot();
    });
  });
  test.describe('with media single inside a bodied extension', () => {
    test.use({ adf: adfMediaSingleWithLinkMarkInABodiedExtension });

    test('should load', async ({ editor }) => {
      await expect(editor).toMatchDocumentSnapshot();
    });
  });
  test.describe('with media single inside a nested expand', () => {
    test.use({ adf: adfMediaSingleWithLinkInANestedExpand });
    test('should load', async ({ editor }) => {
      await expect(editor).toMatchDocumentSnapshot();
    });
  });
});
