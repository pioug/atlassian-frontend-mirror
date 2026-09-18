import React from 'react';

import { render, screen } from '@atlassian/testing-library';

import { PlayButtonBackground } from '../playButtonBackground';
import { PlayButtonWrapper } from '../playButtonWrapper';
import { playButtonClassName, bkgClassName } from '../styles';

describe('Styled PlayButton', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(<PlayButtonWrapper />);
		await expect(container).toBeAccessible();
	});

	it('should render Wrapper properly with a className', () => {
		render(<PlayButtonWrapper />);
		const wrapper = screen.getByTestId('media-card-play-button-wrapper');
		expect(wrapper).toBeInTheDocument();
		// className kept for runtime hover styles defined in styles.ts (fixedPlayButtonStyles)
		expect(wrapper).toHaveClass(playButtonClassName);
	});

	it('should render background properly with a className', () => {
		render(<PlayButtonBackground />);
		const bg = screen.getByTestId('media-card-play-button-background');
		expect(bg).toBeInTheDocument();
		// className kept for runtime hover styles defined in styles.ts (fixedPlayButtonStyles)
		expect(bg).toHaveClass(bkgClassName);
	});
});
