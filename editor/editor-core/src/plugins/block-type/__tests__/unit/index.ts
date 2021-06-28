import {
  blockquote,
  code_block,
  panel,
  doc,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import { insertText } from '@atlaskit/editor-test-helpers/transactions';

import { browser } from '@atlaskit/editor-common';
import {
  pluginKey as blockTypePluginKey,
  BlockTypeState,
} from '../../pm-plugins/main';
import { setTextSelection } from '../../../../utils';
import {
  setBlockType,
  insertBlockType,
  insertBlockTypesWithAnalytics,
} from '../../commands';
import { HEADING_1 } from '../../types';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import analyticsPlugin, {
  AnalyticsEventPayload,
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  ACTION_SUBJECT_ID,
  INPUT_METHOD,
} from '../../../analytics';
import { PluginKey } from 'prosemirror-state';
import blockTypePlugin from '../../';
import panelPlugin from '../../../panel';
import codeBlockPlugin from '../../../code-block';

describe('block-type', () => {
  const createEditor = createProsemirrorEditorFactory();
  let createAnalyticsEvent: CreateUIAnalyticsEvent;

  const editor = (doc: DocBuilder) => {
    createAnalyticsEvent = jest.fn(
      () =>
        ({
          fire() {},
        } as UIAnalyticsEvent),
    );
    return createEditor<BlockTypeState, PluginKey>({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add(blockTypePlugin)
        .add(panelPlugin)
        .add(codeBlockPlugin)
        .add([analyticsPlugin, { createAnalyticsEvent }]),
      pluginKey: blockTypePluginKey,
    });
  };

  it('should be able to change to normal text', () => {
    const { editorView } = editor(doc(h1('te{<>}xt')));
    const { state, dispatch } = editorView;

    setBlockType('normal')(state, dispatch);
    expect(editorView.state.doc).toEqualDocument(doc(p('text')));
  });

  [h1, h2, h3, h4, h5, h6].forEach((builder, idx) => {
    const level = idx + 1;

    it(`should be able to change to heading${level}`, () => {
      const { editorView } = editor(doc(p('te{<>}xt')));
      const { state, dispatch } = editorView;

      setBlockType(`heading${level}`)(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(doc(builder('text')));
    });
  });

  describe('block quote', () => {
    it('should create analytics GAS v3 event', () => {
      const inputMethod = INPUT_METHOD.TOOLBAR;
      const expectedPayload: AnalyticsEventPayload = {
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

      insertBlockTypesWithAnalytics('blockquote', inputMethod)(state, dispatch);
      expect(createAnalyticsEvent).toHaveBeenCalledWith(expectedPayload);
    });

    it('should be able to change to block quote', () => {
      const { editorView } = editor(doc(p('te{<>}xt')));
      const { state, dispatch } = editorView;

      insertBlockTypesWithAnalytics('blockquote', INPUT_METHOD.TOOLBAR)(
        state,
        dispatch,
      );
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

  describe('code block', () => {
    it('should be able to insert code block', () => {
      const { editorView } = editor(doc(p('te{<>}xt')));
      const { state, dispatch } = editorView;

      insertBlockTypesWithAnalytics('codeblock', INPUT_METHOD.TOOLBAR)(
        state,
        dispatch,
      );

      expect(editorView.state.doc).toEqualDocument(
        doc(p('te'), code_block()(), p('xt')),
      );
    });

    it('should fire analytics event', () => {
      const { editorView } = editor(doc(p('te{<>}xt')));
      const { state, dispatch } = editorView;
      insertBlockTypesWithAnalytics('codeblock', INPUT_METHOD.TOOLBAR)(
        state,
        dispatch,
      );

      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: 'inserted',
        actionSubject: 'document',
        eventType: 'track',
        actionSubjectId: 'codeBlock',
        attributes: expect.objectContaining({ inputMethod: 'toolbar' }),
      });
    });
  });

  describe('panel', () => {
    it('should be able to insert panel', () => {
      const { editorView } = editor(doc(p('{<>}')));
      const { state, dispatch } = editorView;

      insertBlockType('panel')(state, dispatch);

      expect(editorView.state.doc).toEqualDocument(
        doc(panel({ type: 'info' })(p())),
      );
    });

    it('should fire analytics event', () => {
      const { editorView } = editor(doc(p('te{<>}xt')));
      const { state, dispatch } = editorView;
      insertBlockTypesWithAnalytics('panel', INPUT_METHOD.TOOLBAR)(
        state,
        dispatch,
      );

      expect(createAnalyticsEvent).toBeCalledWith({
        action: 'inserted',
        actionSubject: 'document',
        eventType: 'track',
        actionSubjectId: 'panel',
        attributes: expect.objectContaining({
          inputMethod: 'toolbar',
          panelType: 'info',
        }),
      });

      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: 'inserted',
        actionSubject: 'document',
        eventType: 'track',
        actionSubjectId: 'panel',
        attributes: expect.objectContaining({
          inputMethod: 'toolbar',
          panelType: 'info',
        }),
      });
    });
  });

  it('should be able to identify normal', () => {
    const { pluginState } = editor(doc(p('te{<>}xt')));
    expect(pluginState.currentBlockType.name).toBe('normal');
  });

  it('should have all of the present blocks type panel, blockQuote, codeBlock in availableWrapperBlockTypes', () => {
    const { pluginState } = editor(doc(p('te{<>}xt')));
    expect(pluginState.availableWrapperBlockTypes.length).toBe(3);
    expect(
      pluginState.availableWrapperBlockTypes.some(
        (blockType) => blockType.name === 'panel',
      ),
    ).toBe(true);
    expect(
      pluginState.availableWrapperBlockTypes.some(
        (blockType) => blockType.name === 'codeblock',
      ),
    ).toBe(true);
    expect(
      pluginState.availableWrapperBlockTypes.some(
        (blockType) => blockType.name === 'blockquote',
      ),
    ).toBe(true);
  });

  it('should be able to identify normal even if there are multiple blocks', () => {
    const { pluginState } = editor(doc(p('te{<}xt'), p('text'), p('te{>}xt')));
    expect(pluginState.currentBlockType.name).toBe('normal');
  });

  it('should set currentBlockType to Other if there are blocks of multiple types', () => {
    const { pluginState } = editor(doc(p('te{<}xt'), h1('text'), p('te{>}xt')));
    expect(pluginState.currentBlockType.name).toBe('other');
  });

  it('should be able to identify heading1', () => {
    const { pluginState } = editor(doc(h1('te{<>}xt')));
    expect(pluginState.currentBlockType.name).toBe('heading1');
  });

  it('should be able to identify heading2', () => {
    const { pluginState } = editor(doc(h2('te{<>}xt')));
    expect(pluginState.currentBlockType.name).toBe('heading2');
  });

  it('should be able to identify heading3', () => {
    const { pluginState } = editor(doc(h3('te{<>}xt')));
    expect(pluginState.currentBlockType.name).toBe('heading3');
  });

  it('should be able to change to back to paragraph and then change to blockquote', () => {
    const { editorView } = editor(doc(p('te{<>}xt')));
    const { state, dispatch } = editorView;

    setBlockType('normal')(state, dispatch);
    insertBlockType('blockquote')(state, dispatch);
    expect(editorView.state.doc).toEqualDocument(doc(blockquote(p('text'))));
  });

  it('should not toggle block type', () => {
    const { editorView } = editor(doc(p('te{<>}xt')));
    const { state, dispatch } = editorView;

    setBlockType('normal')(state, dispatch);
    expect(editorView.state.doc).toEqualDocument(doc(p('text')));
  });

  it('should be able to change block types when selecting two nodes', () => {
    const { editorView } = editor(doc(p('li{<}ne1'), p('li{>}ne2')));
    const { state, dispatch } = editorView;

    setBlockType('heading1')(state, dispatch);
    expect(editorView.state.doc).toEqualDocument(doc(h1('line1'), h1('line2')));
  });

  it('should be able to change multiple paragraphs into one blockquote', () => {
    const { editorView } = editor(
      doc(p('li{<}ne1'), p('li{>}ne2'), p('li{>}ne3')),
    );
    const { state, dispatch } = editorView;

    insertBlockType('blockquote')(state, dispatch);
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
      blockTypePluginKey.getState(editorView.state).currentBlockType.name,
    ).toBe('heading1');

    setTextSelection(editorView, pPos);
    expect(
      blockTypePluginKey.getState(editorView.state).currentBlockType.name,
    ).toBe('normal');
  });

  it('should dispatch events in response to changes', () => {
    const { pluginState, editorView, eventDispatcher } = editor(
      doc(p('te{<>}xt')),
    );
    const { state, dispatch } = editorView;
    const spy = jest.fn();

    eventDispatcher.on((blockTypePluginKey as any).key, spy);
    setBlockType('heading1')(state, dispatch);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({
      ...pluginState,
      currentBlockType: HEADING_1,
    });
  });

  describe('toggleBlockType', () => {
    describe('when origin block type is the same as target block type', () => {
      it('does not convert to a paragraph', () => {
        const { editorView } = editor(doc(h1('text')));
        const { state, dispatch } = editorView;

        setBlockType('heading1')(state, dispatch);
        expect(editorView.state.doc).toEqualDocument(doc(h1('text')));
      });
    });
  });

  describe('insertBlockType', () => {
    it('should be able to insert panel', () => {
      const { editorView } = editor(doc(p()));
      const { state, dispatch } = editorView;
      insertBlockType('panel')(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(doc(panel()(p())));
    });

    it('should wrap current selection in panel if possible', () => {
      const { editorView } = editor(doc(h1('test{<>}')));
      const { state, dispatch } = editorView;
      insertBlockType('panel')(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(panel()(h1('test{<>}'))),
      );
    });

    it('should be able to insert panel after current selection if current selection can not be wrapper in panel', () => {
      const { editorView } = editor(doc(blockquote(p('test{<>}'))));
      const { state, dispatch } = editorView;
      insertBlockType('panel')(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(blockquote(p('test')), panel()(p())),
      );
    });

    it('should be able to insert blockquote', () => {
      const { editorView } = editor(doc(p()));
      const { state, dispatch } = editorView;
      insertBlockType('blockquote')(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(doc(blockquote(p())));
    });

    it('should wrap current selection in blockquote if possible', () => {
      const { editorView } = editor(doc(p('test{<>}')));
      const { state, dispatch } = editorView;
      insertBlockType('blockquote')(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(blockquote(p('test{<>}'))),
      );
    });

    it('should be able to insert blockquote after current selection if current selection can not be wrapper in blockquote', () => {
      const { editorView } = editor(doc(h1('test{<>}')));
      const { state, dispatch } = editorView;
      insertBlockType('blockquote')(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(h1('test'), blockquote(p())),
      );
    });

    it('should be able to insert codeblock', () => {
      const { editorView } = editor(doc(p()));
      const { state, dispatch } = editorView;
      insertBlockType('codeblock')(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(doc(p(), code_block()()));
    });

    it('should insert code block after selection if selected block has text', () => {
      const { editorView } = editor(doc(p('text{<>}')));
      const { state, dispatch } = editorView;
      insertBlockType('codeblock')(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(p('text{<>}'), code_block()()),
      );
    });
  });

  describe('blockTypesDisabled', () => {
    it('should be false if current selection has no wrapper', () => {
      const { pluginState } = editor(doc(p('text{<>}')));
      expect(pluginState.blockTypesDisabled).toBe(false);
    });

    it('should be false if current selection is wrapped in panel', () => {
      const { pluginState } = editor(doc(panel()(p('text{<>}'))));
      expect(pluginState.blockTypesDisabled).toBe(false);
    });

    it('should be true if current selection is wrapped in blockquote', () => {
      const { pluginState } = editor(doc(blockquote(p('text{<>}'))));
      expect(pluginState.blockTypesDisabled).toBe(true);
    });

    it('should be true if current selection is wrapped in codeblock', () => {
      const { pluginState } = editor(doc(code_block()('testing{<>}')));
      expect(pluginState.blockTypesDisabled).toBe(true);
    });
  });

  describe('block type in comment editor', () => {
    const editor = (doc: DocBuilder) =>
      createEditor({
        doc,
        preset: new Preset<LightEditorPlugin>()
          .add([blockTypePlugin, { lastNodeMustBeParagraph: true }])
          .add(codeBlockPlugin),
      });

    it('should create empty terminal empty paragraph when heading is created', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));
      insertText(editorView, '# ', sel);
      expect(editorView.state.doc).toEqualDocument(doc(h1(''), p('')));
    });

    it('should create empty terminal empty paragraph when code block is created', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));
      insertText(editorView, '```', sel);
      expect(editorView.state.doc).toEqualDocument(
        doc(code_block()(''), p('')),
      );
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
          allowBlockType: { exclude: ['blockquote'] },
        });

        if (blockQuote.nodes) {
          const nodes = blockQuote.nodes();
          const hasBlockQuote = nodes.some(
            (node) => node.name === 'blockquote',
          );
          expect(hasBlockQuote).toBeFalsy();
        }

        expect.hasAssertions();
      });
    });
  });
});
