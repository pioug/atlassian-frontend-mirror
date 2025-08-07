import React from 'react';

import { render, screen } from '@testing-library/react';

import AnimateIn from '../../../entering/animate-in';
import { easeIn40Out } from '../../../utils/curves';

describe('<AnimateIn />', () => {
	it('should ease in for the timing curve', () => {
		render(
			<AnimateIn animationTimingFunction="ease-in-40-out" enteringAnimation="fade-in">
				{(props) => <div data-testid="element" {...props} />}
			</AnimateIn>,
		);

		expect(screen.getByTestId('element')).toHaveCompiledCss(
			'animation-timing-function',
			easeIn40Out.replace(new RegExp(/0\./, 'g'), '.'),
		);
	});

	it('should set a default duration', () => {
		render(
			<AnimateIn animationTimingFunction="ease-in-40-out" enteringAnimation="fade-in">
				{(props) => <div data-testid="element" {...props} />}
			</AnimateIn>,
		);

		expect(screen.getByTestId('element')).toHaveCompiledCss('animation-duration', '.7s');
	});

	it('should override the default duration', () => {
		render(
			<AnimateIn
				animationTimingFunction="ease-in-40-out"
				enteringAnimation="fade-in"
				duration="small"
			>
				{(props) => <div data-testid="element" {...props} />}
			</AnimateIn>,
		);

		expect(screen.getByTestId('element')).toHaveCompiledCss('animation-duration', '.1s');
	});
});
