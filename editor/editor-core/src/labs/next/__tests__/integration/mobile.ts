import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  goToEditorLabsTestingExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { MobilePresetProps } from '../../presets/mobile';

BrowserTestCase('Should render mobile editor', {}, async (client: any) => {
  const page = await goToEditorLabsTestingExample(client, 'mobile');
  await mountEditor(page, {});
  expect(await page.$('.ProseMirror')).toBeDefined();
});

BrowserTestCase(
  'Should render mobile editor with providers and props',
  {},
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
