import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  goToEditorLabsTestingExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { EditorPresetCXHTMLProps } from '../../presets/cxhtml';

BrowserTestCase('Should render full page editor', {}, async (client: any) => {
  const page = await goToEditorLabsTestingExample(client, 'full-page');
  await mountEditor(page, {});
  expect(await page.$('.ProseMirror')).toBeDefined();
});

BrowserTestCase(
  'Should render full page editor with providers and props',
  {},
  async (client: any) => {
    const page = await goToEditorLabsTestingExample(client, 'full-page');
    await mountEditor<{ preset?: EditorPresetCXHTMLProps }>(
      page,
      {
        preset: {
          placeholder: 'Hello there!',
        },
      },
      {
        providers: {
          media: true,
          cards: true,
          quickInsert: true,
        },
      },
    );
    expect(await page.$('.ProseMirror')).toBeDefined();
  },
);
