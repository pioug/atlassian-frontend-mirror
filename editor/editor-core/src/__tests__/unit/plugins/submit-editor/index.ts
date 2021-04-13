import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { doc, p, DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { EditorProps } from '../../../../types';

describe('submit-editor', () => {
  const createEditor = createEditorFactory();

  let onSave: EditorProps['onSave'];
  let createAnalyticsEvent: CreateUIAnalyticsEvent;

  const editor = (doc: DocBuilder) => {
    createAnalyticsEvent = jest.fn().mockReturnValue({ fire() {} });
    return createEditor({
      doc,
      editorProps: {
        onSave,
        allowAnalyticsGASV3: true,
      },
      createAnalyticsEvent,
    });
  };

  beforeEach(() => {
    onSave = jest.fn();
  });

  it('Mod-Enter should submit editor content', () => {
    const { editorView } = editor(doc(p('{<>}')));
    sendKeyToPm(editorView, 'Mod-Enter');
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it('Mod-Enter should trigger editor stopped analytics event', () => {
    const { editorView } = editor(doc(p('1{<>}')));
    sendKeyToPm(editorView, 'Mod-Enter');
    expect(createAnalyticsEvent).toHaveBeenCalledWith({
      action: 'stopped',
      actionSubject: 'editor',
      actionSubjectId: 'save',
      attributes: expect.objectContaining({ inputMethod: 'shortcut' }),
      eventType: 'ui',
    });
  });
});
