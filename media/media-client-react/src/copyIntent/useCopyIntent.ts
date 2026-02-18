import { useCallback, useEffect, useRef } from 'react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import { fg } from '@atlaskit/platform-feature-flags';

import { useMediaClient } from '../useMediaClient';

import { getCopyIntentErrorPayload, getCopyIntentSuccessPayload } from './copyIntentAnalytics';
import { getDocument } from './getDocument';
export type UseCopyIntentOptions = {
	collectionName?: string;
};

function useCurrentValueRef<T>(value: T): React.MutableRefObject<T> {
	const ref = useRef<T>(value);
	ref.current = value;
	return ref;
}
export const useCopyIntent = (id: string, options: UseCopyIntentOptions = {}) => {
	const mediaClient = useMediaClient();
	const innerRef = useRef<HTMLDivElement | HTMLImageElement | null>(null);
	const clientIdRef = useRef<string | undefined>(undefined);
	const { createAnalyticsEvent } = useAnalyticsEvents();

	// Pre-fetch clientId so it's available synchronously during copy event
	useEffect(() => {
		if (fg('platform_media_cross_client_copy_with_auth')) {
			mediaClient
				.getClientId(options.collectionName)
				.then((clientId) => {
					clientIdRef.current = clientId;
				})
				.catch(() => {
					// Silently handle - product might not have authProvider configured
				});
		}
	}, [mediaClient, options.collectionName]);

	const registerCopyIntentRef = useCurrentValueRef(async () => {
		try {
			await mediaClient.file.registerCopyIntent(id, options.collectionName);
			createAnalyticsEvent(getCopyIntentSuccessPayload(id));
		} catch (err) {
			createAnalyticsEvent(getCopyIntentErrorPayload(err, id));
		}
	});

	const copyNodeRef: React.Ref<HTMLDivElement | HTMLImageElement> = useCallback(
		(elem: HTMLDivElement | HTMLImageElement | null) => {
			innerRef.current = elem;

			if (fg('platform_media_cross_client_copy')) {
				elem?.addEventListener('contextmenu', () => {
					registerCopyIntentRef.current();
				});
			}
		},
		[registerCopyIntentRef],
	);

	const onGlobalCopy = useCallback(
		(event: ClipboardEvent) => {
			const currentCopyTarget = innerRef.current;

			const currentSelectionContainsNode =
				currentCopyTarget && getSelection()?.containsNode(currentCopyTarget, true);
			if (currentSelectionContainsNode) {
				registerCopyIntentRef.current();

				// Add clientId to the copied HTML (must be synchronous)
				if (fg('platform_media_cross_client_copy_with_auth')) {
					const clientId = clientIdRef.current;
					const html = event.clipboardData?.getData('text/html');
				// Look for media nodes by data-node-type which is always present
				if (html && html.includes('data-node-type="media') && clientId) {
						// Insert data-client-id after data-node-type="media" or data-node-type="mediaInline"
						const modifiedHtml = html.replace(
							/(<[^>]*data-node-type="media(?:Inline)?")([^>]*>)/g,
							`$1 data-client-id="${clientId}"$2`,
						);
						event.clipboardData?.setData('text/html', modifiedHtml);
					}
				}
			}
		},
		[registerCopyIntentRef],
	);

	useEffect(() => {
		if (fg('platform_media_cross_client_copy')) {
			getDocument()?.addEventListener('copy', onGlobalCopy);
		}
		return () => getDocument()?.removeEventListener('copy', onGlobalCopy);
	}, [onGlobalCopy]);

	return {
		copyNodeRef,
	};
};
