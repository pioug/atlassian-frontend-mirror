import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
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
        allowBlockCards: false,
        allowEmbeds: true,
        allowResizing: false,
        useAlternativePreloader: true,
        platform: 'web' as 'mobile' | 'web',
        fullWidthMode: true,
        createAnalyticsEvent: expect.any(Function),
      };
      const spy = jest.spyOn(main, 'createPlugin');
      const editorPlugin = cardPlugin(options);
      editorPlugin.pmPlugins!();

      expect(spy).toHaveBeenCalledWith(options);
    });

    it('invokes createPlugin with default plugin options', () => {
      const spy = jest.spyOn(main, 'createPlugin');
      const editorPlugin = cardPlugin({ platform: 'web' });
      editorPlugin.pmPlugins!();

      expect(spy).toHaveBeenCalledWith({
        platform: 'web',
        allowBlockCards: true,
        allowResizing: true,
        useAlternativePreloader: true,
      });
    });

    describe('feature exposure analytics', () => {
      const mockEventDispatcher = jest.fn();

      const flagKey =
        'confluence.frontend.fabric.editor.view-changing-experiment-toolbar-style';

      const featureExposurePayload = (overrides = {}) => ({
        action: 'exposed',
        actionSubject: 'feature',
        attributes: {
          flagKey,
          value: 'noChange',
        },
        eventType: 'operational',
        source: '@atlaskit/feature-flag-client',
        tags: ['measurement'],
        ...overrides,
      });

      const createEditor = (editorProps = {}) =>
        createEditorFactory()({
          createAnalyticsEvent: mockEventDispatcher,
          editorProps: {
            allowAnalyticsGASV3: true,
            ...editorProps,
          },
        });

      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('editor fires feature exposure events if smart-links is enabled', () => {
        createEditor({
          smartLinks: {},
        });

        expect(mockEventDispatcher).toHaveBeenCalledWith(
          featureExposurePayload(),
        );
      });

      it('editor fires feature exposure events with correct feature value', () => {
        const value = 'newDropdown';

        createEditor({
          smartLinks: {},
          featureFlags: {
            'view-changing-experiment-toolbar-style': value,
          },
        });

        expect(mockEventDispatcher).toHaveBeenCalledWith(
          featureExposurePayload({
            attributes: {
              flagKey,
              value,
            },
          }),
        );
      });

      it('does not fire feature exposure events if smart-links is not enabled', () => {
        createEditor({
          smartLinks: undefined,
        });

        expect(mockEventDispatcher).not.toHaveBeenCalledWith(
          expect.objectContaining({
            attributes: expect.objectContaining({
              flagKey,
            }),
          }),
        );
      });
    });
  });
});
