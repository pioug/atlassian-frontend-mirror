import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

const urlSpotlightScroll = getExampleUrl(
  'design-system',
  'onboarding',
  'spotlight-autoscroll',
);
const urlSpotlightBasic = getExampleUrl(
  'design-system',
  'onboarding',
  'spotlight-basic',
);
const onBoardingDefault = '#examples > div > p:nth-child(3) > button';
const onBoardingMenuTitle = 'div h4';
const onBoardingCard =
  '.atlaskit-portal-container > div:nth-child(1) > div:nth-child(4) > div > div';
const startBtn = '#examples > button';
const tellMeMoreBtn = '[type="button"]';

BrowserTestCase(
  'AK-4279 - Clicking on show should display the onboarding and no errors',
  { skip: ['safari'] }, // Safari and Edge have issues at the moment
  async (client: any) => {
    const onBoardingTest = new Page(client);
    await onBoardingTest.goto(urlSpotlightScroll);
    await onBoardingTest.click(onBoardingDefault);
    await onBoardingTest.waitFor(onBoardingMenuTitle, 5000);
    const menuIsVisible = await onBoardingTest.isVisible(onBoardingCard);
    expect(menuIsVisible).toBe(true);
    await onBoardingTest.checkConsoleErrors();
  },
);

BrowserTestCase(
  'AK-5612 - Blanket should never be on top of the spotlight modal',
  { skip: ['safari', 'firefox', 'chrome'] }, // The actual issue was only occuring in IE11
  async (client: any) => {
    const onBoardingTest = new Page(client);
    await onBoardingTest.goto(urlSpotlightBasic);
    await onBoardingTest.click(startBtn);
    await onBoardingTest.waitFor(onBoardingMenuTitle, 5000);
    const menuIsVisible = await onBoardingTest.isVisible(onBoardingMenuTitle);
    expect(menuIsVisible).toBe(true);
    await onBoardingTest.click(tellMeMoreBtn);
    await onBoardingTest.waitFor(onBoardingMenuTitle, 5000);
    const text = await onBoardingTest.getText(onBoardingMenuTitle);
    expect(text).toBe('Yellow');
    await onBoardingTest.checkConsoleErrors();
  },
);
