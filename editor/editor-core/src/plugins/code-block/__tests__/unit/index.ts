import { createIntl } from 'react-intl-next';
import type { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import { isNodeSelection } from '@atlaskit/editor-prosemirror/utils';
import type { DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import {
  code_block,
  doc,
  p,
  table,
  tr,
  td,
} from '@atlaskit/editor-test-helpers/doc-builder';
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import createAnalyticsEventMock from '@atlaskit/editor-test-helpers/create-analytics-event-mock';
import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import type { CodeBlockState } from '../../pm-plugins/main-state';
import { pluginKey as codeBlockPluginKey } from '../../plugin-key';
import {
  removeCodeBlock,
  changeLanguage,
  copyContentToClipboard,
} from '../../actions';
import { setTextSelection } from '../../../../utils';
import { copyToClipboard } from '../../../../utils/clipboard';
import codeBlockPlugin from '../../';
import { compositionPlugin } from '@atlaskit/editor-plugin-composition';
import { tablesPlugin } from '@atlaskit/editor-plugin-table';
import { basePlugin } from '../../../base';
import typeAheadPlugin from '../../../type-ahead';
import quickInsertPlugin from '../../../quick-insert';
import deprecatedAnalyticsPlugin from '../../../analytics';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { getToolbarConfig } from '../../toolbar';
import featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';

jest.mock('../../../../utils/clipboard');

describe('code-block', () => {
  const createEditor = createProsemirrorEditorFactory();
  let createAnalyticsEvent: jest.Mock<UIAnalyticsEvent>;

  const editor = (doc: DocBuilder) => {
    createAnalyticsEvent = createAnalyticsEventMock();

    const preset = new Preset<LightEditorPlugin>()
      .add([featureFlagsPlugin, {}])
      .add(basePlugin)
      .add([analyticsPlugin, { createAnalyticsEvent }])
      .add(contentInsertionPlugin)
      .add(decorationsPlugin)
      .add(compositionPlugin)
      .add([codeBlockPlugin, { appearance: 'full-page' }])
      .add(widthPlugin)
      .add(guidelinePlugin)
      .add(tablesPlugin)
      .add(typeAheadPlugin)
      .add(quickInsertPlugin)
      .add([deprecatedAnalyticsPlugin, { createAnalyticsEvent }]);

    return createEditor<CodeBlockState, PluginKey, typeof preset>({
      doc,
      preset,
      pluginKey: codeBlockPluginKey,
    });
  };

  describe('plugin', () => {
    describe('API', () => {
      it('should be able to identify code block node', () => {
        const { pluginState, refs } = editor(
          doc('{codeBlockPos}', code_block()('te{<>}xt')),
        );
        expect(pluginState.pos).toEqual(refs.codeBlockPos);
      });

      it('should not identify code block if initial selection is outside a code-block', () => {
        const { pluginState } = editor(doc(p('paragraph{<>}')));
        expect(pluginState.pos).toBe(null);
      });

      it('should be able to remove code block type using function removeCodeBlock', () => {
        const { editorView } = editor(doc(code_block()('te{<>}xt')));
        removeCodeBlock(editorView.state, editorView.dispatch);
        expect(editorView.state.doc).toEqualDocument(doc(p()));
      });

      it('should be able to remove code block type using function removeCodeBlock when codeblock is selected', () => {
        const { editorView } = editor(doc(p(), '{<node>}', code_block()('')));
        removeCodeBlock(editorView.state, editorView.dispatch);
        expect(editorView.state.doc).toEqualDocument(doc(p()));
      });

      it('should be possible to remove code block with no text inside table', () => {
        const TABLE_LOCAL_ID = 'test-table-local-id';
        const { pluginState, editorView, refs } = editor(
          doc(
            table({ localId: TABLE_LOCAL_ID })(
              tr(td({})('{codeBlockPos}', code_block()('{<>}'))),
            ),
          ),
        );
        expect(pluginState.pos).toEqual(refs.codeBlockPos);
        removeCodeBlock(editorView.state, editorView.dispatch);
        expect(editorView.state.doc).toEqualDocument(
          doc(table({ localId: TABLE_LOCAL_ID })(tr(td({})(p())))),
        );
      });

      it('should be able to remove codeBlock using function removeCodeBlock even if it has no text content', () => {
        const { pluginState, editorView, refs } = editor(
          doc('{codeBlockPos}', code_block()('{<>}')),
        );
        expect(pluginState.pos).toEqual(refs.codeBlockPos);
        removeCodeBlock(editorView.state, editorView.dispatch);
        expect(editorView.state.doc).toEqualDocument(doc(p()));
      });

      it('should not remove surrounding blocks while removing codeBlock', () => {
        const { editorView } = editor(
          doc(p('testing'), code_block()('te{<>}xt'), p('testing')),
        );
        removeCodeBlock(editorView.state, editorView.dispatch);
        expect(editorView.state.doc).toEqualDocument(
          doc(p('testing'), p('testing')),
        );
      });
    });

    describe('language picker', () => {
      describe('when selecting new language', () => {
        it('language should update', () => {
          const { editorView } = editor(doc(code_block()('text{<>}')));
          const language = 'someLanguage';
          changeLanguage(language)(editorView.state, editorView.dispatch);
          expect(editorView.state.doc).toEqualDocument(
            doc(code_block({ language: 'someLanguage' })('text')),
          );
        });
        it('language should update if changed while code block was selected', () => {
          const { editorView } = editor(doc('{<node>}', code_block()('text')));
          const language = 'someLanguage';
          changeLanguage(language)(editorView.state, editorView.dispatch);
          expect(editorView.state.doc).toEqualDocument(
            doc(code_block({ language: 'someLanguage' })('text')),
          );
        });
        it('selected code block should continue to be selected after language update', () => {
          const { editorView, refs } = editor(
            doc(p('{<>}hello'), '{codeBlockPos}', code_block()('text')),
          );
          editorView.dispatch(
            editorView.state.tr.setSelection(
              NodeSelection.create(editorView.state.doc, refs.codeBlockPos),
            ),
          );
          const [prevFrom, prevTo] = [
            editorView.state.tr.selection.from,
            editorView.state.tr.selection.to,
          ];

          const language = 'someLanguage';
          changeLanguage(language)(editorView.state, editorView.dispatch);

          expect(editorView.state.selection.from).toBe(prevFrom);
          expect(editorView.state.selection.to).toBe(prevTo);
          expect(isNodeSelection(editorView.state.selection)).toBe(true);
          expect(editorView.state.selection.$from.nodeAfter!.type).toBe(
            editorView.state.schema.nodes.codeBlock,
          );
        });
        it('unselected code block should continue to be unselected after language update', () => {
          const { editorView } = editor(
            doc(p('{<>}hello'), code_block()('text')),
          );
          const language = 'someLanguage';
          const [prevFrom, prevTo, prevType] = [
            editorView.state.tr.selection.from,
            editorView.state.tr.selection.to,
            editorView.state.tr.selection.$from.nodeAfter!.type,
          ];
          changeLanguage(language)(editorView.state, editorView.dispatch);

          expect(editorView.state.selection.from).toBe(prevFrom);
          expect(editorView.state.selection.to).toBe(prevTo);
          expect(editorView.state.selection.$from.nodeAfter!.type).toBe(
            prevType,
          );
        });
      });
    });

    describe('copy to clipboard', () => {
      const mockCopyToClipboard = copyToClipboard as jest.Mocked<any>;

      beforeEach(() => {
        mockCopyToClipboard.mockClear();
      });

      it('calls copyToClipboard if there is a content', () => {
        const { editorView } = editor(doc(code_block()('te{<>}xt')));

        copyContentToClipboard(editorView.state);
        expect(mockCopyToClipboard).toHaveBeenCalledWith('text');
      });

      it('does not call copyToClipboard if there is no content', () => {
        const { editorView } = editor(doc(code_block()()));

        copyContentToClipboard(editorView.state);
        expect(mockCopyToClipboard).not.toHaveBeenCalled();
      });
    });

    describe('keyMaps', () => {
      describe('when Enter key is pressed', () => {
        it('a new paragraph should be created in code block', () => {
          const { editorView } = editor(doc(code_block()('text{<>}')));
          sendKeyToPm(editorView, 'Enter');
          expect(editorView.state.doc).toEqualDocument(
            doc(code_block()('text\n')),
          );
        });
      });

      describe('when Enter key is pressed twice', () => {
        it('a new paragraph should be not created outside code block', () => {
          const { editorView } = editor(doc(code_block()('text{<>}')));
          sendKeyToPm(editorView, 'Enter');
          sendKeyToPm(editorView, 'Enter');
          expect(editorView.state.doc).toEqualDocument(
            doc(code_block()('text\n\n')),
          );
        });
      });
    });

    describe('#state.update', () => {
      describe('when moving within the same code block', () => {
        it('should not update state', () => {
          const {
            refs: { cbPos },
            pluginState,
            editorView,
          } = editor(doc(code_block()('{<>}codeBlock{cbPos}')));

          setTextSelection(editorView, cbPos);
          expect(codeBlockPluginKey.getState(editorView.state)).toEqual(
            pluginState,
          );
        });
      });

      describe('when leaving code block', () => {
        it('should unset the position', () => {
          const {
            refs: { pPos },
            editorView,
          } = editor(doc(p('paragraph{pPos}'), code_block()('codeBlock{<>}')));

          expect(codeBlockPluginKey.getState(editorView.state)).toBeDefined();
          setTextSelection(editorView, pPos);

          expect(codeBlockPluginKey.getState(editorView.state)).toEqual({
            pos: null,
            contentCopied: false,
            isNodeSelected: false,
            shouldIgnoreFollowingMutations: false,
          });
        });
      });

      describe('quick insert', () => {
        it('should fire analytics event when code block inserted', async () => {
          const { typeAheadTool } = editor(doc(p('{<>}')));
          await typeAheadTool.searchQuickInsert('code')?.insert({ index: 0 });

          expect(createAnalyticsEvent).toBeCalledWith({
            action: 'inserted',
            actionSubject: 'document',
            actionSubjectId: 'codeBlock',
            attributes: expect.objectContaining({ inputMethod: 'quickInsert' }),
            eventType: 'track',
          });
        });
      });

      describe('selecting a code block', () => {
        it('should disable copy to clipboard when the code block is selected', () => {
          const { editorView, refs } = editor(
            doc('{codeBlockPos}', code_block()('')),
          );

          expect(codeBlockPluginKey.getState(editorView.state)).toEqual({
            pos: 0,
            contentCopied: false,
            isNodeSelected: false,
            shouldIgnoreFollowingMutations: false,
          });

          editorView.dispatch(
            editorView.state.tr.setSelection(
              NodeSelection.create(editorView.state.doc, refs.codeBlockPos),
            ),
          );

          expect(codeBlockPluginKey.getState(editorView.state)).toEqual({
            pos: 0,
            contentCopied: false,
            isNodeSelected: true,
            shouldIgnoreFollowingMutations: false,
          });
        });
      });
    });
  });

  describe('toolbar', () => {
    const { editorView } = editor(doc(code_block({})('Some code here')));
    const intl = createIntl({
      locale: 'en',
    });

    it('should not show clipboard button in toolbar when allowCopyToClipboard is false', () => {
      const createToolbar = getToolbarConfig(false, undefined);
      // @ts-ignore
      const toolbar = createToolbar(editorView.state, intl, {});

      expect(toolbar?.items).toHaveLength(3);
    });

    it('should show clipboard button in toolbar when allowCopyToClipboard is true', () => {
      const createToolbar = getToolbarConfig(true, undefined);
      // @ts-ignore
      const toolbar = createToolbar(editorView.state, intl, {});

      expect(toolbar?.items).toHaveLength(5);
      // @ts-ignore
      const button = toolbar.items[2] as { onClick: () => boolean };
      expect(button.onClick).toEqual(copyContentToClipboard);
    });

    it('should find the selected language from the language provided', () => {
      const { editorView } = editor(
        doc(code_block({ language: 'javascript' })('Some code here')),
      );

      const createToolbar = getToolbarConfig(false, undefined);
      // @ts-ignore
      const toolbar = createToolbar(editorView.state, intl, {});

      expect(toolbar?.items).toHaveLength(3);
      // @ts-ignore
      expect(toolbar?.items[0].defaultValue).toEqual({
        label: 'JavaScript',
        value: 'javascript',
        alias: ['javascript', 'js'],
      });
    });

    it('should find the selected language from the language provided if it is an alias', () => {
      const { editorView } = editor(
        doc(code_block({ language: 'js' })('Some code here')),
      );

      const createToolbar = getToolbarConfig(false, undefined);
      // @ts-ignore
      const toolbar = createToolbar(editorView.state, intl, {});

      expect(toolbar?.items).toHaveLength(3);
      // @ts-ignore
      expect(toolbar?.items[0].defaultValue).toEqual({
        label: 'JavaScript',
        value: 'javascript',
        alias: ['javascript', 'js'],
      });
    });

    it('should not find the selected language from the language provided does not exist', () => {
      const { editorView } = editor(
        doc(code_block({ language: 'patagonia' })('Some code here')),
      );

      const createToolbar = getToolbarConfig(false, undefined);
      // @ts-ignore
      const toolbar = createToolbar(editorView.state, intl, {});

      expect(toolbar?.items).toHaveLength(3);
      // @ts-ignore
      expect(toolbar?.items[0].defaultValue).toEqual(undefined);
    });
  });
});
