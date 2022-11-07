import {
  Preset,
  LightEditorPlugin,
  createProsemirrorEditorFactory,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import dispatchPasteEvent from '@atlaskit/editor-test-helpers/dispatch-paste-event';
import {
  doc,
  h1,
  h3,
  p,
  li,
  ul,
  ol,
  em,
  a as link,
  table,
  taskList,
  taskItem,
  tr,
  td,
  layoutSection,
  layoutColumn,
  panel,
  strong,
  DocBuilder,
  mediaSingle,
  code_block as codeBlock,
  media,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { EditorView } from 'prosemirror-view';

import codeBlockPlugin from '../../../../code-block';
import mediaPlugin from '../../../../media';
import pastePlugin from '../../../index';
import blockTypePlugin from '../../../../block-type';
import hyperlinkPlugin from '../../../../hyperlink';
import listPlugin from '../../../../list';
import tasksAndDecisionsPlugin from '../../../../tasks-and-decisions';
import { default as textFormattingPlugin } from '../../../../text-formatting';
import { tablesPlugin } from '@atlaskit/editor-plugin-table';
import layoutPlugin from '../../../../layout';
import panelPlugin from '../../../../panel';

describe('paste paragraph edge cases', () => {
  const createEditor = createProsemirrorEditorFactory();
  let editorView: EditorView;

  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add([pastePlugin, { plainTextPasteLinkification: true }])
        .add(hyperlinkPlugin)
        .add(blockTypePlugin)
        .add(listPlugin)
        .add(tasksAndDecisionsPlugin)
        .add(textFormattingPlugin)
        .add(tablesPlugin)
        .add(layoutPlugin)
        .add([codeBlockPlugin, { appearance: 'full-page' }])
        .add([mediaPlugin, { allowMediaSingle: true }])
        .add(panelPlugin),
    });

  type CASE = {
    id: string;
    target: DocBuilder;
    source: string;
    result: DocBuilder;
  };
  const case00: CASE = {
    id: 'case00',
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
      h1(
        'Test ',
        link({ href: 'https://gnu.org' })('Hello'),
      ),
      p(link({ href: 'https://gnu.org' })('world')),
    ),
  };

  const case01: CASE = {
    id: 'case01',
    target: doc(
      // prettier-ignore
      p('{<>}'),
    ),
    source: `<a href="https://gnu.org"><p>Hello</p></a>`,
    result: doc(
      // prettier-ignore
      p(
        link({ href: 'https://gnu.org' })('Hello'),
      ),
    ),
  };

  const case02: CASE = {
    id: 'case02',
    target: doc(
      // prettier-ignore
      h1('{<>}'),
    ),
    source: `<a href="https://gnu.org"><p>Hello</p></a>`,
    result: doc(
      // prettier-ignore
      h1(link({ href: 'https://gnu.org' })('Hello')),
    ),
  };

  const case03: CASE = {
    id: 'case03',
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
          p(
            link({ href: 'https://gnu.org' })('Hello'),
          ),
        ),
      ),
    ),
  };

  const case04: CASE = {
    id: 'case04',
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
    result: doc(
      // prettier-ignore
      ol(
        li(
          p(),
        ),
      ),
      h1(link({ href: 'https://gnu.org' })('Hello')),
      p(link({ href: 'https://gnu.org' })('world')),
    ),
  };

  const case05: CASE = {
    id: 'case05',
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
          p(
            'Test ',
          ),
        ),
      ),
      h1(link({ href: 'https://gnu.org' })('Hello')),
      p(link({ href: 'https://gnu.org' })('world')),
    ),
  };

  const case06: CASE = {
    id: 'case06',
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
      p(
        link({ href: "https://gnu.org/" })("world"),
      ),
    ),
  };

  const case07: CASE = {
    id: 'case07',
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
      ol(
        li(
          p(
            'Test',
          ),
        ),
      ),
      h1(link({ href: 'https://gnu.org' })('Hello')),
      p(link({ href: 'https://gnu.org' })('world')),
    ),
  };

  const case08: CASE = {
    id: 'case08',
    target: doc(
      // prettier-ignore
      p('{<>}'),
    ),
    source: `
    <ul>
      <li><a href="https://duckduckgo.com">All</a></li>
    </ul>
    <ul>
      <li><a href="https://duckduckgo.com">Meanings</a></li>
    </ul>
    <ul>
      <li>
    `,
    result: doc(
      // prettier-ignore
      ul(
        li(
          p(
            link({href: 'https://duckduckgo.com' })('All'),
          ),
        ),
      ),
      ul(li(p(link({ href: 'https://duckduckgo.com' })('Meanings')))),
      ul(li(p(''))),
    ),
  };

  const case09: CASE = {
    id: 'case09',
    target: doc(
      // prettier-ignore
      p('Normal {<>}'),
    ),
    source: `
      <a href="https://gnu.org">Hello world</a>
    `,
    result: doc(
      // prettier-ignore
      p(
        'Normal ',
        link({ href: 'https://gnu.org' })('Hello world'),
      ),
    ),
  };

  const case10: CASE = {
    id: 'case10',
    target: doc(
      // prettier-ignore
      p('{<>}'),
    ),
    source: `
      <table>
        <tr>
          <td>
            <a href="https://gnu.org/"><h1>world</h1></a>
          </td>
        </tr>
      </table>
    `,
    result: doc(
      // prettier-ignore
      table({
        localId: expect.any(String)
      })(
        tr(
          td()(
            h1(link({href: 'https://gnu.org/'})('world'))
          )
        )
      ),
    ),
  };

  const case11: CASE = {
    id: 'case11',
    target: doc(
      // prettier-ignore
      table({
        localId: expect.any(String)
      })(
        tr(
          td()(
            p('{<>}'),
          )
        )
      ),
    ),
    source: `
      <a href="https://gnu.org/"><h1>world</h1></a>
    `,
    result: doc(
      // prettier-ignore
      table({
        localId: expect.any(String)
      })(
        tr(
          td()(
            h1(link({href: 'https://gnu.org/'})('world'))
          )
        )
      ),
    ),
  };

  const case12: CASE = {
    id: 'case12',
    target: doc(
      // prettier-ignore
      table({
        localId: expect.any(String)
      })(
        tr(
          td()(
            p('{<>}'),
          )
        )
      ),
    ),
    source: `
      <h1><a href="https://gnu.org/"><h1>world</h1></a></h1>
    `,
    result: doc(
      // prettier-ignore
      table({
        localId: expect.any(String)
      })(
        tr(
          td()(
            h1(link({href: 'https://gnu.org/'})('world'))
          )
        )
      ),
    ),
  };

  const case13: CASE = {
    id: 'case13',
    target: doc(
      // prettier-ignore
      table({
        localId: expect.any(String)
      })(
        tr(
          td()(
            p('Hello {<>}'),
          )
        )
      ),
    ),
    source: `
      <a href="https://gnu.org/"><h1>world</h1></a>
    `,
    result: doc(
      // prettier-ignore
      table({
        localId: expect.any(String)
      })(
        tr(
          td()(
            p('Hello ', link({href: 'https://gnu.org/'})('world'))
          )
        )
      ),
    ),
  };

  const case14: CASE = {
    id: 'case14',
    target: doc(
      // prettier-ignore
      table({
        localId: expect.any(String)
      })(
        tr(
          td()(
            p('Hello {<>}'),
          )
        )
      ),
    ),
    source: `
      <a href="https://gnu.org/"><h1>world</h1></a>
    `,
    result: doc(
      // prettier-ignore
      table({
        localId: expect.any(String)
      })(
        tr(
          td()(
            p('Hello ', link({href: 'https://gnu.org/'})('world'))
          )
        )
      ),
    ),
  };

  const case15: CASE = {
    id: 'case15',
    target: doc(
      // prettier-ignore
      layoutSection(
        layoutColumn({ width: 50 })(
          p('One')
        ),
        layoutColumn({ width: 50 })(
          p('{<>}')
        ),
      ),
    ),
    source: `
      <a href="https://gnu.org/"><h1>world</h1></a>
    `,
    result: doc(
      // prettier-ignore
      layoutSection(
        layoutColumn({ width: 50 })(
          p('One')
        ),
        layoutColumn({ width: 50 })(
          h1(link({href: 'https://gnu.org/'})('world'))
        ),
      ),
    ),
  };

  const case16: CASE = {
    id: 'case16',
    target: doc(
      // prettier-ignore
      panel()(
        p('Test {<>}')
      ),
    ),
    source: `
      <a href="https://gnu.org/"><h1>world</h1></a>
    `,
    result: doc(
      // prettier-ignore
      panel()(
        p(
          'Test ',
          link({href: 'https://gnu.org/'})('world')
        ),
      ),
    ),
  };

  const case17: CASE = {
    id: 'case17',
    target: doc(
      // prettier-ignore
      p('{<>}'),
    ),
    source: `
      <h1>
        <a href="https://gnu.org">Hello</a>
      </h1>
    `,
    result: doc(
      // prettier-ignore
      h1(
        link({ href: 'https://gnu.org' })('Hello'),
      ),
    ),
  };

  const case18: CASE = {
    id: 'case18',
    target: doc(
      // prettier-ignore
      h1('{<>}'),
    ),
    source: `
      <a href="https://gnu.org"><h1>Hello</h1></a>
    `,
    result: doc(
      // prettier-ignore
      h1(
        link({ href: 'https://gnu.org' })('Hello'),
      ),
    ),
  };

  const case19: CASE = {
    id: 'case19',
    target: doc(
      // prettier-ignore
      p('{<>}'),
    ),
    source: `
      <a href="javascript:alert('Hello');">Hello</a>
    `,
    result: doc(
      // prettier-ignore
      p('Hello'),
    ),
  };

  const case20: CASE = {
    id: 'case20',
    target: doc(
      // prettier-ignore
      p('{<>}'),
    ),
    source: `
      <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" class="blockLink" data-pm-slice="1 1 []"><h3>JavaScript - MDN Web Docs</h3><p><a data-inline-card="" href="https://developer.mozilla.org" data-card-data="">https://developer.mozilla.org</a> &nbsp;› en-US › Web › JavaScript</p></a><p>28 July 2021 —&nbsp;<em>JavaScript</em>&nbsp;(JS) is a lightweight, interpre</p>
    `,
    result: doc(
      // prettier-ignore
      h3(
        link({ href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript'})('JavaScript - MDN Web Docs'),
      ),
      p(
        link({
          href: 'https://developer.mozilla.org',
        })('https://developer.mozilla.org'),
        '  › en-US › Web › JavaScript',
      ),
      p(
        '28 July 2021 — ',
        em('JavaScript'),
        ' (JS) is a lightweight, interpre',
      ),
    ),
  };

  const case21: CASE = {
    id: 'case21',
    target: doc(
      // prettier-ignore
      p('{<>}'),
    ),
    source: `
      <span>Visit</span><a href="https://example.com">example</a><span>for do</span>
    `,
    result: doc(
      // prettier-ignore
      p(
        'Visit',
        link({ href: 'https://example.com' })('example'),
        'for do',
      ),
    ),
  };

  const case22: CASE = {
    id: 'case22',
    target: doc(
      // prettier-ignore
      p('{<>}'),
    ),
    source: `
      <span>Visit</span><span><a href="https://example.com">example</a></span><span>for do</span>
    `,
    result: doc(
      // prettier-ignore
      p(
        'Visit',
        link({ href: 'https://example.com' })('example'),
        'for do',
      ),
    ),
  };

  const case23: CASE = {
    id: 'case23',
    target: doc(
      // prettier-ignore
      p('{<>}'),
    ),
    source: `
      <a href="https://example.com">example</a><span>for do</span>
    `,
    result: doc(
      // prettier-ignore
      p(
        link({ href: 'https://example.com' })('example'),
        'for do',
      ),
    ),
  };

  const case24: CASE = {
    id: 'case24',
    target: doc(
      // prettier-ignore
      p('{<>}'),
    ),
    source: `
      <a href="https://example.com">example</a>for do
    `,
    result: doc(
      // prettier-ignore
      p(
        link({ href: 'https://example.com' })('example'),
        'for do',
      ),
    ),
  };

  const case25: CASE = {
    id: 'case25',
    target: doc(
      // prettier-ignore
      p('{<>}'),
    ),
    source: `
      visit<a href="https://example.com">example</a>for do
    `,
    result: doc(
      // prettier-ignore
      p(
        'visit',
        link({ href: 'https://example.com' })('example'),
        'for do',
      ),
    ),
  };

  const case26: CASE = {
    id: 'case26',
    target: doc(
      // prettier-ignore
      p('{<>}'),
    ),
    source: `
    <div>
      <span>
        <a href="https://gnu.org">Artist</a>
          :
          <span>

          </span>
      </span>
      <span  >
        <a  href="https://en.wikipedia.org/wiki/Adele">Adele</a>
      </span>
    </div>
    `,
    result: doc(
      // prettier-ignore
      p(
        link({ href: 'https://gnu.org' })('Artist'),
        ' : ',
        link({ href: 'https://en.wikipedia.org/wiki/Adele' })('Adele'),
      ),
    ),
  };

  const case27: CASE = {
    id: 'case27',
    target: doc(
      // prettier-ignore
      p('{<>}'),
    ),
    source: `
    <ul>
      <li>
        ... that<span> </span><b><a href="https://en.wikipedia.org/wiki/HMS_Cicala">HMS <i>Cicala</i></a></b><span>
        </span>was commanded at the 1941<span> </span>?
      </li>
    </ul>
    `,
    // // doc(bulletList(listItem(paragraph("... that ", link(strong("HMS Cicala")), " was commanded at the 1941 ?"))))

    result: doc(
      // prettier-ignore
      ul(
        li(
          p(
            '... that ',
            strong(link({ href: 'https://en.wikipedia.org/wiki/HMS_Cicala'})('HMS ')),
            em(strong(link({ href: 'https://en.wikipedia.org/wiki/HMS_Cicala'})('Cicala'))),
            ' was commanded at the 1941 ?'
          )
        )
      ),
    ),
  };

  const case28: CASE = {
    id: 'case28',
    target: doc(
      // prettier-ignore
      p('{<>}'),
    ),
    source: `
<meta charset="utf-8" />
<p data-renderer-start-pos="1">some</p>
<div
  class="rich-media-item mediaSingleView-content-wrap image-center"
  width="362"
  data-layout="center"
  data-node-type="mediaSingle"
>
  <div>
    <a
      href="https://product-fabric.atlassian.net/browse/FAB-1520"
      rel="noreferrer noopener"
      data-block-link="https://product-fabric.atlassian.net/browse/FAB-1520"
      ><div
        data-context-id="DUMMY-OBJECT-ID"
        data-type="file"
        data-node-type="media"
        data-width="362"
        data-height="501"
        data-id="c990e0f8-d061-443f-8120-32959afd4d6a"
        data-collection="MediaServicesSample"
        data-file-name="image-20211102-012839.png"
        data-file-size="124587"
        data-file-mime-type="image/png"
        data-alt=""
      >
        <div
          data-testid="media-card-view"
        >
          <div
            class="media-file-card-view"
            data-testid="media-file-card-view"
            data-test-status="complete"
            data-test-media-name="image-20211102-012839.png"
            data-test-progress="1"
          >
            <div
              class="wrapper"
            >
              <div
                class="img-wrapper"
              >
                <img
                  data-testid="media-image"
                  draggable="false"
                  alt=""
                  src="blob:https://atlaskit.atlassian.com/e5db6145-847e-4955-8ed8-a2fe342ba76f#media-blob-url=true&amp;id=c990e0f8-d061-443f-8120-32959afd4d6a&amp;collection=MediaServicesSample&amp;contextId=DUMMY-OBJECT-ID&amp;mimeType=image%2Fpng&amp;name=image-20211102-012839.png&amp;size=124587&amp;height=501&amp;width=362&amp;alt="
                />
              </div>
            </div>
          </div>
        </div></div
    ></a>
  </div>
</div>
<p data-renderer-start-pos="9" >image</p>
    `,
    result: doc(
      // prettier-ignore
      p('some'),
      mediaSingle({ layout: 'center' })(
        link({
          href: 'https://product-fabric.atlassian.net/browse/FAB-1520',
        })(
          media({
            __contextId: 'DUMMY-OBJECT-ID',
            __displayType: null,
            __external: false,
            __fileMimeType: 'image/png',
            __fileName: 'image-20211102-012839.png',
            __fileSize: 124587,
            alt: '',
            collection: 'MediaServicesSample',
            height: 501,
            id: 'c990e0f8-d061-443f-8120-32959afd4d6a',
            type: 'file',
            width: 362,
          })(),
        ),
      ),
      p('image'),
    ),
  };

  const case29: CASE = {
    id: 'case29',
    target: doc(
      // prettier-ignore
      p('{<>}'),
    ),
    source: `<meta charset='utf-8'>
<p>Intro to JavaScript:</p>
<div class="code-block" ><span><code><span class="token" >const</span> x <span class="token,operator">=</span> <span class="token" >10</span><span class="token,punctuation">;</span></code></span></div>`,
    result: doc(
      // prettier-ignore
      p('Intro to JavaScript:'),
      codeBlock()('const x = 10;'),
      p(),
    ),
  };

  const case30: CASE = {
    id: 'case30',
    target: doc(
      // prettier-ignore
      p('{<>}'),
    ),
    source: `
      <a
        href="https://gnu.org" ><img
          src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_92x30dp.png"
          height="30"
          width="92"
          data-atf="1"
          data-frt="0"
        />
      </a>
    `,
    result: doc(
      // prettier-ignore
      mediaSingle({ layout: 'center' })(
        link({ href: 'https://gnu.org' })(
          media({
            "__external": true,
            "alt": "",
            "type": "external",
            "url": "https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_92x30dp.png",
          })(),
        ),
      ),
    ),
  };

  /*
  const case31: CASE = {
    id: 'case31',
    target: doc(
      // prettier-ignore
      p('{<>}'),
    ),
    source: `<a
              href="https://gnu.org">
                <div>
                  <div>
                   <img
                     src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_92x30dp.png"
                     height="30"
                     width="92"
                     data-atf="1"
                     data-frt="0"
                   />
                  </div>
                </div>
            </a>`,
    result: doc(
      // prettier-ignore
      mediaSingle({ layout: 'center' })(
        link({ href: 'https://gnu.org' })(
          media({
            "__external": true,
            "alt": "",
            "type": "external",
            "url": "https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_92x30dp.png",
          })(),
        ),
      ),
    ),
  };

  const case32: CASE = {
    id: 'case32',
    target: doc(
      // prettier-ignore
      p('{<>}'),
    ),
    source: `<div><a
              href="https://gnu.org"><img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_92x30dp.png"
                     height="30"
                     width="92"
                     data-atf="1"
                     data-frt="0"
                   /></a></div>`,
    result: doc(
      // prettier-ignore
      mediaSingle({ layout: 'center' })(
        link({ href: 'https://gnu.org' })(
          media({
            "__external": true,
            "alt": "",
            "type": "external",
            "url": "https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_92x30dp.png",
          })(),
        ),
      ),
    ),
  };
  */

  const case33: CASE = {
    id: 'case33',
    target: doc(
      // prettier-ignore
      p('{<>}'),
    ),
    source: `
    <ul>
      <li>some</li>
      <li>text</li>
    </ul>
    `,
    result: doc(
      // prettier-ignore
      ul(
        li(
          p('some'),
        ),
        li(
          p('text'),
        ),
      ),
    ),
  };

  const case34: CASE = {
    id: 'case08',
    target: doc(
      // prettier-ignore
      p('{<>}'),
    ),
    source: `<meta charset='utf-8'>
      <div data-node-type="actionList" data-task-list-local-id="06c02ca3-a58a-4f4a-97c2-a268304af5a9" style="list-style: none; padding-left: 0" data-pm-slice="2 2 []">
        <div data-task-local-id="70eb18c7-4c63-4666-b6aa-a0077e24059d" data-task-state="TODO">action 1</div>
        <div data-task-local-id="6e49ef60-b37f-4b5f-aaf8-90dcb8a712bc" data-task-state="TODO">action 2</div>
      </div>
    `,
    result: doc(
      // prettier-ignore
      taskList({localId: expect.any(String)})(
        taskItem({localId: expect.any(String)})(
          'action 1',
        ),
        taskItem({localId: expect.any(String)})(
          'action 2',
        ),
      ),
    ),
  };

  const case35: CASE = {
    /** paste from self */
    id: 'case35',
    target: doc(
      // prettier-ignore
      p('{<>}'),
    ),
    source: `
    <meta charset='utf-8'>
    <div data-node-type="mediaSingle" data-layout="center" data-width="" data-pm-slice="0 0 []">
    <a
      href="https://ops.internal.atlassian.com/jira/browse/HOT-97158"
      data-block-link="true"
      class="blockLink"
    >
      <div data-id="28dd8159-mochi-floof"
      data-node-type="media"
      data-type="file"
      data-collection="MediaServicesSample"
      data-width="418"
      data-height="418"
      data-alt=""
      title="Attachment"
      data-file-name="image-20211213-mochi.png"
      data-file-size="112233"
      data-file-mime-type="image/png"
      data-context-id="DUMMY-OBJECT-ID"
    ></div></a></div>`,
    result: doc(
      mediaSingle({ layout: 'center' })(
        link({
          href: 'https://ops.internal.atlassian.com/jira/browse/HOT-97158',
        })(
          media({
            __contextId: 'DUMMY-OBJECT-ID',
            __displayType: null,
            __external: false,
            __fileMimeType: 'image/png',
            __fileName: 'image-20211213-mochi.png',
            __fileSize: 112233,
            alt: '',
            collection: 'MediaServicesSample',
            height: 418,
            id: '28dd8159-mochi-floof',
            type: 'file',
            width: 418,
          })(),
        ),
      ),
    ),
  };
  const case36: CASE = {
    /** case 35 without data-block-link="true" */
    id: 'case36',
    target: doc(
      // prettier-ignore
      p('{<>}'),
    ),
    source: `
    <meta charset='utf-8'>
    <div data-node-type="mediaSingle" data-layout="center" data-width="" data-pm-slice="0 0 []">
    <a
      href="https://ops.internal.atlassian.com/jira/browse/HOT-97158"
      class="blockLink"
    >
      <div data-id="28dd8159-mochi-floof"
      data-node-type="media"
      data-type="file"
      data-collection="MediaServicesSample"
      data-width="418"
      data-height="418"
      data-alt=""
      title="Attachment"
      data-file-name="image-20211213-mochi.png"
      data-file-size="112233"
      data-file-mime-type="image/png"
      data-context-id="DUMMY-OBJECT-ID"
    ></div></a></div>`,
    result: doc(
      mediaSingle({ layout: 'center' })(
        link({
          href: 'https://ops.internal.atlassian.com/jira/browse/HOT-97158',
        })(
          media({
            __contextId: 'DUMMY-OBJECT-ID',
            __displayType: null,
            __external: false,
            __fileMimeType: 'image/png',
            __fileName: 'image-20211213-mochi.png',
            __fileSize: 112233,
            alt: '',
            collection: 'MediaServicesSample',
            height: 418,
            id: '28dd8159-mochi-floof',
            type: 'file',
            width: 418,
          })(),
        ),
      ),
    ),
  };

  describe.each<CASE>([
    // prettier-ignore
    case00,
    case01,
    case02,
    case03,
    case04,
    case05,
    case06,
    case07,
    case08,
    case09,
    case10,
    case11,
    case12,
    case13,
    case14,
    case15,
    case16,
    case17,
    case18,
    case19,
    case20,
    case21,
    case22,
    case23,
    case24,
    case25,
    case26,
    case27,
    case28,
    case29,
    case30,
    // case31,
    // case32,
    case33,
    case34,
    case35,
    case36,
  ])('cases', ({ id, target, source, result }) => {
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
      it('should not wrap the block node into a link mark', () => {
        paste();

        expect(editorView.state.doc).toEqualDocument(result);
      });
    });
  });
});
