import React, { type RefObject, useRef, useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { DropdownItem } from '@atlaskit/dropdown-menu/dropdown-item';
import { DropdownItemCheckbox } from '@atlaskit/dropdown-menu/dropdown-item-checkbox';
import { DropdownItemCheckboxGroup } from '@atlaskit/dropdown-menu/dropdown-item-checkbox-group';
import { DropdownItemGroup } from '@atlaskit/dropdown-menu/dropdown-item-group';
import { DropdownMenu } from '@atlaskit/dropdown-menu/dropdown-menu';
import { Label } from '@atlaskit/form/label/default';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
import ButtonItem from '@atlaskit/menu/button-item';
import ModalBody from '@atlaskit/modal-dialog/modal-body';
import ModalDialog from '@atlaskit/modal-dialog/modal-dialog';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import Textfield from '@atlaskit/textfield/text-field';
import { token } from '@atlaskit/tokens';

type FocusReturnMenuProps = {
	menuId: string;
	returnFocusRef?: RefObject<HTMLElement>;
};

/**
 * A menu with a plain item, a nested menu (an item and a checkbox item) and an item that opens a
 * modal dialog.
 */
function FocusReturnMenu({ menuId, returnFocusRef }: FocusReturnMenuProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<>
			<DropdownMenu
				trigger="Actions"
				testId={menuId}
				shouldRenderToParent
				returnFocusRef={returnFocusRef}
			>
				<DropdownItemGroup>
					<DropdownItem>Move</DropdownItem>
					<DropdownMenu
						shouldRenderToParent
						placement="right-start"
						testId={`${menuId}-nested`}
						returnFocusRef={returnFocusRef}
						trigger={({ triggerRef, ...triggerProps }) => (
							<ButtonItem
								{...triggerProps}
								ref={triggerRef}
								role="menuitem"
								iconAfter={
									<ChevronRightIcon size="small" color={token('color.icon.subtle')} label="" />
								}
							>
								More
							</ButtonItem>
						)}
					>
						<DropdownItemGroup>
							<DropdownItem>Nested item</DropdownItem>
						</DropdownItemGroup>
						<DropdownItemCheckboxGroup id={`${menuId}-nested-options`}>
							<DropdownItemCheckbox id={`${menuId}-nested-option`}>
								Nested option
							</DropdownItemCheckbox>
						</DropdownItemCheckboxGroup>
					</DropdownMenu>
					<DropdownItem returnFocusRef={returnFocusRef} onClick={() => setIsModalOpen(true)}>
						Open modal
					</DropdownItem>
				</DropdownItemGroup>
			</DropdownMenu>
			{isModalOpen && (
				<ModalDialog testId={`${menuId}-modal`} onClose={() => setIsModalOpen(false)}>
					<ModalHeader hasCloseButton>
						<ModalTitle>Modal</ModalTitle>
					</ModalHeader>
					<ModalBody>
						<Button onClick={() => setIsModalOpen(false)}>Close modal</Button>
					</ModalBody>
				</ModalDialog>
			)}
		</>
	);
}

/**
 * Test fixture: where focus goes when a menu closes.
 *
 * The two menus are the same, except that `menu-with-ref` also sets `returnFocusRef` on the menu,
 * on its nested menu and on its "Open modal" item. All of them point at the "Return focus target"
 * button. On the top-layer path `returnFocusRef` is a no-op, so both menus must move focus to the
 * same places.
 */
export default function TestingFocusReturn(): React.JSX.Element {
	const returnFocusTargetRef = useRef<HTMLButtonElement>(null);

	return (
		<Stack space="space.200">
			<Inline space="space.100" alignBlock="center">
				<Button testId="menu-before">Before</Button>
				<FocusReturnMenu menuId="menu" />
				<Button testId="menu-after">After</Button>
			</Inline>
			<Inline space="space.100" alignBlock="center">
				<Button testId="menu-with-ref-before">Before</Button>
				<FocusReturnMenu menuId="menu-with-ref" returnFocusRef={returnFocusTargetRef} />
				<Button testId="menu-with-ref-after">After</Button>
			</Inline>
			<Button testId="outside-button">Outside button</Button>
			<Stack>
				<Label htmlFor="outside-input">Outside input</Label>
				<Textfield id="outside-input" testId="outside-input" />
			</Stack>
			<Box testId="outside-text">Text that cannot take focus</Box>
			<Button testId="return-focus-target" ref={returnFocusTargetRef}>
				Return focus target
			</Button>
		</Stack>
	);
}
