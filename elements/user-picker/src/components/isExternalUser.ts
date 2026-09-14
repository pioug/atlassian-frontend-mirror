import { type ExternalUser, type OptionData, ExternalUserType } from '../types';

export const isExternalUser = (option: OptionData): option is ExternalUser =>
	option.type === ExternalUserType || Boolean((option as ExternalUser).isExternal);
