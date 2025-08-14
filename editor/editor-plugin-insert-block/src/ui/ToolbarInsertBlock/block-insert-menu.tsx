import React from 'react';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { MenuItem } from '@atlaskit/editor-common/ui-menu';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';

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
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	onRef(el: HTMLElement): void;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	onPlusButtonRef(el: HTMLElement): void;
	onClick: React.MouseEventHandler;
	onItemActivated?: (attrs: { item: MenuItem }) => void; // Remove when platform_editor_remove_unused_block_insert_props is cleaned up
	onInsert: OnInsert;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onOpenChange?: (attrs: any) => void; // Remove when platform_editor_remove_unused_block_insert_props is cleaned up
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	togglePlusMenuVisibility(): void;
	onKeyDown?: React.KeyboardEventHandler;
	pluginInjectionApi: ExtractInjectionAPI<InsertBlockPlugin> | undefined;
	isFullPageAppearance?: boolean;
}

export const BlockInsertMenu = (props: BlockInsertMenuProps) => {
	if (fg('platform_editor_refactor_view_more')) {
		if (props.items.length === 0 && !props.showElementBrowserLink) {
			return null;
		}
	} else {
		if (props.items.length === 0) {
			return null;
		}
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
		/>
	);
};
