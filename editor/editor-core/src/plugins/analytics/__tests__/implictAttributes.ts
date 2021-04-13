import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  p,
  panel,
  mediaSingle,
  table,
  tr,
  td,
  expand,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  analyticsPluginKey,
  findInsertLocation,
  getSelectionType,
  getStateContext,
} from '../index';
import { temporaryMedia } from '../../../__tests__/unit/plugins/media/_utils';
import {
  AnalyticsEventPayload,
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  INPUT_METHOD,
} from '../types';

describe('analytics implicitAttributes', () => {
  const createEditor = createEditorFactory();
  let createAnalyticsEvent: jest.Mock;
  let fireMock: jest.Mock;

  const editor = (doc: DocBuilder) => {
    fireMock = jest.fn();
    createAnalyticsEvent = jest.fn(() => ({ fire: fireMock }));
    return createEditor({
      doc,
      editorProps: {
        allowAnalyticsGASV3: true,
        allowPanel: true,
        allowTables: true,
        allowExpand: true,
        media: {
          allowMediaSingle: true,
        },
      },
      createAnalyticsEvent,
      pluginKey: analyticsPluginKey,
    });
  };

  describe('insert events', () => {
    describe('getStateContext', () => {
      it('should return payload with insertLocation', () => {
        const payload: AnalyticsEventPayload = {
          action: ACTION.INSERTED,
          actionSubject: ACTION_SUBJECT.DOCUMENT,
          attributes: { inputMethod: INPUT_METHOD.QUICK_INSERT },
          eventType: EVENT_TYPE.TRACK,
        };

        const { editorView } = editor(doc(panel()(p('Hello{<>}World'))));
        expect(getStateContext(editorView.state, payload)).toEqual({
          ...payload,
          action: ACTION.INSERTED,
          actionSubject: ACTION_SUBJECT.DOCUMENT,
          attributes: {
            ...payload.attributes,
            insertLocation: 'panel',
            selectionPosition: 'middle',
            selectionType: 'cursor',
          },
        });
      });

      describe('when action is formatted text', () => {
        const payload: AnalyticsEventPayload = {
          action: ACTION.FORMATTED,
          actionSubject: ACTION_SUBJECT.TEXT,
          attributes: { inputMethod: INPUT_METHOD.QUICK_INSERT },
          eventType: EVENT_TYPE.TRACK,
        };
        it('should return payload with nodeLocation as the top level document', () => {
          const { editorView } = editor(doc(p('{<>}')));
          expect(getStateContext(editorView.state, payload)).toEqual({
            ...payload,
            attributes: {
              ...payload.attributes,
              nodeLocation: 'doc',
              selectionPosition: 'start',
              selectionType: 'cursor',
            },
          });
        });

        it('should return payload with nodeLocation as panel', () => {
          const { editorView } = editor(doc(panel()(p('{<>}'))));
          expect(getStateContext(editorView.state, payload)).toEqual({
            ...payload,
            attributes: {
              ...payload.attributes,
              nodeLocation: 'panel',
              selectionPosition: 'start',
              selectionType: 'cursor',
            },
          });
        });

        it('should return payload with nodeLocation as expand', () => {
          const { editorView } = editor(
            doc('{expandPos}', expand()(p('{<>}'))),
          );
          expect(getStateContext(editorView.state, payload)).toEqual({
            ...payload,
            attributes: {
              ...payload.attributes,
              nodeLocation: 'expand',
              selectionPosition: 'start',
              selectionType: 'cursor',
            },
          });
        });

        it('should return payload with nodeLocation as table', () => {
          const { editorView } = editor(
            doc(table()(tr(td()(p('{<cell}')), td()(p('{cell>}'))))),
          );
          expect(getStateContext(editorView.state, payload)).toEqual({
            ...payload,
            attributes: {
              ...payload.attributes,
              nodeLocation: 'table',
              selectionType: 'cell',
            },
          });
        });
      });
    });

    describe('insertLocation', () => {
      it('cursor selection', () => {
        const { editorView } = editor(doc(panel()(p('Hello{<>}World'))));
        expect(findInsertLocation(editorView.state)).toBe('panel');
      });

      it('ignores paragraph', () => {
        const { editorView } = editor(doc(p('Hello{<>}World')));
        expect(findInsertLocation(editorView.state)).toBe('doc');
      });

      it('node selection', () => {
        const { editorView } = editor(
          doc('{<node>}', mediaSingle()(temporaryMedia)),
        );
        expect(findInsertLocation(editorView.state)).toBe('mediaSingle');
      });

      it('cell selection', () => {
        const { editorView } = editor(
          doc(table()(tr(td()(p('{<cell}')), td()(p('{cell>}'))))),
        );
        expect(findInsertLocation(editorView.state)).toBe('table');
      });

      it('gap cursor selection', () => {
        const { editorView } = editor(
          doc('{<gap|>}', mediaSingle()(temporaryMedia)),
        );
        expect(findInsertLocation(editorView.state)).toBe('doc');
      });
    });

    describe('selectionType', () => {
      test.each([
        ['start', doc(p('{<>}HelloWorld'))],
        ['middle', doc(p('Hello{<>}World'))],
        ['end', doc(p('HelloWorld{<>}'))],
      ])('cursor %s', (position, doc) => {
        const { editorView } = editor(doc);
        expect(getSelectionType(editorView.state)).toEqual({
          type: 'cursor',
          position,
        });
      });

      test.each([
        ['left', doc('{<gap|>}', panel()(p('')))],
        ['right', doc(panel()(p('')), '{<|gap>}')],
      ])('gapCursor %s', (position, doc) => {
        const { editorView } = editor(doc);
        expect(getSelectionType(editorView.state)).toEqual({
          type: 'gapCursor',
          position,
        });
      });

      it('ranged', () => {
        const { editorView } = editor(doc(p('{<}HelloWorld{>}')));
        expect(getSelectionType(editorView.state)).toEqual({
          type: 'ranged',
        });
      });

      it('cell', () => {
        const { editorView } = editor(
          doc(table()(tr(td()(p('{<cell}')), td()(p('{cell>}'))))),
        );
        expect(getSelectionType(editorView.state)).toEqual({
          type: 'cell',
        });
      });

      it('node', () => {
        const { editorView } = editor(
          doc('{<node>}', mediaSingle()(temporaryMedia)),
        );
        expect(getSelectionType(editorView.state)).toEqual({
          type: 'node',
        });
      });
    });
  });
});
