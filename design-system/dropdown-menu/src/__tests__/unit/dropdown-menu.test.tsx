import React, { useState } from 'react';

import { fireEvent, render, screen, within } from '@testing-library/react';

import Button from '@atlaskit/button/standard-button';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import DropdownMenu from '../../dropdown-menu';
import DropdownItem from '../../dropdown-menu-item';
import DropdownItemGroup from '../../dropdown-menu-item-group';
import { type DropdownMenuProps } from '../../types';

const triggerText = 'Options';
const testId = 'testId';

const createDropdown = (props?: DropdownMenuProps) => (
	// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
	<DropdownMenu trigger={triggerText} testId={testId} {...props} />
);

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('dropdown menu', () => {
	const items = ['Move', 'Clone', 'Delete'];

	describe('trigger', () => {
		it('there should be a trigger button by default', () => {
			render(createDropdown());

			const trigger = screen.getByRole('button');

			expect(trigger).toBeInTheDocument();
		});

		it('trigger button with text', () => {
			render(createDropdown());

			const trigger = screen.getByRole('button');

			expect(trigger).toBeInTheDocument();
		});

		it('should callback with flipped state when closed and controlled', () => {
			const callback = jest.fn();
			render(createDropdown({ onOpenChange: callback, isOpen: false }));

			fireEvent.click(screen.getByTestId(`${testId}--trigger`));

			expect(callback).toHaveBeenCalledWith(expect.objectContaining({ isOpen: true }));
		});

		it('should callback with flipped state when opened and controlled', () => {
			const callback = jest.fn();
			render(createDropdown({ onOpenChange: callback, isOpen: true }));

			fireEvent.click(screen.getByTestId(`${testId}--trigger`));

			expect(callback).toHaveBeenCalledWith(expect.objectContaining({ isOpen: false }));
		});

		it('should callback with false when opened', () => {
			const callback = jest.fn();
			render(createDropdown({ onOpenChange: callback, isOpen: true }));

			fireEvent.click(document.body);

			expect(callback).toHaveBeenCalledWith({
				isOpen: false,
				event: new MouseEvent('click'),
			});
		});

		it('should open the menu list when button is clicked', () => {
			render(
				createDropdown({
					children: (
						<DropdownItemGroup>
							{items.map((text) => (
								<DropdownItem key={text}>{text}</DropdownItem>
							))}
						</DropdownItemGroup>
					),
				}),
			);

			expect(screen.queryAllByRole('menuitem')).toHaveLength(0);

			fireEvent.click(screen.getByRole('button'));

			expect(screen.queryAllByRole('menuitem')).toHaveLength(items.length);
		});

		it('should return focus to the trigger after closing the menu if it is called via MouseEvent click', () => {
			render(
				createDropdown({
					children: (
						<DropdownItemGroup>
							{items.map((text) => (
								<DropdownItem key={text}>{text}</DropdownItem>
							))}
						</DropdownItemGroup>
					),
				}),
			);

			const trigger = screen.getByRole('button');

			// Simulating MouseEvent click
			fireEvent.click(trigger, {
				clientX: 1,
				clientY: 1,
				detail: 1,
			});
			fireEvent.click(screen.getAllByRole('menuitem', { name: 'Clone' })[0]);

			expect(trigger).toHaveFocus();
		});

		it('should render aria-label via label prop', () => {
			render(
				createDropdown({
					trigger: '',
					label: triggerText,
				}),
			);

			const trigger = screen.getByRole('button');
			expect(trigger).toHaveAttribute('aria-label', triggerText);
		});

		it('should not render aria-label if label prop is not present', () => {
			render(createDropdown());

			const trigger = screen.getByRole('button');
			expect(trigger).not.toHaveAttribute('aria-label');
		});

		it('should render visible label and aria-label separately', () => {
			const label = 'more';
			render(createDropdown({ label: label }));

			const trigger = screen.getByRole('button', { expanded: false });
			const visibleLabel = within(trigger).getByText(triggerText);

			expect(trigger).toHaveAttribute('aria-label', label);
			expect(visibleLabel).toBeInTheDocument();
		});
	});

	describe('nested dropdown', () => {
		const NestedDropdown = ({ level = 0 }) => {
			return createDropdown({
				placement: 'right-start',
				shouldRenderToParent: true,
				testId: `nested-${level}`,
				children: (
					<DropdownItemGroup>
						<NestedDropdown level={level + 1} />
						<DropdownItem testId={`nested-item1-${level}`}>One of many items</DropdownItem>
						<DropdownItem testId={`nested-item2-${level}`}>One of many items</DropdownItem>
					</DropdownItemGroup>
				),
			});
		};

		const pressEscKey = () =>
			fireEvent.keyDown(document.body, {
				key: 'Escape',
				code: 27,
			});

		it('should render nested dropdown on the page', () => {
			render(<NestedDropdown />);
			let level = 0;
			while (level < 5) {
				// test nested dropdown can be opened correctly
				const nestedTrigger = screen.getByTestId(`nested-${level}--trigger`);
				expect(nestedTrigger).toBeInTheDocument();
				fireEvent.click(nestedTrigger);
				level += 1;
			}

			jest.useFakeTimers();
			while (level > 0) {
				// close the dropdown by pressing Escape
				pressEscKey();
				// 0 timeout is needed to meet the same flow in layering
				// avoid immediate cleanup using setTimeout when component unmount
				// this will make sure non-top layer components can get the correct top level value
				// when multiple layers trigger onClose in sequence.
				setTimeout(() => {
					// test if top level of nested dropdown is closed
					expect(screen.queryByTestId(`nested-${level}--trigger`)).not.toBeInTheDocument();
				}, 0);
				level -= 1;
				expect(screen.getByTestId(`nested-${level}--trigger`)).toBeInTheDocument();
			}
			jest.useRealTimers();
		});

		it('should have a role of group when nested under another menu', () => {
			render(<NestedDropdown />);

			const topLevelDropdownTrigger = screen.getByTestId('nested-0--trigger');

			fireEvent.click(topLevelDropdownTrigger);
			expect(screen.getByTestId('nested-0--content')).not.toHaveAttribute('role', 'group');

			fireEvent.click(screen.getByTestId(`nested-1--trigger`));
			expect(screen.getByTestId('nested-1--content')).toHaveAttribute('role', 'group');
		});
	});

	describe('customised trigger', () => {
		it('render custom button on the page', () => {
			render(
				createDropdown({
					trigger: (triggerProps) => (
						<Button {...triggerProps} data-test-id="native-button">
							{triggerText}
						</Button>
					),
				}),
			);
			const trigger = screen.getByRole('button');

			expect(trigger).toBeInTheDocument();
		});

		it('custom trigger to open popup', () => {
			const triggerTestId = 'triggerTestId';

			const DDMWithCustomTrigger = () => {
				const [isOpen, setOpen] = useState(false);
				return createDropdown({
					isOpen: true,
					trigger: (triggerProps) => (
						<Button {...triggerProps} onClick={() => setOpen(!isOpen)} testId={triggerTestId}>
							{triggerText}
						</Button>
					),
					children: (
						<DropdownItemGroup>
							{items.map((text) => (
								<DropdownItem key={text}>{text}</DropdownItem>
							))}
						</DropdownItemGroup>
					),
				});
			};

			render(<DDMWithCustomTrigger />);

			const trigger = screen.getByTestId(triggerTestId);

			fireEvent.click(trigger);

			expect(screen.getAllByRole('menuitem')).toHaveLength(items.length);
		});

		it('should open the menu and call onClick on the trigger when Enter or Space is pressed while the trigger is focused', () => {
			const triggerTestId = 'triggerTestId';
			const onClick = jest.fn((callback) => callback());

			const DDMWithCustomTrigger = ({ onClick }: { onClick: any }) => {
				const [isOpen, setIsOpen] = useState(false);
				return createDropdown({
					isOpen: isOpen,
					trigger: (triggerProps) => (
						<Button
							{...triggerProps}
							onClick={() => onClick(() => setIsOpen(!isOpen))}
							testId={triggerTestId}
						>
							{triggerText}
						</Button>
					),
					children: (
						<DropdownItemGroup>
							{items.map((text) => (
								<DropdownItem key={text}>{text}</DropdownItem>
							))}
						</DropdownItemGroup>
					),
				});
			};

			render(<DDMWithCustomTrigger onClick={onClick} />);

			const trigger = screen.getByTestId(triggerTestId);

			fireEvent.click(trigger, {
				clientX: 0,
				clientY: 0,
				detail: 0,
			});

			expect(screen.getAllByRole('menuitem')).toHaveLength(items.length);
			expect(onClick).toHaveBeenCalled();
		});
	});

	describe('isLoading status', () => {
		it('renders loading status as a menuitem', () => {
			render(
				createDropdown({
					isLoading: true,
					children: (
						<DropdownItemGroup>
							<DropdownItem>Loaded action</DropdownItem>
						</DropdownItemGroup>
					),
				}),
			);

			fireEvent.click(screen.getByRole('button'));

			expect(screen.queryAllByRole('menuitem')).toHaveLength(1);
		});

		it('display default label to indicate in loading status', async () => {
			const defaultLoadingText = 'Loading';

			render(
				createDropdown({
					isLoading: true,
					children: (
						<DropdownItemGroup>
							<DropdownItem>Loaded action</DropdownItem>
						</DropdownItemGroup>
					),
				}),
			);

			fireEvent.click(screen.getByRole('button'));

			const loadingIndicator = await screen.findByTestId(/loading-indicator$/);
			expect(loadingIndicator).toHaveAccessibleName(defaultLoadingText);
		});

		it('display label to indicate in loading status', async () => {
			const statusLabel = 'the content is loading';

			render(
				createDropdown({
					isLoading: true,
					statusLabel: statusLabel,
					children: (
						<DropdownItemGroup>
							<DropdownItem>Loaded action</DropdownItem>
						</DropdownItemGroup>
					),
				}),
			);

			fireEvent.click(screen.getByRole('button'));

			const loadingIndicator = await screen.findByTestId(/loading-indicator$/);
			expect(loadingIndicator).toHaveAccessibleName(statusLabel);
		});

		it('should close the dropdown menu on outside click', () => {
			render(
				<>
					<button aria-label="outside" data-testid="outside" type="button" />
					{createDropdown()}
				</>,
			);

			fireEvent.click(screen.getByTestId(`${testId}--trigger`));

			expect(screen.getByTestId(`${testId}--content`)).toBeInTheDocument();

			fireEvent.click(screen.getByTestId('outside'));

			expect(screen.queryByTestId(`${testId}--content`)).not.toBeInTheDocument();
		});

		it('should close the dropdown menu on outside click which has stopPropagation', () => {
			render(
				<>
					<button
						aria-label="outside"
						data-testid="outside"
						type="button"
						onClick={(e) => e.stopPropagation()}
					/>
					{createDropdown()}
				</>,
			);

			fireEvent.click(screen.getByTestId(`${testId}--trigger`));

			expect(screen.getByTestId(`${testId}--content`)).toBeInTheDocument();

			fireEvent.click(screen.getByTestId('outside'));

			expect(screen.queryByTestId(`${testId}--content`)).not.toBeInTheDocument();
		});

		it('should generate a psuedorandom id to link the trigger and the popup if none was passed to it', () => {
			render(
				createDropdown({
					isOpen: true,
					children: (
						<DropdownItemGroup>
							{items.map((text) => (
								<DropdownItem key={text}>{text}</DropdownItem>
							))}
						</DropdownItemGroup>
					),
				}),
			);

			const popupId = screen.getByTestId(`${testId}--content`).getAttribute('id');

			expect(screen.getByTestId(`${testId}--trigger`)).toHaveAttribute('aria-controls', popupId);
		});

		it('should generate a psuedorandom id to link the custom trigger and the popup if none was passed to it', () => {
			render(
				createDropdown({
					isOpen: true,
					trigger: ({ triggerRef, ...props }) => (
						<Button ref={triggerRef} {...props} type="button">
							Options
						</Button>
					),
					children: (
						<DropdownItemGroup>
							{items.map((text) => (
								<DropdownItem key={text}>{text}</DropdownItem>
							))}
						</DropdownItemGroup>
					),
				}),
			);

			const popupId = screen.getByTestId(`${testId}--content`).getAttribute('id');

			expect(screen.getByTestId(`${testId}--trigger`)).toHaveAttribute('aria-controls', popupId);
		});
	});
});

describe.each([false, true])('popup trigger semantics, top layer: %s', (topLayer) => {
	beforeEach(() => {
		(topLayer ? passGate : failGate)('platform-dst-top-layer');
	});

	it.each(['dialog', 'menu', 'true'] as const)(
		'closes only for dialog popup items when enabled: %s',
		(hasPopup) => {
			passGate('platform_dst-a11y_modal-trigger-haspopup');
			const onOpenChange = jest.fn();
			render(
				<DropdownMenu trigger="Actions" defaultOpen onOpenChange={onOpenChange}>
					<DropdownItemGroup>
						<DropdownItem aria-haspopup={hasPopup === 'dialog' ? 'dialog' : true}>
							Open popup
						</DropdownItem>
					</DropdownItemGroup>
				</DropdownMenu>,
			);
			const item = screen.getByRole('menuitem', { name: 'Open popup' });
			// Top-layer submenu triggers use the equivalent menu value in the DOM.
			if (hasPopup === 'menu') {
				item.setAttribute('aria-haspopup', 'menu');
			}
			fireEvent.click(item);
			if (hasPopup === 'dialog') {
				expect(onOpenChange).toHaveBeenCalledWith(expect.objectContaining({ isOpen: false }));
			} else {
				expect(onOpenChange).not.toHaveBeenCalled();
			}
		},
	);

	it('preserves dialog item behavior when disabled', () => {
		failGate('platform_dst-a11y_modal-trigger-haspopup');
		const onOpenChange = jest.fn();
		render(
			<DropdownMenu trigger="Actions" defaultOpen onOpenChange={onOpenChange}>
				<DropdownItemGroup>
					<DropdownItem aria-haspopup="dialog">Open dialog</DropdownItem>
				</DropdownItemGroup>
			</DropdownMenu>,
		);
		fireEvent.click(screen.getByRole('menuitem', { name: 'Open dialog' }));
		expect(onOpenChange).not.toHaveBeenCalled();
	});

	it.each(['dialog', 'menu', 'true'] as const)(
		'ArrowRight activates only submenu triggers when enabled: %s',
		(hasPopup) => {
			if (topLayer || hasPopup !== 'dialog') {
				passGate('platform_dst-a11y_modal-trigger-haspopup');
			}
			const onClick = jest.fn();
			render(
				<DropdownMenu trigger="Actions" defaultOpen>
					<DropdownItemGroup>
						<DropdownItem aria-haspopup={hasPopup === 'dialog' ? 'dialog' : true} onClick={onClick}>
							Open popup
						</DropdownItem>
					</DropdownItemGroup>
				</DropdownMenu>,
			);
			const item = screen.getByRole('menuitem', { name: 'Open popup' });
			if (hasPopup === 'menu') {
				item.setAttribute('aria-haspopup', 'menu');
			}
			item.focus();
			fireEvent.keyDown(item, { key: 'ArrowRight', code: 'ArrowRight' });
			expect(onClick).toHaveBeenCalledTimes(hasPopup === 'dialog' ? 0 : 1);
		},
	);
});

describe.each([false, true])('legacy popup selector, gate: %s', (enabled) => {
	it.each(['menu', 'true', 'dialog', 'false', undefined])(
		'closes according to popup type: %s',
		(hasPopup) => {
			failGate('platform-dst-top-layer');
			(enabled ? passGate : failGate)('platform_dst-a11y_modal-trigger-haspopup');
			const onOpenChange = jest.fn();
			render(
				<DropdownMenu trigger="Actions" defaultOpen onOpenChange={onOpenChange}>
					<DropdownItemGroup>
						<DropdownItem>Open popup</DropdownItem>
					</DropdownItemGroup>
				</DropdownMenu>,
			);
			const item = screen.getByRole('menuitem', { name: 'Open popup' });
			if (hasPopup !== undefined) {
				item.setAttribute('aria-haspopup', hasPopup);
			}
			fireEvent.click(item);
			const shouldClose = enabled
				? hasPopup !== 'menu' && hasPopup !== 'true'
				: hasPopup === undefined;
			if (shouldClose) {
				expect(onOpenChange).toHaveBeenCalledWith(expect.objectContaining({ isOpen: false }));
			} else {
				expect(onOpenChange).not.toHaveBeenCalled();
			}
		},
	);
});
