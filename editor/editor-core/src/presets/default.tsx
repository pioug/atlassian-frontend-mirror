// #region Imports
import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import type { PastePluginOptions } from '../plugins/paste';
import pastePlugin from '../plugins/paste';
import { blockTypePlugin } from '@atlaskit/editor-plugin-block-type';
import clearMarksOnChangeToEmptyDocumentPlugin from '../plugins/clear-marks-on-change-to-empty-document';
import { hyperlinkPlugin } from '@atlaskit/editor-plugin-hyperlink';
import { textFormattingPlugin } from '@atlaskit/editor-plugin-text-formatting';
import { betterTypeHistoryPlugin } from '@atlaskit/editor-plugin-better-type-history';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import { unsupportedContentPlugin } from '@atlaskit/editor-plugin-unsupported-content';
import type { BasePluginOptions } from '@atlaskit/editor-plugin-base';
import { basePlugin } from '@atlaskit/editor-plugin-base';
import { focusPlugin } from '@atlaskit/editor-plugin-focus';
import { editorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';
import { typeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';
import { submitEditorPlugin } from '@atlaskit/editor-plugin-submit-editor';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import { copyButtonPlugin } from '@atlaskit/editor-plugin-copy-button';
import { floatingToolbarPlugin } from '@atlaskit/editor-plugin-floating-toolbar';
import type { EditorProps } from '../types/editor-props';
import type { EditorPresetProps } from './types';
import { clipboardPlugin } from '@atlaskit/editor-plugin-clipboard';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { BlockTypePluginOptions } from '@atlaskit/editor-plugin-block-type';
import type { PlaceholderPluginOptions } from '@atlaskit/editor-plugin-placeholder';
import { placeholderPlugin } from '@atlaskit/editor-plugin-placeholder';
import type { AnnotationProviders } from '../plugins/annotation';
import annotationPlugin from '../plugins/annotation';
import { compositionPlugin } from '@atlaskit/editor-plugin-composition';
import type {
  TextFormattingOptions,
  HyperlinkPluginOptions,
  QuickInsertPluginOptions,
} from '@atlaskit/editor-common/types';
import { quickInsertPlugin } from '@atlaskit/editor-plugin-quick-insert';
import { selectionPlugin } from '@atlaskit/editor-plugin-selection';
import { codeBlockPlugin } from '@atlaskit/editor-plugin-code-block';
import type { CodeBlockOptions } from '@atlaskit/editor-plugin-code-block';
import type { SelectionPluginOptions } from '@atlaskit/editor-common/selection';
import type { CardOptions } from '@atlaskit/editor-common/card';
import undoRedoPlugin from '../plugins/undo-redo';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import type { TypeAheadPluginOptions } from '@atlaskit/editor-plugin-type-ahead';
import { EditorPresetBuilder } from '@atlaskit/editor-common/preset';
import { selectionToolbarPlugin } from '@atlaskit/editor-plugin-selection-toolbar';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
// #endregion

export type DefaultPresetPluginOptions = {
  paste: PastePluginOptions;
  base?: BasePluginOptions;
  blockType?: BlockTypePluginOptions;
  placeholder?: PlaceholderPluginOptions;
  textFormatting?: TextFormattingOptions;
  submitEditor?: EditorProps['onSave'];
  annotationProviders?: AnnotationProviders;
  quickInsert?: QuickInsertPluginOptions;
  codeBlock?: CodeBlockOptions;
  selection?: SelectionPluginOptions;
  cardOptions?: CardOptions;
  hyperlinkOptions?: HyperlinkPluginOptions;
  createAnalyticsEvent?: CreateUIAnalyticsEvent;
  typeAhead?: TypeAheadPluginOptions;
  allowAnalyticsGASV3?: boolean;
  performanceTracking?: EditorProps['performanceTracking'];
};

/**
 * Note: The order that presets are added determines
 * their placement in the editor toolbar
 */
export function createDefaultPreset(
  options: EditorPresetProps & DefaultPresetPluginOptions,
) {
  const preset = new EditorPresetBuilder()
    .add([featureFlagsPlugin, options.featureFlags || {}])
    .maybeAdd(analyticsPlugin, (plugin, builder) => {
      if (options.allowAnalyticsGASV3) {
        const { performanceTracking, createAnalyticsEvent } = options;

        return builder.add([
          plugin,
          {
            createAnalyticsEvent,
            performanceTracking,
          },
        ]);
      }

      return builder;
    })
    .add(betterTypeHistoryPlugin)
    .add([pastePlugin, options.paste])
    .add(clipboardPlugin)
    .add(focusPlugin)
    .add(compositionPlugin)
    .add([basePlugin, options.base])
    .add(decorationsPlugin)
    .maybeAdd(undoRedoPlugin, (p, builder) => {
      // The undo redo plugin needs to be add before the blockTypePlugin
      if (options.featureFlags?.undoRedoButtons) {
        return builder.add(p);
      }
      return builder;
    })
    .add([blockTypePlugin, options.blockType])
    .add(clearMarksOnChangeToEmptyDocumentPlugin)
    .maybeAdd(annotationPlugin, (p, builder) => {
      if (options.annotationProviders) {
        return builder.add([p, options.annotationProviders]);
      }
      return builder;
    })
    /**
     * Do not use this plugin - it is for AI purposes only.
     */
    .maybeAdd(selectionToolbarPlugin, (plugin, builder) => {
      if (getBooleanFF('platform.editor.enable-selection-toolbar_ucdwd')) {
        return builder.add([
          plugin,
          {
            preferenceToolbarAboveSelection: false,
          },
        ]);
      }

      return builder;
    })
    .add([hyperlinkPlugin, options.hyperlinkOptions])
    .add([textFormattingPlugin, options.textFormatting])
    .add(widthPlugin)
    .add([quickInsertPlugin, options.quickInsert])
    .add([
      typeAheadPlugin,
      options.typeAhead || {
        createAnalyticsEvent: options.createAnalyticsEvent,
      },
    ])
    .add([placeholderPlugin, options.placeholder])
    .add(unsupportedContentPlugin)
    .add(editorDisabledPlugin)
    .add([submitEditorPlugin, options.submitEditor])
    .add(copyButtonPlugin)
    .add(floatingToolbarPlugin)
    .add([selectionPlugin, options.selection])
    .add([codeBlockPlugin, options.codeBlock || { appearance: 'full-page' }]);

  return preset;
}

export function useDefaultPreset(
  props: EditorPresetProps & DefaultPresetPluginOptions,
) {
  const preset = createDefaultPreset(props);
  return [preset];
}
