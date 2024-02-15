import { rendererTestCase as test, expect } from './not-libra';
import { adf } from './datasource.spec.ts-fixtures';

const INLINE_CARD_ICON_AND_TITLE = '[data-testid="inline-card-icon-and-title"]';

const DATASOURCE_TABLE_VIEW = '[data-testid="datasource-table-view"]';
test.describe('datasource: mobile', () => {
  test.use({
    adf,

    rendererProps: {
      appearance: 'mobile',
    },
    rendererMountOptions: {
      withRendererActions: true,
    },
  });
  test(`Can see a datasource falling back to inline smart card on mobile`, async ({
    renderer,
  }) => {
    const locator = renderer.page.locator(INLINE_CARD_ICON_AND_TITLE);

    await expect(locator).toHaveText('0 Issues');
  });
});

test.describe('datasource', () => {
  test.use({
    adf,
    rendererMountOptions: {
      withRendererActions: true,
    },
  });
  test(`Can see a rendered datasource table`, async ({ renderer }) => {
    const locator = renderer.page.locator(DATASOURCE_TABLE_VIEW);

    await expect(locator).toBeVisible();
  });
});
