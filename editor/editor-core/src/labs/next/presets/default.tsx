// #region Imports
import React from 'react';
import pastePlugin from '../../../plugins/paste';
import blockTypePlugin from '../../../plugins/block-type';
import clearMarksOnChangeToEmptyDocumentPlugin from '../../../plugins/clear-marks-on-change-to-empty-document';
import hyperlinkPlugin from '../../../plugins/hyperlink';
import textFormattingPlugin from '../../../plugins/text-formatting';
import widthPlugin from '../../../plugins/width';
import unsupportedContentPlugin from '../../../plugins/unsupported-content';
import basePlugin from '../../../plugins/base';
import editorDisabledPlugin from '../../../plugins/editor-disabled';
import typeAheadPlugin from '../../../plugins/type-ahead';
import gapCursorPlugin from '../../../plugins/gap-cursor';
import submitEditorPlugin from '../../../plugins/submit-editor';
import fakeTextCursorPlugin from '../../../plugins/fake-text-cursor';
import featureFlagsContextPlugin from '../../../plugins/feature-flags-context';
import floatingToolbarPlugin from '../../../plugins/floating-toolbar';
import scrollIntoViewPlugin from '../../../plugins/scroll-into-view';
import { PresetProvider } from '../Editor';
import { EditorPresetProps } from './types';
import { Preset } from './preset';
import { EditorPlugin } from '../../../types/editor-plugin';
// #endregion

interface EditorPresetDefaultProps {
  children?: React.ReactNode;
}

export function useDefaultPreset({ featureFlags }: EditorPresetProps) {
  const preset = new Preset<EditorPlugin>();
  preset.add([pastePlugin, {}]);
  preset.add(basePlugin);
  preset.add(blockTypePlugin);
  preset.add(clearMarksOnChangeToEmptyDocumentPlugin);
  preset.add(hyperlinkPlugin);
  preset.add(textFormattingPlugin);
  preset.add(widthPlugin);
  preset.add(typeAheadPlugin);
  preset.add(unsupportedContentPlugin);
  preset.add(editorDisabledPlugin);
  preset.add(gapCursorPlugin);
  preset.add(submitEditorPlugin);
  preset.add(fakeTextCursorPlugin);
  preset.add([featureFlagsContextPlugin, featureFlags || {}]);
  preset.add(floatingToolbarPlugin);
  preset.add(scrollIntoViewPlugin);
  return [preset];
}

export function EditorPresetDefault(
  props: EditorPresetDefaultProps & EditorPresetProps,
) {
  const [preset] = useDefaultPreset(props);
  const plugins = preset.getEditorPlugins();

  return <PresetProvider value={plugins}>{props.children}</PresetProvider>;
}
