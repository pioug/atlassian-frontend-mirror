import { useCallback, useEffect, useRef } from 'react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import { fg } from '@atlaskit/platform-feature-flags';

import { useMediaClient } from '../MediaClientProvider';

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
	const copyNodeRef = useRef<HTMLDivElement | HTMLImageElement>(null);
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const currentIdRef = useCurrentValueRef(id);
	const currentOptionsRef = useCurrentValueRef(options);

	const onGlobalCopy = useCallback(async () => {
		const currentCopyTarget = copyNodeRef.current;
		const id = currentIdRef.current;
		const options = currentOptionsRef.current;

		const currentSelectionContainsNode =
			currentCopyTarget && getSelection()?.containsNode(currentCopyTarget, true);
		if (currentSelectionContainsNode) {
			try {
				await mediaClient.file.registerCopyIntent(id, options.collectionName);
				createAnalyticsEvent(getCopyIntentSuccessPayload(id));
			} catch (err) {
				createAnalyticsEvent(getCopyIntentErrorPayload(err, id));
			}
		}
	}, [createAnalyticsEvent, currentIdRef, currentOptionsRef, mediaClient]);

	useEffect(() => {
		if (fg('platform_media_copy_and_paste_v2')) {
			getDocument()?.addEventListener('copy', onGlobalCopy);
		}
		return () => getDocument()?.removeEventListener('copy', onGlobalCopy);
	}, [onGlobalCopy]);

	return {
		copyNodeRef,
	};
};
