import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { mocked } from 'ts-jest/utils';

import { mocks } from '../../../utils/mocks';
import { SmartCardProvider, useFeatureFlag } from '@atlaskit/link-provider';
import * as analytics from '../../../utils/analytics/analytics';
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
const appearance = 'flexible';
const analyticsHandler = () => {};
const state: CardState = { details: mocks.success, status: 'resolved' };

describe('useSmartLinkActions with actionable element experiment', () => {
  const renderUseSmartLinkActions = () =>
    renderHook(
      () => useSmartLinkActions({ url, appearance, analyticsHandler }),
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

  it('fire status action analytics event', () => {
    const mock = jest.spyOn(analytics, 'uiActionClickedEvent');

    const { result } = renderUseSmartLinkActions();
    result.current?.[1].invoke({ isReloadRequired: true });

    expect(analytics.uiActionClickedEvent).toHaveBeenCalledTimes(1);
    expect(mock.mock.results[0].value).toEqual({
      action: 'clicked',
      actionSubject: 'button',
      actionSubjectId: 'issueStatusUpdate',
      attributes: {
        actionType: 'StatusAction',
        componentName: 'smart-cards',
        display: 'flexible',
        extensionKey: 'object-provider',
        id: expect.any(String),
        packageName: '@atlaskit/smart-card',
        packageVersion: '999.9.9',
      },
      eventType: 'ui',
    });
  });
});
