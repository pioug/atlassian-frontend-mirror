import React from 'react';

import { render, screen } from '@testing-library/react';

import FadeIn from '../../../entering/fade-in';
import { easeInOut } from '../../../utils/curves';

describe('<FadeIn />', () => {
	it('should ease in for the timing curve', () => {
		render(<FadeIn>{(props) => <div data-testid="element" {...props} />}</FadeIn>);

		expect(screen.getByTestId('element')).toHaveStyleDeclaration(
			'animation-timing-function',
			easeInOut,
		);
	});

	it('should set a default duration', () => {
		render(<FadeIn>{(props) => <div data-testid="element" {...props} />}</FadeIn>);

		expect(screen.getByTestId('element')).toHaveStyleDeclaration('animation-duration', '700ms');
	});

	it('should override the default duration', () => {
		render(<FadeIn duration="small">{(props) => <div data-testid="element" {...props} />}</FadeIn>);

		expect(screen.getByTestId('element')).toHaveStyleDeclaration('animation-duration', '100ms');
	});
});
