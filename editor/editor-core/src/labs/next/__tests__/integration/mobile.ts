import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  goToEditorLabsTestingExample,
  mountEditor,
} from '../../../../__tests__/__helpers/testing-example-helpers';
import { MobilePresetProps } from '../../presets/mobile';

BrowserTestCase(
  'Should render mobile editor',
  { skip: ['edge'] },
  async (client: any) => {
    const page = await goToEditorLabsTestingExample(client, 'mobile');
    await mountEditor(page, {});
    expect(await page.$('.ProseMirror')).toBeDefined();
  },
);

BrowserTestCase(
  'Should render mobile editor with providers and props',
  { skip: ['edge'] },
  async (client: any) => {
    const page = await goToEditorLabsTestingExample(client, 'mobile');
    await mountEditor<{ preset?: MobilePresetProps }>(
      page,
      {
        preset: {
          placeholder: 'Hello there!',
          maxContentSize: 50,
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
