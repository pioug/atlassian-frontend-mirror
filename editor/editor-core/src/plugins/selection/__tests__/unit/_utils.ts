import type { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import type { DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';

import panelPlugin from '../../../panel';
import layoutPlugin from '../../../layout';
import datePlugin from '../../../date';
import tasksDecisionsPlugin from '../../../tasks-and-decisions';
import { editorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';
import selectionPlugin from '../../index';
import type { SelectionPluginState } from '../../types';
import { selectionPluginKey } from '../../types';
import featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';

const createEditor = createProsemirrorEditorFactory();
const preset = new Preset<LightEditorPlugin>()
  .add([featureFlagsPlugin, {}])
  .add([analyticsPlugin, {}])
  .add(decorationsPlugin)
  .add(editorDisabledPlugin)
  .add(selectionPlugin)
  .add(layoutPlugin)
  .add(datePlugin)
  .add(tasksDecisionsPlugin)
  .add(panelPlugin);

export const editor = (doc: DocBuilder) =>
  createEditor<SelectionPluginState, PluginKey, typeof preset>({
    doc,
    preset,
    pluginKey: selectionPluginKey,
  });

export const sendArrowLeftKey = (
  editorView: EditorView,
  { numTimes = 1 }: { numTimes?: number } = {},
) => {
  for (let i = 0; i < numTimes; i++) {
    sendKeyToPm(editorView, 'ArrowLeft');
  }
};

export const sendArrowRightKey = (
  editorView: EditorView,
  { numTimes = 1 }: { numTimes?: number } = {},
) => {
  for (let i = 0; i < numTimes; i++) {
    sendKeyToPm(editorView, 'ArrowRight');
  }
};
