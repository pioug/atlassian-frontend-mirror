import { mobileBridgeEditorTestCase as test, expect } from '../not-libra';

// eslint-disable-next-line import/no-extraneous-dependencies
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';

test(`feature-flag.ts: Input Rules should be predictable`, async ({
  bridge,
}) => {
  await bridge.configure({});

  await bridge.page.keyboard.type('`code`');

  await bridge.doCall({ funcName: 'undo', args: [] });

  await expect(bridge).toHaveDocument(doc(p('`code`')));
});
