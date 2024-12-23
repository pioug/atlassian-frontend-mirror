import React from 'react';

import type { IntlShape } from 'react-intl-next';

import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { ExtractInjectionAPI, FloatingToolbarConfig } from '@atlaskit/editor-common/types';
import { RECENT_SEARCH_HEIGHT_IN_PX, RECENT_SEARCH_WIDTH_IN_PX } from '@atlaskit/editor-common/ui';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';

import type { MediaNextEditorPluginType } from '../../mediaPluginType';
import { hideLinkingToolbar, setUrlToMedia, unlink } from '../../pm-plugins/commands/linking';
import { getMediaLinkingState } from '../../pm-plugins/linking';
import type { MediaLinkingState } from '../../pm-plugins/linking/types';
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
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/max-params
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
