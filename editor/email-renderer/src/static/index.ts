// Ignored via go/ees005
// eslint-disable-next-line import/no-namespace
import * as icons from './icons';
import { IconName } from './icons';
import { type SerializeFragmentWithAttachmentsResult, type MediaImageBase64 } from '../serializer';
import { base64Prefix, imageOutputType } from './generator/constants';
import { CS_CONTENT_PREFIX } from '../styles/util';

const cidPrefix = 'cid:';
const pfcsPrefix = CS_CONTENT_PREFIX;
// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const cidMatcher = new RegExp(`src="${cidPrefix}${pfcsPrefix}-([\\w]*)-([\\w-]*)"`, 'gi');

export const createContentId = (imageName: icons.IconString, isCidPrefixed: boolean = true) =>
	`${isCidPrefixed ? cidPrefix : ''}${pfcsPrefix}-icon-${imageName}`;

const embeddedImagesMapper = (iconName: string): MediaImageBase64 => ({
	contentId: createContentId(IconName[iconName as icons.IconString], false),
	contentType: `image/${imageOutputType}`,
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: (icons as any)[iconName],
});

export const processImages = (
	html: string,
	isMockEnabled: boolean = false,
): SerializeFragmentWithAttachmentsResult => {
	const imageSet = new Set<icons.IconString>();

	const imageProcessor = (match: string, ...captureGroups: icons.IconString[]): string => {
		// Inline the image if mock is enabled
		if (isMockEnabled) {
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			return `src="${base64Prefix}${(icons as any)[captureGroups[1]]}"`;
		}

		// Otherwise, do not do a replacement (keep the cid as the src), and add the image to the set.
		imageSet.add(captureGroups[1]);
		return match;
	};

	const result = html.replace(cidMatcher, imageProcessor);
	const embeddedImages = [...imageSet].map(embeddedImagesMapper);
	return { result, embeddedImages };
};
