import { Page } from '@af/integration-testing';
export class JQLEditorPage {
  private page;
  public input;
  public errorToken;
  public searchButton;
  public validationTooltip;
  public validation;

  constructor(page: Page) {
    this.page = page;
    this.input = this.getEditorLocatorByTestId('input');
    this.errorToken = page.locator("[data-token-type='error']");
    this.searchButton = this.getEditorLocatorByTestId('search');
    this.validationTooltip = this.getValidationLocatorByTestId('tooltip');
    this.validation = this.getEditorLocatorByTestId('validation');
  }

  getEditorLocatorByTestId(text: string) {
    return this.page.getByTestId(`jql-editor-${text}`);
  }

  getValidationLocatorByTestId(text: string) {
    return this.page.getByTestId(`jql-validation-${text}`);
  }

  visitExample(exampleId: string) {
    return this.page.visitExample('jql', 'jql-editor', exampleId);
  }

  appendInputValue = async (text: string) => {
    let currentText = await this.input.textContent();
    await this.input.fill(currentText + text);
  };

  pressKeyNTimes = async (key: string, count: number) => {
    // await this.input.focus();
    for (let i = 0; i < count; i++) {
      await this.page.keyboard.press(key);
    }
  };

  selectAutocompleteOption = async (optionText: string) => {
    const option = this.page.getByText(optionText);
    await option.click();
  };

  selectAutocompleteOptionWithKeyboard = async (optionText: string) => {
    const dropdown = this.getEditorLocatorByTestId('autocomplete');

    const options = await dropdown.getByRole('option').all();
    for (let i = 0; i < options.length; i++) {
      const currentOptionText = await options[i].innerText();
      await this.page.keyboard.press('ArrowDown');
      if (currentOptionText === optionText) {
        await this.page.keyboard.press('Enter');
        break;
      }
    }
  };

  selectText = async (text: string) => {
    let currentText = await this.input.innerText();
    const startIndex = currentText.indexOf(text);
    const endIndex = startIndex + text.length;
    await this.pressKeyNTimes('ArrowLeft', currentText.length - endIndex);
    await this.page.keyboard.down('Shift');
    await this.pressKeyNTimes('ArrowLeft', text.length);
    await this.page.keyboard.up('Shift');
  };

  pasteText = async (text: string) => {
    await this.input.evaluate(
      (element, [text]) => {
        const clipboardData = new DataTransfer();
        clipboardData.setData('text/plain', text);
        const clipboardEvent = new ClipboardEvent('paste', {
          clipboardData,
        });
        element.dispatchEvent(clipboardEvent);
      },
      [text],
    );
  };

  setCursorBefore = async (text: string) => {
    await this.input.click();
    const currentText = await this.input.innerText();
    const startIndex = currentText.indexOf(text);
    await this.pressKeyNTimes('ArrowLeft', currentText.length - startIndex);
  };

  setCursorAfter = async (text: string) => {
    await this.input.click();
    const currentText = await this.input.innerText();
    const startIndex = currentText.indexOf(text);
    const endIndex = startIndex + text.length;
    await this.pressKeyNTimes('ArrowLeft', currentText.length - endIndex);
  };
}
