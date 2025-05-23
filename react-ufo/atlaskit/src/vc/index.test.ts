import { fg } from '@atlaskit/platform-feature-flags';

import * as configModule from '../config';

import { VCObserver } from './vc-observer';
import VCObserverNew from './vc-observer-new';

import { VCObserverWrapper } from './index';

// Mock dependencies
jest.mock('./vc-observer');
jest.mock('./vc-observer-new');
jest.mock('../config');
jest.mock('@atlaskit/platform-feature-flags');

describe('VCObserverWrapper', () => {
	let originalSsrAbortListeners: any;

	beforeEach(() => {
		jest.clearAllMocks();

		// Mock feature flags
		(fg as jest.Mock).mockImplementation((flag: string) => {
			// Default all flags to false except as specified in individual tests
			return false;
		});

		// Save and clear window.__SSR_ABORT_LISTENERS__ if it exists
		originalSsrAbortListeners = window.__SSR_ABORT_LISTENERS__;
		delete window.__SSR_ABORT_LISTENERS__;

		// Mock isVCRevisionEnabled to return true for all revisions
		(configModule.isVCRevisionEnabled as jest.Mock).mockImplementation(() => true);
	});

	afterEach(() => {
		// Restore window.__SSR_ABORT_LISTENERS__
		if (originalSsrAbortListeners !== undefined) {
			window.__SSR_ABORT_LISTENERS__ = originalSsrAbortListeners;
		} else {
			delete window.__SSR_ABORT_LISTENERS__;
		}
	});

	it('should process and remove SSR abort listeners after starting observers', () => {
		// Setup
		const mockUnbind = jest.fn();
		window.__SSR_ABORT_LISTENERS__ = {
			unbinds: [mockUnbind],
			aborts: {
				wheel: 50,
				keydown: 75,
			},
		};

		// Create VCObserverWrapper and start observers
		const wrapper = new VCObserverWrapper();
		wrapper.start({ startTime: 100, experienceKey: 'test' });

		// Verify that VCObserver.start and VCObserverNew.start were called
		expect(VCObserver.prototype.start).toHaveBeenCalled();
		expect(VCObserverNew.prototype.start).toHaveBeenCalled();

		// Verify that the unbind function was called
		expect(mockUnbind).toHaveBeenCalled();

		// Verify that window.__SSR_ABORT_LISTENERS__ was removed
		expect(window.__SSR_ABORT_LISTENERS__).toBeUndefined();
	});

	it('should work correctly when window.__SSR_ABORT_LISTENERS__ does not exist', () => {
		// Create VCObserverWrapper and start observers
		const wrapper = new VCObserverWrapper();
		wrapper.start({ startTime: 100, experienceKey: 'test' });

		// Verify that VCObserver.start and VCObserverNew.start were called
		expect(VCObserver.prototype.start).toHaveBeenCalled();
		expect(VCObserverNew.prototype.start).toHaveBeenCalled();

		// No exceptions should be thrown
	});

	it('should process SSR abort listeners even if some observers are disabled', () => {
		// Setup
		const mockUnbind = jest.fn();
		window.__SSR_ABORT_LISTENERS__ = {
			unbinds: [mockUnbind],
			aborts: {
				wheel: 50,
			},
		};

		// Mock isVCRevisionEnabled to disable fy25.03 (VCObserverNew)
		(configModule.isVCRevisionEnabled as jest.Mock).mockImplementation((revision) => {
			return revision !== 'fy25.03';
		});

		// Create VCObserverWrapper and start observers
		const wrapper = new VCObserverWrapper();
		wrapper.start({ startTime: 100, experienceKey: 'test' });

		// Verify that only VCObserver.start was called
		expect(VCObserver.prototype.start).toHaveBeenCalled();
		expect(VCObserverNew.prototype.start).not.toHaveBeenCalled();

		// Verify that the unbind function was still called
		expect(mockUnbind).toHaveBeenCalled();

		// Verify that window.__SSR_ABORT_LISTENERS__ was removed
		expect(window.__SSR_ABORT_LISTENERS__).toBeUndefined();
	});

	it('should work when VCObserverNew is enabled but SSR feature flag is disabled', () => {
		// Setup
		const mockUnbind = jest.fn();
		window.__SSR_ABORT_LISTENERS__ = {
			unbinds: [mockUnbind],
			aborts: {
				wheel: 50,
			},
		};

		// Enable VCObserverNew by enabling fy25.03
		(configModule.isVCRevisionEnabled as jest.Mock).mockImplementation(() => true);

		// Disable the SSR feature flag for VCObserverNew
		(fg as jest.Mock).mockImplementation((flag: string) => {
			if (flag === 'platform_ufo_vc_observer_new_ssr_abort_listener') {
				return false;
			}
			return false;
		});

		// Create VCObserverWrapper and start observers
		const wrapper = new VCObserverWrapper();
		wrapper.start({ startTime: 100, experienceKey: 'test' });

		// Verify that both observers are started
		expect(VCObserver.prototype.start).toHaveBeenCalled();
		expect(VCObserverNew.prototype.start).toHaveBeenCalled();

		// Verify that the unbind function was still called by the wrapper
		expect(mockUnbind).toHaveBeenCalled();

		// Verify that window.__SSR_ABORT_LISTENERS__ was removed
		expect(window.__SSR_ABORT_LISTENERS__).toBeUndefined();
	});
});
