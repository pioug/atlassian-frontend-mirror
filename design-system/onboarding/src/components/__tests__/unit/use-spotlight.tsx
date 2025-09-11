import React from 'react';

import { renderHook } from '@testing-library/react-hooks';

import { SpotlightContext } from '../../spotlight-manager';
import useSpotlight from '../../use-spotlight';

describe('#useSpotlight', () => {
	const setup = () => {
		const contextValue: {
			opened: () => void;
			closed: () => void;
			targets: {
				[key: string]: HTMLElement | undefined;
			};
		} = {
			opened: jest.fn(),
			closed: jest.fn(),
			targets: {
				'target-1': document.createElement('div'),
				'target-2': undefined,
			},
		};

		let testWrapper = ({ children }: { children?: React.ReactNode }) => (
			<SpotlightContext.Provider value={contextValue}>{children}</SpotlightContext.Provider>
		);

		const wrapper = (props: {}) => testWrapper(props);
		const utils = renderHook(() => useSpotlight(), { wrapper });

		const rerender = (value = contextValue) => {
			testWrapper = ({ children }) => (
				<SpotlightContext.Provider value={value}>{children}</SpotlightContext.Provider>
			);

			utils.rerender();
		};

		return {
			result: utils.result,
			rerender,
		};
	};

	it('should check whether target is rendered or not', () => {
		const { result } = setup();

		const {
			current: { isTargetRendered },
		} = result;

		expect(isTargetRendered('target-1')).toBe(true);
		expect(isTargetRendered('target-2')).toBe(false);
	});

	it('should return rerender with same reference even if #targets context value changes', () => {
		const { result, rerender } = setup();
		const { current: previousResult } = result;

		rerender({
			opened: jest.fn(),
			closed: jest.fn(),
			targets: {
				'target-1': document.createElement('div'),
				'target-2': document.createElement('span'),
			},
		});

		const { current: newResult } = result;

		expect(newResult.isTargetRendered('target-2')).toBe(true);
		expect(previousResult).toBe(newResult);
	});

	it('should return the correct isTargetVisible and isTargetRendered values for a hidden but rendered element', () => {
		const hiddenElement = document.createElement('div');
		hiddenElement.style.display = 'none';

		// Mock checkVisibility to return false since it isn't yet implemented in jsdom
		hiddenElement.checkVisibility = jest.fn().mockReturnValue(false);

		const contextValue = {
			opened: jest.fn(),
			closed: jest.fn(),
			targets: {
				'hidden-target': hiddenElement,
			},
		};

		const testWrapper = ({ children }: { children?: React.ReactNode }) => (
			<SpotlightContext.Provider value={contextValue}>{children}</SpotlightContext.Provider>
		);

		const wrapper = (props: {}) => testWrapper(props);
		const { result } = renderHook(() => useSpotlight(), { wrapper });

		const {
			current: { isTargetRendered, checkVisibility },
		} = result;

		expect(isTargetRendered('hidden-target')).toBe(true);
		expect(checkVisibility('hidden-target')()).toBe(false);
	});

	// There was a bug where checkVisibility() would error due to missing `this` context
	it('should not error when calling checkVisibility', () => {
		const element = document.createElement('div');

		// Mock checkVisibility since it isn't implemented in jsdom. Make sure it throws if the value of `this` is lost.
		const mockCheckVisibility = jest.fn(function (_options?: CheckVisibilityOptions) {
			if (this !== element) {
				throw new Error('Illegal invocation');
			}
			return false;
		});

		// `this` in the mock function should now refer to `element`:
		element.checkVisibility = mockCheckVisibility;

		const contextValue = {
			opened: jest.fn(),
			closed: jest.fn(),
			targets: {
				'test-target': element,
			},
		};

		const testWrapper = ({ children }: { children?: React.ReactNode }) => (
			<SpotlightContext.Provider value={contextValue}>{children}</SpotlightContext.Provider>
		);

		const wrapper = (props: {}) => testWrapper(props);
		const { result } = renderHook(() => useSpotlight(), { wrapper });

		const {
			current: { checkVisibility },
		} = result;

		expect(() => checkVisibility('test-target')()).not.toThrow();
		expect(checkVisibility('test-target')()).toBe(false);
		expect(mockCheckVisibility).toHaveBeenCalledWith(undefined);
	});

	it('should return false when calling checkVisibility on non-existent targets', () => {
		const contextValue = {
			opened: jest.fn(),
			closed: jest.fn(),
			targets: {},
		};

		const testWrapper = ({ children }: { children?: React.ReactNode }) => (
			<SpotlightContext.Provider value={contextValue}>{children}</SpotlightContext.Provider>
		);

		const wrapper = (props: {}) => testWrapper(props);
		const { result } = renderHook(() => useSpotlight(), { wrapper });

		const {
			current: { checkVisibility },
		} = result;

		expect(checkVisibility('non-existent-target')()).toBe(false);
	});
});
