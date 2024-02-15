import { expect, test } from '@af/integration-testing';

import { JQLEditorPage } from './page';

test.describe('JQL Editor User Nodes', () => {
  test('User nodes are hydrated on initial load', async ({ page }) => {
    const jqlEditor = new JQLEditorPage(page);
    await jqlEditor.visitExample('user-nodes');
    await expect(jqlEditor.input).toHaveText(
      `assignee = EMPTY AND status = 111 AND reporter in (Cristian Casais, Kyle Painter, Soney Mathew)`,
    );
  });
  test('User nodes are hydrated on paste', async ({ page }) => {
    const jqlEditor = new JQLEditorPage(page);
    await jqlEditor.visitExample('user-nodes');
    await expect(jqlEditor.input).toHaveText(
      `assignee = EMPTY AND status = 111 AND reporter in (Cristian Casais, Kyle Painter, Soney Mathew)`,
    );
    await jqlEditor.input.clear();
    await jqlEditor.pasteText('assignee = rjuedbergtlfrde');
    await expect(jqlEditor.input).toHaveText('assignee = Cristian Casais');
  });
  test('User nodes are hydrated when inserted from autocomplete', async ({
    page,
  }) => {
    const jqlEditor = new JQLEditorPage(page);
    await jqlEditor.visitExample('user-nodes');
    await expect(jqlEditor.input).toHaveText(
      `assignee = EMPTY AND status = 111 AND reporter in (Cristian Casais, Kyle Painter, Soney Mathew)`,
    );
    await jqlEditor.input.clear();
    await jqlEditor.appendInputValue('assignee = ');
    await jqlEditor.selectAutocompleteOption('Cristian Casais');
    await expect(jqlEditor.input).toHaveText('assignee = Cristian Casais');
  });
  test('User nodes are not hydrated as user types', async ({ page }) => {
    const jqlEditor = new JQLEditorPage(page);
    await jqlEditor.visitExample('user-nodes');
    await expect(jqlEditor.input).toHaveText(
      `assignee = EMPTY AND status = 111 AND reporter in (Cristian Casais, Kyle Painter, Soney Mathew)`,
    );
    await jqlEditor.input.clear();
    await jqlEditor.pasteText('assignee = Cristian Casais');
    await expect(jqlEditor.input).toHaveText('assignee = Cristian Casais');
  });

  test('Other node types are not hydrated when inserted from autocomplete', async ({
    page,
  }) => {
    const jqlEditor = new JQLEditorPage(page);
    await jqlEditor.visitExample('user-nodes');
    await expect(jqlEditor.input).toHaveText(
      `assignee = EMPTY AND status = 111 AND reporter in (Cristian Casais, Kyle Painter, Soney Mathew)`,
    );
    await jqlEditor.input.clear();
    await jqlEditor.appendInputValue('project = ');
    await jqlEditor.selectAutocompleteOption('JSW');
    await expect(jqlEditor.input).toHaveText('project = JSW');
  });

  test('Correctly handles interactions before user nodes', async ({ page }) => {
    const jqlEditor = new JQLEditorPage(page);
    await jqlEditor.visitExample('user-nodes');
    await expect(jqlEditor.input).toHaveText(
      `assignee = EMPTY AND status = 111 AND reporter in (Cristian Casais, Kyle Painter, Soney Mathew)`,
    );
    await jqlEditor.input.clear();
    await jqlEditor.pasteText('status = Done and assignee = rjuedbergtlfrde');
    await expect(jqlEditor.input).toHaveText(
      'status = Done and assignee = Cristian Casais',
    );
    await jqlEditor.pressKeyNTimes('ArrowLeft', 2);
    await jqlEditor.pressKeyNTimes('Backspace', 5);
    await expect(jqlEditor.input).toHaveText(
      'status = Done and assignCristian Casais',
    );
    await jqlEditor.pressKeyNTimes('Backspace', 10);
    await expect(jqlEditor.input).toHaveText('status = Done Cristian Casais');
    await jqlEditor.pressKeyNTimes('Backspace', 6);
    await expect(jqlEditor.input).toHaveText('status =Cristian Casais');
  });

  test('Correctly handles interactions when user nodes are at the end of a paragraph', async ({
    page,
  }) => {
    const jqlEditor = new JQLEditorPage(page);
    await jqlEditor.visitExample('user-nodes');
    await expect(jqlEditor.input).toHaveText(
      `assignee = EMPTY AND status = 111 AND reporter in (Cristian Casais, Kyle Painter, Soney Mathew)`,
    );
    await jqlEditor.input.focus();
    await jqlEditor.input.clear();
    await jqlEditor.pasteText('assignee = rjuedbergtlfrde');
    await expect(jqlEditor.input).toHaveText('assignee = Cristian Casais');
    await jqlEditor.input.type(' AND');
    await expect(jqlEditor.input).toHaveText('assignee = Cristian Casais AND');
    await jqlEditor.pressKeyNTimes('Backspace', 4);
    await expect(jqlEditor.input).toHaveText('assignee = Cristian Casais');
    await jqlEditor.pressKeyNTimes('Backspace', 1);
    await expect(jqlEditor.input).toHaveText('assignee = ');
    await jqlEditor.input.clear();
    await jqlEditor.input.blur();
    await jqlEditor.input.focus();
    await jqlEditor.pasteText('assignee = Cristian Casais');
    await expect(jqlEditor.input).toHaveText('assignee = Cristian Casais');
    await jqlEditor.input.type(' AND');
    await expect(jqlEditor.input).toHaveText('assignee = Cristian Casais AND');
    await jqlEditor.pressKeyNTimes('Backspace', 4);
    await expect(jqlEditor.input).toHaveText('assignee = Cristian Casais');
    await jqlEditor.pressKeyNTimes('Backspace', 1);
    await expect(jqlEditor.input).toHaveText('assignee = Cristian Casai');
  });

  test('Supports quoted AAIDs', async ({ page }) => {
    const jqlEditor = new JQLEditorPage(page);
    await jqlEditor.visitExample('user-nodes');
    await expect(jqlEditor.input).toHaveText(
      `assignee = EMPTY AND status = 111 AND reporter in (Cristian Casais, Kyle Painter, Soney Mathew)`,
    );
    await jqlEditor.input.clear();
    await jqlEditor.pasteText(
      `assignee in (rjuedbergtlfrde, 'rjuedbergtlfrde', "rjuedbergtlfrde")`,
    );
    await expect(jqlEditor.input).toHaveText(
      'assignee in (Cristian Casais, Cristian Casais, Cristian Casais)',
    );
  });

  test('Correctly inserts user nodes when using the keyboard', async ({
    page,
  }) => {
    const jqlEditor = new JQLEditorPage(page);
    await jqlEditor.visitExample('user-nodes');
    await expect(jqlEditor.input).toHaveText(
      `assignee = EMPTY AND status = 111 AND reporter in (Cristian Casais, Kyle Painter, Soney Mathew)`,
    );
    await jqlEditor.input.clear();
    await jqlEditor.input.type('assignee = ');
    await jqlEditor.selectAutocompleteOptionWithKeyboard('EMPTY');
    await expect(jqlEditor.input).toHaveText('assignee = EMPTY');
  });

  test('Does not hydrate user nodes when rich inline nodes are disabled', async ({
    page,
  }) => {
    const jqlEditor = new JQLEditorPage(page);
    await jqlEditor.visitExample('basic-editor');
    await jqlEditor.input.clear();
    await jqlEditor.pasteText('assignee = rjuedbergtlfrde');
    await expect(jqlEditor.input).toHaveText('assignee = rjuedbergtlfrde');
    await jqlEditor.input.clear();
    await jqlEditor.input.type('assignee = ');
    await jqlEditor.selectAutocompleteOption('Soney Mathew');
    await expect(jqlEditor.input).toHaveText('assignee = gvcehdrrgtvvuen');
  });
});
