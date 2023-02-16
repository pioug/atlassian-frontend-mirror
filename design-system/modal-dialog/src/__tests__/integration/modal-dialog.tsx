import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page, { BrowserObject } from '@atlaskit/webdriver-runner/wd-wrapper';

import { gutter } from '../../internal/constants';

/* Css selectors used for the test */
const openModalBtn = "[data-testid='modal-trigger']";
const modalDialog = "[data-testid='modal']";
const primaryBtn = "[data-testid='primary']";
const secondaryBtn = "[data-testid='secondary']";
const modalTitle = "[data-testid='modal--title']";

BrowserTestCase(
  'Modal should have first focus on primary action, and be closed',
  {},
  async (client: BrowserObject) => {
    const url = getExampleUrl('design-system', 'modal-dialog', 'default-modal');

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
  async (client: BrowserObject) => {
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

BrowserTestCase(
  'Empty modals (no focusable children) should still lock focus',
  {},
  async (client: BrowserObject) => {
    const url = getExampleUrl('design-system', 'modal-dialog', 'custom-child');

    const modalTest = new Page(client);
    await modalTest.goto(url);
    await modalTest.waitFor(openModalBtn, 5000);

    await modalTest.execute((openModalBtn) => {
      const trigger = document.querySelector(openModalBtn) as HTMLElement;
      trigger.focus();
    }, openModalBtn);
    await expect(await modalTest.hasFocus(openModalBtn)).toBe(true);

    await modalTest.click(openModalBtn);
    await modalTest.waitFor(modalDialog, 5000);
    expect(await modalTest.hasFocus(modalDialog)).toBe(true);

    modalTest.keys('Tab', true);
    expect(await modalTest.hasFocus(modalDialog)).toBe(true);

    modalTest.keys(['Shift', 'Tab', 'Shift'], true);
    expect(await modalTest.hasFocus(modalDialog)).toBe(true);

    modalTest.keys('Escape', true);
    await modalTest.waitUntil(
      () => modalTest.hasFocus(openModalBtn),
      'Focus is not returned to previous element on close.',
    );
    expect(await modalTest.hasFocus(openModalBtn)).toBe(true);
  },
);

BrowserTestCase(
  'Modal with shouldScrollInViewport can be closed by clicking on positioner',
  {},
  async (client: BrowserObject) => {
    const url = getExampleUrl('design-system', 'modal-dialog', 'scroll');

    const modalTest = new Page(client);
    await modalTest.goto(url);

    /**
     * Ensure shouldScrollInViewport is enabled.
     */
    const scrollCheckbox = '[data-testid="scroll--checkbox-label"]';
    await modalTest.waitFor(scrollCheckbox, 5000);
    await modalTest.click(scrollCheckbox);

    /**
     * Open the modal.
     */
    await modalTest.click(openModalBtn);
    await modalTest.waitFor(modalDialog, 5000);

    /**
     * Click to the side of the modal.
     */
    const x = 0;
    const y = gutter * 2;

    if (modalTest.isBrowser('chrome')) {
      /**
       * Using the legacy JSON Wire Protocol for Chrome.
       */
      await modalTest.moveTo('body', x, y);
      await modalTest.click();
    } else {
      /**
       * Using the WebDriver protocol for Safari + FireFox.
       */
      await client.performActions([
        {
          type: 'pointer',
          id: 'finger1',
          parameters: { pointerType: 'mouse' },
          actions: [{ type: 'pointerMove', duration: 0, x, y }],
        },
        {
          type: 'pointer',
          id: 'finger1',
          parameters: { pointerType: 'mouse' },
          actions: [{ type: 'pointerDown', button: 0 }],
        },
      ]);
      await client.releaseActions();
    }

    /**
     * Ensure it's been closed.
     */
    await modalTest.waitFor(modalDialog, 5000, true);
    expect(await modalTest.isExisting(modalDialog)).toBe(false);
  },
);

BrowserTestCase(
  'Modal should not close when click event starts on modal and finishes outside of modal',
  {},
  async (client: BrowserObject) => {
    const url = getExampleUrl('design-system', 'modal-dialog', 'default-modal');

    const modalTest = new Page(client);
    await modalTest.goto(url);

    /**
     * Open the modal.
     */
    await modalTest.click(openModalBtn);
    await modalTest.waitFor(modalDialog, 5000);

    /**
     * Start selecting text and then drag off to outside modal
     */
    await modalTest.simulateUserSelection(modalTitle, openModalBtn);

    /**
     * Ensure the modal is still open.
     */
    expect(await modalTest.isExisting(modalDialog)).toBe(true);
  },
);
