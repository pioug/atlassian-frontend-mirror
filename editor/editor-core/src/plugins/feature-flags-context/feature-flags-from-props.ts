import { EditorProps } from '../../types';
import { normalizeFeatureFlags } from '@atlaskit/editor-common/normalize-feature-flags';
import type { FeatureFlags } from '../../types/feature-flags';
import { DisableSpellcheckByBrowser } from '../../types/browser';

function verifyJSON(json: string) {
  try {
    return JSON.parse(json);
  } catch (e) {
    return undefined;
  }
}

function getSpellCheck(featureFlags: {
  [featureFlag: string]: string | boolean;
}): DisableSpellcheckByBrowser | undefined {
  if (!!featureFlags?.['disableSpellcheckByBrowser']) {
    return typeof featureFlags?.['disableSpellcheckByBrowser'] === 'object'
      ? featureFlags?.['disableSpellcheckByBrowser']
      : typeof featureFlags?.['disableSpellcheckByBrowser'] === 'string'
      ? verifyJSON(featureFlags?.['disableSpellcheckByBrowser'])
      : undefined;
  }
  if (!!featureFlags?.['disable-spellcheck-by-browser']) {
    return typeof featureFlags?.['disable-spellcheck-by-browser'] === 'object'
      ? featureFlags?.['disable-spellcheck-by-browser']
      : typeof featureFlags?.['disable-spellcheck-by-browser'] === 'string'
      ? verifyJSON(featureFlags?.['disable-spellcheck-by-browser'])
      : undefined;
  }
  return undefined;
}

/**
 * Transforms EditorProps to an FeatureFlags object,
 * which is used by both current and archv3 editors.
 */
export function createFeatureFlagsFromProps(props: EditorProps): FeatureFlags {
  const normalizedFeatureFlags = normalizeFeatureFlags(props.featureFlags);

  const tableCellOptionsInFloatingToolbar =
    normalizedFeatureFlags.tableCellOptionsInFloatingToolbar ||
    props.featureFlags?.tableCellOptionsInFloatingToolbar ||
    undefined;

  return {
    ...normalizedFeatureFlags,

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

    singleLayout:
      typeof props.allowLayouts === 'object' &&
      !!props.allowLayouts?.UNSAFE_allowSingleColumnLayout,

    undoRedoButtons: props.allowUndoRedoButtons,

    catchAllTracking: props.performanceTracking?.catchAllTracking?.enabled,

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
          typeof props.allowTables?.tableRenderOptimization === 'boolean'
        ? props.allowTables?.tableRenderOptimization
        : true,

    tableOverflowShadowsOptimization:
      typeof props.featureFlags?.tableOverflowShadowsOptimization === 'boolean'
        ? !!props.featureFlags?.tableOverflowShadowsOptimization
        : typeof props.allowTables === 'object' &&
          !!props.allowTables?.tableOverflowShadowsOptimization,

    extendFloatingToolbar: Boolean(
      typeof props.allowExtension === 'object' &&
        props.allowExtension?.allowExtendFloatingToolbars,
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

    plainTextPasteLinkification: Boolean(
      typeof props.featureFlags?.plainTextPasteLinkification === 'boolean'
        ? !!props.featureFlags?.plainTextPasteLinkification
        : false,
    ),

    collabAvatarScroll: Boolean(
      typeof props.featureFlags?.collabAvatarScroll === 'boolean'
        ? !!props.featureFlags?.collabAvatarScroll
        : false,
    ),
    ufo: Boolean(
      typeof props.featureFlags?.ufo === 'boolean'
        ? !!props.featureFlags?.ufo
        : false,
    ),
    twoLineEditorToolbar: Boolean(
      typeof props.featureFlags?.twoLineEditorToolbar === 'boolean'
        ? !!props.featureFlags?.twoLineEditorToolbar
        : false,
    ),

    saferDispatchedTransactions: Boolean(
      (typeof normalizedFeatureFlags.saferDispatchedTransactions ===
        'boolean' &&
        !!normalizedFeatureFlags.saferDispatchedTransactions) ||
        (typeof props.featureFlags?.saferDispatchedTransactions === 'boolean'
          ? !!props.featureFlags?.saferDispatchedTransactions
          : false),
    ),

    useNativeCollabPlugin: Boolean(
      typeof props.collabEdit?.useNativePlugin === 'boolean'
        ? !!props.collabEdit?.useNativePlugin
        : false,
    ),
    chromeCursorHandlerFixedVersion:
      typeof props.featureFlags?.chromeCursorHandlerFixedVersion === 'string'
        ? Number(props.featureFlags.chromeCursorHandlerFixedVersion) ||
          undefined
        : undefined,

    viewChangingExperimentToolbarStyle:
      typeof props.featureFlags?.['view-changing-experiment-toolbar-style'] ===
      'string'
        ? props.featureFlags['view-changing-experiment-toolbar-style'] ||
          undefined
        : undefined,

    tableCellOptionsInFloatingToolbar:
      typeof tableCellOptionsInFloatingToolbar === 'boolean'
        ? tableCellOptionsInFloatingToolbar
        : false,

    showHoverPreview: Boolean(
      typeof props.featureFlags?.showHoverPreview === 'boolean'
        ? !!props.featureFlags?.showHoverPreview
        : false,
    ),

    indentationButtonsInTheToolbar: Boolean(
      (typeof normalizedFeatureFlags.indentationButtonsInTheToolbar ===
        'boolean' &&
        !!normalizedFeatureFlags.indentationButtonsInTheToolbar) ||
        (typeof props.featureFlags?.indentationButtonsInTheToolbar === 'boolean'
          ? !!props.featureFlags?.indentationButtonsInTheToolbar
          : false),
    ),

    floatingToolbarCopyButton: Boolean(
      (typeof normalizedFeatureFlags.floatingToolbarCopyButton === 'boolean' &&
        !!normalizedFeatureFlags.floatingToolbarCopyButton) ||
        (typeof props.featureFlags?.floatingToolbarCopyButton === 'boolean'
          ? !!props.featureFlags?.floatingToolbarCopyButton
          : false),
    ),

    floatingToolbarLinkSettingsButton:
      typeof props.featureFlags?.['floating-toolbar-link-settings-button'] ===
      'string'
        ? props.featureFlags['floating-toolbar-link-settings-button'] ||
          undefined
        : undefined,

    disableSpellcheckByBrowser: getSpellCheck(props.featureFlags!),
  };
}
