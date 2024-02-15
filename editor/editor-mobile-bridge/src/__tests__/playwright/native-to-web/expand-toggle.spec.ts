import { mobileBridgeEditorTestCase as test, expect } from '../not-libra';

test(`Full editor - ClickArea min-height should always be set`, async ({
  bridge,
}) => {
  const wrapperLocator = bridge.page.locator('.editor-click-wrapper');

  await expect(wrapperLocator).toHaveCSS('min-height', '657px');

  await bridge.doCall({ funcName: 'setClickAreaExpanded', args: [true] });

  await expect(wrapperLocator).toHaveCSS('min-height', '657px');
});

test(`Compact editor - ClickArea min-height should be set when setClickAreaExpanded received true`, async ({
  bridge,
}) => {
  const wrapperLocator = bridge.page.locator('.editor-click-wrapper');

  await bridge.configure({
    editorAppearance: 'compact',
  });
  await expect(wrapperLocator).toHaveCSS('min-height', '0px');

  await bridge.doCall({ funcName: 'setClickAreaExpanded', args: [true] });
  await expect(wrapperLocator).toHaveCSS('min-height', '720px');
});
