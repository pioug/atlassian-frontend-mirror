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
  HeadingLevels,
  NextEditorPlugin,
} from '@atlaskit/editor-common/types';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { blockTypePlugin } from '@atlaskit/editor-plugin-block-type';
import { quickInsertPlugin } from '@atlaskit/editor-plugin-quick-insert';
import { typeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  blockquote,
  code,
  doc,
  h1,
  h2,
  h3,
  hardBreak,
  a as link,
  p,
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
        .add(mockNodesPlugin)
        .add([analyticsPlugin, { createAnalyticsEvent }])
        .add(typeAheadPlugin)
        .add(quickInsertPlugin)
        .add(blockTypePlugin),
    });
  };

  function insertAutoformatRule(format: string) {
    const setup = editor(doc(p('{<>}')));
    const { editorView, sel } = setup;

    insertText(editorView, `${format} `, sel);
    return setup;
  }

  describe('heading rule', () => {
    describe('Analytics', () => {
      function createHeadingPayload(
        newHeadingLevel: HeadingLevels,
        inputMethod: string,
      ) {
        return {
          action: 'formatted',
          actionSubject: 'text',
          eventType: 'track',
          actionSubjectId: 'heading',
          attributes: expect.objectContaining({
            inputMethod,
            newHeadingLevel,
          }),
        };
      }

      type AutoFormatCase = {
        autoformatRule: string;
        headingLevel: HeadingLevels;
      };
      const autoFormatCases: AutoFormatCase[] = [
        { autoformatRule: '#', headingLevel: 1 },
        { autoformatRule: '##', headingLevel: 2 },
        { autoformatRule: '###', headingLevel: 3 },
        { autoformatRule: '####', headingLevel: 4 },
        { autoformatRule: '#####', headingLevel: 5 },
        { autoformatRule: '######', headingLevel: 6 },
      ];

      autoFormatCases.forEach(({ autoformatRule, headingLevel }) => {
        it(`should call Analytics GAS v3 with heading level ${headingLevel} for autoformatting '${autoformatRule}'`, () => {
          insertAutoformatRule(autoformatRule);

          expect(createAnalyticsEvent).toHaveBeenCalledWith(
            createHeadingPayload(headingLevel, 'autoformatting'),
          );
        });
      });
    });
    it('should convert "# " to heading 1', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, '# ', sel);
      expect(editorView.state.doc).toEqualDocument(doc(h1()));
    });

    it('should convert "# " after shift+enter to heading 1', () => {
      const { editorView, sel } = editor(doc(p('test', hardBreak(), '{<>}')));

      insertText(editorView, '# ', sel);
      expect(editorView.state.doc).toEqualDocument(doc(p('test'), h1()));
    });

    it('should convert "## " to heading 2', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, '## ', sel);
      expect(editorView.state.doc).toEqualDocument(doc(h2()));
    });

    it('should convert "### " to heading 3', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, '### ', sel);
      expect(editorView.state.doc).toEqualDocument(doc(h3()));
    });

    describe('from quickinsert menu', () => {
      it('should insert when no existing text', async () => {
        const { editorView, typeAheadTool } = editor(doc(p('{<>}')));

        await typeAheadTool.searchQuickInsert('h1')?.insert({ index: 0 });

        expect(editorView.state.doc).toEqualDocument(doc(h1()));
      });

      it('should insert below when in paragraph', async () => {
        const { editorView, typeAheadTool } = editor(doc(p('hello {<>}world')));

        await typeAheadTool.searchQuickInsert('h1')?.insert({ index: 0 });

        expect(editorView.state.doc).toEqualDocument(
          doc(p('hello world'), h1()),
        );
      });

      it('should send analytics v3', async () => {
        const { typeAheadTool } = editor(doc(p('{<>}')));

        await typeAheadTool.searchQuickInsert('h1')?.insert({ index: 0 });

        const expectedPayload = {
          action: 'formatted',
          actionSubject: 'text',
          eventType: 'track',
          actionSubjectId: 'heading',
          attributes: expect.objectContaining({
            inputMethod: 'quickInsert',
            newHeadingLevel: 1,
          }),
        };
        expect(createAnalyticsEvent).toHaveBeenCalledWith(expectedPayload);
      });
    });
  });

  describe('blockquote rule', () => {
    describe('Analytics', () => {
      it(`should call analytics v3 with blockquote for autoformatting '>'`, () => {
        const greatherThanRule = '>';
        const expectedPayload = {
          action: 'formatted',
          actionSubject: 'text',
          eventType: 'track',
          actionSubjectId: 'blockQuote',
          attributes: expect.objectContaining({
            inputMethod: 'autoformatting',
          }),
        };

        insertAutoformatRule(greatherThanRule);

        expect(createAnalyticsEvent).toHaveBeenCalledWith(expectedPayload);
      });
    });

    it('should convert "> " to a blockquote', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, '> ', sel);
      expect(editorView.state.doc).toEqualDocument(doc(blockquote(p())));
    });

    it('should convert "> " to a blockquote after shift+enter', () => {
      const { editorView, sel } = editor(doc(p('test', hardBreak(), '{<>}')));

      insertText(editorView, '> ', sel);
      expect(editorView.state.doc).toEqualDocument(
        doc(p('test'), blockquote(p())),
      );
    });

    it('should convert "> " to a blockquote after multiple shift+enter', () => {
      const { editorView, sel } = editor(
        doc(p('test', hardBreak(), hardBreak(), '{<>}test')),
      );

      insertText(editorView, '> ', sel);
      expect(editorView.state.doc).toEqualDocument(
        doc(p('test', hardBreak()), blockquote(p('test'))),
      );
    });

    it('should convert "> " after shift+enter to blockquote for only current line', () => {
      const { editorView, sel } = editor(
        doc(p('test1', hardBreak(), '{<>}test2', hardBreak(), 'test3')),
      );

      insertText(editorView, '> ', sel);
      expect(editorView.state.doc).toEqualDocument(
        doc(p('test1'), blockquote(p('test2')), p('test3')),
      );
    });

    it('should not convert "> " inside code mark to blockquote', () => {
      const { editorView, sel } = editor(doc(p(code('>{<>}'))));

      insertText(editorView, ' ', sel);
      expect(editorView.state.doc).toEqualDocument(doc(p(code('> '))));
    });

    it('should not convert "> " inside link to blockquote', () => {
      const { editorView, sel } = editor(
        doc(p(link({ href: 'http://www.atlassian.com' })('>{<>}'))),
      );
      insertText(editorView, ' ', sel);
      expect(editorView.state.doc).toEqualDocument(
        doc(p(link({ href: 'http://www.atlassian.com' })('>'), ' ')),
      );
    });

    it('should not convert "> " to blockquote when selection is at the end of link ', () => {
      const { editorView, sel } = editor(
        doc(p(link({ href: 'http://www.atlassian.com' })('>{<>}'))),
      );
      insertText(editorView, ' ', sel);
      expect(editorView.state.doc).toEqualDocument(
        doc(p(link({ href: 'http://www.atlassian.com' })('>'), ' ')),
      );
    });

    it('should not convert "> " to blockquote when selection is inside link ', () => {
      const { editorView, sel } = editor(
        doc(p(link({ href: 'http://www.atlassian.com' })('lol{<>}ko'))),
      );
      insertText(editorView, ' ', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(p(link({ href: 'http://www.atlassian.com' })('lol ko'))),
      );
    });
  });
});
