import { EditorProps } from '../../types';
import { normalizeFeatureFlags } from '@atlaskit/editor-common/normalize-feature-flags';
import { FeatureFlags } from './types';

/**
 * Transforms EditorProps to an FeatureFlags object,
 * which is used by both current and archv3 editors.
 */
export function createFeatureFlagsFromProps(props: EditorProps): FeatureFlags {
  return {
    ...normalizeFeatureFlags(props.featureFlags),

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
        : Boolean(props.allowTextColor?.allowMoreTextColors === true),

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

    // Predictable lists are defaulted to enabled unless specifically set to false (opt out)
    predictableLists: props.UNSAFE_predictableLists !== false,

    undoRedoButtons: props.UNSAFE_allowUndoRedoButtons,

    catchAllTracking: props.performanceTracking?.catchAllTracking?.enabled,

    nextEmojiNodeView: props.featureFlags?.nextEmojiNodeView === true,

    stickyHeadersOptimization:
      typeof props.featureFlags?.stickyHeadersOptimization === 'boolean'
        ? !!props.featureFlags?.stickyHeadersOptimization
        : typeof props.allowTables === 'object' &&
          !!props.allowTables?.stickyHeadersOptimization,

    initialRenderOptimization:
      typeof props.featureFlags?.initialRenderOptimization === 'boolean'
        ? !!props.featureFlags?.initialRenderOptimization
        : typeof props.allowTables === 'object' &&
          !!props.allowTables?.initialRenderOptimization,

    mouseMoveOptimization:
      typeof props.featureFlags?.mouseMoveOptimization === 'boolean'
        ? !!props.featureFlags?.mouseMoveOptimization
        : typeof props.allowTables === 'object' &&
          !!props.allowTables?.mouseMoveOptimization,

    tableRenderOptimization:
      typeof props.featureFlags?.tableRenderOptimization === 'boolean'
        ? !!props.featureFlags?.tableRenderOptimization
        : typeof props.allowTables === 'object' &&
          !!props.allowTables?.tableRenderOptimization,

    extendFloatingToolbar: Boolean(
      typeof props.allowExtension === 'object' &&
        props.allowExtension?.allowExtendFloatingToolbars,
    ),

    displayInlineBlockForInlineNodes: Boolean(
      typeof props.featureFlags?.displayInlineBlockForInlineNodes === 'boolean'
        ? !!props.featureFlags?.displayInlineBlockForInlineNodes
        : true,
    ),
  };
}
