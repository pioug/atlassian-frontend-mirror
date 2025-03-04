import React from 'react';

import type { IntlShape } from 'react-intl-next';

import { ACTION, INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import {
	appearancePropsMap,
	commandWithMetadata,
	getDropdownOption,
	type OptionConfig,
} from '@atlaskit/editor-common/card';
import nodeNames, { cardMessages as messages } from '@atlaskit/editor-common/messages';
import type {
	Command,
	DropdownOptions,
	FloatingToolbarDropdown,
	FloatingToolbarItem,
} from '@atlaskit/editor-common/types';
import { isSupportedInParent } from '@atlaskit/editor-common/utils';
import { Fragment } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { useSmartCardContext } from '@atlaskit/link-provider';
import { ButtonItem, LinkItem, MenuGroup, Section } from '@atlaskit/menu';

import { changeSelectedCardToLink, setSelectedCardAppearance } from '../pm-plugins/doc';

import type { LinkToolbarAppearanceProps } from './LinkToolbarAppearance';

const AppearanceMenu = ({
	url,
	intl,
	currentAppearance,
	editorState,
	allowEmbeds,
	allowBlockCards = true,
	editorAnalyticsApi,
	showUpgradeDiscoverability = true,
	isDatasourceView,
	dispatchCommand,
	settingsConfig,
}: LinkToolbarAppearanceProps & {
	dispatchCommand: (command: Command) => void;
	settingsConfig: FloatingToolbarItem<Command>;
}) => {
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

	// TODO: packages/editor/editor-plugin-card/src/ui/LinkToolbarAppearance.tsx supports change boarding via pulse
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
						>
							{option.title}
						</ButtonItem>
					);
				})}
			</Section>
			<Section hasSeparator>
				<LinkItem
					iconBefore={Icon && <Icon label="Settings" />}
					href={'href' in settingsConfig ? settingsConfig.href : undefined}
					target={'target' in settingsConfig ? settingsConfig.target : undefined}
				>
					{/* TODO: create new message, the current one does not match */}
					Link Preferences
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
	editorAnalyticsApi,
	showUpgradeDiscoverability = true,
	isDatasourceView,
	settingsConfig,
}: LinkToolbarAppearanceProps & { settingsConfig: FloatingToolbarItem<Command> }) => {
	const alignmentItemOptions: DropdownOptions<Command> = {
		render: (props) => {
			return (
				<AppearanceMenu
					url={url}
					intl={intl}
					currentAppearance={currentAppearance}
					editorState={editorState}
					allowEmbeds={allowEmbeds}
					allowBlockCards={allowBlockCards}
					editorAnalyticsApi={editorAnalyticsApi}
					showUpgradeDiscoverability={showUpgradeDiscoverability}
					isDatasourceView={isDatasourceView}
					dispatchCommand={props.dispatchCommand}
					settingsConfig={settingsConfig}
				/>
			);
		},
		width: 200,
		height: 400,
	};

	const currentAppearanceDisplayInformation = appearancePropsMap[currentAppearance ?? 'url'];

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
