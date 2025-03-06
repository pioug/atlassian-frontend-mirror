import React from 'react';

import type { IntlShape } from 'react-intl-next';

import { isSafeUrl } from '@atlaskit/adf-schema';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { linkMessages, linkToolbarMessages } from '@atlaskit/editor-common/messages';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type {
	Command,
	ExtractInjectionAPI,
	FloatingToolbarConfig,
	FloatingToolbarItem,
	FloatingToolbarOverflowDropdownOptions,
} from '@atlaskit/editor-common/types';
import { RECENT_SEARCH_HEIGHT_IN_PX, RECENT_SEARCH_WIDTH_IN_PX } from '@atlaskit/editor-common/ui';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import LinkIcon from '@atlaskit/icon/core/link';
import LinkExternalIcon from '@atlaskit/icon/core/link-external';

import type { MediaNextEditorPluginType } from '../../mediaPluginType';
import {
	hideLinkingToolbar,
	setUrlToMedia,
	showLinkingToolbar,
	unlink,
} from '../../pm-plugins/commands/linking';
import { getMediaLinkingState } from '../../pm-plugins/linking';
import type { MediaLinkingState } from '../../pm-plugins/linking/types';
import {
	currentMediaInlineNode,
	currentMediaNode,
} from '../../pm-plugins/utils/current-media-node';
import type { MediaToolbarBaseConfig } from '../../types';
import MediaLinkingToolbar from '../../ui/MediaLinkingToolbar';

const FORCE_FOCUS_SELECTOR = '[data-testid="add-link-button"],[data-testid="edit-link-button"]';

export function shouldShowMediaLinkToolbar(editorState: EditorState): boolean {
	const mediaLinkingState = getMediaLinkingState(editorState);
	if (!mediaLinkingState || mediaLinkingState.mediaPos === null) {
		return false;
	}
	const {
		nodes: { media, mediaInline },
		marks: { link },
	} = editorState.schema;
	const node = editorState.doc.nodeAt(mediaLinkingState.mediaPos);

	if (!node || ![media, mediaInline].includes(node.type)) {
		return false;
	}

	const { parent } = editorState.doc.resolve(mediaLinkingState.mediaPos);

	return parent && parent.type.allowsMarkType(link);
}

export const getLinkingToolbar = (
	toolbarBaseConfig: MediaToolbarBaseConfig,
	mediaLinkingState: MediaLinkingState,
	state: EditorState,
	intl: IntlShape,
	pluginInjectionApi: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined,
	providerFactory?: ProviderFactory,
): FloatingToolbarConfig | undefined => {
	const { link, visible, editable: editing, mediaPos } = mediaLinkingState;

	if (visible && mediaPos !== null) {
		const node = state.doc.nodeAt(mediaPos);
		if (node) {
			return {
				...toolbarBaseConfig,
				height: RECENT_SEARCH_HEIGHT_IN_PX,
				width: RECENT_SEARCH_WIDTH_IN_PX,
				forcePlacement: true,
				items: [
					{
						type: 'custom',
						fallback: [],
						disableArrowNavigation: true,
						render: (view, idx) => {
							if (!view || !providerFactory) {
								return null;
							}

							return (
								<MediaLinkingToolbar
									key={idx}
									displayUrl={link}
									providerFactory={providerFactory}
									intl={intl}
									editing={editing}
									onUnlink={() =>
										unlink(pluginInjectionApi?.analytics?.actions)(view.state, view.dispatch, view)
									}
									onBack={(href, meta) => {
										if (href.trim() && meta.inputMethod) {
											setUrlToMedia(href, meta.inputMethod, pluginInjectionApi?.analytics?.actions)(
												view.state,
												view.dispatch,
												view,
											);
										}
										hideLinkingToolbar(view.state, view.dispatch, view);
									}}
									onCancel={() => {
										hideLinkingToolbar(view.state, view.dispatch, view, true);
										/** Focus should move to the 'Add link' button when the toolbar closes
										 * and not close the floating toolbar.
										 */
										const {
											state: { tr },
											dispatch,
										} = view;
										pluginInjectionApi?.floatingToolbar?.actions?.forceFocusSelector(
											FORCE_FOCUS_SELECTOR,
										)(tr);
										dispatch(tr);
									}}
									onSubmit={(href, meta) => {
										setUrlToMedia(href, meta.inputMethod, pluginInjectionApi?.analytics?.actions)(
											view.state,
											view.dispatch,
											view,
										);
										hideLinkingToolbar(view.state, view.dispatch, view);
									}}
									onBlur={() => {
										hideLinkingToolbar(view.state, view.dispatch, view);
									}}
								/>
							);
						},
					},
				],
			};
		}
	}
};

const mediaTypes = ['image', 'video', 'audio', 'doc', 'archive', 'unknown'];

const getMediaType = (selectedNodeTypeSingle: string) => {
	return mediaTypes.find((type) => selectedNodeTypeSingle?.includes(type));
};

export const getLinkingDropdownOptions = (
	editorState: EditorState,
	intl: IntlShape,
	mediaLinkingState: MediaLinkingState,
	isInlineNode?: boolean,
	allowLinking?: boolean,
	isViewOnly?: boolean,
): FloatingToolbarOverflowDropdownOptions<Command> => {
	if (isViewOnly || !allowLinking || !shouldShowMediaLinkToolbar(editorState)) {
		return [];
	}

	let mediaType: string | undefined;
	const mediaNode = isInlineNode
		? currentMediaInlineNode(editorState)
		: currentMediaNode(editorState);
	if (mediaNode) {
		const selectedNodeTypeSingle = mediaNode?.attrs.__fileMimeType;
		mediaType = getMediaType(selectedNodeTypeSingle);
	}

	if (mediaType !== 'external' && mediaType !== 'image') {
		return [];
	}

	if (mediaLinkingState && mediaLinkingState.editable) {
		const title = intl.formatMessage(linkToolbarMessages.editLink);
		return [
			{
				title,
				onClick: (editorState, dispatch, editorView) => {
					if (editorView) {
						const { state, dispatch } = editorView;
						showLinkingToolbar(state, dispatch);
					}
					return true;
				},
				icon: <LinkIcon label={title} />,
			},
		];
	} else {
		const title = intl.formatMessage(linkToolbarMessages.addLink);
		return [
			{
				title,
				onClick: (editorState, dispatch, editorView) => {
					if (editorView) {
						const { state, dispatch } = editorView;
						showLinkingToolbar(state, dispatch);
					}
					return true;
				},
				icon: <LinkIcon label={title} />,
			},
		];
	}
};

export const getOpenLinkToolbarButtonOption = (
	intl: IntlShape,
	mediaLinkingState: MediaLinkingState,
	pluginInjectionApi: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined,
): FloatingToolbarItem<Command> => {
	const isValidUrl = isSafeUrl(mediaLinkingState.link);
	const linkTitle = intl.formatMessage(
		isValidUrl ? linkMessages.openLink : linkToolbarMessages.unableToOpenLink,
	);

	return {
		id: 'editor.media.open-link',
		testId: 'open-link-toolbar-button',
		type: 'button',
		icon: LinkExternalIcon,
		title: linkTitle,
		target: '_blank',
		href: isValidUrl ? mediaLinkingState.link : undefined,
		disabled: !isValidUrl,
		onClick: (state, dispatch, editorView) => {
			if (editorView) {
				const {
					state: { tr },
					dispatch,
				} = editorView;
				pluginInjectionApi?.analytics?.actions.attachAnalyticsEvent({
					eventType: EVENT_TYPE.TRACK,
					action: ACTION.VISITED,
					actionSubject: ACTION_SUBJECT.MEDIA,
					actionSubjectId: ACTION_SUBJECT_ID.LINK,
				})(tr);
				dispatch(tr);
			}
			return true;
		},
		supportsViewMode: true,
	};
};
