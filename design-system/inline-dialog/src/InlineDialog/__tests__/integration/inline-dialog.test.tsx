import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

/* Css selectors used for the test */
const inlineDialogBtn = "[data-testid='open-inline-dialog-button']";
const inlineDialogTestId = "[data-testid='inline-dialog']";

const openModalBtn = "[data-testid='open-modal-button']";
const modalTestId = "[data-testid='modal']";

const datePickerContainer = "[data-testid='date-picker--container']";

BrowserTestCase(
  'InlineDialog should be able to be identified and clicked by data-testid',
  {},
  async (client: any) => {
    const url = getExampleUrl('design-system', 'inline-dialog', 'testing');

    const inlineDialog = new Page(client);
    await inlineDialog.goto(url);

    // wait for the open inline dialog button to show, click it
    await inlineDialog.waitFor(inlineDialogBtn, 5000);
    await inlineDialog.click(inlineDialogBtn);

    // inline dialog should be visible now with the correct content
    expect(await inlineDialog.isVisible(inlineDialogTestId)).toBe(true);
    expect(await inlineDialog.getText(inlineDialogTestId)).toContain('Hello!');
  },
);

BrowserTestCase(
  'InlineDialog with Open Modal button should open modal',
  {},
  async (client: any) => {
    const url = getExampleUrl('design-system', 'inline-dialog', 'modal');

    const inlineDialog = new Page(client);
    await inlineDialog.goto(url);

    // wait for the open inline dialog button to show, click it
    await inlineDialog.waitFor(inlineDialogBtn, 5000);
    await inlineDialog.click(inlineDialogBtn);

    // when the inline dialog button is clicked, it should show the inline dialog
    await inlineDialog.waitFor(inlineDialogTestId, 6000);
    expect(await inlineDialog.isVisible(inlineDialogTestId)).toBe(true);

    // inline dialog should have a button to open modal, click it
    await inlineDialog.waitFor(openModalBtn, 5000);
    await inlineDialog.click(openModalBtn);

    // modal should now be visible
    expect(await inlineDialog.isVisible(modalTestId)).toBe(true);
  },
);

BrowserTestCase(
  'InlineDialog with Open Modal button should open modal',
  {},
  async (client: any) => {
    const url = getExampleUrl('design-system', 'inline-dialog', 'modal');

    const inlineDialog = new Page(client);
    await inlineDialog.goto(url);

    // click the button to open inline dialog
    await inlineDialog.waitFor(inlineDialogBtn, 5000);
    await inlineDialog.click(inlineDialogBtn);

    // when the inline dialog button is clicked, it should show the inline dialog
    await inlineDialog.waitFor(inlineDialogTestId, 6000);
    expect(await inlineDialog.isVisible(inlineDialogTestId)).toBe(true);
    // inline dialog should show a button to open modal
    await inlineDialog.waitFor(openModalBtn, 5000);
    await inlineDialog.click(openModalBtn);
    expect(await inlineDialog.isVisible(modalTestId)).toBe(true);
  },
);

BrowserTestCase(
  'InlineDialog should stay open when modal is closed through button click',
  {},
  async (client: any) => {
    const url = getExampleUrl('design-system', 'inline-dialog', 'modal');

    const inlineDialog = new Page(client);
    await inlineDialog.goto(url);
    await inlineDialog.waitFor(inlineDialogBtn, 5000);
    await inlineDialog.click(inlineDialogBtn);

    // when the 'open dialog 'button is clicked, it should show the inline dialog
    expect(await inlineDialog.isVisible(inlineDialogTestId)).toBe(true);
    await inlineDialog.waitFor(openModalBtn, 5000);
    await inlineDialog.click(openModalBtn);
    expect(await inlineDialog.isVisible(modalTestId)).toBe(true);

    // close the modal dialog by clicking the modal close button
    await inlineDialog.click("[data-testid='primary']");

    // we've closed the modal, the open dialog and open modal button should be visible
    // modal should no longer be there
    await inlineDialog.waitFor(inlineDialogBtn, 5000);
    expect(await inlineDialog.isVisible(inlineDialogBtn)).toBe(true);
    expect(await inlineDialog.isVisible(inlineDialogTestId)).toBe(true);

    await inlineDialog.waitForSelector(
      "[data-testid='modal']",
      { timeout: 5000 },
      true,
    );
    expect(await inlineDialog.isExisting(modalTestId)).toBe(false);
  },
);

BrowserTestCase(
  'InlineDialog should stay open when user clicks modal blanket',
  {},
  async (client: any) => {
    const url = getExampleUrl('design-system', 'inline-dialog', 'modal');

    const inlineDialog = new Page(client);
    await inlineDialog.goto(url);
    await inlineDialog.waitFor(inlineDialogBtn, 5000);
    await inlineDialog.click(inlineDialogBtn);

    // when the 'open dialog 'button is clicked, it should show the inline dialog
    expect(await inlineDialog.isVisible(inlineDialogTestId)).toBe(true);

    // inline dialog should show a button to open modal
    await inlineDialog.waitFor(openModalBtn, 5000);
    await inlineDialog.click(openModalBtn);
    expect(await inlineDialog.isVisible(modalTestId)).toBe(true);

    // close the modal dialog by clicking anywhere in the modal blanket
    await inlineDialog.click("[data-testid='modal--blanket']");

    // we've closed the modal, the open dialog and open modal button should be visible
    // modal should no longer be there
    await inlineDialog.waitFor(inlineDialogBtn, 5000);
    expect(await inlineDialog.isVisible(inlineDialogBtn)).toBe(true);
    expect(await inlineDialog.isVisible(inlineDialogTestId)).toBe(true);

    // wait for modal to disappear and make sure it does not exist
    await inlineDialog.waitForSelector(modalTestId, { timeout: 5000 }, true);
    expect(await inlineDialog.isExisting(modalTestId)).toBe(false);
  },
);

BrowserTestCase(
  'InlineDialog should close correctly after modal is closed',
  {},
  async (client: any) => {
    const url = getExampleUrl('design-system', 'inline-dialog', 'modal');

    const inlineDialog = new Page(client);
    await inlineDialog.goto(url);
    await inlineDialog.waitFor(inlineDialogBtn, 5000);
    await inlineDialog.click(inlineDialogBtn);

    // when the 'open dialog 'button is clicked, it should show the inline dialog
    expect(await inlineDialog.isVisible(inlineDialogTestId)).toBe(true);

    // inline dialog should show a button to open modal
    await inlineDialog.waitFor(openModalBtn, 5000);
    await inlineDialog.click(openModalBtn);
    expect(await inlineDialog.isVisible(modalTestId)).toBe(true);

    // close the modal dialog by clicking anywhere in the modal blanket
    await inlineDialog.click("[data-testid='modal--blanket']");

    // click anywhere in the document to close the inline dialog
    await inlineDialog.click('#examples');

    // button to open inline dialog should be visible but inline dialog
    // itself should not be
    await inlineDialog.waitFor(inlineDialogBtn, 5000);
    expect(await inlineDialog.isVisible(inlineDialogBtn)).toBe(true);
    expect(await inlineDialog.isExisting(inlineDialogTestId)).toBe(false);
  },
);

BrowserTestCase(
  'InlineDialog should work with Select and set value correctly',
  {},
  async (client: any) => {
    const url = getExampleUrl(
      'design-system',
      'inline-dialog',
      'select-datepicker',
    );

    const inlineDialog = new Page(client);
    await inlineDialog.goto(url);

    // assert inline dialog exists
    await inlineDialog.waitFor(inlineDialogTestId, 5000);
    expect(await inlineDialog.isVisible(inlineDialogTestId)).toBe(true);

    // assert Select exists
    await inlineDialog.waitForSelector('.react-select__control');
    expect(await inlineDialog.isVisible('.react-select__control')).toBe(true);

    // assert Select's menu is opened when clicked
    await inlineDialog.click('.react-select__control');
    const menuIsVisible = await inlineDialog.waitForSelector(
      '.react-select__menu',
    );
    expect(menuIsVisible).toBe(true);

    // select the first option, which should be value 1
    await inlineDialog.click('.react-select__option:nth-child(1)');
    // wait for animation to finish
    await client.pause(500);

    // assert that Inlinedialog is still open and has selected a single value
    expect(await inlineDialog.isVisible(inlineDialogTestId)).toBe(true);

    // assert that InlineDialog has selected the correct value
    await inlineDialog.waitForSelector('.react-select__value-container');
    expect(
      await inlineDialog.getText('.react-select__value-container'),
    ).toEqual('value 1');
  },
);

BrowserTestCase(
  'InlineDialog should work correctly with DatePicker component',
  {},
  async (client: any) => {
    const url = getExampleUrl(
      'design-system',
      'inline-dialog',
      'select-datepicker',
    );

    const inlineDialog = new Page(client);
    await inlineDialog.goto(url);

    // assert the InlineDialog exists
    await inlineDialog.waitFor(inlineDialogTestId, 5000);
    expect(await inlineDialog.isVisible(inlineDialogTestId)).toBe(true);

    // assert date picker exists
    await inlineDialog.waitForSelector(datePickerContainer);
    expect(await inlineDialog.isVisible(datePickerContainer)).toBe(true);

    // click date picker to open calendar
    inlineDialog.click(datePickerContainer);

    // wait for animation to finish
    await client.pause(500);

    // assert calendar exists, then click the chosen date
    await inlineDialog.waitForSelector(
      "[data-testid='date-picker--popper--container']",
    );
    inlineDialog.click('[role=gridcell]:nth-child(6)');

    // assert that inline dialog is still open
    expect(await inlineDialog.isVisible(inlineDialogTestId)).toBe(true);
  },
);
