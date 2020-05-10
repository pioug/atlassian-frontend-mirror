import { initFullPageEditorWithAdf, snapshot } from '../_utils';
import * as panel from './__fixtures__/panel-adf.json';
import { Page } from '../../__helpers/page-objects/_types';
import {
  PanelSharedCssClassName,
  PanelSharedSelectors,
} from '@atlaskit/editor-common';
import { waitForNoTooltip } from '@atlaskit/visual-regression/helper';

describe('Panel:', () => {
  let page: Page;

  beforeAll(() => {
    page = global.page;
  });
  beforeEach(async () => {
    await initFullPageEditorWithAdf(page, panel, undefined, {
      width: 800,
      height: 660,
    });
  });
  afterEach(async () => {
    await snapshot(page);
  });

  it('looks correct', async () => {
    await page.click(`.${PanelSharedCssClassName.prefix}`);
  });

  it('displays as selected when click on panel icon', async () => {
    await page.click(`.${PanelSharedCssClassName.icon}`);
  });

  it('displays as selected when click on padding', async () => {
    // page.click clicks in centre of element, so we need to get the bounding rect
    // so we can click the top left corner
    const contentBoundingRect = await page.evaluate(selector => {
      const panelContent = document.querySelector(selector);
      if (panelContent) {
        const rect = panelContent.getBoundingClientRect();
        return { top: rect.top, left: rect.left };
      }
    }, `.${PanelSharedCssClassName.prefix}`);

    if (!contentBoundingRect) {
      throw Error(
        `Unable to find element .${PanelSharedCssClassName.prefix} on page`,
      );
    }

    await page.mouse.click(contentBoundingRect.left, contentBoundingRect.top);
  });

  it("doesn't lose node selection after changing panel type", async () => {
    await page.click(`.${PanelSharedCssClassName.icon}`);

    // Change panel type to note
    await page.click(PanelSharedSelectors.noteButton);

    // await animationFrame doesn't wait for the button to be styled fully selected, and selected
    // buttons don't have any different selectors we can wait for. However, the snapshot importantly
    // shows the new panel colour, icon and node selection intact
    await waitForNoTooltip(page);
  });

  it("doesn't select panel if click and drag before releasing mouse", async () => {
    const contentBoundingRect = await page.evaluate(selector => {
      const panelContent = document.querySelector(selector);
      if (panelContent) {
        const rect = panelContent.getBoundingClientRect();
        return {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        };
      }
    }, `.${PanelSharedCssClassName.prefix}`);

    if (!contentBoundingRect) {
      throw Error(
        `Unable to find element .${PanelSharedCssClassName.prefix} on page`,
      );
    }

    // start in centre of panel, mousedown and then move to padding before releasing
    await page.mouse.move(
      contentBoundingRect.left + contentBoundingRect.width * 0.5,
      contentBoundingRect.top + contentBoundingRect.height * 0.5,
    );
    await page.mouse.down();
    await page.mouse.move(contentBoundingRect.left, contentBoundingRect.top);
    await page.mouse.up();
  });
});
