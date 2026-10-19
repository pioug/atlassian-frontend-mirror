import type {
	XpcArrivalObservation,
	XpcDepartureObservation,
	XpcNavigationReporter,
} from './xpcNavigationObservation';

type XpcAwcAttribute = number | string;

export interface XpcAwcClient {
	sendTrackEvent(event: {
		action: string;
		actionSubject: string;
		attributes: Record<string, XpcAwcAttribute>;
		source: string;
	}): Promise<unknown>;
}

const toTrackAttributes = (
	observation: XpcDepartureObservation,
): Record<string, XpcAwcAttribute> => {
	const destination =
		observation.destination.outcome === 'same' || observation.destination.outcome === 'cross'
			? {
					destinationProduct: observation.destination.destinationProduct,
					...(observation.destination.destinationSubProduct
						? {
								destinationSubProduct: observation.destination.destinationSubProduct,
							}
						: {}),
					destinationMatcherId: observation.destination.matcherId,
					...(observation.destination.routeFamily
						? { destinationRouteFamily: observation.destination.routeFamily }
						: {}),
				}
			: {};

	return {
		schemaVersion: observation.schemaVersion,
		taxonomyVersion: observation.taxonomyVersion,
		sourceProduct: observation.sourceProduct,
		...(observation.sourceSubProduct ? { sourceSubProduct: observation.sourceSubProduct } : {}),
		destinationOutcome: observation.destination.outcome,
		destinationReason: observation.destination.reason,
		destinationClassificationMethod: observation.destination.classificationMethod,
		destinationConfidence: observation.destination.confidence,
		...destination,
		handoffOutcome: observation.handoffOutcome,
		surface: observation.surface,
		captureMethod: observation.captureMethod,
		navigationMechanism: observation.navigationMechanism,
		instrumentationClass: observation.instrumentationClass,
		...(observation.xpisVersion ? { xpisVersion: observation.xpisVersion } : {}),
	};
};

const toArrivalTrackAttributes = (
	observation: XpcArrivalObservation,
): Record<string, XpcAwcAttribute> => ({
	schemaVersion: observation.schemaVersion,
	taxonomyVersion: observation.taxonomyVersion,
	destinationProduct: observation.destinationProduct,
	...(observation.destinationSubProduct
		? { destinationSubProduct: observation.destinationSubProduct }
		: {}),
	...(observation.destinationRouteFamily
		? { destinationRouteFamily: observation.destinationRouteFamily }
		: {}),
	arrivalMethod: observation.arrivalMethod,
	...(observation.xpisVersion ? { xpisVersion: observation.xpisVersion } : {}),
});

/**
 * Reports privacy-safe Stream 3 observations through a product's existing AWC
 * instance. Compatible XPIS identifiers stay out of event attributes until
 * their production privacy treatment is approved.
 */
export const createXpcAwcNavigationReporter = (
	analyticsClient: XpcAwcClient,
): XpcNavigationReporter => ({
	reportArrival: (observation) => {
		try {
			void analyticsClient
				.sendTrackEvent({
					action: 'arrivalObserved',
					actionSubject: 'xpcNavigation',
					attributes: toArrivalTrackAttributes(observation),
					source: observation.destinationProduct,
				})
				.catch(() => undefined);
		} catch {
			// Observation must never affect product loading.
		}
	},
	reportDeparture: (observation) => {
		try {
			void analyticsClient
				.sendTrackEvent({
					action: 'departureObserved',
					actionSubject: 'xpcNavigation',
					attributes: toTrackAttributes(observation),
					source: observation.sourceProduct,
				})
				.catch(() => undefined);
		} catch {
			// Observation must never affect navigation.
		}
	},
});
