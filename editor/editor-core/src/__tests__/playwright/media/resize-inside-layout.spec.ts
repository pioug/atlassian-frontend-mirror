import type { EditorPageInterface } from '@af/editor-libra';
import {
  editorTestCase as test,
  EditorNodeContainerModel,
  EditorUploadMediaModel,
  EditorMediaSingleModel,
  EditorMainToolbarModel,
  EditorBreakoutModel,
  expect,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  mediaSingle,
  layoutSection,
  layoutColumn,
  p,
  ul,
  li,
  breakout,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  layoutWithTwoColumns,
  layoutWithThreeColumns,
  layoutWithRightSideBar,
  mediaSingleInsideListWithinLayoutAdf,
} from './__fixtures__/adf-documents';

async function testStepUploadImageAndResize(
  editor: EditorPageInterface,
): Promise<void> {
  await test.step('put selection inside the first layout column', async () => {
    await editor.selection.set({ anchor: 3, head: 3 });
  });

  await test.step('upload and resize image', async () => {
    const nodes = EditorNodeContainerModel.from(editor);
    const mediaSingleModel = EditorMediaSingleModel.from(nodes.mediaSingle);
    const toolbarModel = EditorMainToolbarModel.from(editor);
    const uploadModel = EditorUploadMediaModel.from(editor);

    await uploadModel.upload({
      actionToTriggerUpload: async () => {
        await toolbarModel.clickAt('Add image');
      },
    });

    await mediaSingleModel.waitForReady();

    await mediaSingleModel.resize({
      moveDirection: 'left',
      moveDistance: 50,
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
    allowLayouts: {
      UNSAFE_addSidebarLayouts: true,
      allowBreakout: true,
    },
    allowBreakout: true,
    media: {
      allowMediaSingle: true,
      allowResizing: true,
    },
  },
});

test.describe('when media is inside a layout with two columns', () => {
  test.use({
    adf: layoutWithTwoColumns,
  });

  const expectedDocuments = {
    noBreakout: doc(
      layoutSection(
        layoutColumn({ width: 50 })(
          mediaSingle({
            layout: 'center',
            width: 66.66666666666666,
          }).any,
          p(''),
        ),
        layoutColumn({ width: 50 })(p('')),
      ),
    ),

    wideBreakout: doc(
      breakout({ mode: 'wide' })(
        layoutSection(
          layoutColumn({ width: 50 })(
            mediaSingle({
              layout: 'center',
              width: 66.66666666666666,
            }).any,
            p(''),
          ),
          layoutColumn({ width: 50 })(p('')),
        ),
      ),
    ),

    fullWidthBreakout: doc(
      breakout({ mode: 'full-width' })(
        layoutSection(
          layoutColumn({ width: 50 })(
            mediaSingle({
              layout: 'center',
              width: 83.33333333333334,
            }).any,
            p(''),
          ),
          layoutColumn({ width: 50 })(p('')),
        ),
      ),
    ),
  };

  test.describe('and has no breakout', () => {
    test('should resize the media single', async ({ editor }) => {
      await testStepUploadImageAndResize(editor);

      await expect(editor).toMatchDocument(expectedDocuments.noBreakout);
    });
  });

  test.describe('and has wide breakout', () => {
    test('should resize the media single', async ({ editor }) => {
      const breakoutModel = EditorBreakoutModel.from(editor);
      await test.step('change layout to wide ', async () => {
        await breakoutModel.toWide();
      });

      await testStepUploadImageAndResize(editor);

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

      await testStepUploadImageAndResize(editor);

      await expect(editor).toMatchDocument(expectedDocuments.fullWidthBreakout);
    });
  });
});

test.describe('when media is inside a layout with three columns', () => {
  test.use({
    adf: layoutWithThreeColumns,
  });

  const expectedDocuments = {
    noBreakout: doc(
      layoutSection(
        layoutColumn({ width: 33.33 })(
          mediaSingle({
            layout: 'center',
            width: 50,
          }).any,
          p(''),
        ),
        layoutColumn({ width: 33.33 })(p('')),
        layoutColumn({ width: 33.33 })(p('')),
      ),
    ),

    wideBreakout: doc(
      breakout({ mode: 'wide' })(
        layoutSection(
          layoutColumn({ width: 33.33 })(
            mediaSingle({
              layout: 'center',
              width: 66.66666666666667,
            }).any,
            p(''),
          ),
          layoutColumn({ width: 33.33 })(p('')),
          layoutColumn({ width: 33.33 })(p('')),
        ),
      ),
    ),

    fullWidthBreakout: doc(
      breakout({ mode: 'full-width' })(
        layoutSection(
          layoutColumn({ width: 33.33 })(
            mediaSingle({
              layout: 'center',
              width: 66.66666666666666,
            }).any,
            p(''),
          ),
          layoutColumn({ width: 33.33 })(p('')),
          layoutColumn({ width: 33.33 })(p('')),
        ),
      ),
    ),
  };

  test.describe('and has no breakout', () => {
    test('should resize the media single', async ({ editor }) => {
      await testStepUploadImageAndResize(editor);

      await expect(editor).toMatchDocument(expectedDocuments.noBreakout);
    });
  });

  test.describe('and has wide breakout', () => {
    test('should resize the media single', async ({ editor }) => {
      const breakoutModel = EditorBreakoutModel.from(editor);
      await test.step('change layout to wide ', async () => {
        await breakoutModel.toWide();
      });

      await testStepUploadImageAndResize(editor);

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
      await testStepUploadImageAndResize(editor);

      await expect(editor).toMatchDocument(expectedDocuments.fullWidthBreakout);
    });
  });
});

test.describe('when media is inside a layout with right side bar', () => {
  test.use({
    adf: layoutWithRightSideBar,
  });

  const expectedDocuments = {
    noBreakout: doc(
      layoutSection(
        layoutColumn({ width: 66.66 })(
          mediaSingle({
            layout: 'center',
            width: 66.66666666666666,
          }).any,
          p(''),
        ),
        layoutColumn({ width: 33.33 })(p('')),
      ),
    ),

    wideBreakout: doc(
      breakout({ mode: 'wide' })(
        layoutSection(
          layoutColumn({ width: 66.66 })(
            mediaSingle({
              layout: 'center',
              width: 83.33333333333333,
            }).any,
            p(''),
          ),
          layoutColumn({ width: 33.33 })(p('')),
        ),
      ),
    ),

    fullWidthBreakout: doc(
      breakout({ mode: 'full-width' })(
        layoutSection(
          layoutColumn({ width: 66.66 })(
            mediaSingle({
              layout: 'center',
              width: 83.33333333333334,
            }).any,
            p(''),
          ),
          layoutColumn({ width: 33.33 })(p('')),
        ),
      ),
    ),
  };

  test.describe('and has no breakout', () => {
    test('should resize the media single', async ({ editor }) => {
      await testStepUploadImageAndResize(editor);

      await expect(editor).toMatchDocument(expectedDocuments.noBreakout);
    });
  });

  test.describe('and has wide breakout', () => {
    test('should resize the media single', async ({ editor }) => {
      const breakoutModel = EditorBreakoutModel.from(editor);
      await test.step('change layout to wide ', async () => {
        await breakoutModel.toWide();
      });

      await testStepUploadImageAndResize(editor);

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
      await testStepUploadImageAndResize(editor);

      await expect(editor).toMatchDocument(expectedDocuments.fullWidthBreakout);
    });
  });
});

test.describe('Image within List is resized to 100% inside column of a two-column layout [EDM-1318]', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowTables: {
        advanced: true,
      },
      allowLayouts: {
        UNSAFE_addSidebarLayouts: true,
        allowBreakout: true,
      },
      allowBreakout: true,
      media: {
        allowMediaSingle: true,
        allowResizing: true,
      },
    },
  });
  test.use({
    adf: mediaSingleInsideListWithinLayoutAdf,
  });

  test('should resize', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const mediaSingleModel = EditorMediaSingleModel.from(nodes.mediaSingle);

    await test.step('put selection inside the first layout column', async () => {
      await editor.selection.set({ anchor: 3, head: 3 });
    });

    await test.step('wait and resize image', async () => {
      await mediaSingleModel.waitForReady();

      await mediaSingleModel.resize({
        moveDirection: 'left',
        moveDistance: 50,
        side: 'right',
      });
    });

    await expect(editor).toMatchDocument(
      doc(
        p(),
        layoutSection(
          layoutColumn({ width: 50 })(p()),
          layoutColumn({ width: 50 })(
            ul(
              li(
                mediaSingle({ layout: 'center', width: 33.333333333333336 })
                  .any,
              ),
            ),
            p(),
          ),
        ),
      ),
    );
  });
});
