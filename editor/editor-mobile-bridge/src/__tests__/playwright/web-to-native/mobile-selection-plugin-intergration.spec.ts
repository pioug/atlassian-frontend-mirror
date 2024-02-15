import { mobileBridgeEditorTestCase as test, expect } from '../not-libra';

test.use({
  params: {
    selectionObserverEnabled: true,
  },
});

test(`mobile-selection-plugin-intergration: Test dom mobile selection`, async ({
  bridge,
}) => {
  await bridge.page.keyboard.type('test data');

  const calls = await bridge.page.evaluate(() => {
    // @ts-ignore
    const callsFromDummy = window.callsFromDummyBridge;
    return callsFromDummy.get('submitPromise');
  });
  const result = JSON.parse(calls[2][2]);

  expect(result).toMatchObject({
    markTypes: [],
    nodeTypes: ['paragraph'],
    rect: { top: 32, left: 16 },
    selection: { type: 'text', anchor: 3, head: 3 },
  });
});
