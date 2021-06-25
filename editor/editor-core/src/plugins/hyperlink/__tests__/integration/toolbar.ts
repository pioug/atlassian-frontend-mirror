import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';

import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../../../__tests__/__helpers/testing-example-helpers';
import {
  fullpage,
  editable,
  getDocFromElement,
} from '../../../../__tests__/integration/_helpers';
import { hyperlinkSelectors } from '../../../../__tests__/__helpers/page-objects/_hyperlink';
import basicHyperlinkAdf from '../__fixtures__/basic-hyperlink.adf.json';

BrowserTestCase(
  'can unlink hyperlink using toolbar',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: basicHyperlinkAdf,
    });

    await page.waitForSelector(hyperlinkSelectors.hyperlink);
    await page.click(hyperlinkSelectors.hyperlink);
    await page.waitForSelector(hyperlinkSelectors.unlinkBtn);
    await page.click(hyperlinkSelectors.unlinkBtn);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'closes hyperlink floating toolbar when hit escape key',
  {},
  async (client: any) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: basicHyperlinkAdf,
    });

    await page.waitForSelector(hyperlinkSelectors.hyperlink);
    await page.click(hyperlinkSelectors.hyperlink);
    await page.waitForSelector(hyperlinkSelectors.floatingToolbar);
    await page.keys('Escape');

    expect(await page.isExisting(hyperlinkSelectors.floatingToolbar)).toBe(
      false,
    );
  },
);

BrowserTestCase(
  'can edit hyperlink text with toolbar',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: basicHyperlinkAdf,
    });

    await page.waitForSelector(hyperlinkSelectors.hyperlink);
    await page.click(hyperlinkSelectors.hyperlink);
    await page.waitForSelector(hyperlinkSelectors.editLinkBtn);
    await page.click(hyperlinkSelectors.editLinkBtn);
    await page.type(hyperlinkSelectors.textInput, 'Trello');
    await page.keys('Return');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'can edit hyperlink URL with toolbar',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: basicHyperlinkAdf,
    });

    await page.waitForSelector(hyperlinkSelectors.hyperlink);
    await page.click(hyperlinkSelectors.hyperlink);
    await page.waitForSelector(hyperlinkSelectors.editLinkBtn);
    await page.click(hyperlinkSelectors.editLinkBtn);
    await page.waitForSelector(hyperlinkSelectors.clearLinkBtn);
    await page.click(hyperlinkSelectors.clearLinkBtn);
    await page.type(hyperlinkSelectors.linkInput, 'http://trello.com');
    await page.keys('Return');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'can add anchor link URL with toolbar',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: basicHyperlinkAdf,
    });

    await page.waitForSelector(hyperlinkSelectors.hyperlink);
    await page.click(hyperlinkSelectors.hyperlink);
    await page.waitForSelector(hyperlinkSelectors.editLinkBtn);
    await page.click(hyperlinkSelectors.editLinkBtn);
    await page.waitForSelector(hyperlinkSelectors.clearLinkBtn);
    await page.click(hyperlinkSelectors.clearLinkBtn);
    await page.type(hyperlinkSelectors.linkInput, '#anchor-link');
    await page.keys('Return');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  "doesn't update hyperlink text if hit escape key",
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: basicHyperlinkAdf,
    });

    await page.waitForSelector(hyperlinkSelectors.hyperlink);
    await page.click(hyperlinkSelectors.hyperlink);
    await page.waitForSelector(hyperlinkSelectors.editLinkBtn);
    await page.click(hyperlinkSelectors.editLinkBtn);
    await page.waitForSelector(hyperlinkSelectors.textInput);
    await page.type(hyperlinkSelectors.textInput, 'Trello');
    await page.keys('Escape');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  "doesn't update hyperlink URL if hit escape key",
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: basicHyperlinkAdf,
    });

    await page.waitForSelector(hyperlinkSelectors.hyperlink);
    await page.click(hyperlinkSelectors.hyperlink);
    await page.waitForSelector(hyperlinkSelectors.editLinkBtn);
    await page.click(hyperlinkSelectors.editLinkBtn);
    await page.click(hyperlinkSelectors.clearLinkBtn);
    await page.type(hyperlinkSelectors.linkInput, 'http://trello.com');
    await page.keys('Escape');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  "doesn't close edit link toolbar when text is selected using the mouse and the click is released outside of the toolbar",
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: basicHyperlinkAdf,
    });

    await page.waitForSelector(hyperlinkSelectors.hyperlink);
    await page.click(hyperlinkSelectors.hyperlink);
    await page.waitForSelector(hyperlinkSelectors.editLinkBtn);
    await page.click(hyperlinkSelectors.editLinkBtn);

    const linkInputLocation = await page.getLocation(
      hyperlinkSelectors.linkInput,
    );
    const floatingToolbarLocation = await page.getLocation(
      '[aria-label="Floating Toolbar"]',
    );
    const floatingToolbarSize = await page.getElementSize(
      '[aria-label="Floating Toolbar"]',
    );
    await page.simulateUserDragAndDrop(
      linkInputLocation.x,
      linkInputLocation.y,
      floatingToolbarLocation.x + floatingToolbarSize.width,
      floatingToolbarLocation.y + floatingToolbarSize.height,
      1,
    );

    expect(await page.isExisting(hyperlinkSelectors.linkInput)).toBe(true);
  },
);
