import '@atlaskit/link-test-helpers/jest';
import React from 'react';

import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { screen } from '@atlassian/testing-library/screen';
import { render } from '@atlassian/testing-library/testing-library/react';
import { userEvent } from '@atlassian/testing-library/user-event';

import mockContext from '../../../../../../__fixtures__/flexible-ui-data-context';
import { getFlexibleCardTestWrapper } from '../../../../../../__tests__/__utils__/unit-testing-library-helpers';
import { ANALYTICS_CHANNEL } from '../../../../../../utils/analytics/analytics';
import FollowAction from '../index';
import { type FollowActionProps } from '../types';

describe('FollowAction', () => {
	const testId = 'smart-action-follow-action';

	const setup = (props?: Partial<FollowActionProps>) => {
		const onEvent = jest.fn();

		return render(
			<AnalyticsListener onEvent={onEvent} channel={ANALYTICS_CHANNEL}>
				<FollowAction {...props} />
			</AnalyticsListener>,
			{ wrapper: getFlexibleCardTestWrapper(mockContext) },
		);
	};

	describe('existing follow action button', () => {
		it('renders follow action button', async () => {
			setup();
			const element = await screen.findByTestId(testId);
			expect(element).toBeInTheDocument();
			expect(element).toHaveTextContent('Follow');
		});

		it('renders tooltip', async () => {
			const user = userEvent.setup();
			setup();

			const element = await screen.findByTestId(testId);
			await user.hover(element);

			const tooltip = await screen.findByRole('tooltip');
			expect(tooltip).toHaveTextContent('Follow');
		});
	});

	describe.each([
		['on', passGate],
		['off', failGate],
	])('stack item icon when platform_sl_replace_react_loadable is %s', (_, setGate) => {
		it('renders the lazily loaded follow icon', async () => {
			setGate('platform_sl_replace_react_loadable');
			setup({ as: 'stack-item' });

			expect(
				await screen.findByTestId(/^smart-action-follow-action-(goal|projects)-icon$/),
			).toBeInTheDocument();
		});
	});

	it('should capture and report a11y violations', async () => {
		const { container } = setup();
		await expect(container).toBeAccessible();
	});
});
