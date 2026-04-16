import type { IntlShape } from 'react-intl';

import type { NewCoreIconProps } from '@atlaskit/icon';
import MinusIcon from '@atlaskit/icon/core/minus';
import SmartLinkCardIcon from '@atlaskit/icon/core/smart-link-card';
import SmartLinkEmbedIcon from '@atlaskit/icon/core/smart-link-embed';
import SmartLinkInlineIcon from '@atlaskit/icon/core/smart-link-inline';

import { cardMessages as messages } from '../messages';
import type { Command } from '../types';

import type { ButtonOptionProps } from './LinkToolbarButtonGroup';
import type { OptionConfig } from './types';

export const appearancePropsMap: {
	block: {
		icon: {
			(props: NewCoreIconProps): JSX.Element;
			displayName: string;
		};
		title: {
			defaultMessage: string;
			description: string;
			id: string;
		};
	};
	embed: {
		icon: {
			(props: NewCoreIconProps): JSX.Element;
			displayName: string;
		};
		title: {
			defaultMessage: string;
			description: string;
			id: string;
		};
	};
	inline: {
		icon: {
			(props: NewCoreIconProps): JSX.Element;
			displayName: string;
		};
		title: {
			defaultMessage: string;
			description: string;
			id: string;
		};
	};
	url: {
		icon: {
			(props: NewCoreIconProps): JSX.Element;
			displayName: string;
		};
		title: {
			defaultMessage: string;
			description: string;
			id: string;
		};
	};
} = {
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
