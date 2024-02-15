import {
  EditorMultiBodiedExtensionModel,
  EditorNodeContainerModel,
  expect,
  editorTestCase as test,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  extensionFrame,
  multiBodiedExtension,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { adfWithMBE } from './multi-bodied-extensions.spec.ts-fixtures';

test.describe('MultiBodiedExtensions: frames navigation by tab buttons', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowExtension: {
        allowBreakout: true,
      },
      allowFragmentMark: true,
      insertMenuItems: [],
    },
    editorMountOptions: {
      withConfluenceMacrosExtensionProvider: true,
    },
    platformFeatureFlags: {
      'platform.editor.multi-bodied-extension_0rygg': true,
    },
  });

  test('it should insert fake tabs', async ({ editor }) => {
    await editor.typeAhead.search('Fake-Tabs');
    await editor.keyboard.press('Enter');

    await expect(editor).toMatchDocument(
      doc(
        multiBodiedExtension({
          extensionKey: 'fake_tabs.com:fakeTabNode',
          extensionType: 'com.atlassian.confluence.',
          layout: 'default',
          localId: expect.any(String),
          maxFrames: 5,
          parameters: {
            activeTabIndex: 0,
            backgroundColor: 'white',
            extensionTitle: 'Fake Tabs',
            macroMetadata: {
              placeholder: [
                {
                  data: {
                    url: '',
                  },
                  type: 'icon',
                },
              ],
            },
            macroParams: {},
          },
        })(extensionFrame()(p())),
      ),
    );
  });

  test.describe('when loading adf with multiBodiedExtension', () => {
    test.use({ adf: adfWithMBE });

    test('it should add a new tab', async ({ editor }) => {
      await expect(editor).toHaveDocument(
        doc(
          multiBodiedExtension({
            extensionKey: 'fake_tabs.com:fakeTabNode',
            extensionType: 'com.atlassian.confluence.',
            layout: 'default',
            maxFrames: 5,
            parameters: {
              activeTabIndex: 0,
              macroMetadata: {
                placeholder: [
                  {
                    data: {
                      url: '',
                    },
                    type: 'icon',
                  },
                ],
              },
              macroParams: {},
            },
          })(
            extensionFrame()(p('LOL TAB1')),
            extensionFrame()(p('LOL TAB2')),
            extensionFrame()(p('LOL TAB3')),
          ),
        ),
      );
    });
  });
  test.describe('when adding a new tab', () => {
    test.use({ adf: adfWithMBE });

    test('should active the new one', async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const model = EditorMultiBodiedExtensionModel.from(
        nodes.multiBodiedExtension.first(),
      );

      await model.addTabButton.click();

      await expect(model.tabFrames.nth(0)).toBeHidden();
      await expect(model.tabFrames.nth(1)).toBeHidden();
      await expect(model.tabFrames.nth(2)).toBeHidden();
      await expect(model.tabFrames.nth(3)).toBeVisible();
    });

    test('should set selection inside the new frame', async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const model = EditorMultiBodiedExtensionModel.from(
        nodes.multiBodiedExtension.first(),
      );

      await model.addTabButton.click();

      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 39,
        head: 39,
      });
    });
  });

  test.describe('when toggling tabs', () => {
    test.use({ adf: adfWithMBE });

    test('should hidden the non-actives one', async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const model = EditorMultiBodiedExtensionModel.from(
        nodes.multiBodiedExtension.first(),
      );

      await test.step('activing second tab', async () => {
        await model.tabButtons.nth(1).click();

        await expect(model.tabFrames.nth(0)).toBeHidden();
        await expect(model.tabFrames.nth(1)).toBeVisible();
        await expect(model.tabFrames.nth(2)).toBeHidden();
      });

      await test.step('activing third tab', async () => {
        await model.tabButtons.nth(2).click();

        await expect(model.tabFrames.nth(0)).toBeHidden();
        await expect(model.tabFrames.nth(1)).toBeHidden();
        await expect(model.tabFrames.nth(2)).toBeVisible();
      });
    });
  });

  test.describe('when removing tabs', () => {
    test.use({ adf: adfWithMBE });
    test('should remove from ADF', async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const model = EditorMultiBodiedExtensionModel.from(
        nodes.multiBodiedExtension.first(),
      );

      await expect(model.tabFrames.first()).toBeVisible();

      await model.removeTabButtons.nth(1).click();

      await expect(editor).toHaveDocument(
        doc(
          multiBodiedExtension({
            extensionKey: 'fake_tabs.com:fakeTabNode',
            extensionType: 'com.atlassian.confluence.',
            layout: 'default',
            maxFrames: 5,
            parameters: {
              activeTabIndex: 0,
              macroMetadata: {
                placeholder: [
                  {
                    data: {
                      url: '',
                    },
                    type: 'icon',
                  },
                ],
              },
              macroParams: {},
            },
          })(extensionFrame()(p('LOL TAB1')), extensionFrame()(p('LOL TAB3'))),
        ),
      );
    });
  });
});
