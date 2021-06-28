import { EditorState, Selection, TextSelection } from 'prosemirror-state';

import { defaultSchema } from '@atlaskit/adf-schema';
import {
  doc,
  p,
  RefsNode,
  table,
  td,
  th,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';

import {
  c,
  c11,
  cAnchor,
  cHead,
  createTableWithDoc,
} from '../../../__tests__/__helpers/doc-builder';
import { selectionFor } from '../../../__tests__/__helpers/selection-for';
import { Command } from '../../../types';
import { goToNextCell } from '../../go-to-next-cell';

function testCommandSelection(
  doc: RefsNode,
  command: Command,
  selection: Selection | null,
) {
  let state = EditorState.create({ doc, selection: selectionFor(doc) });

  const newSelection = selection || state.selection;
  command(state, (tr) => (state = state.apply(tr)));

  expect(state.selection.eq(newSelection)).toBeTruthy();
}

describe('goToNextCell', () => {
  it('does not change selection if current selection is not in table', () => {
    const input = doc(
      p('text{cursor}'),
      table()(tr(th({})(p()), th({})(p())), tr(td({})(p()), td({})(p()))),
    )(defaultSchema);
    testCommandSelection(input, goToNextCell(-1), null);
    testCommandSelection(input, goToNextCell(1), null);
  });

  it('go the the next cell', () => {
    const document = createTableWithDoc(
      tr(th({})(p()), th({})(p())),
      tr(td({})(p('{cursor}')), td({})(p('{newPos}'))),
    );

    const newSelection = TextSelection.create(document, document.refs.newPos);

    testCommandSelection(document, goToNextCell(1), newSelection);
  });

  it('go the the previous cell', () => {
    const document = createTableWithDoc(
      tr(th({})(p()), th({})(p('{newPos}'))),
      tr(td({})(p('{cursor}')), td({})(p())),
    );

    const newSelection = TextSelection.create(document, document.refs.newPos);

    testCommandSelection(document, goToNextCell(-1), newSelection);
  });

  it('selection does not change when there is not previous cell', () => {
    const document = createTableWithDoc(
      tr(th({})(p('{cursor}')), th({})(p())),
      tr(td({})(p()), td({})(p())),
    );

    testCommandSelection(document, goToNextCell(-1), null);
  });

  it('selection does not change when there is not next cell', () => {
    const document = createTableWithDoc(
      tr(th({})(p()), th({})(p())),
      tr(td({ colspan: 2 })(p('{cursor}test'))),
      tr(th({})(p('{newPos}')), th({})(p())),
    );

    const newSelection = TextSelection.create(document, document.refs.newPos);

    testCommandSelection(document, goToNextCell(1), newSelection);
  });

  it('go to next cell with cell selection', () => {
    const document = createTableWithDoc(
      tr(c11, cAnchor, c(2, 1)),
      tr(c(4, 1)),
      tr(c(2, 1), cHead, td()(p('{newPos}'))),
    );

    const { newPos } = document.refs;

    const newSelection = TextSelection.create(document, newPos);

    testCommandSelection(document, goToNextCell(1), newSelection);
  });

  it('go to previous cell with cell selection', () => {
    const document = createTableWithDoc(
      tr(c11, cAnchor, c(2, 1)),
      tr(c(4, 1)),
      tr(td({ colspan: 2, rowspan: 1 })(p('x{newPos}')), cHead, c11),
    );

    const { newPos } = document.refs;

    const newSelection = TextSelection.create(document, newPos - 1, newPos);

    testCommandSelection(document, goToNextCell(-1), newSelection);
  });
});
