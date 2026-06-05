import type { IntlShape } from 'react-intl';

import type { Command } from '../types';

import { appearancePropsMap } from './appearancePropsMap';
import type { ButtonOptionProps } from './LinkToolbarButtonGroup';
import type { OptionConfig } from './types';

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
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { appearancePropsMap } from './appearancePropsMap';
