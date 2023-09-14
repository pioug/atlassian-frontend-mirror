import invariant from 'tiny-invariant';

import {
  getExampleUrl,
  loadPage,
  PuppeteerPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

const basicSearchButtonSelector =
  '[data-testid="jira-jql-datasource-modal--basic-search-button"]';
const countModeToggleSelector = '[data-testid="mode-toggle-count"]';
const initialTableState =
  '[data-testid="jlol-datasource-modal--initial-state-view"]';
const jiraModal = '[data-testid="jira-jql-datasource-modal"]';
const jiraModalSiteSelector =
  '[data-testid="jira-jql-datasource-modal--site-selector--trigger"]';
const jqlOptionSelector = '[data-testid="mode-toggle-jql"]';
const jqlEditorInputSelector = '[data-testid="jql-editor-input"]';
const jqlEditorBasicInputSelector =
  '[data-testid="jira-jql-datasource-modal--basic-search-input"]';
const jqlEditorBasicSearchButtonSelector =
  '[data-testid="jira-jql-datasource-modal--basic-search-button"]';
const insertButtonSelector =
  '[data-testid="jira-jql-datasource-modal--insert-button"]';
const generatedAdfCodeBlockSelector = '[data-testid="generated-adf"]';
const columnPickerSelector = '[data-testid="column-picker-trigger-button"]';

describe('Modal', () => {
  let page: PuppeteerPage;
  beforeEach(async () => {
    page = global.page;
    const url = getExampleUrl(
      'linking-platform',
      'link-datasource',
      'with-modal',
      __BASEURL__,
    );

    await page.setViewport({
      width: 1100,
      height: 1000,
    });

    await loadPage(page, url);
    await page.waitForSelector(initialTableState);
  });

  describe('without initial jql', () => {
    it('should match snapshot', async () => {
      const image = await takeElementScreenShot(page, jiraModal);

      expect(image).toMatchProdImageSnapshot();
    });
  });

  it('should update the title with the selected jira site', async () => {
    const siteSelectorTrigger = await page.waitForSelector(
      jiraModalSiteSelector,
      {
        visible: true,
      },
    );
    await siteSelectorTrigger?.click();

    expect(
      await takeElementScreenShot(page, jiraModal),
    ).toMatchProdImageSnapshot();

    const availableSitesDropdownItems = await page.$$(
      '[data-testid="jira-jql-datasource-modal--site-selector--dropdown-item"],[data-testid="jira-jql-datasource-modal--site-selector--dropdown-item__selected"]',
    );
    await availableSitesDropdownItems[2].click(); // "hello"

    expect(
      await takeElementScreenShot(page, jiraModal),
    ).toMatchProdImageSnapshot();
  });

  it('should provide autocomplete for JQL fields', async () => {
    await page.click(jqlOptionSelector);
    const jqlInput = await page.waitForSelector(jqlEditorInputSelector);

    // clear the default JQL in order to get autocompletion
    const inputValue = await page.$eval(
      jqlEditorInputSelector,
      el => el.textContent,
    );
    [...(inputValue || [])]?.forEach(
      async () => await page.keyboard.press('Backspace'),
    );

    await jqlInput?.click();
    await jqlInput?.type('sta', { delay: 50 });

    expect(
      await takeElementScreenShot(page, jiraModal),
    ).toMatchProdImageSnapshot();
  });

  it('should provide query suggestions for JQL fields', async () => {
    await page.click(jqlOptionSelector);
    const jqlInput = await page.waitForSelector(jqlEditorInputSelector, {
      visible: true,
    });

    // clear the default JQL in order to get suggestions
    const inputValue = await page.$eval(
      jqlEditorInputSelector,
      el => el.textContent,
    );
    [...(inputValue || [])]?.forEach(
      async () => await page.keyboard.press('Backspace'),
    );

    await jqlInput?.click();
    await jqlInput?.type('status = ', { delay: 50 });

    await page.waitForSelector(
      '[data-testid="jql-editor-autocomplete-option"]',
      { visible: true },
    );

    // TODO: screenshot is not showing suggestions (shows blank area)
    expect(
      await takeElementScreenShot(page, jiraModal),
    ).toMatchProdImageSnapshot();
  });

  it('should show a placeholder smart card before search, and a smart card after search', async () => {
    await page.evaluate(selector => {
      document.querySelector(selector).click();
    }, countModeToggleSelector);

    expect(
      await takeElementScreenShot(page, jiraModal),
    ).toMatchProdImageSnapshot();

    await page.click(jqlEditorBasicInputSelector);
    await page.type(jqlEditorBasicInputSelector, 'test');

    await page.click(basicSearchButtonSelector);
    await page.waitForSelector(
      '[data-testid="link-datasource-render-type--link-resolved-view"]',
      { visible: true },
    );

    expect(
      await takeElementScreenShot(page, jiraModal),
    ).toMatchProdImageSnapshot();
  });

  it('should show issues in a table when basic searched', async () => {
    const basicInput = await page.waitForSelector(jqlEditorBasicInputSelector, {
      visible: true,
    });
    invariant(basicInput);

    await basicInput.click();
    await basicInput.type('basic input', { delay: 50 });
    await page.click(jqlEditorBasicSearchButtonSelector);

    await page.waitForFunction(function () {
      return (
        document.querySelectorAll(
          `[data-testid="jira-jql-datasource-table--body"] tr`,
        ).length > 1
      );
    });

    // For all images to load.
    // TODO prob. there are less flakey way
    await page.waitForTimeout(1000);

    expect(
      await takeElementScreenShot(page, jiraModal),
    ).toMatchProdImageSnapshot();

    await page.click(insertButtonSelector);
    await page.waitForSelector(jiraModal, { hidden: true });

    await page.waitForSelector(generatedAdfCodeBlockSelector);

    expect(await page.screenshot()).toMatchProdImageSnapshot();
  });

  it('should render smart link when result is single row', async () => {
    const siteSelectorTrigger = await page.waitForSelector(
      jiraModalSiteSelector,
      {
        visible: true,
      },
    );
    await siteSelectorTrigger?.click();

    const availableSitesDropdownItems = await page.$$(
      '[data-testid="jira-jql-datasource-modal--site-selector--dropdown-item"],[data-testid="jira-jql-datasource-modal--site-selector--dropdown-item__selected"]',
    );
    await availableSitesDropdownItems[4].click(); // "testSingleIssue"

    const basicInput = await page.waitForSelector(jqlEditorBasicInputSelector);
    basicInput?.type('Render Smart Card');
    await page.click(jqlEditorBasicSearchButtonSelector);

    await page.waitForTimeout(1000); // small delay to ensure smart link rendering is complete

    expect(
      await takeElementScreenShot(page, jiraModal),
    ).toMatchProdImageSnapshot();

    await page.click(insertButtonSelector);

    await page.waitForSelector(jiraModal, { hidden: true });

    await page.waitForSelector(generatedAdfCodeBlockSelector);

    expect(await page.screenshot()).toMatchProdImageSnapshot();
  });

  it('should render no results when results is empty', async () => {
    const siteSelectorTrigger = await page.waitForSelector(
      jiraModalSiteSelector,
      {
        visible: true,
      },
    );
    await siteSelectorTrigger?.click();

    const availableSitesDropdownItems = await page.$$(
      '[data-testid="jira-jql-datasource-modal--site-selector--dropdown-item"],[data-testid="jira-jql-datasource-modal--site-selector--dropdown-item__selected"]',
    );
    await availableSitesDropdownItems[5].click(); // "testNoResults"

    const basicInput = await page.waitForSelector(jqlEditorBasicInputSelector);
    basicInput?.type('test');
    await page.click(jqlEditorBasicSearchButtonSelector);

    expect(
      await takeElementScreenShot(page, jiraModal),
    ).toMatchProdImageSnapshot();
  });

  it('should render error message when request fails', async () => {
    const siteSelectorTrigger = await page.waitForSelector(
      jiraModalSiteSelector,
      {
        visible: true,
      },
    );
    await siteSelectorTrigger?.click();

    const availableSitesDropdownItems = await page.$$(
      '[data-testid="jira-jql-datasource-modal--site-selector--dropdown-item"],[data-testid="jira-jql-datasource-modal--site-selector--dropdown-item__selected"]',
    );
    await availableSitesDropdownItems[6].click(); // "testNetworkError"

    const basicInput = await page.waitForSelector(jqlEditorBasicInputSelector);
    basicInput?.type('test');
    await page.click(jqlEditorBasicSearchButtonSelector);

    expect(
      await takeElementScreenShot(page, jiraModal),
    ).toMatchProdImageSnapshot();
  });

  it('should render unauthorized message when a request returns 403', async () => {
    const siteSelectorTrigger = await page.waitForSelector(
      jiraModalSiteSelector,
      {
        visible: true,
      },
    );
    await siteSelectorTrigger?.click();

    const availableSitesDropdownItems = await page.$$(
      '[data-testid="jira-jql-datasource-modal--site-selector--dropdown-item"],[data-testid="jira-jql-datasource-modal--site-selector--dropdown-item__selected"]',
    );
    await availableSitesDropdownItems[7].click(); // "testNoAccess"

    const basicInput = await page.waitForSelector(jqlEditorBasicInputSelector);
    basicInput?.type('test');
    await page.click(jqlEditorBasicSearchButtonSelector);

    expect(
      await takeElementScreenShot(page, jiraModal),
    ).toMatchProdImageSnapshot();

    await page.click(countModeToggleSelector);
    expect(
      await takeElementScreenShot(page, jiraModal),
    ).toMatchProdImageSnapshot();
  });

  it('should render smart link when in count mode', async () => {
    await page.evaluate(selector => {
      document.querySelector(selector).click();
    }, countModeToggleSelector);

    await page.click(jqlEditorBasicInputSelector);
    await page.type(jqlEditorBasicInputSelector, 'test');

    await page.click(basicSearchButtonSelector);

    // There seems to be some condition that pressing insert button too fast doesn't closes/registered
    await page.waitForTimeout(500);

    await page.click(insertButtonSelector);

    await page.waitForSelector(jiraModal, { hidden: true });

    await page.waitForSelector(generatedAdfCodeBlockSelector);

    expect(await page.screenshot()).toMatchProdImageSnapshot();
  });

  it('should close column picker on first ESC keydown, close modal on second ESC keydown', async () => {
    await page.click(jqlEditorBasicInputSelector);
    await page.type(jqlEditorBasicInputSelector, 'test');
    await page.click(jqlEditorBasicSearchButtonSelector);

    await page.waitForSelector(columnPickerSelector, { visible: true });
    await page.click(columnPickerSelector);
    await page.waitForSelector('.column-picker-popup__menu-list', {
      visible: true,
    });

    // close column picker - modal should stay open
    await page.keyboard.press('Escape');

    expect(
      await takeElementScreenShot(page, jiraModal),
    ).toMatchProdImageSnapshot();

    // close modal
    await page.keyboard.press('Escape');

    expect(await page.screenshot()).toMatchProdImageSnapshot();
  });
});
