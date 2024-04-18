import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';
import { ffTest } from '@atlassian/feature-flags-test-utils';

const loadExample = async (
  example: string,
  testId: string = 'jql-editor-input',
) => {
  const url = getExampleUrl('jql', 'jql-editor', example, global.__BASEURL__);
  const { page } = global;
  await loadPage(page, url);
  await page.waitForSelector(`[data-testid="${testId}"]`);
  return page;
};

describe('Snapshot Test', () => {
  ffTest(
    'platform.a11y-jira-team.fix-border-contrast-for-jql-editor-textarea_vy0qk',
    async () => {
      const page = await loadExample('basic-editor');
      const image = await page.screenshot();
      expect(image).toMatchProdImageSnapshot();
    },
  );

  ffTest(
    'platform.a11y-jira-team.fix-border-contrast-for-jql-editor-textarea_vy0qk',
    async () => {
      const page = await loadExample('user-nodes');
      const image = await page.screenshot();
      expect(image).toMatchProdImageSnapshot();
    },
  );

  ffTest(
    'platform.a11y-jira-team.fix-border-contrast-for-jql-editor-textarea_vy0qk',
    async () => {
      const page = await loadExample('external-errors');
      const image = await page.screenshot();
      expect(image).toMatchProdImageSnapshot();
    },
  );

  ffTest(
    'platform.a11y-jira-team.fix-border-contrast-for-jql-editor-textarea_vy0qk',
    async () => {
      const page = await loadExample('no-search-button');
      const image = await page.screenshot();
      expect(image).toMatchProdImageSnapshot();
    },
  );

  ffTest(
    'platform.a11y-jira-team.fix-border-contrast-for-jql-editor-textarea_vy0qk',
    async () => {
      const page = await loadExample('compact-editor');
      const image = await page.screenshot();
      expect(image).toMatchProdImageSnapshot();
    },
  );

  ffTest(
    'platform.a11y-jira-team.fix-border-contrast-for-jql-editor-textarea_vy0qk',
    async () => {
      const page = await loadExample('read-only', 'jql-editor-read-only');
      const image = await page.screenshot();
      expect(image).toMatchProdImageSnapshot();
    },
  );
});
