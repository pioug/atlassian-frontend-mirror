export interface LinkingPlatformFeatureFlags {
  showHoverPreview?: boolean;
  useLinkPickerScrollingTabs?: boolean;
  /**
   * Enable an experiment on clickable State element on Hover Preview for Jira issue link.
   * @deprecated Implementation removed on EDM-5153
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
   * @deprecated Implementation removed in EDM-5087
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
   * @deprecated Implementation removed on EDM-5153
   */
  enableResolveMetadataForLinkAnalytics?: boolean;
  /**
   * This flag determines whether smart link should show lozenge action
   * component.
   * The allowed values are: 'not-enrolled', 'control', 'experiment'.
   * See https://team.atlassian.com/project/ATLAS-13099
   * @deprecated Implementation removed in EDM-5795
   */
  useLozengeAction?: string;
  /**
   * This determines whether preview buttons should use the 'primary' appearance and differing text 'open preview'
   * @deprecated Implementation removed on EDM-6745
   */
  enableImprovedPreviewAction?: boolean;

  /**
   * Enables firing of analytics tracking events when data is fetched for Hover Cards
   */
  enableHoverCardResolutionTracking?: boolean;
}
