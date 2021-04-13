import { PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import { DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';

import panelPlugin from '../../../panel';
import layoutPlugin from '../../../layout';
import datePlugin from '../../../date';
import tasksDecisionsPlugin from '../../../tasks-and-decisions';
import selectionPlugin from '../../index';
import { selectionPluginKey, SelectionPluginState } from '../../types';

const createEditor = createProsemirrorEditorFactory();
const preset = new Preset<LightEditorPlugin>()
  .add(selectionPlugin)
  .add(layoutPlugin)
  .add(datePlugin)
  .add(tasksDecisionsPlugin)
  .add(panelPlugin);

export const editor = (doc: DocBuilder) =>
  createEditor<SelectionPluginState, PluginKey>({
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
