import { LockImage, NotFoundImage, UnauthorisedImage } from './constants';

export const getUnresolvedEmbedCardImage = (status: 'forbidden' | 'unauthorized' | 'notFound') => {
	switch (status) {
		case 'forbidden':
			return LockImage;
		case 'unauthorized':
			return UnauthorisedImage;
		case 'notFound':
			return NotFoundImage;
	}
};
