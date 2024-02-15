import { mobileBridgeEditorTestCase as test, expect } from '../not-libra';

test(`links.ts: Insert link on empty content`, async ({ bridge }) => {
  await bridge.page.keyboard.type(' ');

  await bridge.doCall({
    funcName: 'onLinkUpdate',
    args: ['Atlassian', 'https://www.google.com'],
  });

  await expect(bridge).toMatchDocumentSnapshot();
});

test(`links.ts: Insert link on existing text node`, async ({ bridge }) => {
  await bridge.page.keyboard.type('this is a text');
  await bridge.page.keyboard.press('ArrowLeft');
  await bridge.page.keyboard.press('ArrowLeft');
  await bridge.page.keyboard.press('ArrowLeft');
  await bridge.page.keyboard.press('ArrowLeft');

  await bridge.doCall({
    funcName: 'onLinkUpdate',
    args: ['Atlassian', 'https://www.google.com'],
  });

  await expect(bridge).toMatchDocumentSnapshot();
});

test(`links.ts: Insert link with text selection`, async ({ bridge }) => {
  await bridge.page.keyboard.type('this is a text');

  await bridge.page.keyboard.press('ArrowLeft');
  await bridge.page.keyboard.press('ArrowLeft');
  await bridge.page.keyboard.press('ArrowLeft');
  await bridge.page.keyboard.press('ArrowLeft');
  await bridge.page.keyboard.press('ArrowDown+Shift');

  await bridge.doCall({
    funcName: 'onLinkUpdate',
    args: ['Atlassian', 'https://www.google.com'],
  });

  await expect(bridge).toMatchDocumentSnapshot();
});

test(`links.ts: change link text`, async ({ bridge }) => {
  await bridge.doCall({
    funcName: 'onLinkUpdate',
    args: ['Atlassian', 'https://www.google.com'],
  });
  await bridge.page.keyboard.press('ArrowLeft');
  await bridge.page.keyboard.press('ArrowLeft');
  await bridge.page.keyboard.press('ArrowLeft');
  await bridge.page.keyboard.press('ArrowLeft');

  await bridge.doCall({
    funcName: 'onLinkUpdate',
    args: ['This is Atlassian', 'https://www.google.com'],
  });

  await expect(bridge).toMatchDocumentSnapshot();
});

test(`links.ts: change link href`, async ({ bridge }) => {
  await bridge.doCall({
    funcName: 'onLinkUpdate',
    args: ['Google', 'https://www.google.com'],
  });

  await bridge.page.keyboard.press('ArrowLeft');
  await bridge.page.keyboard.press('ArrowLeft');
  await bridge.page.keyboard.press('ArrowLeft');
  await bridge.page.keyboard.press('ArrowLeft');

  await bridge.doCall({
    funcName: 'onLinkUpdate',
    args: ['Google', 'https://www.google2.com'],
  });

  await expect(bridge).toMatchDocumentSnapshot();
});

test(`links.ts: remove link`, async ({ bridge }) => {
  await bridge.page.keyboard.type('this is a link');

  await bridge.page.keyboard.press('Shift+ArrowUp');

  await bridge.doCall({
    funcName: 'onLinkUpdate',
    args: ['Google', 'https://www.google.com'],
  });

  await bridge.page.keyboard.press('Shift+ArrowUp');

  await bridge.doCall({
    funcName: 'onLinkUpdate',
    args: ['text', ''],
  });

  await expect(bridge).toMatchDocumentSnapshot();
});
