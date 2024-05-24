import React from 'react';
import { IntlProvider } from 'react-intl-next';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import { render } from '@testing-library/react';
import '@atlaskit/link-test-helpers/jest';

import mockContextDefault from '../../../../../../__fixtures__/flexible-ui-data-context';
import { ANALYTICS_CHANNEL } from '../../../../../../utils/analytics';
import { type ViewRelatedLinksActionProps } from '../types';
import type { FlexibleUiDataContext } from '../../../../../../state/flexible-ui-context/types';
import { useFlexibleUiContext } from '../../../../../../state/flexible-ui-context';
import ViewRelatedLinksAction from '..';

jest.mock('../../../../../../state/flexible-ui-context', () => ({
  ...jest.requireActual('../../../../../../state/flexible-ui-context'),
  useFlexibleUiContext: jest.fn().mockReturnValue(mockContextDefault),
}));

describe('ViewRelatedLinksAction', () => {
  const defaultProps = { onClick: () => {} };
  const testId = 'smart-action-view-related-links-action';

  const setup = (
    props: ViewRelatedLinksActionProps = defaultProps,
    overrideContext?: FlexibleUiDataContext,
  ) => {
    const onEvent = jest.fn();

    (useFlexibleUiContext as jest.Mock).mockImplementation(
      () => overrideContext || mockContextDefault,
    );

    const renderResult = render(
      <AnalyticsListener onEvent={onEvent} channel={ANALYTICS_CHANNEL}>
        <IntlProvider locale="en">
          <ViewRelatedLinksAction {...props} testId={testId} />
        </IntlProvider>
      </AnalyticsListener>,
    );

    return { ...renderResult, onEvent };
  };

  it('renders related links action if action data is present', async () => {
    const { findByTestId } = setup();

    const element = await findByTestId(testId);

    expect(element).toBeInTheDocument();
    expect(element.textContent).toBe('View recent links...');
  });

  it('does not render related links action if action data is not present', async () => {
    const { queryByTestId } = setup(defaultProps, {
      ...mockContextDefault,
      actions: {
        ...mockContextDefault.actions,
        ViewRelatedLinksAction: undefined,
      },
    });

    expect(queryByTestId(testId)).toBeNull();
  });

  it('renders related links with aria-label', async () => {
    const { findByLabelText, findByTestId } = setup();
    const element = await findByTestId(testId);
    const actionWithAriaLabel = await findByLabelText(
      'View most recent pages or content types coming from or found on this link',
    );
    expect(element).toBe(actionWithAriaLabel);
  });

  it('invokes the onClick callback when the action is clicked', async () => {
    const onClick = jest.fn();
    const { getByTestId } = setup({ onClick });

    getByTestId(testId).click();

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
