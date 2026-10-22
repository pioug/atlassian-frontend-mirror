import React, { useState } from 'react';

import { skipA11yAudit } from '@af/accessibility-testing/skip-a11y-audit';
import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import { Popup } from '@atlaskit/popup/popup';
import {
	FlyoutMenuItem,
	FlyoutMenuItemContent,
	FlyoutMenuItemTrigger,
} from '@atlaskit/side-nav-items/flyout-menu-item';
import Textfield from '@atlaskit/textfield';
import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { resetMatchMedia, setMediaQuery } from '@atlassian/test-utils/match-media';
import { act } from '@atlassian/testing-library/act';
import { fireEvent } from '@atlassian/testing-library/fire-event';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';
import { userEvent } from '@atlassian/testing-library/user-event';
import { waitFor } from '@atlassian/testing-library/wait-for';

import { Main } from '../../main/main';
import { Root } from '../../root';
import { SideNav } from '../../side-nav/side-nav';
import { SideNavToggleButton } from '../../side-nav/toggle-button';
import { TopNav } from '../../top-nav/top-nav';
import { TopNavStart } from '../../top-nav/top-nav-start';
import {
	filterFromConsoleErrorOutput,
	parseCssErrorRegex,
	type ResetConsoleErrorFn,
} from './_filter-from-console-error-output';

/**
 * The same flyout behaviour as `side-nav-flyout.test.tsx`, with the `platform-dst-top-layer` gate on.
 * Open layers are found through the DOM (the `@atlaskit/top-layer/page-surface` entry points), not the open layer observer.
 *
 * `fireEvent` is used for elements inside `TopNav`, for the reason in `side-nav-flyout.test.tsx`.
 */
const createUser = () => userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

const runAllTimers = () => {
	act(() => {
		jest.runAllTimers();
	});
};

function Layout({ children }: { children: React.ReactNode }) {
	return (
		<Root>
			<TopNav>
				<TopNavStart
					sideNavToggleButton={
						<SideNavToggleButton
							collapseLabel="Collapse sidebar"
							expandLabel="Expand sidebar"
							defaultCollapsed
						/>
					}
				>
					{null}
				</TopNavStart>
			</TopNav>
			<SideNav defaultCollapsed testId="sidenav">
				sidenav
				{children}
			</SideNav>
			<Main>
				main
				<button type="button">test button</button>
			</Main>
		</Root>
	);
}

function openFlyoutAndMoveToToggleButtonEdge() {
	fireEvent.mouseEnter(screen.getByRole('button', { name: 'Expand sidebar' }));
	runAllTimers();
	expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'flyout');
	fireEvent.mouseLeave(screen.getByRole('button', { name: 'Expand sidebar' }));
}

function expectFlyoutOpen() {
	expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'flyout');
}

async function expectFlyoutClosed() {
	await waitFor(() =>
		expect(screen.getByTestId('sidenav')).not.toHaveAttribute(
			'data-visible',
			expect.stringContaining('flyout'),
		),
	);
}

describe('side nav flyout (platform-dst-top-layer on)', () => {
	beforeEach(() => {
		passGate('platform-dst-top-layer');
		resetMatchMedia();
		jest.useFakeTimers();

		// Fails due to fake timers
		skipA11yAudit();
		setMediaQuery('(min-width: 64rem)', { initial: true });
	});

	afterEach(() => {
		jest.useRealTimers();
		jest.clearAllMocks();
	});

	let resetConsoleErrorSpyFn: ResetConsoleErrorFn;
	beforeAll(() => {
		resetConsoleErrorSpyFn = filterFromConsoleErrorOutput(parseCssErrorRegex);
	});

	afterAll(() => {
		resetConsoleErrorSpyFn();
	});

	it('should close the flyout when the user mouses away and no layer is open', async () => {
		const user = createUser();
		render(<Layout>{null}</Layout>);

		openFlyoutAndMoveToToggleButtonEdge();
		await user.hover(screen.getByText('main'));
		runAllTimers();

		await expectFlyoutClosed();
	});

	describe('popup', () => {
		function PopupInSideNav() {
			const [isOpen, setIsOpen] = useState(false);
			return (
				<Popup
					shouldRenderToParent
					isOpen={isOpen}
					onClose={() => setIsOpen(false)}
					placement="bottom-start"
					content={() => <div>Popup content</div>}
					trigger={({ ref }) => (
						<button type="button" ref={ref} onClick={() => setIsOpen(!isOpen)}>
							Popup trigger
						</button>
					)}
				/>
			);
		}

		it('should render the popup inside the side nav', async () => {
			const user = createUser();
			render(
				<Layout>
					<PopupInSideNav />
				</Layout>,
			);

			openFlyoutAndMoveToToggleButtonEdge();
			await user.click(screen.getByRole('button', { name: 'Popup trigger' }));

			const content = screen.getByText('Popup content');
			// A top-layer popover, rendered inline
			// eslint-disable-next-line testing-library/no-node-access
			expect(content.closest('[popover]')).not.toBeNull();
			expect(screen.getByTestId('sidenav')).toContainElement(content);
		});

		it('should keep the flyout open while the popup is open, and close it when the popup closes', async () => {
			const user = createUser();
			render(
				<Layout>
					<PopupInSideNav />
				</Layout>,
			);

			openFlyoutAndMoveToToggleButtonEdge();
			await user.click(screen.getByRole('button', { name: 'Popup trigger' }));
			runAllTimers();

			await user.hover(screen.getByText('main'));
			runAllTimers();

			expectFlyoutOpen();

			// Light dismiss closes the popup, then the flyout closes
			await user.click(screen.getByRole('button', { name: 'test button' }));
			runAllTimers();

			await expectFlyoutClosed();
		});
	});

	describe('dropdown menu', () => {
		it('should keep the flyout open while the dropdown is open, and close it when the dropdown closes', async () => {
			const user = createUser();
			render(
				<Layout>
					<DropdownMenu<HTMLButtonElement> trigger="Dropdown trigger" shouldRenderToParent>
						Dropdown content
					</DropdownMenu>
				</Layout>,
			);

			openFlyoutAndMoveToToggleButtonEdge();
			await user.click(screen.getByText('Dropdown trigger'));
			runAllTimers();

			await user.hover(screen.getByText('main'));
			runAllTimers();

			expectFlyoutOpen();

			await user.click(screen.getByRole('button', { name: 'test button' }));
			runAllTimers();

			await expectFlyoutClosed();
		});
	});

	describe('flyout menu item', () => {
		it('should keep the flyout open while a flyout menu item is open, and close it when it closes', async () => {
			const user = createUser();
			render(
				<Layout>
					<FlyoutMenuItem>
						<FlyoutMenuItemTrigger>Flyout menu item trigger</FlyoutMenuItemTrigger>
						<FlyoutMenuItemContent>Flyout menu item content</FlyoutMenuItemContent>
					</FlyoutMenuItem>
				</Layout>,
			);

			openFlyoutAndMoveToToggleButtonEdge();
			await user.click(screen.getByText('Flyout menu item trigger'));
			runAllTimers();

			await user.hover(screen.getByText('main'));
			runAllTimers();

			expectFlyoutOpen();

			await user.click(screen.getByRole('button', { name: 'test button' }));
			runAllTimers();

			await expectFlyoutClosed();
		});
	});

	describe('text entry', () => {
		it.each([
			['a text field', () => <Textfield aria-label="Rename" />],
			['a textarea', () => <textarea aria-label="Rename" />],
			[
				'a content editable element',
				() => (
					// eslint-disable-next-line @atlassian/a11y/interactive-element-not-keyboard-focusable
					<div role="textbox" aria-label="Rename" contentEditable tabIndex={0} />
				),
			],
		])(
			'should keep the flyout open while %s inside it is focused, and close it after focus leaves',
			async (_, renderField) => {
				const user = createUser();
				render(<Layout>{renderField()}</Layout>);

				openFlyoutAndMoveToToggleButtonEdge();
				act(() => {
					screen.getByRole('textbox', { name: 'Rename' }).focus();
				});

				await user.hover(screen.getByText('main'));
				runAllTimers();

				expectFlyoutOpen();

				// Focus moves out of the side nav
				act(() => {
					screen.getByRole('button', { name: 'test button' }).focus();
				});

				// Not closed until focus has settled
				expectFlyoutOpen();

				runAllTimers();

				await expectFlyoutClosed();
			},
		);

		it('should close the flyout when the focused text field is removed', async () => {
			const user = createUser();
			const { rerender } = render(
				<Layout>
					<Textfield aria-label="Rename" />
				</Layout>,
			);

			openFlyoutAndMoveToToggleButtonEdge();
			act(() => {
				screen.getByRole('textbox', { name: 'Rename' }).focus();
			});

			await user.hover(screen.getByText('main'));
			runAllTimers();

			expectFlyoutOpen();

			// For example, an inline rename ends. Removing a focused element does not
			// always fire `focusout`.
			rerender(<Layout>{null}</Layout>);
			runAllTimers();

			await expectFlyoutClosed();
		});

		it('should not keep the flyout open while a read only text field is focused', async () => {
			const user = createUser();
			render(
				<Layout>
					<input type="text" aria-label="Rename" readOnly />
				</Layout>,
			);

			openFlyoutAndMoveToToggleButtonEdge();
			act(() => {
				screen.getByRole('textbox', { name: 'Rename' }).focus();
			});

			await user.hover(screen.getByText('main'));
			runAllTimers();

			await expectFlyoutClosed();
		});

		it('should not keep the flyout open while a button inside it is focused', async () => {
			const user = createUser();
			render(
				<Layout>
					<button type="button">Side nav button</button>
				</Layout>,
			);

			openFlyoutAndMoveToToggleButtonEdge();
			act(() => {
				screen.getByRole('button', { name: 'Side nav button' }).focus();
			});

			await user.hover(screen.getByText('main'));
			runAllTimers();

			await expectFlyoutClosed();
		});

		it('should keep the flyout open when focus moves between text fields inside it', async () => {
			const user = createUser();
			render(
				<Layout>
					<input type="text" aria-label="First" />
					<input type="text" aria-label="Second" />
				</Layout>,
			);

			openFlyoutAndMoveToToggleButtonEdge();
			act(() => {
				screen.getByRole('textbox', { name: 'First' }).focus();
			});

			await user.hover(screen.getByText('main'));
			runAllTimers();

			act(() => {
				screen.getByRole('textbox', { name: 'Second' }).focus();
			});
			runAllTimers();

			expectFlyoutOpen();
		});
	});
});
