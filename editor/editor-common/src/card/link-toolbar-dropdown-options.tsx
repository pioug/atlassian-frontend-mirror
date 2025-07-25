import React from 'react';

import { type IntlShape } from 'react-intl-next';

import type { Command, DropdownOptionT } from '../types';

import { appearancePropsMap } from './link-toolbar-button-group-options';
import type { OptionConfig } from './types';

export const getDropdownOption = (
	intl: IntlShape,
	dispatchCommand: (command: Command) => void,
	{ disabled, onClick, selected, appearance, testId, tooltip, description }: OptionConfig,
): DropdownOptionT<Function> => {
	const { title, icon: Icon } = appearancePropsMap[appearance ?? 'url'];

	return {
		title: intl.formatMessage(title),
		icon: <Icon label={intl.formatMessage(title)} />,
		onClick: () => dispatchCommand(onClick),
		disabled: Boolean(disabled),
		testId,
		selected,
		tooltip: tooltip ?? '',
		description,
	};
};
