import React from 'react';

import { render } from '@atlassian/testing-library/testing-library/react';

import { SpotlightContext, type SpotlightContextType } from '../../controllers/context';
import { UNSAFE_UpdateOnChange } from './index';

const mockMutationObserver = jest.fn();

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
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
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('does not observe mutations or call update', () => {
		renderWithContext({ selectors: ['body'] });

		expect(mockMutationObserver).not.toHaveBeenCalled();
		expect(mockUpdate).not.toHaveBeenCalled();
	});
});
