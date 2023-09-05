import {
  editorTestCase as test,
  EditorNodeContainerModel,
  EditorMediaSingleModel,
  expect,
  fixTest,
  BROWSERS,
} from '@af/editor-libra';
import { mediaCardLazyLoad } from './__fixtures__/adf-documents';

test.use({
  editorProps: {
    appearance: 'full-page',
    media: {
      allowMediaSingle: true,
    },
  },
});

test.describe('media-card', () => {
  test.use({
    adf: mediaCardLazyLoad,
  });

  test('should lazy render media cards after scrolling down', async ({
    editor,
  }) => {
    fixTest({
      jiraIssueId: 'UTEST-708',
      reason:
        'This test fails on firefox due to a playwright+firefox issue where the network request for the image is not present',
      browsers: [BROWSERS.firefox],
    });

    let wasBlobRequested = false;
    editor.page.on('request', (request) => {
      const url = request.url();

      if (url.startsWith('blob')) {
        wasBlobRequested = true;
      }
    });

    const nodes = EditorNodeContainerModel.from(editor);
    const mediaSingleModel = EditorMediaSingleModel.from(nodes.mediaSingle);

    // The image is out of the view port, so the lazy loading selector should be present
    await mediaSingleModel.waitForLoadingStart();

    await test.step('make sure blob wasnt requested yet', async () => {
      expect(wasBlobRequested).toBeFalsy();
    });
    await nodes.mediaSingle.scrollIntoViewIfNeeded();
    await mediaSingleModel.waitForReady();

    expect(wasBlobRequested).toBeTruthy();
  });
});
