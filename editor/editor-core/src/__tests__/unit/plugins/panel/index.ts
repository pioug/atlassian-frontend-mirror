import { pluginKey } from '../../../../plugins/panel/types';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  panel,
  p,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { PanelType } from '@atlaskit/adf-schema';

describe('@atlaskit/editor-core ui/PanelPlugin', () => {
  const createEditor = createEditorFactory();

  let createAnalyticsEvent: CreateUIAnalyticsEvent;

  const editor = (doc: DocBuilder) => {
    createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));
    return createEditor({
      doc,
      editorProps: {
        allowAnalyticsGASV3: true,
        allowPanel: { UNSAFE_allowCustomPanel: true },
        allowTables: true,
        quickInsert: true,
      },
      pluginKey,
      createAnalyticsEvent,
    });
  };

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
      PanelType.CUSTOM,
    ].forEach((panelType) => {
      it(`should fire analytics event when ${panelType} panel inserted`, async () => {
        const { typeAheadTool } = editor(doc(p('{<>}')));
        await typeAheadTool.searchQuickInsert(panelType)?.insert({ index: 0 });

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
