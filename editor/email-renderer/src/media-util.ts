import type { MediaType } from './interfaces';

export const getIconFromMediaType = (
	mediaType: MediaType,
):
	| 'archiveAttachment'
	| 'audioAttachment'
	| 'documentAttachment'
	| 'videoAttachment'
	| 'genericAttachment' => {
	switch (mediaType) {
		case 'archive':
			return 'archiveAttachment';
		case 'audio':
			return 'audioAttachment';
		case 'doc':
			return 'documentAttachment';
		case 'video':
			return 'videoAttachment';
		default:
			return 'genericAttachment';
	}
};
