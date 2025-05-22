import { type FileIdentifier, type MediaItemDetails } from '@atlaskit/media-client';

export const artifactUploadTypes = {
	captions: ['text/vtt'], // Probbly need to add '.vtt' to the list, but the content-type header is restricted to text/vtt anyway.
};

export type ArtifactSupportedType = keyof typeof artifactUploadTypes;

export interface ArtifactUploaderProps {
	identifier: FileIdentifier;
	onStart?: (file: File) => void;
	onEnd?: (metadata: MediaItemDetails) => void;
	onError?: (error: Error) => void;
}
