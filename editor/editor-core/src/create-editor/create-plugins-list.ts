import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { EditorPlugin, EditorProps } from '../types';
import { EditorPluginFeatureProps } from '../types/editor-props';
import type { GetEditorContainerWidth } from '@atlaskit/editor-common/types';

import { BlockTypePluginOptions } from '../plugins/block-type/types';
import type { InsertNodeAPI } from '../insert-api/types';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type { EditorSelectionAPI } from '@atlaskit/editor-common/selection';
import createUniversalPreset from '../labs/next/presets/universal';
import {
  GUTTER_SIZE_MOBILE_IN_PX,
  ScrollGutterPluginOptions,
} from '../plugins/base/pm-plugins/scroll-gutter';
import { DefaultPresetPluginOptions } from '../labs/next/presets/default';
import { EditorPresetProps } from '../labs/next/presets/types';
import { isFullPage as fullPageCheck } from '../utils/is-full-page';
import { createFeatureFlagsFromProps } from './feature-flags-from-props';

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
    // Full Page appearance uses a scrollable div wrapper
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
 * their placement in the editor toolbar
 */
export default function createPluginsList(
  props: EditorProps,
  prevProps?: EditorProps,
  createAnalyticsEvent?: CreateUIAnalyticsEvent,
  insertNodeAPI?: InsertNodeAPI,
  editorAnalyticsAPI?: EditorAnalyticsAPI,
  editorSelectionAPI?: EditorSelectionAPI,
  getEditorContainerWidth?: GetEditorContainerWidth,
): EditorPlugin[] {
  const preset = createUniversalPreset(
    props.appearance,
    getDefaultPresetOptionsFromEditorProps(props, createAnalyticsEvent),
    createFeatureFlagsFromProps(props),
    prevProps?.appearance,
    createAnalyticsEvent,
    insertNodeAPI,
    editorAnalyticsAPI,
    editorSelectionAPI,
    getEditorContainerWidth,
  );

  const excludes = new Set<string>();

  if (!isCodeBlockAllowed({ allowBlockType: props.allowBlockType })) {
    excludes.add('codeBlock');
  }

  return preset.getEditorPlugins(excludes);
}
