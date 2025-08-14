import React from 'react';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { Popup } from '@atlaskit/editor-common/ui';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { InsertBlockPlugin } from '../../index';
import InsertMenu, { DEFAULT_HEIGHT } from '../ElementBrowser/InsertMenu';
import type { OnInsert } from '../ElementBrowser/types';

import type { BlockMenuItem } from './create-items';
import { DropDownButton } from './dropdown-button';

type SimpleEventHandler<T> = (event?: T) => void;

export interface BlockInsertElementBrowserProps {
	disabled: boolean;
	editorView: EditorView;
	items: BlockMenuItem[];
	spacing: 'none' | 'default';
	label: string;
	open: boolean;
	popupsBoundariesElement?: HTMLElement;
	popupsMountPoint?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
	plusButtonRef?: HTMLElement;
	showElementBrowserLink: boolean;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	onRef(el: HTMLElement): void;
	onClick: React.MouseEventHandler;
	onKeyDown?: React.KeyboardEventHandler;
	onInsert: OnInsert;
	togglePlusMenuVisibility: SimpleEventHandler<MouseEvent | KeyboardEvent>;
	pluginInjectionApi: ExtractInjectionAPI<InsertBlockPlugin> | undefined;
	isFullPageAppearance?: boolean;
}

// This determines how the popup should fit. We prefer the insert menu
// opening on the bottom as we have a search bar and should only open on
// top if there is more than sufficient room.
const FIT_HEIGHT_BUFFER = 100;

export const BlockInsertElementBrowser = (props: BlockInsertElementBrowserProps) => {
	return (
		<>
			{props.open && (
				<Popup
					target={props.plusButtonRef}
					fitHeight={DEFAULT_HEIGHT + FIT_HEIGHT_BUFFER}
					fitWidth={350}
					offset={[0, 3]}
					mountTo={props.popupsMountPoint}
					boundariesElement={props.popupsBoundariesElement}
					scrollableElement={props.popupsScrollableElement}
					preventOverflow
					alignX="right"
				>
					<InsertMenu
						editorView={props.editorView}
						dropdownItems={props.items}
						onInsert={props.onInsert}
						toggleVisiblity={props.togglePlusMenuVisibility}
						showElementBrowserLink={props.showElementBrowserLink}
						pluginInjectionApi={props.pluginInjectionApi}
						isFullPageAppearance={props.isFullPageAppearance}
					/>
				</Popup>
			)}
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
		</>
	);
};
