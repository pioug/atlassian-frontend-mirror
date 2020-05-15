import { NodeSelection, TextSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import {
  doc,
  p as paragraph,
  date,
} from '@atlaskit/editor-test-helpers/schema-builder';
import { insertText } from '@atlaskit/editor-test-helpers/transactions';
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
import { pluginKey } from '../../pm-plugins/plugin-key';
import featureFlagsContextPlugin from '../../../feature-flags-context';
import { parseDateType } from '../../utils/formatParse';

describe('date plugin', () => {
  const createEditor = createProsemirrorEditorFactory();
  let createAnalyticsEvent: CreateUIAnalyticsEvent;
  let editorView: EditorView;

  const editor = (doc: any) => {
    createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));
    return createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add(datePlugin)
        .add([analyticsPlugin, { createAnalyticsEvent }])
        .add(typeAheadPlugin)
        .add(quickInsertPlugin)
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

        const pluginState = pluginKey.getState(view.state);
        expect(pluginState.showDatePickerAt).toEqual(showDatePickerAt);
        expect(result).toBe(true);
      });
    });

    describe('insertDate', () => {
      it('should insert date node to the document', () => {
        const { editorView: view } = editor(doc(paragraph('hello{<>}')));
        insertDate()(view.state, view.dispatch);
        expect(
          view.state.doc.nodeAt(view.state.selection.$from.pos)!.type.name,
        ).toEqual(view.state.schema.nodes.date.name);
        const pluginState = pluginKey.getState(view.state);
        expect(pluginState.showDatePickerAt).toEqual(null);
      });

      it('should insert UTC timestamp', () => {
        const { editorView: view } = editor(doc(paragraph('hello{<>}')));
        insertDate({ year: 2018, month: 5, day: 1 })(view.state, view.dispatch);
        const node = view.state.doc.nodeAt(view.state.selection.$from.pos);
        expect(node!.type.name).toEqual(view.state.schema.nodes.date.name);
        expect(node!.attrs.timestamp).toEqual(Date.UTC(2018, 4, 1).toString());
      });

      it('should keep the same "showDatePickerAt" in collab mode', () => {
        const { editorView: view } = editor(doc(paragraph('world{<>}')));
        insertDate()(view.state, view.dispatch);
        openDatePicker()(view.state, view.dispatch);

        const documentChangeTr = view.state.tr.insertText('hello ', 1);
        // Don't use dispatch to mimic collab provider
        view.updateState(view.state.apply(documentChangeTr));

        const pluginState = pluginKey.getState(view.state);
        expect(pluginState.showDatePickerAt).toEqual(12);
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
    });

    describe('openDatePicker', () => {
      it('should set "showDatePickerAt" prop in plugin state to a DOM node and select the node', () => {
        const { editorView: view } = editor(
          doc(paragraph('hello{<>}', date(attrs))),
        );
        openDatePicker()(view.state, view.dispatch);
        const pluginState = pluginKey.getState(view.state);
        expect(pluginState.showDatePickerAt).toBeTruthy();
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
        const pluginState = pluginKey.getState(view.state);
        expect(pluginState.showDatePickerAt).toBeTruthy();
        expect(view.state.selection instanceof NodeSelection).toEqual(true);
      });
    });

    describe('closeDatePicker', () => {
      it('should set "showDatePickerAt" prop to falsy and move selection to after the node', () => {
        const { editorView: view } = editor(
          doc(paragraph('hello{<>}', date(attrs))),
        );
        openDatePicker()(view.state, view.dispatch);
        closeDatePicker()(view.state, view.dispatch);
        const newPluginState = pluginKey.getState(view.state);
        expect(newPluginState.showDatePickerAt).toBeFalsy();
        expect(view.state.selection instanceof NodeSelection).toEqual(false);
        expect(view.state.selection.from).toEqual(7);
      });

      it('should fire analytics event when closing datepicker', () => {
        const { editorView: view } = editor(
          doc(paragraph('hello{<>}', date(attrs))),
        );
        const validDate = parseDateType('3/25/2020', 'en-US');
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
        view.dispatch(
          view.state.tr.setSelection(
            TextSelection.create(view.state.doc, refs.textStart),
          ),
        );
        const pluginState = pluginKey.getState(view.state);
        expect(pluginState.showDatePickerAt).toBeNull();
      });
    });
  });

  describe('quick insert', () => {
    let _UTC: (year: number, month: number) => number;

    beforeEach(() => {
      _UTC = Date.UTC;
      Date.UTC = jest.fn(() => +timestamp);
      ({ editorView } = editor(doc(paragraph('{<>}'))));
      insertText(editorView, `/date`);
      sendKeyToPm(editorView, 'Enter');
    });

    afterEach(() => {
      Date.UTC = _UTC;
    });

    it('should insert date', () => {
      expect(editorView.state.doc).toEqualDocument(
        doc(paragraph(date(attrs), ' ')),
      );
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
