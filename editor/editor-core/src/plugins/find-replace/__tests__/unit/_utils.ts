// eslint-disable-next-line import/no-extraneous-dependencies
import type {
  LightEditorPlugin,
  CreatePMEditorOptions,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type {
  EditorState,
  PluginKey,
} from '@atlaskit/editor-prosemirror/state';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import findReplacePlugin from '../../index';
import { getPluginState } from '../../plugin';
import { findReplacePluginKey } from '../../types';
import { selectedSearchMatchClass } from '../../styles';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { textFormattingPlugin } from '@atlaskit/editor-plugin-text-formatting';
import type { DocBuilder } from '@atlaskit/editor-common/types';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';

export const createEditor = createProsemirrorEditorFactory();

export const getFindReplacePreset = (
  createAnalyticsEvent?: CreateUIAnalyticsEvent,
) => {
  let preset: any = new Preset<LightEditorPlugin>()
    .add([featureFlagsPlugin, {}])
    .add([
      findReplacePlugin,
      { takeFullWidth: false, twoLineEditorToolbar: false },
    ]);
  if (createAnalyticsEvent) {
    preset = preset.add([analyticsPlugin, { createAnalyticsEvent }]);
  }
  return preset.add(textFormattingPlugin);
};

export const editor = (
  doc: DocBuilder,
  createAnalyticsEvent?: CreateUIAnalyticsEvent,
  options: Partial<CreatePMEditorOptions<never>> = {},
) => {
  const preset = getFindReplacePreset(createAnalyticsEvent);

  return createEditor<boolean, PluginKey, typeof preset>({
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
