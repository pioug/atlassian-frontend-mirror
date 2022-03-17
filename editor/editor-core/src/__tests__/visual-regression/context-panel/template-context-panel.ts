import {
  getExampleUrl,
  loadPage,
  PuppeteerPage,
} from '@atlaskit/visual-regression/helper';
import {
  insertTable,
  tableSelectors,
} from '../../__helpers/page-objects/_table';
import { contextPanelSelectors } from '../../__helpers/page-objects/_context-panel';
import { focusEditor, snapshot } from '../_utils';
import { retryUntilStablePosition } from '../../__helpers/page-objects/_toolbar';
import { animationFrame } from '../../__helpers/page-objects/_editor';

export async function goToFullPageWithTemplateContextPanel() {
  const url = getExampleUrl(
    'editor',
    'editor-core',
    'full-page-template-context-panel',
  );
  const { page } = global;
  await loadPage(page, url, {
    // allow side effects
    disabledSideEffects: {
      animation: true,
      transition: true,
    },
  });
  await page.waitForSelector(contextPanelSelectors.contextPanelPanel);
  return page;
}
const waitForFloatingToolbar = async (page: PuppeteerPage) => {
  await retryUntilStablePosition(
    page,
    async () => {
      await page.waitForSelector(tableSelectors.floatingToolbar);
    },
    tableSelectors.floatingToolbar,
  );
};

describe('Full page with template context panel', () => {
  it('should reposition popup components on insert table', async () => {
    const page = await goToFullPageWithTemplateContextPanel();
    await focusEditor(page);
    await insertTable(page);
    await animationFrame(page);
    await animationFrame(page);
    await waitForFloatingToolbar(page);
    await snapshot(page, { useUnsafeThreshold: true, tolerance: 0.01 }, 'body');
  });
});
