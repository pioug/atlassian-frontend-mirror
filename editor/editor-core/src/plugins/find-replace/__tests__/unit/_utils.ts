import {
  createProsemirrorEditorFactory,
  Preset,
  LightEditorPlugin,
  CreatePMEditorOptions,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import { EditorView } from 'prosemirror-view';
import { EditorState, TextSelection, PluginKey } from 'prosemirror-state';
import findReplacePlugin from '../../index';
import { getPluginState } from '../../plugin';
import { findReplacePluginKey } from '../../types';
import { selectedSearchMatchClass } from '../../styles';
import analyticsPlugin from '../../../analytics/plugin';
import { textFormattingPlugin } from '../../../index';
import { DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';

export const createEditor = createProsemirrorEditorFactory();

export const getFindReplacePreset = (
  createAnalyticsEvent?: CreateUIAnalyticsEvent,
) => {
  let preset = new Preset<LightEditorPlugin>().add([
    findReplacePlugin,
    { takeFullWidth: false },
  ]);
  if (createAnalyticsEvent) {
    preset = preset.add([analyticsPlugin, { createAnalyticsEvent }]);
  }
  preset.add(textFormattingPlugin);
  return preset;
};

export const editor = (
  doc: DocBuilder,
  createAnalyticsEvent?: CreateUIAnalyticsEvent,
  options: Partial<CreatePMEditorOptions> = {},
) => {
  const preset = getFindReplacePreset(createAnalyticsEvent);

  return createEditor<boolean, PluginKey>({
    doc,
    preset,
    ...options,
  });
};

export const setSelection = (
  editorView: EditorView,
  from: number,
  to?: number,
) =>
  editorView.dispatch(
    editorView.state.tr.setSelection(
      TextSelection.create(editorView.state.doc, from, to),
    ),
  );

export const getFindReplaceTr = (dispatchSpy: jest.SpyInstance) =>
  dispatchSpy.mock.calls.filter(([transaction]) =>
    transaction.getMeta(findReplacePluginKey),
  )[0][0];

export const getSelectedWordDecorations = (state: EditorState) => {
  const { decorationSet } = getPluginState(state);
  return decorationSet
    .find()
    .filter(
      (decoration) =>
        (decoration as any).type.attrs.class.indexOf(
          selectedSearchMatchClass,
        ) >= 0,
    );
};

export const getContainerElement = () => {
  const containerElement = document.createElement('div');
  const pmElement = document.createElement('div');
  pmElement.classList.add('ProseMirror');
  containerElement.appendChild(pmElement);
  return containerElement;
};
