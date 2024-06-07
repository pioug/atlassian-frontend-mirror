import { type IconType } from '../../../constants';

/**
 * Represents an icon. Should either contain a label and url, or a an icon type and label.
 */
export type IconDescriptor = {
	icon?: IconType;
	label?: string;
	url?: string;
};
