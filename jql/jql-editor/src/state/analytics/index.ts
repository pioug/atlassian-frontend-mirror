import { type Action } from 'react-sweet-state';
import { Subscription } from 'rxjs/Subscription';

import { EventType } from '@atlaskit/jql-editor-common/constants';
import { type AnalyticsAttributes } from '@atlaskit/jql-editor-common/analytics/types';

import { ActionSubject, Action as AnalyticsAction } from '../../analytics/constants';
import { bucketJqlFunctionName } from '../../utils/team-jql-functions/bucketJqlFunctionName';
import { type OptionsKey, type Props, type State } from '../types';

export const ANALYTICS_DEBOUNCE_MS = 2000;
const AUTOCOMPLETE_ANALYTICS_MEASURE = 'jql-editor-autocomplete';

export type AutocompleteEvent = {
	analyticsSubscription: Subscription;
	onStopAutocompleteEvent: (
		isSuccess: boolean,
		optionTypes: OptionsKey[],
		hasOptions: boolean,
		functionName?: string,
	) => void;
};

export const onStartAutocompleteEvent =
	(): Action<State, Props, AutocompleteEvent> =>
	(_, { createAndFireAnalyticsEvent }) => {
		performance.clearMeasures(AUTOCOMPLETE_ANALYTICS_MEASURE);
		performance.clearMarks(`${AUTOCOMPLETE_ANALYTICS_MEASURE}::start`);
		performance.mark(`${AUTOCOMPLETE_ANALYTICS_MEASURE}::start`);

		let timeoutId: number | null = null;
		const promise = new Promise<void>((resolve) => {
			// Resolve the promise after a fixed debounce period
			timeoutId = window.setTimeout(() => {
				resolve();
			}, ANALYTICS_DEBOUNCE_MS);
		});

		// Create a new subscription which will cancel the analytics promise when unsubscribed
		const analyticsSubscription = new Subscription(() => {
			timeoutId !== null && window.clearTimeout(timeoutId);
		});

		const onStopAutocompleteEvent = (
			isSuccess: boolean,
			optionTypes: OptionsKey[],
			hasOptions: boolean,
			functionName?: string,
		): Promise<void> => {
			performance.measure(
				AUTOCOMPLETE_ANALYTICS_MEASURE,
				`${AUTOCOMPLETE_ANALYTICS_MEASURE}::start`,
			);
			const entry = performance.getEntriesByName(AUTOCOMPLETE_ANALYTICS_MEASURE).pop();
			const duration = entry?.duration;

			// Fire our analytics event once our autocomplete data is fetched AND our debounced promise is resolved
			return promise.then(() => {
				const attributes: AnalyticsAttributes = {
					optionTypes: optionTypes.sort(),
					hasOptions,
				};

				if (duration !== undefined) {
					attributes.duration = duration;
				}

				if (functionName !== undefined && functionName.trim() !== '') {
					attributes.functionName = bucketJqlFunctionName(functionName);
				}

				createAndFireAnalyticsEvent({
					action: isSuccess ? AnalyticsAction.RETRIEVED : AnalyticsAction.RETRIEVE_FAILED,
					actionSubject: ActionSubject.AUTOCOMPLETE_OPTION,
					eventType: EventType.OPERATIONAL,
					attributes,
				});
			});
		};

		return { analyticsSubscription, onStopAutocompleteEvent };
	};
