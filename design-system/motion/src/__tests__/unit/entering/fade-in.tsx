import React from 'react';

import { render, screen } from '@testing-library/react';

import FadeIn from '../../../entering/fade-in';
import { easeInOut } from '../../../utils/curves';

describe('<FadeIn />', () => {
	it('should ease in for the timing curve', () => {
		render(<FadeIn>{(props) => <div data-testid="element" {...props} />}</FadeIn>);

		expect(screen.getByTestId('element')).toHaveCompiledCss(
			'animation-timing-function',
			easeInOut.replace(new RegExp(/0\./, 'g'), '.'),
		);
	});

	it('should set a default duration', () => {
		render(<FadeIn>{(props) => <div data-testid="element" {...props} />}</FadeIn>);

		expect(screen.getByTestId('element')).toHaveCompiledCss('animation-duration', '.7s');
	});

	it('should override the default duration', () => {
		render(<FadeIn duration="small">{(props) => <div data-testid="element" {...props} />}</FadeIn>);

		expect(screen.getByTestId('element')).toHaveCompiledCss('animation-duration', '.1s');
	});
});
