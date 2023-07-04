import { editorTestCase as test, expect } from '@af/editor-libra';
import {
  simpleTableWidthNullLayoutDefault,
  simpleTableWidthNullLayoutWide,
  simpleTableWidthNullLayoutFullWidth,
} from './__fixtures__/base-adfs';
import { doc, table, tr } from '@atlaskit/editor-test-helpers/doc-builder';

const expectedDocuments = {
  fullWidthAppearanceLayoutDefault: doc(
    table({
      localId: 'localId',
      isNumberColumnEnabled: false,
      layout: 'default',
      width: 1800,
    })(tr.any, tr.any, tr.any),
  ),

  fixedWidthAppearanceLayoutWide: doc(
    table({
      localId: 'localId',
      isNumberColumnEnabled: false,
      layout: 'wide',
      width: 960,
    })(tr.any, tr.any, tr.any),
  ),
  fixedWidthAppearanceLayoutFullWidth: doc(
    table({
      localId: 'localId',
      isNumberColumnEnabled: false,
      layout: 'full-width',
      width: 1800,
    })(tr.any, tr.any, tr.any),
  ),
};

test.describe('Load an existing table with width attr equal null in full-width appearance', () => {
  test.use({
    editorProps: {
      allowTables: {
        advanced: true,
      },
      allowLayouts: true,
      appearance: 'full-width',
    },
    adf: simpleTableWidthNullLayoutDefault,
    platformFeatureFlags: { 'platform.editor.custom-table-width': true },
  });

  test('Table width attr should be 1800', async ({ editor }) => {
    await expect(editor).toMatchDocument(
      expectedDocuments.fullWidthAppearanceLayoutDefault,
    );
  });
});

test.describe('Load an existing table layout wide width null in fixed-width appearance', () => {
  test.use({
    editorProps: {
      allowTables: {
        advanced: true,
      },
      allowLayouts: true,
      appearance: 'full-page',
    },
    adf: simpleTableWidthNullLayoutWide,
    platformFeatureFlags: { 'platform.editor.custom-table-width': true },
  });

  test('Table width attr should be 960', async ({ editor }) => {
    await expect(editor).toMatchDocument(
      expectedDocuments.fixedWidthAppearanceLayoutWide,
    );
  });
});

test.describe('Load an existing table layout full-width width null in fixed-width appearance', () => {
  test.use({
    editorProps: {
      allowTables: {
        advanced: true,
      },
      allowLayouts: true,
      appearance: 'full-page',
    },

    adf: simpleTableWidthNullLayoutFullWidth,
    platformFeatureFlags: { 'platform.editor.custom-table-width': true },
  });

  test('Table width attr should be 1800', async ({ editor }) => {
    await expect(editor).toMatchDocument(
      expectedDocuments.fixedWidthAppearanceLayoutFullWidth,
    );
  });
});
