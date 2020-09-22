import { PanelState } from '../../../../plugins/panel/pm-plugins/main';
import { pluginKey } from '../../../../plugins/panel/types';
import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  panel,
  panelNote,
  p,
  table,
  tr,
  td,
  ol,
  li,
} from '@atlaskit/editor-test-helpers/schema-builder';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import { insertText } from '@atlaskit/editor-test-helpers/transactions';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import {
  removePanel,
  changePanelType,
} from '../../../../plugins/panel/actions';
import { Selection } from 'prosemirror-state';
import { selectNode } from '../../../../utils/commands';
import { PanelType } from '@atlaskit/adf-schema';

describe('@atlaskit/editor-core ui/PanelPlugin', () => {
  const createEditor = createEditorFactory<PanelState>();

  let createAnalyticsEvent: CreateUIAnalyticsEvent;

  const editor = (doc: any) => {
    createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));
    return createEditor({
      doc,
      editorProps: {
        allowAnalyticsGASV3: true,
        allowPanel: true,
        allowTables: true,
        quickInsert: true,
      },
      pluginKey,
      createAnalyticsEvent,
    });
  };

  describe('API', () => {
    it('should call subscribers when panel is clicked', () => {
      const { pluginState } = editor(doc(panel()(p('te{<>}xt'))));
      expect(pluginState.element).not.toBe(undefined);
    });

    it('should be able to identify panel node', () => {
      const { pluginState } = editor(doc(panel()(p('te{<>}xt'))));
      expect(pluginState.element).not.toBe(undefined);
    });

    it('should be able to change panel type using function changeType', async () => {
      const { pluginState, editorView } = editor(doc(panel()(p('te{<>}xt'))));
      expect(pluginState.activePanelType).toEqual(PanelType.INFO);
      expect(pluginState.element).not.toBe(undefined);
      expect(pluginState.activePanelType).not.toBe(undefined);
      changePanelType(PanelType.NOTE)(editorView.state, editorView.dispatch);
      const newPluginState = pluginKey.getState(editorView!.state);
      expect(newPluginState.activePanelType).toEqual(PanelType.NOTE);
    });

    it('should be able to change panel type using function changeType for panel with multiple blocks', () => {
      const { editorView } = editor(doc(panel()(p('te{<>}xt'), p('text'))));
      changePanelType(PanelType.NOTE)(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(panelNote(p('text'), p('text'))),
      );
    });

    it('should be able to remove panel type using function removePanel', () => {
      const { pluginState, editorView } = editor(doc(panel()(p('te{<>}xt'))));
      expect(pluginState.activePanelType).toEqual(PanelType.INFO);
      removePanel()(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(doc(p()));
    });

    it('should be able to remove panel having multiple paragraphs', () => {
      const { pluginState, editorView } = editor(
        doc(panel()(p('te{<>}xt'), p('te{<>}xt'), p('te{<>}xt'))),
      );
      expect(pluginState.activePanelType).toEqual(PanelType.INFO);
      removePanel()(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(doc(p()));
    });

    it('should be possible to remove panel inside table', () => {
      const { pluginState, editorView } = editor(
        doc(table()(tr(td({})(panel()(p('text{<>}')))))),
      );
      expect(pluginState.activePanelType).toEqual(PanelType.INFO);
      removePanel()(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(table()(tr(td({})(p())))),
      );
    });

    it('should be possible to remove panel with no text inside table', () => {
      const { pluginState, editorView } = editor(
        doc(table()(tr(td({})(panel()(p('{<>}')))))),
      );
      expect(pluginState.activePanelType).toEqual(PanelType.INFO);
      removePanel()(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(table()(tr(td({})(p())))),
      );
    });

    it('should be able to remove panel type using function removePanel even if panel has no text content', () => {
      const { pluginState, editorView } = editor(doc(panel()(p('{<>}'))));
      expect(pluginState.activePanelType).toEqual(PanelType.INFO);
      removePanel()(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(doc(p()));
    });

    it('should be able to remove panel for panel of multiple blocks using function removePanel', () => {
      const { pluginState, editorView } = editor(
        doc(panel()(p('te{<>}xt'), p('text'))),
      );
      expect(pluginState.activePanelType).toEqual(PanelType.INFO);
      removePanel()(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(doc(p()));
    });

    it('should not remove enclosing block while removing panel', () => {
      const { pluginState, editorView } = editor(
        doc(p('testing'), panel()(p('te{<>}xt'), p('text')), p('testing')),
      );
      expect(pluginState.activePanelType).toEqual(PanelType.INFO);
      removePanel()(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(p('testing'), p('testing')),
      );
    });

    it('should be able to remove panel node if cursor is inside nested list node', () => {
      const { editorView } = editor(
        doc(p('one'), panel()(p('text'), ol(li(p('te{<>}xt')))), p('two')),
      );
      removePanel()(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(doc(p('one'), p('two')));
    });

    it('should change panel type if cursor is inside nested list node', () => {
      const { pluginState, editorView } = editor(
        doc(panel()(p('text'), ol(li(p('te{<>}xt'))))),
      );
      expect(pluginState.activePanelType).toEqual(PanelType.INFO);
      changePanelType(PanelType.NOTE)(editorView.state, editorView.dispatch);
      const newPluginState = pluginKey.getState(editorView!.state);
      expect(newPluginState.activePanelType).toEqual(PanelType.NOTE);
    });

    it('should select node', () => {
      const { editorView, refs } = editor(
        doc('{nodeStart}', panel()(p('text'), p('more text'))),
      );
      selectNode(refs['nodeStart'])(editorView.state, editorView.dispatch);
      const expectedDoc = doc('{<node>}', panel()(p('text'), p('more text')));
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });
  });

  describe('toolbarVisible', () => {
    describe('when focus is inside a list in panel', () => {
      it('it is true', () => {
        const { pluginState } = editor(
          doc(p('text'), panel()(p('text'), ol(li(p('te{<>}xt'))))),
        );
        expect(pluginState.toolbarVisible).toBe(true);
      });
    });

    it('is false when selection moves outside panel', () => {
      const { editorView } = editor(
        doc(p('text'), panel()(p('text'), ol(li(p('te{<>}xt'))))),
      );
      const {
        state: { tr },
      } = editorView;

      tr.setSelection(Selection.near(tr.doc.resolve(0)));
      editorView.dispatch(tr);
      const newPluginState = pluginKey.getState(editorView!.state);
      expect(newPluginState.toolbarVisible).toBe(false);
    });
  });

  describe('keyMaps', () => {
    describe('when Enter key is pressed', () => {
      it('a new paragraph should be created in panel', () => {
        const { editorView } = editor(doc(panel()(p('text{<>}'))));
        sendKeyToPm(editorView, 'Enter');
        expect(editorView.state.doc).toEqualDocument(
          doc(panel()(p('text'), p())),
        );
      });
    });

    describe('when Enter key is pressed twice', () => {
      it('a new paragraph should be created outside panel', () => {
        const { editorView } = editor(doc(panel()(p('text{<>}'))));
        sendKeyToPm(editorView, 'Enter');
        sendKeyToPm(editorView, 'Enter');
        expect(editorView.state.doc).toEqualDocument(
          doc(panel()(p('text')), p()),
        );
      });
    });
  });

  describe('quick insert', () => {
    // we dont have all panel types in quickinsert, so listing them explicitly
    [
      PanelType.INFO,
      PanelType.SUCCESS,
      PanelType.ERROR,
      PanelType.WARNING,
      PanelType.NOTE,
    ].forEach(panelType => {
      it(`should fire analytics event when ${panelType} panel inserted`, () => {
        const { editorView, sel } = editor(doc(p('{<>}')));
        insertText(editorView, `/${panelType}`, sel);
        sendKeyToPm(editorView, 'Enter');

        expect(createAnalyticsEvent).toBeCalledWith({
          action: 'inserted',
          actionSubject: 'document',
          actionSubjectId: 'panel',
          attributes: expect.objectContaining({
            inputMethod: 'quickInsert',
            panelType,
          }),
          eventType: 'track',
        });
      });
    });
  });
});
