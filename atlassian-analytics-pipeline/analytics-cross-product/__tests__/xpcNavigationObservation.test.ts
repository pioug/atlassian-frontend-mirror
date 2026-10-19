import {
	type XpcDestinationResolution,
	XpcDestinationResolver,
} from '../src/xpcDestinationResolver';
import { XpcNavigationObservation } from '../src/xpcNavigationObservation';

const studio = XpcDestinationResolver.createProductId('studio');
const confluence = XpcDestinationResolver.createProductId('confluence');
const destination: XpcDestinationResolution = {
	outcome: 'cross',
	destinationProduct: confluence,
	routeFamily: XpcDestinationResolver.createRouteFamily('content-page'),
	classificationMethod: 'sharedUrlClassifier',
	confidence: 'exact',
	reason: 'differentKnownProduct',
	matcherId: XpcDestinationResolver.createMatcherId('confluence-content'),
	taxonomyVersion: 1,
};

describe('inspectXpis', () => {
	it('reports absence without exposing other URL data', () => {
		expect(
			XpcNavigationObservation.inspectXpis({
				baseUrl: 'https://studio.atlassian.com',
				url: 'https://acme.atlassian.net/wiki/example?customerData=secret#private',
			}),
		).toEqual({ kind: 'absent' });
	});

	it('reports opaque and duplicate XPIS values as present without parsing them', () => {
		expect(
			XpcNavigationObservation.inspectXpis({
				baseUrl: 'https://studio.atlassian.com',
				url: 'https://acme.atlassian.net/wiki/example?xpis=opaque',
			}),
		).toEqual({ kind: 'present', occurrenceCount: 1 });
		expect(
			XpcNavigationObservation.inspectXpis({
				baseUrl: 'https://studio.atlassian.com',
				url: 'https://acme.atlassian.net/wiki/example?xpis=one&xpis=two',
			}),
		).toEqual({ kind: 'present', occurrenceCount: 2 });
	});

	it('exposes an interaction ID only through an approved compatibility parser', () => {
		expect(
			XpcNavigationObservation.inspectXpis({
				baseUrl: 'https://studio.atlassian.com',
				url: 'https://acme.atlassian.net/wiki/example?xpis=approved',
				parseCompatibleValue: (value) =>
					value === 'approved' ? { interactionSessionId: 'session-1', version: 1 } : null,
			}),
		).toEqual({
			kind: 'compatible',
			occurrenceCount: 1,
			interactionSessionId: 'session-1',
			version: 1,
		});
	});

	it('parses the existing version-one XPIS envelope without trusting bridge metadata', () => {
		const encodedValue = btoa(
			JSON.stringify({
				bridge: 'untrusted-bridge-value',
				id: 'session-1',
				source: 'studio',
			}),
		);

		expect(XpcNavigationObservation.parseCompatibleXpis(encodedValue)).toEqual({
			interactionSessionId: 'session-1',
			version: 1,
		});
		expect(
			XpcNavigationObservation.parseCompatibleXpis(
				btoa(JSON.stringify({ id: 'session-2', version: 2 })),
			),
		).toBeNull();
		expect(
			XpcNavigationObservation.parseCompatibleXpis(
				btoa(JSON.stringify({ bridge: 'rovo-chat.sidebar', id: 'session-2' })),
			),
		).toBeNull();
		expect(
			XpcNavigationObservation.parseCompatibleXpis(
				btoa(JSON.stringify({ id: 'session-2', source: 'studio' })),
			),
		).toBeNull();
		expect(
			XpcNavigationObservation.parseCompatibleXpis(
				btoa(JSON.stringify({ bridge: 'invalid bridge', id: 'session-2', source: 'studio' })),
			),
		).toBeNull();
	});
});

describe('createXpcDepartureObservation', () => {
	it('creates a fresh observed-only payload containing controlled fields', () => {
		const destinationWithUntrustedData = {
			...destination,
			rawUrl: 'https://acme.atlassian.net/wiki/example?secret=value',
		} as XpcDestinationResolution;
		const observation = XpcNavigationObservation.createDeparture({
			captureMethod: 'nativeDocument',
			destination: destinationWithUntrustedData,
			handoffOutcome: 'accepted',
			navigationMechanism: 'nativeAnchor',
			source: { product: studio },
			surface: XpcNavigationObservation.createSurface('studio-root'),
			xpis: { kind: 'absent' },
		});

		expect(observation).toEqual({
			schemaVersion: 1,
			taxonomyVersion: 1,
			type: 'xpcDepartureObserved',
			sourceProduct: studio,
			destination,
			handoffOutcome: 'accepted',
			surface: XpcNavigationObservation.createSurface('studio-root'),
			captureMethod: 'nativeDocument',
			navigationMechanism: 'nativeAnchor',
			instrumentationClass: 'observedOnly',
		});
		expect(JSON.stringify(observation)).not.toContain('url');
		expect(JSON.stringify(observation)).not.toContain('secret');
	});

	it('does not expose an opaque XPIS value or claim who supplied it', () => {
		const observation = XpcNavigationObservation.createDeparture({
			captureMethod: 'rendererFinalSink',
			destination,
			handoffOutcome: 'unknown',
			navigationMechanism: 'rendererCallback',
			source: { product: studio },
			surface: XpcNavigationObservation.createSurface('studio-rovo'),
			xpis: { kind: 'present', occurrenceCount: 1 },
		});

		expect(observation.instrumentationClass).toBe('xpisPresent');
		expect(observation).not.toHaveProperty('interactionSessionId');
	});

	it('rejects an unbounded surface value', () => {
		expect(() => XpcNavigationObservation.createSurface('Studio root / arbitrary value')).toThrow(
			'Invalid controlled XPC surface value',
		);
	});
});

describe('createXpcArrivalObservation', () => {
	it('creates compatible destination evidence without retaining a URL', () => {
		const observation = XpcNavigationObservation.createArrival({
			arrivalMethod: 'frontendInitialLoad',
			destinationProduct: confluence,
			destinationRouteFamily: XpcDestinationResolver.createRouteFamily('content-page'),
			taxonomyVersion: 1,
			xpis: {
				kind: 'compatible',
				occurrenceCount: 1,
				interactionSessionId: 'session-1',
				version: 1,
			},
		});

		expect(observation).toEqual({
			schemaVersion: 1,
			taxonomyVersion: 1,
			type: 'xpcArrivalObserved',
			destinationProduct: confluence,
			destinationRouteFamily: 'content-page',
			arrivalMethod: 'frontendInitialLoad',
			interactionSessionId: 'session-1',
			xpisVersion: 1,
		});
		expect(JSON.stringify(observation)).not.toContain('url');
	});

	it('retains opaque XPIS only as arrival presence', () => {
		expect(
			XpcNavigationObservation.createArrival({
				arrivalMethod: 'frontendSpaRoute',
				destinationProduct: confluence,
				taxonomyVersion: 1,
				xpis: { kind: 'present', occurrenceCount: 1 },
			}),
		).toEqual({
			schemaVersion: 1,
			taxonomyVersion: 1,
			type: 'xpcArrivalObserved',
			destinationProduct: confluence,
			arrivalMethod: 'frontendSpaRoute',
		});
	});
});
