import { mobileBridgeEditorTestCase as test, expect } from '../not-libra';

test('currentSelection when no selection', async ({ bridge }) => {
  await bridge.page.keyboard.type('Normal Text');
  await bridge.page.keyboard.press('ArrowLeft');

  const currentSelection = await bridge.output({
    bridgeName: 'linkBridge',
    eventName: 'currentSelection',
  });

  expect(currentSelection).toEqual([
    { bottom: -1, left: -1, right: -1, text: '', top: -1, url: '' },
  ]);
});

test('currentSelection when selection', async ({ bridge }) => {
  await bridge.page.keyboard.type('Normal Text');

  await bridge.page.keyboard.press('ArrowLeft');
  await bridge.page.keyboard.press('ArrowLeft');
  await bridge.page.keyboard.press('ArrowLeft');
  await bridge.page.keyboard.press('ArrowLeft');
  await bridge.waitForStable();

  await bridge.page.keyboard.press('Shift+ArrowRight');
  await bridge.waitForStable();

  await bridge.page.keyboard.press('Shift+ArrowRight');
  await bridge.waitForStable();

  await bridge.page.keyboard.press('Shift+ArrowRight');
  await bridge.waitForStable();

  await bridge.page.keyboard.press('Shift+ArrowRight');
  await bridge.waitForStable();

  const currentSelection = await bridge.output({
    bridgeName: 'linkBridge',
    eventName: 'currentSelection',
  });

  expect(currentSelection).toEqual([
    { bottom: -1, left: -1, right: -1, text: '', top: -1, url: '' },

    {
      bottom: -1,
      left: -1,
      right: -1,
      text: 'T',
      top: -1,
      url: '',
    },
    {
      bottom: -1,
      left: -1,
      right: -1,
      text: 'Te',
      top: -1,
      url: '',
    },
    {
      bottom: -1,
      left: -1,
      right: -1,
      text: 'Tex',
      top: -1,
      url: '',
    },
    {
      bottom: -1,
      left: -1,
      right: -1,
      text: 'Text',
      top: -1,
      url: '',
    },
  ]);
});

test('currentSelection when cursor is on link', async ({ bridge }) => {
  await bridge.doCall({
    funcName: 'onLinkUpdate',
    args: ['Atlassian', 'https://www.google.com'],
  });

  await bridge.waitForStable();
  await bridge.page.keyboard.press('ArrowLeft');

  await bridge.waitForStable();
  const currentSelection = await bridge.output({
    bridgeName: 'linkBridge',
    eventName: 'currentSelection',
  });

  expect(currentSelection).toEqual([
    { bottom: -1, left: -1, right: -1, text: '', top: -1, url: '' },
    {
      bottom: expect.any(Number),
      left: expect.any(Number),
      right: expect.any(Number),
      text: 'Atlassian',
      top: expect.any(Number),
      url: 'https://www.google.com',
    },
  ]);
});

test('currentSelection when cursor is selecting a link', async ({ bridge }) => {
  await bridge.doCall({
    funcName: 'onLinkUpdate',
    args: ['Atlassian', 'https://www.google.com'],
  });

  await bridge.waitForStable();

  await bridge.page.keyboard.press('ArrowLeft');
  await bridge.page.keyboard.press('ArrowLeft');
  await bridge.page.keyboard.press('ArrowLeft');
  await bridge.page.keyboard.press('ArrowLeft');
  await bridge.page.keyboard.press('ArrowLeft');
  await bridge.page.keyboard.press('ArrowLeft');
  await bridge.page.keyboard.press('ArrowLeft');
  await bridge.page.keyboard.press('ArrowLeft');
  await bridge.page.keyboard.press('ArrowLeft');

  await bridge.waitForStable();

  await bridge.page.keyboard.press('Shift+ArrowRight');
  await bridge.waitForStable();

  await bridge.page.keyboard.press('Shift+ArrowRight');
  await bridge.waitForStable();

  await bridge.page.keyboard.press('Shift+ArrowRight');
  await bridge.waitForStable();

  await bridge.page.keyboard.press('Shift+ArrowRight');
  await bridge.waitForStable();

  await bridge.page.keyboard.press('Shift+ArrowRight');
  await bridge.waitForStable();

  await bridge.page.keyboard.press('Shift+ArrowRight');
  await bridge.waitForStable();

  await bridge.page.keyboard.press('Shift+ArrowRight');
  await bridge.waitForStable();

  await bridge.page.keyboard.press('Shift+ArrowRight');
  await bridge.waitForStable();

  await bridge.page.keyboard.press('Shift+ArrowRight');
  await bridge.waitForStable();

  const currentSelection = await bridge.output({
    bridgeName: 'linkBridge',
    eventName: 'currentSelection',
  });

  expect(currentSelection).toEqual([
    {
      bottom: -1,
      left: -1,
      right: -1,
      text: '',
      top: -1,
      url: '',
    },
    {
      left: 16,
      right: 16,
      bottom: expect.any(Number),
      top: expect.any(Number),
      text: 'Atlassian',
      url: 'https://www.google.com',
    },
    {
      bottom: -1,
      left: -1,
      right: -1,
      text: '',
      top: -1,
      url: '',
    },
    {
      bottom: -1,
      left: -1,
      right: -1,
      text: '',
      top: -1,
      url: '',
    },
    {
      bottom: -1,
      left: -1,
      right: -1,
      text: '',
      top: -1,
      url: '',
    },
    {
      bottom: -1,
      left: -1,
      right: -1,
      text: '',
      top: -1,
      url: '',
    },
    {
      bottom: -1,
      left: -1,
      right: -1,
      text: '',
      top: -1,
      url: '',
    },
    {
      bottom: -1,
      left: -1,
      right: -1,
      text: '',
      top: -1,
      url: '',
    },
    {
      bottom: -1,
      left: -1,
      right: -1,
      text: '',
      top: -1,
      url: '',
    },
    {
      bottom: -1,
      left: -1,
      right: -1,
      text: '',
      top: -1,
      url: '',
    },
    {
      bottom: -1,
      left: -1,
      right: -1,
      text: '',
      top: -1,
      url: '',
    },
    {
      left: 16,
      right: 16,
      bottom: expect.any(Number),
      top: expect.any(Number),
      text: 'Atlassian',
      url: 'https://www.google.com',
    },
  ]);
});

test('currentSelection when cursor is selecting text and link', async ({
  bridge,
}) => {
  await bridge.page.keyboard.type('This is a ');

  await bridge.doCall({
    funcName: 'onLinkUpdate',
    args: ['Atlassian', 'https://www.google.com'],
  });

  await bridge.waitForStable();

  await bridge.page.keyboard.press('ArrowLeft');
  await bridge.page.keyboard.press('ArrowLeft');
  await bridge.page.keyboard.press('ArrowLeft');
  await bridge.page.keyboard.press('ArrowLeft');
  await bridge.page.keyboard.press('ArrowLeft');
  await bridge.page.keyboard.press('ArrowLeft');
  await bridge.page.keyboard.press('ArrowLeft');
  await bridge.page.keyboard.press('ArrowLeft');
  await bridge.page.keyboard.press('ArrowLeft');
  await bridge.page.keyboard.press('ArrowLeft');

  await bridge.waitForStable();

  await bridge.page.keyboard.press('Shift+ArrowRight');
  await bridge.waitForStable();

  await bridge.page.keyboard.press('Shift+ArrowRight');
  await bridge.waitForStable();

  await bridge.page.keyboard.press('Shift+ArrowRight');
  await bridge.waitForStable();

  await bridge.page.keyboard.press('Shift+ArrowRight');
  await bridge.waitForStable();

  await bridge.page.keyboard.press('Shift+ArrowRight');
  await bridge.waitForStable();

  await bridge.page.keyboard.press('Shift+ArrowRight');
  await bridge.waitForStable();

  await bridge.page.keyboard.press('Shift+ArrowRight');
  await bridge.waitForStable();

  await bridge.page.keyboard.press('Shift+ArrowRight');
  await bridge.waitForStable();

  await bridge.page.keyboard.press('Shift+ArrowRight');
  await bridge.waitForStable();

  await bridge.page.keyboard.press('Shift+ArrowRight');
  await bridge.waitForStable();

  const currentSelection = await bridge.output({
    bridgeName: 'linkBridge',
    eventName: 'currentSelection',
  });

  expect(currentSelection).toEqual([
    {
      bottom: -1,
      left: -1,
      right: -1,
      text: '',
      top: -1,
      url: '',
    },
    {
      right: expect.any(Number),
      left: expect.any(Number),
      bottom: expect.any(Number),
      top: expect.any(Number),
      text: 'Atlassian',
      url: 'https://www.google.com',
    },
    {
      bottom: -1,
      left: -1,
      right: -1,
      text: '',
      top: -1,
      url: '',
    },
    {
      bottom: -1,
      left: -1,
      right: -1,
      text: ' ',
      top: -1,
      url: '',
    },
    {
      bottom: -1,
      left: -1,
      right: -1,
      text: '',
      top: -1,
      url: '',
    },
    {
      bottom: -1,
      left: -1,
      right: -1,
      text: '',
      top: -1,
      url: '',
    },
    {
      bottom: -1,
      left: -1,
      right: -1,
      text: '',
      top: -1,
      url: '',
    },
    {
      bottom: -1,
      left: -1,
      right: -1,
      text: '',
      top: -1,
      url: '',
    },
    {
      bottom: -1,
      left: -1,
      right: -1,
      text: '',
      top: -1,
      url: '',
    },
    {
      bottom: -1,
      left: -1,
      right: -1,
      text: '',
      top: -1,
      url: '',
    },
    {
      bottom: -1,
      left: -1,
      right: -1,
      text: '',
      top: -1,
      url: '',
    },
    {
      bottom: -1,
      left: -1,
      right: -1,
      text: '',
      top: -1,
      url: '',
    },
    {
      bottom: -1,
      left: -1,
      right: -1,
      text: '',
      top: -1,
      url: '',
    },
  ]);
});
