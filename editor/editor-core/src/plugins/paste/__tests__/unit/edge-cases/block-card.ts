import {
  Preset,
  LightEditorPlugin,
  createProsemirrorEditorFactory,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import dispatchPasteEvent from '@atlaskit/editor-test-helpers/dispatch-paste-event';
import {
  doc,
  p,
  layoutSection,
  layoutColumn,
  panel,
  DocBuilder,
  blockCard,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { EditorView } from 'prosemirror-view';

import blockTypePlugin from '../../../../block-type';
import hyperlinkPlugin from '../../../../hyperlink';
import layoutPlugin from '../../../../layout';
import panelPlugin from '../../../../panel';
import cardPlugin from '../../../../card';

describe('paste paragraph edge cases', () => {
  const createEditor = createProsemirrorEditorFactory();
  let editorView: EditorView;

  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add(hyperlinkPlugin)
        .add(blockTypePlugin)
        .add(layoutPlugin)
        .add(panelPlugin)
        .add([cardPlugin, { allowBlockCards: true, platform: 'web' }]),
    });

  type CASE = {
    id: string;
    description: string;
    target: DocBuilder;
    source: string;
    result: DocBuilder;
  };

  const case01: CASE = {
    id: 'case01',
    description: 'paste a blockCard wrapped by a panel should work',
    target: doc(p('{<>}')),
    source: `<meta charset='utf-8'>
      <div data-panel-type="info" data-pm-slice="0 0 []">
        <div data-panel-content="true">
          <a data-block-card="" href="https://gnu.org" data-card-data=""></a>
        </div>
      </div>`,

    result: doc(
      // prettier-ignore
      panel()(
        blockCard({url: 'https://gnu.org'})()
      ),
    ),
  };

  const case02: CASE = {
    id: 'case02',
    description: 'paste a blockCard wrapped by a layout should work',
    target: doc(p('{<>}')),
    source: `<meta charset='utf-8'>
      <div data-layout-section="true" data-pm-slice="0 0 []">
        <div data-layout-column="true" >
          <div data-layout-content="true">
            <a data-block-card="" href="https://gnu.org" data-card-data="">
            </a>
          </div>
        </div>
      </div>`,

    result: doc(
      // prettier-ignore
      layoutSection(
        layoutColumn({ width: 50 })(
          blockCard({url: 'https://gnu.org'})()
        ),
        layoutColumn({ width: 50 })(
          p('')
        ),
      ),
    ),
  };

  describe.each<CASE>([
    // prettier-ignore
    case01,
    case02,
  ])('cases', ({ id, description, target, source, result }) => {
    const paste = () => {
      dispatchPasteEvent(editorView, {
        html: `${source}`,
        plain: '',
      });
    };
    beforeEach(() => {
      ({ editorView } = editor(target));
    });

    describe(`${id}`, () => {
      it(`${description}`, () => {
        paste();

        expect(editorView.state.doc).toEqualDocument(result);
      });
    });
  });
});
