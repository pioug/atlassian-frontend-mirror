import React from 'react';

import type { IntlShape } from 'react-intl-next';

import { isSafeUrl } from '@atlaskit/adf-schema';
import type {
	ACTION_SUBJECT_ID,
	AnalyticsEventPayload,
	EditorAnalyticsAPI,
} from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID as ACTION_SUBJECTID,
	EVENT_TYPE,
	INPUT_METHOD,
	buildOpenedSettingsPayload,
	buildVisitedNonHyperLinkPayload,
} from '@atlaskit/editor-common/analytics';
import type { CardOptions } from '@atlaskit/editor-common/card';
import {
	buildLayoutButtons,
	buildLayoutDropdown,
	commandWithMetadata,
} from '@atlaskit/editor-common/card';
import { getLinkPreferencesURLFromENV } from '@atlaskit/editor-common/link';
import commonMessages, {
	annotationMessages,
	linkMessages,
	linkToolbarMessages,
	cardMessages as messages,
} from '@atlaskit/editor-common/messages';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import {
	FLOATING_TOOLBAR_LINKPICKER_CLASSNAME,
	richMediaClassName,
} from '@atlaskit/editor-common/styles';
import { areToolbarFlagsEnabled } from '@atlaskit/editor-common/toolbar-flag-check';
import type {
	Command,
	ExtractInjectionAPI,
	FloatingToolbarHandler,
	FloatingToolbarItem,
	LinkPickerOptions,
	PluginDependenciesAPI,
} from '@atlaskit/editor-common/types';
import { canRenderDatasource } from '@atlaskit/editor-common/utils';
import type { HoverDecorationHandler } from '@atlaskit/editor-plugin-decorations';
import type { WidthPlugin } from '@atlaskit/editor-plugin-width';
import type { Node, NodeType } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import { findDomRefAtPos, removeSelectedNode } from '@atlaskit/editor-prosemirror/utils';
import { akEditorSelectedNodeClassName } from '@atlaskit/editor-shared-styles';
import CommentIcon from '@atlaskit/icon/core/comment';
import CopyIcon from '@atlaskit/icon/core/copy';
import DeleteIcon from '@atlaskit/icon/core/delete';
import EditIcon from '@atlaskit/icon/core/edit';
import LinkBrokenIcon from '@atlaskit/icon/core/link-broken';
import LinkExternalIcon from '@atlaskit/icon/core/link-external';
import LegacyCommentIcon from '@atlaskit/icon/core/migration/comment';
import RemoveIcon from '@atlaskit/icon/core/migration/delete--editor-remove';
import UnlinkIcon from '@atlaskit/icon/core/migration/link-broken--editor-unlink';
import OpenIcon from '@atlaskit/icon/core/migration/link-external--shortcut';
import CogIcon from '@atlaskit/icon/core/migration/settings--editor-settings';
import SettingsIcon from '@atlaskit/icon/core/settings';
import { fg } from '@atlaskit/platform-feature-flags';
import type { CardAppearance } from '@atlaskit/smart-card';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { cardPlugin } from '../index';
import { changeSelectedCardToText } from '../pm-plugins/doc';
import { pluginKey } from '../pm-plugins/plugin-key';
import {
	appearanceForNodeType,
	displayInfoForCard,
	findCardInfo,
	isDatasourceNode,
	titleUrlPairFromNode,
} from '../pm-plugins/utils';
import type { CardPluginOptions, CardPluginState } from '../types';

import { DatasourceAppearanceButton } from './DatasourceAppearanceButton';
import {
	buildEditLinkToolbar,
	editLinkToolbarConfig,
	getEditLinkCallback,
} from './EditLinkToolbar';
import { EditToolbarButton } from './EditToolbarButton';
import { HyperlinkToolbarAppearance } from './HyperlinkToolbarAppearance';
import { getCustomHyperlinkAppearanceDropdown } from './HyperlinkToolbarAppearanceDropdown';
import { LinkToolbarAppearance } from './LinkToolbarAppearance';
import { getLinkAppearanceDropdown } from './LinkToolbarAppearanceDropdown';
import { OpenPreviewPanelToolbarButton } from './OpenPreviewButton';
import { ToolbarViewedEvent } from './ToolbarViewedEvent';

export const removeCard = (editorAnalyticsApi: EditorAnalyticsAPI | undefined): Command =>
	commandWithMetadata(
		(state, dispatch) => {
			if (!(state.selection instanceof NodeSelection)) {
				return false;
			}

			const type = state.selection.node.type.name;
			const payload: AnalyticsEventPayload = {
				action: ACTION.DELETED,
				actionSubject: ACTION_SUBJECT.SMART_LINK,
				actionSubjectId: type as ACTION_SUBJECT_ID.CARD_INLINE | ACTION_SUBJECT_ID.CARD_BLOCK,
				attributes: {
					inputMethod: INPUT_METHOD.FLOATING_TB,
					displayMode: type as ACTION_SUBJECT_ID.CARD_INLINE | ACTION_SUBJECT_ID.CARD_BLOCK,
				},
				eventType: EVENT_TYPE.TRACK,
			};
			if (dispatch) {
				const { tr } = state;
				removeSelectedNode(tr);
				editorAnalyticsApi?.attachAnalyticsEvent(payload)(tr);
				dispatch(tr);
			}
			return true;
		},
		{ action: ACTION.DELETED },
	);

export const visitCardLinkAnalytics =
	(
		editorAnalyticsApi: EditorAnalyticsAPI | undefined,
		inputMethod:
			| INPUT_METHOD.FLOATING_TB
			| INPUT_METHOD.TOOLBAR
			| INPUT_METHOD.BUTTON
			| INPUT_METHOD.DOUBLE_CLICK
			| INPUT_METHOD.META_CLICK,
	): Command =>
	(state, dispatch) => {
		if (!(state.selection instanceof NodeSelection)) {
			return false;
		}

		const { type } = state.selection.node;

		if (dispatch) {
			const { tr } = state;
			editorAnalyticsApi?.attachAnalyticsEvent(
				buildVisitedNonHyperLinkPayload(
					type.name as
						| ACTION_SUBJECT_ID.CARD_INLINE
						| ACTION_SUBJECT_ID.CARD_BLOCK
						| ACTION_SUBJECT_ID.EMBEDS,
					inputMethod,
				),
			)(tr);

			dispatch(tr);
		}
		return true;
	};

export const openLinkSettings =
	(editorAnalyticsApi: EditorAnalyticsAPI | undefined): Command =>
	(state, dispatch) => {
		if (!(state.selection instanceof NodeSelection)) {
			return false;
		}

		if (dispatch) {
			const {
				tr,
				selection: {
					node: { type },
				},
			} = state;

			editorAnalyticsApi?.attachAnalyticsEvent(
				buildOpenedSettingsPayload(
					type.name as
						| ACTION_SUBJECT_ID.CARD_INLINE
						| ACTION_SUBJECT_ID.CARD_BLOCK
						| ACTION_SUBJECT_ID.EMBEDS,
				),
			)(tr);
			dispatch(tr);
		}
		return true;
	};

export const floatingToolbar = (
	cardOptions: CardOptions,
	lpLinkPicker: boolean,
	linkPickerOptions?: LinkPickerOptions,
	pluginInjectionApi?: ExtractInjectionAPI<typeof cardPlugin>,
	disableFloatingToolbar?: boolean,
): FloatingToolbarHandler => {
	return (state, intl, providerFactory) => {
		if (disableFloatingToolbar) {
			return;
		}

		const { inlineCard, blockCard, embedCard } = state.schema.nodes;
		const nodeType = [inlineCard, blockCard, embedCard];
		const pluginState: CardPluginState | undefined = pluginKey.getState(state);
		if (!(state.selection instanceof NodeSelection)) {
			return;
		}
		const selectedNode = state.selection.node;

		if (!selectedNode) {
			return;
		}

		const isEmbedCard = appearanceForNodeType(selectedNode.type) === 'embed';

		/* add an offset to embeds due to extra padding */
		const toolbarOffset: { offset: [number, number] } | Object = isEmbedCard
			? {
					offset: [0, 24],
				}
			: {};

		// Applies padding override for when link picker is currently displayed
		const className = pluginState?.showLinkingToolbar
			? FLOATING_TOOLBAR_LINKPICKER_CLASSNAME
			: undefined;

		const isLinkPickerEnabled = !!lpLinkPicker;

		return {
			title: intl.formatMessage(messages.card),
			className,
			nodeType,
			preventPopupOverflow: isLinkPickerEnabled,
			...toolbarOffset,
			getDomRef: (view) => {
				// Ignored via go/ees005
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const element = findDomRefAtPos(
					view.state.selection.from,
					view.domAtPos.bind(view),
				) as HTMLElement;
				if (!element) {
					return undefined;
				}
				if (isEmbedCard) {
					// Ignored via go/ees005
					// eslint-disable-next-line @atlaskit/editor/no-as-casting
					const richMediaElement = element.querySelector(`.${richMediaClassName}`) as HTMLElement;
					if (!expValEquals('platform_editor_preview_panel_responsiveness', 'isEnabled', true)) {
						return richMediaElement;
					}
					if (richMediaElement) {
						return richMediaElement;
					}
				}
				return element;
			},

			items: generateToolbarItems(
				state,
				intl,
				providerFactory,
				cardOptions,
				lpLinkPicker,
				linkPickerOptions,
				pluginInjectionApi,
			),
			scrollable: pluginState?.showLinkingToolbar ? false : true,
			...editLinkToolbarConfig(Boolean(pluginState?.showLinkingToolbar), isLinkPickerEnabled),
		};
	};
};

const unlinkCard = (
	node: Node,
	state: EditorState,
	editorAnalyticsApi: EditorAnalyticsAPI | undefined,
): Command => {
	const displayInfo = displayInfoForCard(node, findCardInfo(state));
	const text = displayInfo.title || displayInfo.url;
	if (text) {
		return commandWithMetadata(changeSelectedCardToText(text, editorAnalyticsApi), {
			action: ACTION.UNLINK,
		});
	}

	return () => false;
};

const buildAlignmentOptions = (
	state: EditorState,
	intl: IntlShape,
	widthPluginDependencyApi: PluginDependenciesAPI<WidthPlugin> | undefined,
	analyticsApi: EditorAnalyticsAPI | undefined,
	cardOptions?: CardOptions,
	areAnyNewToolbarFlagsEnabled?: boolean,
): FloatingToolbarItem<Command>[] => {
	if (areAnyNewToolbarFlagsEnabled) {
		return buildLayoutDropdown(
			state,
			intl,
			state.schema.nodes.embedCard,
			widthPluginDependencyApi,
			analyticsApi,
			true,
			true,
			cardOptions?.allowWrapping,
			cardOptions?.allowAlignment,
		);
	}

	return buildLayoutButtons(
		state,
		intl,
		state.schema.nodes.embedCard,
		widthPluginDependencyApi,
		analyticsApi,
		true,
		true,
		cardOptions?.allowWrapping,
		cardOptions?.allowAlignment,
	);
};

const withToolbarMetadata = (command: Command) =>
	commandWithMetadata(command, {
		inputMethod: INPUT_METHOD.FLOATING_TB,
	});

const getToolbarViewedItem = (
	url: string | undefined,
	display: string,
): FloatingToolbarItem<never>[] => {
	if (!url) {
		return [];
	}

	return [
		{
			type: 'custom',
			fallback: [],
			render: (editorView) => (
				<ToolbarViewedEvent
					key="edit.link.menu.viewed"
					url={url}
					display={display}
					editorView={editorView}
				/>
			),
		},
	];
};

const generateToolbarItems =
	(
		state: EditorState,
		intl: IntlShape,
		providerFactory: ProviderFactory,
		cardOptions: CardOptions,
		lpLinkPicker: boolean,
		linkPicker?: LinkPickerOptions,
		pluginInjectionApi?: ExtractInjectionAPI<typeof cardPlugin>,
	) =>
	(node: Node): Array<FloatingToolbarItem<Command>> => {
		const { url } = titleUrlPairFromNode(node);
		const { actions: editorAnalyticsApi } = pluginInjectionApi?.analytics ?? {};
		let metadata = {};
		if (url && !isSafeUrl(url)) {
			return [];
		} else {
			const { title } = displayInfoForCard(node, findCardInfo(state));
			metadata = {
				url: url,
				title: title,
			};
		}

		const areAllNewToolbarFlagsDisabled = !areToolbarFlagsEnabled(
			Boolean(pluginInjectionApi?.toolbar),
		);

		const currentAppearance = appearanceForNodeType(node.type);
		const { hoverDecoration } = pluginInjectionApi?.decorations?.actions ?? {};

		const isDatasource = isDatasourceNode(node);
		const pluginState: CardPluginState | undefined = pluginKey.getState(state);

		const annotationApiState = pluginInjectionApi?.annotation?.sharedState.currentState();

		const activeCommentMark = node.marks.find(
			(mark) =>
				mark.type.name === 'annotation' && annotationApiState?.annotations[mark.attrs.id] === false,
		);

		const isCommentEnabled =
			annotationApiState &&
			annotationApiState.isVisible &&
			!annotationApiState.bookmark &&
			!annotationApiState.mouseData.isSelecting &&
			!activeCommentMark &&
			node.type === state.schema.nodes.inlineCard;

		const onCommentButtonClick: Command = (state, dispatch) => {
			if (!pluginInjectionApi?.annotation || !isCommentEnabled) {
				return false;
			}
			pluginInjectionApi?.analytics?.actions?.fireAnalyticsEvent({
				action: ACTION.CLICKED,
				actionSubject: ACTION_SUBJECT.BUTTON,
				actionSubjectId: ACTION_SUBJECTID.CREATE_INLINE_COMMENT_FROM_HIGHLIGHT_ACTIONS_MENU,
				eventType: EVENT_TYPE.UI,
				attributes: {
					source: 'highlightActionsMenu',
					pageMode: 'edit',
					sourceNode: 'inlineCard',
				},
			});

			const { setInlineCommentDraftState } = pluginInjectionApi.annotation.actions;
			const command = setInlineCommentDraftState(true, INPUT_METHOD.FLOATING_TB);
			return command(state, dispatch);
		};

		const shouldRenderDatasourceToolbar =
			isDatasource &&
			cardOptions.allowDatasource &&
			canRenderDatasource(node?.attrs?.datasource?.id);

		if (pluginState?.showLinkingToolbar) {
			return [
				buildEditLinkToolbar({
					providerFactory,
					linkPicker,
					node,
					pluginInjectionApi,
					lpLinkPicker,
				}),
			];
		} else if (shouldRenderDatasourceToolbar) {
			return getDatasourceButtonGroup(
				metadata,
				intl,
				editorAnalyticsApi,
				node,
				hoverDecoration,
				node.attrs.datasource.id,
				state,
				cardOptions,
				currentAppearance,
				pluginInjectionApi,
			);
		} else {
			const { inlineCard } = state.schema.nodes;

			const editItems: Array<FloatingToolbarItem<Command>> = cardOptions.allowDatasource
				? [
						{
							type: 'custom',
							fallback: [],
							render: (editorView) => (
								<EditToolbarButton
									key="edit-toolbar-item"
									url={url}
									intl={intl}
									editorAnalyticsApi={editorAnalyticsApi}
									editorView={editorView}
									onLinkEditClick={getEditLinkCallback(editorAnalyticsApi, true)}
									currentAppearance={currentAppearance}
									areAnyNewToolbarFlagsEnabled={!areAllNewToolbarFlagsDisabled}
								/>
							),
						},
					]
				: [
						{
							id: 'editor.link.edit',
							type: 'button',
							selected: false,
							metadata: metadata,
							title: intl.formatMessage(linkToolbarMessages.editLink),
							showTitle: true,
							testId: 'link-toolbar-edit-link-button',
							onClick: getEditLinkCallback(editorAnalyticsApi, true),
						},
						{ type: 'separator' },
					];

			const commentItems: Array<FloatingToolbarItem<Command>> = isCommentEnabled
				? [
						{
							id: 'editor.link.commentLink',
							type: 'button',
							icon: CommentIcon,
							testId: 'inline-card-toolbar-comment-button',
							iconFallback: LegacyCommentIcon,
							title: intl.formatMessage(annotationMessages.createComment),
							showTitle: editorExperiment('platform_editor_controls', 'control') ? undefined : true,
							onClick: onCommentButtonClick,
							disabled:
								pluginInjectionApi?.connectivity?.sharedState?.currentState()?.mode === 'offline',
						},
						{ type: 'separator' },
					]
				: [];

			const openLinkInputMethod = INPUT_METHOD.FLOATING_TB;

			const editButtonItems: Array<FloatingToolbarItem<Command>> = cardOptions.allowDatasource
				? [
						{
							type: 'custom',
							fallback: [],
							render: (editorView) => (
								<EditToolbarButton
									key="edit-toolbar-item"
									url={url}
									intl={intl}
									editorAnalyticsApi={editorAnalyticsApi}
									editorView={editorView}
									onLinkEditClick={getEditLinkCallback(editorAnalyticsApi, true)}
									currentAppearance={currentAppearance}
									areAnyNewToolbarFlagsEnabled={!areAllNewToolbarFlagsDisabled}
								/>
							),
						},
					]
				: [
						{
							id: 'editor.link.edit',
							type: 'button',
							selected: false,
							metadata: metadata,
							title: intl.formatMessage(linkToolbarMessages.editLink),
							icon: EditIcon,
							testId: 'link-toolbar-edit-link-button',
							onClick: getEditLinkCallback(editorAnalyticsApi, true),
						},
					];

			const openPreviewPanelItems: FloatingToolbarItem<Command>[] = editorExperiment(
				'platform_editor_preview_panel_linking_exp',
				true,
				{ exposure: true },
			)
				? [
						{
							type: 'custom',
							fallback: [],
							render: () => (
								<OpenPreviewPanelToolbarButton
									node={node}
									intl={intl}
									editorAnalyticsApi={editorAnalyticsApi}
									areAnyNewToolbarFlagsEnabled={!areAllNewToolbarFlagsDisabled}
								/>
							),
						},
					]
				: [];

			const toolbarItems: Array<FloatingToolbarItem<Command>> = areAllNewToolbarFlagsDisabled
				? [
						...editItems,
						...commentItems,
						...openPreviewPanelItems,
						{
							id: 'editor.link.openLink',
							type: 'button',
							icon: LinkExternalIcon,
							iconFallback: OpenIcon,
							metadata: metadata,
							className: 'hyperlink-open-link',
							title: intl.formatMessage(linkMessages.openLink),
							onClick: visitCardLinkAnalytics(editorAnalyticsApi, openLinkInputMethod),
							href: url,
							target: '_blank',
						},
						{ type: 'separator' },
						...getUnlinkButtonGroup(
							state,
							intl,
							node,
							inlineCard,
							editorAnalyticsApi,
							!areAllNewToolbarFlagsDisabled,
						),
						{
							type: 'copy-button',
							items: [
								{
									state,
									formatMessage: intl.formatMessage,
									nodeType: node.type,
								},
							],
						},
						{ type: 'separator' },
						getSettingsButton(intl, editorAnalyticsApi, cardOptions.userPreferencesLink),
						{ type: 'separator' },
						{
							id: 'editor.link.delete',
							focusEditoronEnter: true,
							type: 'button',
							appearance: 'danger',
							icon: DeleteIcon,
							iconFallback: RemoveIcon,
							onMouseEnter: hoverDecoration?.(node.type, true),
							onMouseLeave: hoverDecoration?.(node.type, false),
							onFocus: hoverDecoration?.(node.type, true),
							onBlur: hoverDecoration?.(node.type, false),
							title: intl.formatMessage(commonMessages.remove),
							onClick: withToolbarMetadata(removeCard(editorAnalyticsApi)),
						},
					]
				: [
						...openPreviewPanelItems,
						...editButtonItems,
						...(fg('platform_editor_controls_patch_15')
							? ([
									...getUnlinkButtonGroup(
										state,
										intl,
										node,
										inlineCard,
										editorAnalyticsApi,
										!areAllNewToolbarFlagsDisabled,
									),
									{ type: 'separator', fullHeight: true },
								] as FloatingToolbarItem<Command>[])
							: getUnlinkButtonGroup(
									state,
									intl,
									node,
									inlineCard,
									editorAnalyticsApi,
									!areAllNewToolbarFlagsDisabled,
								)),
						{
							id: 'editor.link.openLink',
							type: 'button',
							icon: LinkExternalIcon,
							iconFallback: OpenIcon,
							metadata: metadata,
							className: 'hyperlink-open-link',
							title: intl.formatMessage(linkMessages.openLink),
							onClick: visitCardLinkAnalytics(editorAnalyticsApi, openLinkInputMethod),
							href: url,
							target: '_blank',
						},
						...(commentItems.length > 1
							? [{ type: 'separator', fullHeight: true } as const, commentItems[0]]
							: commentItems),
					];

			if (currentAppearance === 'embed') {
				const alignmentOptions = buildAlignmentOptions(
					state,
					intl,
					pluginInjectionApi?.width,
					pluginInjectionApi?.analytics?.actions,
					cardOptions,
					!areAllNewToolbarFlagsDisabled,
				);
				if (alignmentOptions.length && areAllNewToolbarFlagsDisabled) {
					alignmentOptions.push({
						type: 'separator',
					});
				}
				toolbarItems.unshift(...alignmentOptions);
			}

			const { allowBlockCards, allowEmbeds, allowDatasource, showUpgradeDiscoverability } =
				cardOptions;
			// This code will be executed only for appearances such as "inline", "block" & "embed"
			// For url appearance, please see HyperlinkToolbarAppearanceProps
			if (currentAppearance) {
				const showDatasourceAppearance = allowDatasource && url;

				toolbarItems.unshift(
					...getToolbarViewedItem(url, currentAppearance),
					areAllNewToolbarFlagsDisabled
						? {
								type: 'custom',
								fallback: [],
								render: (editorView) => (
									<LinkToolbarAppearance
										key="link-appearance"
										url={url}
										intl={intl}
										currentAppearance={currentAppearance}
										editorView={editorView}
										editorState={state}
										allowEmbeds={allowEmbeds}
										allowBlockCards={allowBlockCards}
										editorAnalyticsApi={editorAnalyticsApi}
										showUpgradeDiscoverability={showUpgradeDiscoverability}
										areAnyNewToolbarFlagsEnabled={false}
									/>
								),
							}
						: getLinkAppearanceDropdown({
								url,
								intl,
								currentAppearance,
								editorState: state,
								allowEmbeds,
								allowBlockCards: allowBlockCards,
								editorAnalyticsApi,
								allowDatasource: cardOptions.allowDatasource,
								showUpgradeDiscoverability: showUpgradeDiscoverability,
								settingsConfig: getSettingsButton(
									intl,
									editorAnalyticsApi,
									cardOptions.userPreferencesLink,
								),
								isDatasourceView: isDatasource,
								areAnyNewToolbarFlagsEnabled: !areAllNewToolbarFlagsDisabled,
							}),
					...(showDatasourceAppearance && areAllNewToolbarFlagsDisabled
						? [
								{
									type: 'custom',
									fallback: [],
									render: (editorView) => (
										<DatasourceAppearanceButton
											intl={intl}
											editorAnalyticsApi={editorAnalyticsApi}
											url={url}
											editorView={editorView}
											editorState={state}
											inputMethod={INPUT_METHOD.FLOATING_TB}
											areAnyNewToolbarFlagsEnabled={!areAllNewToolbarFlagsDisabled}
										/>
									),
								} satisfies FloatingToolbarItem<never>,
							]
						: []),
					...(!areAllNewToolbarFlagsDisabled
						? []
						: [{ type: 'separator' } as FloatingToolbarItem<Command>]),
				);
			}

			if (!areAllNewToolbarFlagsDisabled) {
				const hoverDecorationProps = (nodeType: NodeType | NodeType[], className?: string) => ({
					onMouseEnter: hoverDecoration?.(nodeType, true, className),
					onMouseLeave: hoverDecoration?.(nodeType, false, className),
					onFocus: hoverDecoration?.(nodeType, true, className),
					onBlur: hoverDecoration?.(nodeType, false, className),
				});
				// testId is required to show focus on trigger button on ESC key press
				// see hideOnEsc in platform/packages/editor/editor-plugin-floating-toolbar/src/ui/Dropdown.tsx
				const testId = 'card-overflow-dropdown-trigger';

				const overflowMenuConfig: FloatingToolbarItem<Command>[] = [
					{ type: 'separator', fullHeight: true },
					{
						type: 'overflow-dropdown',
						testId,
						options: [
							{
								title: intl.formatMessage(commonMessages.copyToClipboard),
								onClick: () => {
									pluginInjectionApi?.core?.actions.execute(
										// @ts-ignore
										pluginInjectionApi?.floatingToolbar?.commands.copyNode(
											node.type,
											INPUT_METHOD.FLOATING_TB,
										),
									);
									return true;
								},
								icon: <CopyIcon label={intl.formatMessage(commonMessages.copyToClipboard)} />,
								...hoverDecorationProps(node.type, akEditorSelectedNodeClassName),
							},
							{
								title: intl.formatMessage(commonMessages.delete),
								onClick: withToolbarMetadata(removeCard(editorAnalyticsApi)),
								icon: <DeleteIcon label={intl.formatMessage(commonMessages.delete)} />,
								...hoverDecorationProps(node.type),
							},
						],
					},
				];
				toolbarItems.push(...overflowMenuConfig);
			}

			return toolbarItems;
		}
	};

const getUnlinkButtonGroup = (
	state: EditorState,
	intl: IntlShape,
	node: Node,
	inlineCard: NodeType,
	editorAnalyticsApi: EditorAnalyticsAPI | undefined,
	areAnyNewToolbarFlagsEnabled?: boolean,
) => {
	return node.type === inlineCard
		? ([
				{
					id: 'editor.link.unlink',
					focusEditoronEnter: true,
					type: 'button',
					title: intl.formatMessage(linkToolbarMessages.unlink),
					icon: LinkBrokenIcon,
					iconFallback: UnlinkIcon,
					onClick: withToolbarMetadata(unlinkCard(node, state, editorAnalyticsApi)),
				},
				...(areAnyNewToolbarFlagsEnabled ? [] : [{ type: 'separator' }]),
			] as Array<FloatingToolbarItem<Command>>)
		: [];
};

export const getSettingsButton = (
	intl: IntlShape,
	editorAnalyticsApi: EditorAnalyticsAPI | undefined,
	userPreferencesLink?: string,
): FloatingToolbarItem<Command> => {
	return {
		id: 'editor.link.settings',
		type: 'button',
		icon: SettingsIcon,
		iconFallback: CogIcon,
		title: intl.formatMessage(linkToolbarMessages.settingsLink),
		onClick: openLinkSettings(editorAnalyticsApi),
		href: userPreferencesLink || getLinkPreferencesURLFromENV(),
		target: '_blank',
	};
};

const getDatasourceButtonGroup = (
	metadata: { [key: string]: string },
	intl: IntlShape,
	editorAnalyticsApi: EditorAnalyticsAPI | undefined,
	node: Node,
	hoverDecoration: HoverDecorationHandler | undefined,
	datasourceId: string,
	state: EditorState,
	cardOptions: CardOptions,
	currentAppearance: CardAppearance | undefined,
	pluginInjectionApi?: ExtractInjectionAPI<typeof cardPlugin>,
): FloatingToolbarItem<Command>[] => {
	const toolbarItems: Array<FloatingToolbarItem<Command>> = [];
	const areAllNewToolbarFlagsDisabled = !areToolbarFlagsEnabled(
		Boolean(pluginInjectionApi?.toolbar),
	);

	const canShowAppearanceSwitch = () => {
		// we do not show smart-link or the datasource icons when the node does not have a url to resolve
		if (!metadata.url) {
			return false;
		}
		return true;
	};

	if (canShowAppearanceSwitch()) {
		const { allowBlockCards, allowEmbeds, showUpgradeDiscoverability } = cardOptions;

		const { url } = metadata;

		if (areAllNewToolbarFlagsDisabled) {
			toolbarItems.push(
				{
					type: 'custom',
					fallback: [],
					render: (editorView) => {
						return (
							<LinkToolbarAppearance
								key="link-appearance"
								url={url}
								intl={intl}
								currentAppearance={currentAppearance}
								editorView={editorView}
								editorState={state}
								allowEmbeds={allowEmbeds}
								allowBlockCards={allowBlockCards}
								editorAnalyticsApi={editorAnalyticsApi}
								showUpgradeDiscoverability={showUpgradeDiscoverability}
								isDatasourceView
								areAnyNewToolbarFlagsEnabled={false}
							/>
						);
					},
				},
				{
					type: 'custom',
					fallback: [],
					render: (editorView) => (
						<DatasourceAppearanceButton
							intl={intl}
							editorAnalyticsApi={editorAnalyticsApi}
							url={url}
							editorView={editorView}
							editorState={state}
							selected={true}
							inputMethod={INPUT_METHOD.FLOATING_TB}
							areAnyNewToolbarFlagsEnabled={!areAllNewToolbarFlagsDisabled}
						/>
					),
				} satisfies FloatingToolbarItem<never>,
				{ type: 'separator' },
			);
		} else {
			toolbarItems.push(
				getLinkAppearanceDropdown({
					url,
					intl,
					currentAppearance,
					editorState: state,
					allowEmbeds,
					allowBlockCards: allowBlockCards,
					editorAnalyticsApi,
					allowDatasource: cardOptions.allowDatasource,
					showUpgradeDiscoverability: showUpgradeDiscoverability,
					settingsConfig: getSettingsButton(
						intl,
						editorAnalyticsApi,
						cardOptions.userPreferencesLink,
					),
					isDatasourceView: true,
					areAnyNewToolbarFlagsEnabled: !areAllNewToolbarFlagsDisabled,
				}),

				{ type: 'separator' },
			);
		}
	}

	const openLinkInputMethod = INPUT_METHOD.FLOATING_TB;

	toolbarItems.push({
		type: 'custom',
		fallback: [],
		render: (editorView) => (
			<EditToolbarButton
				datasourceId={datasourceId}
				node={node}
				key="edit-toolbar-item"
				url={metadata.url}
				intl={intl}
				editorAnalyticsApi={editorAnalyticsApi}
				editorView={editorView}
				onLinkEditClick={getEditLinkCallback(editorAnalyticsApi, false)}
				currentAppearance="datasource"
				areAnyNewToolbarFlagsEnabled={!areAllNewToolbarFlagsDisabled}
			/>
		),
	});

	if (node?.attrs?.url) {
		toolbarItems.push({
			id: 'editor.link.openLink',
			type: 'button',
			icon: LinkExternalIcon,
			iconFallback: OpenIcon,
			metadata: metadata,
			className: 'hyperlink-open-link',
			title: intl.formatMessage(linkMessages.openLink),
			onClick: visitCardLinkAnalytics(editorAnalyticsApi, openLinkInputMethod),
			href: node.attrs.url,
			target: '_blank',
		});
		if (areAllNewToolbarFlagsDisabled) {
			toolbarItems.push({ type: 'separator' });
		}
	}

	if (areAllNewToolbarFlagsDisabled) {
		toolbarItems.push(
			{
				type: 'copy-button',
				supportsViewMode: true,
				items: [
					{
						state,
						formatMessage: intl.formatMessage,
						nodeType: node.type,
					},
				],
			},
			{ type: 'separator' },
			getSettingsButton(intl, editorAnalyticsApi, cardOptions?.userPreferencesLink),
			{ type: 'separator' },
			{
				id: 'editor.link.delete',
				focusEditoronEnter: true,
				type: 'button',
				appearance: 'danger',
				icon: DeleteIcon,
				iconFallback: RemoveIcon,
				onMouseEnter: hoverDecoration?.(node.type, true),
				onMouseLeave: hoverDecoration?.(node.type, false),
				onFocus: hoverDecoration?.(node.type, true),
				onBlur: hoverDecoration?.(node.type, false),
				title: intl.formatMessage(commonMessages.remove),
				onClick: withToolbarMetadata(removeCard(editorAnalyticsApi)),
			},
		);
	} else {
		// testId is required to show focus on trigger button on ESC key press
		// see hideOnEsc in platform/packages/editor/editor-plugin-floating-toolbar/src/ui/Dropdown.tsx
		const testId = 'datasource-overflow-dropdown-trigger';

		// When canShowAppearanceSwitch is true, and platform_editor_controls is on, the link appearance dropdown shows, which includes a link preference button
		// So only add the link appearance button when canShowAppearanceSwitch is false
		if (!canShowAppearanceSwitch()) {
			const linkPreferenceButton = getSettingsButton(
				intl,
				editorAnalyticsApi,
				cardOptions?.userPreferencesLink,
			);
			toolbarItems.push({ type: 'separator', fullHeight: true }, linkPreferenceButton, {
				type: 'separator',
				fullHeight: true,
			});
		} else {
			toolbarItems.push({ type: 'separator', fullHeight: true });
		}

		const overflowMenuConfig: FloatingToolbarItem<Command>[] = [
			{
				type: 'overflow-dropdown',
				testId,
				options: [
					{
						title: intl.formatMessage(commonMessages.copyToClipboard),
						onClick: () => {
							pluginInjectionApi?.core?.actions.execute(
								// @ts-ignore
								pluginInjectionApi?.floatingToolbar?.commands.copyNode(
									node.type,
									INPUT_METHOD.FLOATING_TB,
								),
							);
							return true;
						},
						onMouseEnter: hoverDecoration?.(node.type, true, akEditorSelectedNodeClassName),
						onMouseLeave: hoverDecoration?.(node.type, false, akEditorSelectedNodeClassName),
						onFocus: hoverDecoration?.(node.type, true, akEditorSelectedNodeClassName),
						onBlur: hoverDecoration?.(node.type, false, akEditorSelectedNodeClassName),
						icon: <CopyIcon label={intl.formatMessage(commonMessages.copyToClipboard)} />,
					},
					{
						title: intl.formatMessage(commonMessages.delete),
						onClick: withToolbarMetadata(removeCard(editorAnalyticsApi)),
						onMouseEnter: hoverDecoration?.(node.type, true),
						onMouseLeave: hoverDecoration?.(node.type, false),
						onFocus: hoverDecoration?.(node.type, true),
						onBlur: hoverDecoration?.(node.type, false),
						icon: <DeleteIcon label={intl.formatMessage(commonMessages.delete)} />,
					},
				],
			},
		];
		toolbarItems.push(...overflowMenuConfig);
	}

	return toolbarItems;
};

export const shouldRenderToolbarPulse = (
	embedEnabled: boolean,
	appearance: string,
	status: string,
	isDiscoverabilityEnabled: boolean,
): boolean => {
	return (
		embedEnabled && appearance === 'inline' && status === 'resolved' && isDiscoverabilityEnabled
	);
};

export const getStartingToolbarItems = (
	options: CardPluginOptions,
	api?: ExtractInjectionAPI<typeof cardPlugin> | undefined,
) => {
	return (
		intl: IntlShape,
		link: string,
		onEditLink: Command,
		metadata: { title: string; url: string },
		state?: EditorState,
	): FloatingToolbarItem<Command>[] => {
		const areAllNewToolbarFlagsDisabled = !areToolbarFlagsEnabled(Boolean(api?.toolbar));

		const editLinkItem: FloatingToolbarItem<Command>[] = options.allowDatasource
			? [
					{
						type: 'custom',
						fallback: [],
						render: (editorView) => {
							if (!editorView) {
								return null;
							}
							return (
								<EditToolbarButton
									key="edit-toolbar-button"
									intl={intl}
									editorAnalyticsApi={api?.analytics?.actions}
									url={link}
									editorView={editorView}
									onLinkEditClick={onEditLink}
									currentAppearance="url"
									areAnyNewToolbarFlagsEnabled={!areAllNewToolbarFlagsDisabled}
								/>
							);
						},
					},
				]
			: [
					{
						id: 'editor.link.edit',
						testId: 'editor.link.edit',
						type: 'button',
						onClick: onEditLink,
						title: intl.formatMessage(linkToolbarMessages.editLink),
						showTitle: editorExperiment('platform_editor_controls', 'variant1') ? false : true,
						metadata: metadata,
						icon: editorExperiment('platform_editor_controls', 'variant1') ? EditIcon : undefined,
					},
					{
						type: 'separator',
					},
				];

		if (!areAllNewToolbarFlagsDisabled) {
			const hyperlinkAppearance = [
				getCustomHyperlinkAppearanceDropdown({
					url: link,
					intl,
					editorAnalyticsApi: api?.analytics?.actions,
					allowDatasource: options.allowDatasource,
					editorPluginApi: api,
					cardOptions: options,
					settingsConfig: getSettingsButton(
						intl,
						api?.analytics?.actions,
						options.userPreferencesLink,
					),
					isDatasourceView: false,
				}),
			];

			return [
				{
					type: 'custom',
					fallback: [],
					render: (editorView) => (
						<ToolbarViewedEvent
							key="edit.link.menu.viewed"
							url={link}
							display="url"
							editorView={editorView}
						/>
					),
				},
				...hyperlinkAppearance,
				...editLinkItem,
			];
		}

		return [
			{
				type: 'custom',
				fallback: [],
				render: (editorView) => (
					<ToolbarViewedEvent
						key="edit.link.menu.viewed"
						url={link}
						display="url"
						editorView={editorView}
					/>
				),
			},
			{
				type: 'custom',
				fallback: [],
				render: (editorView) => {
					if (!editorView) {
						return null;
					}
					return (
						<HyperlinkToolbarAppearance
							key="link-appearance"
							url={link}
							intl={intl}
							editorView={editorView}
							editorState={editorView.state}
							cardOptions={options}
							editorAnalyticsApi={api?.analytics?.actions}
							editorPluginApi={api}
						/>
					);
				},
			},

			...editLinkItem,
		];
	};
};

export const getEndingToolbarItems =
	(options: CardPluginOptions, api?: ExtractInjectionAPI<typeof cardPlugin> | undefined) =>
	(intl: IntlShape, link: string): FloatingToolbarItem<Command>[] => {
		/**
		 * Require either provider to be supplied (controls link preferences)
		 * Or explicit user preferences config in order to enable button
		 */
		if (
			(options.provider || options.userPreferencesLink) &&
			!areToolbarFlagsEnabled(Boolean(api?.toolbar))
		) {
			return [
				{ type: 'separator' },
				getSettingsButton(intl, api?.analytics?.actions, options.userPreferencesLink),
			];
		}

		return [];
	};
