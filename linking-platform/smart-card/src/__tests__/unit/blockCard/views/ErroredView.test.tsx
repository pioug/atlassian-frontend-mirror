import React from 'react';

import { fireEvent, screen } from '@testing-library/react';

import { renderWithIntl } from '@atlaskit/media-test-helpers/renderWithIntl';

import { BlockCardErroredView } from '../../../../view/BlockCard';

let mockOnClick: React.MouseEventHandler = jest.fn();

describe('Block card views - Errored', () => {
	beforeEach(() => {
		mockOnClick = jest.fn().mockImplementation((event: React.MouseEvent) => {
			expect(event.isPropagationStopped()).toBe(true);
			expect(event.isDefaultPrevented()).toBe(true);
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('renders view without try again if no retry handler present', () => {
		renderWithIntl(<BlockCardErroredView testId="errored-view" />);
		const frame = screen.getByTestId('errored-view');
		expect(frame.textContent).toBe("We couldn't load this link for an unknown reason.");
		const icon = screen.getByTestId('errored-view-warning-icon');
		expect(icon.getAttribute('aria-label')).toBe('errored-warning-icon');
	});

	it('renders view - clicking on retry enacts callback', () => {
		const onRetryMock = jest.fn();
		renderWithIntl(<BlockCardErroredView testId="errored-view" onRetry={onRetryMock} />);
		const frame = screen.getByTestId('errored-view');
		expect(frame.textContent).toBe("We couldn't load this link for an unknown reason.Try again");

		// Check the button is there
		const button = screen.getByTestId('button-try-again');
		expect(button.textContent).toBe('Try again');

		// Click it, check mock is called
		fireEvent.click(button);
		expect(onRetryMock).toHaveBeenCalled();
		expect(onRetryMock).toHaveBeenCalledTimes(1);
	});

	it('clicking on link should have no side-effects', () => {
		renderWithIntl(<BlockCardErroredView testId="errored-view" onClick={mockOnClick} />);
		const view = screen.getByTestId('errored-view');
		const link = view.querySelector('a');

		expect(link).toBeTruthy();
		fireEvent.click(link!);
		expect(mockOnClick).toHaveBeenCalledTimes(1);
	});
});
