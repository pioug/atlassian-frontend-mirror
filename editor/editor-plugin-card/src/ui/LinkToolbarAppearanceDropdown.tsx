import React from 'react';

import { ACTION, INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import {
	appearancePropsMap,
	commandWithMetadata,
	getDropdownOption,
	type OptionConfig,
} from '@atlaskit/editor-common/card';
import { cardMessages as messages, linkToolbarMessages } from '@atlaskit/editor-common/messages';
import type {
	Command,
	DropdownOptions,
	FloatingToolbarDropdown,
	FloatingToolbarItem,
} from '@atlaskit/editor-common/types';
import { isSupportedInParent } from '@atlaskit/editor-common/utils';
import { Fragment } from '@atlaskit/editor-prosemirror/model';
import { useSmartCardContext } from '@atlaskit/link-provider';
import { ButtonItem, LinkItem, MenuGroup, Section } from '@atlaskit/menu';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { changeSelectedCardToLink, setSelectedCardAppearance } from '../pm-plugins/doc';

import { DatasourceDropdownOption, datasourceDisplayInformation } from './DatasourceDropdownOption';
import { getUnavailableMessage, type LinkToolbarAppearanceProps } from './LinkToolbarAppearance';

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
}: Props) => {
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
			description: expValEquals('platform_editor_preview_panel_responsiveness', 'isEnabled', true)
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

	// TODO: ED-26961 - packages/editor/editor-plugin-card/src/ui/LinkToolbarAppearance.tsx supports change boarding via pulse
	// this implementation doesn't
	return (
		<MenuGroup>
			<Section>
				{finalOptions.map((option) => {
					return (
						<ButtonItem
							key={option.title}
							iconBefore={option.icon}
							onClick={() => option.onClick()}
							isSelected={option.selected}
							description={option.description}
							shouldDescriptionWrap={true}
						>
							{option.title}
						</ButtonItem>
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
			<Section hasSeparator>
				<LinkItem
					iconBefore={Icon && <Icon label="Settings" />}
					href={'href' in settingsConfig ? settingsConfig.href : undefined}
					target={'target' in settingsConfig ? settingsConfig.target : undefined}
				>
					{intl.formatMessage(linkToolbarMessages.preferencesLink)}
				</LinkItem>
			</Section>
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
}) => {
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
