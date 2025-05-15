import { type MessageProps } from '../../types';
import { type ElementProps } from '../types';

export type TextProps = ElementProps & {
	/**
	 * Determines the formatted message (i18n) to display.
	 * If this is provided and hideFormat is false, the content prop will not be displayed.
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

	/**
	 * Determines whether the text formatting should be hidden when both message and content are provided.
	 * If true, content will be displayed instead of the formatted message.
	 */
	hideFormat?: boolean;

	/**
	 * Text color to override the default text color.
	 */
	color?: string;
};
