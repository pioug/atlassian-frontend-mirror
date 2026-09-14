import { getImageLoadPrimaryReason } from './getImageLoadPrimaryReason';
import { MediaCardError } from './MediaCardError';
import { type CardPreview } from './types';

export class ImageLoadError extends MediaCardError {
	constructor(source?: CardPreview['source']) {
		super(getImageLoadPrimaryReason(source));
	}
}
