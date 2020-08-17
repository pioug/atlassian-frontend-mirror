import { EditorProps } from '../../types';
import { FeatureFlags, FeatureFlagKey } from './types';

/**
 * Transforms EditorProps to an FeatureFlags object,
 * which is used by both current and archv3 editors.
 */
export function createFeatureFlagsFromProps(props: EditorProps): FeatureFlags {
  return {
    newInsertionBehaviour: props.allowNewInsertionBehaviour,

    interactiveExpand:
      typeof props.allowExpand === 'boolean'
        ? props.allowExpand
        : Boolean(
            props.allowExpand &&
              props.allowExpand.allowInteractiveExpand !== false,
          ),

    placeholderBracketHint: !!props.placeholderBracketHint,
    placeholderHints:
      Array.isArray(props.placeholderHints) &&
      props.placeholderHints.length > 0,

    moreTextColors:
      typeof props.allowTextColor === 'boolean'
        ? false
        : Boolean(
            props.allowTextColor &&
              props.allowTextColor.EXPERIMENTAL_allowMoreTextColors === true,
          ),

    findReplace: !!props.allowFindReplace,

    findReplaceMatchCase:
      typeof props.allowFindReplace === 'object' &&
      Boolean(props.allowFindReplace.allowMatchCase),

    extensionLocalIdGeneration:
      typeof props.allowExtension === 'boolean'
        ? false
        : !!(
            props.allowExtension && props.allowExtension.allowLocalIdGeneration
          ),

    keyboardAccessibleDatepicker:
      typeof props.allowKeyboardAccessibleDatepicker === 'boolean'
        ? props.allowKeyboardAccessibleDatepicker
        : false,

    addColumnWithCustomStep:
      !props.allowTables || typeof props.allowTables === 'boolean'
        ? false
        : Boolean(props.allowTables.allowAddColumnWithCustomStep),

    predictableLists: props.UNSAFE_predictableLists,
  };
}

/**
 * Transforms FeatureFlags to a type safe string array of the enabled feature flags.
 *
 * Useful for analytics and analysis purposes.
 */
export function getEnabledFeatureFlagKeys(featureFlags: FeatureFlags) {
  return (Object.keys(featureFlags) as FeatureFlagKey[]).filter(
    key => featureFlags[key] === true,
  );
}
