import { type ElementProps } from '../types';
import { type MessageProps } from '../../types';

export type TextProps = ElementProps & {
	/**
	 * Determines the formatted message (i18n) to display.
	 * If this is provided, the content prop will not be displayed.
	 */
	message?: MessageProps;

	/**
	 * The raw text content to display.
	 */
	content?: string;

	/**
	 * The maximum number of lines the text should span over. Maximum is 2 unless its an error message.
	 */
	maxLines?: number;
};
