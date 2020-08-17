/**
 * Feature Flags for experimental features/behaviours.
 *
 * This feature flags are not meant to be used as plugin configuration and are only for temporary flags that will eventually be enabled be default or removed.
 * If your plugin requires permanent configuration options it's better to keep them in plugin options.
 *
 * # ADDING NEW FEATURE FLAG
 *
 * – Every feature flag must have a description explaining what it's meant to be doing.
 * – Every feature flag must have an associated ticket and a DUE DATE when this flag will be removed and an owner who will remove it.
 *
 * ## TEMPLATE
 *
 * When adding a new feature flag use the following template:
 *
 * ```
 * DESCRIPTION – what this feature flag is doing
 *
 * [Default: enabled|disabled]
 *
 * [Link to a ticket]
 * ```
 *
 * ## NAMING
 * – Name feature flags without `allow`.
 * – A name should read as "Feature flag to enable ...".
 *
 * Example: name = "newInsertionBehaviour" -> "Feature flag to enable new insertion behaviour."
 */
export type FeatureFlags = {
  /**
   * Feature flag to enable new insertion behaviour,
   * which is following a set of rules defined on this page:
   * https://product-fabric.atlassian.net/wiki/spaces/E/pages/866059806/Cursor+selection+guide+Inserting+new+nodes
   *
   * [PARTIALLY IMPLEMENTED]
   *
   * [Default: disabled]
   */
  newInsertionBehaviour?: boolean;

  /**
   * Feature flag to enable new interactive expand,
   * allows interacting with expand e.g. collapse/expand in the editor.
   *
   * [Default: enabled]
   */
  interactiveExpand?: boolean;

  /**
   * Feature flag to indicate whether a placeholder bracket hint was provided (`string => boolean`)
   *
   * Placeholder text to be displayed when a bracket '{' is typed and the line is empty e.g. 'Did you mean to use '/' to insert content?'
   *
   * This is used to aid migration for TinyMCE power users to the new Fabric editor power user shortcuts.
   *
   * https://product-fabric.atlassian.net/wiki/spaces/E/pages/1000473354/Experiment+Slash+command+discoverability
   *
   * [Default: disabled]
   */
  placeholderBracketHint?: boolean;

  /**
   * Feature flag to indicate whether placeholder hints were provided (`string[] => boolean`)
   *
   * Placeholder text values to display on new empty lines.
   *
   * https://product-fabric.atlassian.net/wiki/spaces/E/pages/1000473354/Experiment+Slash+command+discoverability
   *
   * [Default: disabled]
   */
  placeholderHints?: boolean;

  /**
   * Feature flag to enable additional text colours within the colour palette.
   *
   * https://product-fabric.atlassian.net/wiki/spaces/E/pages/1000309920/Experiment+Additional+colours
   *
   * [Default: disabled]
   */
  moreTextColors?: boolean;
  /**
   * Feature flag to enable find/replace functionality within the editor
   *
   * [Default: disabled]
   * [https://product-fabric.atlassian.net/browse/ED-3504]
   */
  findReplace?: boolean;
  /**
   * Feature flag to enable case matching functionality in find/replace feature within the editor
   *
   * [Default: disabled]
   * [https://product-fabric.atlassian.net/browse/ED-9684]
   */
  findReplaceMatchCase?: boolean;
  /**
   * Feature flag to enable `localId` generation for extensions.
   *
   * https://product-fabric.atlassian.net/wiki/spaces/ADF/pages/1061390901/ADF+Change+48+Add+localId+attribute+to+extension+bodiedExtension+and+inlineExtension+nodes
   *
   * [Default: disabled]
   */
  extensionLocalIdGeneration?: boolean;
  /**
   * Feature flag to enable date picker which has a textbox for internationalised keyboard date
   * input.
   *
   * https://product-fabric.atlassian.net/browse/ED-8928
   *
   * [Default: disabled]
   */
  keyboardAccessibleDatepicker?: boolean;
  /**
   * Feature flag to enable add column custom step
   *
   * https://product-fabric.atlassian.net/browse/ED-8856
   *
   * [Default: disabled]
   */
  addColumnWithCustomStep?: boolean;

  /**
   * Feature flag to enable new list behaviors
   *
   * https://product-fabric.atlassian.net/browse/ED-9438
   *
   * [Default: disabled]
   */
  predictableLists?: boolean;
};

export type FeatureFlagKey = keyof FeatureFlags;
