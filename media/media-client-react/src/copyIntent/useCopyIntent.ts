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
	const { createAnalyticsEvent } = useAnalyticsEvents();

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

	const onGlobalCopy = useCallback(async () => {
		const currentCopyTarget = innerRef.current;

		const currentSelectionContainsNode =
			currentCopyTarget && getSelection()?.containsNode(currentCopyTarget, true);
		if (currentSelectionContainsNode) {
			registerCopyIntentRef.current();
		}
	}, [registerCopyIntentRef]);

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
