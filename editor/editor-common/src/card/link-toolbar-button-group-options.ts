import { type IntlShape } from 'react-intl-next';

import MinusIcon from '@atlaskit/icon/core/minus';
import SmartLinkCardIcon from '@atlaskit/icon/core/smart-link-card';
import SmartLinkEmbedIcon from '@atlaskit/icon/core/smart-link-embed';
import SmartLinkInlineIcon from '@atlaskit/icon/core/smart-link-inline';

import { cardMessages as messages } from '../messages';
import type { Command } from '../types';

import type { ButtonOptionProps } from './LinkToolbarButtonGroup';
import type { OptionConfig } from './types';

export const appearancePropsMap = {
	url: {
		title: messages.urlTitle,
		icon: MinusIcon,
	},
	inline: {
		title: messages.inlineTitle,
		icon: SmartLinkInlineIcon,
	},
	block: {
		title: messages.blockTitle,
		icon: SmartLinkCardIcon,
	},
	embed: {
		title: messages.embedTitle,
		icon: SmartLinkEmbedIcon,
	},
};

export const getButtonGroupOption = (
	intl: IntlShape,
	areAnyNewToolbarFlagsEnabled: boolean,
	dispatchCommand: (command: Command) => void,
	{ disabled, onClick, selected, appearance, testId, tooltip }: OptionConfig,
): ButtonOptionProps => {
	const { title, icon } = appearancePropsMap[appearance ?? 'url'];

	return {
		title: intl.formatMessage(title),
		icon,
		onClick: () => dispatchCommand(onClick),
		disabled: Boolean(disabled),
		tooltipContent: tooltip || null,
		testId,
		selected,
		areAnyNewToolbarFlagsEnabled: areAnyNewToolbarFlagsEnabled,
	};
};
