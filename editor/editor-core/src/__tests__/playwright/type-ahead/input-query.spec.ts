import {
  EditorNodeContainerModel,
  editorTestCase as test,
  expect,
} from '@af/editor-libra';

test.describe('TypeAhead - InputQuery', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
    },
  });

  test(`Input query should insert dummy input if theres no query`, async ({
    editor,
  }) => {
    await editor.selection.set({
      anchor: 1,
      head: 1,
    });
    await editor.typeAhead.search('');

    await expect(editor.typeAhead.query).toBeVisible();
  });

  test(`Input query should maintain same text size as parent p tag`, async ({
    editor,
  }) => {
    const { paragraph } = EditorNodeContainerModel.from(editor);
    await editor.selection.set({
      anchor: 1,
      head: 1,
    });
    await editor.typeAhead.search('');
    const paragraphFontSize = await paragraph.first().evaluate((element) => {
      return window.getComputedStyle(element).getPropertyValue('font-size');
    });

    await expect(editor.typeAhead.query).toHaveCSS(
      'font-size',
      paragraphFontSize,
    );
  });

  test(`Input query carat should maintain same color as typeahead decoration`, async ({
    editor,
  }) => {
    await editor.selection.set({
      anchor: 1,
      head: 1,
    });
    await editor.typeAhead.search('');
    const typeaheadMarkColor = await editor.typeAhead.wrapper.evaluate(
      (element) => {
        return window.getComputedStyle(element).getPropertyValue('color');
      },
    );
    const typeaheadInputColor = await editor.typeAhead.query.evaluate(
      (element) => {
        return window.getComputedStyle(element).getPropertyValue('caret-color');
      },
    );

    await expect(typeaheadMarkColor).toEqual(typeaheadInputColor);
  });
});
