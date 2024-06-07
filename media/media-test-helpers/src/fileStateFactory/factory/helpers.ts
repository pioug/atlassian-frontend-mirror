import { type FileIdentifier, type FileDetails, type MediaType } from '@atlaskit/media-client';
import { v4 as uuidv4 } from 'uuid';

export const defaultFileDetails: Partial<FileDetails> = {
	createdAt: 1630986510989,
	mediaType: 'image',
	mimeType: 'image/png',
	name: 'file-name.png',
	size: 1,
};

// min inclusive / max exclusive
function random(min: number = 0, max: number = 10000) {
	min = Math.ceil(min);
	max = Math.floor(max) - 1;
	const result = Math.floor(Math.random() * (max - min + 1)) + min;
	return result;
}

const getRandomElem = <T>(arr: Array<T>) => arr[Math.floor(Math.random() * arr.length)];

export const createIdentifier = ({
	collectionName = `collection-${random()}`,
	occurrenceKey = `occurrence-${random()}`,
}: {
	occurrenceKey?: string;
	collectionName?: string;
} = {}): FileIdentifier => ({
	mediaItemType: 'file',
	id: uuidv4(),
	collectionName,
	occurrenceKey,
});

const generateFileName = (extension: string) => {
	const fileNames = [
		'quick-and-dirty',
		'quality-time',
		'down-for-the-count',
		'hard-pill-to-swallow',
		'between-a-rock-and-a-hard-place',
		'fish-out-of-water',
		'top-drawer',
		'like-father-like-son',
		'mountain-out-of-a-molehill',
		'under-your-nose',
		'a-chip-on-your-shoulder',
		'hit-below-the-belt',
	];
	return `${getRandomElem(fileNames)}.${extension}`;
};

const mediaTypesDetails: Record<MediaType, { ext: string; mimeType: string }> = {
	image: { ext: 'png', mimeType: 'image/png' },
	video: { ext: 'mp4', mimeType: 'video/mp4' },
	doc: { ext: 'pdf', mimeType: 'application/pdf' },
	unknown: { ext: 'unknown', mimeType: 'unknown' },
	audio: { ext: 'mp3', mimeType: 'audio/mpeg' },
	archive: { ext: 'zip', mimeType: 'application/zip' },
};
const mediaTypes = Object.keys(mediaTypesDetails) as Array<MediaType>;

const generateMediaTypeDetails = (mediaType: MediaType) => {
	const { mimeType, ext } = mediaTypesDetails[mediaType];
	return { mimeType, name: generateFileName(ext) };
};

export const createFileDetails = (
	id: string,
	mediaType: MediaType = getRandomElem(mediaTypes),
): FileDetails => {
	const { mimeType, name } = generateMediaTypeDetails(mediaType);
	return {
		id,
		createdAt: random(),
		size: random(),
		name,
		mediaType,
		mimeType,
	};
};
