import { type ElementProps } from '../types';
import { type MediaType } from '../../../../../constants';

export type MediaProps = ElementProps & {
	/**
	 * The type of media to display. Can be image.
	 */
	type?: MediaType;

	/**
	 * The URL of the associated media to display.
	 */
	url?: string;

	/**
	 * Function to be called on error loading media.
	 * @internal
	 */
	onError?: () => void;

	onLoad?: () => void;
};
