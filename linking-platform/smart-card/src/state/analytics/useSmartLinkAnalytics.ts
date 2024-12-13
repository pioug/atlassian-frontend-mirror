import { useMemo } from 'react';

import { useSmartLinkContext } from '@atlaskit/link-provider';
import { getUrl } from '@atlaskit/linking-common';

import {
	context,
	invokeFailedEvent,
	invokeSucceededEvent,
	uiActionClickedEvent,
	uiRenderFailedEvent,
	uiRenderSuccessEvent,
} from '../../utils/analytics';
import {
	type CommonEventProps,
	type InvokeFailedEventProps,
	type InvokeSucceededEventProps,
	type UiActionClickedEventProps,
	type UiRenderFailedEventProps,
	type UiRenderSuccessEventProps,
} from '../../utils/analytics/types';
import { type AnalyticsName, type AnalyticsPayload } from '../../utils/types';
import {
	getDefinitionId,
	getExtensionKey,
	getProduct,
	getResourceType,
	getStatusDetails,
	getSubproduct,
} from '../helpers';

import { failUfoExperience, startUfoExperience, succeedUfoExperience } from './ufoExperiences';
import { useDispatchAnalytics } from './useDispatchAnalytics';

const applyCommonAttributes = (event: AnalyticsPayload, commonAttributes: CommonEventProps) => {
	if (event && event.attributes) {
		for (const [key, value] of Object.entries(commonAttributes)) {
			if (event.attributes[key] === undefined) {
				event.attributes[key] = value;
			}
		}
	}
	return event;
};

/**
 * This hook provides usage of Smart Link analytics outside of the Card component.
 * Can be provided to Card via the analyticsEvents prop to change the analytics events.
 *
 * @param url URL of the link
 * @param id fallback id of the events sent if no id is available
 * @param defaultLocation location attribute to be used
 * @returns
 */
export const useSmartLinkAnalytics = (url: string, id?: string, defaultLocation?: string) => {
	const { dispatchAnalytics } = useDispatchAnalytics();

	const defaultId = id || 'NULL';
	// We don't want to trigger a re-render by using useSmartCardState
	const { store } = useSmartLinkContext();
	const state = store ? getUrl(store, url) : undefined;
	const details = state ? state.details : undefined;

	const extractedDefinitionId = getDefinitionId(details);
	const extractedExtensionKey = getExtensionKey(details);
	const extractedResourceType = getResourceType(details);
	const extractedSubproduct = getSubproduct(details);
	const extractedProduct = getProduct(details);
	const extractedStatusDetails = getStatusDetails(details);

	const commonAttributes: CommonEventProps = useMemo(
		() => ({
			id: defaultId,
			definitionId: extractedDefinitionId,
			extensionKey: extractedExtensionKey,
			resourceType: extractedResourceType,
			destinationObjectType: extractedResourceType,
			destinationSubproduct: extractedSubproduct,
			destinationProduct: extractedProduct,
			location: defaultLocation,
			statusDetails: extractedStatusDetails,
		}),
		[
			defaultId,
			extractedDefinitionId,
			extractedExtensionKey,
			extractedResourceType,
			extractedSubproduct,
			extractedProduct,
			defaultLocation,
			extractedStatusDetails,
		],
	);

	/** Contains all ui analytics events */
	const ui = useMemo(
		() => ({
			/**
			 * This fires an event that represents when a user
			 * click a button.
			 * @param data A partial analytics event payload
			 * @deprecated consider removing when cleaning up FF platform-smart-card-migrate-embed-modal-analytics
			 */
			buttonClickedEvent: (
				data: Partial<AnalyticsPayload> & {
					actionSubjectId: Required<string>;
				},
			) =>
				dispatchAnalytics(
					applyCommonAttributes(
						{
							action: 'clicked',
							actionSubject: 'button',
							actionSubjectId: data.actionSubjectId,
							attributes: { ...context, ...data.attributes },
							eventType: 'ui',
						},
						commonAttributes,
					),
				),
			/**
			 * This fires an event that represents when a user clicks on a Smart Link action.
			 * Note: This also starts the UFO smart-link-action-invocation experience.
			 * @param id The unique ID for this Smart Link.
			 * @param extensionKey The extensionKey of the Smart Link resovler invoked.
			 * @param actionType The type of the action that was clicked, e.g. PreviewAction
			 * @param display Whether the card was an Inline, Block, Embed or Flexible UI.
			 * @returns
			 */
			actionClickedEvent: ({
				id,
				actionType,
				display,
				extensionKey: overrideExtensionKey,
				definitionId,
				resourceType,
				destinationProduct,
				destinationSubproduct,
				location,
			}: UiActionClickedEventProps) => {
				const extensionKey = overrideExtensionKey ?? extractedExtensionKey;
				dispatchAnalytics(
					applyCommonAttributes(
						uiActionClickedEvent({
							id: id ?? defaultId,
							actionType,
							display,
							extensionKey,
							definitionId,
							resourceType,
							destinationProduct,
							destinationSubproduct,
							location,
						}),
						commonAttributes,
					),
				);
			},
			/**
			 * This fires an event that represents when a user close a modal.
			 * @param data A partial analytics event payload
			 * @deprecated consider removing when cleaning up FF platform-smart-card-migrate-embed-modal-analytics
			 */
			modalClosedEvent: (
				data: Partial<AnalyticsPayload> & {
					actionSubjectId: Required<string>;
				},
			) =>
				dispatchAnalytics(
					applyCommonAttributes(
						{
							action: 'closed',
							actionSubject: 'modal',
							actionSubjectId: data.actionSubjectId,
							attributes: { ...context, ...data.attributes },
							eventType: 'ui',
						},
						commonAttributes,
					),
				),
			/**
			 * This fires an event that represents when a Smart Link was rendered successfully.
			 * Note: this fires even if the Smart Link request errored out.
			 * @param display Whether the card was an Inline, Block, Embed or Flexible UI.
			 * @param id The unique ID for this Smart Link.
			 * @param definitionId The definitionId of the Smart Link resolver invoked.
			 * @param extensionKey The extensionKey of the Smart Link resovler invoked.
			 * @param canBeDatasource An indicator that shows that a smart link can be converted to a datasource
			 * @deprecated consider removing when cleaning up FF platform-smart-card-migrate-embed-modal-analytics
			 */
			renderSuccessEvent: ({
				display,
				status,
				id,
				extensionKey,
				definitionId,
				resourceType,
				destinationProduct,
				destinationSubproduct,
				location,
				canBeDatasource = false,
			}: UiRenderSuccessEventProps) => {
				const experienceId = id ? id : defaultId;
				succeedUfoExperience('smart-link-rendered', experienceId, {
					extensionKey,
					display,
				});

				// UFO will disregard this if authentication experience has not yet been started
				succeedUfoExperience('smart-link-authenticated', experienceId, {
					display,
				});

				dispatchAnalytics(
					applyCommonAttributes(
						uiRenderSuccessEvent({
							display,
							status,
							extensionKey,
							definitionId,
							resourceType,
							destinationProduct,
							destinationSubproduct,
							location,
							canBeDatasource,
						}),
						commonAttributes,
					),
				);
			},
			/**
			 * This fires an event that represents when a Smart Link renders unsuccessfuly.
			 * @param display Whether the card was an Inline, Block, Embed or Flexible UI.
			 * @param id The unique ID for this Smart Link.
			 * @param error: An error representing why the Smart Link render failed.
			 * @param errorInfo: Additional details about the error including the stack trace.
			 * @deprecated consider removing when cleaning up FF platform-smart-card-migrate-embed-modal-analytics
			 */
			renderFailedEvent: ({
				display,
				id,
				error,
				errorInfo,
				extensionKey,
				definitionId,
				resourceType,
				destinationProduct,
				destinationSubproduct,
				location,
			}: UiRenderFailedEventProps) => {
				const experienceId = id ? id : defaultId;
				// Start and fail the smart-link-rendered experience. If it has already
				// been started nothing happens.
				startUfoExperience('smart-link-rendered', experienceId);
				failUfoExperience('smart-link-rendered', experienceId);
				failUfoExperience('smart-link-authenticated', experienceId);

				dispatchAnalytics(
					applyCommonAttributes(
						uiRenderFailedEvent({
							display,
							error,
							errorInfo,
							extensionKey,
							definitionId,
							resourceType,
							destinationProduct,
							destinationSubproduct,
							location,
						}),
						commonAttributes,
					),
				);
			},
		}),
		[dispatchAnalytics, commonAttributes, defaultId, extractedExtensionKey],
	);

	/** Contains all operational analytics events */
	const operational = useMemo(
		() => ({
			/**
			 * This fires an event that represents an action being successfully invoked.
			 * @param id The unique ID for this Smart Link.
			 * @param extensionKey The extensionKey of the Smart Link resovler invoked.
			 * @param actionType The type of action invoked, e.g. PreviewAction
			 * @param display Whether the card was an Inline, Block, Embed or Flexible UI.
			 */
			invokeSucceededEvent: ({
				id,
				actionType,
				display,
				extensionKey,
				definitionId,
				resourceType,
				destinationProduct,
				destinationSubproduct,
				location,
			}: InvokeSucceededEventProps) => {
				dispatchAnalytics(
					applyCommonAttributes(
						invokeSucceededEvent({
							id: id ?? defaultId,
							actionType,
							display,
							extensionKey,
							definitionId,
							resourceType,
							destinationProduct,
							destinationSubproduct,
							location,
						}),
						commonAttributes,
					),
				);
			},
			/**
			 * This fires an event that represents an action being unsuccessfully invoked.
			 * @param id The unique ID for this Smart Link.
			 * @param extensionKey The extensionKey of the Smart Link resovler invoked.
			 * @param actionType The type of action invoked, e.g. PreviewAction
			 * @param display Whether the card was an Inline, Block, Embed or Flexible UI.
			 * @param reason The reason the invocation failed.
			 */
			invokeFailedEvent: ({
				id,
				actionType,
				display,
				reason,
				extensionKey,
				definitionId,
				resourceType,
				destinationProduct,
				destinationSubproduct,
				location,
			}: InvokeFailedEventProps) => {
				dispatchAnalytics(
					applyCommonAttributes(
						invokeFailedEvent({
							id: id ?? defaultId,
							actionType,
							display,
							reason,
							extensionKey,
							definitionId,
							resourceType,
							destinationProduct,
							destinationSubproduct,
							location,
						}),
						commonAttributes,
					),
				);
			},
		}),
		[defaultId, commonAttributes, dispatchAnalytics],
	);

	/** Contains all screen analytics events */
	const screen = useMemo(
		() => ({
			/**
			 * This fires an event that represents when a user view a modal.
			 * @deprecated consider removing when cleaning up FF platform-smart-card-migrate-embed-modal-analytics
			 */
			modalViewedEvent: (
				data: Partial<AnalyticsPayload> & {
					name: Extract<AnalyticsName, 'embedPreviewModal'>;
				},
			) =>
				dispatchAnalytics(
					applyCommonAttributes(
						{
							action: 'viewed',
							actionSubject: data.name,
							attributes: { ...context, ...data.attributes },
							eventType: 'screen',
							name: data.name,
						},
						commonAttributes,
					),
				),
		}),
		[commonAttributes, dispatchAnalytics],
	);

	return useMemo(() => ({ ui, operational, screen }), [ui, operational, screen]);
};

export type AnalyticsFacade = ReturnType<typeof useSmartLinkAnalytics>;
