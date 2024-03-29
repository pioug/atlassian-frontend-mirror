import { akEditorSelectedNodeClassName } from '@atlaskit/editor-shared-styles';
// eslint-disable-next-line import/no-extraneous-dependencies
import { animationFrame } from '@atlaskit/editor-test-helpers/page-objects/editor';
// eslint-disable-next-line import/no-extraneous-dependencies
import { layoutSelectors } from '@atlaskit/editor-test-helpers/page-objects/layouts';
// eslint-disable-next-line import/no-extraneous-dependencies
import { mentionSelectors } from '@atlaskit/editor-test-helpers/page-objects/mention';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  Appearance,
  clickTopLeft,
  initEditorWithAdf,
  retryUntil,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

import selectionLayoutAdf from './__fixtures__/layout.adf.json';

// ED-10826: The editor may present a clickable interface before it is
// fully mounted. We implement retryable clicking to overcome this edge case.
const retryClickUntilSelected = async (
  page: PuppeteerPage,
  clickTarget: string,
  selectionTarget: string,
  shouldClickEdge: boolean = false,
) => {
  const removeButton = layoutSelectors.removeButton;
  const selected = `${selectionTarget}.${akEditorSelectedNodeClassName}`;
  const work = async () => {
    await page.waitForSelector(clickTarget, {
      visible: true,
    });
    if (shouldClickEdge) {
      await clickTopLeft(page, clickTarget);
    } else {
      await page.click(clickTarget);
    }
  };
  const condition = async () => {
    const result = await page.evaluate(
      (selected, removeButton) => {
        return !!(
          document.querySelector(selected) &&
          document.querySelector(removeButton)
        );
      },
      selected,
      removeButton,
    );
    return result;
  };
  await retryUntil(work, condition);
};

describe('Selection:', () => {
  let page: PuppeteerPage;
  describe('Layout', () => {
    beforeAll(() => {
      page = global.page;
    });

    beforeEach(async () => {
      await initEditorWithAdf(page, {
        appearance: Appearance.fullPage,
        adf: selectionLayoutAdf,
        viewport: { width: 1040, height: 400 },
      });
    });

    afterEach(async () => {
      // Wait for a frame because we are using RAF to throttle floating toolbar render
      await animationFrame(page);

      await page.waitForSelector(layoutSelectors.removeButton);
      await page.hover(layoutSelectors.removeButton);
      await page.waitForSelector(`${layoutSelectors.section}.danger`);
      await snapshot(page);
    });

    it('displays danger styling when node is selected', async () => {
      await retryClickUntilSelected(
        page,
        layoutSelectors.column,
        layoutSelectors.section,
        true,
      );
    });

    it('displays danger styling when child node is selected', async () => {
      await retryClickUntilSelected(
        page,
        mentionSelectors.mention,
        mentionSelectors.mention,
      );
    });
  });
});
