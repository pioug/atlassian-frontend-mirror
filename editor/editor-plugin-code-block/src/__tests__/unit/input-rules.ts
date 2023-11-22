import {
  code as codeAdf,
  link as linkAdf,
  strong as strongAdf,
  table as tableAdf,
  tableCell as tableCellAdf,
  tableHeader as tableHeaderAdf,
  tableRow as tableRowAdf,
} from '@atlaskit/adf-schema';
import type {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import type {
  DocBuilder,
  NextEditorPlugin,
} from '@atlaskit/editor-common/types';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { blockTypePlugin } from '@atlaskit/editor-plugin-block-type';
import { codeBlockPlugin } from '@atlaskit/editor-plugin-code-block';
import { compositionPlugin } from '@atlaskit/editor-plugin-composition';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import { indentationPlugin } from '@atlaskit/editor-plugin-indentation';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  br,
  code_block,
  doc,
  hardBreak,
  indentation,
  p,
  strong,
  table,
  td,
  th,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { insertText } from '@atlaskit/editor-test-helpers/transactions';

const mockNodesPlugin: NextEditorPlugin<'nodesPlugin'> = ({}) => ({
  name: 'nodesPlugin',
  nodes() {
    return [
      { name: 'table', node: tableAdf },
      { name: 'tableRow', node: tableRowAdf },
      { name: 'tableCell', node: tableCellAdf },
      { name: 'tableHeader', node: tableHeaderAdf },
    ];
  },
  marks() {
    return [
      { name: 'link', mark: linkAdf },
      { name: 'strong', mark: strongAdf },
      { name: 'code', mark: codeAdf },
    ];
  },
});

describe('inputrules', () => {
  const createEditor = createProsemirrorEditorFactory();

  let createAnalyticsEvent: CreateUIAnalyticsEvent;

  const editor = (doc: DocBuilder) => {
    createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));

    return createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        // for both
        .add(mockNodesPlugin)
        .add([featureFlagsPlugin, {}])
        .add([analyticsPlugin, { createAnalyticsEvent }])
        .add(blockTypePlugin)
        .add(indentationPlugin)
        .add(decorationsPlugin)
        .add(compositionPlugin)
        .add([codeBlockPlugin, { appearance: 'full-page' }]),
    });
  };

  describe('heading rule', () => {
    it('should not convert "# " to heading 1 when inside a code_block', () => {
      const { editorView, sel } = editor(doc(code_block()('{<>}')));

      insertText(editorView, '# ', sel);
      expect(editorView.state.doc).toEqualDocument(doc(code_block()('# ')));
    });

    it('should not convert "## " to heading 1 when inside a code_block', () => {
      const { editorView, sel } = editor(doc(code_block()('{<>}')));

      insertText(editorView, '## ', sel);
      expect(editorView.state.doc).toEqualDocument(doc(code_block()('## ')));
    });

    it('should not convert "### " to heading 3 when inside a code_block', () => {
      const { editorView, sel } = editor(doc(code_block()('{<>}')));

      insertText(editorView, '### ', sel);
      expect(editorView.state.doc).toEqualDocument(doc(code_block()('### ')));
    });
  });

  describe('blockquote rule', () => {
    it('should not convert "> " to a blockquote when inside a code_block', () => {
      const { editorView, sel } = editor(doc(code_block()('{<>}')));

      insertText(editorView, '> ', sel);
      expect(editorView.state.doc).toEqualDocument(doc(code_block()('> ')));
    });
  });

  describe('codeblock rule', () => {
    const analyticsV3Payload = {
      action: 'inserted',
      actionSubject: 'document',
      actionSubjectId: 'codeBlock',
      attributes: expect.objectContaining({
        inputMethod: 'autoformatting',
      }),
      eventType: 'track',
    };
    let editorView: EditorView;
    let sel: number;

    it('should remove indentation and convert "```" to a code block', () => {
      ({ editorView, sel } = editor(
        doc(indentation({ level: 3 })(p('{<>}hello', br(), 'world'))),
      ));
      insertText(editorView, '```', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(code_block()('hello\nworld')),
      );
    });

    describe('typing "```" after text', () => {
      beforeEach(() => {
        ({ editorView, sel } = editor(doc(p('{<>}hello', br(), 'world'))));
        insertText(editorView, '```', sel);
      });

      it('should convert "```" to a code block', () => {
        expect(editorView.state.doc).toEqualDocument(
          doc(code_block()('hello\nworld')),
        );
      });

      it('should fire analytics event', () => {
        expect(createAnalyticsEvent).toBeCalledWith(analyticsV3Payload);
      });
    });

    describe('typing "```" after shift+enter', () => {
      beforeEach(() => {
        ({ editorView, sel } = editor(doc(p('test', hardBreak(), '{<>}'))));
        insertText(editorView, '```', sel);
      });

      it('should convert "```" to a code block', () => {
        expect(editorView.state.doc).toEqualDocument(
          doc(p('test', hardBreak()), code_block()()),
        );
      });

      it('should fire analytics event', () => {
        expect(createAnalyticsEvent).toBeCalledWith(analyticsV3Payload);
      });
    });

    describe('typing "```" in middle of paragraph', () => {
      beforeEach(() => {
        ({ editorView, sel } = editor(doc(p('code ``{<>}block!'))));
        insertText(editorView, '`', sel);
      });

      it('should convert "```" to a code block', () => {
        expect(editorView.state.doc).toEqualDocument(
          doc(p('code '), code_block()('block!')),
        );
      });

      it('should fire analytics event', () => {
        expect(createAnalyticsEvent).toBeCalledWith(analyticsV3Payload);
      });
    });

    describe('typing "```" at end of paragraph', () => {
      beforeEach(() => {
        ({ editorView, sel } = editor(doc(p('code ``{<>}'))));
        insertText(editorView, '`', sel);
      });

      it('should convert "```" to a code block without preceding content', () => {
        expect(editorView.state.doc).toEqualDocument(
          doc(p('code '), code_block()()),
        );
      });

      it('should fire analytics event', () => {
        expect(createAnalyticsEvent).toBeCalledWith(analyticsV3Payload);
      });
    });

    describe('typing "```" at end of a long paragraph', () => {
      const longParagraph = 'Hello world. '.repeat(50);
      beforeEach(() => {
        ({ editorView, sel } = editor(doc(p(`${longParagraph} \`\`{<>}`))));
        insertText(editorView, '`', sel);
      });

      it('should not replace text outside of matched word', () => {
        expect(editorView.state.doc).toEqualDocument(
          doc(p(`${longParagraph} `), code_block()()),
        );
      });
    });

    describe('typing "```" after space', () => {
      beforeEach(() => {
        ({ editorView, sel } = editor(doc(p(' ``{<>}'))));
        insertText(editorView, '`', sel);
      });

      it('should convert "```" to a code block without first character', () => {
        expect(editorView.state.doc).toEqualDocument(
          doc(p(' '), code_block()()),
        );
      });

      it('should fire analytics event', () => {
        expect(createAnalyticsEvent).toBeCalledWith(analyticsV3Payload);
      });
    });

    describe('typing "```" before formatted text', () => {
      it('should convert "```" to a code block', () => {
        const { editorView, sel } = editor(doc(p(strong('``{<>}bold')), p()));
        insertText(editorView, '`', sel);

        expect(editorView.state.doc).toEqualDocument(
          doc(code_block({})('bold'), p()),
        );
      });

      it('should fire analytics event', () => {
        expect(createAnalyticsEvent).toBeCalledWith(analyticsV3Payload);
      });
    });

    describe('typing "```" in a table header', () => {
      const TABLE_LOCAL_ID = 'test-table-local-id';
      it('should convert "```" to a code block', () => {
        const { editorView, sel } = editor(
          doc(
            table({
              isNumberColumnEnabled: false,
              layout: 'default',
              localId: TABLE_LOCAL_ID,
            })(tr(th({})(p(strong('``{<>}'))), td({})(p()))),
          ),
        );
        insertText(editorView, '`', sel);

        expect(editorView.state.doc).toEqualDocument(
          doc(
            table({
              isNumberColumnEnabled: false,
              layout: 'default',
              localId: TABLE_LOCAL_ID,
            })(tr(th({})(code_block({})()), td({})(p()))),
          ),
        );
        // It should also put the cursor into the codeblock
        expect(editorView.state.selection.anchor).toEqual(4);
      });

      it('should fire analytics event', () => {
        expect(createAnalyticsEvent).toBeCalledWith(analyticsV3Payload);
      });
    });
  });
});
