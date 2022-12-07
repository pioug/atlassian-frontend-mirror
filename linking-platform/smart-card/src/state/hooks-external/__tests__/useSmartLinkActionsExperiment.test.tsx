import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { mocked } from 'ts-jest/utils';

import { mocks } from '../../../utils/mocks';
import { SmartCardProvider, useFeatureFlag } from '@atlaskit/link-provider';
import { useSmartCardState } from '../../store';
import { useSmartLinkActions } from '../useSmartLinkActions';
import { CardState } from '@atlaskit/linking-common';

jest.mock('@atlaskit/link-provider', () => {
  return {
    ...jest.requireActual<Object>('@atlaskit/link-provider'),
    useFeatureFlag: jest.fn(),
  };
});

jest.mock('../../store', () => ({
  useSmartCardState: jest.fn(),
}));

const mockPreviewAction = jest.fn();
jest.mock('../../../view/BlockCard/actions/PreviewAction', () =>
  jest.fn().mockImplementation(() => ({
    id: 'preview-content',
    text: 'Preview',
    promise: mockPreviewAction,
  })),
);

const mockUseFeatureFlag = mocked(useFeatureFlag);

const url = 'https://start.atlassian.com';
const appearance = 'block';
const analytics = () => {};
const state: CardState = { details: mocks.success, status: 'resolved' };

describe('useSmartLinkActions with actionable element experiment', () => {
  const renderUseSmartLinkActions = () =>
    renderHook(
      () =>
        useSmartLinkActions({ url, appearance, analyticsHandler: analytics }),
      {
        wrapper: ({ children }) => (
          <SmartCardProvider>{children}</SmartCardProvider>
        ),
      },
    );

  beforeEach(() => {
    mocked(useSmartCardState).mockImplementation(() => state);
    mockUseFeatureFlag.mockImplementation(() => true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls actionable element feature flag', () => {
    renderUseSmartLinkActions();

    expect(mockUseFeatureFlag).toHaveBeenCalledWith('enableActionableElement');
  });

  it('set onClose to preview action', () => {
    const { result } = renderUseSmartLinkActions();
    result.current?.[1].invoke({ isReloadRequired: true });

    expect(mockPreviewAction).toHaveBeenCalledWith({
      onClose: expect.any(Function),
    });
  });
});
