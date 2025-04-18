import React, { useState } from 'react';

import { fireEvent, render, screen, within } from '@testing-library/react';

import Button from '@atlaskit/button/standard-button';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../../index';
import { type DropdownMenuProps } from '../../types';

const triggerText = 'Options';
const testId = 'testId';

const createDropdown = (props?: DropdownMenuProps) => (
	// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
	<DropdownMenu trigger={triggerText} testId={testId} {...props} />
);

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
				fireEvent.keyDown(document.body, {
					key: 'Escape',
					code: 27,
				});
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
		it('renders loading status as a menuitem', async () => {
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
