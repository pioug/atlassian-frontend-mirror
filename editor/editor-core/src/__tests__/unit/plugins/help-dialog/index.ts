import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import { doc, p } from '@atlaskit/editor-test-helpers/schema-builder';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';

describe('help-dialog', () => {
  const createEditor = createEditorFactory();
  let createAnalyticsEvent: CreateUIAnalyticsEvent;

  const editor = (doc: any) => {
    createAnalyticsEvent = jest.fn().mockReturnValue({ fire() {} });
    return createEditor({
      doc,
      editorProps: { allowAnalyticsGASV3: true, allowHelpDialog: true },
      createAnalyticsEvent,
    });
  };

  it('Mod-/ should trigger help clicked analytics event', () => {
    const { editorView } = editor(doc(p('1{<>}')));
    sendKeyToPm(editorView, 'Mod-/');

    expect(createAnalyticsEvent).toHaveBeenCalledWith({
      action: 'clicked',
      actionSubject: 'button',
      actionSubjectId: 'helpButton',
      attributes: expect.objectContaining({ inputMethod: 'shortcut' }),
      eventType: 'ui',
    });
  });
});
