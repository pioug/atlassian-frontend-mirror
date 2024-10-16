import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithIntl } from '@atlaskit/media-test-helpers/renderWithIntl';
import { BlockCardNotFoundView } from '../../../../view/BlockCard';
import { getResolvedProps } from '../../../__mocks__/get-resolved-props';
import { type ResolvedViewProps } from '../../../../view/BlockCard/views/ResolvedView';

let mockOnClick: React.MouseEventHandler = jest.fn();

describe('Block card views - Not Found', () => {
	let props: ResolvedViewProps;

	beforeEach(() => {
		mockOnClick = jest.fn().mockImplementation((event: React.MouseEvent) => {
			expect(event.isPropagationStopped()).toBe(true);
			expect(event.isDefaultPrevented()).toBe(true);
		});
		props = getResolvedProps({}, mockOnClick);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('renders view', () => {
		renderWithIntl(<BlockCardNotFoundView {...props} testId="not-found-view" />);
		const frame = screen.getByTestId('not-found-view');
		expect(frame.textContent).toMatch(
			/https:\/\/github.com\/changesets\/changesetsThe page doesn't exist or it may have changed after this link was added./,
		);
		const icon = screen.getByTestId('not-found-view-warning-icon');
		expect(icon.getAttribute('aria-label')).toBe('not-found-warning-icon');
	});

	it('clicking on link should have no side-effects', () => {
		renderWithIntl(<BlockCardNotFoundView {...props} testId="not-found-view" />);
		const view = screen.getByTestId('not-found-view');
		const link = view.querySelector('a');

		expect(link).toBeTruthy();
		fireEvent.click(link!);
		expect(mockOnClick).toHaveBeenCalledTimes(1);
	});
});
