import React from 'react';

import type { IntlShape } from 'react-intl';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics/api';
import { ACTION, INPUT_METHOD } from '@atlaskit/editor-common/analytics/types/enums';
import { appearancePropsMap } from '@atlaskit/editor-common/card';
import { getDropdownOption } from '@atlaskit/editor-common/card/link-toolbar-dropdown-options';
import type { OptionConfig } from '@atlaskit/editor-common/card/types';
import { commandWithMetadata } from '@atlaskit/editor-common/card/utils';
import nodeNames from '@atlaskit/editor-common/messages';
import { messages } from '@atlaskit/editor-common/messages/card';
import { linkToolbarMessages } from '@atlaskit/editor-common/messages/link-toolbar';
import type { CardAppearance } from '@atlaskit/editor-common/provider-factory/card-provider';
import type { Command } from '@atlaskit/editor-common/types/command';
import type {
	DropdownOptions,
	FloatingToolbarDropdown,
	FloatingToolbarItem,
} from '@atlaskit/editor-common/types/floating-toolbar';
import { isSupportedInParent } from '@atlaskit/editor-common/utils';
import { Fragment } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { useSmartCardContext } from '@atlaskit/link-provider/use-smart-card-context';
import ButtonItem from '@atlaskit/menu/button-item';
import LinkItem from '@atlaskit/menu/link-item';
import MenuGroup from '@atlaskit/menu/menu-group';
import Section from '@atlaskit/menu/section';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/editor-experiment';
import Tooltip from '@atlaskit/tooltip/Tooltip';

import { changeSelectedCardToLink, setSelectedCardAppearance } from '../pm-plugins/doc';
import { pluginKey } from '../pm-plugins/plugin-key';
import type { CardPluginState } from '../types';
import { DatasourceDropdownOption, datasourceDisplayInformation } from './DatasourceDropdownOption';

export interface LinkToolbarAppearanceProps {
	allowBlockCards?: boolean;
	allowEmbeds?: boolean;
	currentAppearance?: CardAppearance;
	editorAnalyticsApi: EditorAnalyticsAPI | undefined;
	editorState: EditorState;
	editorView?: EditorView;
	intl: IntlShape;
	isDatasourceView?: boolean;
	showUpgradeDiscoverability?: boolean;
	url?: string;
}

export const getUnavailableMessage = (state: EditorState, intl: IntlShape): string => {
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
		// eslint-disable-line no-unused-vars
		return intl.formatMessage(messages.displayOptionUnavailableInParentNode, {
			node: intl.formatMessage(nodeNames.defaultBlockNode),
		});
	}
};

/**
 * Whether the node a registered embed transformer (for example native embeds) would insert for the
 * selected card is allowed in its parent. That node can be allowed where `embedCard` is not.
 */
export const isTransformedEmbedSupportedInParent = (
	editorState: EditorState,
	currentAppearance?: CardAppearance,
): boolean => {
	const cardState = pluginKey.getState(editorState) as CardPluginState | undefined;
	const transformedNode =
		cardState?.embedCardTransformers?.getEmbedCardTransformNode?.(editorState);
	return transformedNode
		? isSupportedInParent(editorState, Fragment.from(transformedNode), currentAppearance)
		: false;
};

type Props = LinkToolbarAppearanceProps & {
	allowDatasource?: boolean;
	dispatchCommand: (command: Command) => void;
	settingsConfig: FloatingToolbarItem<Command>;
};

export const LinkAppearanceMenu = ({
	url,
	intl,
	currentAppearance,
	editorState,
	allowEmbeds,
	allowBlockCards = true,
	allowDatasource,
	editorAnalyticsApi,
	isDatasourceView,
	dispatchCommand,
	settingsConfig,
}: Props): React.JSX.Element | null => {
	const cardContext = useSmartCardContext();

	const preview =
		allowEmbeds && cardContext && url && cardContext.value?.extractors.getPreview(url, 'web');

	const defaultCommand: Command = () => false;

	if (url) {
		const urlState = cardContext.value?.store?.getState()[url];
		if (urlState?.error?.kind === 'fatal') {
			return null;
		}
	}

	const showUnsupportedOptionsDisabled = fg('platform_editor_link_appearance_disabled_options');

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
			) ||
			(showUnsupportedOptionsDisabled &&
				isTransformedEmbedSupportedInParent(editorState, currentAppearance))
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
			description: editorExperiment('platform_editor_preview_panel_responsiveness', true, {
				exposure: true,
			})
				? intl.formatMessage(messages.embedToBlockCardWarning)
				: undefined,
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

	if (blockCardOption) {
		options.push(blockCardOption);
	}

	if (embedOption) {
		options.push(embedOption);
	}

	const finalOptions = options.map((option) =>
		getDropdownOption(intl, dispatchCommand, {
			...option,
			onClick: commandWithMetadata(option.onClick, {
				inputMethod: INPUT_METHOD.FLOATING_TB,
			}),
		}),
	);

	let Icon;

	if ('icon' in settingsConfig && settingsConfig.icon !== undefined) {
		Icon = settingsConfig.icon;
	}

	// TODO: ED-26961 - this implementation does not support change boarding via pulse
	return (
		<MenuGroup>
			<Section>
				{finalOptions.map((option) => {
					const item = (
						<ButtonItem
							key={option.title}
							iconBefore={option.icon}
							// eslint-disable-next-line @atlassian/perf-linting/detect-unnecessary-rerenders, @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
							onClick={() => option.onClick()}
							isSelected={option.selected}
							isDisabled={showUnsupportedOptionsDisabled && option.disabled}
							description={option.description}
							shouldDescriptionWrap={true}
						>
							{option.title}
						</ButtonItem>
					);
					return showUnsupportedOptionsDisabled && option.tooltip ? (
						<Tooltip key={option.title} content={option.tooltip}>
							{item}
						</Tooltip>
					) : (
						item
					);
				})}
				<DatasourceDropdownOption
					allowDatasource={allowDatasource}
					intl={intl}
					url={url ?? ''}
					selected={Boolean(isDatasourceView)}
					inputMethod={INPUT_METHOD.FLOATING_TB}
					dispatchCommand={dispatchCommand}
				/>
			</Section>
			{'href' in settingsConfig && settingsConfig.href && (
				<Section hasSeparator>
					<LinkItem
						iconBefore={Icon && <Icon label="Settings" />}
						href={settingsConfig.href}
						target={'target' in settingsConfig ? settingsConfig.target : undefined}
					>
						{intl.formatMessage(linkToolbarMessages.preferencesLink)}
					</LinkItem>
				</Section>
			)}
		</MenuGroup>
	);
};

export const getLinkAppearanceDropdown = ({
	url,
	intl,
	currentAppearance,
	editorState,
	allowEmbeds,
	allowBlockCards = true,
	allowDatasource,
	editorAnalyticsApi,
	showUpgradeDiscoverability = true,
	isDatasourceView,
	settingsConfig,
}: LinkToolbarAppearanceProps & {
	allowDatasource?: boolean;
	settingsConfig: FloatingToolbarItem<Command>;
}): FloatingToolbarDropdown<Command> => {
	const alignmentItemOptions: DropdownOptions<Command> = {
		render: (props) => {
			return (
				<LinkAppearanceMenu
					url={url}
					intl={intl}
					currentAppearance={currentAppearance}
					editorState={editorState}
					allowEmbeds={allowEmbeds}
					allowBlockCards={allowBlockCards}
					editorAnalyticsApi={editorAnalyticsApi}
					showUpgradeDiscoverability={showUpgradeDiscoverability}
					isDatasourceView={isDatasourceView}
					allowDatasource={allowDatasource}
					dispatchCommand={props.dispatchCommand}
					settingsConfig={settingsConfig}
				/>
			);
		},
		width: 200,
		height: 400,
	};

	const currentAppearanceDisplayInformation = isDatasourceView
		? datasourceDisplayInformation
		: appearancePropsMap[currentAppearance ?? 'url'];

	const alignmentToolbarItem: FloatingToolbarDropdown<Command> = {
		id: 'card-appearance',
		testId: 'card-appearance-dropdown',
		type: 'dropdown',
		options: alignmentItemOptions,
		title: intl.formatMessage(currentAppearanceDisplayInformation.title),
		iconBefore: currentAppearanceDisplayInformation.icon,
	};

	return alignmentToolbarItem;
};
