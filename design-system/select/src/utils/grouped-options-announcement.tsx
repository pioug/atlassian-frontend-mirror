import {
	type OptionsOrGroups,
} from '@atlaskit/react-select';

import { type GroupType, type OptionType } from '../types';

// Helper function which identifies if options are grouped.
export const isOptionsGrouped: (
	arr: OptionsOrGroups<OptionType, GroupType<OptionType>> | undefined,
) => boolean | undefined = (
	arr: OptionsOrGroups<OptionType, GroupType<OptionType>> | undefined,
) => {
		return arr?.every((obj) => obj.hasOwnProperty('options'));
	};
