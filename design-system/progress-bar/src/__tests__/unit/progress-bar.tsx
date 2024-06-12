import React from 'react';

import { render } from '@testing-library/react';

import ProgressBar from '../../components/progress-bar';

const ariaLabel = 'Progress bar label';

describe('Progress Bar', () => {
	it('should render aria-label if supplied', () => {
		const { getByTestId } = render(<ProgressBar value={0.4} ariaLabel={ariaLabel} />);
		const progressBarElement = getByTestId('progress-bar');
		expect(progressBarElement.getAttribute('aria-label')).toEqual(ariaLabel);
	});
});
