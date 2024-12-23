import React from 'react';

import type { IntlShape } from 'react-intl-next';

import { AnalyticsContext } from '@atlaskit/analytics-next';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { ACTION, INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { OptionConfig } from '@atlaskit/editor-common/card';
import {
	commandWithMetadata,
	getButtonGroupOption,
	LinkToolbarButtonGroup,
} from '@atlaskit/editor-common/card';
import nodeNames, { cardMessages as messages } from '@atlaskit/editor-common/messages';
import type { CardAppearance } from '@atlaskit/editor-common/provider-factory';
import type { Command } from '@atlaskit/editor-common/types';
import { isSupportedInParent } from '@atlaskit/editor-common/utils';
import { Fragment } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { CardContext } from '@atlaskit/link-provider';

import { changeSelectedCardToLink, setSelectedCardAppearance } from '../pm-plugins/doc';
import { getResolvedAttributesFromStore } from '../pm-plugins/utils';

import { LOCAL_STORAGE_DISCOVERY_KEY_TOOLBAR } from './local-storage';
import { DiscoveryPulse } from './Pulse';
import { shouldRenderToolbarPulse } from './toolbar';
import { WithCardContext } from './WithCardContext';

export interface LinkToolbarAppearanceProps {
	intl: IntlShape;
	editorAnalyticsApi: EditorAnalyticsAPI | undefined;
	currentAppearance?: CardAppearance;
	editorState: EditorState;
	editorView?: EditorView;
	url?: string;
	allowEmbeds?: boolean;
	allowBlockCards?: boolean;
	showUpgradeDiscoverability?: boolean;
	isDatasourceView?: boolean;
}
// eslint-disable-next-line @repo/internal/react/no-class-components
export class LinkToolbarAppearance extends React.Component<LinkToolbarAppearanceProps, Object> {
	renderDropdown = (view?: EditorView, cardContext?: CardContext) => {
		const {
			url,
			intl,
			currentAppearance,
			editorState,
			allowEmbeds,
			allowBlockCards = true,
			editorAnalyticsApi,
			showUpgradeDiscoverability = true,
			isDatasourceView,
		} = this.props;
		const preview =
			allowEmbeds && cardContext && url && cardContext.extractors.getPreview(url, 'web');

		const defaultCommand: Command = () => false;

		if (url) {
			const urlState = cardContext?.store?.getState()[url];
			if (urlState?.error?.kind === 'fatal') {
				return null;
			}
		}

		const isBlockCardLinkSupportedInParent = allowBlockCards
			? isSupportedInParent(
					editorState,
					Fragment.from(editorState.schema.nodes.blockCard.createChecked({})),
					currentAppearance,
				)
			: false;

		const isEmbedCardLinkSupportedInParent = allowEmbeds
			? isSupportedInParent(
					editorState,
					Fragment.from(editorState.schema.nodes.embedCard.createChecked({})),
					currentAppearance,
				)
			: false;

		const embedOption = allowEmbeds &&
			preview && {
				appearance: 'embed' as const,
				title: intl.formatMessage(messages.embed),
				onClick: setSelectedCardAppearance('embed', editorAnalyticsApi) ?? defaultCommand,
				selected: currentAppearance === 'embed',
				hidden: false,
				testId: 'embed-appearance',
				disabled: !isEmbedCardLinkSupportedInParent,
				tooltip: isEmbedCardLinkSupportedInParent
					? undefined
					: getUnavailableMessage(editorState, intl),
			};

		const blockCardOption = allowBlockCards && {
			appearance: 'block' as const,
			title: intl.formatMessage(messages.block),
			onClick: setSelectedCardAppearance('block', editorAnalyticsApi) ?? defaultCommand,
			selected: currentAppearance === 'block' && !isDatasourceView,
			testId: 'block-appearance',
			disabled: !isBlockCardLinkSupportedInParent,
			tooltip: isBlockCardLinkSupportedInParent
				? undefined
				: getUnavailableMessage(editorState, intl),
		};

		const options: OptionConfig[] = [
			{
				title: intl.formatMessage(messages.url),
				onClick: commandWithMetadata(
					changeSelectedCardToLink(url, url, true, undefined, undefined, editorAnalyticsApi) ??
						defaultCommand,
					{
						action: ACTION.CHANGED_TYPE,
					},
				),
				selected: !currentAppearance && !isDatasourceView,
				testId: 'url-appearance',
			},
			{
				appearance: 'inline',
				title: intl.formatMessage(messages.inline),
				onClick: setSelectedCardAppearance('inline', editorAnalyticsApi) ?? defaultCommand,
				selected: currentAppearance === 'inline',
				testId: 'inline-appearance',
			},
		];

		const dispatchCommand = (fn?: Function) => {
			fn && fn(editorState, view && view.dispatch);
			// Refocus the view to ensure the editor has focus
			if (view && !view.hasFocus()) {
				view.focus();
			}
		};

		if (blockCardOption) {
			options.push(blockCardOption);
		}

		if (embedOption) {
			options.push(embedOption);
		}

		const LinkToolbarButtons = (
			<LinkToolbarButtonGroup
				key="link-toolbar-button-group"
				options={options.map((option) =>
					getButtonGroupOption(intl, dispatchCommand, {
						...option,
						onClick: commandWithMetadata(option.onClick, {
							inputMethod: INPUT_METHOD.FLOATING_TB,
						}),
					}),
				)}
			/>
		);

		const status = url ? cardContext?.store?.getState()[url]?.status : '';
		const embedEnabled = embedOption ? !embedOption.disabled : false;
		if (
			shouldRenderToolbarPulse(
				embedEnabled,
				currentAppearance ?? '',
				status ?? '',
				showUpgradeDiscoverability,
			)
		) {
			const resolvedAnalyticsAttributes = getResolvedAttributesFromStore(
				url || '',
				currentAppearance || null,
				cardContext?.store,
			);

			return (
				<AnalyticsContext data={{ attributes: { ...resolvedAnalyticsAttributes } }}>
					<DiscoveryPulse
						localStorageKey={LOCAL_STORAGE_DISCOVERY_KEY_TOOLBAR}
						testId="toolbar-discovery-pulse"
					>
						{LinkToolbarButtons}
					</DiscoveryPulse>
				</AnalyticsContext>
			);
		}

		return LinkToolbarButtons;
	};

	render() {
		const { editorView } = this.props;

		return (
			<WithCardContext>
				{(cardContext) => this.renderDropdown(editorView, cardContext && cardContext.value)}
			</WithCardContext>
		);
	}
}

const getUnavailableMessage = (state: EditorState, intl: IntlShape): string => {
	try {
		const parentNode = state.selection.$from.node(1);
		const parentName = intl.formatMessage(
			nodeNames[parentNode.type.name as keyof typeof nodeNames],
		);
		const tooltip = intl.formatMessage(messages.displayOptionUnavailableInParentNode, {
			node: parentName,
		});
		return tooltip;
	} catch (e) {
		return intl.formatMessage(messages.displayOptionUnavailableInParentNode, {
			node: intl.formatMessage(nodeNames.defaultBlockNode),
		});
	}
};
