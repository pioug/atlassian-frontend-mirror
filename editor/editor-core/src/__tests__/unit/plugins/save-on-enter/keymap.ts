import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  p,
  decisionList,
  decisionItem,
  taskList,
  taskItem,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';

describe('save on enter', () => {
  const createEditor = createEditorFactory();

  const onSaveSpy = jest.fn();
  let createAnalyticsEvent: CreateUIAnalyticsEvent;

  beforeEach(() => {
    onSaveSpy.mockReset();
  });

  const editor = (doc: DocBuilder) => {
    createAnalyticsEvent = jest.fn().mockReturnValue({ fire() {} });
    return createEditor({
      doc,
      editorProps: {
        onSave: onSaveSpy,
        allowAnalyticsGASV3: true,
        saveOnEnter: true,
        allowTasksAndDecisions: true,
      },
      createAnalyticsEvent,
    });
  };

  it('should trigger onSubmit when user presses Enter', () => {
    const { editorView } = editor(doc(p('1{<>}')));

    sendKeyToPm(editorView!, 'Enter');
    expect(onSaveSpy).toHaveBeenCalledWith(editorView);
  });

  it('should trigger onSubmit when user presses Enter in decisionItem', () => {
    const { editorView } = editor(doc(decisionList()(decisionItem()('1{<>}'))));
    sendKeyToPm(editorView!, 'Enter');
    expect(onSaveSpy).toHaveBeenCalledWith(editorView);
  });

  it('should trigger onSubmit when user presses Enter inside taskItem', () => {
    const { editorView } = editor(doc(taskList()(taskItem()('1{<>}'))));
    sendKeyToPm(editorView!, 'Enter');
    expect(onSaveSpy).toHaveBeenCalledWith(editorView);
  });

  it('should not trigger onSubmit when user presses Enter in empty decisionItem', () => {
    const { editorView } = editor(doc(decisionList()(decisionItem()('{<>}'))));
    sendKeyToPm(editorView!, 'Enter');
    expect(onSaveSpy).not.toHaveBeenCalledWith(editorView);
  });

  it('should not trigger onSubmit when user presses Enter inside empty taskItem', () => {
    const { editorView } = editor(doc(taskList()(taskItem()('{<>}'))));
    sendKeyToPm(editorView!, 'Enter');
    expect(onSaveSpy).not.toHaveBeenCalledWith(editorView);
  });

  it('should trigger editor stopped analytics event', () => {
    const { editorView } = editor(doc(p('1{<>}')));
    sendKeyToPm(editorView, 'Enter');
    expect(createAnalyticsEvent).toHaveBeenCalledWith({
      action: 'stopped',
      actionSubject: 'editor',
      actionSubjectId: 'save',
      attributes: expect.objectContaining({ inputMethod: 'shortcut' }),
      eventType: 'ui',
    });
  });
});
