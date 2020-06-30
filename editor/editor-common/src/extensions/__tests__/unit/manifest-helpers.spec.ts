import {
  FORGE_EXTENSION_TYPE,
  getExtensionKeyAndNodeKey,
} from '../../manifest-helpers';

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
});
