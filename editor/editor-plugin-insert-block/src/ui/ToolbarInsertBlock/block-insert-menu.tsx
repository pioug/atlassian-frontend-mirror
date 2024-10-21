import React from 'react';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { MenuItem } from '@atlaskit/editor-common/ui-menu';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { InsertBlockPlugin } from '../../index';
import type { OnInsert } from '../ElementBrowser/types';

import { BlockInsertElementBrowser } from './block-insert-element-browser';
import type { BlockMenuItem } from './create-items';
import { DropDownButton } from './dropdown-button';

export interface BlockInsertMenuProps {
	disabled: boolean;
	editorView: EditorView;
	items: BlockMenuItem[];
	label: string;
	open: boolean;
	plusButtonRef?: HTMLElement;
	popupsBoundariesElement?: HTMLElement;
	popupsMountPoint?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
	spacing: 'none' | 'default';
	showElementBrowserLink: boolean;
	onRef(el: HTMLElement): void;
	onPlusButtonRef(el: HTMLElement): void;
	onClick: React.MouseEventHandler;
	onItemActivated(attrs: { item: MenuItem }): void;
	onInsert: OnInsert;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onOpenChange(attrs: any): void;
	togglePlusMenuVisibility(): void;
	onKeyDown?: React.KeyboardEventHandler;
	pluginInjectionApi: ExtractInjectionAPI<InsertBlockPlugin> | undefined;
	isFullPageAppearance?: boolean;
}

export const BlockInsertMenu = (props: BlockInsertMenuProps) => {
	const { insertBlockState } = useSharedPluginState(props.pluginInjectionApi, ['insertBlock']);
	const isActive = insertBlockState?.menuBrowserOpen || false;

	if (props.items.length === 0) {
		return null;
	}

	if (props.disabled) {
		return (
			<div>
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
			</div>
		);
	}

	return (
		<BlockInsertElementBrowser
			disabled={props.disabled}
			editorView={props.editorView}
			items={props.items}
			label={props.label}
			onClick={props.onClick}
			onKeyDown={props.onKeyDown}
			onInsert={props.onInsert}
			onRef={props.onPlusButtonRef}
			open={props.open}
			plusButtonRef={props.plusButtonRef}
			popupsBoundariesElement={props.popupsBoundariesElement}
			popupsMountPoint={props.popupsMountPoint}
			popupsScrollableElement={props.popupsScrollableElement}
			spacing={props.spacing}
			togglePlusMenuVisibility={props.togglePlusMenuVisibility}
			showElementBrowserLink={props.showElementBrowserLink}
			pluginInjectionApi={props.pluginInjectionApi}
			isFullPageAppearance={props.isFullPageAppearance}
			isActive={isActive}
		/>
	);
};
