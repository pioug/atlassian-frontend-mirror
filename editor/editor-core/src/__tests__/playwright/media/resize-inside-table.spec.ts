import type { EditorPageInterface } from '@af/editor-libra';
import {
  editorTestCase as test,
  EditorNodeContainerModel,
  EditorMediaSingleModel,
  EditorBreakoutModel,
  expect,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  table,
  tr,
  td,
  mediaSingle,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { tableWithOneCallAndMedia } from './__fixtures__/adf-documents';

const testMediaSingle = {
  id: 'a559980d-cd47-43e2-8377-27359fcb905f',
  width: 500,
  height: 374,
};

async function testStepResize(editor: EditorPageInterface): Promise<void> {
  await test.step('put selection to media', async () => {
    await editor.selection.set({ anchor: 3, head: 3 });
  });
  await test.step('resize image', async () => {
    const nodes = EditorNodeContainerModel.from(editor);
    const mediaSingleModel = EditorMediaSingleModel.from(nodes.mediaSingle);

    await mediaSingleModel.resize({
      moveDirection: 'left',
      moveDistance: 100,
      side: 'right',
    });
  });
}

test.use({
  editorProps: {
    appearance: 'full-page',
    allowTables: {
      advanced: true,
    },
    allowBreakout: true,
    media: {
      allowMediaSingle: true,
      allowResizing: true,
    },
  },
});

test.describe('when media is inside a table', () => {
  test.use({
    adf: tableWithOneCallAndMedia(testMediaSingle.id),
  });

  const expectedDocuments = {
    noBreakout: doc(
      table({ localId: '', layout: 'default' })(
        tr(
          td({ colspan: 1 })(
            mediaSingle({
              layout: 'center',
              width: 66.66666666666666,
            }).any,
          ),
        ),
      ),
    ),

    wideBreakout: doc(
      table({ localId: 'localId', layout: 'wide' })(
        tr(
          td({ colspan: 1 })(
            mediaSingle({
              layout: 'center',
              width: 66.66666666666666,
            }).any,
          ),
        ),
      ),
    ),

    fullWidthBreakout: doc(
      table({ localId: 'localId', layout: 'full-width' })(
        tr(
          td({ colspan: 1 })(
            mediaSingle({
              layout: 'center',
              width: 66.66666666666666,
            }).any,
          ),
        ),
      ),
    ),
  };

  test.describe('and has no breakout', () => {
    test('should resize the media single', async ({ editor }) => {
      await testStepResize(editor);
      await expect(editor).toMatchDocument(expectedDocuments.noBreakout);
    });
  });

  test.describe('and has wide breakout', () => {
    test('should resize the media single', async ({ editor }) => {
      const breakoutModel = EditorBreakoutModel.from(editor);
      await test.step('change layout to wide ', async () => {
        await breakoutModel.toWide();
      });
      await testStepResize(editor);
      await expect(editor).toMatchDocument(expectedDocuments.wideBreakout);
    });
  });

  test.describe('and has full-width breakout', () => {
    test('should resize the media single', async ({ editor }) => {
      const breakoutModel = EditorBreakoutModel.from(editor);
      await test.step('change layout to wide ', async () => {
        await breakoutModel.toWide();
      });
      await test.step('change layout to full width', async () => {
        await breakoutModel.toFullWidth();
      });
      await testStepResize(editor);
      await expect(editor).toMatchDocument(expectedDocuments.fullWidthBreakout);
    });
  });
});
