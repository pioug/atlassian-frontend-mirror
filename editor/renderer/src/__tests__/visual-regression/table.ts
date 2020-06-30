import { Page } from 'puppeteer';
import { snapshot, animationFrame, initRendererWithADF } from './_utils';
import * as wideTableResized from '../__fixtures__/table-wide-resized.adf.json';
import * as tableWithShadowAdf from '../__fixtures__/table-with-shadow.adf.json';
import { RendererAppearance } from '../../ui/Renderer/types';

const initRenderer = async (
  page: Page,
  adf: any,
  appearance: RendererAppearance = 'full-page',
) => {
  await initRendererWithADF(page, {
    appearance,
    viewport: { width: 1485, height: 1175 },
    adf,
    rendererProps: { showSidebar: true },
  });
};

describe('Snapshot Test: Table scaling', () => {
  let page: Page;
  beforeAll(() => {
    page = global.page;
  });

  afterEach(async () => {
    await animationFrame(page);
    await snapshot(page);
  });

  it(`should NOT render a right shadow`, async () => {
    await initRenderer(page, wideTableResized);
  });

  it(`should not overlap inline comments dialog`, async () => {
    await initRenderer(page, tableWithShadowAdf);

    await page.evaluate(() => {
      let div = document.createElement('div');
      div.className = '__fake_inline_comment__';
      document.body.appendChild(div);
    });

    const css = `
    .__fake_inline_comment__ {
      position: absolute;
      right: 50px;
      top: 300px;
      width: 300px;
      height: 200px;
      background: white;
      border: 1px solid red;
    }
    `;
    await page.addStyleTag({ content: css });
  });

  it('should render table content correctly in mobile appearance', async () => {
    await initRendererWithADF(page, {
      appearance: 'mobile',
      viewport: { width: 1485, height: 1175 },
      adf: wideTableResized,
    });
  });
});
