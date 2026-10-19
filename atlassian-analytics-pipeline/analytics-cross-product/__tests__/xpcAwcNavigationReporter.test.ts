import { createXpcAwcNavigationReporter } from '../src/xpcAwcNavigationReporter';
import { XpcDestinationResolver } from '../src/xpcDestinationResolver';
import { XpcNavigationObservation } from '../src/xpcNavigationObservation';

const createObservation = () =>
	XpcNavigationObservation.createDeparture({
		captureMethod: 'rendererFinalSink',
		destination: {
			classificationMethod: 'sharedUrlClassifier',
			confidence: 'exact',
			destinationProduct: XpcDestinationResolver.createProductId('confluence'),
			destinationSubProduct: XpcDestinationResolver.createSubProductId('content'),
			matcherId: XpcDestinationResolver.createMatcherId('confluence-wiki-route'),
			outcome: 'cross',
			reason: 'differentKnownProduct',
			routeFamily: XpcDestinationResolver.createRouteFamily('content-page'),
			taxonomyVersion: 1,
		},
		handoffOutcome: 'accepted',
		navigationMechanism: 'rendererCallback',
		source: {
			product: XpcDestinationResolver.createProductId('studio'),
			subProduct: XpcDestinationResolver.createSubProductId('agents'),
		},
		surface: XpcNavigationObservation.createSurface('studio-rovo'),
		xpis: {
			interactionSessionId: 'private-session-id',
			kind: 'compatible',
			occurrenceCount: 1,
			version: 1,
		},
	});

describe('createXpcAwcNavigationReporter', () => {
	it('sends only controlled privacy-safe attributes', () => {
		const sendTrackEvent = jest.fn().mockResolvedValue(undefined);
		const reporter = createXpcAwcNavigationReporter({ sendTrackEvent });

		reporter.reportDeparture(createObservation());

		expect(sendTrackEvent).toHaveBeenCalledWith({
			action: 'departureObserved',
			actionSubject: 'xpcNavigation',
			attributes: expect.objectContaining({
				destinationOutcome: 'cross',
				destinationProduct: 'confluence',
				instrumentationClass: 'xpisPresent',
				sourceProduct: 'studio',
				xpisVersion: 1,
			}),
			source: 'studio',
		});
		expect(JSON.stringify(sendTrackEvent.mock.calls)).not.toContain('private-session-id');
	});

	it('reports arrival evidence without emitting the interaction-session ID', () => {
		const sendTrackEvent = jest.fn().mockResolvedValue(undefined);
		const reporter = createXpcAwcNavigationReporter({ sendTrackEvent });

		reporter.reportArrival?.(
			XpcNavigationObservation.createArrival({
				arrivalMethod: 'frontendInitialLoad',
				destinationProduct: XpcDestinationResolver.createProductId('studio'),
				taxonomyVersion: 1,
				xpis: {
					interactionSessionId: 'private-session-id',
					kind: 'compatible',
					occurrenceCount: 1,
					version: 1,
				},
			}),
		);

		expect(sendTrackEvent).toHaveBeenCalledWith({
			action: 'arrivalObserved',
			actionSubject: 'xpcNavigation',
			attributes: {
				arrivalMethod: 'frontendInitialLoad',
				destinationProduct: 'studio',
				schemaVersion: 1,
				taxonomyVersion: 1,
				xpisVersion: 1,
			},
			source: 'studio',
		});
		expect(JSON.stringify(sendTrackEvent.mock.calls)).not.toContain('private-session-id');
	});

	it('fails open for synchronous and asynchronous analytics failures', async () => {
		const synchronousFailure = {
			sendTrackEvent: jest.fn(() => {
				throw new Error('sync failure');
			}),
		};
		const asynchronousFailure = {
			sendTrackEvent: jest.fn().mockRejectedValue(new Error('async failure')),
		};

		expect(() =>
			createXpcAwcNavigationReporter(synchronousFailure).reportDeparture(createObservation()),
		).not.toThrow();
		createXpcAwcNavigationReporter(asynchronousFailure).reportDeparture(createObservation());
		await Promise.resolve();
	});
});
