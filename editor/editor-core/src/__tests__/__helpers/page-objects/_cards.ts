import { Page as PuppeteerPage } from 'puppeteer';
import { CardType } from '@atlaskit/smart-card';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

const inlineCardSelector = (status: CardType = 'resolved') =>
  `[data-testid="inline-card-${status}-view"]`;
const blockCardSelector = (status: CardType = 'resolved') =>
  `[data-testid="block-card-${status}-view"]`;
const embedCardSelector = (status: CardType = 'resolved') =>
  `[data-testid="embed-card-${status}-view"]`;

export const waitForResolvedInlineCard = async (
  page: PuppeteerPage,
  status?: CardType,
) => {
  await page.waitForSelector(inlineCardSelector(status));
  if (status === 'resolving') {
    await page.waitForSelector('.inline-resolving-spinner');
  }
};

export const waitForResolvedBlockCard = async (
  page: PuppeteerPage,
  status?: CardType,
) => {
  await page.waitForSelector(blockCardSelector(status));
};

export const waitForResolvedEmbedCard = async (
  page: PuppeteerPage,
  status?: CardType,
) => {
  await page.waitForSelector(embedCardSelector(status));
};

export const waitForInlineCardSelection = async (
  page: Page | PuppeteerPage,
) => {
  await page.waitForSelector('.inlineCardView-content-wrap');
  await page.click('.inlineCardView-content-wrap');
  await page.waitForSelector('div[aria-label="Floating Toolbar"]');
};

export const waitForBlockCardSelection = async (
  page: Page | PuppeteerPage,
  status?: CardType,
) => {
  const selector = status
    ? blockCardSelector(status)
    : '.blockCardView-content-wrap';
  await page.waitForSelector(selector);
  await page.click(selector);
  await page.waitForSelector('div[aria-label="Floating Toolbar"]');
};

export const waitForEmbedCardSelection = async (
  page: Page | PuppeteerPage,
  status?: CardType,
) => {
  const selector = status
    ? embedCardSelector(status)
    : '.embedCardView-content-wrap';
  await page.waitForSelector(selector);
  // In order to properly simulate click on the frame.
  await page.click(`${selector} .embed-header`);
  await page.waitForSelector('div[aria-label="Floating Toolbar"]');
};
