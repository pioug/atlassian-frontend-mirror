import { NodeSelection, TextSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import {
  doc,
  p as paragraph,
  date,
  code_block,
  table,
  tr,
  td,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import {
  Preset,
  createProsemirrorEditorFactory,
  LightEditorPlugin,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import {
  setDatePickerAt,
  insertDate,
  openDatePicker,
  closeDatePicker,
  closeDatePickerWithAnalytics,
} from '../../actions';

// Editor plugins
import analyticsPlugin, { INPUT_METHOD } from '../../../analytics';
import datePlugin from '../../index';
import quickInsertPlugin from '../../../quick-insert';
import typeAheadPlugin from '../../../type-ahead';
import codeBlockPlugin from '../../../code-block';
import tablePlugin from '../../../table';
import { pluginKey } from '../../pm-plugins/plugin-key';
import featureFlagsContextPlugin from '../../../feature-flags-context';
import { parseDateType } from '../../utils/formatParse';
import { DatePluginState } from '../../pm-plugins/types';
import { DateType } from '../../types';

describe('date plugin', () => {
  const createEditor = createProsemirrorEditorFactory();
  let createAnalyticsEvent: CreateUIAnalyticsEvent;

  const editor = (doc: DocBuilder) => {
    createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));
    return createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add(datePlugin)
        .add([analyticsPlugin, { createAnalyticsEvent }])
        .add(typeAheadPlugin)
        .add(quickInsertPlugin)
        .add(codeBlockPlugin)
        .add(tablePlugin)
        .add([
          featureFlagsContextPlugin,
          { keyboardAccessibleDatepicker: true },
        ]),
    });
  };

  const timestamp = '1515639075805';
  const attrs = { timestamp };

  describe('actions', () => {
    describe('setDatePickerAt', () => {
      it('should set "showDatePickerAt" prop in plugin state to a DOM node', () => {
        const { editorView: view } = editor(
          doc(paragraph('hello', date(attrs))),
        );

        const showDatePickerAt = view.state.selection.$from.pos;
        const result = setDatePickerAt(showDatePickerAt)(
          view.state,
          view.dispatch,
        );

        const pluginState: DatePluginState = pluginKey.getState(view.state);
        expect(pluginState.showDatePickerAt).toEqual(showDatePickerAt);
        expect(result).toBe(true);
      });
    });

    describe('parseDateType', () => {
      it('should parse valid date in en-US', () => {
        const output = parseDateType('1/15/2019', 'en-US');
        const expectedDateType: DateType = {
          day: 15,
          month: 1,
          year: 2019,
        };
        expect(output).toStrictEqual(expectedDateType);
      });
      it('should not parse date with year > 9999', () => {
        const output = parseDateType('1/15/10000', 'en-US');
        expect(output).toStrictEqual(null);
      });
      it('should not parse date with year < 1000, 999', () => {
        const output = parseDateType('1/15/999', 'en-US');
        expect(output).toStrictEqual(null);
      });
      it(`should return null when it can't parse a date`, () => {
        const output = parseDateType('notadate', 'en-US');
        expect(output).toStrictEqual(null);
      });
    });

    describe('insertDate', () => {
      it('should insert date node to the document', () => {
        const { editorView: view } = editor(doc(paragraph('hello{<>}')));
        insertDate()(view.state, view.dispatch);
        expect(
          view.state.doc.nodeAt(view.state.selection.$from.pos)!.type.name,
        ).toEqual(view.state.schema.nodes.date.name);
        const pluginState: DatePluginState = pluginKey.getState(view.state);
        expect(pluginState.showDatePickerAt).toEqual(6);
        expect(pluginState.isNew).toEqual(true);
      });

      describe('if inserted in codeBlock', () => {
        it('should insert date outside of codeBlock', () => {
          const { editorView: view } = editor(
            doc(code_block()('I am{<>} codeblock')),
          );
          const expected = doc(
            code_block()('I am codeblock'),
            paragraph('', date({ timestamp: '1599091200000' }), ' '),
          );
          insertDate({ year: 2020, month: 9, day: 3 })(
            view.state,
            view.dispatch,
          );
          expect(view.state.tr.doc).toEqualDocument(expected);
        });
        it('should insert date outside of codeBlock with range selection', () => {
          const { editorView: view } = editor(
            doc(code_block()('I {<}am{>} codeblock'), paragraph('hello')),
          );
          const expected = doc(
            code_block()('I am codeblock'),
            paragraph('', date({ timestamp: '1599091200000' }), ' '),
            paragraph('hello'),
          );
          insertDate({ year: 2020, month: 9, day: 3 })(
            view.state,
            view.dispatch,
          );
          expect(view.state.tr.doc).toEqualDocument(expected);
        });
        it('should insert date outside of codeBlock with range selection ending outside', () => {
          const { editorView: view } = editor(
            doc(code_block()('I {<}am codeblock'), paragraph('he{>}llo')),
          );
          const expected = doc(
            code_block()('I am codeblock'),
            paragraph('', date({ timestamp: '1599091200000' }), ' '),
            paragraph('hello'),
          );
          insertDate({ year: 2020, month: 9, day: 3 })(
            view.state,
            view.dispatch,
          );
          expect(view.state.tr.doc).toEqualDocument(expected);
        });
        it('should insert date in between codeBlock and other block node', () => {
          const { editorView: view } = editor(
            doc(code_block()('I am{<>} codeblock'), paragraph('hello')),
          );
          const expected = doc(
            code_block()('I am codeblock'),
            paragraph('', date({ timestamp: '1599091200000' }), ' '),
            paragraph('hello'),
          );
          insertDate({ year: 2020, month: 9, day: 3 })(
            view.state,
            view.dispatch,
          );
          expect(view.state.tr.doc).toEqualDocument(expected);
        });
        it('should insert date outside of codeblock inside same table cell', () => {
          const TABLE_LOCAL_ID = 'test-table-local-id';
          const { editorView: view } = editor(
            doc(
              table({ localId: TABLE_LOCAL_ID })(
                tr(td({})(code_block()('I am{<>} codeblock'))),
              ),
            ),
          );

          const expected = doc(
            table({ localId: TABLE_LOCAL_ID })(
              tr(
                td()(
                  code_block()('I am codeblock'),
                  paragraph('', date({ timestamp: '1599091200000' }), ' '),
                ),
              ),
            ),
          );
          insertDate({ year: 2020, month: 9, day: 3 })(
            view.state,
            view.dispatch,
          );
          expect(view.state.tr.doc).toEqualDocument(expected);
        });
      });

      it('should set isNew to false if date node already exists', () => {
        const { editorView: view } = editor(
          doc(paragraph('hello{<>}', date(attrs))),
        );
        openDatePicker()(view.state, view.dispatch);

        // Check node exists before updating
        const beforeInsertPluginState: DatePluginState = pluginKey.getState(
          view.state,
        );
        expect(beforeInsertPluginState.showDatePickerAt).toBeTruthy;

        // Update date
        const dateObj = {
          year: 2020,
          month: 4,
          day: 15,
        };
        // Simulate clicking a day in the calendar (note date already exists)
        insertDate(dateObj)(view.state, view.dispatch);

        const newPluginState: DatePluginState = pluginKey.getState(view.state);

        expect(newPluginState.showDatePickerAt).toBe(null);
        expect(newPluginState.isNew).toBe(false);
        expect(view.state.selection instanceof NodeSelection).toEqual(false);
      });

      it('should insert UTC timestamp', () => {
        const { editorView: view } = editor(doc(paragraph('hello{<>}')));
        insertDate({ year: 2018, month: 5, day: 1 })(view.state, view.dispatch);
        const node = view.state.doc.nodeAt(view.state.selection.$from.pos);
        expect(node!.type.name).toEqual(view.state.schema.nodes.date.name);
        expect(node!.attrs.timestamp).toEqual(Date.UTC(2018, 4, 1).toString());
      });

      it('should keep the same "showDatePickerAt" in collab mode', () => {
        const { editorView: view, refs } = editor(
          doc(paragraph('{insertPos}world{<>}')),
        );
        insertDate()(view.state, view.dispatch);
        openDatePicker()(view.state, view.dispatch);

        const documentChangeTr = view.state.tr.insertText(
          'hello ',
          refs.insertPos,
        );
        const mappedPos = documentChangeTr.mapping.map(refs['<>']);
        documentChangeTr.setSelection(
          NodeSelection.create(documentChangeTr.doc, mappedPos),
        );
        // Don't use dispatch to mimic collab provider
        view.updateState(view.state.apply(documentChangeTr));

        const pluginState: DatePluginState = pluginKey.getState(view.state);
        expect(pluginState.showDatePickerAt).toEqual(mappedPos);
      });

      it('should fire analytics event when inserting date node', () => {
        const { editorView: view } = editor(doc(paragraph('{<>}')));
        insertDate(undefined, INPUT_METHOD.TOOLBAR)(view.state, view.dispatch);
        expect(createAnalyticsEvent).toBeCalledWith({
          action: 'inserted',
          actionSubject: 'document',
          actionSubjectId: 'date',
          eventType: 'track',
          attributes: expect.objectContaining({ inputMethod: 'toolbar' }),
        });
      });

      it('should fire analytics event when committing a date via datepicker', () => {
        const { editorView: view } = editor(
          doc(paragraph('{<>}', date(attrs))),
        );

        const validDate = parseDateType('3/25/2020', 'en-US');

        // Date shouldn't be invalid, but in case
        expect(validDate === null).toBe(false);
        if (validDate === null) {
          return;
        }

        insertDate(
          validDate,
          undefined,
          INPUT_METHOD.PICKER,
        )(view.state, view.dispatch);
        expect(createAnalyticsEvent).toBeCalledWith({
          eventType: 'track',
          action: 'committed',
          actionSubject: 'date',
          attributes: expect.objectContaining({
            commitMethod: 'picker',
            isValid: true,
            isToday: false,
          }),
        });

        const invalidDate = parseDateType('invalid-date', 'en-US');
        // Date should be unable to parse (null)
        expect(invalidDate === null).toBe(true);
        if (invalidDate === null) {
          return;
        }
        insertDate(
          invalidDate,
          undefined,
          INPUT_METHOD.PICKER,
        )(view.state, view.dispatch);
        expect(createAnalyticsEvent).toBeCalledWith({
          eventType: 'track',
          action: 'committed',
          actionSubject: 'date',
          attributes: expect.objectContaining({
            commitMethod: 'picker',
            isValid: false,
            isToday: false,
          }),
        });
      });

      it('should fire analytics event when committing a date via keyboard', () => {
        const { editorView: view } = editor(
          doc(paragraph('{<>}', date(attrs))),
        );

        const validDate = parseDateType('3/25/2020', 'en-US');
        // Date shouldn't be invalid, but in case
        expect(validDate === null).toBe(false);
        if (validDate === null) {
          return;
        }

        insertDate(
          validDate,
          undefined,
          INPUT_METHOD.KEYBOARD,
        )(view.state, view.dispatch);
        expect(createAnalyticsEvent).toBeCalledWith({
          eventType: 'track',
          action: 'committed',
          actionSubject: 'date',
          attributes: expect.objectContaining({
            commitMethod: 'keyboard',
            isValid: true,
            isToday: false,
          }),
        });

        const invalidDate = parseDateType('invalid-date', 'en-US');
        // Date should be unable to parse (null)
        expect(invalidDate === null).toBe(true);
        if (invalidDate === null) {
          return;
        }
        insertDate(
          invalidDate,
          undefined,
          INPUT_METHOD.KEYBOARD,
        )(view.state, view.dispatch);
        expect(createAnalyticsEvent).toBeCalledWith({
          eventType: 'track',
          action: 'committed',
          actionSubject: 'date',
          attributes: expect.objectContaining({
            commitMethod: 'keyboard',
            isValid: false,
            isToday: false,
          }),
        });
      });

      it('should keep the selection when enterPressed is false', () => {
        const { editorView: view } = editor(
          doc(paragraph('{<>}', date(attrs))),
        );

        openDatePicker()(view.state, view.dispatch);
        insertDate(
          { year: 2021, month: 9, day: 27 },
          undefined,
          undefined,
          false,
        )(view.state, view.dispatch);

        const pluginState = pluginKey.getState(view.state);
        expect(pluginState.showDatePickerAt).toBeTruthy();
        expect(pluginState.isNew).toBe(false);
        expect(view.state.selection instanceof NodeSelection).toEqual(true);
      });

      it('should move the selection enterPressed is true', () => {
        const { editorView: view } = editor(
          doc(paragraph('{<>}', date(attrs), 'asfdasd')),
        );

        openDatePicker()(view.state, view.dispatch);
        insertDate(
          { year: 2021, month: 9, day: 27 },
          undefined,
          undefined,
          true,
        )(view.state, view.dispatch);

        const pluginState = pluginKey.getState(view.state);
        expect(pluginState.showDatePickerAt).toBeFalsy();
        expect(pluginState.isNew).toBe(false);
        expect(view.state.selection instanceof NodeSelection).toEqual(false);
      });
    });

    describe('openDatePicker', () => {
      it('should set "showDatePickerAt" prop in plugin state to a DOM node and select the node', () => {
        const { editorView: view } = editor(
          doc(paragraph('hello{<>}', date(attrs))),
        );
        openDatePicker()(view.state, view.dispatch);
        const pluginState: DatePluginState = pluginKey.getState(view.state);
        expect(pluginState.showDatePickerAt).toBeTruthy();
        expect(view.state.selection instanceof NodeSelection).toEqual(true);
      });

      it('should leave isNew as false if it was already false', () => {
        const { editorView: view } = editor(
          doc(paragraph('hello{<>}', date(attrs))),
        );
        openDatePicker()(view.state, view.dispatch);
        const pluginState: DatePluginState = pluginKey.getState(view.state);
        expect(pluginState.showDatePickerAt).toBeTruthy();
        expect(pluginState.isNew).toBe(false);
        expect(view.state.selection instanceof NodeSelection).toEqual(true);
      });

      it('should leave isNew as true if it was already true', () => {
        const { editorView: view } = editor(doc(paragraph('hello{<>}')));
        // Insert date
        insertDate()(view.state, view.dispatch);
        expect(
          view.state.doc.nodeAt(view.state.selection.$from.pos)!.type.name,
        ).toEqual(view.state.schema.nodes.date.name);
        const initialPluginState: DatePluginState = pluginKey.getState(
          view.state,
        );
        expect(initialPluginState.showDatePickerAt).toEqual(6);
        expect(initialPluginState.isNew).toEqual(true);
        expect(view.state.selection instanceof NodeSelection).toEqual(true);
      });

      it('should open date picker on enter when date node is selected', () => {
        const { editorView: view, sel } = editor(
          doc(paragraph('hello{<>}', date(attrs))),
        );
        const tr = view.state.tr;
        tr.setSelection(NodeSelection.create(tr.doc, sel));
        view.dispatch(tr);
        sendKeyToPm(view, 'Enter');
        const pluginState: DatePluginState = pluginKey.getState(view.state);
        expect(pluginState.showDatePickerAt).toBeTruthy();
        expect(view.state.selection instanceof NodeSelection).toEqual(true);
      });
    });

    describe('closeDatePicker', () => {
      it('should set "showDatePickerAt" prop to null and move selection to after the node', () => {
        const { editorView: view } = editor(
          doc(paragraph('hello{<>}', date(attrs))),
        );
        openDatePicker()(view.state, view.dispatch);
        closeDatePicker()(view.state, view.dispatch);
        const newPluginState: DatePluginState = pluginKey.getState(view.state);
        expect(newPluginState.showDatePickerAt).toBe(null);
        expect(newPluginState.isNew).toBe(false);
        expect(view.state.selection instanceof NodeSelection).toEqual(false);
        expect(view.state.selection.from).toEqual(7);
      });

      it('should set "isNew" in state to false after closing date picker', () => {
        const { editorView: view } = editor(doc(paragraph('hello{<>}')));
        // Insert date
        insertDate()(view.state, view.dispatch);
        openDatePicker()(view.state, view.dispatch);

        // isNew should be true after opening
        const initialPluginState: DatePluginState = pluginKey.getState(
          view.state,
        );
        expect(initialPluginState.isNew).toEqual(true);

        closeDatePicker()(view.state, view.dispatch);
        const newPluginState: DatePluginState = pluginKey.getState(view.state);
        expect(newPluginState.isNew).toBe(false);
      });

      it('should fire analytics event when closing datepicker', () => {
        const { editorView: view } = editor(
          doc(paragraph('hello{<>}', date(attrs))),
        );
        const validDate = parseDateType('3/25/2020', 'en-US');
        // Date shouldn't be invalid, but in case
        expect(validDate === null).toBe(false);
        if (validDate === null) {
          return;
        }
        // need to have the datepicker open first, otherwise withAnalytics
        // never gets called because closeDatePicker returns false
        openDatePicker()(view.state, view.dispatch);
        closeDatePickerWithAnalytics({ date: validDate })(
          view.state,
          view.dispatch,
        );
        expect(createAnalyticsEvent).toBeCalledWith({
          eventType: 'track',
          action: 'committed',
          actionSubject: 'date',
          attributes: expect.objectContaining({
            commitMethod: 'blur',
            isValid: true,
            isToday: false,
          }),
        });
      });
    });
  });

  describe('utils', () => {
    describe('onSelectionChanged', () => {
      it('should not show date picker when selection is not on a date node', () => {
        const { editorView: view, refs } = editor(
          doc(paragraph('{textStart}hello', '{<node>}', date(attrs))),
        );

        const initialPluginState: DatePluginState = pluginKey.getState(
          view.state,
        );
        expect(initialPluginState.isNew).toBe(false);

        view.dispatch(
          view.state.tr.setSelection(
            TextSelection.create(view.state.doc, refs.textStart),
          ),
        );
        const pluginState: DatePluginState = pluginKey.getState(view.state);
        expect(pluginState.showDatePickerAt).toBeNull();
        expect(pluginState.isNew).toBe(false);
      });

      it('should set isNew in plugin state to false when changing selection after inserting a date', () => {
        const { editorView: view, refs } = editor(
          doc(paragraph(' {insertPos}{<>} {newSelectPos}')),
        );
        insertDate()(view.state, view.dispatch);

        const initialPluginState: DatePluginState = pluginKey.getState(
          view.state,
        );
        expect(initialPluginState.showDatePickerAt).toBeTruthy();
        expect(initialPluginState.isNew).toBe(true);

        view.dispatch(
          view.state.tr.setSelection(
            TextSelection.create(view.state.doc, refs.newSelectPos),
          ),
        );
        const pluginState: DatePluginState = pluginKey.getState(view.state);
        expect(pluginState.showDatePickerAt).toBeNull();
        expect(pluginState.isNew).toBe(false);
      });

      it('should set isNew to be false when swapping date selections', () => {
        const { editorView: view, refs } = editor(
          doc(
            paragraph(
              '{originalDateNode}{<node>}',
              date(attrs),
              ' hello {insertPoint}{<>}',
            ),
          ),
        );
        insertDate()(view.state, view.dispatch);

        const initialPluginState: DatePluginState = pluginKey.getState(
          view.state,
        );
        expect(initialPluginState.showDatePickerAt).toBe(refs.insertPoint);
        expect(initialPluginState.isNew).toBe(true);

        view.dispatch(
          view.state.tr.setSelection(
            NodeSelection.create(view.state.doc, refs.originalDateNode),
          ),
        );
        openDatePicker()(view.state, view.dispatch);
        const pluginState: DatePluginState = pluginKey.getState(view.state);
        expect(pluginState.showDatePickerAt).toBe(refs.originalDateNode);
        expect(pluginState.isNew).toBe(false);
      });
    });
  });

  describe('quick insert', () => {
    let _UTC: (year: number, month: number) => number;
    let editorView: EditorView;

    beforeEach(async () => {
      _UTC = Date.UTC;
      Date.UTC = jest.fn(() => +timestamp);
      const { editorView: _editorView, typeAheadTool } = editor(
        doc(paragraph('{<>}')),
      );

      editorView = _editorView;
      await typeAheadTool.searchQuickInsert('date')?.insert({ index: 0 });
    });

    afterEach(() => {
      Date.UTC = _UTC;
    });

    it('should insert date', () => {
      expect(editorView.state.doc).toEqualDocument(
        doc(paragraph(date(attrs), ' ')),
      );
      const pluginState: DatePluginState = pluginKey.getState(editorView.state);
      expect(pluginState.showDatePickerAt).toBeTruthy();
      expect(pluginState.isNew).toBe(true);
    });

    it('should fire analytics event when inserting date node via quickInsert', () => {
      expect(createAnalyticsEvent).toBeCalledWith({
        action: 'inserted',
        actionSubject: 'document',
        actionSubjectId: 'date',
        eventType: 'track',
        attributes: expect.objectContaining({ inputMethod: 'quickInsert' }),
      });
    });
  });
});
