import {
  editorTestCase as test,
  EditorNodeContainerModel,
  EditorMediaFloatingToolbarModel,
  EditorUploadMediaModel,
  FileResourcesAvailable,
  expect,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  mediaSingle,
  media,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';

test.describe('media-single: alt-text', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',

      media: {
        allowMediaSingle: true,
        allowAltTextOnImages: true,
      },
    },
  });

  test('insert-mediaSingle.ts: Inserts a media single on fullpage', async ({
    editor,
  }) => {
    const floatingToolbar = EditorMediaFloatingToolbarModel.from(editor);
    const uploadModel = EditorUploadMediaModel.from(editor);
    const nodes = EditorNodeContainerModel.from(editor);

    await editor.keyboard.type('some text ');

    await uploadModel.upload({
      actionToTriggerUpload: async () => {
        await editor.typeAhead.searchAndInsert('Image');
      },
      fileToUpload: FileResourcesAvailable.SMALL_IMAGE_9_KB,
    });

    await nodes.media.first().click();

    await floatingToolbar.altTextButton.waitFor({ state: 'visible' });
    await floatingToolbar.altTextButton.click();

    await floatingToolbar.altTextInput.waitFor({ state: 'visible' });

    await editor.keyboard.type('Some Alt Lol');
    await editor.keyboard.press('Enter');

    await expect(editor).toMatchDocument(
      doc(
        p('some text '),
        mediaSingle()(
          media({
            __contextId: 'DUMMY-OBJECT-ID',
            __fileMimeType: expect.any(String),
            __fileName: 'test-image-9kb.jpg',
            __fileSize: expect.any(Number),
            width: expect.any(Number),
            height: expect.any(Number),
            id: expect.any(String),
            collection: 'MediaServicesSample',
            type: 'file',
            alt: 'Some Alt Lol',
          })(),
        ),
      ),
    );
  });
});

// Please convert it to Libra
// // Skip the test. Will work on introducing this behaviour back again as part of https://product-fabric.atlassian.net/browse/ED-8673
//   'Inserts can undo clearing the alt text using cmd+z',
//   { ski p: ['firefox', 'chrome', 'safari'] },
//   async (browser: any, testName: string) => {
//     const page = await setupEditorWithMedia(browser);
//     await page.keys(['ArrowUp']);
//
//     await page.waitForSelector(altTextButtonSelector);
//     await page.click(altTextButtonSelector);
//
//     await page.waitForSelector(inputSelector);
//
//     await page.type(inputSelector, 'alttext');
//
//     const altTextInput = await page.$(inputSelector);
//     let value1 = await altTextInput.getValue();
//     expect(value1).toBe('alttext');
//
//     const oldState = await page.$eval(editable, getDocFromElement);
//     const oldAltText = oldState.content[1].content[0].attrs.alt;
//
//     await page.execute(() => {
//       (window as any).onChangeCounter = 0;
//     });
//
//     await page.waitForSelector(cancelBtnSelector);
//     await page.waitForVisible(cancelBtnSelector);
//     await page.click(cancelBtnSelector);
//
//     const value2 = await altTextInput.getValue();
//     expect(value2).toBe('');
//
//     // await until alt text is updated in prosemirror state
//     await page.waitUntil(async () => {
//       const newState = await page.$eval(editable, getDocFromElement);
//       const newAltText = newState.content[1].content[0].attrs.alt;
//       return newAltText !== oldAltText;
//     }, 'alt text did not change in prosemirror state');
//
//     //await until editor onchage prop is called
//     await page.waitUntil(async () => {
//       const onChangeCounter = await browser.execute(() => {
//         return (window as any).onChangeCounter;
//       });
//       return !!onChangeCounter;
//     }, 'onChange history did not change');
//
//     // make sure input is focused
//     await altTextInput.click();
//     await page.waitUntil(async () => {
//       return await altTextInput.isFocused();
//     }, 'Alt text input is not focused');
//
//     // need to use setvalue here on input element for key combo to work reliably across browsers
//     await altTextInput.setValue(['Control', 'z']);
//     await page.waitUntil(async () => {
//       const altTextInput = await page.$(inputSelector);
//       return (await altTextInput.getValue()) === 'alttext';
//     }, 'Does not undo after pressing Ctrl+z');
//
//     await altTextInput.setValue(['Control', 'y']);
//     await page.waitUntil(async () => {
//       return (await altTextInput.getValue()) === '';
//     }, 'Does not redo after pressing Ctrl+y');
//   },
