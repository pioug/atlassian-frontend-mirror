import type { IntlShape } from 'react-intl-next';

import { PanelType } from '@atlaskit/adf-schema';
import type { AnalyticsEventPayload, EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { withAnalytics } from '@atlaskit/editor-common/editor-analytics';
import commonMessages, { panelMessages as messages } from '@atlaskit/editor-common/messages';
import { getPanelTypeBackgroundNoTokens } from '@atlaskit/editor-common/panel';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type {
	Command,
	ExtractInjectionAPI,
	FloatingToolbarButton,
	FloatingToolbarColorPicker,
	FloatingToolbarConfig,
	FloatingToolbarEmojiPicker,
	FloatingToolbarItem,
} from '@atlaskit/editor-common/types';
import { DEFAULT_BORDER_COLOR, panelBackgroundPalette } from '@atlaskit/editor-common/ui-color';
import type { PaletteColor } from '@atlaskit/editor-common/ui-color';
import type { HoverDecorationHandler } from '@atlaskit/editor-plugin-decorations';
import type { NodeType } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { findDomRefAtPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { EmojiId } from '@atlaskit/emoji/types';
import CrossCircleIcon from '@atlaskit/icon/core/cross-circle';
import DeleteIcon from '@atlaskit/icon/core/delete';
import DiscoveryIcon from '@atlaskit/icon/core/discovery';
import EmojiRemoveIcon from '@atlaskit/icon/core/emoji-remove';
import InformationIcon from '@atlaskit/icon/core/information';
import SuccessIcon from '@atlaskit/icon/core/success';
import WarningIcon from '@atlaskit/icon/core/warning';
import ErrorIcon from '@atlaskit/icon/glyph/editor/error';
import InfoIcon from '@atlaskit/icon/glyph/editor/info';
import LegacyNoteIcon from '@atlaskit/icon/glyph/editor/note';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import RemoveEmojiIcon from '@atlaskit/icon/glyph/editor/remove-emoji';
import LegacySuccessIcon from '@atlaskit/icon/glyph/editor/success';
import LegacyWarningIcon from '@atlaskit/icon/glyph/editor/warning';
import { fg } from '@atlaskit/platform-feature-flags';

import { changePanelType, removePanel } from '../editor-actions/actions';
import type { PanelPlugin } from '../index';
import type { EmojiInfo, PanelPluginOptions } from '../panelPluginType';
import { findPanel } from '../pm-plugins/utils/utils';

export const panelIconMap: {
	[key in Exclude<PanelType, PanelType.CUSTOM>]: EmojiInfo;
} = {
	[PanelType.INFO]: { shortName: ':info:', id: 'atlassian-info' },
	[PanelType.NOTE]: { shortName: ':note:', id: 'atlassian-note' },
	[PanelType.WARNING]: { shortName: ':warning:', id: 'atlassian-warning' },
	[PanelType.ERROR]: { shortName: ':cross_mark:', id: 'atlassian-cross_mark' },
	[PanelType.SUCCESS]: {
		shortName: ':check_mark:',
		id: 'atlassian-check_mark',
	},
	[PanelType.TIP]: { shortName: ':tip:', id: 'atlassian-tip' },
};

export const getToolbarItems = (
	formatMessage: IntlShape['formatMessage'],
	panelNodeType: NodeType,
	isCustomPanelEnabled: boolean,
	isCustomPanelEditable: boolean,
	providerFactory: ProviderFactory,
	hoverDecoration: HoverDecorationHandler | undefined,
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
	activePanelType?: string,
	activePanelColor?: string,
	activePanelIcon?: string,
	state?: EditorState,
): FloatingToolbarItem<Command>[] => {
	// TODO: ED-14403 investigate why these titles are not getting translated for the tooltips
	const items: FloatingToolbarItem<Command>[] = [
		{
			id: 'editor.panel.info',
			type: 'button',
			icon: InformationIcon,
			iconFallback: InfoIcon,
			onClick: changePanelType(editorAnalyticsAPI)(PanelType.INFO),
			selected: activePanelType === PanelType.INFO,
			title: formatMessage(messages.info),
			tabIndex: null,
		},
		{
			id: 'editor.panel.note',
			type: 'button',
			icon: DiscoveryIcon,
			iconFallback: LegacyNoteIcon,
			onClick: changePanelType(editorAnalyticsAPI)(PanelType.NOTE),
			selected: activePanelType === PanelType.NOTE,
			title: formatMessage(messages.note),
			tabIndex: null,
		},
		{
			id: 'editor.panel.success',
			type: 'button',
			icon: SuccessIcon,
			iconFallback: LegacySuccessIcon,
			onClick: changePanelType(editorAnalyticsAPI)(PanelType.SUCCESS),
			selected: activePanelType === PanelType.SUCCESS,
			title: formatMessage(messages.success),
			tabIndex: null,
		},
		{
			id: 'editor.panel.warning',
			type: 'button',
			icon: WarningIcon,
			iconFallback: LegacyWarningIcon,
			onClick: changePanelType(editorAnalyticsAPI)(PanelType.WARNING),
			selected: activePanelType === PanelType.WARNING,
			title: formatMessage(messages.warning),
			tabIndex: null,
		},
		{
			id: 'editor.panel.error',
			type: 'button',
			icon: CrossCircleIcon,
			iconFallback: ErrorIcon,
			onClick: changePanelType(editorAnalyticsAPI)(PanelType.ERROR),
			selected: activePanelType === PanelType.ERROR,
			title: formatMessage(messages.error),
			tabIndex: null,
		},
	];

	if (isCustomPanelEnabled) {
		const changeColor =
			(color: string): Command =>
			(state, dispatch) => {
				const panelNode = findPanel(state);
				if (panelNode === undefined) {
					return false;
				}
				const previousColor =
					panelNode.node.attrs.panelType === 'custom'
						? panelNode.node.attrs.panelColor || 'none'
						: getPanelTypeBackgroundNoTokens(panelNode.node.attrs.panelType);

				const emojiInfo = panelNode.node.attrs.panelType as Exclude<PanelType, PanelType.CUSTOM>;
				const panelEmoji = panelIconMap[emojiInfo];
				const previousEmoji = panelEmoji
					? { emoji: panelEmoji.shortName, emojiId: panelEmoji.id }
					: {};
				if (previousColor === color) {
					changePanelType(editorAnalyticsAPI)(
						PanelType.CUSTOM,
						{ color, ...previousEmoji },
						isCustomPanelEnabled,
					)(state, dispatch);
					return false;
				}
				const payload: AnalyticsEventPayload = {
					action: ACTION.CHANGED_BACKGROUND_COLOR,
					actionSubject: ACTION_SUBJECT.PANEL,
					actionSubjectId: ACTION_SUBJECT_ID.PANEL,
					attributes: { newColor: color, previousColor: previousColor },
					eventType: EVENT_TYPE.TRACK,
				};

				withAnalytics(
					editorAnalyticsAPI,
					payload,
				)(
					changePanelType(editorAnalyticsAPI)(
						PanelType.CUSTOM,
						{ color, ...previousEmoji },
						isCustomPanelEnabled,
					),
				)(state, dispatch);
				return false;
			};

		const changeEmoji =
			(emoji: EmojiId): Command =>
			(state, dispatch) => {
				const panelNode = findPanel(state);
				if (panelNode === undefined) {
					return false;
				}
				const previousIcon = panelNode.node.attrs.panelIcon || '';
				if (previousIcon === emoji.shortName) {
					changePanelType(editorAnalyticsAPI)(
						PanelType.CUSTOM,
						{
							emoji: emoji.shortName,
							emojiId: emoji.id,
							emojiText: emoji.fallback,
						},
						true,
					)(state, dispatch);
					return false;
				}
				const payload: AnalyticsEventPayload = {
					action: ACTION.CHANGED_ICON,
					actionSubject: ACTION_SUBJECT.PANEL,
					actionSubjectId: ACTION_SUBJECT_ID.PANEL,
					attributes: { newIcon: emoji.shortName, previousIcon: previousIcon },
					eventType: EVENT_TYPE.TRACK,
				};
				withAnalytics(
					editorAnalyticsAPI,
					payload,
				)(
					changePanelType(editorAnalyticsAPI)(
						PanelType.CUSTOM,
						{
							emoji: emoji.shortName,
							emojiId: emoji.id,
							emojiText: emoji.fallback,
						},
						true,
					),
				)(state, dispatch);
				return false;
			};

		const removeEmoji = (): Command => (state, dispatch) => {
			const panelNode = findPanel(state);
			if (activePanelType === PanelType.CUSTOM && !activePanelIcon) {
				return false;
			}
			if (panelNode === undefined) {
				return false;
			}
			const payload: AnalyticsEventPayload = {
				action: ACTION.REMOVE_ICON,
				actionSubject: ACTION_SUBJECT.PANEL,
				actionSubjectId: ACTION_SUBJECT_ID.PANEL,
				attributes: { icon: panelNode.node.attrs.panelIcon },
				eventType: EVENT_TYPE.TRACK,
			};
			withAnalytics(
				editorAnalyticsAPI,
				payload,
			)(
				changePanelType(editorAnalyticsAPI)(
					PanelType.CUSTOM,
					{ emoji: undefined, emojiId: undefined, emojiText: undefined },
					isCustomPanelEnabled,
				),
			)(state, dispatch);
			return false;
		};

		const panelColor =
			activePanelType === PanelType.CUSTOM
				? activePanelColor || getPanelTypeBackgroundNoTokens(PanelType.INFO)
				: getPanelTypeBackgroundNoTokens(activePanelType as Exclude<PanelType, PanelType.CUSTOM>);

		const defaultPalette =
			panelBackgroundPalette.find((item) => item.value === panelColor) ||
			({
				label: 'Custom',
				value: panelColor,
				border: DEFAULT_BORDER_COLOR,
			} as PaletteColor);

		if (isCustomPanelEditable) {
			const colorPicker: FloatingToolbarColorPicker<Command> = {
				id: 'editor.panel.colorPicker',
				title: formatMessage(messages.backgroundColor),
				isAriaExpanded: true,
				type: 'select',
				selectType: 'color',
				defaultValue: defaultPalette,
				options: panelBackgroundPalette,
				onChange: (option) => changeColor(option.value),
			};

			const emojiPicker: FloatingToolbarEmojiPicker<Command> = {
				id: 'editor.panel.emojiPicker',
				title: formatMessage(messages.emoji),
				type: 'select',
				selectType: 'emoji',
				options: [],
				selected: activePanelType === PanelType.CUSTOM && !!activePanelIcon,
				onChange: (emoji) => changeEmoji(emoji),
			};

			const removeEmojiButton: FloatingToolbarButton<Command> = {
				id: 'editor.panel.removeEmoji',
				type: 'button',
				icon: EmojiRemoveIcon,
				iconFallback: RemoveEmojiIcon,
				onClick: removeEmoji(),
				title: formatMessage(commonMessages.removeEmoji),
				disabled: activePanelIcon ? false : true,
			};

			items.push(
				emojiPicker,
				removeEmojiButton,
				{
					type: 'separator',
				},
				colorPicker,
			);
		}
	}

	if (state) {
		items.push({
			type: 'separator',
		});
		items.push({
			type: 'copy-button',
			supportsViewMode: !fg('platform_editor_remove_copy_button_from_view_mode'),
			items: [{ state, formatMessage, nodeType: panelNodeType }],
		});
	}

	items.push(
		{
			type: 'separator',
		},
		{
			id: 'editor.panel.delete',
			type: 'button',
			appearance: 'danger',
			focusEditoronEnter: true,
			icon: DeleteIcon,
			iconFallback: RemoveIcon,
			onClick: removePanel(editorAnalyticsAPI),
			onMouseEnter: hoverDecoration?.(panelNodeType, true),
			onMouseLeave: hoverDecoration?.(panelNodeType, false),
			onFocus: hoverDecoration?.(panelNodeType, true),
			onBlur: hoverDecoration?.(panelNodeType, false),
			title: formatMessage(commonMessages.remove),
			tabIndex: null,
		},
	);

	return items;
};

export const getToolbarConfig = (
	state: EditorState,
	intl: IntlShape,
	options: PanelPluginOptions = {},
	providerFactory: ProviderFactory,
	api: ExtractInjectionAPI<PanelPlugin> | undefined,
): FloatingToolbarConfig | undefined => {
	const { formatMessage } = intl;
	const panelObject = findPanel(state);
	if (panelObject) {
		const nodeType = state.schema.nodes.panel;
		const { panelType, panelColor, panelIcon } = panelObject.node.attrs;

		const isStandardPanel = (panelType: PanelType) => {
			return panelType !== PanelType.CUSTOM ? panelType : undefined;
		};

		// force toolbar to be turned on
		const items = getToolbarItems(
			formatMessage,
			nodeType,
			options.allowCustomPanel || false,
			(options.allowCustomPanel && options.allowCustomPanelEdit) || false,
			providerFactory,
			api?.decorations?.actions.hoverDecoration,
			api?.analytics?.actions,
			panelType,
			options.allowCustomPanel ? panelColor : undefined,
			options.allowCustomPanel ? panelIcon || isStandardPanel(panelType) : undefined,
			state,
		);

		const getDomRef = (editorView: EditorView) => {
			const domAtPos = editorView.domAtPos.bind(editorView);
			const element = findDomRefAtPos(panelObject.pos, domAtPos) as HTMLDivElement;
			return element;
		};

		return {
			title: 'Panel floating controls',
			getDomRef,
			nodeType,
			items,
			scrollable: true,
			groupLabel: formatMessage(messages.panelsGroup),
		};
	}
	return;
};
