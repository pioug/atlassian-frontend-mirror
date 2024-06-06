import React from 'react';

import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import type { ACTION_SUBJECT_ID, EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { ACTION, buildEditLinkPayload, INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { commandWithMetadata } from '@atlaskit/editor-common/card';
import type { HyperlinkAddToolbarProps } from '@atlaskit/editor-common/link';
import { HyperlinkAddToolbar as HyperlinkToolbar } from '@atlaskit/editor-common/link';
import { linkToolbarMessages } from '@atlaskit/editor-common/messages';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type {
	Command,
	ExtractInjectionAPI,
	FloatingToolbarConfig,
	FloatingToolbarItem,
	LinkInputType,
	LinkPickerOptions,
} from '@atlaskit/editor-common/types';
import {
	LINKPICKER_HEIGHT_IN_PX,
	RECENT_SEARCH_HEIGHT_IN_PX,
	RECENT_SEARCH_WIDTH_IN_PX,
} from '@atlaskit/editor-common/ui';
import type { ForceFocusSelector } from '@atlaskit/editor-plugin-floating-toolbar';
import type { Node } from '@atlaskit/editor-prosemirror/model';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { cardPlugin } from '../plugin';
import { hideLinkToolbar, showLinkToolbar } from '../pm-plugins/actions';
import { changeSelectedCardToLink, updateCard } from '../pm-plugins/doc';
import { displayInfoForCard, findCardInfo } from '../utils';

export type EditLinkToolbarProps = {
	view: EditorView;
	providerFactory: ProviderFactory;
	url: string | undefined;
	text: string;
	node: Node;
	onSubmit?: (
		href: string,
		text?: string,
		inputMethod?: LinkInputType,
		analytic?: UIAnalyticsEvent | null | undefined,
	) => void;
	linkPickerOptions?: LinkPickerOptions;
	forceFocusSelector: ForceFocusSelector | undefined;
	lpLinkPicker: boolean;
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
}: HyperlinkAddToolbarProps) {
	return (
		<HyperlinkToolbar
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
		/>
	);
}

// eslint-disable-next-line @repo/internal/react/no-class-components
export class EditLinkToolbar extends React.Component<EditLinkToolbarProps> {
	componentDidUpdate(prevProps: EditLinkToolbarProps) {
		if (prevProps.node !== this.props.node) {
			this.hideLinkToolbar();
		}
	}

	componentWillUnmount() {
		this.hideLinkToolbar();
	}

	private hideLinkToolbar() {
		const { view } = this.props;
		view.dispatch(hideLinkToolbar(view.state.tr));
	}

	render() {
		const {
			linkPickerOptions,
			providerFactory,
			url,
			text,
			view,
			onSubmit,
			forceFocusSelector,
			lpLinkPicker,
		} = this.props;

		return (
			<HyperlinkAddToolbarWithState
				view={view}
				linkPickerOptions={linkPickerOptions}
				providerFactory={providerFactory}
				displayUrl={url}
				displayText={text}
				// Assumes that the smart card link picker can only ever be invoked by clicking "edit"
				// via the floating toolbar
				invokeMethod={INPUT_METHOD.FLOATING_TB}
				lpLinkPicker={lpLinkPicker}
				onSubmit={(href, title, displayText, inputMethod, analytic) => {
					this.hideLinkToolbar();
					if (onSubmit) {
						onSubmit(href, displayText || title, inputMethod, analytic);
					}
				}}
				onEscapeCallback={(state, dispatch) => {
					const { tr } = state;
					hideLinkToolbar(tr);

					forceFocusSelector?.(`[aria-label="${linkToolbarMessages.editLink.defaultMessage}"]`)(tr);

					if (dispatch) {
						dispatch(tr);
						return true;
					}
					return false;
				}}
				onClickAwayCallback={(state, dispatch) => {
					const { tr } = state;

					if (dispatch) {
						dispatch(tr);
						return true;
					}
					return false;
				}}
			/>
		);
	}
}

export const editLink =
	(editorAnalyticsApi: EditorAnalyticsAPI | undefined): Command =>
	(state, dispatch) => {
		let type = 'hyperlink';
		if (state.selection instanceof NodeSelection) {
			type = state.selection.node.type.name;
		}

		if (dispatch) {
			const { tr } = state;
			showLinkToolbar(tr);
			editorAnalyticsApi?.attachAnalyticsEvent(
				buildEditLinkPayload(
					type as
						| ACTION_SUBJECT_ID.CARD_INLINE
						| ACTION_SUBJECT_ID.CARD_BLOCK
						| ACTION_SUBJECT_ID.EMBEDS,
				),
			)(tr);
			dispatch(tr);
			return true;
		}

		return false;
	};

export const buildEditLinkToolbar = ({
	providerFactory,
	node,
	pluginInjectionApi,
	linkPicker,
	lpLinkPicker,
}: {
	providerFactory: ProviderFactory;
	node: Node;
	pluginInjectionApi: ExtractInjectionAPI<typeof cardPlugin> | undefined;
	linkPicker?: LinkPickerOptions;
	lpLinkPicker: boolean;
}): FloatingToolbarItem<Command> => {
	return {
		type: 'custom',
		disableArrowNavigation: true,
		fallback: [],
		render: (view, idx) => {
			if (!view || !providerFactory) {
				return null;
			}

			const displayInfo = displayInfoForCard(node, findCardInfo(view.state));

			return (
				<EditLinkToolbar
					key={idx}
					view={view}
					linkPickerOptions={linkPicker}
					providerFactory={providerFactory}
					url={displayInfo.url}
					text={displayInfo.title || ''}
					node={node}
					lpLinkPicker={lpLinkPicker}
					forceFocusSelector={pluginInjectionApi?.floatingToolbar?.actions?.forceFocusSelector}
					onSubmit={(newHref, newText, inputMethod, analytic) => {
						const urlChanged = newHref !== displayInfo.url;
						const titleChanged = newText !== displayInfo.title;

						// If the title is changed in a smartlink, convert to standard blue hyperlink
						// (even if the url was also changed) - we don't want to lose the custom title.
						if (titleChanged) {
							return commandWithMetadata(
								changeSelectedCardToLink(
									newText,
									newHref,
									undefined,
									undefined,
									undefined,
									pluginInjectionApi?.analytics?.actions,
								),
								{
									action: ACTION.UPDATED,
									inputMethod,
									sourceEvent: analytic,
								},
							)(view.state, view.dispatch);
						}

						if (urlChanged) {
							// If *only* the url is changed in a smart link, reresolve
							return updateCard(newHref, analytic)(view.state, view.dispatch);
						}
					}}
				/>
			);
		},
	};
};

export const editLinkToolbarConfig = (
	showLinkingToolbar: boolean,
	lpLinkPicker?: boolean,
): Partial<FloatingToolbarConfig> => {
	return showLinkingToolbar
		? {
				height: lpLinkPicker ? LINKPICKER_HEIGHT_IN_PX : RECENT_SEARCH_HEIGHT_IN_PX,
				width: RECENT_SEARCH_WIDTH_IN_PX,
				forcePlacement: true,
			}
		: {};
};
