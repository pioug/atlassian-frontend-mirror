import { PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
  DispatchAnalyticsEvent,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  doc,
  hr,
  p,
  layoutSection,
  layoutColumn,
  table,
  tr,
  th,
  td,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';

import rulePlugin from '../../../rule';
import layoutPlugin from '../../../layout';
import tablePlugin from '../../../table';
import selectionPlugin from '../../index';
import { selectionPluginKey, SelectionPluginState } from '../../types';
import {
  setNodeSelection,
  setTextSelection,
  setAllSelection,
  setCellSelection,
} from '../../../../utils/selection';

describe('selection analytics', () => {
  const createEditor = createProsemirrorEditorFactory();
  const preset = new Preset<LightEditorPlugin>()
    .add(selectionPlugin)
    .add(rulePlugin)
    .add(layoutPlugin)
    .add(tablePlugin);

  const editor = (doc: DocBuilder) =>
    createEditor<SelectionPluginState, PluginKey>({
      doc,
      preset,
      pluginKey: selectionPluginKey,
    });

  let editorView: EditorView;
  let refs: { [name: string]: number };
  let plugin: any;
  let dispatchAnalyticsEvent: DispatchAnalyticsEvent;

  beforeEach(() => {
    ({ editorView, refs, plugin, dispatchAnalyticsEvent } = editor(
      doc(
        '{pStart}',
        p('i like bilbies{<>}'),
        '{ruleStart}',
        hr(),
        '{ruleEnd}',
      ),
    ));
    (dispatchAnalyticsEvent as jest.Mock).mockClear();
  });

  it('fires analytics event on node selection', () => {
    setNodeSelection(editorView, refs.ruleStart);
    expect(dispatchAnalyticsEvent).toHaveBeenCalledWith({
      action: 'selected',
      actionSubject: 'document',
      actionSubjectId: 'node',
      eventType: 'track',
      attributes: {
        node: 'rule',
      },
    });
  });

  it('fires analytics event on all selection', () => {
    setAllSelection(editorView);
    expect(dispatchAnalyticsEvent).toHaveBeenCalledWith({
      action: 'selected',
      actionSubject: 'document',
      actionSubjectId: 'all',
      eventType: 'track',
    });
  });

  describe('range selection', () => {
    const rangeSelectionTests = (
      setRangeSelection: (from: number, to: number) => void,
    ) => {
      it('fires analytics event on range selection', () => {
        setRangeSelection(refs.pStart, refs.ruleEnd);

        expect(dispatchAnalyticsEvent).toHaveBeenCalledWith({
          action: 'selected',
          actionSubject: 'document',
          actionSubjectId: 'range',
          eventType: 'track',
          attributes: {
            from: refs.pStart,
            to: refs.ruleEnd,
            nodes: ['paragraph', 'rule'],
          },
        });
      });

      it('fires analytics event on range selection of child nodes', () => {
        ({ editorView, refs, plugin, dispatchAnalyticsEvent } = editor(
          doc(
            layoutSection(
              layoutColumn({ width: 50 })(
                p('i {selStart}like bilbies{<>}'),
                hr(),
                p('and quokkas{selEnd} too!'),
              ),
              layoutColumn({ width: 50 })(p('')),
            ),
          ),
        ));
        setRangeSelection(refs.selStart, refs.selEnd);

        expect(dispatchAnalyticsEvent).toHaveBeenCalledWith({
          action: 'selected',
          actionSubject: 'document',
          actionSubjectId: 'range',
          eventType: 'track',
          attributes: {
            from: refs.selStart,
            to: refs.selEnd,
            nodes: ['text', 'rule', 'text'],
          },
        });
      });

      it('fires analytics only sending through data on top-level nodes', () => {
        ({ editorView, refs, plugin, dispatchAnalyticsEvent } = editor(
          doc(
            p('hello'),
            '{selStart}',
            p('there'),
            layoutSection(
              layoutColumn({ width: 50 })(p('i like bilbies{<>}'), hr()),
              layoutColumn({ width: 50 })(p('')),
            ),
            layoutSection(
              layoutColumn({ width: 50 })(p('and {selEnd}quokkas too!')),
              layoutColumn({ width: 50 })(p('')),
            ),
          ),
        ));
        setRangeSelection(refs.selStart, refs.selEnd);

        expect(dispatchAnalyticsEvent).toHaveBeenCalledWith({
          action: 'selected',
          actionSubject: 'document',
          actionSubjectId: 'range',
          eventType: 'track',
          attributes: {
            from: refs.selStart,
            to: refs.selEnd,
            nodes: ['paragraph', 'layoutSection', 'text'],
          },
        });
      });
    };

    describe('via click and drag', () => {
      rangeSelectionTests((from: number, to: number) => {
        // this will be set in EditorView when a real mousedown event is fired
        (editorView as any).mouseDown = true;
        setTextSelection(editorView, from, to);
        plugin.props.handleDOMEvents!.mouseup(
          editorView,
          new MouseEvent('mouseup'),
        );
      });
    });

    describe('via shift + arrow keys/shift + click', () => {
      rangeSelectionTests((from: number, to: number) => {
        (editorView as any).shiftKey = true;
        setTextSelection(editorView, from, to);
      });
    });
  });

  describe('cell selection', () => {
    const cellSelectionTests = (
      setSelection: (from: number, to: number) => void,
    ) => {
      it('fires analytics event on cell selection', () => {
        ({ editorView, refs, plugin, dispatchAnalyticsEvent } = editor(
          doc(
            table()(
              tr(th()(p('{<>}a1')), '{cell2}', th()(p('a2'))),
              tr(td()(p('b1')), '{cell4}', td()(p('b2'))),
            ),
          ),
        ));
        (dispatchAnalyticsEvent as jest.Mock).mockClear();
        setSelection(refs.cell2, refs.cell4);

        expect(dispatchAnalyticsEvent).toHaveBeenCalledWith({
          action: 'selected',
          actionSubject: 'document',
          actionSubjectId: 'cell',
          eventType: 'track',
          attributes: {
            selectedCells: 2,
            totalCells: 4,
          },
        });
      });
    };

    describe('via click and drag', () => {
      cellSelectionTests((from: number, to: number) => {
        // this will be set in EditorView when a real mousedown event is fired
        (editorView as any).mouseDown = true;
        setCellSelection(editorView, from, to);
        plugin.props.handleDOMEvents!.mouseup(
          editorView,
          new MouseEvent('mouseup'),
        );
      });
    });

    describe('via arrow keys/clicking table controls/shift + arrow keys/shift + click', () => {
      cellSelectionTests((from: number, to: number) => {
        setCellSelection(editorView, from, to);
      });
    });
  });

  it("doesn't fire analytics for standard text selection", () => {
    setTextSelection(editorView, refs.pStart);
    expect(dispatchAnalyticsEvent).not.toHaveBeenCalled();
  });
});
