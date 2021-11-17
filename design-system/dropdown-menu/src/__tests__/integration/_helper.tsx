import Page from '@atlaskit/webdriver-runner/wd-wrapper';

const getRadioForGroup = async (page: Page, group: string) => {
  const buttons = await page.$$(`#${group} button[aria-checked]`);
  return await page.evaluate(
    (elements) =>
      (elements || []).map((x: any) => x.getAttribute('aria-checked')),
    buttons,
  );
};

export { getRadioForGroup };
