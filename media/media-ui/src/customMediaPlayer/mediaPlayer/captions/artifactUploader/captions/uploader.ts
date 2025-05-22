import type { MediaClient, FileIdentifier } from '@atlaskit/media-client';

const parseError = (error: unknown) => {
	if (error instanceof Error) {
		return error;
	}
	return new Error(String(error));
};

const upladFile = async (
	mediaClient: MediaClient,
	identifier: FileIdentifier,
	file: File,
	locale: string,
) => {
	const result = await mediaClient.file.uploadArtifact(
		identifier.id,
		file,
		{ type: 'caption', language: locale },
		identifier.collectionName,
	);
	return result;
};

export const createUploadCaptionsFn =
	(
		mediaClient: MediaClient,
		identifier: FileIdentifier,
		onStart?: (file: File) => void,
		onEnd?: (result: any) => void,
		onError?: (error: Error) => void,
	) =>
	async (file: File, locale: string) => {
		if (file) {
			onStart?.(file);
			try {
				const result = await upladFile(mediaClient, identifier, file, locale);
				onEnd?.(result);
			} catch (error) {
				onError?.(parseError(error));
			}
		}
	};
