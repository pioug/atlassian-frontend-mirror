import {
  doc,
  expand,
  nestedExpand,
  table,
  tr,
  td,
  p,
} from '@atlaskit/editor-test-helpers/schema-builder';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import { insertText } from '@atlaskit/editor-test-helpers/transactions';
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
import { findExpand } from '../../utils';
import expandPlugin from '../../index';
import analyticsPlugin from '../../../analytics';
import typeAheadPlugin from '../../../type-ahead';
import quickInsertPlugin from '../../../quick-insert';
import tablesPlugin from '../../../table';

describe('expand actions', () => {
  const createEditor = createProsemirrorEditorFactory();
  let createAnalyticsEvent: CreateUIAnalyticsEvent;

  const editor = (doc: any) => {
    createAnalyticsEvent = jest.fn().mockReturnValue({ fire() {} });
    return createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add([expandPlugin, { allowInsertion: true }])
        .add([analyticsPlugin, createAnalyticsEvent])
        .add(typeAheadPlugin)
        .add(quickInsertPlugin)
        .add(tablesPlugin),
    });
  };

  describe('expand', () => {
    it('fires analytics when inserted from quick insert', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));
      insertText(editorView, '/expand', sel);
      sendKeyToPm(editorView, 'Enter');

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

      expect(createAnalyticsEvent).toBeCalledWith(
        expect.objectContaining({
          action: 'toggleExpand',
          actionSubject: 'expand',
          attributes: { expanded: false, mode: 'editor', platform: 'web' },
          eventType: 'track',
        }),
      );
    });

    it('fires analytics when expanded in editor', () => {
      const { editorView } = editor(doc(expand()(p('{<>}'))));
      const { dispatch } = editorView;
      const expandView = findExpand(editorView.state)!;
      const { pos, node } = expandView;

      toggleExpandExpanded(pos, node.type)(editorView.state, dispatch);
      toggleExpandExpanded(pos, node.type)(editorView.state, dispatch);

      expect(createAnalyticsEvent).toBeCalledWith(
        expect.objectContaining({
          action: 'toggleExpand',
          actionSubject: 'expand',
          attributes: { expanded: true, mode: 'editor', platform: 'web' },
          eventType: 'track',
        }),
      );
    });
  });

  describe('nestedExpand', () => {
    it('fires analytics when inserted from quick insert', () => {
      const { editorView, sel } = editor(doc(table()(tr(td({})(p('{<>}'))))));
      insertText(editorView, '/expand', sel);
      sendKeyToPm(editorView, 'Enter');

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

      expect(createAnalyticsEvent).toBeCalledWith(
        expect.objectContaining({
          action: 'toggleExpand',
          actionSubject: 'nestedExpand',
          attributes: { expanded: false, mode: 'editor', platform: 'web' },
          eventType: 'track',
        }),
      );
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

      expect(createAnalyticsEvent).toBeCalledWith(
        expect.objectContaining({
          action: 'toggleExpand',
          actionSubject: 'nestedExpand',
          attributes: { expanded: true, mode: 'editor', platform: 'web' },
          eventType: 'track',
        }),
      );
    });
  });
});
