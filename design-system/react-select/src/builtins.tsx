import { type GroupBase, type Option } from './types';

export const formatGroupLabel = <Option, Group extends GroupBase<Option>>(group: Group): string =>
	group.label as string;

export const getOptionLabel = (option: Option): string =>
	(option as { label?: unknown }).label as string;

export const getOptionValue = (option: Option): string =>
	(option as { value?: unknown }).value as string;

export const isOptionDisabled = (option: Option): boolean =>
	!!(option as { isDisabled?: unknown }).isDisabled;
