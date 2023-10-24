import type { DocBuilder } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  expand,
  nestedExpand,
  table,
  tr,
  td,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  Preset,
  createProsemirrorEditorFactory,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import {
  deleteExpand,
  insertExpand,
  toggleExpandExpanded,
} from '../../commands';
import { ExpandNodeView } from '../../nodeviews';
import { findExpand } from '../../utils';
import expandPlugin from '../../index';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { typeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';
import { quickInsertPlugin } from '@atlaskit/editor-plugin-quick-insert';
import { selectionPlugin } from '@atlaskit/editor-plugin-selection';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import { tablesPlugin } from '@atlaskit/editor-plugin-table';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';

describe('expand actions', () => {
  const createEditor = createProsemirrorEditorFactory();
  let createAnalyticsEvent: CreateUIAnalyticsEvent;

  const editor = (doc: DocBuilder) => {
    createAnalyticsEvent = jest.fn().mockReturnValue({ fire() {} });
    return createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add([featureFlagsPlugin, {}])
        .add([analyticsPlugin, { createAnalyticsEvent }])
        .add(contentInsertionPlugin)
        .add(decorationsPlugin)
        .add(selectionPlugin)
        .add([expandPlugin, { allowInsertion: true }])
        .add(typeAheadPlugin)
        .add(quickInsertPlugin)
        .add(widthPlugin)
        .add(guidelinePlugin)
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
      const { editorView, editorAPI } = editor(doc(p('{<>}')));
      insertExpand(editorAPI?.analytics?.actions)(
        editorView.state,
        editorView.dispatch,
      );
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
      const { editorView, editorAPI } = editor(doc(expand()(p('{<>}'))));

      deleteExpand(editorAPI?.analytics?.actions)(
        editorView.state,
        editorView.dispatch,
      );
      expect(createAnalyticsEvent).toBeCalledWith({
        action: 'deleted',
        actionSubject: 'expand',
        attributes: expect.objectContaining({ inputMethod: 'toolbar' }),
        eventType: 'track',
      });
    });

    it('fires analytics when closed in editor', () => {
      const { editorView, editorAPI } = editor(doc(expand()(p('{<>}'))));
      const expandView = findExpand(editorView.state)!;

      toggleExpandExpanded(editorAPI?.analytics?.actions)(
        expandView.pos,
        expandView.node.type,
      )(editorView.state, editorView.dispatch);

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
      const { editorView, editorAPI } = editor(doc(expand()(p('{<>}'))));
      const { dispatch } = editorView;
      const expandView = findExpand(editorView.state)!;
      const { pos, node } = expandView;

      toggleExpandExpanded(editorAPI?.analytics?.actions)(pos, node.type)(
        editorView.state,
        dispatch,
      );
      toggleExpandExpanded(editorAPI?.analytics?.actions)(pos, node.type)(
        editorView.state,
        dispatch,
      );

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
      const buildNodeView = (isMobile: boolean) => {
        const { editorView } = editor(doc(expand()(p('hello'))));
        const expandNode = editorView.state.doc.firstChild!;
        return new ExpandNodeView(
          expandNode,
          editorView,
          jest.fn(),
          jest.fn(),
          isMobile,
          {},
          undefined,
          undefined,
        );
      };

      describe('for full page', () => {
        const expandNodeView = buildNodeView(false);

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

      describe('for mobile', () => {
        const expandNodeView = buildNodeView(true);

        it.each<[string, string, boolean]>([
          ['allow childList mutations', 'childList', false],
          ['allow characterData mutations', 'characterData', false],
          ['allow selection mutations', 'selection', false],
          ['ignore expand/collapse button mutations', 'attributes', true],
        ])('%s', (_, mutationType, expected) => {
          expect(
            expandNodeView.ignoreMutation({ type: mutationType } as any),
          ).toBe(expected);
        });
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
      const { editorView, editorAPI } = editor(
        doc(table()(tr(td({})(p('{<>}'))))),
      );
      insertExpand(editorAPI?.analytics?.actions)(
        editorView.state,
        editorView.dispatch,
      );
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
      const { editorView, editorAPI } = editor(
        doc(table()(tr(td({})(nestedExpand()(p('{<>}')))))),
      );

      deleteExpand(editorAPI?.analytics?.actions)(
        editorView.state,
        editorView.dispatch,
      );
      expect(createAnalyticsEvent).toBeCalledWith({
        action: 'deleted',
        actionSubject: 'nestedExpand',
        attributes: expect.objectContaining({ inputMethod: 'toolbar' }),
        eventType: 'track',
      });
    });

    it('fires analytics when closed in editor', () => {
      const { editorView, editorAPI } = editor(
        doc(table()(tr(td({})(nestedExpand()(p('{<>}')))))),
      );
      const expandView = findExpand(editorView.state)!;

      toggleExpandExpanded(editorAPI?.analytics?.actions)(
        expandView.pos,
        expandView.node.type,
      )(editorView.state, editorView.dispatch);

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
      const { editorView, editorAPI } = editor(
        doc(table()(tr(td({})(nestedExpand()(p('{<>}')))))),
      );
      const { dispatch } = editorView;
      const expandView = findExpand(editorView.state)!;

      toggleExpandExpanded(editorAPI?.analytics?.actions)(
        expandView.pos,
        expandView.node.type,
      )(editorView.state, dispatch);
      toggleExpandExpanded(editorAPI?.analytics?.actions)(
        expandView.pos,
        expandView.node.type,
      )(editorView.state, dispatch);

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

    it('should be used inside a table when inserted from insert menu', () => {
      const { editorView, editorAPI } = editor(
        doc(table({ localId: 'test-id' })(tr(td({})(p('{<>}'))))),
      );

      insertExpand(editorAPI?.analytics?.actions)(
        editorView.state,
        editorView.dispatch,
      );
      expect(editorView.state.doc).toEqualDocument(
        doc(table({ localId: 'test-id' })(tr(td()(nestedExpand()(p()))))),
      );
    });

    it('should be used inside a table when inserted from quick insert', async () => {
      const { editorView, typeAheadTool } = editor(
        doc(table({ localId: 'test-id' })(tr(td({})(p('{<>}'))))),
      );

      await typeAheadTool.searchQuickInsert('expand')?.insert({ index: 0 });

      expect(editorView.state.doc).toEqualDocument(
        doc(table({ localId: 'test-id' })(tr(td()(nestedExpand()(p()))))),
      );
    });
  });
});
