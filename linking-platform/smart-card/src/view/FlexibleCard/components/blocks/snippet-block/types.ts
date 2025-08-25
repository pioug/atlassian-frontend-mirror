import { type BlockProps } from '../types';

export type SnippetBlockProps = {
	/**
	 * The snippet block is rendered hidden at times, this just informs the component and the snippet renderer
	 */
	isHidden?: boolean;

	/**
	 * Determines the maximum lines the text within the snippet block should
	 * spread over. Default is 3. Maximum is 3.
	 */
	maxLines?: number;

	/**
	 * Whether to show the footer of the snippet block.
	 */
	showFooter?: boolean;

	/**
	 * The text to display. Overrides the default link description.
	 */
	text?: string;
} & BlockProps;
