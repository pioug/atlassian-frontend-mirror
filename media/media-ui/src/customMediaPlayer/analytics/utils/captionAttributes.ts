import type { CustomMediaPlayerType } from '../../types';

export type CaptionAttributes = {
	selectedTrackIndex: number;
	availableCaptionTracks: number;
	selectedTrackLanguage: string | null;
	artifactName?: string;
};

export type WithErrorAttributes = {
	failReason: 'upload-fail' | 'delete-fail';
	error: string;
	errorDetail: string;
};

export type WithCaptionAttributes = {
	captionAttributes: CaptionAttributes;
};

export function generateBaseAttributes(
	type: CustomMediaPlayerType,
	captionAttributes: CaptionAttributes,
	fileId?: string,
	traceId?: string,
) {
	return {
		type,
		captionAttributes,
		...(fileId && {
			fileAttributes: {
				fileId,
			},
		}),
		...(traceId && {
			traceContext: {
				traceId,
			},
		}),
	};
}
