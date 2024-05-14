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
        value: false,
        isProject: true,
      },
    },
  }),
}));

describe('UnfollowAction', () => {
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

  describe('existing unfollow action button', () => {
    it('renders unfollow action button', async () => {
      const { findByTestId } = setup();
      const element = await findByTestId(testId);
      expect(element).toBeInTheDocument();
      expect(element.textContent).toBe('Unfollow');
    });

    it('renders tooltip', async () => {
      const user = userEvent.setup();
      const { findByRole, findByTestId } = setup();

      const element = await findByTestId(testId);
      await user.hover(element);

      const tooltip = await findByRole('tooltip');
      expect(tooltip.textContent).toBe('Unfollow');
    });
  });

  describe('new stack item unfollow project', () => {
    it('renders unfollow stack item action', async () => {
      const { findByTestId } = setup({ as: 'stack-item' });
      const element = await findByTestId(testId);
      expect(element).toBeInTheDocument();
      expect(element.textContent).toBe('Unfollow project');
    });

    it('renders stack item tooltip', async () => {
      const user = userEvent.setup();
      const { findByRole, findByTestId } = setup({ as: 'stack-item' });

      const element = await findByTestId(testId);
      await user.hover(element);

      const tooltip = await findByRole('tooltip');
      expect(tooltip.textContent).toBe(
        'Unfollow to stop receiving project notifications',
      );
    });

    it('renders project icon', async () => {
      const { findByTestId } = setup({ as: 'stack-item' });
      const element = await findByTestId(
        'smart-action-follow-action-projects-icon',
      );
      expect(element).toBeInTheDocument();
    });
  });
});
