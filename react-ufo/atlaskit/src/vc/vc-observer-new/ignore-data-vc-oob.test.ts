import { expVal } from '../expVal';

import ViewportObserver from './viewport-observer';

jest.mock('../expVal');

const originalResizeObserver = window.ResizeObserver;
const mockMutationObserver = jest.fn((callback) => {
	return {
		observe: jest.fn(),
		disconnect: jest.fn(),
		// Store the callback to manually trigger it later
		trigger: (mutations: any[]) => callback(mutations),
	};
});
Object.defineProperty(global, 'MutationObserver', {
	writable: true,
	value: mockMutationObserver,
});

describe('VCObserverNew', () => {
	let vcObserver: ViewportObserver;
	beforeEach(() => {
		jest.clearAllMocks();
		vcObserver = new ViewportObserver({
			onChange: () => {},
			getSSRState: () => {
				return 'hydrated';
			},
		});
		vcObserver.start();
		// @ts-ignore
		vcObserver.intersectionObserver.watchAndTag = jest.fn();
		// Enable feature flag to exclude flags from VC calculations
		(expVal as jest.Mock).mockImplementation((gate: string) => {
			if (gate === 'cc_editor_vc_exclude_flags') {
				return true;
			}
			return false;
		});
	});

	afterAll(() => {
		window.ResizeObserver = originalResizeObserver;
	});
	it('should skip viewport changes for data-vc-oob elements and not add entries to timeline', () => {
		const mockTargetElement = document.createElement('div');
		mockTargetElement.setAttribute('data-vc-oob', 'true');
		// Create a mock mutation record for an element with data-vc-oob attribute
		const mockMutationRecord = {
			target: mockTargetElement,
			type: 'childList',
			addedNodes: [document.createElement('span')],
			removedNodes: [],
		} as unknown as MutationRecord;
		// Call the onChange callback with the mock mutation record

		// @ts-ignore
		vcObserver.mutationObserver.trigger([mockMutationRecord]);

		// Assert that no entries were added to the timeline
		// @ts-ignore
		expect(vcObserver.intersectionObserver?.watchAndTag).not.toHaveBeenCalled();
	});
	it('should not skip viewport changes for data-vc-oob elements and not add entries to timeline', () => {
		const mockTargetElement = document.createElement('div');

		// Create a mock mutation record for an element with data-vc-oob attribute
		const mockMutationRecord = {
			target: mockTargetElement,
			type: 'childList',
			addedNodes: [document.createElement('span')],
			removedNodes: [],
		} as unknown as MutationRecord;
		// Call the onChange callback with the mock mutation record

		// @ts-ignore
		vcObserver.mutationObserver.trigger([mockMutationRecord]);

		// Assert that no entries were added to the timeline
		// @ts-ignore
		expect(vcObserver.intersectionObserver?.watchAndTag).toHaveBeenCalled();
	});
});
