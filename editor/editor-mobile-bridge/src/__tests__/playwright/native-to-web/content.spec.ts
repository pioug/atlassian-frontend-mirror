import { mobileBridgeEditorTestCase as test, expect } from '../not-libra';

const invalidAdf = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Hello text',
        },
      ],
    },
    {
      type: 'broken',
      attrs: {},
    },
  ],
};

test('Can properly set content when given invalid nodes', async ({
  bridge,
}) => {
  await bridge.doCall({
    funcName: 'setContent',
    args: [JSON.stringify(invalidAdf)],
  });

  await expect(bridge).toMatchDocumentSnapshot();
});
