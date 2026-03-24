import { type Identifier, type MediaClient } from '@atlaskit/media-client';
import type { WithMediaClientConfigProps } from '@atlaskit/media-client-react';
import { type MediaFeatureFlags } from '@atlaskit/media-common';
import { type ReactNode } from 'react';
import { type ViewerOptionsProps } from '../viewerOptions';

export type FileStateFlags = {
	wasStatusProcessing: boolean;
	wasStatusUploading: boolean;
};

export interface MediaViewerExtensionsActions {
	close: () => void;
}

export interface MediaViewerExtensions {
	sidebar?: {
		icon: ReactNode;
		renderer: (selectedIdentifier: Identifier, actions: MediaViewerExtensionsActions) => ReactNode;
	};
	headerActions?: Array<{
		/** Icon to display in the header button */
		icon: ReactNode;
		/** Label for the button (accessibility) */
		label: string;
		/** Called when the button is clicked. Receives the currently viewed item's identifier
		 * and actions (including close) to control the viewer. */
		onClick: (selectedIdentifier: Identifier, actions: MediaViewerExtensionsActions) => void;
		/** Optional callback to control per-item visibility. When omitted, button always shows. */
		isVisible?: (selectedIdentifier: Identifier) => boolean;
	}>;
}

export interface MediaViewerProps {
	// Instance of media client.
	readonly mediaClient: MediaClient;
	// Media item from data source that will be visible to user.
	readonly selectedItem: Identifier;
	// Data source for media viewer.
	readonly items: Array<Identifier>;
	// The collection name.
	readonly collectionName: string;
	// Callback function to be called when user closes media viewer.
	readonly onClose?: () => void;
	// Includes media features like caption, timestamp etc.
	readonly featureFlags?: MediaFeatureFlags;
	// Sidebar configuration for media viewer.
	readonly extensions?: MediaViewerExtensions;
	// Retrieve auth based on a given context.
	readonly contextId?: string;
	// Viewer options for media viewer.
	readonly viewerOptions?: ViewerOptionsProps;
}

export type MediaMessage = {
	source: 'media';
	event: 'mediaViewerOpened' | 'mediaViewerClosed';
};

export type MediaViewerWithMediaClientConfigProps = WithMediaClientConfigProps<MediaViewerProps>;
