import { addExcludesFromProviderFactory } from '../../utils';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';

describe('addExcludesFromProviderFactory', () => {
  let providerFactory: ProviderFactory;
  let excludes: Set<string>;

  beforeEach(() => {
    providerFactory = new ProviderFactory();
    excludes = new Set<string>();
  });

  describe.each`
    pluginName            | providerName
    ${'mention'}          | ${'mentionProvider'}
    ${'emoji'}            | ${'emojiProvider'}
    ${'macro'}            | ${'macroProvider'}
    ${'customAutoformat'} | ${'autoformattingProvider'}
  `('$pluginName plugin', ({ pluginName, providerName }) => {
    describe(`with ${providerName}`, () => {
      beforeEach(() => {
        providerFactory.setProvider(providerName, Promise.resolve({}));
      });

      it(`should not add ${pluginName} plugin to excludes`, () => {
        addExcludesFromProviderFactory(providerFactory, excludes);
        expect(excludes).not.toContain(pluginName);
      });
    });

    describe(`without ${providerName}`, () => {
      it(`should add ${pluginName} plugin to excludes`, () => {
        addExcludesFromProviderFactory(providerFactory, excludes);
        expect(excludes).toContain(pluginName);
      });
    });

    describe(`excludes contain ${pluginName} plugin`, () => {
      describe(`with ${providerName} provider`, () => {
        beforeEach(() => {
          providerFactory.setProvider(providerName, Promise.resolve({}));
        });

        it(`should keep ${pluginName} plugin into excludes`, () => {
          addExcludesFromProviderFactory(providerFactory, excludes);
          expect(excludes).not.toContain(pluginName);
        });
      });

      describe(`without ${providerName}`, () => {
        it(`should keep ${pluginName} plugin into excludes`, () => {
          addExcludesFromProviderFactory(providerFactory, excludes);
          expect(excludes).toContain(pluginName);
        });
      });
    });
  });
});
