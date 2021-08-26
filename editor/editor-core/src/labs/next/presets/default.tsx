// #region Imports
import React from 'react';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import pastePlugin, { PastePluginOptions } from '../../../plugins/paste';
import blockTypePlugin from '../../../plugins/block-type';
import clearMarksOnChangeToEmptyDocumentPlugin from '../../../plugins/clear-marks-on-change-to-empty-document';
import hyperlinkPlugin from '../../../plugins/hyperlink';
import textFormattingPlugin from '../../../plugins/text-formatting';
import widthPlugin from '../../../plugins/width';
import unsupportedContentPlugin from '../../../plugins/unsupported-content';
import basePlugin, { BasePluginOptions } from '../../../plugins/base';
import editorDisabledPlugin from '../../../plugins/editor-disabled';
import typeAheadPlugin from '../../../plugins/type-ahead';
import submitEditorPlugin from '../../../plugins/submit-editor';
import fakeTextCursorPlugin from '../../../plugins/fake-text-cursor';
import featureFlagsContextPlugin from '../../../plugins/feature-flags-context';
import floatingToolbarPlugin from '../../../plugins/floating-toolbar';
import { PresetProvider, EditorProps } from '../Editor';
import { EditorPresetProps } from './types';
import { Preset } from './preset';
import { EditorPlugin } from '../../../types/editor-plugin';
import clipboardPlugin from '../../../plugins/clipboard';
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
import { CardOptions } from '@atlaskit/editor-common';
import undoRedoPlugin from '../../../plugins/undo-redo';
import { TypeAheadPluginOptions } from '../../../plugins/type-ahead';
// #endregion

interface EditorPresetDefaultProps {
  children?: React.ReactNode;
}

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
  createAnalyticsEvent?: CreateUIAnalyticsEvent;
  typeAhead?: TypeAheadPluginOptions;
};

/**
 * Note: The order that presets are added determines
 * their placement in the editor toolbar
 */
export function createDefaultPreset(
  options: EditorPresetProps & DefaultPresetPluginOptions,
) {
  const preset = new Preset<EditorPlugin>();
  preset.add([pastePlugin, options.paste]);
  preset.add(clipboardPlugin);
  preset.add([basePlugin, options.base]);
  if (options.featureFlags?.undoRedoButtons) {
    preset.add(undoRedoPlugin);
  }
  preset.add([blockTypePlugin, options.blockType]);
  preset.add([placeholderPlugin, options.placeholder]);
  preset.add(clearMarksOnChangeToEmptyDocumentPlugin);

  if (options.annotationProviders) {
    preset.add([annotationPlugin, options.annotationProviders]);
  }

  preset.add([hyperlinkPlugin, options.cardOptions]);
  preset.add([textFormattingPlugin, options.textFormatting]);
  preset.add(widthPlugin);
  preset.add([quickInsertPlugin, options.quickInsert]);
  preset.add([
    typeAheadPlugin,
    options.typeAhead || {
      createAnalyticsEvent: options.createAnalyticsEvent,
    },
  ]);
  preset.add(unsupportedContentPlugin);
  preset.add(editorDisabledPlugin);
  preset.add([submitEditorPlugin, options.submitEditor]);
  preset.add(fakeTextCursorPlugin);
  preset.add(floatingToolbarPlugin);
  preset.add([featureFlagsContextPlugin, options.featureFlags || {}]);
  preset.add([selectionPlugin, options.selection]);
  preset.add([codeBlockPlugin, options.codeBlock]);
  return preset;
}

export function useDefaultPreset(
  props: EditorPresetProps & DefaultPresetPluginOptions,
) {
  const preset = createDefaultPreset(props);
  return [preset];
}

export function EditorPresetDefault(
  props: EditorPresetDefaultProps &
    EditorPresetProps &
    DefaultPresetPluginOptions,
) {
  const [preset] = useDefaultPreset(props);
  const plugins = preset.getEditorPlugins();
  return <PresetProvider value={plugins}>{props.children}</PresetProvider>;
}
