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
	options?: Parameters<typeof useDatasourceTableFlag>[0];
	flag?: Parameters<ReturnType<typeof useDatasourceTableFlag>['showErrorFlag']>[0];
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

	it('throws when FlagProvider is not provided', () => {
		const { result } = renderHook(() => useDatasourceTableFlag(), {
			wrapper: ({ children }) => <IntlProvider locale="en">{children}</IntlProvider>,
		});
		expect(result.error).toEqual(Error('Unable to find FlagProviderContext'));
	});

	it('shows error flag', () => {
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
	});

	it('shows 403 error flag', () => {
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
	});
});
