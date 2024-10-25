import '@atlaskit/link-test-helpers/jest';

import React from 'react';

import { render, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import { SmartCardProvider } from '@atlaskit/link-provider';

import mockContextDefault from '../../../../../../__fixtures__/flexible-ui-data-context';
import { useFlexibleUiContext } from '../../../../../../state/flexible-ui-context';
import type { FlexibleUiDataContext } from '../../../../../../state/flexible-ui-context/types';
import { SmartLinkModalProvider } from '../../../../../../state/modal';
import { ANALYTICS_CHANNEL } from '../../../../../../utils/analytics';
import ViewRelatedLinksAction from '../index';
import { type ViewRelatedLinksActionProps } from '../types';

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
					<SmartCardProvider>
						<SmartLinkModalProvider>
							<ViewRelatedLinksAction {...props} testId={testId} />
						</SmartLinkModalProvider>
					</SmartCardProvider>
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

	it('opens the RelatedLinksModal when the action is clicked', async () => {
		//returning a valid json response
		fetchMock.mockResponse(() => Promise.resolve({ body: '{}' }));
		const user = userEvent.setup();
		const onClick = jest.fn();

		const { getByTestId, findByRole, findByText, onEvent } = setup({ onClick });

		const actionButton = getByTestId(testId);
		user.click(actionButton);

		const modal = await findByRole('dialog');
		expect(modal).toBeInTheDocument();

		const modalTitle = await findByText('Recent links');
		expect(modalTitle).toBeInTheDocument();

		// will render unavailable view
		const unavailableView = await findByText('No recent links');
		expect(unavailableView).toBeInTheDocument();

		const closeButton = await findByRole('button', { name: 'Close' });
		expect(closeButton).toBeInTheDocument();

		expect(onEvent).toBeFiredWithAnalyticEventOnce({
			payload: {
				action: 'clicked',
				actionSubject: 'button',
				eventType: 'ui',
				actionSubjectId: 'relatedLinks',
			},
		});

		expect(onClick).toHaveBeenCalledTimes(1);

		user.click(closeButton);
		await waitForElementToBeRemoved(modal);
	});
});
