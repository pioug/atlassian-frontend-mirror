import '@atlaskit/link-test-helpers/jest';

import React from 'react';

import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';
import { render, screen } from '@atlassian/testing-library';

import mockContext from '../../../../../../__fixtures__/flexible-ui-data-context';
import { getFlexibleCardTestWrapper } from '../../../../../../__tests__/__utils__/unit-testing-library-helpers';
import { ANALYTICS_CHANNEL } from '../../../../../../utils/analytics/analytics';
import EditAction from '../index';
import { type EditActionProps } from '../types';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('EditAction', () => {
	const testId = 'smart-action-edit-action';

	const setup = (props: EditActionProps) => {
		const onEvent = jest.fn();

		return render(
			<AnalyticsListener onEvent={onEvent} channel={ANALYTICS_CHANNEL}>
				<EditAction {...props} />
			</AnalyticsListener>,
			{ wrapper: getFlexibleCardTestWrapper(mockContext) },
		);
	};

	it('renders action', async () => {
		setup({ onClick: () => '' });
		const element = await screen.findByTestId(testId);
		expect(element).toBeInTheDocument();
		expect(element).toHaveTextContent('Edit');
	});
});
