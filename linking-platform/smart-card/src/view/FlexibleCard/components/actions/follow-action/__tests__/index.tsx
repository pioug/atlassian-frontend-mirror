import { AnalyticsListener } from '@atlaskit/analytics-next';
import { render } from '@testing-library/react';
import React from 'react';
import '@atlaskit/link-test-helpers/jest';
import { IntlProvider } from 'react-intl-next';
import mockContext from '../../../../../../__fixtures__/flexible-ui-data-context';
import { ANALYTICS_CHANNEL } from '../../../../../../utils/analytics';
import FollowAction from '../index';
import { FollowActionProps } from '../types';
import { SmartCardProvider } from '@atlaskit/link-provider';

jest.mock('../../../../../../state/flexible-ui-context', () => ({
  ...jest.requireActual('../../../../../../state/flexible-ui-context'),
  useFlexibleUiContext: jest.fn().mockReturnValue(mockContext),
}));

describe('FollowAction', () => {
  const testId = 'smart-action-follow-action';

  const setup = (props?: Partial<FollowActionProps>) => {
    const onEvent = jest.fn();

    return render(
      <AnalyticsListener onEvent={onEvent} channel={ANALYTICS_CHANNEL}>
        <IntlProvider locale="en">
          <SmartCardProvider>
            <FollowAction {...props} />
          </SmartCardProvider>
        </IntlProvider>
      </AnalyticsListener>,
    );
  };

  it('renders action', async () => {
    const { findByTestId } = setup();
    const element = await findByTestId(testId);
    expect(element).toBeInTheDocument();
    expect(element.textContent).toBe('Follow');
  });
});
