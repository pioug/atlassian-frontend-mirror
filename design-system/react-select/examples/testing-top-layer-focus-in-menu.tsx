import React, { createContext, type ReactNode, useContext, useState } from 'react';

import { Label } from '@atlaskit/form/label/default';
import ModalBody from '@atlaskit/modal-dialog/modal-body';
import Modal from '@atlaskit/modal-dialog/modal-dialog';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import { components } from '@atlaskit/react-select/components';
import { type MenuProps } from '@atlaskit/react-select/menu';
import Select from '@atlaskit/react-select/state-manager';

type TOption = { label: string; value: string };

const options: TOption[] = [
	{ label: 'Apple', value: 'apple' },
	{ label: 'Banana', value: 'banana' },
];

const CloseMenuContext = createContext<() => void>(() => {});

// Focusable content above the list, as in a menu with inline buttons.
function MenuWithButtons(props: MenuProps<TOption, false>) {
	const closeMenu = useContext(CloseMenuContext);
	const [presses, setPresses] = useState(0);
	return (
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props -- custom react-select component
		<components.Menu {...props}>
			<button type="button" onClick={() => setPresses((count) => count + 1)}>
				Edit fruit ({presses})
			</button>
			<button type="button" onClick={closeMenu}>
				Close menu
			</button>
			{props.children}
		</components.Menu>
	);
}

/**
 * Test fixture: a top-layer Select in a modal, with focusable content in its menu.
 * Use with `platform-dst-top-layer` on.
 */
export default function TestingTopLayerFocusInMenu(): ReactNode {
	const [menuIsOpen, setMenuIsOpen] = useState(false);
	const [focusCount, setFocusCount] = useState(0);
	const [blurCount, setBlurCount] = useState(0);
	const [isModalClosed, setIsModalClosed] = useState(false);
	return (
		<CloseMenuContext.Provider value={() => setMenuIsOpen(false)}>
			<p data-testid="counts">
				focus {focusCount}, blur {blurCount}, modal {isModalClosed ? 'closed' : 'open'}
			</p>
			{!isModalClosed && (
				<Modal onClose={() => setIsModalClosed(true)}>
					<ModalHeader hasCloseButton>
						<ModalTitle>Fruit</ModalTitle>
					</ModalHeader>
					<ModalBody>
						<button type="button">Before</button>
						<Label htmlFor="fruit">Fruit</Label>
						<Select
							inputId="fruit"
							options={options}
							menuIsOpen={menuIsOpen}
							onMenuOpen={() => setMenuIsOpen(true)}
							onMenuClose={() => setMenuIsOpen(false)}
							onFocus={() => setFocusCount((count) => count + 1)}
							onBlur={() => setBlurCount((count) => count + 1)}
							tabSelectsValue={false}
							components={{ Menu: MenuWithButtons }}
						/>
						<button type="button">After</button>
					</ModalBody>
				</Modal>
			)}
		</CloseMenuContext.Provider>
	);
}
