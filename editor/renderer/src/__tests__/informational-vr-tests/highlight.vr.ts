import type { Locator, Page } from '@playwright/test';
import { snapshotInformational } from '@af/visual-regression';

import { BackgroundColorYellow } from './highlight.fixture';

snapshotInformational(BackgroundColorYellow, {
  description: 'should overlap highlight with selection',
  variants: [
    {
      name: 'default',
      environment: {},
    },
    {
      name: 'light mode',
      environment: {
        colorScheme: 'light',
      },
    },
    {
      name: 'dark mode',
      environment: {
        colorScheme: 'dark',
      },
    },
  ],
  prepare: async (page: Page) => {
    await partialSelectTextOnRenderer(page.getByText('Custom:'));
  },
});

async function partialSelectTextOnRenderer(locator: Locator) {
  return await locator.evaluate((element: HTMLElement) => {
    const selection = window.getSelection();
    const range = document.createRange();
    range.setStart(element.childNodes[0], 0);
    range.setEnd(element.childNodes[0], element?.innerText?.length / 2);
    selection?.removeAllRanges();
    selection?.addRange(range);
  });
}
