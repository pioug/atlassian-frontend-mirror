import { useEffect, useMemo } from 'react';

import { useSmartLinkLifecycleAnalytics } from '@atlaskit/link-analytics';

import type { LinkCreatedEvent, LinkDeletedEvent, LinkUpdatedEvent } from '../analytics/types';
import { EVENT, EVENT_SUBJECT } from '../analytics/types';
import { appearanceForLink, getUrl } from '../analytics/utils';

import type { AnalyticsBindingsProps } from './common';
import { getDeleteType, getMethod, getSourceEventFromMetadata, getUpdateType } from './common';

/**
 * Set display category as `link` if not displaying the link as a smart card
 */
const displayCategoryFromDisplay = (display: string) => {
	if (display === 'url') {
		return 'link';
	}
};

type LinkEventHandlers = {
	[EVENT.CREATED]: (data: LinkCreatedEvent['data']) => void;
	[EVENT.DELETED]: (data: LinkDeletedEvent['data']) => void;
	[EVENT.UPDATED]: (data: LinkUpdatedEvent['data']) => void;
};

/**
 * Subscribes to the events occuring in the card
 * plugin and fires analytics events accordingly
 */
export const LinkEventsBinding = ({ cardPluginEvents }: AnalyticsBindingsProps) => {
	/**
	 * These callbacks internally use window.requestIdleCallback/requestAnimationFrame
	 * to defer any heavy operations involving network
	 *
	 * The callbacks themselves should not be deferred, they should be called syncronously the moment
	 * the events take place.
	 */
	const { linkCreated, linkUpdated, linkDeleted } = useSmartLinkLifecycleAnalytics();

	const linkEvents = useMemo((): LinkEventHandlers => {
		return {
			[EVENT.CREATED]: ({ node, nodeContext, ...metadata }) => {
				const url = getUrl(node);
				if (!url) {
					return;
				}

				const display = appearanceForLink(node);
				const displayCategory = displayCategoryFromDisplay(display);
				const sourceEvent = getSourceEventFromMetadata(metadata);
				const creationMethod = getMethod(metadata);

				linkCreated({ url, displayCategory }, sourceEvent, {
					display,
					nodeContext,
					creationMethod,
				});
			},
			[EVENT.UPDATED]: ({ node, nodeContext, previousDisplay, ...metadata }) => {
				const url = getUrl(node);
				if (!url) {
					return;
				}

				const display = appearanceForLink(node);
				const displayCategory = displayCategoryFromDisplay(display);
				const sourceEvent = getSourceEventFromMetadata(metadata);
				const updateMethod = getMethod(metadata);
				const updateType = getUpdateType(metadata);

				linkUpdated({ url, displayCategory }, sourceEvent, {
					display,
					previousDisplay,
					nodeContext,
					updateMethod,
					updateType,
				});
			},
			[EVENT.DELETED]: ({ node, nodeContext, ...metadata }) => {
				const url = getUrl(node);
				if (!url) {
					return;
				}

				const display = appearanceForLink(node);
				const displayCategory = displayCategoryFromDisplay(display);
				const sourceEvent = getSourceEventFromMetadata(metadata);
				const deleteMethod = getMethod(metadata);
				const deleteType = getDeleteType(metadata);

				linkDeleted({ url, displayCategory }, sourceEvent, {
					display,
					nodeContext,
					deleteMethod,
					deleteType,
				});
			},
		};
	}, [linkCreated, linkUpdated, linkDeleted]);

	/**
	 * Subscribe to link events
	 */
	useEffect(() => {
		const unsubscribe = cardPluginEvents.subscribe(({ event, subject, data }) => {
			if (subject === EVENT_SUBJECT.LINK) {
				linkEvents[event](data);
			}
		});

		return () => unsubscribe();
	}, [linkEvents, cardPluginEvents]);

	return null;
};
