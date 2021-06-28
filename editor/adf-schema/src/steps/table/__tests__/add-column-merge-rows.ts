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
  createCellColorA,
  createCellColorB,
  createCellColorC,
  setup,
  applyAndInvertTransaction,
  addColumnAtFactory,
  removeColumnAtFactory,
  CreateTransaction,
} from './_utils';
import { defaultSchema } from '../../../schema/default-schema';

import * as addColumnAtZeroJson from './__fixtures__/merge-cells/rows/add-column-at-0.json';
import * as addColumnAtOneJson from './__fixtures__/merge-cells/rows/add-column-at-1.json';
import * as addColumnAtTwoJson from './__fixtures__/merge-cells/rows/add-column-at-2.json';
import * as addColumnAtThreeJson from './__fixtures__/merge-cells/rows/add-column-at-3.json';
import * as removeColumnAtZeroJson from './__fixtures__/merge-cells/rows/remove-column-at-0.json';
import * as removeColumnAtOneJson from './__fixtures__/merge-cells/rows/remove-column-at-1.json';
import * as removeColumnAtTwoJson from './__fixtures__/merge-cells/rows/remove-column-at-2.json';

// inverted
import * as addColumnAtZeroInvertedJson from './__fixtures__/merge-cells/rows/add-column-at-0-inverted.json';
import * as addColumnAtOneInvertedJson from './__fixtures__/merge-cells/rows/add-column-at-1-inverted.json';
import * as addColumnAtTwoInvertedJson from './__fixtures__/merge-cells/rows/add-column-at-2-inverted.json';
import * as addColumnAtThreeInvertedJson from './__fixtures__/merge-cells/rows/add-column-at-3-inverted.json';
import * as removeColumnAtZeroInvertedJson from './__fixtures__/merge-cells/rows/remove-column-at-0-inverted.json';
import * as removeColumnAtOneInvertedJson from './__fixtures__/merge-cells/rows/remove-column-at-1-inverted.json';
import * as removeColumnAtTwoInvertedJson from './__fixtures__/merge-cells/rows/remove-column-at-2-inverted.json';

// Possible documents
const originalDoc = doc(
  '{table}',
  table()(
    tr(
      createCellColorA(undefined, 2),
      createCellColorB(),
      createCellColorC(undefined, 3),
    ),
    tr(createCellColorB(undefined, 2)),
    tr(createCellColorA()),
  ),
);
const docAfterAddColumnAtZero = doc(
  '{table}',
  table()(
    tr(
      tdEmpty,
      createCellColorA(undefined, 2),
      createCellColorB(),
      createCellColorC(undefined, 3),
    ),
    tr(tdEmpty, createCellColorB(undefined, 2)),
    tr(tdEmpty, createCellColorA()),
  ),
);
const docAfterAddColumnAtOne = doc(
  '{table}',
  table()(
    tr(
      createCellColorA(undefined, 2),
      tdEmpty,
      createCellColorB(),
      createCellColorC(undefined, 3),
    ),
    tr(tdEmpty, createCellColorB(undefined, 2)),
    tr(createCellColorA(), tdEmpty),
  ),
);
const docAfterAddColumnAtTwo = doc(
  '{table}',
  table()(
    tr(
      createCellColorA(undefined, 2),
      createCellColorB(),
      tdEmpty,
      createCellColorC(undefined, 3),
    ),
    tr(createCellColorB(undefined, 2), tdEmpty),
    tr(createCellColorA(), tdEmpty),
  ),
);
const docAfterAddColumnAtThree = doc(
  '{table}',
  table()(
    tr(
      createCellColorA(undefined, 2),
      createCellColorB(),
      createCellColorC(undefined, 3),
      tdEmpty,
    ),
    tr(createCellColorB(undefined, 2), tdEmpty),
    tr(createCellColorA(), tdEmpty),
  ),
);
const docAfterRemoveColumnAtZero = doc(
  '{table}',
  table()(
    tr(createCellColorB(), createCellColorC(undefined, 2)),
    tr(createCellColorB(undefined, 1)),
  ),
);
const docAfterRemoveColumnAtOne = doc(
  '{table}',
  table()(
    tr(createCellColorA(undefined, 1), createCellColorC(undefined, 2)),
    tr(createCellColorA()),
  ),
);
const docAfterRemoveColumnAtTwo = doc(
  '{table}',
  table()(
    tr(createCellColorA(undefined, 2), createCellColorB()),
    tr(createCellColorB(undefined, 2)),
    tr(createCellColorA()),
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
  Table 3x3 with merge rows
  | a | b | c |
  | _ | b |   |
  | a | _ | _ |
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
        ${0}   | ${docAfterRemoveColumnAtZero}
        ${1}   | ${docAfterRemoveColumnAtOne}
        ${2}   | ${docAfterRemoveColumnAtTwo}
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
          originalDoc,
          (editorState) => editorState.tr.insertText('foo', 0),
          addColumnAtFactory('table', 3),
          doc(
            p('foo'),
            table()(
              tr(
                createCellColorA(undefined, 2),
                createCellColorB(),
                createCellColorC(undefined, 3),
                tdEmpty,
              ),
              tr(createCellColorB(undefined, 2), tdEmpty),
              tr(createCellColorA(), tdEmpty),
            ),
          ),
        ],
        [
          'add the column in the correct position after adding a column at the beginning',
          originalDoc,
          addColumnAtFactory('table', 0),
          addColumnAtFactory('table', 3),
          doc(
            table()(
              tr(
                tdEmpty,
                createCellColorA(undefined, 2),
                createCellColorB(),
                createCellColorC(undefined, 3),
                tdEmpty,
              ),
              tr(tdEmpty, createCellColorB(undefined, 2), tdEmpty),
              tr(tdEmpty, createCellColorA(), tdEmpty),
            ),
          ),
        ],
        [
          'add the column in the correct position after adding a column in the same position',
          originalDoc,
          addColumnAtFactory('table', 2),
          addColumnAtFactory('table', 2),
          doc(
            table()(
              tr(
                createCellColorA(undefined, 2),
                createCellColorB(),
                tdEmpty,
                tdEmpty,
                createCellColorC(undefined, 3),
              ),
              tr(createCellColorB(undefined, 2), tdEmpty, tdEmpty),
              tr(createCellColorA(), tdEmpty, tdEmpty),
            ),
          ),
        ],
        [
          'add the column in the correct position after removing a column a previous position',
          originalDoc,
          removeColumnAtFactory('table', 1),
          addColumnAtFactory('table', 2),
          doc(
            table()(
              tr(
                createCellColorA(undefined, 1),
                tdEmpty,
                createCellColorC(undefined, 2),
              ),
              tr(createCellColorA(), tdEmpty),
            ),
          ),
        ],
        [
          'remove the column in the correct position after removing a column in a previous position',
          originalDoc,
          removeColumnAtFactory('table', 1),
          removeColumnAtFactory('table', 2),
          doc(table()(tr(createCellColorA()), tr(createCellColorA()))),
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
        ${0}   | ${removeColumnAtZeroJson} | ${docAfterRemoveColumnAtZero}
        ${1}   | ${removeColumnAtOneJson}  | ${docAfterRemoveColumnAtOne}
        ${2}   | ${removeColumnAtTwoJson}  | ${docAfterRemoveColumnAtTwo}
      `(
        'should parse JSON and remove a column at $column column',
        ({ jsonStep, expectedDoc }) => {
          const addColumnStep = Step.fromJSON(defaultSchema, jsonStep);
          editorState = editorState.apply(editorState.tr.step(addColumnStep));

          expect(editorState.doc).toEqualDocument(expectedDoc);
        },
      );

      it.each`
        column | startDoc                      | jsonStep                          | expectedDoc
        ${0}   | ${docAfterRemoveColumnAtZero} | ${removeColumnAtZeroInvertedJson} | ${originalDoc}
        ${1}   | ${docAfterRemoveColumnAtOne}  | ${removeColumnAtOneInvertedJson}  | ${originalDoc}
        ${2}   | ${docAfterRemoveColumnAtTwo}  | ${removeColumnAtTwoInvertedJson}  | ${originalDoc}
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
          const addColumnStep = addColumnAtFactory('table', column)(
            editorState,
            refs,
          ).steps[0];

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
          const addColumnStep = removeColumnAtFactory('table', column)(
            editorState,
            refs,
          ).steps[0];

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
