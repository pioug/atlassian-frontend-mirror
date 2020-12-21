import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { initFullPageEditorWithAdf, snapshot } from '../_utils';
import { CONTENT_AREA_TEST_ID } from '../../../ui/Appearance/FullPage/FullPageContentArea';

describe('Full page editor', () => {
  let page: PuppeteerPage;

  beforeEach(async () => {
    page = global.page;
  });

  it('should fill the viewport height', async () => {
    await initFullPageEditorWithAdf(
      page,
      JSON.parse(`{
        "version": 1,
        "type": "doc",
        "content": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "text": "If you see red at the bottom of this snapshot something has regressed!"
              }
            ]
          }
        ]
      }`),
      undefined,
      { width: 320, height: 280 },
    );

    /**
     * Test to prevent surplus white space from reappearing at the bottom of the editor
     * @see https://product-fabric.atlassian.net/browse/ED-10388
     *
     * These two elements should have an equal height. If they differ, we'll see a red
     * section at the bottom of the screenshot.
     */
    await page.addStyleTag({
      content: `
        .akEditor { background: red; }
        [data-testid="${CONTENT_AREA_TEST_ID}"] { background: white; }
      `,
    });
    await snapshot(page, undefined, '.akEditor');
  });
});
