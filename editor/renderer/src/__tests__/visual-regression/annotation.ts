import {
  setSelection,
  selectors as rendererSelectors,
} from './../__helpers/page-objects/_renderer';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import {
  snapshot,
  initRendererWithADF,
  Device,
  deviceViewPorts,
  ViewPortOptions,
} from './_utils';
import { selectors } from '../__helpers/page-objects/_annotation';
import * as annotationAdf from '../__fixtures__/annotation-adf.json';

const initRenderer = async (
  page: PuppeteerPage,
  adf: any,
  isMobile = false,
) => {
  let device = Device.LaptopMDPI;
  let viewport: ViewPortOptions = deviceViewPorts[device];
  if (isMobile) {
    device = Device.iPhonePlus;
    viewport = { ...deviceViewPorts[device], hasTouch: true, isMobile: true };
  }
  await initRendererWithADF(page, {
    appearance: 'full-page',
    device: device,
    viewport: viewport,
    rendererProps: {
      allowAnnotations: true,
      withRendererActions: true,
      mockInlineComments: true,
    },
    adf,
  });
};

describe('Snapshot Test: Annotation in renderer', () => {
  let page: PuppeteerPage;
  beforeAll(() => {
    page = global.page;
  });

  test(`displays annotation correctly`, async () => {
    await initRenderer(page, annotationAdf);
    await page.waitForSelector(selectors.annotation);
    await snapshot(page, undefined, selectors.annotation);
  });

  test.skip(`displays draft annotation on click comment`, async () => {
    await initRenderer(page, annotationAdf);
    await page.waitForSelector(selectors.annotation);
    await selectTextToAnnotate(page);
    const commentButton = await page.waitForSelector(selectors.commentButton);
    await commentButton?.click();
    await page.waitForSelector(selectors.draftAnnotation);

    // click textarea inside comment popup to remove browser selection from highlighted text
    const textarea = await page.waitForSelector(
      `${selectors.commentPopup} ${rendererSelectors.editor}`,
    );
    await textarea?.click();

    await snapshot(page, undefined, selectors.draftAnnotation);
  });

  test(`does not display touch feedback for annotation when its touched in mobile`, async () => {
    await initRenderer(page, annotationAdf, true);
    await page.waitForSelector(selectors.annotation);

    await page.tap(selectors.annotation);
    await snapshot(page, undefined, selectors.annotation);
  });

  async function selectTextToAnnotate(page: PuppeteerPage) {
    const [p] = await page.$x(
      "//p[contains(., 'another text without annotation')]",
    );
    const boundingBox = (await p.boundingBox())!;
    setSelection(
      page,
      {
        x: 0,
        y: boundingBox.y + 10,
      },
      {
        x: boundingBox.x + boundingBox.width,
        y: boundingBox.y + 10,
      },
    );
  }
});
