import type { EditorProps } from '../types';
import { normalizeFeatureFlags } from '@atlaskit/editor-common/normalize-feature-flags';
import type { FeatureFlags } from '../types/feature-flags';
import type { DisableSpellcheckByBrowser } from '../types/browser';

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

    findReplace: !!props.allowFindReplace,

    findReplaceMatchCase:
      typeof props.allowFindReplace === 'object' &&
      Boolean(props.allowFindReplace.allowMatchCase),

    addColumnWithCustomStep:
      !props.allowTables || typeof props.allowTables === 'boolean'
        ? false
        : Boolean(props.allowTables.allowAddColumnWithCustomStep),

    singleLayout:
      typeof props.allowLayouts === 'object' &&
      !!props.allowLayouts?.UNSAFE_allowSingleColumnLayout,

    undoRedoButtons: props.allowUndoRedoButtons,

    catchAllTracking: props.performanceTracking?.catchAllTracking?.enabled,

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

    useNativeCollabPlugin: Boolean(
      typeof props.collabEdit?.useNativePlugin === 'boolean'
        ? !!props.collabEdit?.useNativePlugin
        : false,
    ),

    showHoverPreview: Boolean(
      typeof props.featureFlags?.showHoverPreview === 'boolean'
        ? !!props.featureFlags?.showHoverPreview
        : false,
    ),

    floatingToolbarLinkSettingsButton:
      typeof props.featureFlags?.['floating-toolbar-link-settings-button'] ===
      'string'
        ? props.featureFlags['floating-toolbar-link-settings-button'] ||
          undefined
        : undefined,

    disableSpellcheckByBrowser: getSpellCheck(props.featureFlags!),

    // Including fallback to props.featureFlags so that mobile feature flags
    // are included (they are not kebab cased)
    restartNumberedLists:
      normalizedFeatureFlags.restartNumberedLists === true ||
      props.featureFlags?.restartNumberedLists === true,

    preventPopupOverflow: Boolean(
      typeof props.featureFlags?.['prevent-popup-overflow'] === 'boolean'
        ? !!props.featureFlags?.['prevent-popup-overflow']
        : false,
    ),
  };
}
