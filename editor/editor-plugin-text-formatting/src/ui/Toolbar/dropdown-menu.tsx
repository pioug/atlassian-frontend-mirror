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
import { type MenuIconItem, ToolbarType } from './types';

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
						isDisabled={false}
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
						iconBefore={activeItem ? activeItem?.elemBefore : undefined}
					/>
				)}
			</DropdownMenu>
		);
	},
);
