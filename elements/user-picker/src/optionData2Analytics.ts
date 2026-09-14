import { checkValidId } from './checkValidId';
import { isCustom } from './components/isCustom';
import { isExternalUser } from './components/isExternalUser';
import { type OptionData } from './types';

export const optionData2Analytics: any = (option: OptionData) => {
	const { id, type } = option;
	// id's of email types are emails which is PII
	const validatedData = {
		id: checkValidId(id) ? id : null,
		type: type || null,
	};
	if (isExternalUser(option)) {
		return {
			...validatedData,
			type: 'external_user',
			sources: option.sources,
			externalUserType: option.externalUserType,
		};
	}
	if (isCustom(option) && option.analyticsType) {
		return {
			...validatedData,
			type: option.analyticsType,
		};
	}
	return validatedData;
};
