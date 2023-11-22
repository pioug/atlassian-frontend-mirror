import {
  codeBlock as codeBlockAdf,
  panel as panelAdf,
  table as tableAdf,
  tableCell as tableCellAdf,
  tableRow as tableRowAdf,
} from '@atlaskit/adf-schema';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type {
  DocBuilder,
  NextEditorPlugin,
} from '@atlaskit/editor-common/types';
import { browser, setTextSelection } from '@atlaskit/editor-common/utils';
import type { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { CellSelection } from '@atlaskit/editor-tables';
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
  code_block,
  doc,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  panel,
  table,
  td,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { insertText } from '@atlaskit/editor-test-helpers/transactions';

import { HEADING_1 } from '../../../consts';
import type { BlockTypeState, TextBlockTypes } from '../../../index';
import { blockTypePlugin } from '../../../index';
import { insertBlockQuoteWithAnalytics, setBlockType } from '../../commands';
import { pluginKey as blockTypePluginKey } from '../../pm-plugins/main';

const mockNodesPlugin: NextEditorPlugin<'nodesPlugin'> = ({}) => ({
  name: 'nodesPlugin',
  nodes() {
    return [
      { name: 'panel', node: panelAdf(true) },
      { name: 'codeBlock', node: codeBlockAdf },
      { name: 'table', node: tableAdf },
      { name: 'tableRow', node: tableRowAdf },
      { name: 'tableCell', node: tableCellAdf },
    ];
  },
});

describe('block-type', () => {
  const createEditor = createProsemirrorEditorFactory();
  const attachAnalyticsEvent = jest.fn().mockImplementation(() => () => {});
  const mockEditorAnalyticsAPI: EditorAnalyticsAPI = {
    attachAnalyticsEvent,
  };
  const editor = (doc: DocBuilder) => {
    const preset = new Preset<LightEditorPlugin>()
      .add(mockNodesPlugin)
      .add(blockTypePlugin);

    return createEditor<BlockTypeState, PluginKey, typeof preset>({
      doc,
      preset,
      pluginKey: blockTypePluginKey,
    });
  };

  it('should be able to change to normal text', () => {
    const { editorView, editorAPI } = editor(doc(h1('te{<>}xt')));

    editorAPI?.core.actions.execute(setBlockType('normal'));
    expect(editorView.state.doc).toEqualDocument(doc(p('text')));
  });

  [h1, h2, h3, h4, h5, h6].forEach((builder, idx) => {
    const level = idx + 1;

    it(`should be able to change to heading${level}`, () => {
      const { editorView, editorAPI } = editor(doc(p('te{<>}xt')));
      editorAPI?.core.actions.execute(
        setBlockType(`heading${level}` as TextBlockTypes),
      );
      expect(editorView.state.doc).toEqualDocument(doc(builder('text')));
    });
  });

  it('should be able to change to normal text within multiple table cells', () => {
    const { editorView, refs, editorAPI } = editor(
      doc(
        table({
          isNumberColumnEnabled: false,
          layout: 'default',
          localId: 'test-table-local-id',
        })(tr(td()(h1('{from}a1')), td()(h1('{to}a2')), td()(h1('a3')))),
      ),
    );
    const { dispatch } = editorView;

    const sel = new CellSelection(
      editorView.state.doc.resolve(refs.from - 2),
      editorView.state.doc.resolve(refs.to - 2),
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch(editorView.state.tr.setSelection(sel as any));

    editorAPI?.core.actions.execute(setBlockType('normal'));

    expect(editorView.state.doc).toEqualDocument(
      doc(
        table({
          isNumberColumnEnabled: false,
          layout: 'default',
          localId: 'test-table-local-id',
        })(tr(td()(p('a1')), td()(p('a2')), td()(h1('a3')))),
      ),
    );
  });

  [h1, h2, h3, h4, h5, h6].forEach((builder, idx) => {
    const level = idx + 1;

    it(`should be able to change to heading${level} within multiple table cells`, () => {
      const { editorView, refs, editorAPI } = editor(
        doc(
          table({
            isNumberColumnEnabled: false,
            layout: 'default',
            localId: 'test-table-local-id',
          })(tr(td()(p('{from}a1')), td()(p('{to}a2')), td()(p('a3')))),
        ),
      );
      const { dispatch } = editorView;

      const sel = new CellSelection(
        editorView.state.doc.resolve(refs.from - 2),
        editorView.state.doc.resolve(refs.to - 2),
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dispatch(editorView.state.tr.setSelection(sel as any));

      editorAPI?.core.actions.execute(
        setBlockType(`heading${level}` as TextBlockTypes),
      );

      expect(editorView.state.doc).toEqualDocument(
        doc(
          table({
            isNumberColumnEnabled: false,
            layout: 'default',
            localId: 'test-table-local-id',
          })(tr(td()(builder('a1')), td()(builder('a2')), td()(p('a3')))),
        ),
      );
    });
  });

  describe('block quote', () => {
    it('should create analytics GAS v3 event', () => {
      const inputMethod = INPUT_METHOD.TOOLBAR;
      const expectedPayload = {
        action: ACTION.FORMATTED,
        actionSubject: ACTION_SUBJECT.TEXT,
        eventType: EVENT_TYPE.TRACK,
        actionSubjectId: ACTION_SUBJECT_ID.FORMAT_BLOCK_QUOTE,
        attributes: expect.objectContaining({
          inputMethod,
        }),
      };
      const { editorView } = editor(doc(p('te{<>}xt')));
      const { state, dispatch } = editorView;

      insertBlockQuoteWithAnalytics(inputMethod, mockEditorAnalyticsAPI)(
        state,
        dispatch,
      );
      expect(attachAnalyticsEvent).toHaveBeenCalledWith(
        expectedPayload,
        undefined,
      );
    });

    it('should be able to change to block quote', () => {
      const { editorView } = editor(doc(p('te{<>}xt')));
      const { state, dispatch } = editorView;

      insertBlockQuoteWithAnalytics(
        INPUT_METHOD.TOOLBAR,
        mockEditorAnalyticsAPI,
      )(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(doc(blockquote(p('text'))));
    });

    describe('when rendering a block quote', () => {
      it('should not be selectable', () => {
        const { editorView } = editor(doc(blockquote(p('{<>}text'))));
        const node = editorView.state.doc.nodeAt(0);

        if (node) {
          expect(node.type.spec.selectable).toBe(false);
        }
      });
    });
  });

  it('should be able to identify normal', () => {
    const { editorAPI } = editor(doc(p('te{<>}xt')));
    const pluginState = editorAPI.blockType.sharedState.currentState()!;
    expect(pluginState.currentBlockType.name).toBe('normal');
  });

  it('should have all of the present blocks type panel, blockQuote, codeBlock in availableWrapperBlockTypes', () => {
    const { editorAPI } = editor(doc(p('te{<>}xt')));
    const pluginState = editorAPI.blockType.sharedState.currentState()!;
    expect(pluginState.availableWrapperBlockTypes.length).toBe(3);
    expect(
      pluginState.availableWrapperBlockTypes.some(
        blockType => blockType.name === 'panel',
      ),
    ).toBe(true);
    expect(
      pluginState.availableWrapperBlockTypes.some(
        blockType => blockType.name === 'codeblock',
      ),
    ).toBe(true);
    expect(
      pluginState.availableWrapperBlockTypes.some(
        blockType => blockType.name === 'blockquote',
      ),
    ).toBe(true);
  });

  it('should be able to identify normal even if there are multiple blocks', () => {
    const { editorAPI } = editor(doc(p('te{<}xt'), p('text'), p('te{>}xt')));
    const pluginState = editorAPI.blockType.sharedState.currentState()!;
    expect(pluginState.currentBlockType.name).toBe('normal');
  });

  it('should set currentBlockType to Other if there are blocks of multiple types', () => {
    const { editorAPI } = editor(doc(p('te{<}xt'), h1('text'), p('te{>}xt')));
    const pluginState = editorAPI.blockType.sharedState.currentState()!;
    expect(pluginState.currentBlockType.name).toBe('other');
  });

  it('should be able to identify heading1', () => {
    const { editorAPI } = editor(doc(h1('te{<>}xt')));
    const pluginState = editorAPI.blockType.sharedState.currentState()!;
    expect(pluginState.currentBlockType.name).toBe('heading1');
  });

  it('should be able to identify heading2', () => {
    const { editorAPI } = editor(doc(h2('te{<>}xt')));
    const pluginState = editorAPI.blockType.sharedState.currentState()!;
    expect(pluginState.currentBlockType.name).toBe('heading2');
  });

  it('should be able to identify heading3', () => {
    const { editorAPI } = editor(doc(h3('te{<>}xt')));
    const pluginState = editorAPI.blockType.sharedState.currentState()!;
    expect(pluginState.currentBlockType.name).toBe('heading3');
  });

  it('should be able to change to back to paragraph and then change to blockquote', () => {
    const { editorView, editorAPI } = editor(doc(p('te{<>}xt')));
    const { state, dispatch } = editorView;

    editorAPI?.core.actions.execute(setBlockType('normal'));
    insertBlockQuoteWithAnalytics(INPUT_METHOD.TOOLBAR, mockEditorAnalyticsAPI)(
      state,
      dispatch,
    );
    expect(editorView.state.doc).toEqualDocument(doc(blockquote(p('text'))));
  });

  it('should not toggle block type', () => {
    const { editorView, editorAPI } = editor(doc(p('te{<>}xt')));

    editorAPI?.core.actions.execute(setBlockType('normal'));

    expect(editorView.state.doc).toEqualDocument(doc(p('text')));
  });

  it('should be able to change block types when selecting two nodes', () => {
    const { editorView, editorAPI } = editor(doc(p('li{<}ne1'), p('li{>}ne2')));

    editorAPI?.core.actions.execute(setBlockType('heading1'));

    expect(editorView.state.doc).toEqualDocument(doc(h1('line1'), h1('line2')));
  });

  it('should be able to change multiple paragraphs into one blockquote', () => {
    const { editorView } = editor(
      doc(p('li{<}ne1'), p('li{>}ne2'), p('li{>}ne3')),
    );
    const { state, dispatch } = editorView;

    insertBlockQuoteWithAnalytics(INPUT_METHOD.TOOLBAR, mockEditorAnalyticsAPI)(
      state,
      dispatch,
    );
    expect(editorView.state.doc).toEqualDocument(
      doc(blockquote(p('li{<}ne1'), p('li{>}ne2'), p('li{>}ne3'))),
    );
  });

  it('should change state when selecting different block types', () => {
    const { editorView, refs } = editor(
      doc(h1('te{h1Pos}xt'), p('te{pPos}xt')),
    );
    const { h1Pos, pPos } = refs;

    setTextSelection(editorView, h1Pos);
    expect(
      blockTypePluginKey.getState(editorView.state)?.currentBlockType.name,
    ).toBe('heading1');

    setTextSelection(editorView, pPos);
    expect(
      blockTypePluginKey.getState(editorView.state)?.currentBlockType.name,
    ).toBe('normal');
  });

  it('should dispatch events in response to changes', () => {
    const { pluginState, eventDispatcher, editorAPI } = editor(
      doc(p('te{<>}xt')),
    );
    const spy = jest.fn();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    eventDispatcher.on((blockTypePluginKey as any).key, spy);
    editorAPI?.core.actions.execute(setBlockType('heading1'));

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({
      ...pluginState,
      currentBlockType: HEADING_1,
    });
  });

  describe('toggleBlockType', () => {
    describe('when origin block type is the same as target block type', () => {
      it('does not convert to a paragraph', () => {
        const { editorView, editorAPI } = editor(doc(h1('text')));

        editorAPI?.core.actions.execute(setBlockType('heading1'));
        expect(editorView.state.doc).toEqualDocument(doc(h1('text')));
      });
    });
  });

  describe('insertBlockType', () => {
    it('should be able to insert blockquote', () => {
      const { editorView } = editor(doc(p()));
      const { state, dispatch } = editorView;
      insertBlockQuoteWithAnalytics(
        INPUT_METHOD.TOOLBAR,
        mockEditorAnalyticsAPI,
      )(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(doc(blockquote(p())));
    });

    it('should wrap current selection in blockquote if possible', () => {
      const { editorView } = editor(doc(p('test{<>}')));
      const { state, dispatch } = editorView;
      insertBlockQuoteWithAnalytics(
        INPUT_METHOD.TOOLBAR,
        mockEditorAnalyticsAPI,
      )(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(blockquote(p('test{<>}'))),
      );
    });

    it('should be able to insert blockquote after current selection if current selection can not be wrapper in blockquote', () => {
      const { editorView } = editor(doc(h1('test{<>}')));
      const { state, dispatch } = editorView;
      insertBlockQuoteWithAnalytics(
        INPUT_METHOD.TOOLBAR,
        mockEditorAnalyticsAPI,
      )(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(h1('test'), blockquote(p())),
      );
    });

    it('should be able to insert blockquote after current selection if current selection is in the middle of a node that cannot contain a blockquote', () => {
      const { editorView } = editor(doc(panel()(p('test{<>} insertion'))));
      const { state, dispatch } = editorView;
      insertBlockQuoteWithAnalytics(
        INPUT_METHOD.TOOLBAR,
        mockEditorAnalyticsAPI,
      )(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(panel()(p('test insertion')), blockquote(p())),
      );
    });
  });

  describe('blockTypesDisabled', () => {
    it('should be false if current selection has no wrapper', () => {
      const { editorAPI } = editor(doc(p('text{<>}')));
      const pluginState = editorAPI.blockType.sharedState.currentState()!;
      expect(pluginState.blockTypesDisabled).toBe(false);
    });

    it('should be false if current selection is wrapped in panel', () => {
      const { editorAPI } = editor(doc(panel()(p('text{<>}'))));
      const pluginState = editorAPI.blockType.sharedState.currentState()!;
      expect(pluginState.blockTypesDisabled).toBe(false);
    });

    it('should be true if current selection is wrapped in blockquote', () => {
      const { editorAPI } = editor(doc(blockquote(p('text{<>}'))));
      const pluginState = editorAPI.blockType.sharedState.currentState()!;
      expect(pluginState.blockTypesDisabled).toBe(true);
    });

    it('should be true if current selection is wrapped in codeblock', () => {
      const { editorAPI } = editor(doc(code_block()('testing{<>}')));
      const pluginState = editorAPI.blockType.sharedState.currentState()!;
      expect(pluginState.blockTypesDisabled).toBe(true);
    });
  });

  describe('block type in comment editor', () => {
    const editor = (doc: DocBuilder) =>
      createEditor({
        doc,
        preset: new Preset<LightEditorPlugin>()
          .add(mockNodesPlugin)
          .add([blockTypePlugin, { lastNodeMustBeParagraph: true }]),
      });

    it('should create empty terminal empty paragraph when heading is created', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));
      insertText(editorView, '# ', sel);
      expect(editorView.state.doc).toEqualDocument(doc(h1(''), p('')));
    });
  });

  describe('handleKeyDown', () => {
    let _mac: boolean;
    beforeEach(() => {
      _mac = browser.mac;
    });
    afterEach(() => {
      browser.mac = _mac;
    });

    describe('on Mac', () => {
      beforeEach(() => {
        browser.mac = true;
      });

      it('should convert text to heading when Cmd+Opt+{heading level} hit', () => {
        const { editorView } = editor(doc(p('hello{<>}')));
        sendKeyToPm(editorView, 'Cmd-Alt-1');
        expect(editorView.state.doc).toEqualDocument(doc(h1('hello')));
      });

      it('should convert heading to paragraph when Cmd+Opt+0 hit', () => {
        const { editorView } = editor(doc(h1('hello{<>}')));
        sendKeyToPm(editorView, 'Cmd-Alt-0');
        expect(editorView.state.doc).toEqualDocument(doc(p('hello')));
      });
    });

    describe('on Windows', () => {
      beforeEach(() => {
        browser.mac = false;
      });

      /**
       * When keydown events come through in the browser, there is an event for each key
       * and we store the location of the alt key from its own keydown event
       * So in these tests we call sendKeyToPm with the alt key first so it can be stored
       */

      it('should convert text to heading when Ctrl+LeftAlt+{heading level} hit', () => {
        const { editorView } = editor(doc(p('hello{<>}')));
        sendKeyToPm(editorView, 'LeftAlt');
        sendKeyToPm(editorView, 'Ctrl-LeftAlt-1');
        expect(editorView.state.doc).toEqualDocument(doc(h1('hello')));
      });

      it('should convert heading to paragraph when Ctrl+LeftAlt+0 hit', () => {
        const { editorView } = editor(doc(h1('hello{<>}')));
        sendKeyToPm(editorView, 'LeftAlt');
        sendKeyToPm(editorView, 'Ctrl-LeftAlt-0');
        expect(editorView.state.doc).toEqualDocument(doc(p('hello')));
      });

      it('should not convert text to heading when Ctrl+RightAlt+{heading level} hit', () => {
        const { editorView } = editor(doc(p('hello{<>}')));
        sendKeyToPm(editorView, 'RightAlt');
        sendKeyToPm(editorView, 'Ctrl-RightAlt-1');
        expect(editorView.state.doc).toEqualDocument(doc(p('hello')));
      });

      it('should not convert heading to paragraph when Ctrl+RightAlt+0 hit', () => {
        const { editorView } = editor(doc(h1('hello{<>}')));
        sendKeyToPm(editorView, 'RightAlt');
        sendKeyToPm(editorView, 'Ctrl-RightAlt-0');
        expect(editorView.state.doc).toEqualDocument(doc(h1('hello')));
      });
    });

    describe('allowBlockType', () => {
      it('should not return blockquote node', () => {
        const blockQuote = blockTypePlugin({
          config: {
            allowBlockType: { exclude: ['blockquote'] },
          },
        });

        if (blockQuote.nodes) {
          const nodes = blockQuote.nodes();
          const hasBlockQuote = nodes.some(node => node.name === 'blockquote');
          expect(hasBlockQuote).toBeFalsy();
        }

        expect.hasAssertions();
      });
    });
  });
});
