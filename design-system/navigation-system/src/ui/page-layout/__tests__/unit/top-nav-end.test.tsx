import React, { useState } from 'react';

import SettingsIcon from '@atlaskit/icon/core/settings';
import { UNSAFE_useMediaQuery } from '@atlaskit/primitives/compiled/use-media-query';
import { passGate, failGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';
import { userEvent } from '@atlassian/testing-library/user-event';

import { EndItem } from '../../../top-nav-items/end-item';
import { TopNavEnd } from '../../top-nav/top-nav-end';

jest.mock('@atlaskit/primitives/compiled/use-media-query', () => ({
	...jest.requireActual('@atlaskit/primitives/compiled/use-media-query'),
	UNSAFE_useMediaQuery: jest.fn(() => ({
		matches: false, // default value
	})),
}));

const mockUseMediaQuery = UNSAFE_useMediaQuery as jest.Mock;

describe('TopNavEnd', () => {
	beforeEach(() => {
		// Default to large viewport
		mockUseMediaQuery.mockReturnValue({ matches: false });
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	const BasicAction = () => <EndItem icon={SettingsIcon} label="Settings" />;

	describe('persistent actions', () => {
		it.each([
			{ isMobile: false, precedingAction: 'Settings' },
			{ isMobile: true, precedingAction: 'Show more' },
		])(
			'should place persistent actions last when isMobile is $isMobile',
			({ isMobile, precedingAction }) => {
				passGate('platform-dst-chat-panel-layout');
				mockUseMediaQuery.mockReturnValue({ matches: isMobile });
				render(
					<TopNavEnd persistentItems={<button>Ask Rovo</button>}>
						<BasicAction />
					</TopNavEnd>,
				);
				// DOM order determines both the flex layout and the keyboard sequence.
				expect(screen.getAllByRole('button', { hidden: true })).toEqual([
					screen.getByRole('button', { name: precedingAction, hidden: true }),
					screen.getByRole('button', { name: 'Ask Rovo' }),
				]);
			},
		);

		it('should keep an action mounted across viewport and overflow changes', async () => {
			passGate('platform-dst-chat-panel-layout');
			function PersistentAction() {
				const [count, setCount] = useState(0);
				return (
					<div role="list">
						<div role="listitem">
							<button onClick={() => setCount(count + 1)}>Persistent {count}</button>
						</div>
					</div>
				);
			}
			const component = (
				<TopNavEnd persistentItems={<PersistentAction />}>
					<BasicAction />
				</TopNavEnd>
			);
			const { rerender } = render(component);
			const button = screen.getByRole('button', { name: 'Persistent 0' });
			await userEvent.click(button);

			mockUseMediaQuery.mockReturnValue({ matches: true });
			rerender(
				<TopNavEnd persistentItems={<PersistentAction />}>
					<BasicAction />
				</TopNavEnd>,
			);
			expect(screen.getByRole('button', { name: 'Persistent 1' })).toBe(button);
			await userEvent.click(screen.getByRole('button', { name: 'Show more' }));
			expect(screen.getAllByRole('button', { name: 'Persistent 1' })).toHaveLength(1);

			mockUseMediaQuery.mockReturnValue({ matches: false });
			rerender(
				<TopNavEnd persistentItems={<PersistentAction />}>
					<BasicAction />
				</TopNavEnd>,
			);
			expect(screen.getByRole('button', { name: 'Persistent 1' })).toBe(button);
		});

		it('should omit persistent actions when the gate is off', () => {
			failGate('platform-dst-chat-panel-layout');
			render(
				<TopNavEnd persistentItems={<button>Persistent</button>}>
					<BasicAction />
				</TopNavEnd>,
			);
			expect(screen.queryByRole('button', { name: 'Persistent' })).not.toBeInTheDocument();
		});
	});

	it('should be labelled', () => {
		render(
			<TopNavEnd label="Actions">
				<BasicAction />
			</TopNavEnd>,
		);

		expect(screen.getByRole('navigation', { name: 'Actions' })).toBeVisible();
	});

	it('should be accessible for large viewports', async () => {
		mockUseMediaQuery.mockReturnValue({ matches: false });

		const { container } = render(
			<TopNavEnd>
				<BasicAction />
			</TopNavEnd>,
		);

		await expect(container).toBeAccessible();
		// Using `hidden: true` as the element becomes visible through a CSS media query, which we can't mock in the test.
		expect(screen.getByRole('list', { hidden: true })).toBeInTheDocument();
	});

	it('should be accessible for small viewports', async () => {
		mockUseMediaQuery.mockReturnValue({ matches: true });

		const { container } = render(
			<TopNavEnd>
				<BasicAction />
			</TopNavEnd>,
		);

		await expect(container).toBeAccessible();

		// Open popup content
		const button = screen.getByRole('button', { name: 'Show more' });
		await userEvent.click(button);

		expect(screen.getByRole('list')).toBeVisible();
	});

	it('should render actions if provided', () => {
		const count = 4;
		const actions = [];

		for (let i = 0; i < count; i++) {
			actions.push(<BasicAction key={i} />);
		}

		expect(actions).toHaveLength(count);

		render(<TopNavEnd>{actions}</TopNavEnd>);
		expect(screen.getAllByRole('button', { hidden: true })).toHaveLength(count);
	});

	describe("TopNavEnd 'show more' buttons", () => {
		it('should be visible in small viewports', () => {
			mockUseMediaQuery.mockReturnValue({ matches: true });

			render(
				<TopNavEnd label="Actions">
					<EndItem icon={SettingsIcon} label="End item" />
				</TopNavEnd>,
			);

			expect(screen.getByRole('button', { name: 'Show more' })).toBeInTheDocument();
		});

		it('should be hidden for large viewports', () => {
			mockUseMediaQuery.mockReturnValue({ matches: false });

			render(
				<TopNavEnd label="Actions">
					<EndItem icon={SettingsIcon} label="End item" />
				</TopNavEnd>,
			);

			expect(screen.queryByRole('button', { name: 'Show more' })).not.toBeInTheDocument();
		});

		it('should open the popup when on click triggers', async () => {
			mockUseMediaQuery.mockReturnValue({ matches: true });

			render(
				<TopNavEnd label="Actions">
					<EndItem icon={SettingsIcon} label="End item" />
				</TopNavEnd>,
			);

			const button = screen.getByRole('button', { name: 'Show more' });
			await userEvent.click(button);

			expect(button).toHaveAttribute('aria-expanded', 'true');
		});
	});
});
