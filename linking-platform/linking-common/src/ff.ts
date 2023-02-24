export interface LinkingPlatformFeatureFlags {
  showHoverPreview?: boolean;
  trackIframeDwellEvents?: boolean;
  useLinkPickerScrollingTabs?: boolean;
  /**
   * Enable an experiment on clickable State element on Hover Preview for Jira issue link.
   */
  enableActionableElement?: boolean;
  /**
   * Decide whether to render a Flexible UI Card view instead of the older Block Card view when rendering Block Card Smart Links.
   */
  enableFlexibleBlockCard?: boolean;
  /**
   * This flag determines if an authentication tooltip should appear over an unauthorised smart link when a user
   * hovers over it.
   * The allowed values are: 'control', 'experiment', 'off'
   */
  showAuthTooltip?: string;
  /**
   * Enables alternative tabs for Atlassian tabs in products
   */
  useLinkPickerAtlassianTabs?: boolean;
  /**
   * Enable forge providers tabs in products
   */
  enableLinkPickerForgeTabs?: boolean;
  /**
   * Enables resolved metadata to be surfaced for link analytics
   */
  enableResolveMetadataForLinkAnalytics?: boolean;
}
