import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  getDocFromElement,
  editable,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
type ClientType = Parameters<typeof goToEditorTestingWDExample>[0];
import * as inlineCardAdf from './_fixtures_/inline-card.adf.json';
import { waitForResolvedInlineCard } from '@atlaskit/media-integration-test-helpers';

// This test aims to cover a Chrome selection issue : ED-13066
BrowserTestCase(
  'card: should no select when clicking on the edge of the smart link',
  { skip: ['safari', 'firefox'] },
  async (client: ClientType, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: 'full-page',
      allowTextAlignment: true,
      defaultValue: JSON.stringify(inlineCardAdf),
      smartLinks: {
        allowBlockCards: true,
        allowEmbeds: true,
      },
      featureFlags: {
        chromeCursorHandlerFixedVersion: '999',
      },
    });

    // Wait for the resolve of the smart link (inlineCard)
    await page.waitForSelector(`.inlineCardView-content-wrap`);
    await waitForResolvedInlineCard(page);

    // This make sure the inner card element is fully cover the wrapper element outside
    const inlineCardContentWrapperElement = await page.$(
      `.inlineCardView-content-wrap`,
    );
    const {
      cardHeight,
      cardTop,
      inlineCardContentWrapperHeight,
      inlineCardContentWrapperTop,
    } = await (page as any).browser.execute(
      (inlineCardContentWrapperElement: any) => {
        const cardElement = inlineCardContentWrapperElement.querySelector(
          '.card',
        );
        const cardBoundingClientRect = cardElement.getBoundingClientRect();
        const inlineCardContentWrapperBoundingClientRect = inlineCardContentWrapperElement.getBoundingClientRect();
        return {
          cardHeight: cardBoundingClientRect.height,
          cardTop: cardBoundingClientRect.top,
          inlineCardContentWrapperHeight:
            inlineCardContentWrapperBoundingClientRect.height,
          inlineCardContentWrapperTop:
            inlineCardContentWrapperBoundingClientRect.top,
        };
      },
      inlineCardContentWrapperElement,
    );
    expect(cardHeight).toBeGreaterThanOrEqual(inlineCardContentWrapperHeight);
    expect(cardTop).toBeLessThanOrEqual(inlineCardContentWrapperTop);

    // It brings up the floating toolbar as expected
    await page.click('.inlineCardView-content-wrap');
    expect(await page.isVisible('div[aria-label="Floating Toolbar"]')).toBe(
      true,
    );
    expect(
      await page.$eval(editable, getDocFromElement),
    ).toMatchCustomDocSnapshot(testName);
  },
);
