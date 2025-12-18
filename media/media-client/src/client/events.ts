import { type FileState } from '@atlaskit/media-state';
import { type AuthContext } from '@atlaskit/media-core';

export type EventPayloadMap<P> = {
	readonly [event: string]: P;
};

export type EventPayloadListener<M extends EventPayloadMap<P>, E extends keyof M, P = any> = (
	payload: M[E],
) => void;

export interface MediaViewedEventPayload {
	fileId: string;
	viewingLevel:
		| 'minimal' // Smaller card was displayed
		| 'full' // Full resolution / video playback
		| 'download'; // Media was downloaded
	isUserCollection?: boolean; // This will be true only if attachment is shown in media picker
	childFileName?: string; // Name of the child file when downloading from an archive
}

export interface AuthProviderSucceededEventPayload {
	durationMs: number;
	timeoutMs: number;
	authContext?: AuthContext;
}

export interface AuthProviderFailedEventPayload {
	durationMs: number;
	timeoutMs: number;
	authContext?: AuthContext;
	error: Error;
}

export type UploadEventPayloadMap = {
	'file-added': FileState;
	'media-viewed': MediaViewedEventPayload;
	'auth-provider-succeeded': AuthProviderSucceededEventPayload;
	'auth-provider-failed': AuthProviderFailedEventPayload;
};
