import { useEffect, useRef, useState } from 'react';

import { getContentPropertyIdFromAri, getPageIdFromAri } from '../utils/ari';
import type { ContentProperty } from '../utils/content-property';
import { getContentProperty } from '../utils/content-property';

const POLLING_INTERVAL = 1000;

const cache = new Map<string, ContentProperty>();

const inFlightRequests = new Map<string, Promise<ContentProperty>>();

const subscribers = new Map<string, Set<(data: ContentProperty) => void>>();

const pollingTimeouts = new Map<string, NodeJS.Timeout>();

const lastRequestTimes = new Map<string, number>();

const getRequestKey = (pageId: string, contentPropertyId: string) =>
	`${pageId}:${contentPropertyId}`;

const fetchContentPropertyWithDedup = (
	pageId: string,
	contentPropertyId: string,
): Promise<ContentProperty> => {
	const requestKey = getRequestKey(pageId, contentPropertyId);

	lastRequestTimes.set(requestKey, Date.now());

	const inFlightRequest = inFlightRequests.get(requestKey);
	if (inFlightRequest) {
		return inFlightRequest;
	}

	const requestPromise = getContentProperty({
		pageId,
		contentPropertyId,
	})
		.then((result) => {
			cache.set(requestKey, result);

			const subscribersForKey = subscribers.get(requestKey);
			if (subscribersForKey) {
				subscribersForKey.forEach((callback) => callback(result));
			}

			inFlightRequests.delete(requestKey);

			if (subscribersForKey && subscribersForKey.size > 0) {
				scheduleNextPoll(pageId, contentPropertyId);
			}

			return result;
		})
		.catch((error) => {
			inFlightRequests.delete(requestKey);

			const subscribersForKey = subscribers.get(requestKey);
			if (subscribersForKey && subscribersForKey.size > 0) {
				scheduleNextPoll(pageId, contentPropertyId);
			}

			throw error;
		});

	inFlightRequests.set(requestKey, requestPromise);

	return requestPromise;
};

const scheduleNextPoll = (pageId: string, contentPropertyId: string) => {
	const requestKey = getRequestKey(pageId, contentPropertyId);

	const existingTimeout = pollingTimeouts.get(requestKey);
	if (existingTimeout) {
		clearTimeout(existingTimeout);
	}

	const lastRequestTime = lastRequestTimes.get(requestKey) || 0;
	const timeElapsed = Date.now() - lastRequestTime;

	const delay = Math.max(100, POLLING_INTERVAL - timeElapsed);

	const timeout = setTimeout(() => {
		const subscribersForKey = subscribers.get(requestKey);
		if (subscribersForKey && subscribersForKey.size > 0) {
			fetchContentPropertyWithDedup(pageId, contentPropertyId).catch((error) => {
				// eslint-disable-next-line no-console
				console.error('Failed to fetch content property:', error);
			});
		} else {
			pollingTimeouts.delete(requestKey);
		}
	}, delay);

	pollingTimeouts.set(requestKey, timeout);
};

type UsePollContentPropertyOptions = {
	contentAri: string;
	sourceDocumentAri: string;
};

export const usePollContentProperty = ({
	sourceDocumentAri,
	contentAri,
}: UsePollContentPropertyOptions) => {
	const [contentProperty, setContentProperty] = useState<ContentProperty | undefined>();
	const initializedRef = useRef(false);

	useEffect(() => {
		const pageId = getPageIdFromAri(sourceDocumentAri);
		const contentPropertyId = getContentPropertyIdFromAri(contentAri);
		const requestKey = getRequestKey(pageId, contentPropertyId);

		const subscribersForKey = subscribers.get(requestKey) || new Set();

		if (!subscribers.has(requestKey)) {
			subscribers.set(requestKey, subscribersForKey);
		}

		subscribersForKey.add(setContentProperty);

		const cachedValue = cache.get(requestKey);
		if (cachedValue) {
			setContentProperty(cachedValue);
		}

		if (subscribersForKey.size === 1 || !initializedRef.current) {
			initializedRef.current = true;
			fetchContentPropertyWithDedup(pageId, contentPropertyId).catch((error) => {
				// eslint-disable-next-line no-console
				console.error('Failed to fetch content property:', error);
			});
		}

		return () => {
			subscribersForKey.delete(setContentProperty);

			if (subscribersForKey.size === 0) {
				subscribers.delete(requestKey);

				const existingTimeout = pollingTimeouts.get(requestKey);
				if (existingTimeout) {
					clearTimeout(existingTimeout);
					pollingTimeouts.delete(requestKey);
				}
			}
		};
	}, [sourceDocumentAri, contentAri]);

	const pageId = getPageIdFromAri(sourceDocumentAri);
	const contentPropertyId = getContentPropertyIdFromAri(contentAri);
	const requestKey = getRequestKey(pageId, contentPropertyId);

	return contentProperty || cache.get(requestKey);
};
