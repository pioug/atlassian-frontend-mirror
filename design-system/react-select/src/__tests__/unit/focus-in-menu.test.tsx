import React, { createContext, type ReactNode, type Ref, useContext, useState } from 'react';

import { skipA11yAudit } from '@af/accessibility-testing/skip-a11y-audit';
import Checkbox from '@atlaskit/checkbox/checkbox';
import __noop from '@atlaskit/ds-lib/noop';
import ModalBody from '@atlaskit/modal-dialog/modal-body';
import ModalDialog from '@atlaskit/modal-dialog/modal-dialog';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { screen } from '@atlassian/testing-library/screen';
import { act, fireEvent, render, waitFor } from '@atlassian/testing-library/testing-library/react';
import { userEvent } from '@atlassian/testing-library/user-event';
import { within } from '@atlassian/testing-library/within';

import { components } from '../../components';
import type { MenuProps } from '../../components/menu';
import type { MenuListProps } from '../../components/menu-list';
import type BaseSelect from '../../select';
import Select from '../../state-manager';
import type { GroupBase } from '../../types';

// Top layer: the input and its in-place menu are one field for focus.

interface Fruit {
	label: string;
	value: string;
}

const fruits: Fruit[] = [
	{ label: 'Apple', value: 'apple' },
	{ label: 'Banana', value: 'banana' },
	{ label: 'Cherry', value: 'cherry' },
];

// Content above the list, as in a menu with a "Show done items" checkbox.
const MenuWithButtons = (props: MenuProps<Fruit, false>) => (
	// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props -- custom react-select component
	<components.Menu {...props}>
		<button type="button">Edit fruit</button>
		<button type="button">Create fruit</button>
		{props.children}
	</components.Menu>
);

const ShowEditContext = createContext(true);

// The "Edit fruit" button can go while it has focus.
const MenuWithOptionalEdit = (props: MenuProps<Fruit, false>) => {
	const showEdit = useContext(ShowEditContext);
	return (
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props -- custom react-select component
		<components.Menu {...props}>
			{showEdit && <button type="button">Edit fruit</button>}
			<button type="button">Create fruit</button>
			{props.children}
		</components.Menu>
	);
};

type FieldProps = Pick<
	React.ComponentProps<typeof Select<Fruit, false>>,
	| 'components'
	| 'menuIsOpen'
	| 'onBlur'
	| 'onChange'
	| 'onFocus'
	| 'onMenuClose'
	| 'onMenuOpen'
	| 'options'
	| 'tabSelectsValue'
> & {
	selectRef?: Ref<BaseSelect<Fruit, false, GroupBase<Fruit>>>;
};

function Field({
	components: customComponents = { Menu: MenuWithButtons },
	menuIsOpen,
	onBlur,
	onChange,
	onFocus,
	onMenuClose,
	onMenuOpen,
	options = fruits,
	selectRef,
	// `@atlaskit/select` turns this off. When on, Tab with an open menu selects an option.
	tabSelectsValue = false,
}: FieldProps) {
	return (
		<>
			<button type="button">Before</button>
			<Select<Fruit, false>
				ref={selectRef}
				aria-label="Fruit"
				options={options}
				components={customComponents}
				menuIsOpen={menuIsOpen}
				onBlur={onBlur}
				onChange={onChange}
				onFocus={onFocus}
				onMenuClose={onMenuClose}
				onMenuOpen={onMenuOpen}
				tabSelectsValue={tabSelectsValue}
			/>
			<button type="button">After</button>
		</>
	);
}

function InModal({ children }: { children: ReactNode }) {
	return (
		<ModalDialog onClose={__noop}>
			<ModalHeader hasCloseButton>
				<ModalTitle>Fruit</ModalTitle>
			</ModalHeader>
			<ModalBody>{children}</ModalBody>
		</ModalDialog>
	);
}

const getInput = () => screen.getByRole('combobox', { name: 'Fruit' });
const getButton = (name: string) => screen.getByRole('button', { name });
const queryListbox = () => screen.queryByRole('listbox');

function focusInput() {
	act(() => {
		getInput().focus();
	});
}

function expectFocusedOption(name: string) {
	expect(getInput()).toHaveAttribute(
		'aria-activedescendant',
		screen.getByRole('option', { name }).id,
	);
}

describe('focus in the in-place menu (top-layer path)', () => {
	beforeEach(() => {
		passGate('platform-dst-top-layer');
	});

	it('is accessible with focus on content in the menu', async () => {
		const user = userEvent.setup();
		const { container } = render(<Field />);
		focusInput();
		await user.keyboard('{ArrowDown}');
		await user.tab();
		expect(getButton('Edit fruit')).toHaveFocus();

		await expect(container).toBeAccessible();
	});

	describe.each([
		['outside a modal', false],
		['inside a modal', true],
	])('%s', (_context, isInModal) => {
		const renderField = (props: FieldProps = {}) => {
			const field = <Field {...props} />;
			return render(isInModal ? <InModal>{field}</InModal> : field);
		};

		it('keeps the menu open and the field focused when Tab moves focus into the menu', async () => {
			const user = userEvent.setup();
			const onBlur = jest.fn();
			const onMenuClose = jest.fn();
			renderField({ onBlur, onMenuClose });
			focusInput();
			await user.keyboard('a');

			await user.tab();

			expect(getButton('Edit fruit')).toHaveFocus();
			expect(queryListbox()).toBeInTheDocument();
			expect(getInput()).toHaveValue('a');
			expect(onBlur).not.toHaveBeenCalled();
			expect(onMenuClose).not.toHaveBeenCalled();
		});

		it('keeps the field focused when focus moves between content in the menu', async () => {
			const user = userEvent.setup();
			const onBlur = jest.fn();
			renderField({ onBlur });
			focusInput();
			await user.keyboard('{ArrowDown}');

			await user.tab();
			await user.tab();

			expect(getButton('Create fruit')).toHaveFocus();
			expect(queryListbox()).toBeInTheDocument();
			expect(onBlur).not.toHaveBeenCalled();
		});

		it('closes the menu and blurs the field when Tab moves focus out of the menu', async () => {
			const user = userEvent.setup();
			const onBlur = jest.fn();
			const onMenuClose = jest.fn();
			renderField({ onBlur, onMenuClose });
			focusInput();
			await user.keyboard('a');
			await user.tab();
			await user.tab();

			await user.tab();

			expect(getButton('After')).toHaveFocus();
			expect(queryListbox()).not.toBeInTheDocument();
			expect(getInput()).toHaveValue('');
			expect(onBlur).toHaveBeenCalledTimes(1);
			expect(onMenuClose).toHaveBeenCalledTimes(1);
		});

		it('does not call onFocus again when Shift+Tab moves focus back to the input', async () => {
			const user = userEvent.setup();
			const onFocus = jest.fn();
			const onBlur = jest.fn();
			renderField({ onFocus, onBlur });
			focusInput();
			await user.keyboard('{ArrowDown}');
			await user.tab();

			await user.tab({ shift: true });

			expect(getInput()).toHaveFocus();
			expect(queryListbox()).toBeInTheDocument();
			expect(onFocus).toHaveBeenCalledTimes(1);
			expect(onBlur).not.toHaveBeenCalled();
		});

		it.each([
			['{ArrowDown}', 'Cherry'],
			['{ArrowUp}', 'Apple'],
			['{Home}', 'Apple'],
			['{End}', 'Cherry'],
			['{PageUp}', 'Apple'],
			['{PageDown}', 'Cherry'],
		])(
			'focuses the input and moves the focused option when %s is pressed in the menu',
			async (key, expectedOption) => {
				const user = userEvent.setup();
				renderField();
				focusInput();
				await user.keyboard('{ArrowDown}{ArrowDown}');
				expectFocusedOption('Banana');
				await user.tab();
				expect(getButton('Edit fruit')).toHaveFocus();

				await user.keyboard(key);

				expect(getInput()).toHaveFocus();
				expectFocusedOption(expectedOption);
			},
		);

		it('returns focus to the input when Escape closes the menu with focus in it', async () => {
			const user = userEvent.setup();
			const onBlur = jest.fn();
			const onFocus = jest.fn();
			renderField({ onBlur, onFocus });
			focusInput();
			await user.keyboard('{ArrowDown}');
			await user.tab();

			await user.keyboard('{Escape}');

			expect(queryListbox()).not.toBeInTheDocument();
			expect(getInput()).toHaveFocus();
			expect(onBlur).not.toHaveBeenCalled();
			expect(onFocus).toHaveBeenCalledTimes(1);
		});

		it('does not select an option on Tab from content in the menu, with tabSelectsValue', async () => {
			const user = userEvent.setup();
			const onChange = jest.fn();
			renderField({ onChange, tabSelectsValue: true });
			focusInput();
			await user.keyboard('{ArrowDown}');
			act(() => {
				getButton('Edit fruit').focus();
			});

			await user.tab();

			expect(getButton('Create fruit')).toHaveFocus();
			expect(queryListbox()).toBeInTheDocument();
			expect(onChange).not.toHaveBeenCalled();
		});

		it('calls onMenuClose for a controlled menu when focus leaves the menu', async () => {
			const user = userEvent.setup();
			const onMenuClose = jest.fn();
			const ControlledField = () => {
				const [isOpen, setIsOpen] = useState(false);
				return (
					<Field
						menuIsOpen={isOpen}
						onMenuOpen={() => setIsOpen(true)}
						onMenuClose={() => {
							onMenuClose();
							setIsOpen(false);
						}}
					/>
				);
			};
			render(
				isInModal ? (
					<InModal>
						<ControlledField />
					</InModal>
				) : (
					<ControlledField />
				),
			);
			focusInput();
			await user.keyboard('{ArrowDown}');

			await user.tab();
			expect(getButton('Edit fruit')).toHaveFocus();
			expect(queryListbox()).toBeInTheDocument();
			expect(onMenuClose).not.toHaveBeenCalled();

			await user.tab();
			await user.tab();
			expect(getButton('After')).toHaveFocus();
			expect(onMenuClose).toHaveBeenCalledTimes(1);
			expect(queryListbox()).not.toBeInTheDocument();
		});
	});

	it('moves the focused option from content in the listbox', async () => {
		// A button in the listbox fails `aria-required-children`; not under test.
		skipA11yAudit();
		const user = userEvent.setup();
		const MenuList = (props: MenuListProps<Fruit, false>) => (
			// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props -- custom react-select component
			<components.MenuList {...props}>
				{props.children}
				<button type="button">Create fruit</button>
			</components.MenuList>
		);
		render(<Field components={{ MenuList }} />);
		focusInput();
		await user.keyboard('{ArrowDown}');
		await user.tab();
		expect(getButton('Create fruit')).toHaveFocus();
		expect(queryListbox()).toBeInTheDocument();

		await user.keyboard('{ArrowDown}');

		expect(getInput()).toHaveFocus();
		expectFocusedOption('Banana');
	});

	it('leaves focus in the menu for a key that the content uses', async () => {
		const user = userEvent.setup();
		const Menu = (props: MenuProps<Fruit, false>) => (
			// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props -- custom react-select component
			<components.Menu {...props}>
				<button
					type="button"
					onKeyDown={(event) => {
						if (event.key === 'ArrowDown') {
							event.preventDefault();
						}
					}}
				>
					Pick a fruit
				</button>
				{props.children}
			</components.Menu>
		);
		render(<Field components={{ Menu }} />);
		focusInput();
		await user.keyboard('{ArrowDown}');
		await user.tab();

		await user.keyboard('{ArrowDown}');

		expect(getButton('Pick a fruit')).toHaveFocus();
		expectFocusedOption('Apple');
	});

	it('leaves focus in the menu when there is no option to move to', async () => {
		const user = userEvent.setup();
		render(<Field options={[]} />);
		focusInput();
		await user.keyboard('{ArrowDown}');
		await user.tab();

		await user.keyboard('{ArrowDown}');

		expect(getButton('Edit fruit')).toHaveFocus();
	});

	it('leaves keys in a layer nested in the menu to that layer', async () => {
		const user = userEvent.setup();
		const Menu = (props: MenuProps<Fruit, false>) => (
			// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props -- custom react-select component
			<components.Menu {...props}>
				<div
					ref={(element) => {
						// The React types here do not know the `popover` attribute.
						element?.setAttribute('popover', 'manual');
						element?.showPopover();
					}}
				>
					<button type="button" onClick={onNestedClick}>
						Nested
					</button>
				</div>
				{props.children}
			</components.Menu>
		);
		const onBlur = jest.fn();
		const onChange = jest.fn();
		const onNestedClick = jest.fn();
		render(<Field components={{ Menu }} onBlur={onBlur} onChange={onChange} />);
		focusInput();
		await user.keyboard('{ArrowDown}');
		act(() => {
			getButton('Nested').focus();
		});
		expect(getButton('Nested')).toHaveFocus();
		expect(onBlur).not.toHaveBeenCalled();

		await user.keyboard('{ArrowDown}');

		expect(getButton('Nested')).toHaveFocus();
		expectFocusedOption('Apple');

		await user.keyboard('{Enter}');

		expect(onNestedClick).toHaveBeenCalledTimes(1);
		expect(onChange).not.toHaveBeenCalled();
		expect(queryListbox()).toBeInTheDocument();
	});

	it.each([
		['Enter', '{Enter}'],
		['Space', ' '],
	])('activates a button in the menu on %s, and does not select an option', async (_name, key) => {
		const user = userEvent.setup();
		const onCreate = jest.fn();
		const onChange = jest.fn();
		const Menu = (props: MenuProps<Fruit, false>) => (
			// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props -- custom react-select component
			<components.Menu {...props}>
				<button type="button" onClick={onCreate}>
					Create fruit
				</button>
				{props.children}
			</components.Menu>
		);
		render(<Field components={{ Menu }} onChange={onChange} />);
		focusInput();
		await user.keyboard('{ArrowDown}');
		await user.tab();
		expect(getButton('Create fruit')).toHaveFocus();

		await user.keyboard(key);

		expect(onCreate).toHaveBeenCalledTimes(1);
		expect(onChange).not.toHaveBeenCalled();
		expect(getButton('Create fruit')).toHaveFocus();
	});

	describe('a text field in the menu', () => {
		const MenuWithFilter = (props: MenuProps<Fruit, false>) => (
			// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props -- custom react-select component
			<components.Menu {...props}>
				<input aria-label="Filter" />
				{props.children}
			</components.Menu>
		);
		const getFilter = () => screen.getByRole('textbox', { name: 'Filter' });

		it('types a space, and does not select an option', async () => {
			const user = userEvent.setup();
			const onChange = jest.fn();
			render(<Field components={{ Menu: MenuWithFilter }} onChange={onChange} />);
			focusInput();
			await user.keyboard('{ArrowDown}');
			await user.tab();
			expect(getFilter()).toHaveFocus();

			await user.keyboard('a b');

			expect(getFilter()).toHaveValue('a b');
			expect(onChange).not.toHaveBeenCalled();
			expect(queryListbox()).toBeInTheDocument();
		});

		it.each(['{Home}', '{End}', '{ArrowUp}', '{ArrowDown}', '{PageUp}', '{PageDown}'])(
			'leaves %s to the field',
			async (key) => {
				const user = userEvent.setup();
				render(<Field components={{ Menu: MenuWithFilter }} />);
				focusInput();
				await user.keyboard('{ArrowDown}');
				await user.tab();
				await user.keyboard('ab');

				await user.keyboard(key);

				expect(getFilter()).toHaveFocus();
				expectFocusedOption('Apple');
			},
		);
	});

	// As in jira's field-parent menu ("Show everything marked as done").
	it('moves the focused option from a checkbox in the menu', async () => {
		const user = userEvent.setup();
		const Menu = (props: MenuProps<Fruit, false>) => (
			// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props -- custom react-select component
			<components.Menu {...props}>
				<Checkbox label="Show sold out fruit" />
				{props.children}
			</components.Menu>
		);
		render(<Field components={{ Menu }} />);
		focusInput();
		await user.keyboard('{ArrowDown}');
		await user.tab();
		expect(screen.getByRole('checkbox', { name: 'Show sold out fruit' })).toHaveFocus();

		await user.keyboard('{ArrowDown}');

		expect(getInput()).toHaveFocus();
		expectFocusedOption('Banana');
	});

	it('blurs the field when the focused content in the menu is removed and focus moves on', async () => {
		const user = userEvent.setup();
		const onBlur = jest.fn();
		const onFocus = jest.fn();
		const renderOptionalEditField = (showEdit: boolean) => (
			<ShowEditContext.Provider value={showEdit}>
				<Field components={{ Menu: MenuWithOptionalEdit }} onBlur={onBlur} onFocus={onFocus} />
			</ShowEditContext.Provider>
		);
		const { rerender } = render(renderOptionalEditField(true));
		focusInput();
		await user.keyboard('{ArrowDown}');
		await user.tab();
		expect(getButton('Edit fruit')).toHaveFocus();

		// The focused button goes, so focus falls to `<body>` with no blur event.
		rerender(renderOptionalEditField(false));
		act(() => {
			getButton('After').focus();
		});
		expect(onBlur).not.toHaveBeenCalled();
		await user.keyboard('{Escape}');

		expect(queryListbox()).not.toBeInTheDocument();
		expect(getButton('After')).toHaveFocus();
		expect(onBlur).toHaveBeenCalledTimes(1);

		await user.tab({ shift: true });

		expect(getInput()).toHaveFocus();
		expect(onFocus).toHaveBeenCalledTimes(2);
	});

	it('keeps the field focused when focus in the closing menu falls to <body>', async () => {
		const user = userEvent.setup();
		const onBlur = jest.fn();
		const onFocus = jest.fn();
		const { rerender } = render(<Field menuIsOpen onBlur={onBlur} onFocus={onFocus} />);
		focusInput();
		await user.tab();
		const editButton = getButton('Edit fruit');
		expect(editButton).toHaveFocus();

		rerender(<Field menuIsOpen={false} onBlur={onBlur} onFocus={onFocus} />);
		// As a browser does when the focused element hides.
		act(() => {
			editButton.blur();
		});

		expect(getInput()).toHaveFocus();
		expect(onBlur).not.toHaveBeenCalled();
		expect(onFocus).toHaveBeenCalledTimes(1);
	});

	it('returns focus to the input when the closed menu unmounts with focus in it', async () => {
		const user = userEvent.setup();
		const onBlur = jest.fn();
		const onFocus = jest.fn();
		// Open on mount, so the menu's popover has no element to return focus to.
		const { rerender } = render(<Field menuIsOpen onBlur={onBlur} onFocus={onFocus} />);
		focusInput();
		await user.tab();
		expect(getButton('Edit fruit')).toHaveFocus();

		rerender(<Field menuIsOpen={false} onBlur={onBlur} onFocus={onFocus} />);
		await waitFor(() =>
			expect(screen.queryByRole('listbox', { hidden: true })).not.toBeInTheDocument(),
		);

		expect(getInput()).toHaveFocus();
		expect(onBlur).not.toHaveBeenCalled();
		expect(onFocus).toHaveBeenCalledTimes(1);
	});

	it('blurs the field on blur() with focus in the menu', async () => {
		const user = userEvent.setup();
		const onBlur = jest.fn();
		const selectRef = React.createRef<BaseSelect<Fruit, false, GroupBase<Fruit>>>();
		render(<Field onBlur={onBlur} selectRef={selectRef} />);
		focusInput();
		await user.keyboard('{ArrowDown}');
		await user.tab();
		const editButton = getButton('Edit fruit');
		expect(editButton).toHaveFocus();

		act(() => {
			selectRef.current?.blur();
		});

		expect(editButton).not.toHaveFocus();
		expect(getInput()).not.toHaveFocus();
		expect(onBlur).toHaveBeenCalledTimes(1);
		await waitFor(() => expect(queryListbox()).not.toBeInTheDocument());
	});

	it.each([
		['text', () => screen.getByText('Outside text')],
		['a button', () => getButton('After')],
	])(
		'does not take focus back to the input after a press on %s outside',
		async (_target, getTarget) => {
			const user = userEvent.setup();
			const onBlur = jest.fn();
			render(
				<>
					<Field onBlur={onBlur} />
					<p>Outside text</p>
				</>,
			);
			focusInput();
			await user.keyboard('{ArrowDown}');
			await user.tab();
			expect(getButton('Edit fruit')).toHaveFocus();

			await user.click(getTarget());

			expect(getInput()).not.toHaveFocus();
			expect(queryListbox()).not.toBeInTheDocument();
			expect(onBlur).toHaveBeenCalledTimes(1);
		},
	);

	it('keeps the field focused when the menu closes in a shadow root', async () => {
		const user = userEvent.setup();
		const host = document.createElement('div');
		document.body.appendChild(host);
		const shadowRoot = host.attachShadow({ mode: 'open' });
		const container = document.createElement('div');
		shadowRoot.appendChild(container);
		const onBlur = jest.fn();
		const onChange = jest.fn();
		const onMenuClose = jest.fn();
		render(
			<Select<Fruit, false>
				aria-label="Fruit"
				options={fruits}
				onBlur={onBlur}
				onChange={onChange}
				onMenuClose={onMenuClose}
				// Keep focus in the input after the pick, as on a device without touch.
				blurInputOnSelect={false}
			/>,
			{ container },
		);
		const input = within(container).getByRole('combobox', { name: 'Fruit' });
		// eslint-disable-next-line testing-library/no-node-access -- focus inside a shadow root
		const getShadowFocus = () => shadowRoot.activeElement;
		act(() => {
			input.focus();
		});
		expect(getShadowFocus()).toBe(input);
		await user.keyboard('{ArrowDown}');
		expect(within(container).getByRole('listbox')).toBeInTheDocument();

		await user.keyboard('{Enter}');

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(within(container).queryByRole('listbox')).not.toBeInTheDocument();
		expect(getShadowFocus()).toBe(input);
		expect(onBlur).not.toHaveBeenCalled();
		expect(onMenuClose).toHaveBeenCalledTimes(1);
		host.remove();
	});

	it('selects the focused option on Enter with focus on its own listbox', async () => {
		const user = userEvent.setup();
		const onChange = jest.fn();
		render(<Field onChange={onChange} />);
		focusInput();
		await user.keyboard('{ArrowDown}');
		act(() => {
			screen.getByRole('listbox').focus();
		});

		await user.keyboard('{Enter}');

		expect(onChange).toHaveBeenCalledWith(fruits[0], expect.anything());
	});

	it('does not blur the input on a tap on content in the menu', async () => {
		const user = userEvent.setup();
		const onBlur = jest.fn();
		render(<Field onBlur={onBlur} />);
		focusInput();
		await user.keyboard('{ArrowDown}');

		fireEvent.touchEnd(getButton('Edit fruit'));

		expect(getInput()).toHaveFocus();
		expect(onBlur).not.toHaveBeenCalled();
	});
});

describe('focus in the menu (legacy path)', () => {
	beforeEach(() => {
		failGate('platform-dst-top-layer');
	});

	it('is accessible with the menu open', async () => {
		const { container } = render(<Field menuIsOpen />);

		await expect(container).toBeAccessible();
	});

	it('blurs the field and closes the menu when Tab moves focus into the menu', async () => {
		const user = userEvent.setup();
		const onBlur = jest.fn();
		const onMenuClose = jest.fn();
		render(<Field onBlur={onBlur} onMenuClose={onMenuClose} />);
		focusInput();
		await user.keyboard('{ArrowDown}');

		await user.tab();

		expect(onBlur).toHaveBeenCalledTimes(1);
		expect(onMenuClose).toHaveBeenCalledTimes(1);
		expect(queryListbox()).not.toBeInTheDocument();
	});

	it('calls onFocus again when focus moves back to the input from the menu', async () => {
		const user = userEvent.setup();
		const onFocus = jest.fn();
		render(<Field menuIsOpen onFocus={onFocus} />);
		focusInput();
		await user.tab();
		expect(getButton('Edit fruit')).toHaveFocus();

		await user.tab({ shift: true });

		expect(getInput()).toHaveFocus();
		expect(onFocus).toHaveBeenCalledTimes(2);
	});

	it('leaves focus in the menu when ArrowDown is pressed there', async () => {
		const user = userEvent.setup();
		render(<Field menuIsOpen />);
		focusInput();
		await user.tab();

		await user.keyboard('{ArrowDown}');

		expect(getButton('Edit fruit')).toHaveFocus();
	});

	it('blurs the input on a tap on content in the menu outside the list', async () => {
		const user = userEvent.setup();
		const onBlur = jest.fn();
		render(<Field onBlur={onBlur} />);
		focusInput();
		await user.keyboard('{ArrowDown}');

		fireEvent.touchEnd(getButton('Edit fruit'));

		expect(onBlur).toHaveBeenCalledTimes(1);
	});
});
