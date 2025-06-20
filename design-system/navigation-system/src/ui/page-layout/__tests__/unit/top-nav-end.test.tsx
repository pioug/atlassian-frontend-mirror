import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SettingsIcon from '@atlaskit/icon/glyph/settings';
import { UNSAFE_useMediaQuery } from '@atlaskit/primitives/compiled';

import { EndItem } from '../../../top-nav-items/end-item';
import { TopNavEnd } from '../../top-nav/top-nav-end';

jest.mock('@atlaskit/primitives/compiled', () => {
	const actual = jest.requireActual('@atlaskit/primitives/compiled');
	return {
		...actual,
		UNSAFE_useMediaQuery: jest.fn((query: string, listener?: (e: MediaQueryListEvent) => void) => ({
			matches: false, // default value
		})),
	};
});

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
