import React from 'react';

import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { Root } from '../../root';
import { SideNav } from '../../side-nav/side-nav';
import { SideNavToggleButton } from '../../side-nav/toggle-button';
import { TopNav } from '../../top-nav/top-nav';

import {
	filterFromConsoleErrorOutput,
	parseCssErrorRegex,
	type ResetConsoleErrorFn,
	resetMatchMedia,
	setMediaQuery,
} from './_test-utils';

describe('SideNavToggleButton', () => {
	let resetConsoleErrorSpyFn: ResetConsoleErrorFn;
	beforeAll(() => {
		resetConsoleErrorSpyFn = filterFromConsoleErrorOutput(parseCssErrorRegex);
	});

	afterAll(() => {
		resetConsoleErrorSpyFn();
	});

	beforeEach(() => {
		resetMatchMedia();
	});

	describe('tooltip', () => {
		beforeEach(() => {
			setMediaQuery('(min-width: 64rem)', { initial: true });
		});

		it('should display the correct tooltip when the side nav is hidden', async () => {
			const user = userEvent.setup();

			render(
				<SideNavToggleButton
					collapseLabel="Collapse sidebar"
					expandLabel="Expand sidebar"
					defaultCollapsed
				/>,
			);

			await user.hover(screen.getByRole('button', { name: 'Expand sidebar' }));

			expect(await screen.findByRole('tooltip', { name: 'Expand sidebar' })).toBeInTheDocument();
		});

		it('should display the correct tooltip when the side nav is visible', async () => {
			const user = userEvent.setup();

			render(<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />);

			await user.hover(screen.getByRole('button', { name: 'Collapse sidebar' }));

			expect(await screen.findByRole('tooltip', { name: 'Collapse sidebar' })).toBeInTheDocument();
		});
	});

	describe('onClick prop', () => {
		beforeEach(() => {
			setMediaQuery('(min-width: 64rem)', { initial: true });
		});

		it('should be called when expanding with correct arguments', async () => {
			const user = userEvent.setup();
			const onClickHandlerMock = jest.fn();
			render(
				// Wrapping in Root to provide contexts
				<Root>
					<TopNav>
						<SideNavToggleButton
							collapseLabel="Collapse sidebar"
							expandLabel="Expand sidebar"
							defaultCollapsed
							onClick={onClickHandlerMock}
						/>
					</TopNav>
					{/* Rendering side nav so that the side nav context is correctly populated */}
					<SideNav testId="sidenav" defaultCollapsed>
						sidenav
					</SideNav>
				</Root>,
			);

			await user.click(screen.getByRole('button', { name: 'Expand sidebar' }));

			expect(onClickHandlerMock).toHaveBeenCalledWith(
				expect.anything(),
				expect.anything(),
				expect.objectContaining({ isSideNavVisible: false }),
			);
		});

		it('should be called when collapsing with correct arguments', async () => {
			const user = userEvent.setup();
			const onClickHandlerMock = jest.fn();
			render(
				// Wrapping in Root to provide contexts
				<Root>
					<TopNav>
						<SideNavToggleButton
							collapseLabel="Collapse sidebar"
							expandLabel="Expand sidebar"
							onClick={onClickHandlerMock}
						/>
					</TopNav>
					{/* Rendering side nav so that the side nav context is correctly populated */}
					<SideNav testId="sidenav">sidenav</SideNav>
				</Root>,
			);

			await user.click(screen.getByRole('button', { name: 'Collapse sidebar' }));

			expect(onClickHandlerMock).toHaveBeenCalledWith(
				expect.anything(),
				expect.anything(),
				expect.objectContaining({ isSideNavVisible: true }),
			);
		});
	});

	it('should collapse the side nav on large viewports', async () => {
		const user = userEvent.setup();
		setMediaQuery('(min-width: 64rem)', { initial: true });
		render(
			<Root>
				<TopNav>
					<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
				</TopNav>
				<SideNav testId="sidenav">sidenav</SideNav>
			</Root>,
		);

		// Collapse the side nav (on large viewports it starts expanded)
		await user.click(
			screen.getByRole('button', {
				name: 'Collapse sidebar',
			}),
		);

		// Side nav should be collapsed on all viewports
		expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'false');
	});

	it('should expand the side nav on small viewports', async () => {
		const user = userEvent.setup();

		render(
			<Root>
				<TopNav>
					<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
				</TopNav>
				<SideNav testId="sidenav">sidenav</SideNav>
			</Root>,
		);
		// Expand the side nav (on small viewports it starts collapsed)
		await user.click(
			screen.getByRole('button', {
				name: 'Expand sidebar',
			}),
		);

		// Side nav is now expanded on mobile
		expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'small,large');
	});

	it('should expand the side nav after being collapsed on large viewports', async () => {
		const user = userEvent.setup();
		setMediaQuery('(min-width: 64rem)', { initial: true });

		render(
			<Root>
				<TopNav>
					<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
				</TopNav>
				<SideNav testId="sidenav">sidenav</SideNav>
			</Root>,
		);

		await user.click(
			screen.getByRole('button', {
				name: 'Collapse sidebar',
			}),
		);

		await user.click(
			screen.getByRole('button', {
				name: 'Expand sidebar',
			}),
		);

		// Side nav should be expanded
		expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'large');
	});

	it('should open the side nav after being collapsed and then resized from a large to small viewport', async () => {
		const user = userEvent.setup();
		const matches = setMediaQuery('(min-width: 64rem)', { initial: true });
		render(
			<Root>
				<TopNav>
					<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
				</TopNav>
				<SideNav testId="sidenav">sidenav</SideNav>
			</Root>,
		);

		await user.click(
			screen.getByRole('button', {
				name: 'Collapse sidebar',
			}),
		);

		// We are now considered to be on a small viewport
		act(() => matches(false));

		await user.click(
			screen.getByRole('button', {
				name: 'Expand sidebar',
			}),
		);

		// The side nav should be expanded on small viewports
		expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'small');
	});

	it('should keep the side nav expanded after resizing from a large to small viewport, opening it, and resizing back to a large viewport', async () => {
		const user = userEvent.setup();
		const matches = setMediaQuery('(min-width: 64rem)', { initial: true });
		render(
			<Root>
				<TopNav>
					<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
				</TopNav>
				<SideNav testId="sidenav">sidenav</SideNav>
			</Root>,
		);

		await user.click(
			screen.getByRole('button', {
				name: 'Collapse sidebar',
			}),
		);

		// We are now considered on a small viewport
		act(() => matches(false));

		await user.click(
			screen.getByRole('button', {
				name: 'Expand sidebar',
			}),
		);

		// We are now considered on a large viewport
		act(() => matches(true));

		// The side nav should remain expanded on large viewports
		expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'small,large');
	});

	it('should collapse the side nav after toggling its visibility three times resizing between large -> small -> large viewports', async () => {
		const user = userEvent.setup();
		const matches = setMediaQuery('(min-width: 64rem)', { initial: true });
		render(
			<Root>
				<TopNav>
					<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
				</TopNav>
				<SideNav testId="sidenav">sidenav</SideNav>
			</Root>,
		);

		await user.click(
			screen.getByRole('button', {
				name: 'Collapse sidebar',
			}),
		);

		// We are now considered to be on a small viewport
		act(() => matches(false));

		await user.click(
			screen.getByRole('button', {
				name: 'Expand sidebar',
			}),
		);

		// We are now considered to be on a large viewport
		act(() => matches(true));

		await user.click(
			screen.getByRole('button', {
				name: 'Collapse sidebar',
			}),
		);

		// The side nav should be collapsed on large viewports
		expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'small');
	});

	it('should collapse the side nav when resizing from a large to small viewport, opening and closing, then resizing back to a large viewport', async () => {
		const user = userEvent.setup();
		const matches = setMediaQuery('(min-width: 64rem)', { initial: true });
		render(
			<Root>
				<TopNav>
					<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
				</TopNav>
				<SideNav testId="sidenav">sidenav</SideNav>
			</Root>,
		);

		// We are now considered to be on a small viewport
		act(() => matches(false));

		await user.click(
			screen.getByRole('button', {
				name: 'Expand sidebar',
			}),
		);

		await user.click(
			screen.getByRole('button', {
				name: 'Collapse sidebar',
			}),
		);

		// We are now considered to be on a large viewport
		act(() => matches(true));

		// Collapse the side nav
		await user.click(
			screen.getByRole('button', {
				name: 'Collapse sidebar',
			}),
		);

		// The side nav should be collapsed
		expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'false');
	});

	it('should not throw an error when clicked if the side nav state is not initialised', async () => {
		const user = userEvent.setup();
		setMediaQuery('(min-width: 64rem)', { initial: true });

		render(
			<Root>
				<TopNav>
					<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
				</TopNav>
			</Root>,
		);

		const button = screen.getByRole('button', { name: 'Collapse sidebar' });

		// This syntax is used to ensure the click handler has a chance to finish executing before checking for errors.
		// https://jestjs.io/docs/asynchronous#resolves--rejects
		await expect(user.click(button)).resolves.not.toThrow();
	});

	it('should work correctly when clicked before the side nav is mounted, and then after it is mounted', async () => {
		const user = userEvent.setup();
		setMediaQuery('(min-width: 64rem)', { initial: true });

		// Side nav is not mounted initially
		const { rerender } = render(
			<Root>
				<TopNav>
					<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
				</TopNav>
			</Root>,
		);

		const button = screen.getByRole('button', { name: 'Collapse sidebar' });

		// This syntax is used to ensure the click handler has a chance to finish executing before checking for errors.
		// https://jestjs.io/docs/asynchronous#resolves--rejects
		await expect(user.click(button)).resolves.not.toThrow();

		// Side nav is now mounted
		rerender(
			<Root>
				<TopNav>
					<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
				</TopNav>
				<SideNav testId="sidenav">sidenav</SideNav>
			</Root>,
		);

		// Side nav should be expanded by default on large viewports
		expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'large');

		await user.click(screen.getByRole('button', { name: 'Collapse sidebar' }));

		// Side nav should now be collapsed
		expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'false');
	});
});
