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
	buildOpenedSettingsPayload,
	buildVisitedLinkPayload,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import type { CardOptions } from '@atlaskit/editor-common/card';
import { buildLayoutButtons, commandWithMetadata } from '@atlaskit/editor-common/card';
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
import CommentIcon from '@atlaskit/icon/core/comment';
import CopyIcon from '@atlaskit/icon/core/copy';
import DeleteIcon from '@atlaskit/icon/core/delete';
import LinkIcon from '@atlaskit/icon/core/link';
import LinkBrokenIcon from '@atlaskit/icon/core/link-broken';
import LinkExternalIcon from '@atlaskit/icon/core/link-external';
import SettingsIcon from '@atlaskit/icon/core/settings';
import LegacyCommentIcon from '@atlaskit/icon/glyph/comment';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import CogIcon from '@atlaskit/icon/glyph/editor/settings';
import UnlinkIcon from '@atlaskit/icon/glyph/editor/unlink';
import OpenIcon from '@atlaskit/icon/glyph/shortcut';
import { fg } from '@atlaskit/platform-feature-flags';
import type { CardAppearance } from '@atlaskit/smart-card';
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
import { getHyperlinkAppearanceDropdown } from './HyperlinkToolbarAppearanceDropdown';
import { LinkToolbarAppearance } from './LinkToolbarAppearance';
import { getLinkAppearanceDropdown } from './LinkToolbarAppearanceDropdown';
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
					inputMethod: INPUT_METHOD.TOOLBAR,
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

export const visitCardLink =
	(editorAnalyticsApi: EditorAnalyticsAPI | undefined): Command =>
	(state, dispatch) => {
		if (!(state.selection instanceof NodeSelection)) {
			return false;
		}

		const { type } = state.selection.node;
		const { url } = titleUrlPairFromNode(state.selection.node);

		// All card links should open in the same tab per https://product-fabric.atlassian.net/browse/MS-1583.
		// We are in edit mode here, open the smart card URL in a new window.
		window.open(url);

		if (dispatch) {
			const { tr } = state;
			editorAnalyticsApi?.attachAnalyticsEvent(
				buildVisitedLinkPayload(
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
					return element.querySelector(`.${richMediaClassName}`) as HTMLElement;
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
): FloatingToolbarItem<Command>[] => {
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
			node.type === state.schema.nodes.inlineCard &&
			fg('platform_inline_node_as_valid_annotation_selection');

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

			const toolbarItems: Array<FloatingToolbarItem<Command>> = editorExperiment(
				'platform_editor_controls',
				'control',
			)
				? [
						...editItems,
						...commentItems,
						{
							id: 'editor.link.openLink',
							type: 'button',
							icon: LinkExternalIcon,
							iconFallback: OpenIcon,
							metadata: metadata,
							className: 'hyperlink-open-link',
							title: intl.formatMessage(linkMessages.openLink),
							onClick: visitCardLink(editorAnalyticsApi),
						},
						{ type: 'separator' },
						...getUnlinkButtonGroup(state, intl, node, inlineCard, editorAnalyticsApi),
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
						{
							id: 'editor.link.edit',
							type: 'button',
							selected: false,
							metadata: metadata,
							title: intl.formatMessage(linkToolbarMessages.editLink),
							icon: LinkIcon,
							testId: 'link-toolbar-edit-link-button',
							onClick: getEditLinkCallback(editorAnalyticsApi, true),
						},
						{ type: 'separator' },
						...getUnlinkButtonGroup(state, intl, node, inlineCard, editorAnalyticsApi),
						{
							id: 'editor.link.openLink',
							type: 'button',
							icon: LinkExternalIcon,
							iconFallback: OpenIcon,
							metadata: metadata,
							className: 'hyperlink-open-link',
							title: intl.formatMessage(linkMessages.openLink),
							onClick: visitCardLink(editorAnalyticsApi),
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
				);
				if (alignmentOptions.length) {
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
					editorExperiment('platform_editor_controls', 'control')
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
							}),
					...(showDatasourceAppearance && editorExperiment('platform_editor_controls', 'control')
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
										/>
									),
								} satisfies FloatingToolbarItem<never>,
							]
						: []),

					{
						type: 'separator',
					},
				);
			}

			if (editorExperiment('platform_editor_controls', 'variant1')) {
				const overflowMenuConfig: FloatingToolbarItem<Command>[] = [
					{ type: 'separator', fullHeight: true },
					{
						type: 'overflow-dropdown',
						options: [
							{
								title: 'Copy',
								onClick: () => {
									pluginInjectionApi?.core?.actions.execute(
										// @ts-ignore
										pluginInjectionApi?.floatingToolbar?.commands.copyNode(node.type),
									);
									return true;
								},
								icon: <CopyIcon label="Copy" />,
							},
							{
								title: 'Delete',
								onClick: withToolbarMetadata(removeCard(editorAnalyticsApi)),
								icon: <DeleteIcon label="Delete" />,
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
				{ type: 'separator' },
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
): FloatingToolbarItem<Command>[] => {
	const toolbarItems: Array<FloatingToolbarItem<Command>> = [];

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

		if (editorExperiment('platform_editor_controls', 'control')) {
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
				}),

				{ type: 'separator' },
			);
		}
	}

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
			/>
		),
	});

	if (node?.attrs?.url) {
		toolbarItems.push(
			{
				id: 'editor.link.openLink',
				type: 'button',
				icon: LinkExternalIcon,
				iconFallback: OpenIcon,
				metadata: metadata,
				className: 'hyperlink-open-link',
				title: intl.formatMessage(linkMessages.openLink),
				onClick: visitCardLink(editorAnalyticsApi),
			},
			{ type: 'separator' },
		);
	}

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
		metadata: { url: string; title: string },
		state?: EditorState,
	): FloatingToolbarItem<Command>[] => {
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
						showTitle: true,
						metadata: metadata,
					},
					{
						type: 'separator',
					},
				];

		if (editorExperiment('platform_editor_controls', 'variant1')) {
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
				getHyperlinkAppearanceDropdown({
					url: link,
					intl,
					editorState: state,
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
				{ type: 'separator' },
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
			editorExperiment('platform_editor_controls', 'control')
		) {
			return [
				{ type: 'separator' },
				getSettingsButton(intl, api?.analytics?.actions, options.userPreferencesLink),
			];
		}

		return [];
	};
