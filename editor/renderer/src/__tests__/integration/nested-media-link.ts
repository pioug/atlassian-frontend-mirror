import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  mountRenderer,
  goToRendererTestingExample,
} from '../__helpers/testing-example-helpers';
import mediaLinkInsideTable from './__fixtures__/media-link-inside-table.adf.json';

BrowserTestCase(
  `Media link nested inside table should not cause vertical scroll`,
  {},
  async (client: any, testName: string) => {
    const page = await goToRendererTestingExample(client);
    await mountRenderer(
      page,
      {
        media: {
          featureFlags: {
            newCardExperience: true,
          },
        },
      },
      mediaLinkInsideTable,
    );

    const mediaCardSelector = `[data-testid="media-file-card-view"][data-test-status="complete"]`;

    await page.waitForSelector(mediaCardSelector);

    await page.execute(() => {
      window.scrollBy(0, window.innerHeight);
    });

    const scrollY = await page.execute(() => window.scrollY);

    expect(scrollY).toBe(0);
  },
);
