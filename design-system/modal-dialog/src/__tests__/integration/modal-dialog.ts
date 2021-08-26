import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

/* Css selectors used for the test */
const openModalBtn = "[data-testid='modal-trigger']";
const modalDialog = "[data-testid='modal']";
const primaryBtn = "[data-testid='primary']";
const secondaryBtn = "[data-testid='secondary']";

BrowserTestCase(
  'Modal should have first focus on primary action, and be closed',
  {},
  async (client: any) => {
    const url = getExampleUrl('design-system', 'modal-dialog', 'defaultModal');

    const modalTest = new Page(client);
    await modalTest.goto(url);
    await modalTest.waitFor(openModalBtn, 5000);
    await modalTest.click(openModalBtn);
    await modalTest.waitFor(modalDialog, 5000);

    expect(await modalTest.isVisible(modalDialog)).toBe(true);

    await modalTest.waitUntil(
      () => modalTest.hasFocus(primaryBtn),
      'Primary button does not have initial focus.',
    );
    expect(await modalTest.hasFocus(primaryBtn)).toBe(true);

    modalTest.keys('Tab', true);
    await modalTest.waitUntil(
      () => modalTest.hasFocus(secondaryBtn),
      'Secondary button does not have focus after tab.',
    );
    expect(await modalTest.hasFocus(secondaryBtn)).toBe(true);

    // Focus should go back to primary action, not content body,
    // because this modal is not scrollable.
    modalTest.keys('Tab', true);
    await modalTest.waitUntil(
      () => modalTest.hasFocus(primaryBtn),
      'Focus is not back on primary button.',
    );
    expect(await modalTest.hasFocus(primaryBtn)).toBe(true);

    // Close the modal dialog
    await modalTest.click(primaryBtn);

    // As we have closed the modal-dialog, only the open modal button should be visible.
    await modalTest.waitFor(openModalBtn, 5000);
    expect(await modalTest.isVisible(openModalBtn)).toBe(true);
  },
);

BrowserTestCase(
  'Scrollable modal should have focus on its content',
  {},
  async (client: any) => {
    const url = getExampleUrl('design-system', 'modal-dialog', 'scroll');
    const modalDialogContent = "[data-testid='modal--scrollable']";
    const scrollDownBtn = "[data-testid='scrollDown']";

    const modalTest = new Page(client);
    await modalTest.goto(url);
    await modalTest.waitFor(openModalBtn, 5000);
    await modalTest.click(openModalBtn);
    await modalTest.waitFor(modalDialog, 5000);

    expect(await modalTest.isVisible(modalDialog)).toBe(true);

    await modalTest.waitUntil(
      () => modalTest.hasFocus(primaryBtn),
      'Primary button does not have initial focus.',
    );
    expect(await modalTest.hasFocus(primaryBtn)).toBe(true);

    // Focus should go to content body,
    // because this modal is scrollable.
    modalTest.keys('Tab', true);
    await modalTest.waitUntil(
      () => modalTest.hasFocus(modalDialogContent),
      'Modal dialog content does not have focus after tab.',
    );
    expect(await modalTest.hasFocus(modalDialogContent)).toBe(true);

    modalTest.keys('Tab', true);
    await modalTest.waitUntil(
      () => modalTest.hasFocus(scrollDownBtn),
      'Scroll down button does not have focus after tab.',
    );
    expect(await modalTest.hasFocus(scrollDownBtn)).toBe(true);

    // Focus should go back to primary action.
    modalTest.keys('Tab', true);
    await modalTest.waitUntil(
      () => modalTest.hasFocus(primaryBtn),
      'Focus is not back on primary button.',
    );
    expect(await modalTest.hasFocus(primaryBtn)).toBe(true);
  },
);
