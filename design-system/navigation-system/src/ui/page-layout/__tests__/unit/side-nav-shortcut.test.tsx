import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import Modal, { ModalBody, ModalHeader, ModalTitle } from '@atlaskit/modal-dialog';
import { Popup } from '@atlaskit/popup';
import Tooltip from '@atlaskit/tooltip';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import { resetMatchMedia, setMediaQuery } from '@atlassian/test-utils';
import { act, fireEvent, render, screen, userEvent } from '@atlassian/testing-library';

import { Main } from '../../main/main';
import { Root } from '../../root';
import { SideNav } from '../../side-nav/side-nav';

import {
	filterFromConsoleErrorOutput,
	parseCssErrorRegex,
	type ResetConsoleErrorFn,
} from './_filter-from-console-error-output';

describe('Side nav keyboard shortcut', () => {
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

	ffTest.on('navx-full-height-sidebar', 'keyboard shortcut', () => {
		it('should toggle when the keyboard shortcut is pressed and Root isSideNavShortcutEnabled is true and canToggleWithShortcut is not provided', async () => {
			const user = userEvent.setup();
			setMediaQuery('(min-width: 64rem)', { initial: true });

			render(
				<Root isSideNavShortcutEnabled>
					<SideNav testId="sidenav">sidenav</SideNav>
				</Root>,
			);

			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'large');

			// > is a special testing-library character to keep the key pressed
			// [[ evaluates to a single [ being pressed
			await user.keyboard('{Control>}[[');

			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'false');

			await user.keyboard('{Control>}[[');
			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'large');
		});

		it('should toggle when the keyboard shortcut is pressed and Root isSideNavShortcutEnabled is true and canToggleWithShortcut returns true', async () => {
			const user = userEvent.setup();
			setMediaQuery('(min-width: 64rem)', { initial: true });

			render(
				<Root isSideNavShortcutEnabled>
					<SideNav testId="sidenav" canToggleWithShortcut={() => true}>
						sidenav
					</SideNav>
				</Root>,
			);

			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'large');

			// > is a special testing-library character to keep the key pressed
			// [[ evaluates to a single [ being pressed
			await user.keyboard('{Control>}[[');

			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'false');

			await user.keyboard('{Control>}[[');
			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'large');
		});

		it('should not toggle when the keyboard shortcut is pressed and Root isSideNavShortcutEnabled is true and canToggleWithShortcut returns false', async () => {
			const user = userEvent.setup();
			setMediaQuery('(min-width: 64rem)', { initial: true });

			render(
				<Root isSideNavShortcutEnabled>
					<SideNav testId="sidenav" canToggleWithShortcut={() => false}>
						sidenav
					</SideNav>
				</Root>,
			);

			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'large');

			// > is a special testing-library character to keep the key pressed
			// [[ evaluates to a single [ being pressed
			await user.keyboard('{Control>}[[');

			// Should not have toggled
			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'large');
		});

		it('should not toggle when the keyboard shortcut is pressed and Root isSideNavShortcutEnabled is false and canToggleWithShortcut is not provided', async () => {
			const user = userEvent.setup();
			setMediaQuery('(min-width: 64rem)', { initial: true });

			render(
				<Root isSideNavShortcutEnabled={false}>
					<SideNav testId="sidenav">sidenav</SideNav>
				</Root>,
			);

			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'large');

			// > is a special testing-library character to keep the key pressed
			// [[ evaluates to a single [ being pressed
			await user.keyboard('{Control>}[[');

			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'large');
		});

		it('should not toggle when the keyboard shortcut is pressed and Root isSideNavShortcutEnabled is false and canToggleWithShortcut returns true', async () => {
			const user = userEvent.setup();
			setMediaQuery('(min-width: 64rem)', { initial: true });

			render(
				<Root isSideNavShortcutEnabled={false}>
					<SideNav testId="sidenav" canToggleWithShortcut={() => true}>
						sidenav
					</SideNav>
				</Root>,
			);

			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'large');

			// > is a special testing-library character to keep the key pressed
			// [[ evaluates to a single [ being pressed
			await user.keyboard('{Control>}[[');

			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'large');
		});

		it('should not toggle when the keyboard shortcut is pressed and Root isSideNavShortcutEnabled is false and canToggleWithShortcut returns false', async () => {
			const user = userEvent.setup();
			setMediaQuery('(min-width: 64rem)', { initial: true });

			render(
				<Root isSideNavShortcutEnabled={false}>
					<SideNav testId="sidenav" canToggleWithShortcut={() => false}>
						sidenav
					</SideNav>
				</Root>,
			);

			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'large');

			// > is a special testing-library character to keep the key pressed
			// [[ evaluates to a single [ being pressed
			await user.keyboard('{Control>}[[');

			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'large');
		});

		it('should support conditionally disabling the keyboard shortcut when Root isSideNavShortcutEnabled is true and canToggleWithShortcut returns different values', async () => {
			const user = userEvent.setup();
			setMediaQuery('(min-width: 64rem)', { initial: true });

			const { rerender } = render(
				<Root isSideNavShortcutEnabled>
					<SideNav testId="sidenav" canToggleWithShortcut={() => false}>
						sidenav
					</SideNav>
				</Root>,
			);

			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'large');

			// [[ evaluates to a single [ being pressed
			await user.keyboard('{Control>}[[');

			// No change
			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'large');

			rerender(
				<Root isSideNavShortcutEnabled>
					<SideNav testId="sidenav" canToggleWithShortcut={() => true}>
						sidenav
					</SideNav>
				</Root>,
			);

			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'large');

			await user.keyboard('{Control>}[[');

			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'false');
		});

		it('should support conditionally disabling the keyboard shortcut when Root isSideNavShortcutEnabled returns different values', async () => {
			const user = userEvent.setup();
			setMediaQuery('(min-width: 64rem)', { initial: true });

			const { rerender } = render(
				<Root isSideNavShortcutEnabled>
					<SideNav testId="sidenav">sidenav</SideNav>
				</Root>,
			);

			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'large');

			// [[ evaluates to a single [ being pressed
			await user.keyboard('{Control>}[[');

			// Toggle should work as `isSideNavShortcutEnabled` is true
			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'false');

			// Re-render with `isSideNavShortcutEnabled` set to false
			rerender(
				<Root isSideNavShortcutEnabled={false}>
					<SideNav testId="sidenav">sidenav</SideNav>
				</Root>,
			);

			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'false');

			await user.keyboard('{Control>}[[');

			// No change
			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'false');
		});

		it('should support conditionally disabling the keyboard shortcut when Root isSideNavShortcutEnabled is true and canToggleWithShortcut is only provided after initial render', async () => {
			const user = userEvent.setup();
			setMediaQuery('(min-width: 64rem)', { initial: true });

			// Initially not providing canToggleWithShortcut
			const { rerender } = render(
				<Root isSideNavShortcutEnabled>
					<SideNav testId="sidenav">sidenav</SideNav>
				</Root>,
			);

			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'large');

			// [[ evaluates to a single [ being pressed
			await user.keyboard('{Control>}[[');

			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'false');

			// Re-render with canToggleWithShortcut provided and returns false
			rerender(
				<Root isSideNavShortcutEnabled>
					<SideNav testId="sidenav" canToggleWithShortcut={() => false}>
						sidenav
					</SideNav>
				</Root>,
			);

			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'false');

			await user.keyboard('{Control>}[[');

			// Should not have toggled
			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'false');
		});

		it('should only toggle the side nav once when the keyboard shortcut is pressed and held', async () => {
			setMediaQuery('(min-width: 64rem)', { initial: true });

			render(
				<Root isSideNavShortcutEnabled>
					<SideNav testId="sidenav">sidenav</SideNav>
				</Root>,
			);

			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'large');

			// userEvent does not support holding down keys
			// eslint-disable-next-line testing-library/prefer-user-event
			fireEvent.keyDown(screen.getByTestId('sidenav'), {
				key: '[',
				ctrlKey: true,
			});

			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'false');

			// userEvent does not support holding down keys
			// eslint-disable-next-line testing-library/prefer-user-event
			fireEvent.keyDown(screen.getByTestId('sidenav'), {
				key: '[',
				ctrlKey: true,
				repeat: true,
			});

			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'false');
		});

		it('should close any open tooltips when the keyboard shortcut is pressed', async () => {
			jest.useFakeTimers();
			const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
			setMediaQuery('(min-width: 64rem)', { initial: true });

			function TestComponent() {
				return (
					<Root isSideNavShortcutEnabled>
						<SideNav testId="sidenav">sidenav</SideNav>
						<Main>
							<Tooltip content="This is a tooltip">
								{(tooltipProps) => (
									<button type="button" {...tooltipProps}>
										Tooltip trigger
									</button>
								)}
							</Tooltip>
						</Main>
					</Root>
				);
			}

			render(<TestComponent />);

			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'large');

			// Open tooltip by hovering over the trigger
			await user.hover(screen.getByRole('button', { name: 'Tooltip trigger' }));
			act(() => {
				jest.runAllTimers();
			});

			// Tooltip is visible
			expect(await screen.findByRole('tooltip', { name: 'This is a tooltip' })).toBeInTheDocument();

			// Press keyboard shortcut
			await user.keyboard('{Control>}[[');

			// Tooltip should be closed
			expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

			// Side nav should have toggled
			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'false');

			jest.useRealTimers();
		});

		it('should close any open popups when the keyboard shortcut is pressed', async () => {
			const user = userEvent.setup();
			setMediaQuery('(min-width: 64rem)', { initial: true });

			function TestComponent() {
				const [isPopupOpen, setIsPopupOpen] = useState(true);

				return (
					<Root isSideNavShortcutEnabled>
						<SideNav testId="sidenav">sidenav</SideNav>
						<Main>
							<Popup
								shouldRenderToParent
								isOpen={isPopupOpen}
								onClose={() => setIsPopupOpen(false)}
								placement="bottom-start"
								content={() => <div>Popup content</div>}
								trigger={({ ref }) => (
									<button type="button" ref={ref}>
										Popup trigger
									</button>
								)}
							/>
						</Main>
					</Root>
				);
			}

			render(<TestComponent />);

			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'large');

			// Popup is open
			expect(screen.getByText('Popup content')).toBeVisible();

			// Press keyboard shortcut
			await user.keyboard('{Control>}[[');

			// Popup should be closed
			expect(screen.queryByText('Popup content')).not.toBeInTheDocument();

			// Side nav should have toggled
			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'false');
		});

		// Trigger info is behind separate instrumentation flag
		ffTest.on('platform_dst_nav4_fhs_instrumentation_1', 'analytics', () => {
			it('should set the correct trigger type', async () => {
				const user = userEvent.setup();
				setMediaQuery('(min-width: 64rem)', { initial: true });

				const mockOnExpand = jest.fn();
				const mockOnCollapse = jest.fn();

				render(
					<Root isSideNavShortcutEnabled>
						<SideNav testId="sidenav" onExpand={mockOnExpand} onCollapse={mockOnCollapse}>
							sidenav
						</SideNav>
					</Root>,
				);

				expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'large');

				// > is a special testing-library character to keep the key pressed
				// [[ evaluates to a single [ being pressed
				await user.keyboard('{Control>}[[');

				expect(mockOnCollapse).toHaveBeenCalledWith({
					screen: 'desktop',
					trigger: 'keyboard',
				});

				await user.keyboard('{Control>}[[');

				expect(mockOnExpand).toHaveBeenCalledWith({
					screen: 'desktop',
					trigger: 'keyboard',
				});
			});
		});

		it('should not toggle when a modal is open', async () => {
			const user = userEvent.setup();
			setMediaQuery('(min-width: 64rem)', { initial: true });

			function TestComponent() {
				const [isModalOpen, setIsModalOpen] = useState(false);

				return (
					<Root isSideNavShortcutEnabled>
						<SideNav testId="sidenav">sidenav</SideNav>
						<Main>
							<Button onClick={() => setIsModalOpen(true)}>Open modal</Button>
							{isModalOpen && (
								<Modal onClose={() => setIsModalOpen(false)}>
									<ModalHeader hasCloseButton>
										<ModalTitle>Modal title</ModalTitle>
									</ModalHeader>
									<ModalBody>modal body</ModalBody>
								</Modal>
							)}
						</Main>
					</Root>
				);
			}

			render(<TestComponent />);

			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'large');

			// Toggling should work now that the modal is closed
			// > is a special testing-library character to keep the key pressed
			// [[ evaluates to a single [ being pressed
			await user.keyboard('{Control>}[[');

			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'false');

			// Open modal
			await user.click(screen.getByRole('button', { name: 'Open modal' }));

			expect(await screen.findByRole('dialog')).toBeVisible();

			await user.keyboard('{Control>}[[');

			// Should not have toggled
			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'false');

			// Close modal
			await user.click(screen.getByRole('button', { name: 'Close Modal' }));

			await user.keyboard('{Control>}[[');

			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'large');
		});
	});

	ffTest.off('navx-full-height-sidebar', 'keyboard shortcut', () => {
		it('should not have keyboard shortcut listener when the feature flag is disabled', async () => {
			const user = userEvent.setup();
			setMediaQuery('(min-width: 64rem)', { initial: true });

			render(
				<Root>
					<SideNav testId="sidenav" canToggleWithShortcut={() => true}>
						sidenav
					</SideNav>
				</Root>,
			);

			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'large');

			// > is a special testing-library character to keep the key pressed
			// [[ evaluates to a single [ being pressed
			await user.keyboard('{Control>}[[');

			// Should not have toggled
			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'large');
		});
	});
});
