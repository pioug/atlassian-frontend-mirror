import { isNthParentOfType } from '../../../utils/commands';
import { findCutBefore } from '@atlaskit/editor-common/commands';

import {
  filterCommand as filter,
  isEmptySelectionAtStart,
} from '@atlaskit/editor-common/utils';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  p,
  table,
  tr,
  td,
  ul,
  li,
  doc,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { uuid } from '@atlaskit/adf-schema';

import type { Command } from '@atlaskit/editor-common/types';

const TABLE_LOCAL_ID = 'test-table-local-id';

describe('utils -> commands', () => {
  beforeAll(() => {
    uuid.setStatic(TABLE_LOCAL_ID);
  });

  afterAll(() => {
    uuid.setStatic(false);
  });

  const createEditor = createEditorFactory();

  describe('filter', () => {
    let cb: jest.Mock;

    beforeEach(() => {
      cb = jest.fn();
    });

    it('always calls command if empty predicate array', () => {
      const { editorView } = createEditor({});
      filter([], cb)(editorView.state, editorView.dispatch);
      expect(cb).toHaveBeenCalledTimes(1);
    });

    it('does nothing with falsey predicate as function', () => {
      const falseFilter = jest.fn();

      const { editorView } = createEditor({});
      const result = filter(falseFilter, cb)(
        editorView.state,
        editorView.dispatch,
      );

      expect(cb).not.toHaveBeenCalled();
      expect(falseFilter).toHaveBeenCalledTimes(1);
      expect(falseFilter).toHaveBeenLastCalledWith(editorView.state, undefined);
      expect(result).toBe(false);
    });

    it('does nothing with one falsey predicate in array', () => {
      const trueFilter = jest.fn();
      const falseFilter = jest.fn();

      const { editorView } = createEditor({});
      const result = filter(
        [
          () => {
            trueFilter();
            return true;
          },
          () => {
            falseFilter();
            return false;
          },
        ],
        cb,
      )(editorView.state, editorView.dispatch);

      expect(cb).not.toHaveBeenCalled();
      expect(trueFilter).toHaveBeenCalledTimes(1);
      expect(falseFilter).toHaveBeenCalledTimes(1);
      expect(result).toBe(false);
    });

    it('calls command if filter was true', () => {
      const trueFilter = jest.fn();

      const { editorView } = createEditor({});
      const result = filter(
        [
          () => {
            trueFilter();
            return true;
          },
        ],
        cb,
      )(editorView.state, editorView.dispatch);

      expect(cb).toHaveBeenCalledTimes(1);
      expect(trueFilter).toHaveBeenCalledTimes(1);
      expect(result).toBe(false);
    });

    it('passes through state, dispatch and view', () => {
      const trueFilter = jest.fn();

      const command: Command = (state, dispatch, view) => {
        cb();
        expect(state).toBe(editorView.state);
        expect(dispatch).toBe(editorView.dispatch);
        expect(view).toBe(editorView);

        return true;
      };

      const { editorView } = createEditor({});
      const result = filter(
        [
          (state, view) => {
            trueFilter(state, view);
            return true;
          },
        ],
        command,
      )(editorView.state, editorView.dispatch, editorView);

      expect(cb).toHaveBeenCalledTimes(1);
      expect(trueFilter).toHaveBeenCalledTimes(1);
      expect(trueFilter).toHaveBeenLastCalledWith(editorView.state, editorView);

      // ensure we pass back the result from the callback
      expect(result).toBe(true);
    });
  });

  describe('isNthParentOfType', () => {
    const { editorView } = createEditor({
      doc: table()(tr(td()(p('hel{<>}lo')))),
      editorProps: { allowTables: true },
    });

    it('returns true for paragraph at selection depth', () => {
      expect(isNthParentOfType('paragraph', 0)(editorView.state)).toBe(true);
    });

    it('returns false for some other node at selection depth', () => {
      expect(isNthParentOfType('h1', 0)(editorView.state)).toBe(false);
    });

    it('returns true for td at parent from selection', () => {
      expect(isNthParentOfType('tableCell', 1)(editorView.state)).toBe(true);
    });

    it('returns true for tr at second level from selection', () => {
      expect(isNthParentOfType('tableRow', 2)(editorView.state)).toBe(true);
    });

    it('returns true for table at third level from selection', () => {
      expect(isNthParentOfType('table', 3)(editorView.state)).toBe(true);
    });

    it('returns true for doc at fourth level from selection', () => {
      expect(isNthParentOfType('doc', 4)(editorView.state)).toBe(true);
    });

    it('returns false for nodes beyond fourth level from selection', () => {
      expect(isNthParentOfType('doc', 5)(editorView.state)).toBe(false);
    });
  });

  describe('isEmptySelectionAtStart', () => {
    describe('paragraph at top level', () => {
      it('returns true with selection at start', () => {
        const { editorView } = createEditor({
          doc: doc(p('{<>}hello')),
        });

        expect(isEmptySelectionAtStart(editorView.state)).toBe(true);
      });

      it('returns false with selection at end', () => {
        const { editorView } = createEditor({
          doc: doc(p('hello{<>}')),
        });

        expect(isEmptySelectionAtStart(editorView.state)).toBe(false);
      });

      it('returns false with selection at middle', () => {
        const { editorView } = createEditor({
          doc: doc(p('he{<>}llo')),
        });

        expect(isEmptySelectionAtStart(editorView.state)).toBe(false);
      });

      it('returns true for start of second paragraph at start', () => {
        const { editorView } = createEditor({
          doc: doc(p('hello'), p('{<>}world')),
        });

        expect(isEmptySelectionAtStart(editorView.state)).toBe(true);
      });

      it('returns false for start of second paragraph at end', () => {
        const { editorView } = createEditor({
          doc: doc(p('hello'), p('world{<>}')),
        });

        expect(isEmptySelectionAtStart(editorView.state)).toBe(false);
      });
    });

    describe('nested paragraph inside table', () => {
      it('returns true with selection at start', () => {
        const { editorView } = createEditor({
          doc: doc(table()(tr(td()(p('{<>}hello'))))),
          editorProps: { allowTables: true },
        });

        expect(isEmptySelectionAtStart(editorView.state)).toBe(true);
      });

      it('returns false with selection at end', () => {
        const { editorView } = createEditor({
          doc: doc(table()(tr(td()(p('hello{<>}'))))),
          editorProps: { allowTables: true },
        });

        expect(isEmptySelectionAtStart(editorView.state)).toBe(false);
      });

      it('returns false with selection at middle', () => {
        const { editorView } = createEditor({
          doc: doc(table()(tr(td()(p('he{<>}llo'))))),
          editorProps: { allowTables: true },
        });

        expect(isEmptySelectionAtStart(editorView.state)).toBe(false);
      });
    });
  });

  describe('findCutBefore', () => {
    it('finds a split in a balanced tree', () => {
      const { editorView } = createEditor({
        doc: doc(ul(li(p('first')), li(p('{<>}second')))),
      });

      const { $from } = editorView.state.selection;
      const { listItem } = editorView.state.schema.nodes;

      const $cut = findCutBefore($from);
      expect($cut).not.toBeNull();

      expect($cut!.nodeBefore!.type).toBe(listItem);
      expect($cut!.nodeAfter!.type).toBe(listItem);

      expect($cut!.nodeBefore!.firstChild!.textContent).toBe('first');
      expect($cut!.nodeAfter!.firstChild!.textContent).toBe('second');
    });

    it('finds a split in an unbalanced tree above', () => {
      const { editorView } = createEditor({
        doc: doc(ul(li(p('first'), ul(li(p('nested')))), li(p('{<>}second')))),
      });

      const { $from } = editorView.state.selection;
      const { listItem } = editorView.state.schema.nodes;

      const $cut = findCutBefore($from);
      expect($cut).not.toBeNull();

      expect($cut!.nodeBefore!.type).toBe(listItem);
      expect($cut!.nodeAfter!.type).toBe(listItem);

      expect($cut!.nodeBefore!.firstChild!.textContent).toBe('first');
      expect($cut!.nodeAfter!.firstChild!.textContent).toBe('second');
    });

    it('finds a split in an unbalanced tree below', () => {
      const { editorView, refs } = createEditor({
        doc: doc(
          ul(
            li(p('first'), ul(li(p('nested')))),
            li(p('second'), p('nested'), ul(li(p('{<>}child')))),
          ),
        ),
      });

      const { $from } = editorView.state.selection;

      const $cut = findCutBefore($from);
      expect($cut).not.toBeNull();

      expect($cut!.nodeBefore).toBeDefined();
      expect($cut!.nodeAfter).toBeDefined();
      expect($cut!.pos).toBe(refs['<>'] - 3);
    });

    it('does not search across isolating boundaries', () => {
      const { editorView } = createEditor({
        doc: doc(table()(tr(td()(p('{<>}hey'))))),
        editorProps: { allowTables: true },
      });

      const { $from } = editorView.state.selection;

      const $cut = findCutBefore($from);
      expect($cut).toBeNull();
    });
  });
});
