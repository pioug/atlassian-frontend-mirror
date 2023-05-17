import cardPlugin from '../../index';
import * as main from '../../pm-plugins/main';

describe('cardPlugin', () => {
  describe('pmPlugins', () => {
    it('returns card plugin', () => {
      const editorPlugin = cardPlugin({ platform: 'web' });
      const pmPlugins = editorPlugin.pmPlugins!();

      expect(pmPlugins.length).toEqual(2);
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
        useAlternativePreloader: true,
        platform: 'web' as 'mobile' | 'web',
        fullWidthMode: true,
        createAnalyticsEvent: expect.any(Function),
      };
      const spy = jest.spyOn(main, 'createPlugin');
      const editorPlugin = cardPlugin(options);
      editorPlugin.pmPlugins!();

      expect(spy).toHaveBeenCalledWith(options, undefined);
    });

    it('invokes createPlugin with default plugin options', () => {
      const spy = jest.spyOn(main, 'createPlugin');
      const editorPlugin = cardPlugin({ platform: 'web' });
      editorPlugin.pmPlugins!();

      expect(spy).toHaveBeenCalledWith(
        {
          platform: 'web',
          allowBlockCards: true,
          allowResizing: true,
          allowWrapping: true,
          allowAlignment: true,
          useAlternativePreloader: true,
        },
        undefined,
      );
    });
  });
});
