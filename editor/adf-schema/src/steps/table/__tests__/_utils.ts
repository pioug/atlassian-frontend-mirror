import { Node as ProseMirrorNode } from 'prosemirror-model';
import { EditorState, Plugin, Transaction } from 'prosemirror-state';
import { history, undo } from 'prosemirror-history';
import {
  DocBuilder,
  p,
  Refs,
  td,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { setSelectionTransform } from '@atlaskit/editor-test-helpers/set-selection-transform';

import { defaultSchema } from '../../../schema/default-schema';
import { AddColumnStep } from '../add-column';

const createCell = (
  color: string,
  colspan?: number,
  rowspan?: number,
  text: string = '',
) => td({ background: color, colspan, rowspan })(p(text));

export const createCellColorA = createCell.bind(null, '#AAAAAA');
export const createCellColorB = createCell.bind(null, '#BBBBBB');
export const createCellColorC = createCell.bind(null, '#CCCCCC');

export const tdColorA = createCellColorA();
export const tdColorB = createCellColorB();
export const tdColorC = createCellColorC();

// Helper functions
export const applyAndInvertTransaction = (doc: ProseMirrorNode) => (
  transaction: Transaction,
  editorState: EditorState,
) => {
  let localState = editorState;
  const addColumnEndStep = transaction.steps[0];

  // apply original transaction
  localState = localState.apply(transaction);

  const inverted = addColumnEndStep.invert(doc);

  // apply inverted step
  localState = localState.apply(localState.tr.step(inverted));
  return localState;
};

export type CreateTransaction = (
  editorState: EditorState,
  refs: Refs,
) => Transaction;

export const setup = (doc: DocBuilder, plugins: Plugin[] = []) => {
  const docWithRefs = doc(defaultSchema);
  const editorState = EditorState.create({
    doc: docWithRefs,
    plugins,
  });

  const { tr, refs } = setSelectionTransform(docWithRefs, editorState.tr);

  return {
    editorState: editorState.apply(tr),
    refs,
  };
};

export const testHistory = (
  doc: DocBuilder,
  firstTransaction: CreateTransaction,
  historyTransactions: CreateTransaction[],
) => {
  let { editorState, refs } = setup(doc, [history()]);

  const dispatch = (tr: Transaction) => {
    editorState = editorState.apply(tr);
  };

  dispatch(firstTransaction(editorState, refs));

  historyTransactions.forEach((createTransaction) => {
    dispatch(
      createTransaction(editorState, refs).setMeta('addToHistory', false),
    );
  });

  undo(editorState, dispatch);

  return editorState;
};

// Factories
export const addColumnAtFactory = (
  ref: string,
  column: number,
): CreateTransaction => (editorState, refs) =>
  editorState.tr.step(
    AddColumnStep.create(editorState.doc, refs[ref], column, false),
  );
export const removeColumnAtFactory = (
  ref: string,
  column: number,
): CreateTransaction => (editorState, refs) =>
  editorState.tr.step(
    AddColumnStep.create(editorState.doc, refs[ref], column, true),
  );
