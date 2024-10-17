import { type IntlShape } from 'react-intl-next';

import MinusIcon from '@atlaskit/icon/core/minus';
import SmartLinkCardIcon from '@atlaskit/icon/core/smart-link-card';
import SmartLinkEmbedIcon from '@atlaskit/icon/core/smart-link-embed';
import SmartLinkInlineIcon from '@atlaskit/icon/core/smart-link-inline';

import { cardMessages as messages } from '../messages';
import type { Command } from '../types';

import type { ButtonOptionProps } from './LinkToolbarButtonGroup';
import type { OptionConfig } from './types';
import { IconCard } from './ui/assets/card';
import { IconEmbed } from './ui/assets/embed';
import { IconInline } from './ui/assets/inline';
import { IconUrl } from './ui/assets/url';

const appearancePropsMap = {
	url: {
		title: messages.urlTitle,
		icon: MinusIcon,
		iconFallback: IconUrl,
	},
	inline: {
		title: messages.inlineTitle,
		icon: SmartLinkInlineIcon,
		iconFallback: IconInline,
	},
	block: {
		title: messages.blockTitle,
		icon: SmartLinkCardIcon,
		iconFallback: IconCard,
	},
	embed: {
		title: messages.embedTitle,
		icon: SmartLinkEmbedIcon,
		iconFallback: IconEmbed,
	},
};

export const getButtonGroupOption = (
	intl: IntlShape,
	dispatchCommand: (command: Command) => void,
	{ disabled, onClick, selected, appearance, testId, tooltip }: OptionConfig,
): ButtonOptionProps => {
	const { title, icon, iconFallback } = appearancePropsMap[appearance ?? 'url'];

	return {
		title: intl.formatMessage(title),
		icon,
		iconFallback,
		onClick: () => dispatchCommand(onClick),
		disabled: Boolean(disabled),
		tooltipContent: tooltip || null,
		testId,
		selected,
	};
};
