import '@atlaskit/link-test-helpers/jest';

import React from 'react';

import { IntlProvider } from 'react-intl';

import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';
import { render, screen } from '@atlassian/testing-library';

import mockContext from '../../../../../../__fixtures__/flexible-ui-data-context';
import { ANALYTICS_CHANNEL } from '../../../../../../utils/analytics/analytics';
import DeleteAction from '../index';
import { type DeleteActionProps } from '../types';

jest.mock('../../../../../../state/flexible-ui-context/useFlexibleUiContext', () => ({
	...jest.requireActual('../../../../../../state/flexible-ui-context/useFlexibleUiContext'),
	useFlexibleUiContext: jest.fn().mockReturnValue(mockContext),
}));

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('DeleteAction', () => {
	const testId = 'smart-action-delete-action';

	const setup = (props: DeleteActionProps) => {
		const onEvent = jest.fn();

		return render(
			<AnalyticsListener onEvent={onEvent} channel={ANALYTICS_CHANNEL}>
				<IntlProvider locale="en">
					<DeleteAction {...props} />
				</IntlProvider>
			</AnalyticsListener>,
		);
	};

	it('renders action', async () => {
		setup({ onClick: () => '' });
		const element = await screen.findByTestId(testId);
		expect(element).toBeInTheDocument();
		expect(element).toHaveTextContent('Delete');
	});
});
