import {
  DocBuilder,
  doc,
  tdEmpty,
  table,
  tr,
  p,
  Refs,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { EditorState } from 'prosemirror-state';
import { Node as ProseMirrorNode } from 'prosemirror-model';
import { Step } from 'prosemirror-transform';
import {
  tdColorA,
  tdColorC,
  createCellColorA,
  createCellColorB,
  createCellColorC,
  setup,
  applyAndInvertTransaction,
  addColumnAtFactory,
  removeColumnAtFactory,
  CreateTransaction,
  testHistory,
} from './_utils';
import { AddColumnStep } from '../add-column';
import { defaultSchema } from '../../../schema/default-schema';

import * as addColumnAtZeroJson from './__fixtures__/merge-cells/columns/add-column-at-0.json';
import * as addColumnAtOneJson from './__fixtures__/merge-cells/columns/add-column-at-1.json';
import * as addColumnAtTwoJson from './__fixtures__/merge-cells/columns/add-column-at-2.json';
import * as addColumnAtThreeJson from './__fixtures__/merge-cells/columns/add-column-at-3.json';
import * as removeColumnAtZeroJson from './__fixtures__/merge-cells/columns/remove-column-at-0.json';
import * as removeColumnAtOneJson from './__fixtures__/merge-cells/columns/remove-column-at-1.json';
import * as removeColumnAtTwoJson from './__fixtures__/merge-cells/columns/remove-column-at-2.json';

// inverted
import * as addColumnAtZeroInvertedJson from './__fixtures__/merge-cells/columns/add-column-at-0-inverted.json';
import * as addColumnAtOneInvertedJson from './__fixtures__/merge-cells/columns/add-column-at-1-inverted.json';
import * as addColumnAtTwoInvertedJson from './__fixtures__/merge-cells/columns/add-column-at-2-inverted.json';
import * as addColumnAtThreeInvertedJson from './__fixtures__/merge-cells/columns/add-column-at-3-inverted.json';
import * as removeColumnAtZeroInvertedJson from './__fixtures__/merge-cells/columns/remove-column-at-0-inverted.json';
import * as removeColumnAtOneInvertedJson from './__fixtures__/merge-cells/columns/remove-column-at-1-inverted.json';
import * as removeColumnAtTwoInvertedJson from './__fixtures__/merge-cells/columns/remove-column-at-2-inverted.json';

// Possible documents
const originalDoc = doc(
  '{table}',
  table()(
    tr(tdColorA, createCellColorB(2)),
    tr(createCellColorA(2), tdColorC),
    tr(createCellColorC(3)),
  ),
);
const docAfterAddColumnAtZero = doc(
  table()(
    tr(tdEmpty, tdColorA, createCellColorB(2)),
    tr(tdEmpty, createCellColorA(2), tdColorC),
    tr(tdEmpty, createCellColorC(3)),
  ),
);

const docAfterAddColumnAtOne = doc(
  table()(
    tr(tdColorA, tdEmpty, createCellColorB(2)),
    tr(createCellColorA(3), tdColorC),
    tr(createCellColorC(4)),
  ),
);

const docAfterAddColumnAtTwo = doc(
  table()(
    tr(tdColorA, createCellColorB(3)),
    tr(createCellColorA(2), tdEmpty, tdColorC),
    tr(createCellColorC(4)),
  ),
);

const docAfterAddColumnAtThree = doc(
  table()(
    tr(tdColorA, createCellColorB(2), tdEmpty),
    tr(createCellColorA(2), tdColorC, tdEmpty),
    tr(createCellColorC(3), tdEmpty),
  ),
);

const docAfterRemoveColumnOne = doc(
  table()(
    tr(tdColorA, createCellColorB(1)),
    tr(createCellColorA(1), tdColorC),
    tr(createCellColorC(2)),
  ),
);

const docAfterRemoveColumnZero = doc(
  table()(
    tr(createCellColorB(2)),
    tr(createCellColorA(1), tdColorC),
    tr(createCellColorC(2)),
  ),
);

const docAfterRemoveColumnTwo = doc(
  table()(
    tr(tdColorA, createCellColorB(1)),
    tr(createCellColorA(2)),
    tr(createCellColorC(2)),
  ),
);

/**
 * Index for adding a column works like this
 * | colorA | colorB | colorC |
 * | colorA | colorB | colorC |
 * 0        1        2        3
 *
 * Index for remove a column works like this
 * | colorA | colorB | colorC |
 * | colorA | colorB | colorC |
 *     0        1        2
 */
describe('AddColumnStep', () => {
  describe(`
  table 3x3 with merged columns
  | a | b     |
  | a     | c |
  |     c     |
  `, () => {
    let editorState: EditorState;
    let refs: Refs;

    beforeEach(() => {
      ({ editorState, refs } = setup(originalDoc));
    });

    describe('add a column', () => {
      it.each`
        column | expectedDoc
        ${0}   | ${docAfterAddColumnAtZero}
        ${1}   | ${docAfterAddColumnAtOne}
        ${2}   | ${docAfterAddColumnAtTwo}
        ${3}   | ${docAfterAddColumnAtThree}
      `(
        'should add a column at $column of the table',
        ({ column, expectedDoc }) => {
          editorState = editorState.apply(
            addColumnAtFactory('table', column)(editorState, refs),
          );

          expect(editorState.doc).toEqualDocument(expectedDoc);
        },
      );
    });

    describe('remove a column', () => {
      it.each`
        column | expectedDoc
        ${0}   | ${docAfterRemoveColumnZero}
        ${1}   | ${docAfterRemoveColumnOne}
        ${2}   | ${docAfterRemoveColumnTwo}
      `(
        'should remove a column at $column of the table',
        ({ column, expectedDoc }) => {
          editorState = editorState.apply(
            removeColumnAtFactory('table', column)(editorState, refs),
          );

          expect(editorState.doc).toEqualDocument(expectedDoc);
        },
      );
    });

    describe('invert', () => {
      let editorState: EditorState;
      let refs: Refs;
      let originalDocNode: ProseMirrorNode;

      beforeEach(() => {
        ({ editorState, refs } = setup(originalDoc));
        originalDocNode = editorState.doc;
      });

      it.each`
        description                                                             | setup
        ${'add column that was removed at the end with the same content'}       | ${removeColumnAtFactory('table', 2)}
        ${'add column that was removed at the beginning with the same content'} | ${removeColumnAtFactory('table', 0)}
        ${'add column that was removed in the middle with the same content'}    | ${removeColumnAtFactory('table', 1)}
        ${'remove a column that was added at the beginning'}                    | ${addColumnAtFactory('table', 0)}
        ${'remove a column that was added at the middle'}                       | ${addColumnAtFactory('table', 1)}
        ${'remove a column that was added at the almost end'}                   | ${addColumnAtFactory('table', 2)}
        ${'remove a column that was added at the end'}                          | ${addColumnAtFactory('table', 3)}
      `('should be able to $description', ({ setup }) => {
        const transaction = setup(editorState, refs);
        editorState = applyAndInvertTransaction(originalDocNode)(
          transaction,
          editorState,
        );
        expect(editorState.doc).toEqualDocument(originalDoc);
      });
    });

    describe('mapping', () => {
      it.each<
        [string, DocBuilder, CreateTransaction, CreateTransaction, DocBuilder]
      >([
        [
          'add the column in the correct position after adding text at the beginning',
          doc(
            '{table}',
            table()(
              tr(tdColorA, createCellColorB(2)),
              tr(createCellColorA(2), tdColorC),
              tr(createCellColorC(3)),
            ),
          ),
          (editorState) => editorState.tr.insertText('foo', 0),
          addColumnAtFactory('table', 3),
          doc(
            p('foo'),
            table()(
              tr(tdColorA, createCellColorB(2), tdEmpty),
              tr(createCellColorA(2), tdColorC, tdEmpty),
              tr(createCellColorC(3), tdEmpty),
            ),
          ),
        ],
        [
          'add the column in the correct position after adding a column at the beginning',
          doc(
            '{table}',
            table()(
              tr(tdColorA, createCellColorB(2)),
              tr(createCellColorA(2), tdColorC),
              tr(createCellColorC(3)),
            ),
          ),
          addColumnAtFactory('table', 0),
          addColumnAtFactory('table', 3),
          doc(
            table()(
              tr(tdEmpty, tdColorA, createCellColorB(2), tdEmpty),
              tr(tdEmpty, createCellColorA(2), tdColorC, tdEmpty),
              tr(tdEmpty, createCellColorC(3), tdEmpty),
            ),
          ),
        ],
        [
          'add the column in the correct position after adding a column in the same position',
          doc(
            '{table}',
            table()(
              tr(tdColorA, createCellColorB(2)),
              tr(createCellColorA(2), tdColorC),
              tr(createCellColorC(3)),
            ),
          ),
          addColumnAtFactory('table', 2),
          addColumnAtFactory('table', 2),
          doc(
            table()(
              tr(tdColorA, createCellColorB(4)),
              tr(createCellColorA(2), tdEmpty, tdEmpty, tdColorC),
              tr(createCellColorC(5)),
            ),
          ),
        ],
      ])(
        'should %s',
        (_, originalDoc, firstTransaction, secondTransaction, expectedDoc) => {
          let { editorState, refs } = setup(originalDoc);

          const transaction = firstTransaction(editorState, refs);
          let addColumnStep: Step | null | undefined = secondTransaction(
            editorState,
            refs,
          ).steps[0];

          editorState = editorState.apply(transaction);

          // Map the step with the transaction
          addColumnStep = addColumnStep.map(transaction.mapping);

          // It should exist
          expect(addColumnStep).toBeTruthy();

          editorState = editorState.apply(editorState.tr.step(addColumnStep!));

          expect(editorState.doc).toEqualDocument(expectedDoc);
        },
      );
    });

    describe('history plugin', () => {
      const testCases: [
        string,
        CreateTransaction,
        CreateTransaction[],
        DocBuilder,
      ][] = [
        [
          'be able to undo an add column step after adding new columns',
          addColumnAtFactory('table', 2),
          [addColumnAtFactory('table', 1), addColumnAtFactory('table', 1)],
          doc(
            table()(
              tr(tdColorA, tdEmpty, tdEmpty, createCellColorB(2)),
              tr(createCellColorA(4), tdColorC),
              tr(createCellColorC(5)),
            ),
          ),
        ],
        [
          'be able to undo an remove column step after adding new columns',
          removeColumnAtFactory('table', 2),
          [addColumnAtFactory('table', 1), addColumnAtFactory('table', 1)],
          doc(
            table()(
              tr(tdColorA, tdEmpty, tdEmpty, createCellColorB(2)),
              tr(createCellColorA(4), tdColorC),
              tr(createCellColorC(5)),
            ),
          ),
        ],
        [
          'be able to undo an add column step after removing columns',
          addColumnAtFactory('table', 2),
          [
            removeColumnAtFactory('table', 0),
            removeColumnAtFactory('table', 0),
          ],
          doc(
            table()(
              tr(createCellColorB(1)),
              tr(tdColorC),
              tr(createCellColorC(1)),
            ),
          ),
        ],
        [
          'be able to undo a remove column step after removing a column',
          removeColumnAtFactory('table', 2),
          [removeColumnAtFactory('table', 0)],
          doc(
            table()(
              tr(createCellColorB(2)),
              tr(createCellColorA(1), tdColorC),
              tr(createCellColorC(2)),
            ),
          ),
        ],
      ];

      testCases.forEach(
        ([description, transaction, historyTransactions, expectDoc]) => {
          it(`should ${description}`, () => {
            const editorState = testHistory(
              originalDoc,
              transaction,
              historyTransactions,
            );

            expect(editorState.doc).toEqualDocument(expectDoc);
          });
        },
      );
    });

    describe('fromJson()', () => {
      it.each`
        column | startDoc       | jsonStep                | expectedDoc
        ${0}   | ${originalDoc} | ${addColumnAtZeroJson}  | ${docAfterAddColumnAtZero}
        ${1}   | ${originalDoc} | ${addColumnAtOneJson}   | ${docAfterAddColumnAtOne}
        ${2}   | ${originalDoc} | ${addColumnAtTwoJson}   | ${docAfterAddColumnAtTwo}
        ${3}   | ${originalDoc} | ${addColumnAtThreeJson} | ${docAfterAddColumnAtThree}
      `(
        'should parse JSON and add a column at $column column',
        ({ startDoc, jsonStep, expectedDoc }) => {
          ({ editorState } = setup(startDoc));

          const addColumnStep = Step.fromJSON(defaultSchema, jsonStep);
          editorState = editorState.apply(editorState.tr.step(addColumnStep));

          expect(editorState.doc).toEqualDocument(expectedDoc);
        },
      );

      it.each`
        column | startDoc                    | jsonStep                        | expectedDoc
        ${0}   | ${docAfterAddColumnAtZero}  | ${addColumnAtZeroInvertedJson}  | ${originalDoc}
        ${1}   | ${docAfterAddColumnAtOne}   | ${addColumnAtOneInvertedJson}   | ${originalDoc}
        ${2}   | ${docAfterAddColumnAtTwo}   | ${addColumnAtTwoInvertedJson}   | ${originalDoc}
        ${3}   | ${docAfterAddColumnAtThree} | ${addColumnAtThreeInvertedJson} | ${originalDoc}
      `(
        'should parse JSON and remove a column that was added at $column column',
        ({ startDoc, jsonStep, expectedDoc }) => {
          ({ editorState } = setup(startDoc));

          const addColumnStep = Step.fromJSON(defaultSchema, jsonStep);
          editorState = editorState.apply(editorState.tr.step(addColumnStep));

          expect(editorState.doc).toEqualDocument(expectedDoc);
        },
      );

      it.each`
        column | jsonStep                  | expectedDoc
        ${0}   | ${removeColumnAtZeroJson} | ${docAfterRemoveColumnZero}
        ${1}   | ${removeColumnAtOneJson}  | ${docAfterRemoveColumnOne}
        ${2}   | ${removeColumnAtTwoJson}  | ${docAfterRemoveColumnTwo}
      `(
        'should parse JSON and remove a column at $column column',
        ({ jsonStep, expectedDoc }) => {
          const addColumnStep = Step.fromJSON(defaultSchema, jsonStep);
          editorState = editorState.apply(editorState.tr.step(addColumnStep));

          expect(editorState.doc).toEqualDocument(expectedDoc);
        },
      );

      it.each`
        column | startDoc                    | jsonStep                          | expectedDoc
        ${0}   | ${docAfterRemoveColumnZero} | ${removeColumnAtZeroInvertedJson} | ${originalDoc}
        ${1}   | ${docAfterRemoveColumnOne}  | ${removeColumnAtOneInvertedJson}  | ${originalDoc}
        ${2}   | ${docAfterRemoveColumnTwo}  | ${removeColumnAtTwoInvertedJson}  | ${originalDoc}
      `(
        'should parse JSON and add a column that was removed at $column column',
        ({ startDoc, jsonStep, expectedDoc }) => {
          ({ editorState } = setup(startDoc));

          const addColumnStep = Step.fromJSON(defaultSchema, jsonStep);
          editorState = editorState.apply(editorState.tr.step(addColumnStep));

          expect(editorState.doc).toEqualDocument(expectedDoc);
        },
      );
    });

    // Sanity check of the serialization process
    describe('serialize/deserialize', () => {
      it.each`
        column
        ${0}
        ${1}
        ${2}
        ${3}
      `(
        'should serialize/deserialize a new column at $column',
        ({ column }) => {
          const { editorState, refs } = setup(originalDoc);
          const addColumnStep = AddColumnStep.create(
            editorState.doc,
            refs['table'],
            column,
            false,
          );

          const json = addColumnStep.toJSON();
          const stepFromJson = Step.fromJSON(defaultSchema, json);
          expect(
            editorState.apply(editorState.tr.step(addColumnStep)).doc,
          ).toEqual(editorState.apply(editorState.tr.step(stepFromJson)).doc);
        },
      );

      it.each`
        column
        ${0}
        ${1}
        ${2}
      `(
        'should serialize/deserialize remove a column at $column',
        ({ column }) => {
          const { editorState, refs } = setup(originalDoc);
          const addColumnStep = AddColumnStep.create(
            editorState.doc,
            refs['table'],
            column,
            true,
          );

          const json = addColumnStep.toJSON();
          const stepFromJson = Step.fromJSON(defaultSchema, json);

          expect(
            editorState.apply(editorState.tr.step(addColumnStep)).doc,
          ).toEqual(editorState.apply(editorState.tr.step(stepFromJson)).doc);
        },
      );
    });
  });
});
