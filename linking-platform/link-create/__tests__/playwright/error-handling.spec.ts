import { expect, test } from '@af/integration-testing';

test.describe('Link Create', () => {
  test('should show an error message in the form footer if async select options fail to load', async ({
    page,
  }) => {
    await page.route('**/options*', route =>
      route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ errors: [] }),
      }),
    );

    await page.visitExample('linking-platform', 'link-create', 'basic', {
      disableFetchMock: true,
      featureFlag: 'platform.linking-platform.link-create.better-observability',
    });

    const trigger = page.getByRole('button', { name: 'Create' });

    await expect(trigger).toBeVisible();

    await trigger.click();

    await expect(page.getByTestId('link-create-form-error')).toBeVisible();
  });
});
