import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import type { EditorPlugin, EditorProps } from '../types';
import type { EditorPluginFeatureProps } from '../types/editor-props';

import type { BlockTypePluginOptions } from '@atlaskit/editor-plugin-block-type';
import type { ScrollGutterPluginOptions } from '@atlaskit/editor-plugin-base';
import { GUTTER_SIZE_MOBILE_IN_PX } from '@atlaskit/editor-common/utils';
import type { DefaultPresetPluginOptions } from '../presets/default';
import type { EditorPresetProps } from '../presets/types';
import { isFullPage as fullPageCheck } from '../utils/is-full-page';
import { createFeatureFlagsFromProps } from './feature-flags-from-props';
import type {
  EditorPresetBuilder,
  EditorPluginInjectionAPI,
} from '@atlaskit/editor-common/preset';

const isCodeBlockAllowed = (
  options?: Pick<BlockTypePluginOptions, 'allowBlockType'>,
) => {
  const exclude =
    options && options.allowBlockType && options.allowBlockType.exclude
      ? options.allowBlockType.exclude
      : [];

  return exclude.indexOf('codeBlock') === -1;
};

export function getScrollGutterOptions(
  props: EditorProps,
): ScrollGutterPluginOptions | undefined {
  const { appearance, persistScrollGutter } = props;

  if (fullPageCheck(appearance)) {
    // Full Page appearance uses a scrollable div wrapper.
    return {
      getScrollElement: () =>
        document.querySelector('.fabric-editor-popup-scroll-parent'),
    };
  }
  if (appearance === 'mobile') {
    // Mobile appearance uses body scrolling for improved performance on low powered devices.
    return {
      getScrollElement: () => document.body,
      allowCustomScrollHandler: false,
      persistScrollGutter,
      gutterSize: GUTTER_SIZE_MOBILE_IN_PX,
    };
  }
  return undefined;
}

export function getDefaultPresetOptionsFromEditorProps(
  props: EditorProps,
  createAnalyticsEvent?: CreateUIAnalyticsEvent,
): EditorPresetProps & DefaultPresetPluginOptions & EditorPluginFeatureProps {
  const appearance = props.appearance;
  const isMobile = appearance === 'mobile';

  const inputTracking = props.performanceTracking?.inputTracking;
  const cardOptions =
    props.linking?.smartLinks || props.smartLinks || props.UNSAFE_cards;

  return {
    ...props,
    createAnalyticsEvent,
    typeAhead: {
      createAnalyticsEvent,
      isMobile,
    },
    featureFlags: createFeatureFlagsFromProps(props),
    paste: {
      cardOptions,
      sanitizePrivateContent: props.sanitizePrivateContent,
    },
    base: {
      allowInlineCursorTarget: !isMobile,
      allowScrollGutter: getScrollGutterOptions(props),
      inputTracking,
      browserFreezeTracking: props.performanceTracking?.bFreezeTracking,
      ufo: createFeatureFlagsFromProps(props).ufo,
    },
    blockType: {
      lastNodeMustBeParagraph:
        appearance === 'comment' || appearance === 'chromeless',
      allowBlockType: props.allowBlockType,
      isUndoRedoButtonsEnabled: props.allowUndoRedoButtons,
    },
    placeholder: {
      placeholder: props.placeholder,
      placeholderBracketHint: props.placeholderBracketHint,
    },
    textFormatting: {
      ...(props.textFormatting || {}),
      responsiveToolbarMenu:
        props.textFormatting?.responsiveToolbarMenu != null
          ? props.textFormatting.responsiveToolbarMenu
          : props.allowUndoRedoButtons,
    },
    annotationProviders: props.annotationProviders,
    submitEditor: props.onSave,
    quickInsert: {
      enableElementBrowser:
        props.elementBrowser && props.elementBrowser.showModal,
      elementBrowserHelpUrl:
        props.elementBrowser && props.elementBrowser.helpUrl,
      disableDefaultItems: isMobile,
      headless: isMobile,
      emptyStateHandler:
        props.elementBrowser && props.elementBrowser.emptyStateHandler,
    },
    selection: { useLongPressSelection: false },
    cardOptions,
    hyperlinkOptions: {
      editorAppearance: props.appearance,
      linkPicker: props.linking?.linkPicker,
      cardOptions,
      platform: isMobile ? 'mobile' : 'web',
    },
    codeBlock: {
      ...props.codeBlock,
      useLongPressSelection: false,
      appearance: props.appearance,
      allowCompositionInputOverride: isMobile,
    },
  };
}

/**
 * Maps EditorProps to EditorPlugins
 *
 * Note: The order that presets are added determines
 * their placement in the editor toolbar.
 */
export default function createPluginsList(
  preset: EditorPresetBuilder<any, any>,
  props: EditorProps,
  pluginInjectionAPI?: EditorPluginInjectionAPI,
): EditorPlugin[] {
  const excludes = new Set<string>();

  if (!isCodeBlockAllowed({ allowBlockType: props.allowBlockType })) {
    excludes.add('codeBlock');
  }
  return preset.build({ pluginInjectionAPI, excludePlugins: excludes });
}
