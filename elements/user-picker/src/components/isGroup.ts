import { type OptionData, type Group, GroupType } from '../types';

export const isGroup = (option: OptionData): option is Group => option.type === GroupType;
