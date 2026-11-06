import React, { createContext, type ReactNode, useContext, useState } from 'react';
import { flushSync } from 'react-dom';

import { Label } from '@atlaskit/form/label/default';
import { components } from '@atlaskit/react-select/components';
import { type MenuProps } from '@atlaskit/react-select/menu';
import Select from '@atlaskit/react-select/state-manager';

type TOption = { label: string; value: string };

// No options, as in DatePicker: with a focused option, Enter in the menu would select it.
const options: TOption[] = [];

type TMenuActions = { close: () => void; closeAndReopen: () => void };

const MenuActionsContext = createContext<TMenuActions>({
	close: () => {},
	closeAndReopen: () => {},
});

// A menu with focusable content instead of options, as DatePicker's calendar is.
function MenuWithButtons(props: MenuProps<TOption, false>) {
	const { close, closeAndReopen } = useContext(MenuActionsContext);
	return (
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		<components.Menu {...props}>
			<button type="button" data-testid={`${props.selectProps.testId}-close`} onClick={close}>
				Close menu
			</button>
			<button
				type="button"
				data-testid={`${props.selectProps.testId}-close-and-reopen`}
				onClick={closeAndReopen}
			>
				Close and reopen
			</button>
		</components.Menu>
	);
}

function useMenuActions(): TMenuActions & { menuIsOpen: boolean; open: () => void } {
	const [menuIsOpen, setMenuIsOpen] = useState(false);
	return {
		menuIsOpen,
		open: () => setMenuIsOpen(true),
		close: () => setMenuIsOpen(false),
		closeAndReopen: () => {
			// Commit the close, so the menu's popover hides, then reopen it in the same task.
			flushSync(() => setMenuIsOpen(false));
			setMenuIsOpen(true);
		},
	};
}

/**
 * The menu opens from a separate button, so focus moves into the menu without blurring the
 * Select input. Escape and an outside press close it.
 */
function OpenFromButton() {
	const actions = useMenuActions();
	return (
		<MenuActionsContext.Provider value={actions}>
			<button type="button" data-testid="opener" onClick={actions.open}>
				Open menu
			</button>
			<Label htmlFor="from-button-select">From a button</Label>
			<Select
				inputId="from-button-select"
				testId="from-button"
				options={options}
				menuIsOpen={actions.menuIsOpen}
				onMenuOpen={actions.open}
				onMenuClose={actions.close}
				components={{ Menu: MenuWithButtons }}
			/>
		</MenuActionsContext.Provider>
	);
}

/**
 * Focus on the input opens the menu. Moving focus into the menu blurs the input, which asks to
 * close the menu, so only "Close menu" closes it here.
 */
function OpenMenuOnFocus() {
	const actions = useMenuActions();
	return (
		<MenuActionsContext.Provider value={actions}>
			<Label htmlFor="open-on-focus-select">Opens on focus</Label>
			<Select
				inputId="open-on-focus-select"
				testId="open-on-focus"
				options={options}
				openMenuOnFocus
				menuIsOpen={actions.menuIsOpen}
				onMenuOpen={actions.open}
				onMenuClose={() => {}}
				components={{ Menu: MenuWithButtons }}
			/>
		</MenuActionsContext.Provider>
	);
}

/**
 * Test fixture for returning focus when a top-layer Select menu with focusable content closes.
 * Use with `platform-dst-top-layer` on.
 */
export default function TestingTopLayerMenuFocusReturn(): ReactNode {
	return (
		<div>
			<button
				type="button"
				data-testid="press-without-focus"
				// Stands in for an element that keeps focus where it is on press.
				onMouseDown={(event) => event.preventDefault()}
			>
				Press without focus
			</button>
			<OpenFromButton />
			<OpenMenuOnFocus />
		</div>
	);
}
