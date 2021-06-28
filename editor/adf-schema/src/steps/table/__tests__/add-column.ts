import {
  DocBuilder,
  doc,
  p,
  Refs,
  table,
  td,
  tdEmpty,
  expand,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { EditorState } from 'prosemirror-state';
import { Node as ProseMirrorNode } from 'prosemirror-model';
import { Step } from 'prosemirror-transform';
import {
  addColumnAtFactory,
  applyAndInvertTransaction,
  createCellColorA,
  createCellColorB,
  createCellColorC,
  CreateTransaction,
  removeColumnAtFactory,
  setup,
  tdColorA,
  tdColorB,
  tdColorC,
  testHistory,
} from './_utils';
import { defaultSchema } from '../../../schema';
import { AddColumnStep } from '../add-column';

import * as removeLastRowJson from './__fixtures__/basic/remove-table/remove-last-row.json';
import * as removeLastRowInvertedJson from './__fixtures__/basic/remove-table/remove-last-row-inverted.json';
import * as addColumnAtZeroJson from './__fixtures__/basic/add-column-at-0.json';
import * as addColumnAtOneJson from './__fixtures__/basic/add-column-at-1.json';
import * as addColumnAtTwoJson from './__fixtures__/basic/add-column-at-2.json';
import * as addColumnAtThreeJson from './__fixtures__/basic/add-column-at-3.json';
import * as removeColumnAtZeroJson from './__fixtures__/basic/remove-column-at-0.json';
import * as removeColumnAtOneJson from './__fixtures__/basic/remove-column-at-1.json';
import * as removeColumnAtTwoJson from './__fixtures__/basic/remove-column-at-2.json';

// Possible documents
const twoBythreeTable = doc(
  '{table}',
  table()(tr(tdColorA, tdColorB, tdColorC), tr(tdColorA, tdColorB, tdColorC)),
);

const docAfterAddColumnAtThree = doc(
  table()(
    tr(tdColorA, tdColorB, tdColorC, tdEmpty),
    tr(tdColorA, tdColorB, tdColorC, tdEmpty),
  ),
);

const docAfterAddColumnAtZero = doc(
  table()(
    tr(tdEmpty, tdColorA, tdColorB, tdColorC),
    tr(tdEmpty, tdColorA, tdColorB, tdColorC),
  ),
);

const docAfterAddColumnAtOne = doc(
  table()(
    tr(tdColorA, tdEmpty, tdColorB, tdColorC),
    tr(tdColorA, tdEmpty, tdColorB, tdColorC),
  ),
);

const docAfterAddColumnAtTwo = doc(
  table()(
    tr(tdColorA, tdColorB, tdEmpty, tdColorC),
    tr(tdColorA, tdColorB, tdEmpty, tdColorC),
  ),
);

const docAfterRemoveColumnAtZero = doc(
  table()(tr(tdColorB, tdColorC), tr(tdColorB, tdColorC)),
);
const docAfterRemoveColumnAtOne = doc(
  table()(tr(tdColorA, tdColorC), tr(tdColorA, tdColorC)),
);
const docAfterRemoveColumnAtTwo = doc(
  table()(tr(tdColorA, tdColorB), tr(tdColorA, tdColorB)),
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
  table 3x1
  | a |
  | a |
  | a |
  `, () => {
    let editorState: EditorState;
    let refs: Refs;

    const threeByOne = doc(
      p(''),
      '{table}',
      table()(tr(tdColorA), tr(tdColorA), tr(tdColorA)),
    );

    beforeEach(() => {
      ({ editorState, refs } = setup(threeByOne));
    });

    it('should delete the table when I tried to remove the last column', function () {
      editorState = editorState.apply(
        removeColumnAtFactory('table', 0)(editorState, refs),
      );

      expect(editorState.doc).toEqualDocument(doc(p('')));
    });

    it('should add the table after been removed it for a remove column', () => {
      editorState = applyAndInvertTransaction(editorState.doc)(
        removeColumnAtFactory('table', 0)(editorState, refs),
        editorState,
      );
      expect(editorState.doc).toEqualDocument(threeByOne);
    });

    it('should remove the table after undoing the last column ', function () {
      const editorState = testHistory(
        threeByOne,
        addColumnAtFactory('table', 0),
        [removeColumnAtFactory('table', 1)],
      );

      expect(editorState.doc).toEqualDocument(doc(p('')));
    });

    it('should drop add column step when I remove the column', function () {
      const firstTransaction = removeColumnAtFactory('table', 0)(
        editorState,
        refs,
      );
      let addColumnStep: Step | null | undefined = addColumnAtFactory(
        'table',
        0,
      )(editorState, refs).steps[0];

      editorState = editorState.apply(firstTransaction);

      // Map the step with the transaction
      addColumnStep = addColumnStep.map(firstTransaction.mapping);

      // It should exist
      expect(addColumnStep).toBe(null);
    });

    it('should remove the column instead of table when I add a column just before', function () {
      const firstTransaction = addColumnAtFactory('table', 0)(
        editorState,
        refs,
      );
      let addColumnStep: Step | null | undefined = removeColumnAtFactory(
        'table',
        0,
      )(editorState, refs).steps[0];

      editorState = editorState.apply(firstTransaction);

      // Map the step with the transaction
      addColumnStep = addColumnStep.map(firstTransaction.mapping)!;

      editorState = editorState.apply(editorState.tr.step(addColumnStep));

      // Should keep the new created single column and remove the old one
      expect(editorState.doc).toEqualDocument(
        doc(p(''), '{table}', table()(tr(tdEmpty), tr(tdEmpty), tr(tdEmpty))),
      );
    });

    it('should parse a json that we just generate', function () {
      const firstTransaction = removeColumnAtFactory('table', 0)(
        editorState,
        refs,
      );

      // Side effect is created on apply
      editorState.apply(firstTransaction);

      const removeTableStep = firstTransaction.steps[0];

      const removeTableStepFromJson = Step.fromJSON(
        editorState.schema,
        removeTableStep.toJSON(),
      )!;

      // Should keep the new created single column and remove the old one
      expect(
        editorState.apply(editorState.tr.step(removeTableStep)).doc,
      ).toEqual(
        editorState.apply(editorState.tr.step(removeTableStepFromJson)).doc,
      );
    });

    it('should add the removing table when I received a JSON', () => {
      ({ editorState } = setup(doc(p(''))));
      const removeLastRowInverted = Step.fromJSON(
        defaultSchema,
        removeLastRowInvertedJson,
      );
      editorState = editorState.apply(
        editorState.tr.step(removeLastRowInverted),
      );

      expect(editorState.doc).toEqualDocument(threeByOne);
    });

    it('should remove the table when I received a JSON', () => {
      ({ editorState } = setup(threeByOne));
      const removeLastRowInverted = Step.fromJSON(
        defaultSchema,
        removeLastRowJson,
      );
      editorState = editorState.apply(
        editorState.tr.step(removeLastRowInverted),
      );

      expect(editorState.doc).toEqualDocument(doc(p('')));
    });
  });

  describe(`
  expand(table 2x3)
  `, () => {
    let editorState: EditorState;
    let refs: Refs;

    const expandTwoBythreeTable = doc(
      expand()(
        '{table}',
        table()(
          tr(tdColorA, tdColorB, tdColorC),
          tr(tdColorA, tdColorB, tdColorC),
        ),
      ),
    );

    const expandDocAfterAddColumnAtThree = doc(
      expand()(
        table()(
          tr(tdColorA, tdColorB, tdColorC, tdEmpty),
          tr(tdColorA, tdColorB, tdColorC, tdEmpty),
        ),
      ),
    );

    const expandDocAfterAddColumnAtZero = doc(
      expand()(
        table()(
          tr(tdEmpty, tdColorA, tdColorB, tdColorC),
          tr(tdEmpty, tdColorA, tdColorB, tdColorC),
        ),
      ),
    );

    const expandDocAfterAddColumnAtOne = doc(
      expand()(
        table()(
          tr(tdColorA, tdEmpty, tdColorB, tdColorC),
          tr(tdColorA, tdEmpty, tdColorB, tdColorC),
        ),
      ),
    );

    const expandDocAfterAddColumnAtTwo = doc(
      expand()(
        table()(
          tr(tdColorA, tdColorB, tdEmpty, tdColorC),
          tr(tdColorA, tdColorB, tdEmpty, tdColorC),
        ),
      ),
    );

    const expandDocAfterRemoveColumnAtZero = doc(
      expand()(table()(tr(tdColorB, tdColorC), tr(tdColorB, tdColorC))),
    );
    const expandDocAfterRemoveColumnAtOne = doc(
      expand()(table()(tr(tdColorA, tdColorC), tr(tdColorA, tdColorC))),
    );
    const expandDocAfterRemoveColumnAtTwo = doc(
      expand()(table()(tr(tdColorA, tdColorB), tr(tdColorA, tdColorB))),
    );

    beforeEach(() => {
      ({ editorState, refs } = setup(expandTwoBythreeTable));
    });

    describe('add a column', () => {
      it.each`
        column | expectedDoc
        ${0}   | ${expandDocAfterAddColumnAtZero}
        ${1}   | ${expandDocAfterAddColumnAtOne}
        ${2}   | ${expandDocAfterAddColumnAtTwo}
        ${3}   | ${expandDocAfterAddColumnAtThree}
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
        ${0}   | ${expandDocAfterRemoveColumnAtZero}
        ${1}   | ${expandDocAfterRemoveColumnAtOne}
        ${2}   | ${expandDocAfterRemoveColumnAtTwo}
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
  });

  describe(`
  table 2x3
  | a | b | c |
  | a | b | c |
  `, () => {
    let editorState: EditorState;
    let refs: Refs;

    beforeEach(() => {
      ({ editorState, refs } = setup(twoBythreeTable));
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
      let originalDoc: ProseMirrorNode;

      beforeEach(() => {
        ({ editorState, refs } = setup(
          doc(
            '{table}',
            table()(
              tr(
                createCellColorA(undefined, undefined, 'foo'),
                createCellColorB(undefined, undefined, 'barr'),
                createCellColorC(undefined, undefined, 'bazzz'),
              ),
              tr(
                createCellColorA(undefined, undefined, 'hello'),
                createCellColorB(undefined, undefined, 'my'),
                createCellColorC(undefined, undefined, 'very'),
              ),
              tr(
                createCellColorA(undefined, undefined, 'little'),
                createCellColorB(undefined, undefined, 'blue'),
                createCellColorC(undefined, undefined, 'earth'),
              ),
            ),
          ),
        ));
        originalDoc = editorState.doc;
      });

      it.each`
        description                                                             | setup
        ${'add column that was removed at the beginning with the same content'} | ${removeColumnAtFactory('table', 0)}
        ${'add column that was removed in the middle with the same content'}    | ${removeColumnAtFactory('table', 1)}
        ${'add column that was removed at the end with the same content'}       | ${removeColumnAtFactory('table', 2)}
        ${'remove a column that was added at the beginning'}                    | ${addColumnAtFactory('table', 0)}
        ${'remove a column that was added at the middle'}                       | ${addColumnAtFactory('table', 1)}
        ${'remove a column that was added at the almost end'}                   | ${addColumnAtFactory('table', 2)}
        ${'remove a column that was added at the end'}                          | ${addColumnAtFactory('table', 3)}
      `('should be able to $description', ({ setup }) => {
        const transaction = setup(editorState, refs);
        editorState = applyAndInvertTransaction(originalDoc)(
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
          doc('{table}', table()(tr(tdColorA, tdColorB, tdColorC))),
          (editorState) => editorState.tr.insertText('foo', 0),
          addColumnAtFactory('table', 3),
          doc(p('foo'), table()(tr(tdColorA, tdColorB, tdColorC, tdEmpty))),
        ],
        [
          'add the column in the correct position after adding a column at the beginning',
          doc('{table}', table()(tr(tdColorA, tdColorB, tdColorC))),
          addColumnAtFactory('table', 0),
          addColumnAtFactory('table', 3),
          doc(table()(tr(tdEmpty, tdColorA, tdColorB, tdColorC, tdEmpty))),
        ],
        [
          ' add the column in the correct position after removing the reference column',
          doc('{table}', table()(tr(tdColorA, tdColorB, tdColorC))),
          removeColumnAtFactory('table', 2),
          addColumnAtFactory('table', 3),
          doc(table()(tr(tdColorA, tdColorB, tdEmpty))),
        ],
        [
          'add the column in the correct position after adding a column in the same position',
          doc('{table}', table()(tr(tdColorA, tdColorB, tdColorC))),
          addColumnAtFactory('table', 2),
          addColumnAtFactory('table', 2),
          doc(table()(tr(tdColorA, tdColorB, tdEmpty, tdEmpty, tdColorC))),
        ],
        [
          'add the column in the correct position after adding text inside one column',
          doc('{table}', table()(tr(td()(p('foo{<>}')), tdColorB, tdColorC))),
          (editorState) => editorState.tr.insertText('bar'),
          addColumnAtFactory('table', 2),
          doc(table()(tr(td()(p('foobar')), tdColorB, tdEmpty, tdColorC))),
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
      it('should be able to undo the right column', function () {
        const editorState = testHistory(
          twoBythreeTable,
          addColumnAtFactory('table', 2),
          [addColumnAtFactory('table', 1), addColumnAtFactory('table', 1)],
        );

        expect(editorState.doc).toEqualDocument(
          doc(
            table()(
              tr(tdColorA, tdEmpty, tdEmpty, tdColorB, tdColorC),
              tr(tdColorA, tdEmpty, tdEmpty, tdColorB, tdColorC),
            ),
          ),
        );
      });
    });

    describe('fromJson()', () => {
      it.each`
        column | jsonStep                | expectedDoc
        ${0}   | ${addColumnAtZeroJson}  | ${docAfterAddColumnAtZero}
        ${1}   | ${addColumnAtOneJson}   | ${docAfterAddColumnAtOne}
        ${2}   | ${addColumnAtTwoJson}   | ${docAfterAddColumnAtTwo}
        ${3}   | ${addColumnAtThreeJson} | ${docAfterAddColumnAtThree}
      `(
        'should add a column at $column of the table',
        ({ jsonStep, expectedDoc }) => {
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
        'should remove a column at $column of the table',
        ({ jsonStep, expectedDoc }) => {
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
          const { editorState, refs } = setup(twoBythreeTable);
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
          const { editorState, refs } = setup(twoBythreeTable);
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
