import {
  doc,
  p,
  strong,
  panel,
  em,
  taskList,
  taskItem,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
import { contentInSelection } from '../../content-in-selection';

describe('content-in-selection', () => {
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
    const editorState = createEditorState(inputDoc);
    const { nodeTypes, markTypes } = contentInSelection(editorState);
    expect(nodeTypes).toStrictEqual(expectedNodes);
    expect(markTypes).toStrictEqual(expectedMarks);
  });
});
