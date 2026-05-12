import React from 'react';
import { render, screen } from '@atlassian/testing-library';
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
