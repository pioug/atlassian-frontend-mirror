import React from 'react';
import { cleanup } from '@testing-library/react';
import { renderWithIntl } from '@atlaskit/media-test-helpers/renderWithIntl';
import { BlockCardResolvingView } from '../../../../view/BlockCard';

describe('Block card views - Resolving', () => {
	afterEach(() => {
		cleanup();
	});

	it('renders view', () => {
		const { getByTestId } = renderWithIntl(<BlockCardResolvingView testId="resolving-view" />);
		const frame = getByTestId('resolving-view');
		expect(frame.textContent).toBe('Loading...');
	});
});
