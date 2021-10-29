import {
  Preset,
  LightEditorPlugin,
  createProsemirrorEditorFactory,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import dispatchPasteEvent from '@atlaskit/editor-test-helpers/dispatch-paste-event';
import {
  doc,
  h1,
  p,
  li,
  // ul,
  ol,
  // a as link,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { EditorView } from 'prosemirror-view';
import pastePlugin from '../../../index';
import blockTypePlugin from '../../../../block-type';
import hyperlink from '../../../../hyperlink';
import list from '../../../../list';
import { textFormattingPlugin } from '../../../../index';

describe('paste paragraph edge cases', () => {
  const createEditor = createProsemirrorEditorFactory();
  let editorView: EditorView;

  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add([pastePlugin, {}])
        .add(hyperlink)
        .add(blockTypePlugin)
        .add(list)
        .add(textFormattingPlugin),
    });

  type CASE = { target: DocBuilder; source: string; result: DocBuilder };
  const case00: CASE = {
    target: doc(
      // prettier-ignore
      h1('Test {<>}'),
    ),
    source: `
      <div>
        <a href="https://gnu.org"><h1>Hello</h1>world</a>
      </div>
    `,
    result: doc(
      // prettier-ignore
      h1('Test Hello'),
      p('world'),
    ),
  };

  const case01: CASE = {
    target: doc(
      // prettier-ignore
      p('{<>}'),
    ),
    source: `<a href="https://gnu.org"><p>Hello</p></a>`,
    result: doc(
      // prettier-ignore
      p('Hello'),
    ),
  };

  const case02: CASE = {
    target: doc(
      // prettier-ignore
      h1('{<>}'),
    ),
    source: `<a href="https://gnu.org"><p>Hello</p></a>`,
    result: doc(
      // prettier-ignore
      h1('Hello'),
    ),
  };

  const case03: CASE = {
    target: doc(
      // prettier-ignore
      ol(
        li(
          p('{<>}'),
        ),
      ),
    ),
    source: `<a href="https://gnu.org"><p>Hello</p></a>`,
    result: doc(
      // prettier-ignore
      ol(
        li(
          p('Hello'),
        ),
      ),
    ),
  };

  const case04: CASE = {
    target: doc(
      // prettier-ignore
      ol(
        li(
          p('{<>}'),
        ),
      ),
    ),
    source: `
      <div>
        <a href="https://gnu.org"><h1>Hello</h1>world</a>
      </div>
    `,
    result: doc(h1('Hello'), p('world')),
  };

  const case05: CASE = {
    target: doc(
      // prettier-ignore
      ol(
        li(
          p('Test {<>}'),
        ),
      ),
    ),
    source: `
      <div>
        <a href="https://gnu.org"><h1>Hello</h1>world</a>
      </div>
    `,
    result: doc(
      // prettier-ignore
      ol(
        li(
          p('Test Hello'),
          p('world'),
        ),
      ),
    ),
  };

  /*
  const case06: CASE = {
    target: doc(
      // prettier-ignore
      '{<}',
      p('Test'),
      '{>}',
    ),
    source: `
      <div>
        <a href="https://gnu.org/">world</a>
      </div>
    `,
    result: doc(
      // prettier-ignore
      p(link({ href: "https://gnu.org/" })("world")),
    ),
  };

  const case07: CASE = {
    target: doc(
      // prettier-ignore
      ol(
        li(
          p('{<>}Test'),
        ),
      ),
    ),
    source: `
      <div>
        <a href="https://gnu.org"><h1>Hello</h1>world</a>
      </div>
    `,
    result: doc(
      // prettier-ignore
      ol(li(p('HelloworldTest'))),
    ),
  };

  const case08: CASE = {
    target: doc(
      // prettier-ignore
      p('{<>}'),
    ),
    source: `
<ul>
<li><a href="https://duckduckgo.com/?q=test&amp;t=h_&amp;ia=web#">All</a></li>
</ul>
<ul>
<li><a href="https://duckduckgo.com/?q=test&amp;t=h_&amp;ia=web#">Meanings</a></li>
</ul>
<ul>
<li>
    `,
    result: doc(
      // prettier-ignore
      ul(
        li(
          p('All'),
        ),
      ),
      ul(li(p('Meanings'))),
      ul(li(p(''))),
    ),
  };
  */

  describe.each<CASE>([
    // prettier-ignore
    case00,
    case01,
    case02,
    case03,
    case04,
    case05,
    // case06,
    // case07,
    // case08,
  ])('case %#', ({ target, source, result }) => {
    const paste = () => {
      dispatchPasteEvent(editorView, {
        html: `${source}`,
        plain: '',
      });
    };
    beforeEach(() => {
      ({ editorView } = editor(target));
    });

    it('should not wrap the block node into a link mark', () => {
      paste();

      //console.log(editorView.state.doc.toString());
      expect(editorView.state.doc).toEqualDocument(result);
    });
  });
});
