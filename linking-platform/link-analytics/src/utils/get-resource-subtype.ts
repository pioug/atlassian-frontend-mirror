import type { ResolvedAttributesType } from '../common/utils/analytics/analytics.types';

type ResourceSubtype = NonNullable<ResolvedAttributesType['destinationObjectSubtype']>;

// Emit only constants from our analytics vocabulary, never provider-supplied strings.
const classifyFileFormat = (format: unknown): ResourceSubtype | undefined => {
	switch (format) {
		case 'application/vnd.google-apps.document':
		case 'application/msword':
		case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
		case 'application/vnd.oasis.opendocument.text':
		case 'application/vnd.apple.pages':
		case 'text/plain':
			return 'document';
		case 'application/vnd.google-apps.spreadsheet':
		case 'application/vnd.ms-excel':
		case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
		case 'application/vnd.oasis.opendocument.spreadsheet':
		case 'application/vnd.apple.numbers':
			return 'spreadsheet';
		case 'application/vnd.google-apps.presentation':
		case 'application/vnd.ms-powerpoint':
		case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
		case 'application/vnd.oasis.opendocument.presentation':
		case 'application/vnd.apple.keynote':
			return 'presentation';
		case 'application/vnd.google-apps.folder':
		case 'folder':
			return 'folder';
		case 'application/vnd.google-apps.form':
			return 'form';
		case 'application/pdf':
			return 'pdf';
		case 'image/png':
		case 'image/jpeg':
		case 'image/gif':
		case 'image/bmp':
		case 'image/webp':
		case 'image/svg+xml':
			return 'image';
		case 'audio/midi':
		case 'audio/mpeg':
		case 'audio/webm':
		case 'audio/ogg':
		case 'audio/wav':
			return 'audio';
		case 'video/mp4':
		case 'video/quicktime':
		case 'video/mov':
		case 'video/webm':
		case 'video/ogg':
		case 'video/x-ms-wmv':
		case 'video/x-msvideo':
			return 'video';
		default:
			return undefined;
	}
};

const classifyType = (type: unknown): ResourceSubtype | undefined => {
	switch (type) {
		case 'schema:TextDigitalDocument':
			return 'document';
		case 'schema:SpreadsheetDigitalDocument':
			return 'spreadsheet';
		case 'schema:PresentationDigitalDocument':
			return 'presentation';
		case 'Image':
			return 'image';
		case 'Audio':
			return 'audio';
		case 'Video':
			return 'video';
		default:
			// Generic Document and Collection do not establish a file kind.
			return undefined;
	}
};

export const getResourceSubtype = (data: unknown): ResourceSubtype | undefined => {
	if (!data || typeof data !== 'object' || Array.isArray(data)) {
		return undefined;
	}

	const format = 'schema:fileFormat' in data ? data['schema:fileFormat'] : undefined;
	if (typeof format === 'string' && format.trim().length > 0) {
		return classifyFileFormat(format) ?? 'other';
	}

	const type = '@type' in data ? data['@type'] : undefined;
	const types: unknown[] = Array.isArray(type) ? type : [type];
	let fallback: ResourceSubtype | undefined;
	for (const value of types) {
		const category = classifyType(value);
		if (category) {
			if (fallback && fallback !== category) {
				return undefined;
			}
			fallback = category;
		}
	}
	return fallback;
};
