import RendererConfiguration from '../../renderer-configuration';

describe('render configuration', () => {
  describe('default values', () => {
    it.each([
      [
        'should create renderer config with default values',
        {},
        {
          locale: 'en',
          disableActions: false,
          disableMediaLinking: false,
          allowAnnotations: false,
          allowHeadingAnchorLinks: false,
          allowCustomPanel: false,
        },
      ],
      [
        'should contain default value if locale is not passed',
        {
          disableActions: false,
          disableMediaLinking: true,
          allowAnnotations: true,
          allowHeadingAnchorLinks: true,
          allowCustomPanel: true,
        },
        {
          locale: 'en',
          disableActions: false,
          disableMediaLinking: true,
          allowAnnotations: true,
          allowHeadingAnchorLinks: true,
          allowCustomPanel: true,
        },
      ],
      [
        'should contain default value if disableActions is not passed',
        {
          locale: 'ps',
          disableMediaLinking: true,
          allowAnnotations: true,
          allowHeadingAnchorLinks: true,
          allowCustomPanel: true,
        },
        {
          locale: 'ps',
          disableActions: false,
          disableMediaLinking: true,
          allowAnnotations: true,
          allowHeadingAnchorLinks: true,
          allowCustomPanel: true,
        },
      ],
      [
        'should contain default value if disableMediaLinking is not passed',
        {
          locale: 'ps',
          disableActions: true,
          allowAnnotations: true,
          allowHeadingAnchorLinks: true,
          allowCustomPanel: true,
        },
        {
          locale: 'ps',
          disableActions: true,
          disableMediaLinking: false,
          allowAnnotations: true,
          allowHeadingAnchorLinks: true,
          allowCustomPanel: true,
        },
      ],
      [
        'should contain default value if allowAnnotations is not passed',
        {
          locale: 'ps',
          disableActions: true,
          disableMediaLinking: true,
          allowHeadingAnchorLinks: true,
          allowCustomPanel: true,
        },
        {
          locale: 'ps',
          disableActions: true,
          disableMediaLinking: true,
          allowAnnotations: false,
          allowHeadingAnchorLinks: true,
          allowCustomPanel: true,
        },
      ],
      [
        'should contain default value if allowHeadingAnchorLinks is not passed',
        {
          locale: 'ps',
          disableActions: true,
          disableMediaLinking: true,
          allowAnnotations: true,
          allowCustomPanel: true,
        },
        {
          locale: 'ps',
          disableActions: true,
          disableMediaLinking: true,
          allowAnnotations: true,
          allowHeadingAnchorLinks: false,
          allowCustomPanel: true,
        },
      ],
      [
        'should contain default value if allowCustomPanel is not passed',
        {
          locale: 'ps',
          disableActions: true,
          disableMediaLinking: true,
          allowAnnotations: true,
          allowHeadingAnchorLinks: true,
        },
        {
          locale: 'ps',
          disableActions: true,
          disableMediaLinking: true,
          allowAnnotations: true,
          allowHeadingAnchorLinks: true,
          allowCustomPanel: false,
        },
      ],
      [
        'should initialise the renderer config with the given valid JSON',
        {
          locale: 'ps',
          disableActions: true,
          disableMediaLinking: true,
          allowAnnotations: true,
          allowHeadingAnchorLinks: true,
          allowCustomPanel: true,
        },
        {
          locale: 'ps',
          disableActions: true,
          disableMediaLinking: true,
          allowAnnotations: true,
          allowHeadingAnchorLinks: true,
          allowCustomPanel: true,
        },
      ],
    ])('%s', (_, rendererConfig, expectedConfig) => {
      const rendererConfiguration = new RendererConfiguration(
        JSON.stringify(rendererConfig),
      );
      expect(rendererConfiguration.getLocale()).toBe(expectedConfig.locale);
      expect(rendererConfiguration.isActionsDisabled()).toBe(
        expectedConfig.disableActions,
      );
      expect(rendererConfiguration.isMedialinkingDisabled()).toBe(
        expectedConfig.disableMediaLinking,
      );
      expect(rendererConfiguration.isAnnotationsAllowed()).toBe(
        expectedConfig.allowAnnotations,
      );
      expect(rendererConfiguration.isHeadingAnchorLinksAllowed()).toBe(
        expectedConfig.allowHeadingAnchorLinks,
      );
      expect(rendererConfiguration.isCustomPanelEnabled()).toBe(
        expectedConfig.allowCustomPanel,
      );
    });
  });

  describe('clone and update', () => {
    it('should create a new refernce of renderer configuration', () => {
      const rendererConfiguration = new RendererConfiguration();

      const newRenderConfiguration = rendererConfiguration.cloneAndUpdate('{}');

      expect(newRenderConfiguration).not.toBe(rendererConfiguration);
      expect(newRenderConfiguration).toBeInstanceOf(RendererConfiguration);
    });
    it('should update the locale value when passed as config', () => {
      const rendererConfig = {
        locale: 'ps',
      };
      const rendererConfiguration = new RendererConfiguration();

      const newRenderConfiguration = rendererConfiguration.cloneAndUpdate(
        JSON.stringify(rendererConfig),
      );

      expect(newRenderConfiguration.getLocale()).toBe('ps');
      expect(newRenderConfiguration.isActionsDisabled()).toBe(
        rendererConfiguration.isActionsDisabled(),
      );
      expect(newRenderConfiguration.isMedialinkingDisabled()).toBe(
        rendererConfiguration.isMedialinkingDisabled(),
      );
      expect(newRenderConfiguration.isAnnotationsAllowed()).toBe(
        rendererConfiguration.isAnnotationsAllowed(),
      );
      expect(newRenderConfiguration.isHeadingAnchorLinksAllowed()).toBe(
        rendererConfiguration.isHeadingAnchorLinksAllowed(),
      );
    });
    it('should update the disableActions value when passed as config', () => {
      const rendererConfig = {
        disableActions: true,
      };
      const rendererConfiguration = new RendererConfiguration();

      const newRenderConfiguration = rendererConfiguration.cloneAndUpdate(
        JSON.stringify(rendererConfig),
      );

      expect(newRenderConfiguration.getLocale()).toBe(
        rendererConfiguration.getLocale(),
      );
      expect(newRenderConfiguration.isActionsDisabled()).toBe(true);
      expect(newRenderConfiguration.isMedialinkingDisabled()).toBe(
        rendererConfiguration.isMedialinkingDisabled(),
      );
      expect(newRenderConfiguration.isAnnotationsAllowed()).toBe(
        rendererConfiguration.isAnnotationsAllowed(),
      );
      expect(newRenderConfiguration.isHeadingAnchorLinksAllowed()).toBe(
        rendererConfiguration.isHeadingAnchorLinksAllowed(),
      );
    });
    it('should update the disableMediaLinking value when passed as config', () => {
      const rendererConfig = {
        disableMediaLinking: true,
      };
      const rendererConfiguration = new RendererConfiguration();

      const newRenderConfiguration = rendererConfiguration.cloneAndUpdate(
        JSON.stringify(rendererConfig),
      );

      expect(newRenderConfiguration.getLocale()).toBe(
        rendererConfiguration.getLocale(),
      );
      expect(newRenderConfiguration.isActionsDisabled()).toBe(
        rendererConfiguration.isActionsDisabled(),
      );
      expect(newRenderConfiguration.isMedialinkingDisabled()).toBe(true);
      expect(newRenderConfiguration.isAnnotationsAllowed()).toBe(
        rendererConfiguration.isAnnotationsAllowed(),
      );
      expect(newRenderConfiguration.isHeadingAnchorLinksAllowed()).toBe(
        rendererConfiguration.isHeadingAnchorLinksAllowed(),
      );
    });
    it('should update the allowAnnotations value when passed as config', () => {
      const rendererConfig = {
        allowAnnotations: true,
      };
      const rendererConfiguration = new RendererConfiguration();

      const newRenderConfiguration = rendererConfiguration.cloneAndUpdate(
        JSON.stringify(rendererConfig),
      );

      expect(newRenderConfiguration.getLocale()).toBe(
        rendererConfiguration.getLocale(),
      );
      expect(newRenderConfiguration.isActionsDisabled()).toBe(
        rendererConfiguration.isActionsDisabled(),
      );
      expect(newRenderConfiguration.isMedialinkingDisabled()).toBe(
        rendererConfiguration.isMedialinkingDisabled(),
      );
      expect(newRenderConfiguration.isAnnotationsAllowed()).toBe(true);
      expect(newRenderConfiguration.isHeadingAnchorLinksAllowed()).toBe(
        rendererConfiguration.isHeadingAnchorLinksAllowed(),
      );
    });
    it('should update the allowHeadingAnchorLinks value when passed as config', () => {
      const rendererConfig = {
        allowHeadingAnchorLinks: true,
      };
      const rendererConfiguration = new RendererConfiguration();

      const newRenderConfiguration = rendererConfiguration.cloneAndUpdate(
        JSON.stringify(rendererConfig),
      );

      expect(newRenderConfiguration.getLocale()).toBe(
        rendererConfiguration.getLocale(),
      );
      expect(newRenderConfiguration.isActionsDisabled()).toBe(
        rendererConfiguration.isActionsDisabled(),
      );
      expect(newRenderConfiguration.isMedialinkingDisabled()).toBe(
        rendererConfiguration.isMedialinkingDisabled(),
      );
      expect(newRenderConfiguration.isAnnotationsAllowed()).toBe(
        rendererConfiguration.isAnnotationsAllowed(),
      );
      expect(newRenderConfiguration.isHeadingAnchorLinksAllowed()).toBe(true);
    });
    it('should update the allowCustomPanel value when passed as config', () => {
      const rendererConfig = {
        allowCustomPanel: true,
      };
      const rendererConfiguration = new RendererConfiguration();

      const newRenderConfiguration = rendererConfiguration.cloneAndUpdate(
        JSON.stringify(rendererConfig),
      );

      expect(newRenderConfiguration.getLocale()).toBe(
        rendererConfiguration.getLocale(),
      );
      expect(newRenderConfiguration.isActionsDisabled()).toBe(
        rendererConfiguration.isActionsDisabled(),
      );
      expect(newRenderConfiguration.isMedialinkingDisabled()).toBe(
        rendererConfiguration.isMedialinkingDisabled(),
      );
      expect(newRenderConfiguration.isAnnotationsAllowed()).toBe(
        rendererConfiguration.isAnnotationsAllowed(),
      );
      expect(newRenderConfiguration.isHeadingAnchorLinksAllowed()).toBe(
        rendererConfiguration.isHeadingAnchorLinksAllowed(),
      );
      expect(newRenderConfiguration.isCustomPanelEnabled()).toBe(true);
    });
    it('should update the config value from true to false when configured explictly', () => {
      const rendererConfiguration = new RendererConfiguration(
        JSON.stringify({ allowHeadingAnchorLinks: true }),
      );
      const newRenderConfiguration = rendererConfiguration.cloneAndUpdate(
        JSON.stringify({ allowHeadingAnchorLinks: false }),
      );

      expect(newRenderConfiguration.isHeadingAnchorLinksAllowed()).toBe(false);
    });
    it('should retain the original value when not configured explicitly', () => {
      const rendererConfiguration = new RendererConfiguration(
        JSON.stringify({
          allowHeadingAnchorLinks: true,
          allowAnnotations: false,
        }),
      );
      const newRenderConfiguration = rendererConfiguration.cloneAndUpdate(
        JSON.stringify({}),
      );

      expect(newRenderConfiguration.isHeadingAnchorLinksAllowed()).toBe(true);
      expect(newRenderConfiguration.isAnnotationsAllowed()).toBe(false);
    });
  });
});
