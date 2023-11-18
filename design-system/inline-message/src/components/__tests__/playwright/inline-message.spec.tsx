import { expect, test } from '@af/integration-testing';

const inlineMessageBtn = "[data-testid='the-inline-message--button']";
const inlineMessageComponent = "[data-testid='the-inline-message']";
const inlineMessageTitle = "[data-testid='the-inline-message--title']";
const inlineMessageText = "[data-testid='the-inline-message--text']";
const inlineMessageContent =
  "[data-testid='the-inline-message--inline-dialog']";
const messageHeading = 'h4';

test('InlineMessage should be able to be identified and clicked by data-testid', async ({
  page,
}) => {
  await page.visitExample('design-system', 'inline-message', 'testing');
  await expect(page.locator(inlineMessageBtn).first()).toBeVisible();
  await expect(page.locator(inlineMessageComponent).first()).toBeVisible();
  await expect(page.locator(inlineMessageTitle).first()).toBeVisible();
  await expect(page.locator(inlineMessageText).first()).toBeVisible();
  await expect(page.locator(inlineMessageTitle).first()).toHaveText(
    'My testing Inline Message',
  );
  await expect(page.locator(inlineMessageText).first()).toHaveText(
    'Use data-testid for reliable testing',
  );
  await page.locator(inlineMessageBtn).first().click();
  await expect(page.locator(inlineMessageContent).first()).toBeVisible();
  await expect(page.locator(messageHeading).first()).toHaveText(
    'It is so great to use data-testid',
  );
});
