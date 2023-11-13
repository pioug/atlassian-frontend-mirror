import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import '@atlaskit/link-test-helpers/jest';

import { ANALYTICS_CHANNEL } from '../../../common/constants';

import { ConfirmDismissDialog, ConfirmDismissDialogProps } from './main';

describe('ConfirmDismissDialog', () => {
  const setup = (props?: Partial<ConfirmDismissDialogProps>) => {
    const analyticsSpy = jest.fn();

    const defaultProps: ConfirmDismissDialogProps = {
      active: true,
      onClose: () => {},
    };

    const { rerender } = render(
      <ConfirmDismissDialog {...defaultProps} {...props} />,
      {
        wrapper: ({ children }) => (
          <IntlProvider locale="en">
            <AnalyticsListener channel="media" onEvent={analyticsSpy}>
              {children}
            </AnalyticsListener>
          </IntlProvider>
        ),
      },
    );

    return {
      analyticsSpy,
      rerender: (props?: Partial<ConfirmDismissDialogProps>) =>
        rerender(<ConfirmDismissDialog {...defaultProps} {...props} />),
    };
  };

  it('should fire a screen event on mount', async () => {
    const { rerender, analyticsSpy } = setup({ active: false });
    const screenEvent = {
      payload: {
        name: 'linkCreateExitWarningScreen',
        action: 'viewed',
      },
    };

    expect(analyticsSpy).not.toBeFiredWithAnalyticEventOnce(screenEvent);

    rerender({ active: true });

    expect(
      await screen.findByTestId('link-create-confirm-dismiss-dialog'),
    ).toBeInTheDocument();
    expect(analyticsSpy).toBeFiredWithAnalyticEventOnce(
      screenEvent,
      ANALYTICS_CHANNEL,
    );
  });

  it('should fire a cancel button event', async () => {
    const { analyticsSpy } = setup();

    userEvent.click(await screen.findByRole('button', { name: 'Go back' }));

    await waitFor(() => {
      expect(analyticsSpy).toBeFiredWithAnalyticEventOnce(
        {
          payload: {
            actionSubject: 'button',
            action: 'clicked',
            actionSubjectId: 'cancel',
          },
        },
        ANALYTICS_CHANNEL,
      );
    });
  });

  it('should fire a confirm button event', async () => {
    const { analyticsSpy } = setup();

    userEvent.click(await screen.findByRole('button', { name: 'Discard' }));

    await waitFor(() => {
      expect(analyticsSpy).toBeFiredWithAnalyticEventOnce(
        {
          payload: {
            actionSubject: 'button',
            action: 'clicked',
            actionSubjectId: 'confirm',
          },
        },
        ANALYTICS_CHANNEL,
      );
    });
  });
});
