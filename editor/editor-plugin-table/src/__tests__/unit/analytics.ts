import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type { DocBuilder } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import type { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import { selectionPlugin } from '@atlaskit/editor-plugin-selection';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import type { Rect } from '@atlaskit/editor-tables/table-map';
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  p,
  table,
  td,
  tdCursor,
  tdEmpty,
  thEmpty,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import { B50 } from '@atlaskit/theme/colors';

import tablePlugin from '../../plugins/table-plugin';
import {
  deleteColumnsWithAnalytics,
  deleteRowsWithAnalytics,
  deleteTableIfSelectedWithAnalytics,
  deleteTableWithAnalytics,
  emptyMultipleCellsWithAnalytics,
  insertColumnWithAnalytics,
  insertRowWithAnalytics,
  mergeCellsWithAnalytics,
  setColorWithAnalytics,
  splitCellWithAnalytics,
  toggleHeaderColumnWithAnalytics,
  toggleHeaderRowWithAnalytics,
  toggleNumberColumnWithAnalytics,
  toggleTableLayoutWithAnalytics,
} from '../../plugins/table/commands-with-analytics';
import { handleCut } from '../../plugins/table/event-handlers';
import { pluginKey } from '../../plugins/table/pm-plugins/plugin-key';
import { replaceSelectedTable } from '../../plugins/table/transforms';
import type { PluginConfig } from '../../plugins/table/types';

const defaultTableDoc = doc(
  table()(
    tr(thEmpty, thEmpty, thEmpty),
    tr(tdEmpty, tdEmpty, tdEmpty),
    tr(tdEmpty, tdEmpty, tdCursor),
  ),
);

const secondRow: Rect = { left: 0, top: 1, bottom: 2, right: 3 };
const secondColumn: Rect = { left: 1, top: 0, bottom: 3, right: 2 };

// We don't need to test if the analytics implementation works (tested elsewhere)
// We just want to know if the action is called.
const mockAttachPayload = jest.fn();
const analyticsPluginFake = () => ({
  name: 'analytics',
  actions: {
    attachAnalyticsEvent: mockAttachPayload.mockImplementation(() => () => {}),
  },
});

describe('Table analytic events', () => {
  let editorAnalyticsAPIFake: EditorAnalyticsAPI;
  const analyticFireMock = jest.fn().mockReturnValue(jest.fn());

  beforeEach(() => {
    editorAnalyticsAPIFake = {
      attachAnalyticsEvent: analyticFireMock,
    };
  });

  const createEditor = createProsemirrorEditorFactory();

  const editor = (doc: DocBuilder) => {
    const tableOptions = {
      allowNumberColumn: true,
      allowHeaderRow: true,
      allowHeaderColumn: true,
      permittedLayouts: 'all',
    } as PluginConfig;

    const _editor = createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add([featureFlagsPlugin, {}])
        .add([
          analyticsPluginFake as unknown as typeof analyticsPlugin,
          { createAnalyticsEvent: jest.fn() },
        ])
        .add(contentInsertionPlugin)
        .add(widthPlugin)
        .add(guidelinePlugin)
        .add(selectionPlugin)
        .add([tablePlugin, { tableOptions }]),
      pluginKey,
    });

    return _editor;
  };

  describe('table deleted', () => {
    beforeEach(() => {
      const { editorView } = editor(defaultTableDoc);
      deleteTableWithAnalytics(editorAnalyticsAPIFake)(
        editorView.state,
        editorView.dispatch,
      );
    });

    it('should fire v3 analytics', () => {
      expect(analyticFireMock).toHaveBeenCalledWith({
        action: 'deleted',
        actionSubject: 'table',
        attributes: expect.objectContaining({
          inputMethod: 'floatingToolbar',
          totalRowCount: 3,
          totalColumnCount: 3,
        }),
        eventType: 'track',
      });
    });
  });

  describe('table deleted if selected', () => {
    beforeEach(() => {
      const { editorView } = editor(
        doc(
          table()(
            tr(td()(p('{<cell}1')), td()(p('2'))),
            tr(td()(p('3')), td()(p('4{cell>}'))),
          ),
        ),
      );
      deleteTableIfSelectedWithAnalytics(editorAnalyticsAPIFake)(
        INPUT_METHOD.KEYBOARD,
      )(editorView.state, editorView.dispatch);
    });

    it('should fire v3 analytics', () => {
      expect(analyticFireMock).toHaveBeenCalledWith({
        action: 'deleted',
        actionSubject: 'table',
        attributes: expect.objectContaining({
          inputMethod: 'keyboard',
          totalRowCount: 2,
          totalColumnCount: 2,
        }),
        eventType: 'track',
      });
    });
  });

  describe('table cleared', () => {
    describe('context menu', () => {
      beforeEach(() => {
        const { editorView } = editor(
          doc(
            table()(
              tr(thEmpty, td()(p('{<cell}Hello')), thEmpty),
              tr(td()(p('Hello')), tdEmpty, tdEmpty),
              tr(tdEmpty, td()(p('{cell>}')), tdEmpty),
            ),
          ),
        );

        emptyMultipleCellsWithAnalytics(editorAnalyticsAPIFake)(
          INPUT_METHOD.CONTEXT_MENU,
        )(editorView.state, editorView.dispatch);
      });

      it('should fire v3 analytics', () => {
        expect(analyticFireMock).toHaveBeenCalledWith({
          action: 'cleared',
          actionSubject: 'table',
          actionSubjectId: null,
          attributes: expect.objectContaining({
            inputMethod: 'contextMenu',
            verticalCells: 3,
            horizontalCells: 1,
            totalRowCount: 3,
            totalColumnCount: 3,
          }),
          eventType: 'track',
        });
      });
    });

    describe('keyboard - Backspace', () => {
      beforeEach(() => {
        const { editorView } = editor(
          doc(
            table()(
              tr(thEmpty, td()(p('Hello')), thEmpty),
              tr(td()(p('{<cell}Hello')), tdEmpty, td()(p('{cell>}'))),
              tr(tdEmpty, tdEmpty, tdEmpty),
            ),
          ),
        );

        sendKeyToPm(editorView, 'Backspace');
      });

      it('should fire v3 analytics', () => {
        expect(mockAttachPayload).toHaveBeenCalledWith({
          action: 'cleared',
          actionSubject: 'table',
          actionSubjectId: null,
          attributes: expect.objectContaining({
            inputMethod: 'keyboard',
            verticalCells: 1,
            horizontalCells: 3,
            totalRowCount: 3,
            totalColumnCount: 3,
          }),
          eventType: 'track',
        });
      });
    });
  });

  describe('cells merged', () => {
    beforeEach(() => {
      const { editorView } = editor(
        doc(
          table()(
            tr(thEmpty, td()(p('{<cell}Hello')), thEmpty),
            tr(td()(p('Hello')), tdEmpty, tdEmpty),
            tr(tdEmpty, td()(p('{cell>}')), tdEmpty),
          ),
        ),
      );

      mergeCellsWithAnalytics(editorAnalyticsAPIFake)(
        INPUT_METHOD.CONTEXT_MENU,
      )(editorView.state, editorView.dispatch);
    });

    it('should fire v3 analytics', () => {
      expect(analyticFireMock).toHaveBeenCalledWith({
        action: 'merged',
        actionSubject: 'table',
        actionSubjectId: null,
        attributes: expect.objectContaining({
          verticalCells: 3,
          horizontalCells: 1,
          totalCells: 3,
          totalRowCount: 3,
          totalColumnCount: 3,
        }),
        eventType: 'track',
      });
    });
  });

  describe('cell split', () => {
    beforeEach(() => {
      const { editorView } = editor(
        doc(
          table()(
            tr(thEmpty, thEmpty, thEmpty),
            tr(td({ colspan: 3 })(p('{<>}'))),
            tr(tdEmpty, tdEmpty, tdEmpty),
          ),
        ),
      );

      splitCellWithAnalytics(editorAnalyticsAPIFake)(INPUT_METHOD.CONTEXT_MENU)(
        editorView.state,
        editorView.dispatch,
      );
    });

    it('should fire v3 analytics', () => {
      expect(analyticFireMock).toHaveBeenCalledWith({
        action: 'split',
        actionSubject: 'table',
        actionSubjectId: null,
        attributes: expect.objectContaining({
          verticalCells: 1,
          horizontalCells: 3,
          totalCells: 3,
          totalRowCount: 3,
          totalColumnCount: 3,
        }),
        eventType: 'track',
      });
    });
  });

  describe('cells colored', () => {
    beforeEach(() => {
      const { editorView } = editor(
        doc(
          table()(
            tr(thEmpty, td()(p('Hello')), thEmpty),
            tr(td()(p('{<cell}Hello')), tdEmpty, td()(p('{cell>}'))),
            tr(tdEmpty, tdEmpty, tdEmpty),
          ),
        ),
      );

      setColorWithAnalytics(editorAnalyticsAPIFake)(
        INPUT_METHOD.CONTEXT_MENU,
        B50,
      )(editorView.state, editorView.dispatch);
    });

    it('should fire v3 analytics', () => {
      expect(analyticFireMock).toHaveBeenCalledWith({
        action: 'colored',
        actionSubject: 'table',
        actionSubjectId: null,
        attributes: expect.objectContaining({
          cellColor: 'light blue',
          verticalCells: 1,
          horizontalCells: 3,
          totalCells: 3,
          totalRowCount: 3,
          totalColumnCount: 3,
        }),
        eventType: 'track',
      });
    });
  });

  describe('header row toggled', () => {
    beforeEach(() => {
      const { editorView } = editor(defaultTableDoc);
      toggleHeaderRowWithAnalytics(editorAnalyticsAPIFake)(
        editorView.state,
        editorView.dispatch,
      );
    });

    it('should fire v3 analytics', () => {
      expect(analyticFireMock).toHaveBeenCalledWith({
        action: 'toggledHeaderRow',
        actionSubject: 'table',
        actionSubjectId: null,
        attributes: expect.objectContaining({
          newState: false,
          totalRowCount: 3,
          totalColumnCount: 3,
        }),
        eventType: 'track',
      });
    });
  });

  describe('header column toggled', () => {
    beforeEach(() => {
      const { editorView } = editor(defaultTableDoc);
      toggleHeaderColumnWithAnalytics(editorAnalyticsAPIFake)(
        editorView.state,
        editorView.dispatch,
      );
    });

    it('should fire v3 analytics', () => {
      expect(analyticFireMock).toHaveBeenCalledWith({
        action: 'toggledHeaderColumn',
        actionSubject: 'table',
        actionSubjectId: null,
        attributes: expect.objectContaining({
          newState: true,
          totalRowCount: 3,
          totalColumnCount: 3,
        }),
        eventType: 'track',
      });
    });
  });

  describe('number column toggled', () => {
    beforeEach(() => {
      const { editorView } = editor(defaultTableDoc);
      toggleNumberColumnWithAnalytics(editorAnalyticsAPIFake)(
        editorView.state,
        editorView.dispatch,
      );
    });

    it('should fire v3 analytics', () => {
      expect(analyticFireMock).toHaveBeenCalledWith({
        action: 'toggledNumberColumn',
        actionSubject: 'table',
        actionSubjectId: null,
        attributes: expect.objectContaining({
          newState: true,
          totalRowCount: 3,
          totalColumnCount: 3,
        }),
        eventType: 'track',
      });
    });
  });

  describe('layout changed', () => {
    describe('normal', () => {
      it('should fire v3 analytics', () => {
        const { editorView } = editor(defaultTableDoc);
        toggleTableLayoutWithAnalytics(editorAnalyticsAPIFake)(
          editorView.state,
          editorView.dispatch,
        );

        expect(analyticFireMock).toHaveBeenCalledWith({
          action: 'changedBreakoutMode',
          actionSubject: 'table',
          actionSubjectId: null,
          attributes: expect.objectContaining({
            newBreakoutMode: 'wide',
            previousBreakoutMode: 'normal',
            totalRowCount: 3,
            totalColumnCount: 3,
          }),
          eventType: 'track',
        });
      });
    });

    describe('wide', () => {
      it('should fire v3 analytics', () => {
        const { editorView } = editor(
          doc(
            table({
              layout: 'wide',
            })(
              tr(thEmpty, thEmpty, thEmpty),
              tr(tdEmpty, tdEmpty, tdEmpty),
              tr(tdEmpty, tdEmpty, tdCursor),
            ),
          ),
        );
        toggleTableLayoutWithAnalytics(editorAnalyticsAPIFake)(
          editorView.state,
          editorView.dispatch,
        );

        expect(analyticFireMock).toHaveBeenCalledWith({
          action: 'changedBreakoutMode',
          actionSubject: 'table',
          actionSubjectId: null,
          attributes: expect.objectContaining({
            newBreakoutMode: 'fullWidth',
            previousBreakoutMode: 'wide',
            totalRowCount: 3,
            totalColumnCount: 3,
          }),
          eventType: 'track',
        });
      });
    });

    describe('fullWidth', () => {
      it('should fire v3 analytics', () => {
        const { editorView } = editor(
          doc(
            table({ layout: 'full-width' })(
              tr(thEmpty, thEmpty, thEmpty),
              tr(tdEmpty, tdEmpty, tdEmpty),
              tr(tdEmpty, tdEmpty, tdCursor),
            ),
          ),
        );

        toggleTableLayoutWithAnalytics(editorAnalyticsAPIFake)(
          editorView.state,
          editorView.dispatch,
        );

        expect(analyticFireMock).toHaveBeenCalledWith({
          action: 'changedBreakoutMode',
          actionSubject: 'table',
          actionSubjectId: null,
          attributes: expect.objectContaining({
            newBreakoutMode: 'normal',
            previousBreakoutMode: 'fullWidth',
            totalRowCount: 3,
            totalColumnCount: 3,
          }),
          eventType: 'track',
        });
      });
    });
  });

  describe('cut something from table', () => {
    beforeEach(() => {
      const { editorView } = editor(
        doc(
          table()(
            tr(thEmpty, td()(p('Hello')), thEmpty),
            tr(td()(p('{<cell}Hello')), tdEmpty, td()(p('{cell>}'))),
            tr(tdEmpty, tdEmpty, tdEmpty),
          ),
        ),
      );

      editorView.dispatch(
        handleCut(
          editorView.state.tr,
          editorView.state,
          editorView.state,
          editorAnalyticsAPIFake,
        ),
      );
    });

    it('should fire v3 analytics', () => {
      expect(analyticFireMock).toHaveBeenCalledWith({
        action: 'cut',
        actionSubject: 'table',
        actionSubjectId: null,
        attributes: expect.objectContaining({
          verticalCells: 1,
          horizontalCells: 3,
          totalCells: 3,
          totalRowCount: 3,
          totalColumnCount: 3,
        }),
        eventType: 'track',
      });
    });
  });

  describe('row added', () => {
    describe('context menu', () => {
      beforeEach(() => {
        const { editorView } = editor(defaultTableDoc);
        insertRowWithAnalytics(editorAnalyticsAPIFake)(
          INPUT_METHOD.CONTEXT_MENU,
          {
            index: 2,
            moveCursorToInsertedRow: false,
          },
        )(editorView.state, editorView.dispatch);
      });

      it('should fire v3 analytics', () => {
        expect(analyticFireMock).toHaveBeenCalledWith({
          action: 'addedRow',
          actionSubject: 'table',
          actionSubjectId: null,
          attributes: expect.objectContaining({
            inputMethod: 'contextMenu',
            position: 2,
            totalRowCount: 3,
            totalColumnCount: 3,
          }),
          eventType: 'track',
        });
      });
    });

    describe('keyboard', () => {
      describe('Tab', () => {
        beforeEach(() => {
          const { editorView } = editor(defaultTableDoc);
          sendKeyToPm(editorView, 'Tab');
        });

        it('should fire v3 analytics', () => {
          expect(mockAttachPayload).toHaveBeenCalledWith({
            action: 'addedRow',
            actionSubject: 'table',
            actionSubjectId: null,
            attributes: expect.objectContaining({
              inputMethod: 'keyboard',
              position: 3,
              totalRowCount: 3,
              totalColumnCount: 3,
            }),
            eventType: 'track',
          });
        });
      });

      describe('Shift-Tab', () => {
        beforeEach(() => {
          const { editorView } = editor(
            doc(
              table()(
                tr(tdCursor, tdEmpty, tdEmpty),
                tr(tdEmpty, tdEmpty, tdEmpty),
                tr(tdEmpty, tdEmpty, tdEmpty),
              ),
            ),
          );
          sendKeyToPm(editorView, 'Shift-Tab');
        });

        it('should fire v3 analytics', () => {
          expect(mockAttachPayload).toHaveBeenCalledWith({
            action: 'addedRow',
            actionSubject: 'table',
            actionSubjectId: null,
            attributes: expect.objectContaining({
              inputMethod: 'keyboard',
              position: 0,
              totalRowCount: 3,
              totalColumnCount: 3,
            }),
            eventType: 'track',
          });
        });
      });
    });
  });

  describe('column added', () => {
    const getEditorContainerWidth = () => {
      return { width: 500 };
    };
    beforeEach(() => {
      const { editorView } = editor(defaultTableDoc);
      insertColumnWithAnalytics(
        getEditorContainerWidth,
        editorAnalyticsAPIFake,
      )(INPUT_METHOD.CONTEXT_MENU, 2)(
        editorView.state,
        editorView.dispatch,
        editorView,
      );
    });

    it('should fire v3 analytics', () => {
      expect(analyticFireMock).toHaveBeenCalledWith({
        action: 'addedColumn',
        actionSubject: 'table',
        actionSubjectId: null,
        attributes: expect.objectContaining({
          inputMethod: 'contextMenu',
          position: 2,
          totalRowCount: 3,
          totalColumnCount: 3,
        }),
        eventType: 'track',
      });
    });
  });

  describe('row deleted', () => {
    beforeEach(() => {
      const { editorView } = editor(defaultTableDoc);
      deleteRowsWithAnalytics(editorAnalyticsAPIFake)(
        INPUT_METHOD.CONTEXT_MENU,
        secondRow,
        true,
      )(editorView.state, editorView.dispatch);
    });

    it('should fire v3 analytics', () => {
      expect(analyticFireMock).toHaveBeenCalledWith({
        action: 'deletedRow',
        actionSubject: 'table',
        actionSubjectId: null,
        attributes: expect.objectContaining({
          inputMethod: 'contextMenu',
          position: 1,
          count: 1,
          totalRowCount: 3,
          totalColumnCount: 3,
        }),
        eventType: 'track',
      });
    });
  });

  describe('column deleted', () => {
    beforeEach(() => {
      const { editorView } = editor(defaultTableDoc);
      deleteColumnsWithAnalytics(editorAnalyticsAPIFake)(
        INPUT_METHOD.CONTEXT_MENU,
        secondColumn,
      )(editorView.state, editorView.dispatch);
    });

    it('should fire v3 analytics', () => {
      expect(analyticFireMock).toHaveBeenCalledWith({
        action: 'deletedColumn',
        actionSubject: 'table',
        actionSubjectId: null,
        attributes: expect.objectContaining({
          inputMethod: 'contextMenu',
          position: 1,
          count: 1,
          totalRowCount: 3,
          totalColumnCount: 3,
        }),
        eventType: 'track',
      });
    });
  });

  describe('table replaced', () => {
    it('should fire v3 analytics', () => {
      const { editorView } = editor(
        doc(
          table()(
            tr(td()(p('{<cell}1')), td()(p('2'))),
            tr(td()(p('3')), td()(p('4{cell>}'))),
          ),
        ),
      );
      editorView.dispatch(
        replaceSelectedTable(
          editorView.state,
          'text',
          INPUT_METHOD.KEYBOARD,
          editorAnalyticsAPIFake,
        ),
      );

      expect(analyticFireMock).toHaveBeenCalledWith({
        action: 'replaced',
        actionSubject: 'table',
        attributes: expect.objectContaining({
          totalRowCount: 2,
          totalColumnCount: 2,
          inputMethod: 'keyboard',
        }),
        eventType: 'track',
      });
    });
  });
});
