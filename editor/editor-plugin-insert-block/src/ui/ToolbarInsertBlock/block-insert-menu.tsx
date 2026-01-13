import React from 'react';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { InsertBlockPlugin } from '../../index';
import type { OnInsert } from '../ElementBrowser/types';

import { BlockInsertElementBrowser } from './block-insert-element-browser';
import type { BlockMenuItem } from './create-items';
import { DropDownButton } from './dropdown-button';

export interface BlockInsertMenuProps {
	disabled: boolean;
	editorView: EditorView;
	isFullPageAppearance?: boolean;
	items: BlockMenuItem[];
	label: string;
	onClick: React.MouseEventHandler;
	onInsert: OnInsert;
	onKeyDown?: React.KeyboardEventHandler;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	onPlusButtonRef(el: HTMLElement): void;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	onRef(el: HTMLElement): void;
	open: boolean;
	pluginInjectionApi: ExtractInjectionAPI<InsertBlockPlugin> | undefined;
	plusButtonRef?: HTMLElement;
	popupsBoundariesElement?: HTMLElement;
	popupsMountPoint?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
	showElementBrowserLink: boolean;
	spacing: 'none' | 'default';
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	togglePlusMenuVisibility(): void;
}

export const BlockInsertMenu = (props: BlockInsertMenuProps): React.JSX.Element | null => {
	if (props.items.length === 0 && !props.showElementBrowserLink) {
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
		/>
	);
};
