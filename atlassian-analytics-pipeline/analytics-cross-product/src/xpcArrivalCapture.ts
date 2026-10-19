import type { XpcProductId, XpcRouteFamily, XpcSubProductId } from './xpcDestinationResolver';
import {
	type CompatibleXpis,
	XpcNavigationObservation,
	type XpcNavigationReporter,
} from './xpcNavigationObservation';

export interface XpcArrivalCaptureOptions {
	arrivalMethod: 'frontendInitialLoad' | 'frontendSpaRoute';
	baseUrl: string;
	destinationProduct: XpcProductId;
	destinationRouteFamily?: XpcRouteFamily;
	destinationSubProduct?: XpcSubProductId;
	isEnabled?: () => boolean;
	parseCompatibleXpis?: (encodedValue: string) => CompatibleXpis | null;
	reporter: XpcNavigationReporter;
	taxonomyVersion: number;
	url: string;
}

/**
 * Reports destination evidence only when the arrival URL contains XPIS.
 *
 * The URL is inspected locally and is never retained in the observation.
 */
export const captureXpcArrival = ({
	arrivalMethod,
	baseUrl,
	destinationProduct,
	destinationRouteFamily,
	destinationSubProduct,
	isEnabled,
	parseCompatibleXpis,
	reporter,
	taxonomyVersion,
	url,
}: XpcArrivalCaptureOptions): void => {
	if (isEnabled?.() === false || !reporter.reportArrival) {
		return;
	}

	try {
		const xpis = XpcNavigationObservation.inspectXpis({
			baseUrl,
			parseCompatibleValue: parseCompatibleXpis,
			url,
		});
		if (xpis.kind !== 'present' && xpis.kind !== 'compatible') {
			return;
		}

		reporter.reportArrival(
			XpcNavigationObservation.createArrival({
				arrivalMethod,
				destinationProduct,
				destinationRouteFamily,
				destinationSubProduct,
				taxonomyVersion,
				xpis,
			}),
		);
	} catch {
		// Observation must never affect product loading.
	}
};
