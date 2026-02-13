import '@atlaskit/link-test-helpers/jest';

import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';

import { AnalyticsListener } from '@atlaskit/analytics-next';

import mockContext from '../../../../../../__fixtures__/flexible-ui-data-context';
import { SmartLinkStatus } from '../../../../../../constants';
import { FlexibleCardContext } from '../../../../../../state/flexible-ui-context';
import * as useRovoChat from '../../../../../../state/hooks/use-rovo-chat';
import { ANALYTICS_CHANNEL } from '../../../../../../utils/analytics';
import RovoChatAction, { RovoChatPromptKey } from '../index';

describe('RovoChatAction', () => {
	const sendPromptMessageMock = jest.fn();

	const setup = (props?: Partial<React.ComponentProps<typeof RovoChatAction>>) => {
		const onEvent = jest.fn();

		return render(
			<AnalyticsListener onEvent={onEvent} channel={ANALYTICS_CHANNEL}>
				<FlexibleCardContext.Provider
					value={{ data: mockContext, status: SmartLinkStatus.Resolved }}
				>
					<IntlProvider locale="en">
						<RovoChatAction {...props} as="stack-item" />
					</IntlProvider>
				</FlexibleCardContext.Provider>
			</AnalyticsListener>,
		);
	};

	beforeEach(() => {
		jest
			.spyOn(useRovoChat, 'default')
			.mockReturnValue({ sendPromptMessage: sendPromptMessageMock });
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should capture and report a11y violations', async () => {
		const { container } = setup();
		await expect(container).toBeAccessible();
	});

	it('renders default stack item action', async () => {
		setup();
		const elements = await screen.findAllByRole('button');
		expect(elements.length).toBe(2);
		expect(elements[0]).toHaveTextContent('Action title 1');
	});

	it('renders defined stack item action', async () => {
		setup({ prompts: [RovoChatPromptKey.MESSAGE_2] });
		const elements = await screen.findAllByRole('button');
		expect(elements.length).toBe(1);
		expect(elements[0]).toHaveTextContent('Action title 2');
	});

	it('does not renders item action', () => {
		setup({ prompts: [] });
		const elements = screen.queryAllByRole('button');
		expect(elements.length).toBe(0);
	});

	it('should send prompt message on click', async () => {
		const user = userEvent.setup();
		setup();

		const element = await screen.findByRole('button', {
			name: 'Action title 1',
		});
		await user.click(element);

		expect(sendPromptMessageMock).toHaveBeenCalledTimes(1);
		expect(sendPromptMessageMock).toHaveBeenCalledWith({
			name: 'Chat title 1',
			dialogues: [],
			prompt: expect.any(Object),
		});
	});

	it('should trigger on click callback', async () => {
		const onClickMock = jest.fn();
		const user = userEvent.setup();
		setup({ onClick: onClickMock });

		const element = await screen.findByRole('button', {
			name: 'Action title 1',
		});
		await user.click(element);

		expect(onClickMock).toHaveBeenCalledTimes(1);
	});

	describe('with tooltip', () => {
		it('renders tooltip', async () => {
			const user = userEvent.setup();
			setup();

			const element = await screen.findByRole('button', {
				name: 'Action title 1',
			});
			await user.hover(element);

			const tooltip = await screen.findByRole('tooltip');
			expect(tooltip).toHaveTextContent('Action tooltip 1');
		});

		it('renders stack item tooltip', async () => {
			const user = userEvent.setup();
			setup({ as: 'stack-item' });

			const element = await screen.findByRole('button', {
				name: 'Action title 1',
			});
			await user.hover(element);

			const tooltip = await screen.findByRole('tooltip');
			expect(tooltip).toHaveTextContent('Action tooltip 1');
		});
	});
});
