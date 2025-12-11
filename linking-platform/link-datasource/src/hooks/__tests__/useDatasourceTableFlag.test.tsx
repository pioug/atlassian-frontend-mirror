import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { IntlProvider } from 'react-intl-next';

import '@atlaskit/link-test-helpers/jest';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { FlagsProvider } from '@atlaskit/flag';

import { EVENT_CHANNEL } from '../../analytics';
import { useDatasourceTableFlag } from '../useDatasourceTableFlag';

interface ConsumerProps {
	flag?: Parameters<ReturnType<typeof useDatasourceTableFlag>['showErrorFlag']>[0];
	options?: Parameters<typeof useDatasourceTableFlag>[0];
}
const Consumer = (props?: ConsumerProps) => {
	const { showErrorFlag } = useDatasourceTableFlag(props?.options);

	return (
		<button type="button" onClick={() => showErrorFlag(props?.flag)}>
			show
		</button>
	);
};

const onAnalyticFireEvent = jest.fn();

describe('useDatasourceTableFlag', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	const setup = (args?: ConsumerProps) => {
		render(
			<IntlProvider locale="en">
				<AnalyticsListener channel={EVENT_CHANNEL} onEvent={onAnalyticFireEvent}>
					<FlagsProvider>
						<Consumer {...args} />
					</FlagsProvider>
				</AnalyticsListener>
			</IntlProvider>,
		);

		const button = screen.getByRole('button');
		fireEvent.click(button);
	};

	it('throws when FlagProvider is not provided', async () => {
		const { result } = renderHook(() => useDatasourceTableFlag(), {
			wrapper: ({ children }) => <IntlProvider locale="en">{children}</IntlProvider>,
		});
		expect(result.error).toEqual(Error('Unable to find FlagProviderContext'));

		await expect(document.body).toBeAccessible();
	});

	it('shows error flag', async () => {
		setup();

		expect(screen.getByRole('alert')).toBeInTheDocument();
		expect(screen.queryByText('Something went wrong')).toBeInTheDocument();
		expect(
			screen.queryByText(
				'We had an issue trying to complete the update. Wait a few minutes, then try again. Contact support if this keeps happening.',
			),
		).toBeInTheDocument();

		expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
			{
				payload: {
					eventType: 'ui',
					action: 'shown',
					actionSubject: 'error',
					actionSubjectId: 'inlineEdit',
					attributes: {
						reason: 'request_failed',
					},
				},
			},
			EVENT_CHANNEL,
		);

		await expect(document.body).toBeAccessible();
	});

	it('shows 403 error flag', async () => {
		setup({ flag: { status: 403 } });

		expect(screen.getByRole('alert')).toBeInTheDocument();
		expect(screen.queryByText('Changes not saved')).toBeInTheDocument();
		expect(
			screen.queryByText('You need the right permissions to edit this item.'),
		).toBeInTheDocument();

		expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
			{
				payload: {
					eventType: 'ui',
					action: 'shown',
					actionSubject: 'error',
					actionSubjectId: 'inlineEdit',
					attributes: {
						reason: 'access_denied',
					},
				},
			},
			EVENT_CHANNEL,
		);

		await expect(document.body).toBeAccessible();
	});

	it('shows error flag for inline edit errors', async () => {
		setup({ options: { isFetchAction: true } });

		expect(screen.getByRole('alert')).toBeInTheDocument();
		expect(screen.queryByText('We’re having trouble fetching options')).toBeInTheDocument();
		expect(
			screen.queryByText(
				'Wait a few minutes, then try again. Check your project settings or contact support if this keeps happening.',
			),
		).toBeInTheDocument();

		await expect(document.body).toBeAccessible();
	});
});
