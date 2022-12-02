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
   * Decide whether to render a Flexible UI Card view instead of the older Block Card view when rendering Block Card Smart Links.
   */
  enableFlexibleBlockCard?: boolean;
}
