import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithIntl } from '@atlaskit/media-test-helpers/renderWithIntl';
import { BlockCardResolvingView } from '../../../../view/BlockCard';

describe('Block card views - Resolving', () => {
	it('renders view', () => {
		renderWithIntl(<BlockCardResolvingView testId="resolving-view" />);
		const frame = screen.getByTestId('resolving-view');
		expect(frame.textContent).toBe('Loading...');
	});
});
