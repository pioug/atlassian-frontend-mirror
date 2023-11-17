import { expect, test } from '@af/integration-testing';

const sectionMessageInfo = "[data-testid='info-section-message']";

const sectionMessageError = "[data-testid='error-section-message']";

const sectionMessageJiraAction = `${sectionMessageInfo} [data-testid='jira']`;

const sectionMessageBitbucketAction = `${sectionMessageInfo} [data-testid='bitbucket']`;

const sectionMessageGoogleAction = `${sectionMessageError} [data-testid='google']`;

test('SectionMessage and SectionMessage actions should be able to be identified and clicked by data-testid', async ({
  page,
}) => {
  await page.visitExample('design-system', 'section-message', 'testing');
  await expect(page.locator(sectionMessageInfo).first()).toBeVisible();
  await expect(page.locator(sectionMessageError).first()).toBeVisible();
  await expect(page.locator(sectionMessageJiraAction).first()).toBeVisible();
  await expect(
    page.locator(sectionMessageBitbucketAction).first(),
  ).toBeVisible();
  await expect(page.locator(sectionMessageGoogleAction).first()).toBeVisible();
  await expect(page.locator(sectionMessageInfo).first()).toHaveText(
    /Atlassian/,
  );
  await expect(page.locator(sectionMessageInfo).first()).toHaveText(/Jira/);
  await expect(page.locator(sectionMessageInfo).first()).toHaveText(
    /Bitbucket/,
  );
  await expect(page.locator(sectionMessageError).first()).toHaveText(/Google/);
  await expect(page.locator(sectionMessageJiraAction).first()).toHaveText(
    /Jira/,
  );
  await expect(page.locator(sectionMessageBitbucketAction).first()).toHaveText(
    /Bitbucket/,
  );
  await expect(page.locator(sectionMessageGoogleAction).first()).toHaveText(
    /Google/,
  );
  await page.locator(sectionMessageBitbucketAction).first().click();
  await expect(page).toHaveURL(/#hiAtlassianBitbucket$/);
});
