import {
  doc,
  expand,
  nestedExpand,
  table,
  tr,
  td,
  p,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  Preset,
  LightEditorPlugin,
  createProsemirrorEditorFactory,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import {
  deleteExpand,
  insertExpand,
  toggleExpandExpanded,
} from '../../commands';
import { ExpandNodeView } from '../../nodeviews';
import { findExpand } from '../../utils';
import expandPlugin from '../../index';
import analyticsPlugin from '../../../analytics';
import typeAheadPlugin from '../../../type-ahead';
import quickInsertPlugin from '../../../quick-insert';
import tablesPlugin from '../../../table';

describe('expand actions', () => {
  const createEditor = createProsemirrorEditorFactory();
  let createAnalyticsEvent: CreateUIAnalyticsEvent;

  const editor = (doc: DocBuilder) => {
    createAnalyticsEvent = jest.fn().mockReturnValue({ fire() {} });
    return createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add([expandPlugin, { allowInsertion: true }])
        .add([analyticsPlugin, { createAnalyticsEvent }])
        .add(typeAheadPlugin)
        .add(quickInsertPlugin)
        .add(tablesPlugin),
    });
  };

  describe('expand', () => {
    it('fires analytics when inserted from quick insert', async () => {
      const { typeAheadTool } = editor(doc(p('{<>}')));
      await typeAheadTool.searchQuickInsert('expand')?.insert({ index: 0 });

      expect(createAnalyticsEvent).toBeCalledWith({
        action: 'inserted',
        actionSubject: 'document',
        actionSubjectId: 'expand',
        attributes: expect.objectContaining({
          inputMethod: 'quickInsert',
        }),
        eventType: 'track',
      });
    });

    it('fires analytics when inserted from insert menu', () => {
      const { editorView } = editor(doc(p('{<>}')));
      insertExpand(editorView.state, editorView.dispatch);
      expect(createAnalyticsEvent).toBeCalledWith({
        action: 'inserted',
        actionSubject: 'document',
        actionSubjectId: 'expand',
        attributes: expect.objectContaining({
          inputMethod: 'insertMenu',
        }),
        eventType: 'track',
      });
    });

    it('fires analytics when deleted with floating toolbar', () => {
      const { editorView } = editor(doc(expand()(p('{<>}'))));

      deleteExpand()(editorView.state, editorView.dispatch);
      expect(createAnalyticsEvent).toBeCalledWith({
        action: 'deleted',
        actionSubject: 'expand',
        attributes: expect.objectContaining({ inputMethod: 'toolbar' }),
        eventType: 'track',
      });
    });

    it('fires analytics when closed in editor', () => {
      const { editorView } = editor(doc(expand()(p('{<>}'))));
      const expandView = findExpand(editorView.state)!;

      toggleExpandExpanded(expandView.pos, expandView.node.type)(
        editorView.state,
        editorView.dispatch,
      );

      expect(createAnalyticsEvent).toBeCalledWith({
        action: 'toggleExpand',
        actionSubject: 'expand',
        attributes: expect.objectContaining({
          expanded: false,
          mode: 'editor',
          platform: 'web',
        }),
        eventType: 'track',
      });
    });

    it('fires analytics when expanded in editor', () => {
      const { editorView } = editor(doc(expand()(p('{<>}'))));
      const { dispatch } = editorView;
      const expandView = findExpand(editorView.state)!;
      const { pos, node } = expandView;

      toggleExpandExpanded(pos, node.type)(editorView.state, dispatch);
      toggleExpandExpanded(pos, node.type)(editorView.state, dispatch);

      expect(createAnalyticsEvent).toBeCalledWith({
        action: 'toggleExpand',
        actionSubject: 'expand',
        attributes: expect.objectContaining({
          expanded: true,
          mode: 'editor',
          platform: 'web',
        }),
        eventType: 'track',
      });
    });

    describe('ignoreMutation', () => {
      let expandNodeView: ExpandNodeView;

      beforeEach(() => {
        const { editorView } = editor(doc(expand()(p('hello'))));
        const expandNode = editorView.state.doc.firstChild!;
        expandNodeView = new ExpandNodeView(
          expandNode,
          editorView,
          jest.fn(),
          jest.fn(),
        );
      });

      it.each<[string, string, boolean]>([
        ['ignores mutations for expand/collapse button', 'attributes', true],
        ['allows mutations for selection', 'selection', false],
      ])('%s', (_, mutationType, expected) => {
        const mutationRecord = {
          type: mutationType,
        };
        expect(expandNodeView.ignoreMutation(mutationRecord as any)).toBe(
          expected,
        );
      });
    });
  });

  describe('nestedExpand', () => {
    it('fires analytics when inserted from quick insert', async () => {
      const { typeAheadTool } = editor(doc(table()(tr(td({})(p('{<>}'))))));

      await typeAheadTool.searchQuickInsert('expand')?.insert({ index: 0 });

      expect(createAnalyticsEvent).toBeCalledWith({
        action: 'inserted',
        actionSubject: 'document',
        actionSubjectId: 'nestedExpand',
        attributes: expect.objectContaining({
          inputMethod: 'quickInsert',
        }),
        eventType: 'track',
      });
    });

    it('fires analytics when inserted from insert menu', () => {
      const { editorView } = editor(doc(table()(tr(td({})(p('{<>}'))))));
      insertExpand(editorView.state, editorView.dispatch);
      expect(createAnalyticsEvent).toBeCalledWith({
        action: 'inserted',
        actionSubject: 'document',
        actionSubjectId: 'nestedExpand',
        attributes: expect.objectContaining({
          inputMethod: 'insertMenu',
        }),
        eventType: 'track',
      });
    });

    it('fires analytics when deleted with floating toolbar', () => {
      const { editorView } = editor(
        doc(table()(tr(td({})(nestedExpand()(p('{<>}')))))),
      );

      deleteExpand()(editorView.state, editorView.dispatch);
      expect(createAnalyticsEvent).toBeCalledWith({
        action: 'deleted',
        actionSubject: 'nestedExpand',
        attributes: expect.objectContaining({ inputMethod: 'toolbar' }),
        eventType: 'track',
      });
    });

    it('fires analytics when closed in editor', () => {
      const { editorView } = editor(
        doc(table()(tr(td({})(nestedExpand()(p('{<>}')))))),
      );
      const expandView = findExpand(editorView.state)!;

      toggleExpandExpanded(expandView.pos, expandView.node.type)(
        editorView.state,
        editorView.dispatch,
      );

      expect(createAnalyticsEvent).toBeCalledWith({
        action: 'toggleExpand',
        actionSubject: 'nestedExpand',
        attributes: expect.objectContaining({
          expanded: false,
          mode: 'editor',
          platform: 'web',
        }),
        eventType: 'track',
      });
    });

    it('fires analytics when expanded in editor', () => {
      const { editorView } = editor(
        doc(table()(tr(td({})(nestedExpand()(p('{<>}')))))),
      );
      const { dispatch } = editorView;
      const expandView = findExpand(editorView.state)!;

      toggleExpandExpanded(expandView.pos, expandView.node.type)(
        editorView.state,
        dispatch,
      );
      toggleExpandExpanded(expandView.pos, expandView.node.type)(
        editorView.state,
        dispatch,
      );

      expect(createAnalyticsEvent).toBeCalledWith({
        action: 'toggleExpand',
        actionSubject: 'nestedExpand',
        attributes: expect.objectContaining({
          expanded: true,
          mode: 'editor',
          platform: 'web',
        }),
        eventType: 'track',
      });
    });
  });
});
