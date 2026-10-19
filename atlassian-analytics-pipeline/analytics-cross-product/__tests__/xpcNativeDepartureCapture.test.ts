import {
	type XpcDestinationResolution,
	XpcDestinationResolver,
} from '../src/xpcDestinationResolver';
import { XpcNativeDepartureCapture } from '../src/xpcNativeDepartureCapture';
import {
	type XpcDepartureObservation,
	XpcNavigationObservation,
} from '../src/xpcNavigationObservation';

const studio = XpcDestinationResolver.createProductId('studio');
const confluence = XpcDestinationResolver.createProductId('confluence');
const destination: XpcDestinationResolution = {
	classificationMethod: 'sharedUrlClassifier',
	confidence: 'exact',
	destinationProduct: confluence,
	matcherId: XpcDestinationResolver.createMatcherId('confluence-content'),
	outcome: 'cross',
	reason: 'differentKnownProduct',
	routeFamily: XpcDestinationResolver.createRouteFamily('content-page'),
	taxonomyVersion: 1,
};

const createCapture = ({ isEnabled }: { isEnabled?: () => boolean } = {}) => {
	const callbacks: Array<() => void> = [];
	const observations: XpcDepartureObservation[] = [];
	const capture = new XpcNativeDepartureCapture({
		baseUrl: 'https://studio.atlassian.com',
		isEnabled,
		reporter: {
			reportDeparture: (observation) => observations.push(observation),
		},
		resolveDestination: () => destination,
		root: document,
		scheduleAfterDispatch: (callback) => {
			callbacks.push(callback);
			return () => {};
		},
		source: { product: studio },
		surface: XpcNavigationObservation.createSurface('studio-root'),
	});

	return { callbacks, capture, observations };
};

describe('XpcNativeDepartureCapture', () => {
	afterEach(() => {
		document.body.replaceChildren();
	});

	it('reports one accepted native departure after event dispatch', () => {
		const { callbacks, capture, observations } = createCapture();
		const anchor = document.createElement('a');
		anchor.href = '#destination';
		anchor.textContent = 'Destination';
		document.body.append(anchor);
		capture.start();

		anchor.dispatchEvent(new MouseEvent('click', { bubbles: true, button: 0, cancelable: true }));
		expect(observations).toHaveLength(0);
		callbacks.forEach((callback) => callback());

		expect(observations).toHaveLength(1);
		expect(observations[0]).toMatchObject({
			captureMethod: 'nativeDocument',
			handoffOutcome: 'accepted',
			instrumentationClass: 'observedOnly',
			navigationMechanism: 'nativeAnchor',
		});
		capture.stop();
	});

	it('does not report a prevented native activation', () => {
		const { callbacks, capture, observations } = createCapture();
		const anchor = document.createElement('a');
		anchor.href = '#destination';
		anchor.textContent = 'Destination';
		anchor.addEventListener('click', (event) => event.preventDefault());
		document.body.append(anchor);
		capture.start();

		anchor.dispatchEvent(new MouseEvent('click', { bubbles: true, button: 0, cancelable: true }));
		callbacks.forEach((callback) => callback());

		expect(observations).toHaveLength(0);
		capture.stop();
	});

	it('does not install capture when its product adapter is disabled', () => {
		const { callbacks, capture, observations } = createCapture({
			isEnabled: () => false,
		});
		const anchor = document.createElement('a');
		anchor.href = '#destination';
		anchor.textContent = 'Destination';
		document.body.append(anchor);

		capture.start();
		anchor.dispatchEvent(
			new MouseEvent('auxclick', { bubbles: true, button: 1, cancelable: true }),
		);
		callbacks.forEach((callback) => callback());

		expect(observations).toHaveLength(0);
	});

	it('drops a pending activation when its product adapter is disabled', () => {
		let isEnabled = true;
		const { callbacks, capture, observations } = createCapture({
			isEnabled: () => isEnabled,
		});
		const anchor = document.createElement('a');
		anchor.href = '#destination';
		anchor.textContent = 'Destination';
		document.body.append(anchor);
		capture.start();

		anchor.dispatchEvent(
			new MouseEvent('auxclick', { bubbles: true, button: 1, cancelable: true }),
		);
		isEnabled = false;
		callbacks.forEach((callback) => callback());

		expect(observations).toHaveLength(0);
		capture.stop();
	});

	it('yields to an owned final sink that claims the activation', () => {
		const { callbacks, capture, observations } = createCapture();
		const anchor = document.createElement('a');
		anchor.href = '#destination';
		anchor.textContent = 'Destination';
		anchor.addEventListener('click', (event) => {
			event.preventDefault();
			const token = capture.coordinator.claimNativeCandidate(event);
			if (token) {
				capture.coordinator.completeOnce(token, () => {});
			}
		});
		document.body.append(anchor);
		capture.start();

		anchor.dispatchEvent(new MouseEvent('click', { bubbles: true, button: 0, cancelable: true }));
		callbacks.forEach((callback) => callback());

		expect(observations).toHaveLength(0);
		capture.stop();
	});
});
