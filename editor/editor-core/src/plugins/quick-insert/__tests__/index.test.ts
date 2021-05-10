import { memoProcessItems } from '..';
import { QuickInsertHandler } from '../types';

import { InjectedIntl } from 'react-intl';
import { EditorState } from 'prosemirror-state';

describe('processItems', () => {
  const intlMock = ({
    formatMessage: (messageDescriptor: any) =>
      messageDescriptor && messageDescriptor.defaultMessage,
  } as unknown) as InjectedIntl;

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
    const actionObject = {
      hyperlink: jest.fn(),
    };
    const data = memoProcessItems([quickInsertHandler], intlMock, actionObject);

    data[0].action(mockQuickInsertActionInsert, mockEditorState);

    // Assert that we only call the function once to prevent multiple windows opening
    expect(mockAction).toBeCalledTimes(1);
    expect(actionObject.hyperlink).toBeCalledTimes(1);
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
    const actionObject = {
      hyperlink: jest.fn(),
    };
    const quickInserHandlers = [quickInsertHandler];

    memoProcessItems(quickInserHandlers, intlMock, actionObject);
    memoProcessItems(quickInserHandlers, intlMock, actionObject);
    const data = memoProcessItems(quickInserHandlers, intlMock, actionObject);

    data[0].action(mockQuickInsertActionInsert, mockEditorState);

    // Assert that we only call the function once to prevent multiple windows opening
    expect(mockAction).toBeCalledTimes(1);
    expect(actionObject.hyperlink).toBeCalledTimes(1);
  });
});
