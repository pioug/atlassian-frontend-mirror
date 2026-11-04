import React from 'react';

import SettingsIcon from '@atlaskit/icon/core/settings';
import { passGate, failGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { act } from '@atlassian/testing-library/act';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';
import { userEvent } from '@atlassian/testing-library/user-event';

import { EndItem } from '../../../top-nav-items/end-item';
import { TopNav } from '../../top-nav/top-nav';
import { TopNavEnd } from '../../top-nav/top-nav-end';
import { TopNavMiddle } from '../../top-nav/top-nav-middle';
import { useTopNavBreakpoints } from '../../top-nav/use-top-nav-breakpoints';

const originalResizeObserver = global.ResizeObserver;
let onResize: ResizeObserverCallback;
const observerMock = { observe: jest.fn(), unobserve: jest.fn(), disconnect: jest.fn() };

beforeEach(() => {
	global.ResizeObserver = jest.fn().mockImplementation((callback: ResizeObserverCallback) => {
		onResize = callback;
		return observerMock;
	});
});

afterEach(() => {
	global.ResizeObserver = originalResizeObserver;
	jest.restoreAllMocks();
	jest.clearAllMocks();
});

it.each([false, true])(
	'should collapse actions when only the container shrinks (new theme: %s)',
	async (newTheme) => {
		passGate('platform-dst-chat-panel-layout');
		(newTheme ? passGate : failGate)('platform_dst_nav4_custom_theming_fhs_1');
		const { user } = setupComponent();
		expect(screen.getByText('wide')).toBeInTheDocument();
		expect(screen.queryByRole('button', { name: 'Show more' })).not.toBeInTheDocument();
		resize(800);
		expect(screen.getByText('wide')).toBeInTheDocument();
		resize(600);
		expect(screen.getByText('compact')).toBeInTheDocument();
		expect(screen.queryByRole('button', { name: 'Settings' })).not.toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Ask Rovo' })).toBeInTheDocument();
		await user.click(screen.getByRole('button', { name: 'Show more' }));
		expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument();
		resize(800);
		resize(600);
		expect(screen.getByRole('button', { name: 'Show more' })).toHaveAttribute(
			'aria-expanded',
			'false',
		);
		// React rendering decisions share one observer rather than subscribing per item.
		expect(global.ResizeObserver).toHaveBeenCalledTimes(1);
	},
);

it('should keep viewport behaviour and omit container observation with the gate disabled', () => {
	failGate('platform-dst-chat-panel-layout');
	setupComponent();
	expect(screen.getByText('viewport')).toBeInTheDocument();
	expect(global.ResizeObserver).not.toHaveBeenCalled();
});

function BreakpointConsumer() {
	const breakpoints = useTopNavBreakpoints();
	return <span>{!breakpoints ? 'viewport' : breakpoints.belowSm ? 'compact' : 'wide'}</span>;
}

function resize(width: number) {
	act(() =>
		onResize(
			[
				{
					target: screen.getByRole('banner'),
					borderBoxSize: [{ inlineSize: width }],
				} as unknown as ResizeObserverEntry,
			],
			observerMock,
		),
	);
}

function setupComponent() {
	jest
		.spyOn(HTMLElement.prototype, 'getBoundingClientRect')
		.mockReturnValue({ width: 1200 } as DOMRect);
	return {
		...render(
			<TopNav>
				<TopNavMiddle>
					<BreakpointConsumer />
				</TopNavMiddle>
				<TopNavEnd
					persistentItems={
						<div role="list">
							<div role="listitem">
								<button>Ask Rovo</button>
							</div>
						</div>
					}
				>
					<EndItem icon={SettingsIcon} label="Settings" />
				</TopNavEnd>
			</TopNav>,
		),
		user: userEvent.setup(),
	};
}
