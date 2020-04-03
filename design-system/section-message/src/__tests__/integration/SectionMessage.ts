import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

/* Url to test the example */
const urlSectionMessage = getExampleUrl('core', 'section-message', 'testing');

/* Css selectors used for the test */
const sectionMessageInfo = "[data-testid='info-section-message']";
const sectionMessageError = "[data-testid='error-section-message']";
const sectionMessageJiraAction = `${sectionMessageInfo} [data-testid='jira']`;
const sectionMessageBitbucketAction = `${sectionMessageInfo} [data-testid='bitbucket']`;
const sectionMessageGoogleAction = `${sectionMessageError} [data-testid='google']`;

BrowserTestCase(
  'SectionMessage and SectionMessage actions should be able to be identified and clicked by data-testid',
  {} as any,
  async (client: any) => {
    const page = new Page(client);
    await page.goto(urlSectionMessage);
    await page.waitFor(sectionMessageInfo, 5000);

    // Check for visibility.
    expect(await page.isVisible(sectionMessageInfo)).toBe(true);
    expect(await page.isVisible(sectionMessageError)).toBe(true);
    expect(await page.isVisible(sectionMessageJiraAction)).toBe(true);
    expect(await page.isVisible(sectionMessageBitbucketAction)).toBe(true);
    expect(await page.isVisible(sectionMessageGoogleAction)).toBe(true);

    // Check for content.
    expect(await page.getText(sectionMessageInfo)).toContain('Atlassian');
    expect(await page.getText(sectionMessageInfo)).toContain('Jira');
    expect(await page.getText(sectionMessageInfo)).toContain('Bitbucket');
    expect(await page.getText(sectionMessageError)).toContain('Google');
    expect(await page.getText(sectionMessageJiraAction)).toContain('Jira');
    expect(await page.getText(sectionMessageBitbucketAction)).toContain(
      'Bitbucket',
    );
    expect(await page.getText(sectionMessageGoogleAction)).toContain('Google');

    // Click and check url.
    await page.click(sectionMessageBitbucketAction);
    expect(await page.url()).toBe(
      'https://www.atlassian.com/software/bitbucket',
    );
  },
);
