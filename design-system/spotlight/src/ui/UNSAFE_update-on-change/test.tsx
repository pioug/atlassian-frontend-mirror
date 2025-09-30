import React from 'react';

import { render } from '@testing-library/react';

import { SpotlightContext, type SpotlightContextType } from '../../controllers/context';

import { UNSAFE_UpdateOnChange } from './index';

// Mock browser APIs
const mockObserver = {
	observe: jest.fn(),
	disconnect: jest.fn(),
	callback: jest.fn(),
};

const mockMutationObserver = jest.fn().mockImplementation((callback) => {
	mockObserver.callback = callback;
	return mockObserver;
});

// Mock getDocument
jest.mock('@atlaskit/browser-apis', () => ({
	getDocument: jest.fn(),
}));

const { getDocument } = require('@atlaskit/browser-apis');

describe('UNSAFE_UpdateOnChange', () => {
	const mockUpdate = jest.fn();
	const mockPopoverContent = {
		update: mockUpdate,
	};

	const mockContextValue = {
		popoverContent: mockPopoverContent,
	} as unknown as SpotlightContextType;

	const renderWithContext = (props = {}) => {
		return render(
			<SpotlightContext.Provider value={mockContextValue}>
				{/* eslint-disable-next-line react/jsx-pascal-case */}
				<UNSAFE_UpdateOnChange {...props} />
			</SpotlightContext.Provider>,
		);
	};

	beforeEach(() => {
		jest.clearAllMocks();
		global.MutationObserver = mockMutationObserver;

		// Mock document with querySelector
		const mockDocument = {
			querySelector: jest.fn(),
		};
		getDocument.mockReturnValue(mockDocument);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('should not call update when no selectors are updated', () => {
		const mockElement = document.createElement('div');
		const mockDocument = {
			querySelector: jest.fn().mockReturnValue(mockElement),
		};
		getDocument.mockReturnValue(mockDocument);

		renderWithContext({ selectors: ['body'] });

		// Verify observer was set up
		expect(mockMutationObserver).toHaveBeenCalled();
		expect(mockObserver.observe).toHaveBeenCalledWith(mockElement, {
			childList: true,
			subtree: true,
		});

		// Simulate no mutations
		const callback = mockMutationObserver.mock.calls[0][0];
		callback([]);

		// Update should not be called when there are no mutations
		expect(mockUpdate).not.toHaveBeenCalled();
	});

	it('should call update when a specified selector changes', () => {
		const mockElement = document.createElement('div');
		const mockDocument = {
			querySelector: jest.fn().mockReturnValue(mockElement),
		};
		getDocument.mockReturnValue(mockDocument);

		renderWithContext({ selectors: ['#test-element'] });

		// Verify observer was set up
		expect(mockMutationObserver).toHaveBeenCalled();
		expect(mockObserver.observe).toHaveBeenCalledWith(mockElement, {
			childList: true,
			subtree: true,
		});

		// Simulate a mutation
		const callback = mockMutationObserver.mock.calls[0][0];
		callback([{ type: 'childList', target: mockElement }]);

		// Update should be called once
		expect(mockUpdate).toHaveBeenCalledTimes(1);
	});

	it('should call update N times when N selectors change', () => {
		const mockElement1 = document.createElement('div');
		const mockElement2 = document.createElement('span');
		const mockElement3 = document.createElement('p');

		const mockDocument = {
			querySelector: jest
				.fn()
				.mockReturnValueOnce(mockElement1)
				.mockReturnValueOnce(mockElement2)
				.mockReturnValueOnce(mockElement3),
		};
		getDocument.mockReturnValue(mockDocument);

		renderWithContext({ selectors: ['#element1', '#element2', '#element3'] });

		// Verify 3 observers were set up (one for each selector)
		expect(mockMutationObserver).toHaveBeenCalledTimes(3);
		expect(mockObserver.observe).toHaveBeenCalledTimes(3);

		// Get all the callbacks
		const callback1 = mockMutationObserver.mock.calls[0][0];
		const callback2 = mockMutationObserver.mock.calls[1][0];
		const callback3 = mockMutationObserver.mock.calls[2][0];

		// Simulate mutations on all 3 elements
		callback1([{ type: 'childList', target: mockElement1 }]);
		callback2([{ type: 'childList', target: mockElement2 }]);
		callback3([{ type: 'childList', target: mockElement3 }]);

		// Update should be called 3 times (once for each mutation)
		expect(mockUpdate).toHaveBeenCalledTimes(3);
	});

	it('should not set up observers when selectors array is empty', () => {
		renderWithContext({ selectors: [] });

		// No observers should be created
		expect(mockMutationObserver).not.toHaveBeenCalled();
		expect(mockUpdate).not.toHaveBeenCalled();
	});

	it('should not set up observers when update function is not available', () => {
		const contextWithoutUpdate = {
			popoverContent: {},
		} as SpotlightContextType;

		render(
			<SpotlightContext.Provider value={contextWithoutUpdate}>
				{/* eslint-disable-next-line react/jsx-pascal-case */}
				<UNSAFE_UpdateOnChange selectors={['body']} />
			</SpotlightContext.Provider>,
		);

		// No observers should be created
		expect(mockMutationObserver).not.toHaveBeenCalled();
	});

	it('should not set up observers when document is not available', () => {
		getDocument.mockReturnValue(null);

		renderWithContext({ selectors: ['body'] });

		// No observers should be created
		expect(mockMutationObserver).not.toHaveBeenCalled();
		expect(mockUpdate).not.toHaveBeenCalled();
	});

	it('should not set up observers when elements are not found', () => {
		const mockDocument = {
			querySelector: jest.fn().mockReturnValue(null),
		};
		getDocument.mockReturnValue(mockDocument);

		renderWithContext({ selectors: ['#non-existent'] });

		// No observers should be created
		expect(mockMutationObserver).not.toHaveBeenCalled();
		expect(mockUpdate).not.toHaveBeenCalled();
	});

	it('should disconnect observers on cleanup', () => {
		const mockElement = document.createElement('div');
		const mockDocument = {
			querySelector: jest.fn().mockReturnValue(mockElement),
		};
		getDocument.mockReturnValue(mockDocument);

		const { unmount } = renderWithContext({ selectors: ['body'] });

		// Verify observer was set up
		expect(mockObserver.observe).toHaveBeenCalled();

		// Unmount component to trigger cleanup
		unmount();

		// Verify observer was disconnected
		expect(mockObserver.disconnect).toHaveBeenCalled();
	});
});
