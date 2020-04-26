import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  goToEditorLabsTestingExample,
  mountEditor,
} from '../../../../__tests__/__helpers/testing-example-helpers';
import { EditorPresetCXHTMLProps } from '../../presets/cxhtml';

BrowserTestCase(
  'Should render full page editor',
  { skip: ['edge'] },
  async (client: any) => {
    const page = await goToEditorLabsTestingExample(client, 'full-page');
    await mountEditor(page, {});
    expect(await page.$('.ProseMirror')).toBeDefined();
  },
);

BrowserTestCase(
  'Should render full page editor with providers and props',
  { skip: ['edge'] },
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
