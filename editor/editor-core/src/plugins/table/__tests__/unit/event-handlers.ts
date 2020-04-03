import {
  doc,
  table,
  tr,
  tdEmpty,
  tdCursor,
  td,
  p,
} from '@atlaskit/editor-test-helpers/schema-builder';
import {
  LightEditorPlugin,
  Preset,
  createProsemirrorEditorFactory,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';

import tablePlugin from '../../../table';
import { handleMouseOut } from '../../event-handlers';
import { TableCssClassName as ClassName } from '../../types';
import { pluginKey } from '../../pm-plugins/plugin-factory';

describe('table plugin: decorations', () => {
  const createEditor = createProsemirrorEditorFactory();
  const editor = (doc: any) =>
    createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>().add(tablePlugin),
      pluginKey,
    });

  describe('#handleMouseOut', () => {
    describe('when the target is a resize handle column', () => {
      it('should return true', () => {
        const { editorView } = editor(
          doc(table()(tr(tdCursor, tdEmpty), tr(td()(p('{o}')), tdEmpty))),
        );
        const firstCell = document.createElement('div');
        firstCell.classList.add(ClassName.RESIZE_HANDLE_DECORATION);

        // event.target = secondCell.node;
        const spy = jest
          .spyOn(MouseEvent.prototype, 'target', 'get')
          .mockReturnValue(firstCell);

        const event = new MouseEvent('opa');

        expect(handleMouseOut(editorView, event)).toEqual(true);
        spy.mockRestore();
      });
    });

    describe('when the relatedTarget is a resize handle column too', () => {
      it('should return false', () => {
        const { editorView } = editor(
          doc(table()(tr(tdCursor, tdEmpty), tr(td()(p('{o}')), tdEmpty))),
        );
        const firstCell = document.createElement('div');
        firstCell.classList.add(ClassName.RESIZE_HANDLE_DECORATION);
        const secondCell = document.createElement('div');
        secondCell.classList.add(ClassName.RESIZE_HANDLE_DECORATION);

        // event.target = secondCell.node;
        const spy = jest
          .spyOn(MouseEvent.prototype, 'target', 'get')
          .mockReturnValue(secondCell);

        const event = new MouseEvent('opa', {
          relatedTarget: firstCell,
        });

        expect(handleMouseOut(editorView, event)).toEqual(false);
        spy.mockRestore();
      });
    });
  });
});
