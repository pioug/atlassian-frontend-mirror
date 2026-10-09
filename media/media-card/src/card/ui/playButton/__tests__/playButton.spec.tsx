import React from 'react';

import { screen } from '@atlassian/testing-library/screen';
import { render } from '@atlassian/testing-library/testing-library/react';

import { PlayButton } from '../playButton';

describe('PlayButton', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(<PlayButton />);
		await expect(container).toBeAccessible();
	});

	it('should render PlayButton properly', () => {
		render(<PlayButton />);
		expect(screen.getByTestId('media-card-play-button-wrapper')).toBeInTheDocument();
		expect(screen.getByTestId('media-card-play-button-background')).toBeInTheDocument();
		expect(screen.getByLabelText('play')).toBeInTheDocument();
	});
});
