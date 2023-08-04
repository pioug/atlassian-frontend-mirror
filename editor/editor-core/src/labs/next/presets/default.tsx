// #region Imports
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import pastePlugin, { PastePluginOptions } from '../../../plugins/paste';
import blockTypePlugin from '../../../plugins/block-type';
import clearMarksOnChangeToEmptyDocumentPlugin from '../../../plugins/clear-marks-on-change-to-empty-document';
import { hyperlinkPlugin } from '@atlaskit/editor-plugin-hyperlink';
import textFormattingPlugin from '../../../plugins/text-formatting';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import unsupportedContentPlugin from '../../../plugins/unsupported-content';
import basePlugin, { BasePluginOptions } from '../../../plugins/base';
import { editorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';
import typeAheadPlugin from '../../../plugins/type-ahead';
import submitEditorPlugin from '../../../plugins/submit-editor';
import fakeTextCursorPlugin from '../../../plugins/fake-text-cursor';
import featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';
import floatingToolbarPlugin from '../../../plugins/floating-toolbar';
import { EditorProps } from '../../../types/editor-props';
import { EditorPresetProps } from './types';
import clipboardPlugin from '../../../plugins/clipboard';
import { analyticsPlugin as deprecatedAnalyticsPlugin } from '../../../plugins';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { BlockTypePluginOptions } from '../../../plugins/block-type/types';
import placeholderPlugin, {
  PlaceholderPluginOptions,
} from '../../../plugins/placeholder';
import annotationPlugin, {
  AnnotationProviders,
} from '../../../plugins/annotation';
import { TextFormattingOptions } from '../../../plugins/text-formatting/types';
import quickInsertPlugin, {
  QuickInsertPluginOptions,
} from '../../../plugins/quick-insert';
import selectionPlugin from '../../../plugins/selection';
import codeBlockPlugin from '../../../plugins/code-block';
import { CodeBlockOptions } from '../../../plugins/code-block/types';
import { SelectionPluginOptions } from '../../../plugins/selection/types';
import { CardOptions } from '@atlaskit/editor-common/card';
import undoRedoPlugin from '../../../plugins/undo-redo';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import { TypeAheadPluginOptions } from '../../../plugins/type-ahead';
import type { HyperlinkPluginOptions } from '@atlaskit/editor-common/types';
import { EditorPresetBuilder } from '@atlaskit/editor-common/preset';
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
    .maybeAdd(deprecatedAnalyticsPlugin, (plugin, builder) => {
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
    .add([pastePlugin, options.paste])
    .add(clipboardPlugin)
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
    .add([placeholderPlugin, options.placeholder])
    .add(clearMarksOnChangeToEmptyDocumentPlugin)

    .maybeAdd(annotationPlugin, (p, builder) => {
      if (options.annotationProviders) {
        return builder.add([p, options.annotationProviders]);
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
    .add(unsupportedContentPlugin)
    .add(editorDisabledPlugin)
    .add([submitEditorPlugin, options.submitEditor])
    .add(fakeTextCursorPlugin)
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
