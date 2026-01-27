import React, { type MouseEvent } from 'react';

import { bind } from 'bind-event-listener';

import { skipA11yAudit } from '@af/accessibility-testing';
import HomeIcon from '@atlaskit/icon/core/home';
import { skipAutoA11yFile } from '@atlassian/a11y-jest-testing';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import { render, screen, userEvent, waitFor, within } from '@atlassian/testing-library';

import { ButtonMenuItem } from '../../button-menu-item';
import { FlyoutBody } from '../../flyout-menu-item/flyout-body';
import { FlyoutFooter } from '../../flyout-menu-item/flyout-footer';
import { FlyoutHeader } from '../../flyout-menu-item/flyout-header';
import { FlyoutMenuItem } from '../../flyout-menu-item/flyout-menu-item';
import { FlyoutMenuItemContent } from '../../flyout-menu-item/flyout-menu-item-content';
import { FlyoutMenuItemTrigger } from '../../flyout-menu-item/flyout-menu-item-trigger';
import { LinkMenuItem } from '../../link-menu-item';

// This file exposes one or more accessibility violations. Testing is currently skipped but violations need to
// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
// the next line and associated import. For more information, see go/afm-a11y-tooling:jest
skipAutoA11yFile();

const NavWrapper = ({
	children,
	label = 'main',
}: {
	children: React.ReactNode;
	label?: string;
}) => (
	<nav aria-label={label}>
		<ul>{children}</ul>
	</nav>
);

describe('FlyoutMenuItem', () => {
	beforeEach(() => {
		skipA11yAudit();
	});

	describe('accessibility', () => {
		it('should pass a11y checks when popup is closed', async () => {
			const { baseElement } = render(
				<NavWrapper>
					<FlyoutMenuItem>
						<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
						<FlyoutMenuItemContent>
							<ButtonMenuItem>Item 1</ButtonMenuItem>
						</FlyoutMenuItemContent>
					</FlyoutMenuItem>
				</NavWrapper>,
			);

			await expect(baseElement).toBeAccessible();
		});

		ffTest.off('platform_dst_nav4_flyout_menu_slots_close_button', 'does not include updates to flyout menu to have slots and close button', () => {
			it('should pass a11y checks when popup is open', async () => {
				const { baseElement } = render(
					<NavWrapper>
						<FlyoutMenuItem isDefaultOpen>
							<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
							<FlyoutMenuItemContent>
								<NavWrapper label="secondary">
									<ButtonMenuItem>Item 1</ButtonMenuItem>
								</NavWrapper>
							</FlyoutMenuItemContent>
						</FlyoutMenuItem>
					</NavWrapper>,
				);

				await expect(baseElement).toBeAccessible();
			});
		});

		ffTest.on('platform_dst_nav4_flyout_menu_slots_close_button', 'includes updates to flyout menu to have slots and close button', () => {
			it('should pass a11y checks when popup is open', async () => {
				const { baseElement } = render(
					<NavWrapper>
						<FlyoutMenuItem isDefaultOpen>
							<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
							<FlyoutMenuItemContent>
								<FlyoutHeader title='Title' closeButtonLabel='Close flyout menu' />
								<FlyoutBody>
									<NavWrapper label="secondary">
										<ButtonMenuItem>Item 1</ButtonMenuItem>
									</NavWrapper>
								</FlyoutBody>
								<FlyoutFooter />
							</FlyoutMenuItemContent>
						</FlyoutMenuItem>
					</NavWrapper>,
				);

				await expect(baseElement).toBeAccessible();
			});

			it('should have the correct aria attributes for the trigger', async () => {
				render(
					<FlyoutMenuItem>
						<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
						<FlyoutMenuItemContent>
							<ButtonMenuItem>Item 1</ButtonMenuItem>
						</FlyoutMenuItemContent>
					</FlyoutMenuItem>,
				);

				expect(screen.getByRole('button', { name: 'Trigger' })).toHaveAttribute(
					'aria-haspopup',
					'dialog',
				);
				expect(screen.getByRole('button', { name: 'Trigger' })).toHaveAttribute(
					'aria-expanded',
					'false',
				);
			});

			it('should have role set to dialog for the flyout menu container', async () => {
				render(
					<FlyoutMenuItem>
						<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
						<FlyoutMenuItemContent>
							<ButtonMenuItem>Item 1</ButtonMenuItem>
						</FlyoutMenuItemContent>
					</FlyoutMenuItem>
				);

				await userEvent.click(screen.getByRole('button', { name: 'Trigger' }));

				const dialog = await screen.findByRole('dialog');
				expect(dialog).toBeInTheDocument();
			});

			it('should have aria-labelledby set to the title id for the flyout menu container', async () => {
				render(
					<FlyoutMenuItem>
						<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
						<FlyoutMenuItemContent containerTestId='container-test'>
							<FlyoutHeader title='Title' closeButtonLabel='Close flyout menu' />
							<FlyoutBody>
								<ButtonMenuItem>Item 1</ButtonMenuItem>
							</FlyoutBody>
							<FlyoutFooter />
						</FlyoutMenuItemContent>
					</FlyoutMenuItem>
				);

				await userEvent.click(screen.getByRole('button', { name: 'Trigger' }));

				const container = screen.getByTestId('container-test');

				const title = within(container).getByText('Title');
				expect(title).toHaveAttribute('id');
				const titleId = title.getAttribute('id') as string;

				expect(container).toHaveAttribute('aria-labelledby', titleId);
			});

			it('dismisses dialog on escape and returns focus to the trigger', async () => {
				render(
					<FlyoutMenuItem>
						<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
						<FlyoutMenuItemContent>
							<ButtonMenuItem>Item 1</ButtonMenuItem>
						</FlyoutMenuItemContent>
					</FlyoutMenuItem>
				);

				const trigger = screen.getByRole('button', { name: 'Trigger' });
				expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
				await userEvent.click(trigger);

				const dialog = await screen.findByRole('dialog');
				expect(dialog).toBeInTheDocument();

				await userEvent.keyboard('{Escape}');

				await waitFor(() => {
					expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
				});

				expect(trigger).toHaveFocus();
			});
		});
	});

	it('should only render the trigger by default', () => {
		render(
			<FlyoutMenuItem>
				<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
				<FlyoutMenuItemContent>
					<ButtonMenuItem>Item 1</ButtonMenuItem>
				</FlyoutMenuItemContent>
			</FlyoutMenuItem>,
		);

		expect(screen.getByRole('button', { name: 'Trigger' })).toBeVisible();
		expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
	});

	it('should render the trigger and popup content when defaultOpen is true', () => {
		render(
			<FlyoutMenuItem isDefaultOpen>
				<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
				<FlyoutMenuItemContent>
					<ButtonMenuItem>Item 1</ButtonMenuItem>
				</FlyoutMenuItemContent>
			</FlyoutMenuItem>,
		);

		expect(screen.getByRole('button', { name: 'Trigger' })).toBeVisible();
		expect(screen.getByText('Item 1')).toBeVisible();
	});

	it('should render the popup when the trigger is clicked', async () => {
		render(
			<FlyoutMenuItem>
				<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
				<FlyoutMenuItemContent>
					<ButtonMenuItem>Item 1</ButtonMenuItem>
				</FlyoutMenuItemContent>
			</FlyoutMenuItem>,
		);

		await userEvent.click(screen.getByRole('button', { name: 'Trigger' }));

		expect(screen.getByText('Item 1')).toBeVisible();
	});

	it('should close the popup when the trigger is clicked and the popup is open', async () => {
		render(
			<FlyoutMenuItem isDefaultOpen>
				<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
				<FlyoutMenuItemContent>
					<ButtonMenuItem>Item 1</ButtonMenuItem>
				</FlyoutMenuItemContent>
			</FlyoutMenuItem>,
		);

		expect(screen.queryByText('Item 1')).toBeVisible();

		await userEvent.click(screen.getByRole('button', { name: 'Trigger' }));

		expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
	});

	describe('flyout content should close when clicking outside of popup', () => {
		test('no event stopping', async () => {
			render(
				<FlyoutMenuItem isDefaultOpen>
					<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
					<FlyoutMenuItemContent>
						<ButtonMenuItem>Item 1</ButtonMenuItem>
					</FlyoutMenuItemContent>
				</FlyoutMenuItem>,
			);

			expect(screen.queryByText('Item 1')).toBeVisible();

			await userEvent.click(document.body);

			expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
		});
	});

	describe('Click outside of flyout', () => {
		test('bubble phase event listener stops event', async () => {
			const cleanup = bind(window, {
				type: 'click',
				listener(event) {
					event.stopImmediatePropagation();
				},
				// bubble phase listener
				options: { capture: false },
			});

			render(
				<FlyoutMenuItem isDefaultOpen>
					<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
					<FlyoutMenuItemContent>
						<ButtonMenuItem>Item 1</ButtonMenuItem>
					</FlyoutMenuItemContent>
				</FlyoutMenuItem>,
			);

			expect(screen.queryByText('Item 1')).toBeVisible();

			await userEvent.click(document.body);

			expect(screen.queryByText('Item 1')).not.toBeInTheDocument();

			cleanup();
		});

		test('high capture phase event listener stops event', async () => {
			// not adding to `window` as this event listener would be added
			// before the Popup one is added, and would stop the event before
			// the Popup could process it
			const cleanup1 = bind(document.body, {
				type: 'click',
				listener(event) {
					event.stopImmediatePropagation();
				},
				// capture phase listener
				options: { capture: true, once: true },
			});
			render(
				<FlyoutMenuItem isDefaultOpen>
					<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
					<FlyoutMenuItemContent>
						<ButtonMenuItem>Item 1</ButtonMenuItem>
					</FlyoutMenuItemContent>
				</FlyoutMenuItem>,
			);
			// This will be added after the added window capture listener
			// used to close outside clicks, so we can add to the window
			const cleanup2 = bind(window, {
				type: 'click',
				listener(event) {
					event.stopImmediatePropagation();
				},
				// capture phase listener
				options: { capture: true, once: true },
			});

			expect(screen.queryByText('Item 1')).toBeVisible();

			await userEvent.click(document.body);

			expect(screen.queryByText('Item 1')).not.toBeInTheDocument();

			cleanup1();
			cleanup2();
		});

		test('react bubble event listener stops event', async () => {
			const onClick = jest.fn((event: MouseEvent) => event.stopPropagation());
			render(
				<>
					<button type="button" data-testid="my-button" onClick={onClick}>
						Hi there
					</button>
					<FlyoutMenuItem isDefaultOpen>
						<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
						<FlyoutMenuItemContent>
							<ButtonMenuItem>Item 1</ButtonMenuItem>
						</FlyoutMenuItemContent>
					</FlyoutMenuItem>
				</>,
			);

			expect(screen.queryByText('Item 1')).toBeVisible();

			await userEvent.click(screen.getByTestId('my-button'));

			expect(onClick).toHaveBeenCalled();
			expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
		});

		test('react capture event listener stops event', async () => {
			const onClick = jest.fn((event: MouseEvent) => event.stopPropagation());
			render(
				<>
					<button type="button" data-testid="my-button" onClickCapture={onClick}>
						Hi there
					</button>
					<FlyoutMenuItem isDefaultOpen>
						<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
						<FlyoutMenuItemContent>
							<ButtonMenuItem>Item 1</ButtonMenuItem>
						</FlyoutMenuItemContent>
					</FlyoutMenuItem>
				</>,
			);

			expect(screen.queryByText('Item 1')).toBeVisible();

			await userEvent.click(screen.getByTestId('my-button'));

			expect(onClick).toHaveBeenCalled();
			expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
		});
	});

	it('should close the popup when the escape key is pressed', async () => {
		render(
			<FlyoutMenuItem isDefaultOpen>
				<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
				<FlyoutMenuItemContent>
					<ButtonMenuItem>Item 1</ButtonMenuItem>
				</FlyoutMenuItemContent>
			</FlyoutMenuItem>,
		);

		expect(screen.queryByText('Item 1')).toBeVisible();

		await userEvent.keyboard('{Escape}');

		expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
	});

	describe('onOpenChange', () => {
		it('should not call onOpenChange on initial render', () => {
			const onOpenChange = jest.fn();

			render(
				<FlyoutMenuItem onOpenChange={onOpenChange}>
					<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
					<FlyoutMenuItemContent>
						<ButtonMenuItem>Item 1</ButtonMenuItem>
					</FlyoutMenuItemContent>
				</FlyoutMenuItem>,
			);

			expect(onOpenChange).not.toHaveBeenCalled();
		});

		it('should call onOpenChange when the trigger is clicked and the popup is open', async () => {
			const onOpenChange = jest.fn();

			render(
				<FlyoutMenuItem onOpenChange={onOpenChange} isDefaultOpen>
					<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
					<FlyoutMenuItemContent>
						<ButtonMenuItem>Item 1</ButtonMenuItem>
					</FlyoutMenuItemContent>
				</FlyoutMenuItem>,
			);

			await userEvent.click(screen.getByRole('button', { name: 'Trigger' }));

			expect(onOpenChange).toHaveBeenCalledWith(false);
		});

		it('should call onOpenChange when the popup is open and the escape key is pressed', async () => {
			const onOpenChange = jest.fn();

			render(
				<FlyoutMenuItem onOpenChange={onOpenChange} isDefaultOpen>
					<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
					<FlyoutMenuItemContent>
						<ButtonMenuItem>Item 1</ButtonMenuItem>
					</FlyoutMenuItemContent>
				</FlyoutMenuItem>,
			);

			await userEvent.keyboard('{Escape}');

			expect(onOpenChange).toHaveBeenCalledWith(false);
		});

		it('should call onOpenChange when the popup is open and a click occurs outside of the popup', async () => {
			const onOpenChange = jest.fn();

			render(
				<FlyoutMenuItem onOpenChange={onOpenChange} isDefaultOpen>
					<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
					<FlyoutMenuItemContent>
						<ButtonMenuItem>Item 1</ButtonMenuItem>
					</FlyoutMenuItemContent>
				</FlyoutMenuItem>,
			);

			await userEvent.click(document.body);

			expect(onOpenChange).toHaveBeenCalledWith(false);
		});
	});

	it('should set the correct attributes when an id is provided', () => {
		render(
			<FlyoutMenuItem id="my-id" isDefaultOpen>
				<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
				<FlyoutMenuItemContent containerTestId="container">
					<ButtonMenuItem>Item 1</ButtonMenuItem>
				</FlyoutMenuItemContent>
			</FlyoutMenuItem>,
		);

		expect(screen.getByRole('button', { name: 'Trigger' })).toHaveAttribute(
			'aria-controls',
			'my-id',
		);
		expect(screen.getByTestId('container')).toHaveAttribute('id', 'my-id');
	});

	describe('trigger', () => {
		it('should be accessible', async () => {
			render(
				<NavWrapper>
					<FlyoutMenuItem>
						<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
						<FlyoutMenuItemContent>
							<ButtonMenuItem>Item 1</ButtonMenuItem>
						</FlyoutMenuItemContent>
					</FlyoutMenuItem>
				</NavWrapper>,
			);

			await expect(screen.getByRole('button', { name: 'Trigger' })).toBeAccessible();
		});

		it('should render the elemBefore when provided', () => {
			render(
				<FlyoutMenuItem>
					<FlyoutMenuItemTrigger
						elemBefore={
							<HomeIcon
								label=""
								testId="navigation-system.ui.menu-item.test-icon"
								color="currentColor"
							/>
						}
					>
						Trigger
					</FlyoutMenuItemTrigger>
					<FlyoutMenuItemContent>
						<ButtonMenuItem>Item 1</ButtonMenuItem>
					</FlyoutMenuItemContent>
				</FlyoutMenuItem>,
			);

			expect(screen.getByTestId('navigation-system.ui.menu-item.test-icon')).toBeVisible();
		});

		it('should call onClick when the trigger is clicked', async () => {
			const onClick = jest.fn();

			render(
				<FlyoutMenuItem>
					<FlyoutMenuItemTrigger onClick={onClick}>Trigger</FlyoutMenuItemTrigger>
					<FlyoutMenuItemContent>
						<ButtonMenuItem>Item 1</ButtonMenuItem>
					</FlyoutMenuItemContent>
				</FlyoutMenuItem>,
			);

			await userEvent.click(screen.getByRole('button', { name: 'Trigger' }));

			expect(onClick).toHaveBeenCalled();
		});

		ffTest.off('platform_dst_nav4_flyout_menu_slots_close_button', 'does not include updates to flyout menu to have slots and close button', () => {
			it('should have the correct aria attributes', async () => {
				render(
					<FlyoutMenuItem>
						<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
						<FlyoutMenuItemContent>
							<ButtonMenuItem>Item 1</ButtonMenuItem>
						</FlyoutMenuItemContent>
					</FlyoutMenuItem>,
				);

				expect(screen.getByRole('button', { name: 'Trigger' })).toHaveAttribute(
					'aria-haspopup',
					'true',
				);
				expect(screen.getByRole('button', { name: 'Trigger' })).toHaveAttribute(
					'aria-expanded',
					'false',
				);
			});
		});

		it('should have the correct aria attributes when the popup is open', async () => {
			render(
				<FlyoutMenuItem isDefaultOpen>
					<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
					<FlyoutMenuItemContent>
						<ButtonMenuItem>Item 1</ButtonMenuItem>
					</FlyoutMenuItemContent>
				</FlyoutMenuItem>,
			);

			expect(screen.getByRole('button', { name: 'Trigger' })).toHaveAttribute(
				'aria-expanded',
				'true',
			);
		});
	});

	describe('popup content', () => {
		it('should close the popup when a menu item button inside the popup is clicked', async () => {
			render(
				<FlyoutMenuItem isDefaultOpen>
					<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
					<FlyoutMenuItemContent>
						<ButtonMenuItem>Item 1</ButtonMenuItem>
					</FlyoutMenuItemContent>
				</FlyoutMenuItem>,
			);

			expect(screen.queryByText('Item 1')).toBeVisible();

			await userEvent.click(screen.getByRole('button', { name: 'Item 1' }));

			expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
		});

		it('should close the popup when a menu item link inside the popup is clicked', async () => {
			render(
				<FlyoutMenuItem isDefaultOpen>
					<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
					<FlyoutMenuItemContent>
						<LinkMenuItem href="#">Item 1</LinkMenuItem>
					</FlyoutMenuItemContent>
				</FlyoutMenuItem>,
			);

			expect(screen.queryByText('Item 1')).toBeVisible();

			await userEvent.click(screen.getByRole('link', { name: 'Item 1' }));

			expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
		});
	});

	describe('isOpen', () => {
		it('should render the content when isOpen is true', () => {
			render(
				<FlyoutMenuItem isOpen={true}>
					<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
					<FlyoutMenuItemContent>
						<ButtonMenuItem>Item 1</ButtonMenuItem>
					</FlyoutMenuItemContent>
				</FlyoutMenuItem>,
			);
			expect(screen.getByRole('button', { name: 'Trigger' })).toBeVisible();
			expect(screen.getByText('Item 1')).toBeVisible();
		});

		it('should not render the content when isOpen is false', () => {
			render(
				<FlyoutMenuItem isOpen={false} isDefaultOpen>
					<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
					<FlyoutMenuItemContent>
						<ButtonMenuItem>Item 1</ButtonMenuItem>
					</FlyoutMenuItemContent>
				</FlyoutMenuItem>,
			);
			expect(screen.getByRole('button', { name: 'Trigger' })).toBeVisible();
			expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
		});

		it('should remove the content from the document when isOpen is updated to false after the initial render', () => {
			const { rerender } = render(
				<FlyoutMenuItem isDefaultOpen>
					<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
					<FlyoutMenuItemContent>
						<ButtonMenuItem>Item 1</ButtonMenuItem>
					</FlyoutMenuItemContent>
				</FlyoutMenuItem>,
			);
			// Initially, the content should be visible
			expect(screen.getByRole('button', { name: 'Trigger' })).toBeVisible();
			expect(screen.getByText('Item 1')).toBeVisible();
			// Update the isOpen prop to false
			rerender(
				<FlyoutMenuItem isDefaultOpen isOpen={false}>
					<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
					<FlyoutMenuItemContent>
						<ButtonMenuItem>Item 1</ButtonMenuItem>
					</FlyoutMenuItemContent>
				</FlyoutMenuItem>,
			);
			// Now, the content should disappear from the document
			expect(screen.getByRole('button', { name: 'Trigger' })).toBeVisible();
			expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
		});
	});

	ffTest.on('platform_dst_nav4_flyout_menu_slots_close_button', 'includes updates to flyout menu to have slots and close button', () => {
		describe('maxHeight', () => {
			it('should use the provided maxHeight value when maxHeight prop is provided', () => {
				const customMaxHeight = 500;

				render(
					<FlyoutMenuItem isDefaultOpen>
						<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
						<FlyoutMenuItemContent maxHeight={customMaxHeight} containerTestId="content">
							<FlyoutHeader title="Title" closeButtonLabel="Close" />
							<FlyoutBody>
								<ButtonMenuItem>Item 1</ButtonMenuItem>
								<ButtonMenuItem>Item 2</ButtonMenuItem>
								<ButtonMenuItem>Item 3</ButtonMenuItem>
							</FlyoutBody>
						</FlyoutMenuItemContent>
					</FlyoutMenuItem>,
				);

				const computedMaxHeight = screen.getByTestId('content--container').style.maxHeight;

				// Remove all whitespace (newlines, tabs, spaces) for comparison
				const normalisedMaxHeight = computedMaxHeight.replace(/\s+/g, '');
				const expectedMaxHeight = `min(calc(100vh - 26px), ${customMaxHeight}px)`.replace(/\s+/g, '');

				expect(normalisedMaxHeight).toBe(expectedMaxHeight);
			});

			it('should use the default maxHeight value (760px) when maxHeight prop is not provided', () => {
				const defaultMaxHeight = 760;

				render(
					<FlyoutMenuItem isDefaultOpen>
						<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
						<FlyoutMenuItemContent containerTestId="content">
							<FlyoutHeader title="Title" closeButtonLabel="Close" />
							<FlyoutBody>
								<ButtonMenuItem>Item 1</ButtonMenuItem>
								<ButtonMenuItem>Item 2</ButtonMenuItem>
								<ButtonMenuItem>Item 3</ButtonMenuItem>
							</FlyoutBody>
						</FlyoutMenuItemContent>
					</FlyoutMenuItem>,
				);

				const computedMaxHeight = screen.getByTestId('content--container').style.maxHeight;

				// Remove all whitespace (newlines, tabs, spaces) for comparison
				const normalisedMaxHeight = computedMaxHeight.replace(/\s+/g, '');
				const expectedMaxHeight = `min(calc(100vh - 26px), ${defaultMaxHeight}px)`.replace(/\s+/g, '');

				expect(normalisedMaxHeight).toBe(expectedMaxHeight);
			});
		});
	});
});
