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
 * @description
 * What this feature flag is doing. Do not lead with "Feature flag to".
 *
 * @see https://product-fabric.atlassian.net/browse/ED-1
 * @default false
 * ```
 *
 * ## NAMING
 * – Name feature flags without `allow`.
 * – A name should read as "Feature flag to enable ...".
 *
 * Example: name = "newInsertionBehaviour" -> "Enable new insertion behaviour"
 */
export type FeatureFlags = {
  /**
   * @description Enable new insertion behaviour
   *
   * @see https://product-fabric.atlassian.net/l/c/JYoSEu00
   * @default false
   */
  newInsertionBehaviour?: boolean;

  /**
   * @description Allows to toggle expand open state
   * @default true
   */
  interactiveExpand?: boolean;

  /**
   * @description
   * Whether a placeholder bracket hint was provided (`string => boolean`)
   * Placeholder text to be displayed when a bracket '{' is typed and the line is empty e.g. 'Did you mean to use '/' to insert content?'
   * This is used to aid migration for TinyMCE power users to the new Fabric editor power user shortcuts.
   *
   * @see https://product-fabric.atlassian.net/l/c/4JLjusAP
   * @default true
   */
  placeholderBracketHint?: boolean;

  /**
   * @description
   * Whether placeholder hints were provided (`string[] => boolean`)
   * Placeholder text values to display on new empty lines.
   *
   * @see https://product-fabric.atlassian.net/l/c/GG1Yv9cK
   * @default false
   */
  placeholderHints?: boolean;

  /**
   * @description
   * Enable additional text colours within the colour palette.
   *
   * @see https://product-fabric.atlassian.net/l/c/YhyvfWqg
   * @default false
   */
  moreTextColors?: boolean;

  /**
   * @description
   * Enable find/replace functionality within the editor
   *
   * @see https://product-fabric.atlassian.net/browse/ED-3504
   * @default false
   */
  findReplace?: boolean;

  /**
   * @description
   * Enable case matching functionality in find/replace feature within the editor
   *
   * @see https://product-fabric.atlassian.net/browse/ED-9684
   * @default false
   */
  findReplaceMatchCase?: boolean;

  /**
   * @description
   * Enable `localId` generation for extensions.
   *
   * @see https://product-fabric.atlassian.net/l/c/2m0i9jLX
   * @default false
   */
  extensionLocalIdGeneration?: boolean;

  /**
   * @description
   * Enable date picker which has a textbox for internationalised keyboard date
   * input.
   *
   * @see https://product-fabric.atlassian.net/browse/ED-8928
   * @default false
   */
  keyboardAccessibleDatepicker?: boolean;
  /**
   * @description
   * Enable add column custom step
   *
   * @see https://product-fabric.atlassian.net/browse/ED-8856
   * @default false
   */
  addColumnWithCustomStep?: boolean;

  /**
   * @description
   * Enable new list behaviors
   *
   * @see https://product-fabric.atlassian.net/browse/ED-9438
   * @default false
   */
  predictableLists?: boolean;

  /**
   * @description
   * Enable undo/redo buttons and functionality within the editor
   *
   * @see https://product-fabric.atlassian.net/browse/ED-9537
   * @default false
   */
  undoRedoButtons?: boolean;

  /**
   * @description
   * Measure render performance for all tracked analytics events
   *
   * @default false
   */
  catchAllTracking?: boolean;

  /**
   * @description
   * Switch to a performance optimised NodeView for Emoji
   *
   * @see https://product-fabric.atlassian.net/browse/ED-10585
   * @default false
   */
  nextEmojiNodeView?: boolean;
};

export type FeatureFlagKey = keyof FeatureFlags;
