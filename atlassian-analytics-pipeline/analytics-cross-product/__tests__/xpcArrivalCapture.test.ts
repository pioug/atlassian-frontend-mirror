import { captureXpcArrival } from '../src/xpcArrivalCapture';
import { XpcDestinationResolver } from '../src/xpcDestinationResolver';
import type { XpcNavigationReporter } from '../src/xpcNavigationObservation';

const destinationProduct = XpcDestinationResolver.createProductId('studio');

describe('captureXpcArrival', () => {
	it('reports compatible initial-load evidence without forwarding the URL', () => {
		const reportArrival = jest.fn();
		const reporter: XpcNavigationReporter = {
			reportArrival,
			reportDeparture: jest.fn(),
		};

		captureXpcArrival({
			arrivalMethod: 'frontendInitialLoad',
			baseUrl: 'https://studio.atlassian.com',
			destinationProduct,
			parseCompatibleXpis: () => ({ interactionSessionId: 'session-1', version: 1 }),
			reporter,
			taxonomyVersion: 1,
			url: 'https://studio.atlassian.com/?xpis=compatible&secret=customer-data',
		});

		expect(reportArrival).toHaveBeenCalledWith({
			schemaVersion: 1,
			taxonomyVersion: 1,
			type: 'xpcArrivalObserved',
			destinationProduct,
			arrivalMethod: 'frontendInitialLoad',
			interactionSessionId: 'session-1',
			xpisVersion: 1,
		});
		expect(JSON.stringify(reportArrival.mock.calls)).not.toContain('customer-data');
	});

	it('does not report an arrival without XPIS or while disabled', () => {
		const reportArrival = jest.fn();
		const reporter: XpcNavigationReporter = {
			reportArrival,
			reportDeparture: jest.fn(),
		};
		const options = {
			arrivalMethod: 'frontendInitialLoad' as const,
			baseUrl: 'https://studio.atlassian.com',
			destinationProduct,
			reporter,
			taxonomyVersion: 1,
		};

		captureXpcArrival({
			...options,
			url: 'https://studio.atlassian.com/',
		});
		captureXpcArrival({
			...options,
			isEnabled: () => false,
			url: 'https://studio.atlassian.com/?xpis=opaque',
		});

		expect(reportArrival).not.toHaveBeenCalled();
	});

	it('fails open when inspection or reporting throws', () => {
		const reporter: XpcNavigationReporter = {
			reportArrival: () => {
				throw new Error('delivery failed');
			},
			reportDeparture: jest.fn(),
		};

		expect(() =>
			captureXpcArrival({
				arrivalMethod: 'frontendInitialLoad',
				baseUrl: 'https://studio.atlassian.com',
				destinationProduct,
				reporter,
				taxonomyVersion: 1,
				url: 'https://studio.atlassian.com/?xpis=opaque',
			}),
		).not.toThrow();
	});
});
