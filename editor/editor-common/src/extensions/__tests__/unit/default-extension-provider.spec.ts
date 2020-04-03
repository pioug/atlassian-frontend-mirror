import DefaultExtensionProvider from '../../default-extension-provider';
import { createFakeExtensionManifest } from '@atlaskit/editor-test-helpers/extensions';

describe('default-extension-provider', () => {
  const confluenceAwesomeMacro = createFakeExtensionManifest({
    title: 'Awesome macro',
    type: 'confluence.macro',
    extensionKey: 'awesome',
  });

  const confluenceAmazingMacro = createFakeExtensionManifest({
    title: 'Amazing macros',
    type: 'confluence.macro',
    extensionKey: 'amazing',
  });

  let extensionProvider: DefaultExtensionProvider;

  beforeEach(() => {
    extensionProvider = new DefaultExtensionProvider([
      confluenceAwesomeMacro,
      confluenceAmazingMacro,
    ]);
  });

  test('should be able to recover all extensions', async () => {
    expect(await extensionProvider.getExtensions()).toEqual([
      confluenceAwesomeMacro,
      confluenceAmazingMacro,
    ]);
  });

  test('should be able to get an extension by type and key', async () => {
    expect(
      await extensionProvider.getExtension('confluence.macro', 'awesome'),
    ).toBe(confluenceAwesomeMacro);
    expect(
      await extensionProvider.getExtension('confluence.macro', 'amazing'),
    ).toBe(confluenceAmazingMacro);
  });

  test('should fail if not able to get an extension by type or key', () => {
    return expect(
      extensionProvider.getExtension('unknown-type', 'unknown-key'),
    ).rejects.toEqual(
      new Error(
        'Extension with type "unknown-type" and key "unknown-key" not found!',
      ),
    );
  });

  test('should be able to search through the available extensions (case insensitive)', async () => {
    expect(await extensionProvider.search('awes')).toEqual([
      confluenceAwesomeMacro,
    ]);
    expect(await extensionProvider.search('a')).toEqual([
      confluenceAwesomeMacro,
      confluenceAmazingMacro,
    ]);
    expect(await extensionProvider.search('amaz')).toEqual([
      confluenceAmazingMacro,
    ]);
    expect(await extensionProvider.search('none')).toEqual([]);
  });
});
