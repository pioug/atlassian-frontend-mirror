import { type ReactNode } from 'react';

import { type Identifier, type MediaClient } from '@atlaskit/media-client';
import type { WithMediaClientConfigProps } from '@atlaskit/media-client-react/with-media-client';
import { type MediaFeatureFlags } from '@atlaskit/media-common';

import { type ViewerOptionsProps } from '../viewerOptions';

export type FileStateFlags = {
	wasStatusProcessing: boolean;
	wasStatusUploading: boolean;
};

export interface MediaViewerExtensionsActions {
	close: () => void;
}

export type MediaViewerNavigationDirection = 'next' | 'prev';

export interface MediaViewerExtensions {
	sidebar?: {
		icon: ReactNode;
		/** Accessible label for the sidebar toggle. Falls back to a generic localized string. */
		label?: string;
		/** Title rendered by Media Viewer in the inset sidebar header. */
		title?: string;
		/** Renders the sidebar body below the Platform-owned inset sidebar header. */
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
	/**
	 * Interceptor for the media viewer modal-close path (close button, ESC, click
	 * outside). When provided, the platform calls this instead of immediately
	 * closing — the consumer must invoke `proceed()` to actually close. If
	 * `proceed` is never called, the close is silently swallowed (e.g. while a
	 * confirm prompt is awaiting user input).
	 *
	 * When omitted, the platform proceeds immediately (default behavior).
	 */
	onPreviewClose?: (proceed: () => void) => void;
	/**
	 * Interceptor for the sidebar-close path (clicking the sidebar toggle button
	 * while the sidebar is open, or the sidebar's own internal close action).
	 * Called only when the sidebar is currently visible. Same delegation
	 * semantics as `onPreviewClose`.
	 */
	onSidebarClose?: (proceed: () => void) => void;
	/**
	 * Interceptor for the prev/next navigation buttons. Receives the requested
	 * direction so the consumer can decide per-direction. Same delegation
	 * semantics as `onPreviewClose`.
	 */
	onNavigation?: (direction: MediaViewerNavigationDirection, proceed: () => void) => void;
	/**
	 * Optional selected-item override for a given media card. Consumers can return
	 * an identifier to make this card render MediaViewer, or null to keep it
	 * closed. This lets consumers own remount-restore policy outside media-card.
	 */
	getMediaViewerSelectedItem?: (identifier: Identifier) => Identifier | null;
	/**
	 * Called whenever the selected preview item changes, including open, close,
	 * and prev/next navigation. Consumers can persist this value somewhere stable
	 * so a remounted owner card can restore the viewer to the same selected item.
	 */
	onSelectedItemChange?: (selectedIdentifier: Identifier | null) => void;
	/**
	 * Optional initial value for the sidebar's open/closed state. Used to persist
	 * the sidebar visibility across MediaViewer remounts (e.g. when the
	 * surrounding renderer re-mounts because its document was updated and the
	 * media node was re-inserted into the tree).
	 */
	defaultSidebarVisible?: boolean;
	/**
	 * Called whenever the sidebar's open/closed state changes inside the viewer
	 * (after the on{Sidebar,Preview}Close interceptors have proceeded). The
	 * consumer can persist this value somewhere stable so a subsequent remount
	 * can restore it via `defaultSidebarVisible`.
	 */
	onSidebarVisibilityChange?: (isVisible: boolean) => void;
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
	// Optional fallback fetcher to retrieve the media filename from another service.
	// Workaround for #hot-301450 where media service is missing filenames for DC -> Cloud migrated media.
	// Receives the file ID and should resolve to the filename string.
	readonly fallbackMediaNameFetcher?: (id: string) => Promise<string>;
}

export type MediaMessage = {
	source: 'media';
	event: 'mediaViewerOpened' | 'mediaViewerClosed';
};

export type MediaViewerWithMediaClientConfigProps = WithMediaClientConfigProps<MediaViewerProps>;
