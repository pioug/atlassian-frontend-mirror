import { createFakeExtensionManifest } from '@atlaskit/editor-test-helpers/extensions';
import DefaultExtensionProvider from '../../default-extension-provider';
import combineExtensionProviders from '../../combine-extension-providers';
import { ExtensionProvider } from '../../types';

describe('combine-extension-providers', () => {
  const confluenceAwesomeMacro = createFakeExtensionManifest({
    title: 'Awesome macro',
    type: 'confluence.macro',
    extensionKey: 'awesome',
  });

  const forgeAmazingExtension = createFakeExtensionManifest({
    title: 'Amazing extensions',
    type: 'atlassian.forge',
    extensionKey: 'amazing',
  });

  const confluenceDumbMacro = createFakeExtensionManifest({
    title: 'Dumb macro',
    type: 'confluence.macro',
    extensionKey: 'dumb',
  });

  const forgeMehhExtension = createFakeExtensionManifest({
    title: 'Mehh extensions',
    type: 'atlassian.forge',
    extensionKey: 'mehh',
  });

  let combinedExtensionProvider: ExtensionProvider;

  beforeEach(() => {
    combinedExtensionProvider = combineExtensionProviders([
      new DefaultExtensionProvider([
        confluenceAwesomeMacro,
        confluenceDumbMacro,
      ]),
      new DefaultExtensionProvider([forgeAmazingExtension, forgeMehhExtension]),
    ]);
  });

  test('should have all the methods from an extension provider', async () => {
    expect(combinedExtensionProvider).toHaveProperty('getExtensions');
    expect(combinedExtensionProvider).toHaveProperty('getExtension');
    expect(combinedExtensionProvider).toHaveProperty('search');
  });

  test('should be able to recover all extensions', async () => {
    expect(await combinedExtensionProvider.getExtensions()).toEqual([
      confluenceAwesomeMacro,
      confluenceDumbMacro,
      forgeAmazingExtension,
      forgeMehhExtension,
    ]);
  });

  test('should be able to get an extension by title and key', async () => {
    expect(
      await combinedExtensionProvider.getExtension(
        'confluence.macro',
        'awesome',
      ),
    ).toBe(confluenceAwesomeMacro);

    expect(
      await combinedExtensionProvider.getExtension('confluence.macro', 'dumb'),
    ).toBe(confluenceDumbMacro);

    expect(
      await combinedExtensionProvider.getExtension(
        'atlassian.forge',
        'amazing',
      ),
    ).toBe(forgeAmazingExtension);

    expect(
      await combinedExtensionProvider.getExtension('atlassian.forge', 'mehh'),
    ).toBe(forgeMehhExtension);
  });

  test('should reject the promise if extension is not found', () => {
    return expect(
      combinedExtensionProvider.getExtension('unknown-type', 'unknown-key'),
    ).rejects.toEqual(
      new Error(
        'Extension with type "unknown-type" and key "unknown-key" not found!',
      ),
    );
  });

  test('should be able to search through the available extensions', async () => {
    expect(await combinedExtensionProvider.search('awes')).toEqual([
      confluenceAwesomeMacro,
    ]);
    expect(await combinedExtensionProvider.search('a')).toEqual([
      confluenceAwesomeMacro,
      confluenceDumbMacro,
      forgeAmazingExtension,
    ]);
    expect(await combinedExtensionProvider.search('amaz')).toEqual([
      forgeAmazingExtension,
    ]);
    expect(await combinedExtensionProvider.search('dum')).toEqual([
      confluenceDumbMacro,
    ]);
    expect(await combinedExtensionProvider.search('me')).toEqual([
      confluenceAwesomeMacro,
      forgeMehhExtension,
    ]);
    expect(await combinedExtensionProvider.search('none')).toEqual([]);
  });

  test('should work even if the provider is a promise', async () => {
    const providers = combineExtensionProviders([
      Promise.resolve(
        new DefaultExtensionProvider([
          confluenceAwesomeMacro,
          confluenceDumbMacro,
        ]),
      ),

      new DefaultExtensionProvider([forgeAmazingExtension, forgeMehhExtension]),
    ]);

    expect(await providers.getExtensions()).toEqual([
      confluenceAwesomeMacro,
      confluenceDumbMacro,
      forgeAmazingExtension,
      forgeMehhExtension,
    ]);

    expect(await providers.getExtension('confluence.macro', 'awesome')).toBe(
      confluenceAwesomeMacro,
    );

    expect(await providers.search('me')).toEqual([
      confluenceAwesomeMacro,
      forgeMehhExtension,
    ]);
  });

  describe('should deal with failures', () => {
    let providers: DefaultExtensionProvider[];

    beforeEach(() => {
      providers = [
        new DefaultExtensionProvider([confluenceAwesomeMacro]),
        new DefaultExtensionProvider([confluenceDumbMacro]),
        new DefaultExtensionProvider([forgeAmazingExtension]),
        new DefaultExtensionProvider([forgeMehhExtension]),
      ];
    });

    test('should discard failed providers and return all valid results', async () => {
      const combinedProviders = combineExtensionProviders([
        Promise.resolve(new DefaultExtensionProvider([confluenceAwesomeMacro])),
        Promise.reject(new DefaultExtensionProvider([confluenceDumbMacro])),
        Promise.resolve(new DefaultExtensionProvider([forgeAmazingExtension])),
        Promise.reject(new DefaultExtensionProvider([forgeMehhExtension])),
      ]);

      expect(await combinedProviders.getExtensions()).toEqual([
        confluenceAwesomeMacro,
        forgeAmazingExtension,
      ]);

      expect(
        await combinedProviders.getExtension('confluence.macro', 'awesome'),
      ).toBe(confluenceAwesomeMacro);

      expect(await combinedProviders.search('me')).toEqual([
        confluenceAwesomeMacro,
      ]);

      expect(await combinedProviders.search('e')).toEqual([
        confluenceAwesomeMacro,
        forgeAmazingExtension,
      ]);
    });

    test('getExtensions should discard failures and return valid results', async () => {
      providers[0].getExtensions = jest.fn().mockRejectedValue('error');
      providers[2].getExtensions = jest.fn().mockRejectedValue('error');

      const combinedProviders = combineExtensionProviders(providers);

      expect(await combinedProviders.getExtensions()).toEqual([
        confluenceDumbMacro,
        forgeMehhExtension,
      ]);
    });

    test('getExtension should fail if no result is found', async () => {
      const combinedProviders = combineExtensionProviders(providers);

      providers[0].getExtension = jest.fn().mockRejectedValue('error');

      return expect(
        combinedProviders.getExtension('confluence.macro', 'awesome'),
      ).rejects.toEqual(
        new Error(
          'Extension with type "confluence.macro" and key "awesome" not found!',
        ),
      );
    });

    test('search should discard failures and return valid results', async () => {
      const combinedProviders = combineExtensionProviders(providers);

      providers[0].search = jest.fn().mockRejectedValue('error');

      expect(await combinedProviders.search('me')).toEqual([
        forgeMehhExtension,
      ]);

      providers[1].search = jest.fn().mockRejectedValue('error');
      providers[3].search = jest.fn().mockRejectedValue('error');

      expect(await combinedProviders.search('e')).toEqual([
        forgeAmazingExtension,
      ]);
    });
  });
});
