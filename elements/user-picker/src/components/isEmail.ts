import { type Email, EmailType, type OptionData } from '../types';

export const isEmail = (option: OptionData): option is Email => option.type === EmailType;
