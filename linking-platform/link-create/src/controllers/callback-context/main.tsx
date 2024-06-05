import React, { type PropsWithChildren, useContext, useMemo } from 'react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';

import { ANALYTICS_CHANNEL } from '../../common/constants';
import { type CreatePayload } from '../../common/types';
import { useExperience } from '../../common/ui/experience-tracker';
import createEventPayload from '../../common/utils/analytics/analytics.codegen';
import { getErrorType } from '../../common/utils/errors';

interface LinkCreateCallbackProviderProps {
	/**
	 * This callback for when the resource has been successfully created.
	 */
	onCreate?: (result: CreatePayload) => Promise<void> | void;

	/**
	 * This callback for any errors
	 */
	onFailure?: (error: unknown) => void;

	/**
	 * This callback for when the form was manually discarded by user
	 */
	onCancel?: () => void;
}

const LinkCreateCallbackContext = React.createContext<LinkCreateCallbackProviderProps>({});

const LinkCreateCallbackProvider = ({
	children,
	onCreate,
	onFailure,
	onCancel,
}: PropsWithChildren<LinkCreateCallbackProviderProps>) => {
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const experience = useExperience();

	const handleCreate = useMemo(
		() => ({
			onCreate: async (result: CreatePayload) => {
				/**
				 * We consider the experience successful once we have
				 * successfully created an object
				 */
				experience?.success();

				const { objectId, objectType } = result;

				createAnalyticsEvent(
					createEventPayload('track.object.created.linkCreate', {
						objectId,
						objectType,
					}),
				).fire(ANALYTICS_CHANNEL);

				if (onCreate) {
					await onCreate(result);
				}
			},
		}),
		[createAnalyticsEvent, onCreate, experience],
	);

	const handleFailure = useMemo(
		() => ({
			onFailure: async (error: unknown) => {
				createAnalyticsEvent(
					createEventPayload('track.object.createFailed.linkCreate', {
						failureType: getErrorType(error),
					}),
				).fire(ANALYTICS_CHANNEL);

				experience?.failure(error);

				onFailure && onFailure(error);
			},
		}),
		[createAnalyticsEvent, onFailure, experience],
	);

	const value = useMemo(
		() => ({
			onCancel,
			...handleCreate,
			...handleFailure,
		}),
		[onCancel, handleCreate, handleFailure],
	);

	return (
		<LinkCreateCallbackContext.Provider value={value}>
			{children}
		</LinkCreateCallbackContext.Provider>
	);
};

const useLinkCreateCallback = () => useContext(LinkCreateCallbackContext);

export { LinkCreateCallbackProvider, useLinkCreateCallback };
