import React, { useContext, useRef, useState } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ffTest } from '@atlassian/feature-flags-test-utils';
import { resetMatchMedia, setMediaQuery } from '@atlassian/test-utils';

import { SetSideNavVisibilityState } from '../../side-nav/set-side-nav-visibility-state';
import { SideNavRefContext } from '../../side-nav/side-nav-ref-context';
import { SideNavVisibilityState } from '../../side-nav/side-nav-visibility-state';
import type { SideNavState, SideNavTrigger } from '../../side-nav/types';
import { useSideNavRef } from '../../side-nav/use-side-nav-ref';
import { useToggleSideNav } from '../../side-nav/use-toggle-side-nav';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('useToggleSideNav', () => {
	beforeEach(() => {
		resetMatchMedia();
	});

	/**
	 * These unit tests are not using `renderHook`, but are instead using a test component to assert that the returned function
	 * is updating the side nav state correctly.
	 *
	 * This is because the hook calls the state updater function (SetSideNavVisibilityState) by passing a function to it, so it
	 * can access the current state when updating the value. This means we can't simply mock the function and assert with
	 * `toHaveBeenCalledWith` - as it is called with a function, not a value.
	 */
	function TestComponent({
		trigger,
	}: {
		trigger?: SideNavTrigger;
	} = {}) {
		const sideNavState = useContext(SideNavVisibilityState);
		const toggleSideNav = useToggleSideNav({ trigger });

		return (
			<div>
				{sideNavState ? (
					<>
						<p>Mobile state: {sideNavState.mobile}</p>
						<p>Desktop state: {sideNavState.desktop}</p>
						<p>Flyout state: {sideNavState.flyout}</p>
						<p>Last trigger: {sideNavState?.lastTrigger || 'null'}</p>
					</>
				) : (
					<p>State not initialised</p>
				)}
				<button type="button" onClick={toggleSideNav}>
					Toggle side nav
				</button>
			</div>
		);
	}

	// We are using a mock provider instead of `SideNavVisibilityProvider` so we can set an initial value.
	// The actual provider component does not set a default value, so it can be set after SSR based on the props provided to SideNav.
	function MockProvider({
		children,
		initialState,
	}: {
		children: React.ReactNode;
		initialState: SideNavState | null;
	}) {
		// Defaults to null so we can determine if the value has been set yet (for SSR)
		const [sideNavState, setSideNavState] = useState<SideNavState | null>(initialState);

		return (
			<SideNavVisibilityState.Provider value={sideNavState}>
				<SetSideNavVisibilityState.Provider value={setSideNavState}>
					{children}
				</SetSideNavVisibilityState.Provider>
			</SideNavVisibilityState.Provider>
		);
	}

	/**
	 * Renders the provider in the parent and the hook in a child, which matches real usage: `useSideNavRef` /
	 * `useToggleSideNav` only see the custom ref if they run under the provider, not in the same component
	 * that renders the provider.
	 */
	function TestComponentWithSideNavRef({
		trigger = 'programmatic',
	}: {
		trigger?: SideNavTrigger;
	} = {}) {
		const sideNavRef = useRef<HTMLDivElement | null>(null);
		return (
			<SideNavRefContext.Provider value={sideNavRef}>
				<TestSideNavToggleView trigger={trigger} />
			</SideNavRefContext.Provider>
		);
	}

	function TestSideNavToggleView({ trigger }: { trigger: SideNavTrigger }) {
		const sideNavState = useContext(SideNavVisibilityState);
		const sideNavRef = useSideNavRef();
		const toggleSideNav = useToggleSideNav({ trigger });

		return (
			<div>
				{sideNavState ? (
					<>
						<p>Mobile state: {sideNavState.mobile}</p>
						<p>Desktop state: {sideNavState.desktop}</p>
						<p>Flyout state: {sideNavState.flyout}</p>
						<p>Last trigger: {sideNavState?.lastTrigger || 'null'}</p>
					</>
				) : (
					<p>State not initialised</p>
				)}
				<button type="button" onClick={toggleSideNav}>
					Toggle side nav
				</button>
				<div ref={sideNavRef} data-testid="side-nav-mock">
					<a href="#first">First link</a>
				</div>
			</div>
		);
	}

	describe('when screen size is desktop', () => {
		beforeEach(() => {
			setMediaQuery('(min-width: 64rem)', { initial: true });
		});

		it('should update the side nav visibility correctly when collapsed on desktop', async () => {
			const user = userEvent.setup();

			render(
				<MockProvider
					initialState={{
						mobile: 'collapsed',
						desktop: 'collapsed',
						flyout: 'closed',
						lastTrigger: null,
					}}
				>
					<TestComponent />
				</MockProvider>,
			);

			// Verify state before expanding
			expect(screen.getByText('Mobile state: collapsed')).toBeInTheDocument();
			expect(screen.getByText('Desktop state: collapsed')).toBeInTheDocument();
			expect(screen.getByText('Flyout state: closed')).toBeInTheDocument();

			await user.click(screen.getByRole('button', { name: 'Toggle side nav' }));

			// Only the desktop state should change and should now be expanded
			expect(screen.getByText('Mobile state: collapsed')).toBeInTheDocument();
			expect(screen.getByText('Desktop state: expanded')).toBeInTheDocument();
			expect(screen.getByText('Flyout state: closed')).toBeInTheDocument();
		});

		it('should update the side nav visibility correctly when expanded on desktop', async () => {
			const user = userEvent.setup();

			render(
				<MockProvider
					initialState={{
						mobile: 'collapsed',
						desktop: 'expanded',
						flyout: 'closed',
						lastTrigger: null,
					}}
				>
					<TestComponent />
				</MockProvider>,
			);

			// Verify state before expanding
			expect(screen.getByText('Mobile state: collapsed')).toBeInTheDocument();
			expect(screen.getByText('Desktop state: expanded')).toBeInTheDocument();
			expect(screen.getByText('Flyout state: closed')).toBeInTheDocument();

			await user.click(screen.getByRole('button', { name: 'Toggle side nav' }));

			// Only the desktop state should change and should now be collapsed
			expect(screen.getByText('Mobile state: collapsed')).toBeInTheDocument();
			expect(screen.getByText('Desktop state: collapsed')).toBeInTheDocument();
			expect(screen.getByText('Flyout state: closed')).toBeInTheDocument();
		});

		it('should not throw an error when clicked if the side nav state is not initialised', async () => {
			const user = userEvent.setup();

			render(
				<MockProvider initialState={null}>
					<TestComponent />
				</MockProvider>,
			);

			expect(screen.getByText('State not initialised')).toBeInTheDocument();

			await expect(
				user.click(screen.getByRole('button', { name: 'Toggle side nav' })),
			).resolves.not.toThrow();

			// Should be no change
			expect(screen.getByText('State not initialised')).toBeInTheDocument();
		});
	});

	describe('when screen size is mobile', () => {
		it('should update the side nav visibility correctly when collapsed on mobile', async () => {
			const user = userEvent.setup();

			render(
				<MockProvider
					initialState={{
						mobile: 'collapsed',
						desktop: 'collapsed',
						flyout: 'closed',
						lastTrigger: null,
					}}
				>
					<TestComponent />
				</MockProvider>,
			);

			// Verify state before expanding
			expect(screen.getByText('Mobile state: collapsed')).toBeInTheDocument();
			expect(screen.getByText('Desktop state: collapsed')).toBeInTheDocument();
			expect(screen.getByText('Flyout state: closed')).toBeInTheDocument();

			await user.click(screen.getByRole('button', { name: 'Toggle side nav' }));

			// Only the mobile state should change and should now be expanded
			expect(screen.getByText('Mobile state: expanded')).toBeInTheDocument();
			expect(screen.getByText('Desktop state: collapsed')).toBeInTheDocument();
			expect(screen.getByText('Flyout state: closed')).toBeInTheDocument();
		});

		it('should update the side nav visibility correctly when expanded on mobile', async () => {
			const user = userEvent.setup();

			render(
				<MockProvider
					initialState={{
						mobile: 'expanded',
						desktop: 'collapsed',
						flyout: 'closed',
						lastTrigger: null,
					}}
				>
					<TestComponent />
				</MockProvider>,
			);

			// Verify state before expanding
			expect(screen.getByText('Mobile state: expanded')).toBeInTheDocument();
			expect(screen.getByText('Desktop state: collapsed')).toBeInTheDocument();
			expect(screen.getByText('Flyout state: closed')).toBeInTheDocument();

			await user.click(screen.getByRole('button', { name: 'Toggle side nav' }));

			// Only the mobile state should change and should now be collapsed
			expect(screen.getByText('Mobile state: collapsed')).toBeInTheDocument();
			expect(screen.getByText('Desktop state: collapsed')).toBeInTheDocument();
			expect(screen.getByText('Flyout state: closed')).toBeInTheDocument();
		});

		it('should not throw an error when clicked if the side nav state is not initialised', async () => {
			const user = userEvent.setup();

			render(
				<MockProvider initialState={null}>
					<TestComponent />
				</MockProvider>,
			);

			expect(screen.getByText('State not initialised')).toBeInTheDocument();

			await expect(
				user.click(screen.getByRole('button', { name: 'Toggle side nav' })),
			).resolves.not.toThrow();

			// Should be no change
			expect(screen.getByText('State not initialised')).toBeInTheDocument();
		});
	});

	it('should toggle the side nav visibility correctly when changing screen sizes', async () => {
		const matches = setMediaQuery('(min-width: 64rem)', { initial: true });
		const user = userEvent.setup();

		render(
			<MockProvider
				initialState={{
					mobile: 'collapsed',
					desktop: 'collapsed',
					flyout: 'closed',
					lastTrigger: null,
				}}
			>
				<TestComponent />
			</MockProvider>,
		);

		// Verify state before expanding
		expect(screen.getByText('Mobile state: collapsed')).toBeInTheDocument();
		expect(screen.getByText('Desktop state: collapsed')).toBeInTheDocument();
		expect(screen.getByText('Flyout state: closed')).toBeInTheDocument();

		await user.click(screen.getByRole('button', { name: 'Toggle side nav' }));

		// Only the desktop state should change and should now be expanded
		expect(screen.getByText('Mobile state: collapsed')).toBeInTheDocument();
		expect(screen.getByText('Desktop state: expanded')).toBeInTheDocument();
		expect(screen.getByText('Flyout state: closed')).toBeInTheDocument();

		// Simulate changing to mobile screen
		matches(false);

		await user.click(screen.getByRole('button', { name: 'Toggle side nav' }));

		// Only the desktop state should change and should now be expanded
		expect(screen.getByText('Mobile state: expanded')).toBeInTheDocument();
		expect(screen.getByText('Desktop state: expanded')).toBeInTheDocument();
		expect(screen.getByText('Flyout state: closed')).toBeInTheDocument();

		// Simulate changing back to desktop screen
		matches(true);

		await user.click(screen.getByRole('button', { name: 'Toggle side nav' }));

		// Only the desktop state should change and should now be collapsed
		expect(screen.getByText('Mobile state: expanded')).toBeInTheDocument();
		expect(screen.getByText('Desktop state: collapsed')).toBeInTheDocument();
		expect(screen.getByText('Flyout state: closed')).toBeInTheDocument();
	});

	it('should set the trigger correctly when provided', async () => {
		setMediaQuery('(min-width: 64rem)', { initial: true });
		const user = userEvent.setup();

		render(
			<MockProvider
				initialState={{
					mobile: 'collapsed',
					desktop: 'collapsed',
					flyout: 'closed',
					lastTrigger: null,
				}}
			>
				<TestComponent trigger="programmatic" />
			</MockProvider>,
		);

		// Verify initial state
		expect(screen.getByText('Last trigger: null')).toBeInTheDocument();

		await user.click(screen.getByRole('button', { name: 'Toggle side nav' }));

		// Verify the trigger was set correctly
		expect(screen.getByText('Last trigger: programmatic')).toBeInTheDocument();
		expect(screen.getByText('Desktop state: expanded')).toBeInTheDocument();
	});

	it('should use default trigger "programmatic" when no trigger is provided', async () => {
		setMediaQuery('(min-width: 64rem)', { initial: true });
		const user = userEvent.setup();

		render(
			<MockProvider
				initialState={{
					mobile: 'collapsed',
					desktop: 'collapsed',
					flyout: 'closed',
					lastTrigger: null,
				}}
			>
				<TestComponent />
			</MockProvider>,
		);

		// Verify initial state
		expect(screen.getByText('Last trigger: null')).toBeInTheDocument();

		await user.click(screen.getByRole('button', { name: 'Toggle side nav' }));

		// Verify the default trigger was set
		expect(screen.getByText('Last trigger: programmatic')).toBeInTheDocument();
		expect(screen.getByText('Desktop state: expanded')).toBeInTheDocument();
	});

	describe('focus on expand (toggle-button trigger and platform_dst_nav4_skip_link_a11y_1)', () => {
		beforeAll(() => {
			HTMLElement.prototype.checkVisibility = () => true;
		});

		ffTest.on(
			'platform_dst_nav4_skip_link_a11y_1',
			'with focus on expand feature flag enabled',
			() => {
				it('should move focus to the first visible link in the side nav when expanding on desktop', async () => {
					setMediaQuery('(min-width: 64rem)', { initial: true });

					render(
						<MockProvider
							initialState={{
								mobile: 'collapsed',
								desktop: 'collapsed',
								flyout: 'closed',
								lastTrigger: null,
							}}
						>
							<TestComponentWithSideNavRef trigger="toggle-button" />
						</MockProvider>,
					);

					const firstLink = screen.getByRole('link', { name: 'First link' });

					const toggleButton = screen.getByRole('button', { name: 'Toggle side nav' });
					fireEvent.click(toggleButton);

					expect(firstLink).toHaveFocus();
				});

				it('should move focus to the first visible link in the side nav when expanding on mobile', async () => {
					setMediaQuery('(min-width: 64rem)', { initial: false });

					render(
						<MockProvider
							initialState={{
								mobile: 'collapsed',
								desktop: 'collapsed',
								flyout: 'closed',
								lastTrigger: null,
							}}
						>
							<TestComponentWithSideNavRef trigger="toggle-button" />
						</MockProvider>,
					);

					const firstLink = screen.getByRole('link', { name: 'First link' });

					const toggleButton = screen.getByRole('button', { name: 'Toggle side nav' });
					fireEvent.click(toggleButton);

					expect(firstLink).toHaveFocus();
				});

				it('should not move focus when collapsing via the toggle (desktop)', async () => {
					setMediaQuery('(min-width: 64rem)', { initial: true });
					const user = userEvent.setup();

					render(
						<MockProvider
							initialState={{
								mobile: 'collapsed',
								desktop: 'expanded',
								flyout: 'closed',
								lastTrigger: null,
							}}
						>
							<TestComponentWithSideNavRef trigger="toggle-button" />
						</MockProvider>,
					);

					const firstLink = screen.getByRole('link', { name: 'First link' });

					const toggleButton = screen.getByRole('button', { name: 'Toggle side nav' });
					toggleButton.focus();
					await user.click(toggleButton);

					expect(toggleButton).toHaveFocus();
					expect(firstLink).not.toHaveFocus();
				});

				it('should not move focus when the trigger is not toggle-button', async () => {
					setMediaQuery('(min-width: 64rem)', { initial: true });
					const user = userEvent.setup();

					render(
						<MockProvider
							initialState={{
								mobile: 'collapsed',
								desktop: 'collapsed',
								flyout: 'closed',
								lastTrigger: null,
							}}
						>
							<TestComponentWithSideNavRef trigger="programmatic" />
						</MockProvider>,
					);

					const firstLink = screen.getByRole('link', { name: 'First link' });

					const toggleButton = screen.getByRole('button', { name: 'Toggle side nav' });
					toggleButton.focus();
					await user.click(toggleButton);

					expect(toggleButton).toHaveFocus();
					expect(firstLink).not.toHaveFocus();
				});
			},
		);

		ffTest.off(
			'platform_dst_nav4_skip_link_a11y_1',
			'with focus on expand feature flag disabled',
			() => {
				it('should not move focus to the first item when the feature flag is off', async () => {
					setMediaQuery('(min-width: 64rem)', { initial: true });
					const user = userEvent.setup();

					render(
						<MockProvider
							initialState={{
								mobile: 'collapsed',
								desktop: 'collapsed',
								flyout: 'closed',
								lastTrigger: null,
							}}
						>
							<TestComponentWithSideNavRef trigger="toggle-button" />
						</MockProvider>,
					);

					const firstLink = screen.getByRole('link', { name: 'First link' });

					const toggleButton = screen.getByRole('button', { name: 'Toggle side nav' });
					toggleButton.focus();
					await user.click(toggleButton);

					expect(toggleButton).toHaveFocus();
					expect(firstLink).not.toHaveFocus();
				});
			},
		);
	});
});
