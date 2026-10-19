import type {
	XpcDestinationResolution,
	XpcRouteFamily,
	XpcSource,
	XpcSubProductId,
} from './xpcDestinationResolver';

const CONTROLLED_SURFACE_PATTERN = /^[a-z][a-z0-9-]*$/;
const COMPATIBLE_XPIS_FIELD_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;
const INTERACTION_SESSION_ID_PATTERN = /^[A-Za-z0-9_-]{1,128}$/;
const MAX_CONTROLLED_SURFACE_LENGTH = 64;

declare const controlledSurfaceBrand: unique symbol;

export type XpcSurface = string & {
	readonly [controlledSurfaceBrand]: 'surface';
};

export type XpcCaptureMethod =
	| 'nativeDocument'
	| 'rendererFinalSink'
	| 'imperativeFinalSink'
	| 'routerFinalSink';

export type XpcNavigationMechanism =
	| 'nativeAnchor'
	| 'rendererCallback'
	| 'imperativeApi'
	| 'routerExternal';

export type XpcInstrumentationClass =
	| 'automaticXpis'
	| 'preservedXpis'
	| 'xpisPresent'
	| 'observedOnly';

export type CompatibleXpis = {
	interactionSessionId: string;
	version: number;
};

export type XpisInspection =
	| { kind: 'absent' }
	| { kind: 'present'; occurrenceCount: number }
	| ({ kind: 'compatible'; occurrenceCount: 1 } & CompatibleXpis)
	| { kind: 'unreadable' };

export type XpcDepartureObservation = {
	captureMethod: XpcCaptureMethod;
	destination: XpcDestinationResolution;
	handoffOutcome: 'accepted' | 'unknown';
	instrumentationClass: XpcInstrumentationClass;
	interactionSessionId?: string;
	navigationMechanism: XpcNavigationMechanism;
	schemaVersion: 1;
	sourceProduct: XpcSource['product'];
	sourceSubProduct?: XpcSubProductId;
	surface: XpcSurface;
	taxonomyVersion: number;
	type: 'xpcDepartureObserved';
	xpisVersion?: number;
};

export type XpcArrivalObservation = {
	arrivalMethod: 'frontendInitialLoad' | 'frontendSpaRoute' | 'existingBehavioralEvent';
	destinationProduct: XpcSource['product'];
	destinationRouteFamily?: XpcRouteFamily;
	destinationSubProduct?: XpcSubProductId;
	interactionSessionId?: string;
	schemaVersion: 1;
	taxonomyVersion: number;
	type: 'xpcArrivalObserved';
	xpisVersion?: number;
};

export interface XpcNavigationReporter {
	reportArrival?(observation: XpcArrivalObservation): void;
	reportDeparture(observation: XpcDepartureObservation): void;
}

export type XpcInspectXpisInput = {
	baseUrl: string;
	parseCompatibleValue?: (encodedValue: string) => CompatibleXpis | null;
	url: string;
};

export type XpcDepartureObservationInput = {
	captureMethod: XpcCaptureMethod;
	destination: XpcDestinationResolution;
	handoffOutcome: 'accepted' | 'unknown';
	navigationMechanism: XpcNavigationMechanism;
	provenance?: 'automaticXpis' | 'preservedXpis';
	source: XpcSource;
	surface: XpcSurface;
	xpis: Exclude<XpisInspection, { kind: 'unreadable' }>;
};

export type XpcArrivalObservationInput = {
	arrivalMethod: XpcArrivalObservation['arrivalMethod'];
	destinationProduct: XpcSource['product'];
	destinationRouteFamily?: XpcRouteFamily;
	destinationSubProduct?: XpcSubProductId;
	taxonomyVersion: number;
	xpis: Extract<XpisInspection, { kind: 'compatible' | 'present' }>;
};

const createXpcSurface = (value: string): XpcSurface => {
	if (value.length > MAX_CONTROLLED_SURFACE_LENGTH || !CONTROLLED_SURFACE_PATTERN.test(value)) {
		throw new Error('Invalid controlled XPC surface value');
	}

	return value as XpcSurface;
};

const inspectXpis = ({
	baseUrl,
	parseCompatibleValue,
	url,
}: XpcInspectXpisInput): XpisInspection => {
	let parsedUrl: URL;

	try {
		parsedUrl = new URL(url, baseUrl);
	} catch {
		return { kind: 'unreadable' };
	}

	const values = parsedUrl.searchParams.getAll('xpis');
	if (values.length === 0) {
		return { kind: 'absent' };
	}

	if (values.length !== 1 || !parseCompatibleValue) {
		return { kind: 'present', occurrenceCount: values.length };
	}

	const compatibleValue = parseCompatibleValue(values[0]);
	if (
		!compatibleValue ||
		!INTERACTION_SESSION_ID_PATTERN.test(compatibleValue.interactionSessionId) ||
		!Number.isSafeInteger(compatibleValue.version) ||
		compatibleValue.version < 1
	) {
		return { kind: 'present', occurrenceCount: 1 };
	}

	return {
		kind: 'compatible',
		occurrenceCount: 1,
		interactionSessionId: compatibleValue.interactionSessionId,
		version: compatibleValue.version,
	};
};

const getInstrumentationClass = ({
	provenance,
	xpis,
}: {
	provenance?: 'automaticXpis' | 'preservedXpis';
	xpis: Exclude<XpisInspection, { kind: 'unreadable' }>;
}): XpcInstrumentationClass => {
	if (provenance) {
		return provenance;
	}

	return xpis.kind === 'absent' ? 'observedOnly' : 'xpisPresent';
};

const parseCompatibleXpis = (encodedValue: string): CompatibleXpis | null => {
	try {
		const value: unknown = JSON.parse(globalThis.atob(encodedValue));
		if (!value || typeof value !== 'object') {
			return null;
		}

		const {
			bridge,
			id,
			source,
			version = 1,
		} = value as {
			bridge?: unknown;
			id?: unknown;
			source?: unknown;
			version?: unknown;
		};
		if (
			typeof bridge !== 'string' ||
			!COMPATIBLE_XPIS_FIELD_PATTERN.test(bridge) ||
			typeof id !== 'string' ||
			typeof source !== 'string' ||
			!COMPATIBLE_XPIS_FIELD_PATTERN.test(source) ||
			version !== 1
		) {
			return null;
		}

		return { interactionSessionId: id, version };
	} catch {
		return null;
	}
};

const copyDestination = (destination: XpcDestinationResolution): XpcDestinationResolution => {
	if (destination.outcome === 'same' || destination.outcome === 'cross') {
		const knownDestination = {
			classificationMethod: destination.classificationMethod,
			confidence: destination.confidence,
			destinationProduct: destination.destinationProduct,
			...(destination.destinationSubProduct
				? { destinationSubProduct: destination.destinationSubProduct }
				: {}),
			matcherId: destination.matcherId,
			...(destination.routeFamily ? { routeFamily: destination.routeFamily } : {}),
			taxonomyVersion: destination.taxonomyVersion,
		} as const;

		if (destination.outcome === 'same') {
			return {
				...knownDestination,
				outcome: destination.outcome,
				reason: destination.reason,
			};
		}

		return {
			...knownDestination,
			outcome: destination.outcome,
			reason: destination.reason,
		};
	}

	if (destination.outcome === 'unknown') {
		return {
			classificationMethod: destination.classificationMethod,
			confidence: destination.confidence,
			outcome: destination.outcome,
			reason: destination.reason,
			taxonomyVersion: destination.taxonomyVersion,
		};
	}

	return {
		classificationMethod: destination.classificationMethod,
		confidence: destination.confidence,
		outcome: destination.outcome,
		reason: destination.reason,
		taxonomyVersion: destination.taxonomyVersion,
	};
};

const createXpcDepartureObservation = ({
	captureMethod,
	destination,
	handoffOutcome,
	navigationMechanism,
	provenance,
	source,
	surface,
	xpis,
}: XpcDepartureObservationInput): XpcDepartureObservation => {
	const compatibleXpis = xpis.kind === 'compatible' ? xpis : undefined;

	return {
		schemaVersion: 1,
		taxonomyVersion: destination.taxonomyVersion,
		type: 'xpcDepartureObserved',
		sourceProduct: source.product,
		...(source.subProduct ? { sourceSubProduct: source.subProduct } : {}),
		destination: copyDestination(destination),
		handoffOutcome,
		surface,
		captureMethod,
		navigationMechanism,
		instrumentationClass: getInstrumentationClass({ provenance, xpis }),
		...(compatibleXpis
			? {
					interactionSessionId: compatibleXpis.interactionSessionId,
					xpisVersion: compatibleXpis.version,
				}
			: {}),
	};
};

const createXpcArrivalObservation = ({
	arrivalMethod,
	destinationProduct,
	destinationRouteFamily,
	destinationSubProduct,
	taxonomyVersion,
	xpis,
}: XpcArrivalObservationInput): XpcArrivalObservation => {
	const compatibleXpis = xpis.kind === 'compatible' ? xpis : undefined;

	return {
		schemaVersion: 1,
		taxonomyVersion,
		type: 'xpcArrivalObserved',
		destinationProduct,
		...(destinationSubProduct ? { destinationSubProduct } : {}),
		...(destinationRouteFamily ? { destinationRouteFamily } : {}),
		arrivalMethod,
		...(compatibleXpis
			? {
					interactionSessionId: compatibleXpis.interactionSessionId,
					xpisVersion: compatibleXpis.version,
				}
			: {}),
	};
};

export class XpcNavigationObservation {
	static createArrival: (input: XpcArrivalObservationInput) => XpcArrivalObservation =
		createXpcArrivalObservation;
	static createDeparture: (input: XpcDepartureObservationInput) => XpcDepartureObservation =
		createXpcDepartureObservation;
	static createSurface: (value: string) => XpcSurface = createXpcSurface;
	static inspectXpis: (input: XpcInspectXpisInput) => XpisInspection = inspectXpis;
	static parseCompatibleXpis: (encodedValue: string) => CompatibleXpis | null = parseCompatibleXpis;
	static readonly noopReporter: XpcNavigationReporter = {
		reportDeparture: () => {},
	};
}
