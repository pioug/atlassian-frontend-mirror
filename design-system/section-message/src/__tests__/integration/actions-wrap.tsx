import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

/* Url to test the example */
const urlSectionMessage = getExampleUrl(
  'design-system',
  'section-message',
  'testing',
);

/* Css selectors used for the test */
const sectionMessage = "[data-testid='overflow-actions-section-message']";
const actions = "[data-testid='overflow-actions-section-message--content']";

BrowserTestCase(
  'SectionMessage should wrap actions onto new lines',
  {},
  async (client: any) => {
    const page = new Page(client);
    await page.goto(urlSectionMessage);

    await page.setWindowSize(1000, 1000);

    // Check width of content container is less than the Section Message.
    // If word wrapping was not working, it would overflow the container and be wider.
    await page.waitFor(sectionMessage, 5000);
    await page.waitFor(actions, 5000);

    const { width: sectionMessageWidth } = await page.getBoundingRect(
      sectionMessage,
    );
    const { width: actionsWidth } = await page.getBoundingRect(actions);

    expect(actionsWidth).toBeLessThan(sectionMessageWidth);
  },
);
