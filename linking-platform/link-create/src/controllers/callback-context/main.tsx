import React, { type PropsWithChildren, useContext, useMemo } from 'react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next/useAnalyticsEvents';

import { ANALYTICS_CHANNEL } from '../../common/constants';
import { type CreatePayload, type LinkCreateFailureContext } from '../../common/types';
import { useExperience } from '../../common/ui/experience-tracker';
import createEventPayload from '../../common/utils/analytics/analytics.codegen';
import { getErrorType, getNetworkFields } from '../../common/utils/errors';

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

/**
 * The value exposed through context. This differs from the provider's own props: internal callers
 * may additionally supply a `LinkCreateFailureContext` identifying which operation failed, which is
 * recorded in analytics but never forwarded to the consumer's `onFailure` prop.
 */
type LinkCreateCallbackContextValue = Omit<LinkCreateCallbackProviderProps, 'onFailure'> & {
	onFailure?: (error: unknown, context?: LinkCreateFailureContext) => void;
};

const LinkCreateCallbackContext = React.createContext<LinkCreateCallbackContextValue>({});

const LinkCreateCallbackProvider = ({
	children,
	onCreate,
	onFailure,
	onCancel,
}: PropsWithChildren<LinkCreateCallbackProviderProps>): React.JSX.Element => {
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
			onFailure: async (error: unknown, context?: LinkCreateFailureContext) => {
				const { status } = getNetworkFields(error);

				createAnalyticsEvent(
					createEventPayload('track.object.createFailed.linkCreate', {
						failureType: getErrorType(error),
						operation: context?.operation ?? null,
						status,
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

const useLinkCreateCallback = (): LinkCreateCallbackContextValue =>
	useContext(LinkCreateCallbackContext);

export { LinkCreateCallbackProvider, useLinkCreateCallback };
