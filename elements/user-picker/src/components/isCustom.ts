import { type Custom, CustomType, type OptionData } from '../types';

export const isCustom = (option: OptionData): option is Custom => option.type === CustomType;
