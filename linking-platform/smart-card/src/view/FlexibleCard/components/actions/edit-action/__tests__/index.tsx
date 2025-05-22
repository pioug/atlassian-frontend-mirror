import '@atlaskit/link-test-helpers/jest';

import React from 'react';

import { render, screen } from '@testing-library/react';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import mockContext from '../../../../../../__fixtures__/flexible-ui-data-context';
import { getFlexibleCardTestWrapper } from '../../../../../../__tests__/__utils__/unit-testing-library-helpers';
import { ANALYTICS_CHANNEL } from '../../../../../../utils/analytics';
import EditAction from '../index';
import { type EditActionProps } from '../types';

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

	ffTest.both('platform-linking-flexible-card-context', 'with fg', () => {
		it('renders action', async () => {
			setup({ onClick: () => '' });
			const element = await screen.findByTestId(testId);
			expect(element).toBeInTheDocument();
			expect(element).toHaveTextContent('Edit');
		});
	});
});
