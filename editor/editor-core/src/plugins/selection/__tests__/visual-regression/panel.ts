import {
  PuppeteerPage,
  waitForTooltip,
} from '@atlaskit/visual-regression/helper';
import {
  PanelSharedCssClassName,
  PanelSharedSelectors,
} from '@atlaskit/editor-common';
import {
  snapshot,
  initEditorWithAdf,
  Appearance,
  retryUntil,
} from '../../../../__tests__/visual-regression/_utils';
import { mentionSelectors } from '../../../../__tests__/__helpers/page-objects/_mention';
import { animationFrame } from '../../../../__tests__/__helpers/page-objects/_editor';
import selectionPanelAdf from './__fixtures__/panel.adf.json';
import { akEditorSelectedNodeClassName } from '@atlaskit/editor-shared-styles';

// ED-10826: The editor may present a clickable interface before it is
// fully mounted. We implement retryable clicking to overcome this edge case.
const retryClickUntilSelected = async (
  page: PuppeteerPage,
  clickTarget: string,
  selectionTarget: string,
) => {
  const removeButton = PanelSharedSelectors.removeButton;
  const selected = `${selectionTarget}.${akEditorSelectedNodeClassName}`;
  const work = async () => {
    await page.waitForSelector(clickTarget, {
      visible: true,
    });
    await page.click(clickTarget);
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

  describe('Panel', () => {
    beforeAll(() => {
      page = global.page;
    });

    beforeEach(async () => {
      await initEditorWithAdf(page, {
        appearance: Appearance.fullPage,
        adf: selectionPanelAdf,
        viewport: { width: 800, height: 320 },
      });
    });

    afterEach(async () => {
      // Wait for a frame because we are using RAF to throttle floating toolbar render
      await animationFrame(page);

      await page.waitForSelector(PanelSharedSelectors.removeButton);
      await page.hover(PanelSharedSelectors.removeButton);
      await page.waitForSelector(`.${PanelSharedCssClassName.prefix}.danger`);
      await waitForTooltip(page);
      await snapshot(page);
    });

    it('displays danger styling when node is selected', async () => {
      const icon = `.${PanelSharedCssClassName.icon}`;
      const panel = `.${PanelSharedCssClassName.prefix}`;
      await retryClickUntilSelected(page, icon, panel);
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
