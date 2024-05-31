import React from 'react';

import { DropdownMenuWithKeyboardNavigation as DropdownMenu } from '@atlaskit/editor-common/ui-menu';
import type { MenuItem } from '@atlaskit/editor-common/ui-menu';
import { akEditorMenuZIndex } from '@atlaskit/editor-shared-styles';

import type { BlockMenuItem } from './create-items';
import { DropDownButton } from './dropdown-button';

export interface BlockInsertMenuLegacyProps {
	disabled: boolean;
	spacing: 'none' | 'default';
	label: string;
	open: boolean;
	items: BlockMenuItem[];
	popupsMountPoint?: HTMLElement;
	popupsBoundariesElement?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
	onClick: React.MouseEventHandler;
	onKeyDown?: React.KeyboardEventHandler;
	onRef(el: HTMLElement): void;
	onItemActivated(attrs: { item: MenuItem }): void;
	// We should follow-up and type this properly in editor-common first
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onOpenChange(attrs: any): void;
}

export const BlockInsertMenuLegacy = (props: BlockInsertMenuLegacyProps) => {
	const { items } = props;
	const dropdownItems = React.useMemo(() => [{ items }], [items]);

	return (
		<DropdownMenu
			items={dropdownItems}
			onItemActivated={props.onItemActivated}
			onOpenChange={props.onOpenChange}
			mountTo={props.popupsMountPoint}
			boundariesElement={props.popupsBoundariesElement}
			scrollableElement={props.popupsScrollableElement}
			isOpen={props.open}
			fitHeight={188}
			fitWidth={175}
			zIndex={akEditorMenuZIndex}
		>
			<DropDownButton
				aria-expanded={props.open}
				aria-haspopup
				handleRef={props.onRef}
				selected={props.open}
				disabled={props.disabled}
				onClick={props.onClick}
				onKeyDown={props.onKeyDown}
				spacing={props.spacing}
				label={props.label}
				aria-keyshortcuts="/"
			/>
		</DropdownMenu>
	);
};
