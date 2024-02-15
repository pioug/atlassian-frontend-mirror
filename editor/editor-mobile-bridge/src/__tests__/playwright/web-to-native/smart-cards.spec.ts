import {
  mobileBridgeEditorClipboardTestCase as test,
  expect,
} from '../not-libra';

test(`inline-1.ts: pasting an link converts to inline card`, async ({
  bridge,
}) => {
  const input = bridge.page.locator('textarea[data-id=clipboardInput]');
  const copyButton = bridge.page.locator('button[aria-label="copy"]');

  await input.fill('https://www.atlassian.com');
  await copyButton.click();

  await bridge.editorLocator.click();
  await bridge.page.keyboard.type('here is a link ');

  await bridge.paste();
  await expect(bridge).toMatchDocumentSnapshot();
});
