import '@atlaskit/link-test-helpers/jest';

import React from 'react';

import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { AnalyticsListener } from '@atlaskit/analytics-next';

import mockContext from '../../../../../../__fixtures__/flexible-ui-data-context';
import { ANALYTICS_CHANNEL } from '../../../../../../utils/analytics';
import DeleteAction from '../index';
import { type DeleteActionProps } from '../types';

jest.mock('../../../../../../state/flexible-ui-context', () => ({
	...jest.requireActual('../../../../../../state/flexible-ui-context'),
	useFlexibleUiContext: jest.fn().mockReturnValue(mockContext),
}));

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
