import type { FileIdentifier } from '@atlaskit/media-client/identifier';
import type { MediaItemDetails } from '@atlaskit/media-client/media';
import type { MediaTraceContext } from '@atlaskit/media-common/analytics/types';

export const artifactUploadTypes: {
	captions: string[];
} = {
	captions: ['text/vtt'], // Probbly need to add '.vtt' to the list, but the content-type header is restricted to text/vtt anyway.
};

export type ArtifactSupportedType = keyof typeof artifactUploadTypes;

export interface ArtifactUploaderProps {
	identifier: FileIdentifier;
	onStart?: (file: File, traceContext: MediaTraceContext) => void;
	onEnd?: (metadata: MediaItemDetails, traceContext: MediaTraceContext) => void;
	onError?: (error: Error, traceContext: MediaTraceContext) => void;
}
