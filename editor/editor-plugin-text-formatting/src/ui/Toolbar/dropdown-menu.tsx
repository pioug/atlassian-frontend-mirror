import React, { useCallback, useState } from 'react';

import type { WrappedComponentProps } from 'react-intl-next';

import { toolbarMessages } from '@atlaskit/editor-common/messages';
import { DropdownMenuWithKeyboardNavigation as DropdownMenu } from '@atlaskit/editor-common/ui-menu';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorMenuZIndex } from '@atlaskit/editor-shared-styles';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { DropdownToolbarButton } from './dropdown-toolbar-button';
import { useMenuState } from './hooks/menu-state';
import { MoreButton } from './more-button';
import { type MenuIconItem, type ToolbarType } from './types';

type DropdownMenuProps = {
	editorView: EditorView;
	isReducedSpacing: boolean;
	items: {
		items: MenuIconItem[];
	}[];
	moreButtonLabel: string;
	hasFormattingActive: boolean;
	popupsBoundariesElement?: HTMLElement;
	popupsMountPoint?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
	hasMoreButton: boolean;
	toolbarType: ToolbarType;
	isDisabled?: boolean;
} & WrappedComponentProps;

export const FormattingTextDropdownMenu = React.memo(
	({
		editorView,
		moreButtonLabel,
		isReducedSpacing,
		items,
		hasFormattingActive,
		popupsBoundariesElement,
		popupsMountPoint,
		popupsScrollableElement,
		hasMoreButton,
		intl,
		toolbarType,
		isDisabled,
	}: DropdownMenuProps) => {
		const [isMenuOpen, toggleMenu, closeMenu] = useMenuState();
		const [isOpenedByKeyboard, setIsOpenedByKeyboard] = useState(false);
		const onItemActivated = useCallback(
			({ item, shouldCloseMenu = true }: { item: MenuIconItem; shouldCloseMenu: boolean }) => {
				if (item) {
					item.command(editorView.state, editorView.dispatch);
					if (shouldCloseMenu) {
						closeMenu();
					}
				}
			},
			[editorView.state, editorView.dispatch, closeMenu],
		);

		const activeItem = items[0].items.find((item) => item.isActive);
		const defaultIcon = editorExperiment('platform_editor_controls', 'variant1')
			? items[0].items[0]?.elemBefore
			: undefined;
		const defaultIconName = items[0].items[0]?.value.name;
		const iconBefore = activeItem ? activeItem?.elemBefore : defaultIcon;
		const activeIconName = activeItem?.value.name || defaultIconName;

		return (
			<DropdownMenu
				mountTo={popupsMountPoint}
				onOpenChange={closeMenu}
				boundariesElement={popupsBoundariesElement}
				scrollableElement={popupsScrollableElement}
				onItemActivated={onItemActivated}
				isOpen={isMenuOpen}
				items={items}
				zIndex={akEditorMenuZIndex}
				fitHeight={188}
				fitWidth={editorExperiment('platform_editor_controls', 'control') ? 136 : 230}
				shouldUseDefaultRole
				section={{ hasSeparator: true }}
				shouldFocusFirstItem={() => {
					if (isOpenedByKeyboard) {
						setIsOpenedByKeyboard(false);
					}
					return isOpenedByKeyboard;
				}}
			>
				{hasMoreButton ? (
					<MoreButton
						isSelected={isMenuOpen || hasFormattingActive}
						label={moreButtonLabel}
						isReducedSpacing={isReducedSpacing}
						isDisabled={false}
						onClick={() => {
							toggleMenu();
							setIsOpenedByKeyboard(false);
						}}
						onKeyDown={(event: React.KeyboardEvent) => {
							if (event.key === 'Enter' || event.key === ' ') {
								event.preventDefault();
								toggleMenu();
								setIsOpenedByKeyboard(true);
							}
						}}
						aria-expanded={isMenuOpen}
					/>
				) : (
					<DropdownToolbarButton
						isReducedSpacing={isReducedSpacing}
						isDisabled={Boolean(isDisabled)}
						isSelected={isMenuOpen}
						label={intl.formatMessage(toolbarMessages.textFormat)}
						aria-expanded={isMenuOpen}
						aria-haspopup
						onClick={() => {
							toggleMenu();
							setIsOpenedByKeyboard(false);
						}}
						onKeyDown={(event: React.KeyboardEvent) => {
							if (event.key === 'Enter' || event.key === ' ') {
								event.preventDefault();
								toggleMenu();
								setIsOpenedByKeyboard(true);
							}
						}}
						toolbarType={toolbarType}
						iconBefore={iconBefore}
						activeIconName={activeIconName}
					/>
				)}
			</DropdownMenu>
		);
	},
);
