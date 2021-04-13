import { EditorView } from 'prosemirror-view';
import {
  createEditorFactory,
  Options as CreateEditorOptions,
} from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  mediaSingle,
  media,
  p,
  Refs,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { getFreshMediaProvider } from '../media/_utils';
import { pluginKey as mediaEditorPluginKey } from '../../../../plugins/media/pm-plugins/media-editor-plugin-factory';

import { MediaEditorState } from '../../../../plugins/media/types';
import {
  openMediaAltTextMenu,
  closeMediaAltTextMenu,
} from '../../../../plugins/media/pm-plugins/alt-text/commands';
import { getPluginState } from '../../../../plugins/media/pm-plugins/alt-text';
import { setGapCursorSelection } from '../../../../utils';
import {
  Side,
  GapCursorSelection,
} from '../../../../plugins/selection/gap-cursor-selection';
import { pmHistoryPluginKey } from '../../../../plugins/history/pm-history-types';
import { PluginKey } from 'prosemirror-state';

describe('media alt text', () => {
  const createEditor = createEditorFactory<MediaEditorState>();

  const mediaProvider = getFreshMediaProvider();

  const editor = (
    doc: DocBuilder,
    createEditorOptions?: CreateEditorOptions,
  ) => {
    return createEditor({
      ...createEditorOptions,
      doc,
      editorProps: {
        media: {
          allowAnnotation: true,
          allowMediaSingle: true,
          allowAltTextOnImages: true,
          provider: mediaProvider,
        },
      },
      pluginKey: mediaEditorPluginKey,
    });
  };

  describe('when the media is selected', () => {
    let view: EditorView;
    const defaultDoc = doc(
      '{<node>}',
      mediaSingle({
        layout: 'align-start',
      })(
        media({
          id: 'abc',
          type: 'file',
          collection: 'xyz',
        })(),
      ),
    );

    beforeEach(() => {
      const { editorView } = editor(defaultDoc);
      view = editorView;
    });

    it('should set isAltTextEditorOpen as true', () => {
      getPluginState(view.state).isAltTextEditorOpen = false;
      openMediaAltTextMenu(view.state, view.dispatch);

      expect(getPluginState(view.state).isAltTextEditorOpen).toBeTruthy();
    });

    it('should set isAltTextEditorOpen as false', () => {
      getPluginState(view.state).isAltTextEditorOpen = true;
      closeMediaAltTextMenu(view.state, view.dispatch);

      expect(getPluginState(view.state).isAltTextEditorOpen).toBeFalsy();
    });
  });

  describe('when the media is not selected', () => {
    let view: EditorView;
    const defaultDoc = doc(
      p('Nothing {<>}here'),
      mediaSingle({
        layout: 'align-start',
      })(
        media({
          id: 'abc',
          type: 'file',
          collection: 'xyz',
        })(),
      ),
    );

    beforeEach(() => {
      const { editorView } = editor(defaultDoc);
      view = editorView;
    });
    it('should not set isAltTextEditorOpen as true', () => {
      getPluginState(view.state).isAltTextEditorOpen = false;
      openMediaAltTextMenu(view.state, view.dispatch);

      expect(getPluginState(view.state).isAltTextEditorOpen).toBeFalsy();
    });
  });

  describe('when the selection is changed', () => {
    let view: EditorView;
    let refs: Refs;
    const defaultDoc = doc(
      '{<node>}',
      mediaSingle({
        layout: 'align-start',
      })(
        media({
          id: 'abc',
          type: 'file',
          collection: 'xyz',
        })(),
      ),
      p('Nothing {nextPos}here'),
    );

    beforeEach(() => {
      const { editorView, refs: tmp } = editor(defaultDoc);
      view = editorView;
      refs = tmp;
    });

    it('should set isAltTextEditorOpen to false', () => {
      getPluginState(view.state).isAltTextEditorOpen = true;

      setGapCursorSelection(view, refs.nextPos, Side.RIGHT);

      expect(getPluginState(view.state).isAltTextEditorOpen).toBeFalsy();
    });

    describe('via prosemirror history transaction', () => {
      it('does not set isAltTextEditorOpen to false', () => {
        getPluginState(view.state).isAltTextEditorOpen = true;
        const historyKey = ({
          key: pmHistoryPluginKey,
        } as unknown) as PluginKey;
        const setSelectionTransaction = view.state.tr.setSelection(
          new GapCursorSelection(
            view.state.doc.resolve(refs.nextPos),
            Side.RIGHT,
          ),
        );
        setSelectionTransaction.setMeta(historyKey, {});
        view.dispatch(setSelectionTransaction);
        expect(getPluginState(view.state).isAltTextEditorOpen).toBe(true);
      });
    });

    describe('to another media single', () => {
      beforeEach(() => {
        const { editorView, refs: tmp } = editor(
          doc(
            '{<node>}',
            mediaSingle({
              layout: 'align-start',
            })(
              media({
                id: 'abc',
                type: 'file',
                collection: 'xyz',
              })(),
            ),
            p('Nothing here'),
            '{nextPos}',
            mediaSingle({
              layout: 'align-start',
            })(
              media({
                id: 'cde',
                type: 'file',
                collection: 'xyz',
              })(),
            ),
          ),
        );
        view = editorView;
        refs = tmp;
      });
      it('should set isAltTextEditorOpen to false', () => {
        getPluginState(view.state).isAltTextEditorOpen = true;
        setGapCursorSelection(view, refs.nextPos, Side.RIGHT);
        expect(getPluginState(view.state).isAltTextEditorOpen).toBeFalsy();
      });
    });
  });
});
