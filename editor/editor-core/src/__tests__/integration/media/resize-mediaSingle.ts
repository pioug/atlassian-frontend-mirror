import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { editable, insertMedia, fullpage } from '../_helpers';
import {
  goToEditorTestingExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';
import { messages as insertBlockMessages } from '../../../plugins/insert-block/ui/ToolbarInsertBlock/messages';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

BrowserTestCase(
  'resize-mediaSingle.ts: Does not throw for allowTables.advanced: false',
  { skip: ['edge', 'ie', 'safari', 'firefox'] },
  async (client: Parameters<typeof goToEditorTestingExample>[0]) => {
    const page = await goToEditorTestingExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowTables: {
        advanced: false,
      },
      media: {
        allowMediaSingle: true,
        allowResizing: true,
      },
    });
    await page.click(
      `[aria-label="${insertBlockMessages.table.defaultMessage}"]`,
    );

    // second cell
    await page.type(editable, 'ArrowDown');

    // now we can insert media as necessary
    await insertMedia(page);

    const mediaSingle = await page.$('.mediaSingleView-content-wrap');
    const startSize = await mediaSingle.getSize();

    const resizeHandle = await resizeMediaSingle(page, mediaSingle);
    await resizeHandle.resizeBy(-100);

    const endSize = await mediaSingle.getSize();

    // if resizing is aborted or the logic to decide wether to resize
    // throws resizing won't happen, thus the dimensions stay the same
    expect(startSize).not.toEqual(endSize);
  },
);

export interface ResizeHandle {
  resizeBy(offset: number): Promise<void>;
}

async function resizeMediaSingle(
  page: Page,
  mediaSingle: WebdriverIO.Element,
): Promise<ResizeHandle> {
  const handleElement = await mediaSingle.$('.mediaSingle-resize-handle-right');

  if (!handleElement) {
    throw new Error(`Could not find mediasingle resize handle`);
  }

  return {
    async resizeBy(offset: number) {
      const location = await handleElement.getLocation();
      const size = await handleElement.getSize();

      const startX = location.x + size.width / 2;
      const startY = location.y + size.height / 2;

      return page.simulateUserDragAndDrop(
        startX,
        startY,
        startX + offset,
        startY,
        100,
      );
    },
  };
}
