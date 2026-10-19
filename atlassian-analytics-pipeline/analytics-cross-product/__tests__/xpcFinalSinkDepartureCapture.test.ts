import { XpcActivationCoordinator } from '../src/xpcActivationCoordinator';
import { XpcDestinationResolver } from '../src/xpcDestinationResolver';
import { XpcFinalSinkDepartureCapture } from '../src/xpcFinalSinkDepartureCapture';
import { reportXpcFinalSinkHandoffSafely } from '../src/xpcHandoffSafety';
import {
	type XpcDepartureObservation,
	XpcNavigationObservation,
} from '../src/xpcNavigationObservation';

describe('XpcFinalSinkDepartureCapture', () => {
	it('keeps navigation fail-open when an observer throws', () => {
		expect(() =>
			reportXpcFinalSinkHandoffSafely(
				() => {
					throw new Error('observation failure');
				},
				{
					handoffOutcome: 'accepted',
					url: 'https://example.atlassian.net/browse/TEST-1',
				},
			),
		).not.toThrow();
	});

	it('claims the native candidate and reports the authoritative renderer handoff once', () => {
		const coordinator = new XpcActivationCoordinator();
		const event = new MouseEvent('click');
		const nativeToken = coordinator.beginNativeCandidate(event);
		const observations: XpcDepartureObservation[] = [];
		const capture = new XpcFinalSinkDepartureCapture({
			baseUrl: 'https://studio.atlassian.com',
			coordinator,
			reporter: {
				reportDeparture: (observation) => observations.push(observation),
			},
			resolveDestination: () => ({
				classificationMethod: 'sharedUrlClassifier',
				confidence: 'exact',
				destinationProduct: XpcDestinationResolver.createProductId('jira'),
				matcherId: XpcDestinationResolver.createMatcherId('jira-issue-route'),
				outcome: 'cross',
				reason: 'differentKnownProduct',
				taxonomyVersion: 1,
			}),
			source: { product: XpcDestinationResolver.createProductId('studio') },
			surface: XpcNavigationObservation.createSurface('studio-rovo'),
		});

		capture.observeRendererHandoff({
			event,
			handoffOutcome: 'accepted',
			url: 'https://example.atlassian.net/browse/TEST-1',
		});
		capture.observeRendererHandoff({
			event,
			handoffOutcome: 'accepted',
			url: 'https://example.atlassian.net/browse/TEST-1',
		});

		expect(observations).toHaveLength(1);
		expect(observations[0]).toMatchObject({
			captureMethod: 'rendererFinalSink',
			handoffOutcome: 'accepted',
			navigationMechanism: 'rendererCallback',
		});
		expect(coordinator.isNativeFallbackPending(nativeToken)).toBe(false);
	});

	it('reports imperative and router handoffs with controlled enums', () => {
		const observations: XpcDepartureObservation[] = [];
		const capture = new XpcFinalSinkDepartureCapture({
			baseUrl: 'https://studio.atlassian.com',
			coordinator: new XpcActivationCoordinator(),
			reporter: {
				reportDeparture: (observation) => observations.push(observation),
			},
			resolveDestination: () => ({
				classificationMethod: 'sharedUrlClassifier',
				confidence: 'exact',
				destinationProduct: XpcDestinationResolver.createProductId('jira'),
				matcherId: XpcDestinationResolver.createMatcherId('jira-issue-route'),
				outcome: 'cross',
				reason: 'differentKnownProduct',
				taxonomyVersion: 1,
			}),
			source: { product: XpcDestinationResolver.createProductId('studio') },
			surface: XpcNavigationObservation.createSurface('studio-imperative'),
		});

		capture.observeImperativeHandoff({
			handoffOutcome: 'unknown',
			url: 'https://example.atlassian.net/browse/TEST-1',
		});
		capture.observeRouterHandoff({
			handoffOutcome: 'accepted',
			url: 'https://example.atlassian.net/browse/TEST-2',
		});

		expect(observations).toEqual([
			expect.objectContaining({
				captureMethod: 'imperativeFinalSink',
				handoffOutcome: 'unknown',
				navigationMechanism: 'imperativeApi',
			}),
			expect.objectContaining({
				captureMethod: 'routerFinalSink',
				handoffOutcome: 'accepted',
				navigationMechanism: 'routerExternal',
			}),
		]);
	});
});
