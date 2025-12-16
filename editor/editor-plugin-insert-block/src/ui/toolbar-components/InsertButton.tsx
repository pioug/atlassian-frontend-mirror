import React, { useRef, useState } from 'react';

import { useIntl } from 'react-intl-next';

import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import {
	getAriaKeyshortcuts,
	insertElements,
	ToolTipContent,
} from '@atlaskit/editor-common/keymaps';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { useEditorToolbar } from '@atlaskit/editor-common/toolbar';
import type {
	ExtractInjectionAPI,
	Command,
	TOOLBAR_MENU_TYPE,
} from '@atlaskit/editor-common/types';
import { Popup } from '@atlaskit/editor-common/ui';
import type { MenuItem } from '@atlaskit/editor-common/ui-menu';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import { akEditorMenuZIndex } from '@atlaskit/editor-shared-styles';
import type { Breakpoint } from '@atlaskit/editor-toolbar';
import { ToolbarButton, ToolbarTooltip, AddIcon, useToolbarUI } from '@atlaskit/editor-toolbar';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { InsertBlockPlugin } from '../../insertBlockPluginType';
import type { ToolbarInsertBlockButtonsConfig } from '../../types';
import InsertMenu, { DEFAULT_HEIGHT } from '../ElementBrowser/InsertMenu';
import type { OnInsert } from '../ElementBrowser/types';

import { LINK_BUTTON_KEY } from './hooks/filterDropdownItems';
import { useEmojiPickerPopup } from './hooks/useEmojiPickerPopup';
import { useInsertButtonState } from './hooks/useInsertButtonState';
import { useTableSelectorPopup } from './hooks/useTableSelectorPopup';
import { EmojiPickerPopup } from './popups/EmojiPickerPopup';

// This determines how the popup should fit. We prefer the insert menu
// opening on the bottom as we have a search bar and should only open on
// top if there is more than sufficient room.
const FIT_HEIGHT_BUFFER = 100;

type InsertButtonProps = {
	api?: ExtractInjectionAPI<InsertBlockPlugin>;
	breakpoint?: Breakpoint | null;
	expandEnabled?: boolean;
	horizontalRuleEnabled?: boolean;
	insertMenuItems?: MenuItem[];
	isFullPageAppearance?: boolean;
	nativeStatusSupported?: boolean;
	numberOfButtons?: number;
	onInsertBlockType?: (name: string) => Command;
	showElementBrowserLink?: boolean;
	tableSelectorSupported?: boolean;
	toolbarConfig?: ToolbarInsertBlockButtonsConfig;
};

export const InsertButton = ({
	api,
	breakpoint,
	showElementBrowserLink = false,
	isFullPageAppearance = false,
	tableSelectorSupported,
	nativeStatusSupported,
	horizontalRuleEnabled,
	expandEnabled,
	insertMenuItems,
	numberOfButtons,
	onInsertBlockType,
	toolbarConfig,
}: InsertButtonProps): React.JSX.Element | null => {
	const { editorView } = useEditorToolbar();
	const { isDisabled, popupsMountPoint, popupsBoundariesElement, popupsScrollableElement } =
		useToolbarUI();
	const { formatMessage } = useIntl();
	const [insertMenuOpen, setInsertMenuOpen] = useState(false);

	const insertButtonRef = useRef<HTMLButtonElement | null>(null);

	const emojiPickerPopup = useEmojiPickerPopup({
		api,
		buttonRef: insertButtonRef,
	});

	const tableSelectorPopup = useTableSelectorPopup({
		api,
		buttonRef: insertButtonRef,
	});
	const showMediaPicker = useSharedPluginStateSelector(api, 'media.showMediaPicker');
	const { dropdownItems, emojiProvider, isTypeAheadAllowed } = useInsertButtonState({
		api,
		breakpoint,
		editorView: editorView || undefined,
		horizontalRuleEnabled,
		insertMenuItems,
		nativeStatusSupported,
		numberOfButtons,
		tableSelectorSupported,
		expandEnabled,
		showElementBrowserLink,
		toolbarConfig,
	});

	if (!api?.insertBlock) {
		return null;
	}

	const toggleInsertMenuOpen = (newState: boolean) => {
		setInsertMenuOpen(newState);
	};

	const onPopupUnmount = () => {
		requestAnimationFrame(() => api?.core.actions.focus());
	};

	const onClick = () => {
		toggleInsertMenuOpen(!insertMenuOpen);
	};

	const onItemActivated = ({
		item,
		inputMethod,
	}: {
		inputMethod: TOOLBAR_MENU_TYPE;
		item: MenuItem;
	}): void => {
		if (!editorView) {
			return;
		}

		const { state, dispatch } = editorView;

		// need to do this before inserting nodes so scrollIntoView works properly
		if (!editorView.hasFocus()) {
			editorView.focus();
		}

		switch (item.value.name) {
			case LINK_BUTTON_KEY:
				api?.core?.actions.execute(api?.hyperlink?.commands.showLinkToolbar(inputMethod));
				break;
			case 'table':
				// workaround to solve race condition where cursor is not placed correctly inside table
				queueMicrotask(() => {
					api?.table?.actions.insertTable?.({
						action: ACTION.INSERTED,
						actionSubject: ACTION_SUBJECT.DOCUMENT,
						actionSubjectId: ACTION_SUBJECT_ID.TABLE,
						attributes: { inputMethod },
						eventType: EVENT_TYPE.TRACK,
					})(state, dispatch);
				});
				break;
			case 'table selector':
				tableSelectorPopup.toggle(inputMethod);
				break;
			case 'image upload':
				if (api?.imageUpload?.actions.startUpload) {
					api.imageUpload.actions.startUpload()(state, dispatch);
				}
				break;
			case 'media':
				if (showMediaPicker) {
					api?.core?.actions.execute(api?.mediaInsert?.commands.showMediaInsertPopup());
				}
				break;
			case 'mention':
				api?.mention?.actions?.openTypeAhead(inputMethod);
				break;
			case 'emoji':
				emojiPickerPopup.toggle(inputMethod);
				break;
			case 'codeblock':
			case 'blockquote':
			case 'panel':
				onInsertBlockType?.(item.value.name)(state, dispatch);
				break;
			case 'action':
			case 'decision':
				const listType = item.value.name === 'action' ? 'taskList' : 'decisionList';
				api?.taskDecision?.actions.insertTaskDecision(listType, inputMethod)(state, dispatch);
				break;
			case 'horizontalrule':
				api?.rule?.actions.insertHorizontalRule(inputMethod)(state, dispatch);
				break;
			case 'macro':
				if (!fg('platform_editor_refactor_view_more')) {
					api?.core?.actions.execute(api?.quickInsert?.commands.openElementBrowserModal);
				}
				break;
			case 'date':
				api?.core?.actions.execute(
					api?.date?.commands?.insertDate({
						inputMethod,
					}),
				);
				break;
			case 'placeholder text':
				api?.placeholderText?.actions.showPlaceholderFloatingToolbar(state, dispatch);
				break;
			case 'layout':
				api?.layout?.actions.insertLayoutColumns(inputMethod)(state, dispatch);
				break;
			case 'status':
				api?.core?.actions.execute(api?.status?.commands?.insertStatus(inputMethod));
				break;
			case 'expand':
				api?.expand?.actions.insertExpand(state, dispatch);
				break;
			default:
				if (item && item.onClick) {
					item.onClick();
				}
				break;
		}

		toggleInsertMenuOpen(false);
	};

	const onInsert = ({ item }: { item: MenuItem }) => {
		onItemActivated({
			item,
			inputMethod: INPUT_METHOD.INSERT_MENU,
		});
	};

	const toggleVisibility = () => {
		toggleInsertMenuOpen(!insertMenuOpen);
	};

	return (
		<>
			{insertMenuOpen && insertButtonRef.current && editorView && (
				<Popup
					target={insertButtonRef.current}
					fitHeight={DEFAULT_HEIGHT + FIT_HEIGHT_BUFFER}
					fitWidth={350}
					offset={[0, 3]}
					mountTo={popupsMountPoint}
					boundariesElement={popupsBoundariesElement}
					scrollableElement={popupsScrollableElement}
					onUnmount={onPopupUnmount}
					focusTrap
					zIndex={akEditorMenuZIndex}
					preventOverflow
					alignX="right"
				>
					<InsertMenu
						editorView={editorView}
						dropdownItems={dropdownItems}
						onInsert={onInsert as OnInsert}
						toggleVisiblity={toggleVisibility}
						showElementBrowserLink={showElementBrowserLink}
						pluginInjectionApi={api}
						isFullPageAppearance={isFullPageAppearance}
					/>
				</Popup>
			)}
			{emojiProvider && (
				<EmojiPickerPopup
					isOpen={emojiPickerPopup.isOpen}
					targetRef={insertButtonRef}
					emojiProvider={Promise.resolve(emojiProvider)}
					onSelection={emojiPickerPopup.handleSelectedEmoji}
					onClickOutside={emojiPickerPopup.handleClickOutside}
					onEscapeKeydown={emojiPickerPopup.handleEscapeKeydown}
					onUnmount={emojiPickerPopup.onPopupUnmount}
					popupsMountPoint={popupsMountPoint}
					popupsBoundariesElement={popupsBoundariesElement}
					popupsScrollableElement={popupsScrollableElement}
				/>
			)}
			<ToolbarTooltip
				content={
					expValEquals('platform_editor_toolbar_aifc_patch_6', 'isEnabled', true) ? (
						<ToolTipContent
							description={formatMessage(messages.insertMenu)}
							keymap={insertElements}
						/>
					) : (
						formatMessage(messages.insertMenu)
					)
				}
			>
				<ToolbarButton
					iconBefore={<AddIcon size="small" label={formatMessage(messages.insertMenu)} />}
					ariaKeyshortcuts={getAriaKeyshortcuts(insertElements)}
					ref={insertButtonRef}
					onClick={onClick}
					isSelected={insertMenuOpen}
					isDisabled={!isTypeAheadAllowed || isDisabled}
				/>
			</ToolbarTooltip>
		</>
	);
};
