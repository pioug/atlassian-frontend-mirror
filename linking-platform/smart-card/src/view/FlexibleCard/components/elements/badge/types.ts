import { type IconType } from '../../../../../constants';
import { type ElementProps } from '../types';

export type BadgeProps = ElementProps & {
	/**
	 * Badge appearances
	 */
	appearance?: 'default' | 'subtle';

	/**
	 * Determines whether the badge icon should be hidden. When set to true,
	 * the badge will be displayed without the icon, showing only the label text.
	 */
	hideIcon?: boolean;

	/**
	 * The Atlaskit Icon to display next to the label. If this is not supplied,
	 * then the badge icon will fallback to the URL provided.
	 */
	icon?: IconType;

	/**
	 * The icon from this URL will be used for the badge if no Atlaskit Icon is provided.
	 */
	url?: string;

	/**
	 * The text to display for the badge.
	 */
	label?: string;
};
