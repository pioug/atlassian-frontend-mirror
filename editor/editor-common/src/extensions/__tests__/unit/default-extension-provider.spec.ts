import {
  createFakeAutoConvertModule,
  createFakeExtensionManifest,
} from '@atlaskit/editor-test-helpers/extensions';

import { createAutoConverterRunner } from '../../../extensions/module-helpers';
import DefaultExtensionProvider from '../../default-extension-provider';

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

  test('should work when no auto aconvert handlers are passed', async () => {
    const autoConvertHandlers = await extensionProvider.getAutoConverter();
    const runner = createAutoConverterRunner(autoConvertHandlers);

    expect(runner('anything')).toStrictEqual(undefined);
  });

  test('should be able to get the auto convert handlers', async () => {
    const confluenceAwesomeMacroWithAutoConvert = createFakeAutoConvertModule(
      confluenceAwesomeMacro,
      'url',
      ['foo', 'bar'],
    );

    const confluenceAmazingMacroWithAutoConvert = createFakeAutoConvertModule(
      confluenceAmazingMacro,
      'url',
      ['baz'],
    );

    const extensionProviderWithAutoConvert = new DefaultExtensionProvider([
      confluenceAwesomeMacroWithAutoConvert,
      confluenceAmazingMacroWithAutoConvert,
    ]);

    const autoConvertHandlers = await extensionProviderWithAutoConvert.getAutoConverter();

    const runner = createAutoConverterRunner(autoConvertHandlers);

    [
      'http://awesome-foo/test',
      'http://awesome-bar/bear',
      'http://amazing-baz/app',
    ].forEach((url) => {
      const result = runner(url);
      expect(result).toBeDefined();
      expect(result).toMatchObject({
        type: 'extension',
        attrs: {
          parameters: {
            url,
          },
        },
      });
    });

    expect(runner('unknown')).toStrictEqual(undefined);
  });

  test('should be able to pass a pre defined auto convert handler to the provider, this can be used for performance reasons or to support legacy converters', async () => {
    const extensionProviderWithCustomAutoConvertHandler = new DefaultExtensionProvider(
      [confluenceAwesomeMacro, confluenceAmazingMacro],
      [
        (url: string) => {
          if (url.startsWith('http://jira-legacy-macro/jira-roadmap')) {
            return {
              type: 'extension',
              attrs: {
                extensionType: 'confluence.macro',
                extensionKey: 'jira-roadmap',
                text: 'Jira Roadmap',
                parameters: {
                  url,
                },
              },
            };
          }
        },
        (url: string) => {
          if (url.startsWith('http://jira-legacy-macro/jira-issue')) {
            return {
              type: 'extension',
              attrs: {
                extensionType: 'confluence.macro',
                extensionKey: 'jira-issue',
                text: 'Jira Roadmap',
                parameters: {
                  url,
                },
              },
            };
          }
        },
      ],
    );
    const autoConvertHandlers = await extensionProviderWithCustomAutoConvertHandler.getAutoConverter();

    const runner = createAutoConverterRunner(autoConvertHandlers);

    [
      'http://jira-legacy-macro/jira-roadmap/1234',
      'http://jira-legacy-macro/jira-issue/1234',
    ].forEach((url) => {
      const result = runner(url);
      expect(result).toBeDefined();
      expect(result).toMatchObject({
        type: 'extension',
        attrs: {
          parameters: {
            url,
          },
        },
      });
    });

    expect(
      runner('http://jira-legacy-macro/jira-service-desk'),
    ).not.toBeDefined();
  });
});
