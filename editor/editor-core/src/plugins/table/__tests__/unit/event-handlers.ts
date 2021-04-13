import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  doc,
  p,
  table,
  td,
  tdCursor,
  tdEmpty,
  tr,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';

import tablePlugin from '../../../table';
import { handleMouseOut, handleMouseDown } from '../../event-handlers';
import { pluginKey } from '../../pm-plugins/plugin-factory';
import { TableCssClassName as ClassName } from '../../types';

describe('table plugin: decorations', () => {
  const createEditor = createProsemirrorEditorFactory();
  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>().add(tablePlugin),
      pluginKey,
    });
  describe('#handleMouseDown', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
    it('should return true & prevent default behaviour for table wrappers: pm-table-contianer', () => {
      const { editorView } = editor(
        doc(table()(tr(td({})(p())), tr(td({})(p())), tr(td({})(p())))),
      );
      const tableContainer = document.createElement('div');
      tableContainer.className = 'pm-table-container';
      const event = new MouseEvent('mousedown');
      Object.defineProperty(event, 'target', { value: tableContainer });
      const preventDefaultSpy = jest.spyOn(
        MouseEvent.prototype,
        'preventDefault',
      );

      expect(handleMouseDown(editorView, event)).toEqual(true);
      expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
    });

    it('should return true & prevent default behaviour for table wrappers: pm-table-wrapper', () => {
      const { editorView } = editor(
        doc(table()(tr(td({})(p())), tr(td({})(p())), tr(td({})(p())))),
      );
      const tableContainer = document.createElement('div');
      tableContainer.className = 'pm-table-wrapper';
      const event = new MouseEvent('mousedown');
      Object.defineProperty(event, 'target', { value: tableContainer });
      const preventDefaultSpy = jest.spyOn(
        MouseEvent.prototype,
        'preventDefault',
      );

      expect(handleMouseDown(editorView, event)).toEqual(true);
      expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
    });

    it('should return false & not prevent default behaviour for editor content area: ak-editor-content-area', () => {
      const { editorView } = editor(
        doc(table()(tr(td({})(p())), tr(td({})(p())), tr(td({})(p())))),
      );
      const editorContentArea = document.createElement('div');
      editorContentArea.className = 'ak-editor-content-area';
      const event = new MouseEvent('mousedown');
      Object.defineProperty(event, 'target', { value: editorContentArea });
      const preventDefaultSpy = jest.spyOn(
        MouseEvent.prototype,
        'preventDefault',
      );

      expect(handleMouseDown(editorView, event)).toEqual(false);
      expect(preventDefaultSpy).toHaveBeenCalledTimes(0);
    });
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
