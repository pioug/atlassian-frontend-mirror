import React, { useCallback } from 'react';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { Popup } from '@atlaskit/editor-common/ui';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import type { InsertBlockPlugin } from '../../index';
import InsertMenu, { DEFAULT_HEIGHT } from '../ElementBrowser/InsertMenu';
import type { OnInsert } from '../ElementBrowser/types';
import { RegisteredInsertMenuContent } from '../registered-insert-menu/RegisteredInsertMenuContent';

import type { BlockMenuItem } from './create-items';
import { DropDownButton } from './dropdown-button';

type SimpleEventHandler<T> = (event?: T) => void;

export interface BlockInsertElementBrowserProps {
	disabled: boolean;
	editorView: EditorView;
	isEditorOffline?: boolean;
	isFullPageAppearance?: boolean;
	items: BlockMenuItem[];
	label: string;
	onClick: React.MouseEventHandler;
	onInsert: OnInsert;
	onKeyDown?: React.KeyboardEventHandler;
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
	togglePlusMenuVisibility: SimpleEventHandler<MouseEvent | KeyboardEvent>;
}

// This determines how the popup should fit. We prefer the insert menu
// opening on the bottom as we have a search bar and should only open on
// top if there is more than sufficient room.
const FIT_HEIGHT_BUFFER = 100;

export const BlockInsertElementBrowser = (
	props: BlockInsertElementBrowserProps,
): React.JSX.Element => {
	const { togglePlusMenuVisibility, plusButtonRef } = props;
	const closeRegisteredMenu = useCallback(
		() => togglePlusMenuVisibility(),
		[togglePlusMenuVisibility],
	);
	const closeRegisteredMenuAndRestoreFocus = useCallback(() => {
		togglePlusMenuVisibility();
		plusButtonRef?.focus();
	}, [togglePlusMenuVisibility, plusButtonRef]);

	return (
		<>
			{props.open && (
				<Popup
					target={props.plusButtonRef}
					fitHeight={DEFAULT_HEIGHT + FIT_HEIGHT_BUFFER}
					fitWidth={350}
					// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
					offset={[0, 3]}
					mountTo={props.popupsMountPoint}
					boundariesElement={props.popupsBoundariesElement}
					scrollableElement={props.popupsScrollableElement}
					preventOverflow
					alignX="right"
				>
					{isExperimentEnabled('platform_editor_slash_command') ? (
						<RegisteredInsertMenuContent
							api={props.pluginInjectionApi}
							editorView={props.editorView}
							isOffline={Boolean(props.isEditorOffline)}
							onClose={closeRegisteredMenuAndRestoreFocus}
							onDismiss={closeRegisteredMenu}
							onSelect={closeRegisteredMenu}
							target={props.plusButtonRef}
						/>
					) : (
						<InsertMenu
							editorView={props.editorView}
							dropdownItems={props.items}
							onInsert={props.onInsert}
							toggleVisiblity={props.togglePlusMenuVisibility}
							showElementBrowserLink={props.showElementBrowserLink}
							pluginInjectionApi={props.pluginInjectionApi}
							isFullPageAppearance={props.isFullPageAppearance}
						/>
					)}
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
