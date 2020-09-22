import {
  doc,
  p,
  strong,
  panel,
  em,
  taskList,
  taskItem,
} from '@atlaskit/editor-test-helpers';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { PluginKey } from 'prosemirror-state';
import {
  selectionPluginKey,
  SelectionPluginState,
} from '../../../selection/types';
import textFormattingPlugin from '../../../text-formatting';
import panelPlugin from '../../../panel';
import tasksAndDecisionsPlugin from '../../../tasks-and-decisions';
import { contentInSelection } from '../../content-in-selection';
import { mobileSelectionPlugin } from '../../mobile-selection-plugin';

describe('content-in-selection', () => {
  const createEditor = createProsemirrorEditorFactory();
  const preset = new Preset<LightEditorPlugin>()
    .add(mobileSelectionPlugin)
    .add(textFormattingPlugin)
    .add(panelPlugin)
    .add(tasksAndDecisionsPlugin);

  const editor = (doc: any) =>
    createEditor<SelectionPluginState, PluginKey>({
      doc,
      preset,
      pluginKey: selectionPluginKey,
    });

  test.each([
    ['paragraph', doc(p('{<}Hello{>}')), ['paragraph', 'text'], []],
    [
      'nested nodes',
      doc(panel()(p('{<}Hello{>}'))),
      ['panel', 'paragraph', 'text'],
      [],
    ],
    [
      'split nodes',
      doc(p('{<}Hel'), panel()(p('lo{>}'))),
      ['paragraph', 'text', 'panel'],
      [],
    ],
    [
      'action',
      doc(
        taskList({ localId: 'dummy-list' })(
          taskItem({ localId: 'dummy-item' })('{<}Hello{>}'),
        ),
      ),
      ['taskList', 'taskItem', 'text'],
      [],
    ],
    ['bold', doc(p(strong('{<}Hello{>}'))), ['paragraph', 'text'], ['strong']],
    [
      'split mark',
      doc(p('{<}Hel', strong('lo{>}'))),
      ['paragraph', 'text'],
      ['strong'],
    ],
    [
      'mixed marks',
      doc(p('He{<}', strong('ll'), strong(em('o t')), strong('he'), '{>}re')),
      ['paragraph', 'text'],
      ['strong', 'em'],
    ],
  ])('%s', (_, inputDoc, expectedNodes, expectedMarks) => {
    const { editorView } = editor(inputDoc);
    const { nodeTypes, markTypes } = contentInSelection(editorView.state);
    expect(nodeTypes).toStrictEqual(expectedNodes);
    expect(markTypes).toStrictEqual(expectedMarks);
  });
});
