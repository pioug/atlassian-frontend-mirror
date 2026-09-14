import { type OptionData, type User, UserType } from '../types';

export const isUser = (option: OptionData): option is User =>
	option.type === undefined || option.type === UserType;
