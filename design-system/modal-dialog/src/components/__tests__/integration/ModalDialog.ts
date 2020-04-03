import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

/* Url to test the example */
const urlModal = getExampleUrl('core', 'modal-dialog', 'testing');

/* Css selectors used for the test */
const openModal = "[data-testid='open-modal']";
const myModal = "[data-testid='my-modal']";
const closeBtn = "[data-testid='close']";
const cancelBtn = "[data-testid='cancel']";

BrowserTestCase(
  'Modal should be able to have a testId, be closed and secondary action can be clicked',
  {} as any,
  async (client: any) => {
    const modalTest = new Page(client);
    await modalTest.goto(urlModal);
    await modalTest.waitFor(openModal, 5000);
    await modalTest.click(openModal);
    await modalTest.waitFor(myModal, 5000);
    expect(await modalTest.isVisible(myModal)).toBe(true);
    expect(await modalTest.isVisible(closeBtn)).toBe(true);
    expect(await modalTest.isVisible(cancelBtn)).toBe(true);
    await modalTest.click(cancelBtn);
    const textAlert = await modalTest.getAlertText();
    expect(textAlert).toBe('Secondary button has been clicked!');
    await modalTest.acceptAlert();
    await modalTest.click(closeBtn);
    // As we have closed the modal-dialog, only the open modal button should be visible.
    await modalTest.waitFor(openModal, 5000);
    expect(await modalTest.isVisible(openModal)).toBe(true);
  },
);
