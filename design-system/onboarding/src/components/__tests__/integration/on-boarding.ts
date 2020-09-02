import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

const urlSpotlightScroll = getExampleUrl(
  'design-system',
  'onboarding',
  'spotlight-autoscroll',
);
const urlSpotlightWithConditionalTargets = getExampleUrl(
  'design-system',
  'onboarding',
  'spotlight-with-conditional-targets',
);
const onBoardingDefault = '#examples > div > p:nth-child(3) > button';
const onBoardingMenuTitle = 'div h4';
const onBoardingCard =
  '.atlaskit-portal-container > div:nth-child(1) > div:nth-child(4) > div > div';
const tellMeMoreBtn = '[type="button"]';
const dynamicTargetStartBtn = '#Start';
const hideShowBtn = '#Hide';
const spotlight1 = '[data-testid = "spotlight1--dialog"]';
const spotlight2 = '[data-testid = "spotlight2--dialog"]';
const spotlight3 = '[data-testid = "spotlight3--dialog"]';

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
  'Spotlight tour should not break if a target is not rendered',
  {},
  async (client: any) => {
    const onBoardingTest = new Page(client);

    await onBoardingTest.goto(urlSpotlightWithConditionalTargets);

    //start the spotlight tour
    await onBoardingTest.click(dynamicTargetStartBtn);
    await onBoardingTest.waitFor(onBoardingMenuTitle, 1000);

    const spotlight1IsVisible = await onBoardingTest.isVisible(spotlight1);
    expect(spotlight1IsVisible).toBe(true);

    await onBoardingTest.click(tellMeMoreBtn);

    const spotlight2IsVisible = await onBoardingTest.isVisible(spotlight2);
    expect(spotlight2IsVisible).toBe(true);

    await onBoardingTest.click(tellMeMoreBtn);

    const spotlight3IsVisible = await onBoardingTest.isVisible(spotlight3);
    expect(spotlight3IsVisible).toBe(true);

    await onBoardingTest.click(tellMeMoreBtn);

    //hide the second element
    await onBoardingTest.click(hideShowBtn);

    const element = ' #examples > div> div:nth-child(2)';
    const text = await onBoardingTest.getText(element);
    expect(text).toBe('Third Element');

    //start the spotlight tour again
    await onBoardingTest.click(dynamicTargetStartBtn);
    await onBoardingTest.waitFor(onBoardingMenuTitle, 5000);

    const spotlight1IsVisibleAgain = await onBoardingTest.isVisible(spotlight1);
    expect(spotlight1IsVisibleAgain).toBe(true);

    await onBoardingTest.click(tellMeMoreBtn);

    const spotlight3IsVisibleAgain = await onBoardingTest.isVisible(spotlight3);
    expect(spotlight3IsVisibleAgain).toBe(true);

    await onBoardingTest.click(tellMeMoreBtn);

    await onBoardingTest.checkConsoleErrors();
  },
);
