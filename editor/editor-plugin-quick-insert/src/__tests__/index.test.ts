import type { IntlShape } from 'react-intl-next';

import { memoProcessQuickInsertItems } from '@atlaskit/editor-common/quick-insert';
import type { QuickInsertHandler } from '@atlaskit/editor-common/types';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';

describe('processItems', () => {
  const intlMock = {
    formatMessage: (messageDescriptor: any) =>
      messageDescriptor && messageDescriptor.defaultMessage,
  } as unknown as IntlShape;

  const mockQuickInsertActionInsert = jest.fn();
  const mockEditorState = {} as EditorState;

  it('should process the right items', () => {
    const mockAction = jest.fn();
    const quickInsertHandler: QuickInsertHandler = [
      {
        title: 'link',
        id: 'hyperlink',
        action: mockAction,
      },
    ];
    const data = memoProcessQuickInsertItems([quickInsertHandler], intlMock);

    data[0].action(mockQuickInsertActionInsert, mockEditorState);

    // Assert that we only call the function once to prevent multiple windows opening
    expect(mockAction).toBeCalledTimes(1);
  });

  it('should only call the action once despite calling the memoProcessItems multiple times', () => {
    const mockAction = jest.fn();
    const quickInsertHandler: QuickInsertHandler = [
      {
        title: 'link',
        id: 'hyperlink',
        action: mockAction,
      },
    ];
    const quickInsertHandlers = [quickInsertHandler];

    memoProcessQuickInsertItems(quickInsertHandlers, intlMock);
    memoProcessQuickInsertItems(quickInsertHandlers, intlMock);
    const data = memoProcessQuickInsertItems(quickInsertHandlers, intlMock);

    data[0].action(mockQuickInsertActionInsert, mockEditorState);

    // Assert that we only call the function once to prevent multiple windows opening
    expect(mockAction).toBeCalledTimes(1);
  });
});
