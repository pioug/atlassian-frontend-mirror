import { DocBuilder, doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { mentionResourceProvider } from '@atlaskit/util-data-test/mention-story-data';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { act } from '@testing-library/react';
// import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';

describe('mentions: type-ahead', () => {
  const createEditor = createEditorFactory();
  let createAnalyticsEvent: CreateUIAnalyticsEvent;

  const mentionProvider = Promise.resolve(mentionResourceProvider);

  const editor = (doc: DocBuilder) => {
    createAnalyticsEvent = jest.fn().mockReturnValue({ fire() {} });

    return createEditor({
      doc,
      editorProps: {
        allowAnalyticsGASV3: true,
        mentionProvider,
      },
      createAnalyticsEvent,
    });
  };

  it('TypeAhead should trigger mentions inserted analytics event', async () => {
    const { typeAheadTool } = editor(doc(p('1{<>}')));
    await act(async () => {
      await typeAheadTool.searchQuickInsert('mention')?.insert({ index: 0 });
    });

    expect(createAnalyticsEvent).toHaveBeenCalledWith({
      action: 'invoked',
      actionSubject: 'typeAhead',
      actionSubjectId: 'mentionTypeAhead',
      attributes: {
        inputMethod: 'quickInsert',
        nodeLocation: 'doc',
        selectionPosition: 'end',
        selectionType: 'cursor',
      },
      eventType: 'ui',
    });
  });
});
