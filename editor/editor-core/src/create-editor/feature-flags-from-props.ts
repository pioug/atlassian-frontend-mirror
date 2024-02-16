import { normalizeFeatureFlags } from '@atlaskit/editor-common/normalize-feature-flags';

import type { DisableSpellcheckByBrowser } from '../types/browser';
import type { EditorNextProps } from '../types/editor-props';
import type { FeatureFlags } from '../types/feature-flags';

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
export function createFeatureFlagsFromProps(
  props: Omit<EditorNextProps, 'preset'>,
): FeatureFlags {
  const normalizedFeatureFlags = normalizeFeatureFlags(props.featureFlags);

  return {
    ...normalizedFeatureFlags,

    placeholderBracketHint: !!props.placeholderBracketHint,

    catchAllTracking: props.performanceTracking?.catchAllTracking?.enabled,

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

    disableSpellcheckByBrowser: getSpellCheck(props.featureFlags!),
  };
}
