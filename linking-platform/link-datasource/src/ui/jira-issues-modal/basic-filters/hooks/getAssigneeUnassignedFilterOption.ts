import { type IntlShape } from 'react-intl';

import { type AvatarLabelOption } from '../../../common/modal/popup-select/types';

import { filterOptionMessages } from './messages';

export const getAssigneeUnassignedFilterOption = (
	formatMessage: IntlShape['formatMessage'],
): AvatarLabelOption => ({
	label: formatMessage(filterOptionMessages.assigneeUnassignedFilterOption),
	optionType: 'avatarLabel',
	value: 'empty',
});
