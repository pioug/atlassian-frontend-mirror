import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
import {
  doc,
  table,
  p,
  tr,
  th,
  td,
  code,
  strong,
  em,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { getDocStructure } from '../../document-logger';

describe('docment-logger', () => {
  describe('getDocStructure', () => {
    describe('options - compact', () => {
      const options = { compact: true };

      it('should return a compact stringified version of a simple document', () => {
        const editorState = createEditorState(
          doc(p('hello'), p(strong('stranger'))),
        );
        const result = getDocStructure(editorState.doc, options);
        expect(result).toEqual('doc(p(t(5)),p(strong(t(8))))');
      });

      it('should return a compact stringified version of a table document', () => {
        const editorState = createEditorState(
          doc(
            table()(
              tr(th({})(p('hello')), th({})(p()), th({})(p())),
              tr(td({})(p()), td({})(p(em(strong('world')))), td({})(p())),
              tr(td({})(p(code('js'))), td({})(p()), td({})(p('hows'))),
            ),
            p(code('ts')),
          ),
        );
        const result = getDocStructure(editorState.doc, options);
        expect(result).toEqual(
          'doc(table(tr(th(p(t(5))),th(p()),th(p())),tr(td(p()),td(p(strong(em(t(5))))),td(p())),tr(td(p(code(t(2)))),td(p()),td(p(t(4))))),p(code(t(2))))',
        );
      });
    });
  });
});
