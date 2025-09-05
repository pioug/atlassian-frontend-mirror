import React, { useRef } from 'react';

import type { LinkAttributes } from '@atlaskit/adf-schema';
import { isSafeUrl } from '@atlaskit/adf-schema';
import type {
	AnalyticsEventPayload,
	EditorAnalyticsAPI,
	LinkType,
} from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT_ID,
	INPUT_METHOD,
	buildVisitedLinkPayload,
} from '@atlaskit/editor-common/analytics';
import { commandWithMetadata } from '@atlaskit/editor-common/card';
import {
	type NamedPluginStatesFromInjectionAPI,
	useSharedPluginStateWithSelector,
} from '@atlaskit/editor-common/hooks';
import type {
	EditInsertedState,
	HyperlinkAddToolbarProps,
	HyperlinkState,
	InsertState,
} from '@atlaskit/editor-common/link';
import { HyperlinkAddToolbar } from '@atlaskit/editor-common/link';
import {
	linkMessages,
	linkToolbarMessages as linkToolbarCommonMessages,
} from '@atlaskit/editor-common/messages';
import { areToolbarFlagsEnabled } from '@atlaskit/editor-common/toolbar-flag-check';
import type {
	AlignType,
	Command,
	CommandDispatch,
	ExtractInjectionAPI,
	FloatingToolbarHandler,
	FloatingToolbarItem,
	HyperlinkPluginOptions,
} from '@atlaskit/editor-common/types';
import {
	LINKPICKER_HEIGHT_IN_PX,
	RECENT_SEARCH_HEIGHT_IN_PX,
	RECENT_SEARCH_WIDTH_IN_PX,
} from '@atlaskit/editor-common/ui';
import { UserIntentPopupWrapper } from '@atlaskit/editor-common/user-intent';
import { normalizeUrl } from '@atlaskit/editor-common/utils';
import type { Mark } from '@atlaskit/editor-prosemirror/model';
import { TextSelection, type EditorState } from '@atlaskit/editor-prosemirror/state';
import { findDomRefAtPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import EditIcon from '@atlaskit/icon/core/edit';
import LinkBrokenIcon from '@atlaskit/icon/core/migration/link-broken--editor-unlink';
import LinkExternalIcon from '@atlaskit/icon/core/migration/link-external--shortcut';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import {
	editInsertedLink,
	insertLinkWithAnalytics,
	onClickAwayCallback,
	onEscapeCallback,
	removeLink,
	updateLink,
} from '../../editor-commands/commands';
import type { HyperlinkPlugin } from '../../hyperlinkPluginType';
import { stateKey } from '../../pm-plugins/main';
import { toolbarKey } from '../../pm-plugins/toolbar-buttons';

/* type guard for edit links */
function isEditLink(linkMark: EditInsertedState | InsertState): linkMark is EditInsertedState {
	return (linkMark as EditInsertedState).pos !== undefined;
}

const dispatchAnalytics = (
	dispatch: CommandDispatch | undefined,
	state: EditorState,
	analyticsBuilder: (type: LinkType) => AnalyticsEventPayload<void>,
	editorAnalyticsApi: EditorAnalyticsAPI | undefined,
) => {
	if (dispatch) {
		const { tr } = state;
		editorAnalyticsApi?.attachAnalyticsEvent(analyticsBuilder(ACTION_SUBJECT_ID.HYPERLINK))(tr);
		dispatch(tr);
	}
};

const visitHyperlink =
	(editorAnalyticsApi: EditorAnalyticsAPI | undefined): Command =>
	(state, dispatch) => {
		dispatchAnalytics(dispatch, state, buildVisitedLinkPayload, editorAnalyticsApi);
		return true;
	};

function getLinkText(
	activeLinkMark: EditInsertedState,
	state: EditorState,
): string | undefined | null {
	if (!activeLinkMark.node) {
		return undefined;
	}

	const textToUrl = normalizeUrl(activeLinkMark.node.text);
	const linkMark = activeLinkMark.node.marks.find(
		(mark: Mark) => mark.type === state.schema.marks.link,
	);
	const linkHref = linkMark && linkMark.attrs.href;

	if (textToUrl === linkHref) {
		return undefined;
	}
	return activeLinkMark.node.text;
}

const selector = (
	states: NamedPluginStatesFromInjectionAPI<ExtractInjectionAPI<HyperlinkPlugin>, 'hyperlink'>,
) => {
	return {
		timesViewed: states.hyperlinkState?.timesViewed,
		inputMethod: states.hyperlinkState?.inputMethod,
		searchSessionId: states.hyperlinkState?.searchSessionId,
	};
};

export function HyperlinkAddToolbarWithState({
	linkPickerOptions = {},
	onSubmit,
	displayText,
	displayUrl,
	providerFactory,
	view,
	onCancel,
	invokeMethod,
	lpLinkPicker,
	onClose,
	onEscapeCallback,
	onClickAwayCallback,
	pluginInjectionApi,
}: HyperlinkAddToolbarProps & {
	pluginInjectionApi: ExtractInjectionAPI<HyperlinkPlugin> | undefined;
}) {
	const { timesViewed, inputMethod, searchSessionId } = useSharedPluginStateWithSelector(
		pluginInjectionApi,
		['hyperlink'],
		selector,
	);

	// This is constant rather than dynamic - because if someone's already got a hyperlink toolbar open,
	// we don't want to dynamically change it on them as this would cause data loss if they've already
	// started typing in the fields.
	const isOffline = useRef(
		pluginInjectionApi?.connectivity?.sharedState.currentState()?.mode === 'offline',
	);

	return (
		<HyperlinkAddToolbar
			linkPickerOptions={linkPickerOptions}
			onSubmit={onSubmit}
			displayText={displayText}
			displayUrl={displayUrl}
			providerFactory={providerFactory}
			view={view}
			onCancel={onCancel}
			invokeMethod={invokeMethod}
			lpLinkPicker={lpLinkPicker}
			onClose={onClose}
			onEscapeCallback={onEscapeCallback}
			onClickAwayCallback={onClickAwayCallback}
			timesViewed={timesViewed}
			inputMethod={inputMethod}
			searchSessionId={searchSessionId}
			isOffline={isOffline.current}
		/>
	);
}

export const getToolbarConfig =
	(
		options: HyperlinkPluginOptions,
		pluginInjectionApi: ExtractInjectionAPI<HyperlinkPlugin> | undefined,
	): FloatingToolbarHandler =>
	(state, intl, providerFactory) => {
		if (options.disableFloatingToolbar) {
			return;
		}

		const linkState: HyperlinkState | undefined = stateKey.getState(state);
		const activeLinkMark = linkState?.activeLinkMark;

		// If range selection, we don't show hyperlink floating toolbar.
		// Text Formattting toolbar is shown instaed.
		if (
			state.selection instanceof TextSelection &&
			state.selection.to !== state.selection.from &&
			activeLinkMark?.type === 'EDIT' &&
			editorExperiment('platform_editor_controls', 'variant1')
		) {
			return;
		}

		const { formatMessage } = intl;
		const editorCardActions = pluginInjectionApi?.card?.actions;
		const editorAnalyticsApi = pluginInjectionApi?.analytics?.actions;
		const lpLinkPicker = options.lpLinkPicker ?? true;

		if (activeLinkMark) {
			const hyperLinkToolbar = {
				title: 'Hyperlink floating controls',
				nodeType: [
					state.schema.nodes.text,
					state.schema.nodes.paragraph,
					state.schema.nodes.heading,
					state.schema.nodes.taskItem,
					state.schema.nodes.decisionItem,
					state.schema.nodes.caption,
				].filter((nodeType) => !!nodeType), // Use only the node types existing in the schema ED-6745
				align: 'left' as AlignType,
				className: activeLinkMark.type.match('INSERT|EDIT_INSERTED')
					? 'hyperlink-floating-toolbar'
					: '',
				// getDomRef by default uses view.state.selection.from to position the toolbar.
				// However, when the user clicks in right after the link the view.state.selection.from references to the dom after the selection.
				// So instead we want to use the activeLinkMark.pos which has been calculated as the position before the click so that would be the link node
				getDomRef:
					activeLinkMark &&
					(activeLinkMark.type === 'EDIT_INSERTED' || activeLinkMark.type === 'EDIT') &&
					editorExperiment('platform_editor_controls', 'variant1')
						? (view: EditorView) => {
								const domRef = findDomRefAtPos(activeLinkMark.pos, view.domAtPos.bind(view));
								return domRef instanceof HTMLElement ? domRef : undefined;
							}
						: undefined,
			};

			switch (activeLinkMark.type) {
				case 'EDIT': {
					const { pos, node } = activeLinkMark;
					const linkMark = node.marks.filter((mark) => mark.type === state.schema.marks.link);
					const link = linkMark[0] && (linkMark[0].attrs as LinkAttributes).href;
					const isValidUrl = isSafeUrl(link);
					const labelOpenLink = formatMessage(
						isValidUrl ? linkMessages.openLink : linkToolbarCommonMessages.unableToOpenLink,
					);
					// TODO: ED-14403 - investigate why these are not translating?
					const labelUnlink = formatMessage(linkToolbarCommonMessages.unlink);
					const editLink = formatMessage(linkToolbarCommonMessages.editLink);
					const metadata = {
						url: link,
						title: '',
					};
					if (activeLinkMark.node.text) {
						metadata.title = activeLinkMark.node.text;
					}

					const isNewEditorToolbarEnabled = areToolbarFlagsEnabled();

					const cardActions = pluginInjectionApi?.card?.actions;
					const startingToolbarItems = cardActions?.getStartingToolbarItems(
						intl,
						link,
						editInsertedLink(editorAnalyticsApi),
						metadata,
						isNewEditorToolbarEnabled ? state : undefined,
					) ?? [
						{
							id: 'editor.link.edit',
							testId: 'editor.link.edit',
							type: 'button',
							onClick: editInsertedLink(editorAnalyticsApi),
							title: editLink,
							showTitle: isNewEditorToolbarEnabled ? false : true,
							metadata: metadata,
							icon: isNewEditorToolbarEnabled ? EditIcon : undefined,
						},
						{
							type: 'separator',
						},
					];

					const openLinkButton: FloatingToolbarItem<Command> = {
						id: 'editor.link.openLink',
						testId: 'editor.link.openLink',
						type: 'button',
						disabled: !isValidUrl,
						target: '_blank',
						href: isValidUrl ? link : undefined,
						onClick: visitHyperlink(editorAnalyticsApi),
						title: labelOpenLink,
						icon: LinkExternalIcon,
						className: 'hyperlink-open-link',
						metadata: metadata,
						tabIndex: null,
					};

					const unlinkButton: FloatingToolbarItem<Command> = {
						id: 'editor.link.unlink',
						testId: 'editor.link.unlink',
						type: 'button',
						onClick: commandWithMetadata(removeLink(pos, editorAnalyticsApi), {
							inputMethod: INPUT_METHOD.FLOATING_TB,
						}),
						title: labelUnlink,
						icon: LinkBrokenIcon,
						tabIndex: null,
					};

					const items: Array<FloatingToolbarItem<Command>> = [
						...startingToolbarItems,
						...((isNewEditorToolbarEnabled && fg('platform_editor_controls_patch_15')
							? [
									unlinkButton,
									{
										type: 'separator',
										fullHeight: true,
									},
									openLinkButton,
									{ type: 'separator', fullHeight: true },
								]
							: [
									openLinkButton,
									{
										type: 'separator',
									},
									unlinkButton,
									{ type: 'separator' },
								]) as Array<FloatingToolbarItem<Command>>),

						{
							type: 'copy-button',
							items: [
								{
									state,
									formatMessage: formatMessage,
									markType: state.schema.marks.link,
								},
							],
						},
						...(cardActions?.getEndingToolbarItems(intl, link) ?? []),
					];

					return {
						...hyperLinkToolbar,
						height: 32,
						width: 250,
						items,
						scrollable: true,
					};
				}

				case 'EDIT_INSERTED':
				case 'INSERT': {
					let link: string;

					if (isEditLink(activeLinkMark) && activeLinkMark.node) {
						const linkMark = activeLinkMark.node.marks.filter(
							(mark: Mark) => mark.type === state.schema.marks.link,
						);
						link = linkMark[0] && linkMark[0].attrs.href;
					}
					const displayText = isEditLink(activeLinkMark)
						? getLinkText(activeLinkMark, state)
						: linkState.activeText;

					const popupHeight = lpLinkPicker ? LINKPICKER_HEIGHT_IN_PX : RECENT_SEARCH_HEIGHT_IN_PX;

					return {
						...hyperLinkToolbar,
						preventPopupOverflow: true,
						height: popupHeight,
						width: RECENT_SEARCH_WIDTH_IN_PX,
						items: [
							{
								type: 'custom',
								fallback: [],
								disableArrowNavigation: true,
								render: (view?: EditorView, idx?: number): React.ReactElement | null => {
									if (!view) {
										return null;
									}

									const Toolbar = (
										<HyperlinkAddToolbarWithState
											pluginInjectionApi={pluginInjectionApi}
											view={view}
											key={idx}
											linkPickerOptions={options?.linkPicker}
											lpLinkPicker={lpLinkPicker}
											displayUrl={link}
											displayText={displayText || ''}
											providerFactory={providerFactory}
											onCancel={() => view.focus()}
											onEscapeCallback={onEscapeCallback(editorCardActions)}
											onClickAwayCallback={onClickAwayCallback}
											onSubmit={(href, title = '', displayText, inputMethod, analytic) => {
												const isEdit = isEditLink(activeLinkMark);
												const action = isEdit ? ACTION.UPDATED : ACTION.INSERTED;

												const skipAnalytics = toolbarKey.getState(state)?.skipAnalytics ?? false;

												const command = isEdit
													? commandWithMetadata(
															updateLink(href, displayText || title, activeLinkMark.pos),
															{
																action,
																inputMethod,
																sourceEvent: analytic,
															},
														)
													: insertLinkWithAnalytics(
															inputMethod,
															activeLinkMark.from,
															activeLinkMark.to,
															href,
															editorCardActions,
															editorAnalyticsApi,
															title,
															displayText,
															skipAnalytics,
															analytic,
														);

												command(view.state, view.dispatch, view);

												view.focus();
											}}
										/>
									);
									return editorExperiment('platform_editor_toolbar_aifc', true) &&
										expValEquals('platform_editor_toolbar_aifc_patch_2', 'isEnabled', true) ? (
										<UserIntentPopupWrapper api={pluginInjectionApi}>
											{Toolbar}
										</UserIntentPopupWrapper>
									) : (
										Toolbar
									);
								},
							},
						],
					};
				}
			}
		}
		return;
	};
