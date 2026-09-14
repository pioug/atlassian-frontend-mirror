import type { FileState, MediaFileArtifacts } from '@atlaskit/media-state/file-state';

export const hasArtifacts = (
	fileState: FileState,
): fileState is FileState & { artifacts: MediaFileArtifacts } =>
	'artifacts' in fileState && fileState.artifacts !== undefined;
