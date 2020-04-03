import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  p,
  panel,
  mediaSingle,
  table,
  tr,
  td,
} from '@atlaskit/editor-test-helpers/schema-builder';
import {
  analyticsPluginKey,
  findInsertLocation,
  getSelectionType,
} from '../index';
import { temporaryMedia } from '../../../__tests__/unit/plugins/media/_utils';

describe('analytics implicitAttributes', () => {
  const createEditor = createEditorFactory();
  let createAnalyticsEvent: jest.Mock;
  let fireMock: jest.Mock;

  const editor = (doc: any) => {
    fireMock = jest.fn();
    createAnalyticsEvent = jest.fn(() => ({ fire: fireMock }));
    return createEditor({
      doc,
      editorProps: {
        allowAnalyticsGASV3: true,
        allowPanel: true,
        allowTables: true,
        media: {
          allowMediaSingle: true,
        },
      },
      createAnalyticsEvent,
      pluginKey: analyticsPluginKey,
    });
  };

  describe('insert events', () => {
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
