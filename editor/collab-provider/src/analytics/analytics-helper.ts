import type { AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import type { GasPurePayload } from '@atlaskit/analytics-gas-types';
import type { ProviderError } from '@atlaskit/editor-common/collab';
import type { ActionAnalyticsEvent, ErrorAnalyticsEvent, EVENT_STATUS } from '../helpers/const';
import { EVENT_ACTION } from '../helpers/const';
import { name as packageName, version as packageVersion } from '../version-wrapper';
import { network } from '../connectivity/singleton';
import { CustomError } from '../errors/custom-errors';

const EVENT_SUBJECT = 'collab';

const loggableErrorName = [
	'RangeError',
	'TypeError',
	'TransformError',
	'NodeNestingTransformError',
];

enum COLLAB_SERVICE {
	NCS = 'ncs',
	SYNCHRONY = 'synchrony',
}

const triggerAnalyticsEvent = (
	analyticsEvent: ActionAnalyticsEvent | ErrorAnalyticsEvent,
	analyticsClient: AnalyticsWebClient | undefined,
) => {
	if (!analyticsClient) {
		return;
	}

	const payload: GasPurePayload = {
		actionSubject: EVENT_SUBJECT,
		attributes: {
			packageName,
			packageVersion,
			collabService: COLLAB_SERVICE.NCS,
			network: {
				status: network.getStatus(),
			},
			...analyticsEvent.attributes,
		},
		tags: ['editor'],
		action: analyticsEvent.eventAction,
		source: 'unknown', // Adds zero analytics value, but event validation throws an error if you don't add it :-(
	};

	if (analyticsEvent.eventAction === EVENT_ACTION.ERROR) {
		payload.nonPrivacySafeAttributes = analyticsEvent.nonPrivacySafeAttributes;
		try {
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const requestIdleCallbackFunction = (window as any).requestIdleCallback;
			const runItLater =
				typeof requestIdleCallbackFunction === 'function'
					? requestIdleCallbackFunction
					: window.requestAnimationFrame;
			runItLater(() => {
				analyticsClient.sendTrackEvent(payload);
			});
		} catch (error) {
			// silently fail for now https://product-fabric.atlassian.net/browse/ESS-3112
		}
	} else {
		// Let the browser figure out
		// when it should send those events
		try {
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const requestIdleCallbackFunction = (window as any).requestIdleCallback;
			const runItLater =
				typeof requestIdleCallbackFunction === 'function'
					? requestIdleCallbackFunction
					: window.requestAnimationFrame;
			runItLater(() => {
				analyticsClient.sendOperationalEvent(payload);
			});
		} catch (error) {
			// silently fail for now https://product-fabric.atlassian.net/browse/ESS-3112
		}
	}
};

export default class AnalyticsHelper {
	analyticsClient: AnalyticsWebClient | undefined;
	getAnalyticsClient: Promise<AnalyticsWebClient> | undefined;
	documentAri: string;
	subProduct: string | undefined;

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/max-params
	constructor(
		documentAri: string,
		subProduct?: string,
		analyticsClient?: AnalyticsWebClient,
		getAnalyticsClient?: Promise<AnalyticsWebClient>,
	) {
		this.documentAri = documentAri;
		this.subProduct = subProduct;
		this.analyticsClient = analyticsClient;
		this.getAnalyticsClient = getAnalyticsClient;
	}

	sendErrorEvent(error: unknown, errorMessage: string) {
		let errorExtraAttributes = {};
		if (error instanceof CustomError) {
			errorExtraAttributes = error.getExtraErrorEventAttributes() || {};
		}
		const errorAnalyticsEvent: ErrorAnalyticsEvent = {
			eventAction: EVENT_ACTION.ERROR,
			attributes: {
				documentAri: this.documentAri,
				subProduct: this.subProduct,
				errorMessage,
				errorName: error instanceof Error ? error.name : undefined,
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				errorCode: (error as any).data?.code ?? undefined,
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				errorStatus: (error as any).data?.status ?? undefined,
				errorStack:
					error instanceof Error && loggableErrorName.includes(error.name)
						? error.stack
						: undefined,
				originalErrorMessage: this.getUGCFreeErrorMessage(error),
				...errorExtraAttributes,
			},
			nonPrivacySafeAttributes: {
				error,
			},
		};
		this.sendEvent(errorAnalyticsEvent);
	}

	sendProviderErrorEvent(error: ProviderError) {
		const errorAnalyticsEvent: ErrorAnalyticsEvent = {
			eventAction: EVENT_ACTION.ERROR,
			attributes: {
				documentAri: this.documentAri,
				subProduct: this.subProduct,
				errorMessage: 'Error emitted',
				originalErrorMessage: error.message,
				errorCode: error.code,
				mappedError: error,
			},
		};
		this.sendEvent(errorAnalyticsEvent);
	}

	sendActionEvent(
		action: ActionAnalyticsEvent['eventAction'],
		status: EVENT_STATUS,
		attributes?: Omit<
			ActionAnalyticsEvent['attributes'],
			'documentAri' | 'subProduct' | 'eventStatus'
		>, // This breaks discriminated unions, because there is no obvious field to discriminate against any more
	) {
		const analyticsEvent = {
			eventAction: action,
			attributes: {
				documentAri: this.documentAri,
				subProduct: this.subProduct,
				eventStatus: status,
				...attributes,
			},
		} as ActionAnalyticsEvent;
		this.sendEvent(analyticsEvent);
	}

	private async sendEvent(event: ActionAnalyticsEvent | ErrorAnalyticsEvent) {
		if (this.getAnalyticsClient && !this.analyticsClient) {
			try {
				this.analyticsClient = await this.getAnalyticsClient;
			} catch (error) {
				// fail silently
			}
		}
		triggerAnalyticsEvent(event, this.analyticsClient);
	}

	private getUGCFreeErrorMessage(error: unknown): string | undefined {
		if (error instanceof Error && loggableErrorName.includes(error.name)) {
			return error.message;
		} else {
			return undefined;
		}
	}
}
