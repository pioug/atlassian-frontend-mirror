import { type MediaPlacement } from '../../../../../constants';
import { type BlockProps } from '../types';

export type PreviewBlockProps = {
	/**
	 * Indicate whether preview block should ignore the padding its parent container.
	 * Default is false.
	 */
	ignoreContainerPadding?: boolean;

	/**
	 * Function to be called on error loading media.
	 * @internal
	 */
	onError?: () => void;

	/**
	 * An image URL to render. This will replace the default image from smart link data.
	 */
	overrideUrl?: string;

	/**
	 * The placement of the preview block in relation of its container.
	 * This makes the preview block leave flex layout to absolute positioning
	 * to the left/right of the container.
	 */
	placement?: MediaPlacement;
} & BlockProps;
