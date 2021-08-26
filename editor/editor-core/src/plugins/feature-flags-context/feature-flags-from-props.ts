import { EditorProps } from '../../types';
import { normalizeFeatureFlags } from '@atlaskit/editor-common/normalize-feature-flags';
import type { FeatureFlags } from '../../types/feature-flags';

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

    keyboardAccessibleDatepicker:
      typeof props.allowKeyboardAccessibleDatepicker === 'boolean'
        ? props.allowKeyboardAccessibleDatepicker
        : false,

    addColumnWithCustomStep:
      !props.allowTables || typeof props.allowTables === 'boolean'
        ? false
        : Boolean(props.allowTables.allowAddColumnWithCustomStep),

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

    tableOverflowShadowsOptimization:
      typeof props.featureFlags?.tableOverflowShadowsOptimization === 'boolean'
        ? !!props.featureFlags?.tableOverflowShadowsOptimization
        : typeof props.allowTables === 'object' &&
          !!props.allowTables?.tableOverflowShadowsOptimization,

    extendFloatingToolbar: Boolean(
      typeof props.allowExtension === 'object' &&
        props.allowExtension?.allowExtendFloatingToolbars,
    ),

    displayInlineBlockForInlineNodes: Boolean(
      typeof props.featureFlags?.displayInlineBlockForInlineNodes === 'boolean'
        ? !!props.featureFlags?.displayInlineBlockForInlineNodes
        : false,
    ),

    useUnpredictableInputRule: Boolean(
      typeof props.featureFlags?.useUnpredictableInputRule === 'boolean'
        ? !!props.featureFlags?.useUnpredictableInputRule
        : props.UNSAFE_allowUndoRedoButtons
        ? false
        : true,
    ),

    showAvatarGroupAsPlugin: Boolean(
      typeof props.featureFlags?.showAvatarGroupAsPlugin === 'boolean'
        ? !!props.featureFlags?.showAvatarGroupAsPlugin
        : false,
    ),
    errorBoundaryDocStructure: Boolean(
      typeof props.featureFlags?.useErrorBoundaryDocStructure === 'boolean'
        ? !!props.featureFlags?.useErrorBoundaryDocStructure
        : false,
    ),
    synchronyErrorDocStructure: Boolean(
      typeof props.featureFlags?.synchronyErrorDocStructure === 'boolean'
        ? !!props.featureFlags?.synchronyErrorDocStructure
        : false,
    ),
    enableViewUpdateSubscription: Boolean(
      typeof props.featureFlags?.enableViewUpdateSubscription === 'boolean'
        ? !!props.featureFlags?.enableViewUpdateSubscription
        : false,
    ),
    collabAvatarScroll: Boolean(
      typeof props.featureFlags?.collabAvatarScroll === 'boolean'
        ? !!props.featureFlags?.collabAvatarScroll
        : false,
    ),
  };
}
