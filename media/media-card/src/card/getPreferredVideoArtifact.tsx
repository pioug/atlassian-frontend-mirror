import { type FileState, type MediaFileArtifacts } from '@atlaskit/media-client';

export const getPreferredVideoArtifact = (
	fileState: FileState,
): keyof MediaFileArtifacts | undefined => {
	if (fileState.status === 'processed' || fileState.status === 'processing') {
		const { artifacts } = fileState;
		if (!artifacts) {
			return undefined;
		}

		return artifacts['video_1280.mp4']
			? 'video_1280.mp4'
			: artifacts['video_640.mp4']
				? 'video_640.mp4'
				: undefined;
	}

	return undefined;
};
