import { cardPlugin } from '../../plugin';
import * as main from '../../pm-plugins/main';

describe('cardPlugin', () => {
  describe('pmPlugins', () => {
    it('returns card plugin', () => {
      const editorPlugin = cardPlugin({ config: { platform: 'web' } });
      const pmPlugins = editorPlugin.pmPlugins!();

      expect(pmPlugins.length).toEqual(3);
      expect(pmPlugins).toEqual(
        expect.arrayContaining([
          { name: 'card', plugin: expect.any(Function) },
        ]),
      );
    });

    it('invokes createPlugin with plugin options', () => {
      const options = {
        provider: expect.any(Function),
        resolveBeforeMacros: ['jira'],
        allowAlignment: true,
        allowBlockCards: false,
        allowEmbeds: true,
        allowResizing: false,
        allowWrapping: true,
        allowDatasource: true,
        useAlternativePreloader: true,
        platform: 'web' as 'mobile' | 'web',
        fullWidthMode: true,
        createAnalyticsEvent: expect.any(Function),
        showUpgradeDiscoverability: true,
      };
      const spy = jest.spyOn(main, 'createPlugin');
      const editorPlugin = cardPlugin({ config: options });
      editorPlugin.pmPlugins!();

      expect(spy).toHaveBeenCalledWith(
        { ...options, cardPluginEvents: expect.any(Object) },
        undefined,
      );
    });

    it('invokes createPlugin with default plugin options', () => {
      const spy = jest.spyOn(main, 'createPlugin');
      const editorPlugin = cardPlugin({ config: { platform: 'web' } });
      editorPlugin.pmPlugins!();

      expect(spy).toHaveBeenCalledWith(
        {
          platform: 'web',
          allowBlockCards: true,
          allowResizing: true,
          allowDatasource: false,
          allowWrapping: true,
          allowAlignment: true,
          useAlternativePreloader: true,
          cardPluginEvents: expect.any(Object),
          showUpgradeDiscoverability: true,
        },
        undefined,
      );
    });
  });
});
