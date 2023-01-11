export interface LinkingPlatformFeatureFlags {
  showHoverPreview?: boolean;
  useLinkPickerScrollingTabs?: boolean;
  embedModalSize?: string;
  /**
   * Conditionally adds additional container styles to the link picker if the picker is going to appear outside the top boundary of the viewport.
   * This feature will be enabled by default (not enabled by a feature flag) and we will disable the feature using the same feature flag that we will
   * share with a long-term/proper fix in editor-core for their popup positioning.
   * @atlaskit/link-picker-plugins/editor
   */
  disableLinkPickerPopupPositioningFix?: boolean;
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
}
