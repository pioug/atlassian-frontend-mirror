import React from 'react';

import { render, screen } from '@testing-library/react';

import ExitingPersistence from '../../../entering/exiting-persistence';
import ZoomIn, { shrinkOutAnimation, zoomInAnimation } from '../../../entering/zoom-in';

jest.mock('../../../utils/accessibility');

describe('<ZoomIn />', () => {
	it('should default to medium duration', () => {
		render(<ZoomIn>{(props) => <div data-testid="target" {...props} />}</ZoomIn>);

		expect(screen.getByTestId('target')).toHaveStyleDeclaration('animation-duration', '100ms');
	});

	it('should override default duration', () => {
		render(<ZoomIn duration="large">{(props) => <div data-testid="target" {...props} />}</ZoomIn>);

		expect(screen.getByTestId('target')).toHaveStyleDeclaration('animation-duration', '700ms');
	});

	it('should zoom in ease in out', () => {
		render(<ZoomIn>{(props) => <div data-testid="target" {...props} />}</ZoomIn>);

		expect(screen.getByTestId('target')).toHaveStyleDeclaration(
			'animation-timing-function',
			'ease-in-out',
		);
	});

	it('should zoom out easing in out', () => {
		const { rerender } = render(
			<ExitingPersistence>
				<ZoomIn>{(props) => <div data-testid="target" {...props} />}</ZoomIn>
			</ExitingPersistence>,
		);

		rerender(<ExitingPersistence>{false}</ExitingPersistence>);

		expect(screen.getByTestId('target')).toHaveStyleDeclaration(
			'animation-timing-function',
			'ease-in-out',
		);
	});

	it('should generate zoom in keyframes', () => {
		const keyframes = zoomInAnimation();

		expect(keyframes).toMatchInlineSnapshot(`
		{
		  "0%": {
		    "opacity": 0,
		    "transform": "scale(0.5)",
		  },
		  "100%": {
		    "transform": "scale(1)",
		  },
		  "50%": {
		    "opacity": 1,
		  },
		  "75%": {
		    "transform": "scale(1.25)",
		  },
		}
	`);
	});

	it('should generate zoom away keyframes', () => {
		const keyframes = shrinkOutAnimation();

		expect(keyframes).toMatchInlineSnapshot(`
		{
		  "to": {
		    "opacity": 0,
		    "transform": "scale(0.75)",
		  },
		}
	`);
	});
});
