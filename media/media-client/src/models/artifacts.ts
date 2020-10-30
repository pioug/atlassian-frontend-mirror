import type { MediaFileProcessingStatus } from './media';

export type MediaFileArtifact = {
  readonly url: string;
  readonly processingStatus: MediaFileProcessingStatus;
};

export interface MediaFileArtifacts {
  'video_1280.mp4'?: MediaFileArtifact;
  'video_640.mp4'?: MediaFileArtifact;
  'document.pdf'?: MediaFileArtifact;
  'audio.mp3'?: MediaFileArtifact;
}

export const getArtifactUrl = (
  artifacts: MediaFileArtifacts,
  prop: keyof MediaFileArtifacts,
): string | undefined => {
  const artifact = artifacts[prop];

  if (!artifact || !artifact.url) {
    return undefined;
  }

  return artifact.url;
};
