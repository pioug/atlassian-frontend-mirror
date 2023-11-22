import {
  buildNode,
  FORGE_EXTENSION_TYPE,
  getExtensionKeyAndNodeKey,
} from '../../manifest-helpers';
import type {
  ExtensionManifest,
  ExtensionModuleActionObject,
} from '../../types/extension-manifest';

describe('manifest-helpers', () => {
  describe('getExtensionKeyAndNodeKey', () => {
    test.each([
      [
        'extension key without colon',
        ['test-extension-key-without-colon', 'test-extension-type'],
        ['test-extension-key-without-colon', 'default'],
      ],
      [
        'extension key with colon',
        ['test-extension-key:with-colon', 'test-extension-type'],
        ['test-extension-key', 'with-colon'],
      ],
      [
        'extension key without colon, with Forge extension type',
        ['test-extension-key-without-colon', FORGE_EXTENSION_TYPE],
        ['test-extension-key-without-colon', 'default'],
      ],
      [
        'extension key with colon, with Forge extension type',
        ['test-extension-key:with-colon', FORGE_EXTENSION_TYPE],
        ['test-extension-key:with-colon', 'default'],
      ],
    ])(
      'correctly parses %s',
      (_, [extensionKey, extensionType], expectedResult) => {
        const result = getExtensionKeyAndNodeKey(extensionKey, extensionType);
        expect(result).toEqual(expectedResult);
      },
    );
  });

  describe('buildNode', () => {
    describe('when build a multiBodiedExtension', () => {
      it('should create a default extension frame', () => {
        const fakeAction: ExtensionModuleActionObject = {
          key: 'fake-action-key',
          type: 'node',
          parameters: {
            one: 'um',
            two: 'dois',
          },
        };
        const fakeManifest: ExtensionManifest = {
          type: 'multiBodiedExtension',
          key: 'fakeKeyManifest',
          title: 'fakeManifest',
          icons: {
            '48': () => Promise.resolve(() => null),
          },
          modules: {
            nodes: {
              'fake-action-key': {
                type: 'multiBodiedExtension',
                render: () => Promise.resolve(() => null),
              },
            },
          },
        };

        const result = buildNode(fakeAction, fakeManifest);

        expect(result).toEqual({
          type: 'multiBodiedExtension',
          attrs: {
            extensionKey: 'fakeKeyManifest:fake-action-key',
            extensionType: 'multiBodiedExtension',
            parameters: {
              one: 'um',
              two: 'dois',
            },
          },
          content: [
            {
              type: 'extensionFrame',
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
          ],
        });
      });
    });
  });
});
