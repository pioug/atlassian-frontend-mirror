import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { snapshot, initRendererWithADF, getBoundingClientRect } from './_utils';
import { editorPlaceholderSelector } from '../../../examples/helper/testing-setup';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const multipleParaADF = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'first',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'second',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'third',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'fourth',
        },
      ],
    },
  ],
};

const initRenderer = async (page: PuppeteerPage, adf: any) => {
  await initRendererWithADF(page, {
    appearance: 'full-page',
    adf,
    viewport: { width: 400, height: 300 },
    enableClickToEdit: true,
  });
};

describe('Snapshot Test: Event Handlers', () => {
  let page: PuppeteerPage;
  beforeAll(() => {
    page = global.page;
  });

  afterEach(async () => {
    await snapshot(page);
    // Reset mouse position to avoid accidental hover effects for subsequent tests
    await page.mouse.move(0, 0);
  });

  test(`Should swap renderer to editor when clicking on paragraph`, async () => {
    const singleParagraphADF = {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'first paragraph',
            },
          ],
        },
      ],
    };

    await initRenderer(page, singleParagraphADF);
    await page.waitForSelector('p');
    await page.click('p');
    await page.waitForSelector(editorPlaceholderSelector);
  });

  test(`Shouldn't swap renderer to editor when selecting text or clicking to remove selection`, async () => {
    await initRenderer(page, multipleParaADF);

    const middleParaBoundingRect = await getBoundingClientRect(
      page,
      'p:nth-of-type(2)',
    );

    // Select middle paragraph by clicking and dragging
    await page.mouse.move(
      middleParaBoundingRect.left,
      middleParaBoundingRect.top + middleParaBoundingRect.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(
      middleParaBoundingRect.right,
      middleParaBoundingRect.top + middleParaBoundingRect.height / 2,
    );
    await page.mouse.up();

    // No other way - we're waiting for the renderer *not* to change to the dummy editor
    await sleep(5000);

    // Make sure the middle line is selected in the renderer
    await snapshot(page);

    // Remove selection by clicking. Clicking after selection should not swap renderer to editor
    await page.click('p:nth-of-type(4)');

    // No other way - we're waiting for the renderer *not* to change to the dummy editor
    await sleep(5000);
  });
});
