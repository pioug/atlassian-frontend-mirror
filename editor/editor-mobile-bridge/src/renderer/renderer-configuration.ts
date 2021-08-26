interface RendererConfigurationProviding {
  getLocale(): string;
  isHeadingAnchorLinksAllowed(): boolean;
  isAnnotationsAllowed(): boolean;
  isMedialinkingDisabled(): boolean;
  isActionsDisabled(): boolean;
  isCustomPanelEnabled(): boolean;
}
export default class RendererConfiguration
  implements RendererConfigurationProviding {
  private locale: string;
  private disableActions: boolean;
  private disableMediaLinking: boolean;
  private allowAnnotations: boolean;
  private allowHeadingAnchorLinks: boolean;
  private allowCustomPanel: boolean;

  constructor(rendererConfig?: string) {
    this.locale = 'en';
    this.disableActions = false;
    this.allowAnnotations = false;
    this.allowHeadingAnchorLinks = false;
    this.disableMediaLinking = false;
    this.allowCustomPanel = false;
    if (rendererConfig) {
      this.update(rendererConfig);
    }
  }

  private update(newConfig: string) {
    const newConfigObject = JSON.parse(newConfig);
    this.locale = newConfigObject.locale || this.locale;
    this.disableActions = this.getConfigValueFrom(
      newConfigObject.disableActions,
      this.disableActions,
    );
    this.allowAnnotations = this.getConfigValueFrom(
      newConfigObject.allowAnnotations,
      this.allowAnnotations,
    );
    this.allowHeadingAnchorLinks = this.getConfigValueFrom(
      newConfigObject.allowHeadingAnchorLinks,
      this.allowHeadingAnchorLinks,
    );
    this.disableMediaLinking = this.getConfigValueFrom(
      newConfigObject.disableMediaLinking,
      this.disableMediaLinking,
    );
    this.allowCustomPanel = this.getConfigValueFrom(
      newConfigObject.allowCustomPanel,
      this.allowCustomPanel,
    );
  }

  private getConfigValueFrom(newValue: boolean, oldValue: boolean) {
    if (typeof newValue === 'boolean') {
      return newValue;
    }
    return oldValue;
  }

  getLocale(): string {
    return this.locale;
  }

  isHeadingAnchorLinksAllowed(): boolean {
    return this.allowHeadingAnchorLinks;
  }

  isAnnotationsAllowed(): boolean {
    return this.allowAnnotations;
  }

  isMedialinkingDisabled(): boolean {
    return this.disableMediaLinking;
  }

  isActionsDisabled(): boolean {
    return this.disableActions;
  }

  isCustomPanelEnabled(): boolean {
    return this.allowCustomPanel;
  }

  // We need to retain the previous configuartion flags as `locale` can be configured
  // dynamically any time.
  cloneAndUpdate(newConfig: string): RendererConfiguration {
    const newRendererConfig = JSON.stringify({
      ...this,
      ...JSON.parse(newConfig),
    });
    return new RendererConfiguration(newRendererConfig);
  }
}
