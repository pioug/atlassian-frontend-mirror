import React from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';

import { ffTest } from '@atlassian/feature-flags-test-utils';

import DropdownMenu, {
	DropdownItem,
	DropdownItemCheckbox,
	DropdownItemCheckboxGroup,
	DropdownItemGroup,
	DropdownItemRadio,
	DropdownItemRadioGroup,
} from '../../index';

afterEach(() => {
	jest.clearAllMocks();
});

const testId = 'dropdown';
const triggerText = 'Options';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
ffTest.on('platform-dst-top-layer', 'DropdownMenu top-layer rendering', () => {
	it('renders a trigger button by default', () => {
		render(
			<DropdownMenu trigger={triggerText} testId={testId}>
				<DropdownItemGroup>
					<DropdownItem>Move</DropdownItem>
				</DropdownItemGroup>
			</DropdownMenu>,
		);

		expect(screen.getByTestId(`${testId}--trigger`)).toBeInTheDocument();
		expect(screen.getByRole('button', { name: triggerText })).toBeInTheDocument();
	});

	it('sets aria-expanded on the trigger', () => {
		render(
			<DropdownMenu trigger={triggerText} testId={testId}>
				<DropdownItemGroup>
					<DropdownItem>Move</DropdownItem>
				</DropdownItemGroup>
			</DropdownMenu>,
		);

		const trigger = screen.getByTestId(`${testId}--trigger`);
		expect(trigger).toHaveAttribute('aria-expanded', 'false');
	});

	it('sets aria-haspopup="menu" on the trigger', () => {
		render(
			<DropdownMenu trigger={triggerText} testId={testId}>
				<DropdownItemGroup>
					<DropdownItem>Move</DropdownItem>
				</DropdownItemGroup>
			</DropdownMenu>,
		);

		const trigger = screen.getByTestId(`${testId}--trigger`);
		expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
	});

	it('calls onOpenChange when trigger is clicked', () => {
		const onOpenChange = jest.fn();

		render(
			<DropdownMenu trigger={triggerText} testId={testId} onOpenChange={onOpenChange}>
				<DropdownItemGroup>
					<DropdownItem>Move</DropdownItem>
				</DropdownItemGroup>
			</DropdownMenu>,
		);

		fireEvent.click(screen.getByTestId(`${testId}--trigger`));
		expect(onOpenChange).toHaveBeenCalledWith(expect.objectContaining({ isOpen: true }));
	});

	it('calls onOpenChange with isOpen=false when toggled closed', () => {
		const onOpenChange = jest.fn();

		render(
			<DropdownMenu trigger={triggerText} testId={testId} isOpen={true} onOpenChange={onOpenChange}>
				<DropdownItemGroup>
					<DropdownItem>Move</DropdownItem>
				</DropdownItemGroup>
			</DropdownMenu>,
		);

		fireEvent.click(screen.getByTestId(`${testId}--trigger`));
		expect(onOpenChange).toHaveBeenCalledWith(expect.objectContaining({ isOpen: false }));
	});

	it('renders a custom trigger via render prop', () => {
		render(
			<DropdownMenu
				testId={testId}
				trigger={(triggerProps) => (
					<button type="button" {...triggerProps} ref={triggerProps.triggerRef}>
						Custom trigger
					</button>
				)}
			>
				<DropdownItemGroup>
					<DropdownItem>Move</DropdownItem>
				</DropdownItemGroup>
			</DropdownMenu>,
		);

		expect(screen.getByRole('button', { name: 'Custom trigger' })).toBeInTheDocument();
	});

	it('renders Popup.Content with role="menu" and label', () => {
		render(
			<DropdownMenu trigger={triggerText} testId={testId} isOpen={true} label="Actions menu">
				<DropdownItemGroup>
					<DropdownItem>Move</DropdownItem>
				</DropdownItemGroup>
			</DropdownMenu>,
		);

		// The content element should have role="menu" via Popover
		const content = screen.getByTestId(`${testId}--content`);
		expect(content).toBeInTheDocument();
		expect(content).toHaveAttribute('role', 'menu');
	});

	it('renders the test ID on the content', () => {
		render(
			<DropdownMenu trigger={triggerText} testId={testId} isOpen={true}>
				<DropdownItemGroup>
					<DropdownItem>Move</DropdownItem>
				</DropdownItemGroup>
			</DropdownMenu>,
		);

		expect(screen.getByTestId(`${testId}--content`)).toBeInTheDocument();
	});

	it('passes menuLabel for aria labelling', () => {
		render(
			<DropdownMenu trigger={triggerText} testId={testId} isOpen={true} menuLabel="Actions">
				<DropdownItemGroup>
					<DropdownItem>Move</DropdownItem>
				</DropdownItemGroup>
			</DropdownMenu>,
		);

		const content = screen.getByTestId(`${testId}--content`);
		expect(content).toHaveAttribute('aria-label', 'Actions');
	});

	it('renders children within a MenuGroup', () => {
		render(
			<DropdownMenu trigger={triggerText} testId={testId} isOpen={true}>
				<DropdownItemGroup>
					<DropdownItem testId="item-move">Move</DropdownItem>
					<DropdownItem testId="item-clone">Clone</DropdownItem>
				</DropdownItemGroup>
			</DropdownMenu>,
		);

		expect(screen.getByTestId('item-move')).toBeInTheDocument();
		expect(screen.getByTestId('item-clone')).toBeInTheDocument();
	});

	it('shows a loading spinner when isLoading=true', () => {
		render(
			<DropdownMenu
				trigger={triggerText}
				testId={testId}
				isOpen={true}
				isLoading={true}
				statusLabel="Loading items"
			>
				<DropdownItemGroup>
					<DropdownItem>Move</DropdownItem>
				</DropdownItemGroup>
			</DropdownMenu>,
		);

		expect(screen.getByTestId(`${testId}--menu-wrapper--loading-indicator`)).toBeInTheDocument();
	});

	it('renders with defaultOpen=true', () => {
		render(
			<DropdownMenu trigger={triggerText} testId={testId} defaultOpen={true}>
				<DropdownItemGroup>
					<DropdownItem>Move</DropdownItem>
				</DropdownItemGroup>
			</DropdownMenu>,
		);

		expect(screen.getByTestId(`${testId}--content`)).toBeInTheDocument();
	});
});

// ────────────────────────────────────────────────────
// Accessibility-focused tests
// ────────────────────────────────────────────────────

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
ffTest.on('platform-dst-top-layer', 'WCAG 4.1.2 Name, Role, Value — ARIA attributes', () => {
	it('trigger has aria-controls referencing the content element', () => {
		render(
			<DropdownMenu trigger={triggerText} testId={testId} isOpen={true}>
				<DropdownItemGroup>
					<DropdownItem>Move</DropdownItem>
				</DropdownItemGroup>
			</DropdownMenu>,
		);

		const trigger = screen.getByTestId(`${testId}--trigger`);
		const ariaControls = trigger.getAttribute('aria-controls');
		expect(ariaControls).toBeTruthy();

		// The popover element has role="menu" and the matching id
		const menus = screen.getAllByRole('menu');
		const popoverMenu = menus.find((el) => el.getAttribute('popover') === 'auto');
		expect(popoverMenu).toHaveAttribute('id', ariaControls ?? '');
	});

	it('content element has role="menu"', () => {
		render(
			<DropdownMenu trigger={triggerText} testId={testId} isOpen={true}>
				<DropdownItemGroup>
					<DropdownItem>Move</DropdownItem>
				</DropdownItemGroup>
			</DropdownMenu>,
		);

		const content = screen.getByTestId(`${testId}--content`);
		expect(content).toHaveAttribute('role', 'menu');
	});

	it('menu items have role="menuitem"', () => {
		render(
			<DropdownMenu trigger={triggerText} testId={testId} isOpen={true}>
				<DropdownItemGroup>
					<DropdownItem>Move</DropdownItem>
					<DropdownItem>Clone</DropdownItem>
				</DropdownItemGroup>
			</DropdownMenu>,
		);

		const menuItems = screen.getAllByRole('menuitem');
		expect(menuItems).toHaveLength(2);
		expect(menuItems[0]).toHaveAccessibleName('Move');
		expect(menuItems[1]).toHaveAccessibleName('Clone');
	});

	it('checkbox items have role="menuitemcheckbox"', () => {
		render(
			<DropdownMenu trigger={triggerText} testId={testId} isOpen={true}>
				<DropdownItemCheckboxGroup id="actions">
					<DropdownItemCheckbox id="bold">Bold</DropdownItemCheckbox>
					<DropdownItemCheckbox id="italic">Italic</DropdownItemCheckbox>
				</DropdownItemCheckboxGroup>
			</DropdownMenu>,
		);

		const checkboxItems = screen.getAllByRole('menuitemcheckbox');
		expect(checkboxItems).toHaveLength(2);
	});

	it('radio items have role="menuitemradio"', () => {
		render(
			<DropdownMenu trigger={triggerText} testId={testId} isOpen={true}>
				<DropdownItemRadioGroup id="sort">
					<DropdownItemRadio id="asc">Ascending</DropdownItemRadio>
					<DropdownItemRadio id="desc">Descending</DropdownItemRadio>
				</DropdownItemRadioGroup>
			</DropdownMenu>,
		);

		const radioItems = screen.getAllByRole('menuitemradio');
		expect(radioItems).toHaveLength(2);
	});

	it('uses trigger text as fallback aria-label when no menuLabel or label provided', () => {
		render(
			<DropdownMenu trigger={triggerText} testId={testId} isOpen={true}>
				<DropdownItemGroup>
					<DropdownItem>Move</DropdownItem>
				</DropdownItemGroup>
			</DropdownMenu>,
		);

		const content = screen.getByTestId(`${testId}--content`);
		// Falls back to trigger text ("Options") when no menuLabel/label
		expect(content).toHaveAttribute('aria-label', triggerText);
	});

	it('prefers menuLabel over label and trigger text for aria-label', () => {
		render(
			<DropdownMenu
				trigger={triggerText}
				testId={testId}
				isOpen={true}
				menuLabel="Primary actions"
				label="Actions button"
			>
				<DropdownItemGroup>
					<DropdownItem>Move</DropdownItem>
				</DropdownItemGroup>
			</DropdownMenu>,
		);

		const content = screen.getByTestId(`${testId}--content`);
		expect(content).toHaveAttribute('aria-label', 'Primary actions');
	});
});

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
ffTest.on('platform-dst-top-layer', 'WCAG 2.1.1 Keyboard — menu item click behavior', () => {
	it('closes menu when a menuitem is clicked', () => {
		const onOpenChange = jest.fn();

		render(
			<DropdownMenu trigger={triggerText} testId={testId} isOpen={true} onOpenChange={onOpenChange}>
				<DropdownItemGroup>
					<DropdownItem>Move</DropdownItem>
					<DropdownItem>Clone</DropdownItem>
				</DropdownItemGroup>
			</DropdownMenu>,
		);

		// Click the first menuitem
		fireEvent.click(screen.getAllByRole('menuitem')[0]);

		expect(onOpenChange).toHaveBeenCalledWith(expect.objectContaining({ isOpen: false }));
	});

	it('does NOT close menu when menuitemcheckbox is clicked', () => {
		const onOpenChange = jest.fn();

		render(
			<DropdownMenu trigger={triggerText} testId={testId} isOpen={true} onOpenChange={onOpenChange}>
				<DropdownItemCheckboxGroup id="options">
					<DropdownItemCheckbox id="bold">Bold</DropdownItemCheckbox>
				</DropdownItemCheckboxGroup>
			</DropdownMenu>,
		);

		onOpenChange.mockClear();

		fireEvent.click(screen.getByRole('menuitemcheckbox'));

		// onOpenChange should NOT have been called with isOpen: false
		const closeCalls = onOpenChange.mock.calls.filter(
			([arg]: [{ isOpen: boolean }]) => arg.isOpen === false,
		);
		expect(closeCalls).toHaveLength(0);
	});

	it('does NOT close menu when menuitemradio is clicked', () => {
		const onOpenChange = jest.fn();

		render(
			<DropdownMenu trigger={triggerText} testId={testId} isOpen={true} onOpenChange={onOpenChange}>
				<DropdownItemRadioGroup id="sort">
					<DropdownItemRadio id="asc">Ascending</DropdownItemRadio>
				</DropdownItemRadioGroup>
			</DropdownMenu>,
		);

		onOpenChange.mockClear();

		fireEvent.click(screen.getByRole('menuitemradio'));

		// onOpenChange should NOT have been called with isOpen: false
		const closeCalls = onOpenChange.mock.calls.filter(
			([arg]: [{ isOpen: boolean }]) => arg.isOpen === false,
		);
		expect(closeCalls).toHaveLength(0);
	});
});

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
ffTest.on(
	'platform-dst-top-layer',
	'Selection state — checkbox and radio persistence',
	() => {
		it('checkbox items toggle checked state on click', () => {
			render(
				<DropdownMenu trigger={triggerText} testId={testId} isOpen={true}>
					<DropdownItemCheckboxGroup id="actions">
						<DropdownItemCheckbox id="bold">Bold</DropdownItemCheckbox>
						<DropdownItemCheckbox id="italic">Italic</DropdownItemCheckbox>
					</DropdownItemCheckboxGroup>
				</DropdownMenu>,
			);

			const boldCheckbox = screen.getByRole('menuitemcheckbox', { name: 'Bold' });
			expect(boldCheckbox).not.toBeChecked();

			fireEvent.click(boldCheckbox);
			expect(boldCheckbox).toBeChecked();

			// Click again to toggle off
			fireEvent.click(boldCheckbox);
			expect(boldCheckbox).not.toBeChecked();
		});

		it('radio items switch selection within group', () => {
			render(
				<DropdownMenu trigger={triggerText} testId={testId} isOpen={true}>
					<DropdownItemRadioGroup id="sort">
						<DropdownItemRadio id="asc">Ascending</DropdownItemRadio>
						<DropdownItemRadio id="desc">Descending</DropdownItemRadio>
					</DropdownItemRadioGroup>
				</DropdownMenu>,
			);

			const ascending = screen.getByRole('menuitemradio', { name: 'Ascending' });
			const descending = screen.getByRole('menuitemradio', { name: 'Descending' });

			expect(ascending).not.toBeChecked();
			expect(descending).not.toBeChecked();

			fireEvent.click(ascending);
			expect(ascending).toBeChecked();
			expect(descending).not.toBeChecked();

			fireEvent.click(descending);
			expect(descending).toBeChecked();
			expect(ascending).not.toBeChecked();
		});

		it('checkbox defaultSelected items start checked', () => {
			render(
				<DropdownMenu trigger={triggerText} testId={testId} isOpen={true}>
					<DropdownItemCheckboxGroup id="options">
						<DropdownItemCheckbox id="bold" defaultSelected>
							Bold
						</DropdownItemCheckbox>
						<DropdownItemCheckbox id="italic">Italic</DropdownItemCheckbox>
					</DropdownItemCheckboxGroup>
				</DropdownMenu>,
			);

			expect(screen.getByRole('menuitemcheckbox', { name: 'Bold' })).toBeChecked();
			expect(screen.getByRole('menuitemcheckbox', { name: 'Italic' })).not.toBeChecked();
		});

		it('radio defaultSelected items start checked', () => {
			render(
				<DropdownMenu trigger={triggerText} testId={testId} isOpen={true}>
					<DropdownItemRadioGroup id="sort">
						<DropdownItemRadio id="asc" defaultSelected>
							Ascending
						</DropdownItemRadio>
						<DropdownItemRadio id="desc">Descending</DropdownItemRadio>
					</DropdownItemRadioGroup>
				</DropdownMenu>,
			);

			expect(screen.getByRole('menuitemradio', { name: 'Ascending' })).toBeChecked();
			expect(screen.getByRole('menuitemradio', { name: 'Descending' })).not.toBeChecked();
		});
	},
);

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
ffTest.on(
	'platform-dst-top-layer',
	'Loading state behavior',
	() => {
		it('renders loading indicator as a menuitem', () => {
			render(
				<DropdownMenu trigger={triggerText} testId={testId} isOpen={true} isLoading={true}>
					<DropdownItemGroup>
						<DropdownItem>Loaded action</DropdownItem>
					</DropdownItemGroup>
				</DropdownMenu>,
			);

			// Loading indicator should be a menuitem (matches legacy behavior)
			expect(screen.queryAllByRole('menuitem')).toHaveLength(1);
		});

		it('displays default loading label', () => {
			render(
				<DropdownMenu trigger={triggerText} testId={testId} isOpen={true} isLoading={true}>
					<DropdownItemGroup>
						<DropdownItem>Loaded action</DropdownItem>
					</DropdownItemGroup>
				</DropdownMenu>,
			);

			const loadingIndicator = screen.getByTestId(`${testId}--menu-wrapper--loading-indicator`);
			expect(loadingIndicator).toHaveAccessibleName('Loading');
		});

		it('displays custom loading label via statusLabel', () => {
			const statusLabel = 'Fetching items';

			render(
				<DropdownMenu
					trigger={triggerText}
					testId={testId}
					isOpen={true}
					isLoading={true}
					statusLabel={statusLabel}
				>
					<DropdownItemGroup>
						<DropdownItem>Loaded action</DropdownItem>
					</DropdownItemGroup>
				</DropdownMenu>,
			);

			const loadingIndicator = screen.getByTestId(`${testId}--menu-wrapper--loading-indicator`);
			expect(loadingIndicator).toHaveAccessibleName(statusLabel);
		});
	},
);

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
ffTest.on(
	'platform-dst-top-layer',
	'onOpenChange callback — event parameter',
	() => {
		it('passes native event when trigger is clicked to open', () => {
			const onOpenChange = jest.fn();

			render(
				<DropdownMenu trigger={triggerText} testId={testId} onOpenChange={onOpenChange}>
					<DropdownItemGroup>
						<DropdownItem>Move</DropdownItem>
					</DropdownItemGroup>
				</DropdownMenu>,
			);

			fireEvent.click(screen.getByTestId(`${testId}--trigger`));

			expect(onOpenChange).toHaveBeenCalledWith(
				expect.objectContaining({ isOpen: true, event: expect.anything() }),
			);
		});

		it('passes null event when closed via onClose (Popover dismiss)', () => {
			const onOpenChange = jest.fn();

			render(
				<DropdownMenu trigger={triggerText} testId={testId} isOpen={true} onOpenChange={onOpenChange}>
					<DropdownItemGroup>
						<DropdownItem>Move</DropdownItem>
					</DropdownItemGroup>
				</DropdownMenu>,
			);

			const menuItems = screen.getAllByRole('menuitem');

			act(() => {
				menuItems[0].focus();
			});

			onOpenChange.mockClear();

			// Tab triggers close via useArrowNavigation → handleOnClose
			fireEvent.keyDown(menuItems[0], { key: 'Tab', code: 'Tab' });

			expect(onOpenChange).toHaveBeenCalledWith(
				expect.objectContaining({ isOpen: false, event: null }),
			);
		});
	},
);

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
ffTest.on(
	'platform-dst-top-layer',
	'Trigger aria-label via label prop',
	() => {
		it('renders aria-label on default trigger via label prop', () => {
			render(
				<DropdownMenu trigger={triggerText} testId={testId} label="more actions">
					<DropdownItemGroup>
						<DropdownItem>Move</DropdownItem>
					</DropdownItemGroup>
				</DropdownMenu>,
			);

			const trigger = screen.getByTestId(`${testId}--trigger`);
			expect(trigger).toHaveAttribute('aria-label', 'more actions');
		});

		it('does not render aria-label if label prop is absent', () => {
			render(
				<DropdownMenu trigger={triggerText} testId={testId}>
					<DropdownItemGroup>
						<DropdownItem>Move</DropdownItem>
					</DropdownItemGroup>
				</DropdownMenu>,
			);

			const trigger = screen.getByTestId(`${testId}--trigger`);
			// label prop not provided — aria-label should not be set
			// (The trigger text "Options" is used as visible label, not aria-label)
			expect(trigger).not.toHaveAttribute('aria-label');
		});
	},
);

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
ffTest.on('platform-dst-top-layer', 'WCAG 1.3.2 — DOM order (no portals)', () => {
	it('menu content is rendered in the component tree, not portalled to body', () => {
		const { container } = render(
			<DropdownMenu trigger={triggerText} testId={testId} isOpen={true}>
				<DropdownItemGroup>
					<DropdownItem>Move</DropdownItem>
				</DropdownItemGroup>
			</DropdownMenu>,
		);

		// The content should be inside the rendered container (no portal to body end)
		const content = screen.getByTestId(`${testId}--content`);
		expect(container).toContainElement(content);
	});

	it('trigger and content are siblings in DOM (logical reading order)', () => {
		render(
			<DropdownMenu trigger={triggerText} testId={testId} isOpen={true}>
				<DropdownItemGroup>
					<DropdownItem>Move</DropdownItem>
				</DropdownItemGroup>
			</DropdownMenu>,
		);

		const trigger = screen.getByTestId(`${testId}--trigger`);
		const content = screen.getByTestId(`${testId}--content`);

		// Content should come after trigger in document order
		const position = trigger.compareDocumentPosition(content);
		// DOCUMENT_POSITION_FOLLOWING = 4
		expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
	});
});
