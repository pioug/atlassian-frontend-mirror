import { FollowActionProps } from '../types';
import { render } from '@testing-library/react';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { ANALYTICS_CHANNEL } from '../../../../../../utils/analytics';
import { IntlProvider } from 'react-intl-next';
import { SmartCardProvider } from '@atlaskit/link-provider';
import FollowAction from '../index';
import userEvent from '@testing-library/user-event';
import React from 'react';

jest.mock('../../../../../../state/flexible-ui-context', () => ({
  ...jest.requireActual('../../../../../../state/flexible-ui-context'),
  useFlexibleUiContext: jest.fn().mockReturnValue({
    actions: {
      FollowAction: {
        value: true,
        isProject: false,
      },
    },
  }),
}));

describe('Follow Goal Action', () => {
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

  describe('new stack item follow goal', () => {
    it('renders follow stack item action', async () => {
      const { findByTestId } = setup({ as: 'stack-item' });
      const element = await findByTestId(testId);
      expect(element).toBeInTheDocument();
      expect(element.textContent).toBe('Follow goal');
    });

    it('renders stack item tooltip', async () => {
      const user = userEvent.setup();
      const { findByRole, findByTestId } = setup({ as: 'stack-item' });

      const element = await findByTestId(testId);
      await user.hover(element);

      const tooltip = await findByRole('tooltip');
      expect(tooltip.textContent).toBe(
        'Follow this goal to get notifications on updates',
      );
    });

    it('renders project icon', async () => {
      const { findByTestId } = setup({ as: 'stack-item' });
      const element = await findByTestId(
        'smart-action-follow-action-goal-icon',
      );
      expect(element).toBeInTheDocument();
    });
  });
});
