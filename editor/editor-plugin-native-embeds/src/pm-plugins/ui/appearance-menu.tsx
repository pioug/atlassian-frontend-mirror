import React from 'react';

import type { IntlShape, MessageDescriptor } from 'react-intl-next';

import { getLinkPreferencesURLFromENV } from '@atlaskit/editor-common/link';
import { cardMessages, linkToolbarMessages } from '@atlaskit/editor-common/messages';
import type {
	Command,
	DropdownOptions,
	DropdownOptionT,
	FloatingToolbarDropdown,
	RenderOptionsPropsT,
} from '@atlaskit/editor-common/types';
import type { NewCoreIconProps } from '@atlaskit/icon';
import MinusIcon from '@atlaskit/icon/core/minus';
import CogIcon from '@atlaskit/icon/core/settings';
import SmartLinkCardIcon from '@atlaskit/icon/core/smart-link-card';
import SmartLinkEmbedIcon from '@atlaskit/icon/core/smart-link-embed';
import SmartLinkInlineIcon from '@atlaskit/icon/core/smart-link-inline';
import { ButtonItem, LinkItem, MenuGroup, Section } from '@atlaskit/menu';

import type { NativeEmbedAppearance, SelectedNativeEmbed } from '../../nativeEmbedsPluginType';
import { setNativeEmbedAppearance } from '../commands/appearance';

const APPEARANCE_OPTIONS: NativeEmbedAppearance[] = ['url', 'inline', 'block', 'embed'];
const appearanceMetadataMap: Record<
	NativeEmbedAppearance,
	{
		icon: React.ComponentType<NewCoreIconProps>;
		message: MessageDescriptor;
	}
> = {
	url: {
		icon: MinusIcon,
		message: cardMessages.urlTitle,
	},
	inline: {
		icon: SmartLinkInlineIcon,
		message: cardMessages.inlineTitle,
	},
	block: {
		icon: SmartLinkCardIcon,
		message: cardMessages.blockTitle,
	},
	embed: {
		icon: SmartLinkEmbedIcon,
		message: cardMessages.embedTitle,
	},
};

const buildAppearanceDropdownOptions = (
	selectedNativeEmbed: SelectedNativeEmbed,
	intl: IntlShape,
): DropdownOptionT<Command>[] =>
	APPEARANCE_OPTIONS.map((appearance) => ({
		id: `native-embed-appearance-${appearance}`,
		icon: React.createElement(appearanceMetadataMap[appearance].icon, {
			color: 'currentColor',
			label: '',
			spacing: 'spacious',
		}),
		onClick: setNativeEmbedAppearance(selectedNativeEmbed, appearance),
		selected: appearance === 'embed',
		title: intl.formatMessage(appearanceMetadataMap[appearance].message),
	}));

type NativeEmbedAppearanceMenuProps = {
	dispatchCommand: RenderOptionsPropsT<Command>['dispatchCommand'];
	intl: IntlShape;
	options: DropdownOptionT<Command>[];
};

const NativeEmbedAppearanceMenu = ({
	dispatchCommand,
	intl,
	options,
}: NativeEmbedAppearanceMenuProps): React.JSX.Element => {
	const preferencesHref = getLinkPreferencesURLFromENV();

	return (
		<MenuGroup>
			<Section>
				{options.map((option) => (
					<ButtonItem
						key={option.id ?? option.title}
						iconBefore={option.icon}
						onClick={() => dispatchCommand(option.onClick)}
						isSelected={option.selected}
					>
						{option.title}
					</ButtonItem>
				))}
			</Section>
			<Section hasSeparator>
				<LinkItem
					iconBefore={<CogIcon label="" color="currentColor" spacing="spacious" />}
					href={preferencesHref}
					target="_blank"
				>
					{intl.formatMessage(linkToolbarMessages.preferencesLink)}
				</LinkItem>
			</Section>
		</MenuGroup>
	);
};

export interface NativeEmbedAppearanceDropdownConfig {
	intl: IntlShape;
	selectedNativeEmbed: SelectedNativeEmbed;
}

export const getNativeEmbedAppearanceDropdown = ({
	intl,
	selectedNativeEmbed,
}: NativeEmbedAppearanceDropdownConfig): FloatingToolbarDropdown<Command> => {
	const options = buildAppearanceDropdownOptions(selectedNativeEmbed, intl);
	const dropdownOptions: DropdownOptions<Command> = {
		render: (props) => (
			<NativeEmbedAppearanceMenu
				dispatchCommand={props.dispatchCommand}
				intl={intl}
				options={options}
			/>
		),
		width: 220,
		height: 260,
	};

	const title = intl.formatMessage(appearanceMetadataMap.embed.message);
	const iconBefore = appearanceMetadataMap.embed.icon;

	return {
		id: 'native-embed-appearance-dropdown',
		type: 'dropdown',
		testId: 'native-embed-appearance-dropdown',
		title,
		iconBefore,
		options: dropdownOptions,
	};
};
