import {
  EditorFloatingToolbarModel,
  EditorInlineCardModel,
  EditorNodeContainerModel,
  expect,
  editorTestCase as test,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  blockCard,
  doc,
  embedCard,
  extensionFrame,
  multiBodiedExtension,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { adfWithInlineCard } from './multi-bodied-extensions.spec.ts-fixtures';

test.describe('MultiBodiedExtensions: test for valid nodes', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowPanel: true,
      allowRule: true,
      media: {
        allowMediaSingle: true,
        allowMediaGroup: true,
      },
      allowExtension: {
        allowBreakout: true,
        allowAutoSave: true,
        allowExtendFloatingToolbars: true,
      },
      allowFragmentMark: true,
      insertMenuItems: [],
      allowTables: true,
      allowTextAlignment: true,
      smartLinks: {
        allowBlockCards: true,
        allowEmbeds: true,
      },
    },
    editorMountOptions: {
      withConfluenceMacrosExtensionProvider: true,
    },
    platformFeatureFlags: {
      'platform.editor.multi-bodied-extension_0rygg': true,
      'platform.linking-platform.smart-card.cross-join': true,
    },
  });

  test.use({ adf: adfWithInlineCard });

  test('Add block card', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const inlineCardsModel = EditorInlineCardModel.from(nodes.inlineCard);
    const inlineCardModel = inlineCardsModel.card(0);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      inlineCardsModel,
    );
    await inlineCardModel.waitForResolvedStable();
    await inlineCardModel.click();
    await floatingToolbarModel.toBlock();

    await expect(editor).toMatchDocument(
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
          extensionFrame()(
            blockCard({
              url: 'https://inlineCardTestUrl',
            })(),
          ),
        ),
      ),
    );
  });
  test('Add embed card', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const inlineCardsModel = EditorInlineCardModel.from(nodes.inlineCard);
    const inlineCardModel = inlineCardsModel.card(0);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      inlineCardsModel,
    );
    await inlineCardModel.waitForResolvedStable();
    await inlineCardModel.click();
    await floatingToolbarModel.toEmbed();

    await expect(editor).toMatchDocument(
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
          extensionFrame()(
            embedCard({
              layout: 'center',
              url: 'https://inlineCardTestUrl',
              width: undefined,
            })(),
          ),
        ),
      ),
    );
  });
});
