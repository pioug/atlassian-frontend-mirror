import React from 'react';

import { render, screen } from '@testing-library/react';

import ExitingPersistence from '../../../entering/exiting-persistence';
import SlideIn from '../../../entering/slide-in';
import { easeIn, easeOut } from '../../../utils/curves';

jest.mock('../../../utils/accessibility');

describe('<SlideIn />', () => {
	it('should default to medium duration', () => {
		render(
			<SlideIn enterFrom="left">{(props) => <div data-testid="target" {...props} />}</SlideIn>,
		);

		expect(screen.getByTestId('target')).toHaveCompiledCss('animation-duration', '.35s');
	});

	it('should override default duration', () => {
		render(
			<SlideIn duration="small" enterFrom="left">
				{(props) => <div data-testid="target" {...props} />}
			</SlideIn>,
		);

		expect(screen.getByTestId('target')).toHaveCompiledCss('animation-duration', '.1s');
	});

	it('should slide in easing out', () => {
		render(
			<SlideIn enterFrom="left">{(props) => <div data-testid="target" {...props} />}</SlideIn>,
		);

		expect(screen.getByTestId('target')).toHaveCompiledCss(
			'animation-timing-function',
			easeOut.replace('0.', '.'),
		);
	});

	it('should slide out easing in', () => {
		const { rerender } = render(
			<ExitingPersistence>
				<SlideIn enterFrom="left">{(props) => <div data-testid="target" {...props} />}</SlideIn>
			</ExitingPersistence>,
		);

		rerender(<ExitingPersistence>{false}</ExitingPersistence>);

		expect(screen.getByTestId('target')).toHaveCompiledCss(
			'animation-timing-function',
			easeIn.replace(new RegExp(/0\./, 'g'), '.'),
		);
	});
});
