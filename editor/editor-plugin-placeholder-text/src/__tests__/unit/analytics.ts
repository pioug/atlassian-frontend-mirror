// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { act } from '@testing-library/react';

import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import type { DocBuilder } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';

describe('placeholder text', () => {
  const createEditor = createEditorFactory();
  let createAnalyticsEvent: CreateUIAnalyticsEvent;

  const editor = (doc: DocBuilder) => {
    createAnalyticsEvent = jest.fn().mockReturnValue({ fire() {} });
    return createEditor({
      doc,
      editorProps: {
        allowAnalyticsGASV3: true,
        allowTemplatePlaceholders: {
          allowInserting: true,
        },
      },
      createAnalyticsEvent,
    });
  };

  it('should trigger quickInsert analytics event', async () => {
    const { typeAheadTool } = editor(doc(p('1{<>}')));

    await act(async () => {
      await typeAheadTool
        .searchQuickInsert('placeholder')
        ?.insert({ index: 0 });
    });

    expect(createAnalyticsEvent).toHaveBeenCalledWith({
      action: 'inserted',
      actionSubject: 'document',
      actionSubjectId: 'placeholderText',
      attributes: {
        actionSubjectId: 'placeholderText',
        inputMethod: 'quickInsert',
        insertLocation: 'doc',
        selectionPosition: 'end',
        selectionType: 'cursor',
      },
      eventType: 'track',
    });
  });
});
