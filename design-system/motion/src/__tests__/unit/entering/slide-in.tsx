import React from 'react';

import { render, screen } from '@testing-library/react';

import ExitingPersistence from '../../../entering/exiting-persistence';
import SlideIn, { slideInAnimation } from '../../../entering/slide-in';
import { type Direction, type Fade, type Transition } from '../../../entering/types';
import { easeIn, easeOut } from '../../../utils/curves';
import { durations } from '../../../utils/durations';

jest.mock('../../../utils/accessibility');

describe('<SlideIn />', () => {
	it('should default to medium duration', () => {
		render(
			<SlideIn enterFrom="left">{(props) => <div data-testid="target" {...props} />}</SlideIn>,
		);

		expect(screen.getByTestId('target')).toHaveStyleDeclaration(
			'animation-duration',
			`${durations.medium}ms`,
		);
	});

	it('should override default duration', () => {
		render(
			<SlideIn duration="small" enterFrom="left">
				{(props) => <div data-testid="target" {...props} />}
			</SlideIn>,
		);

		expect(screen.getByTestId('target')).toHaveStyleDeclaration('animation-duration', '100ms');
	});

	it('should slide in easing out', () => {
		render(
			<SlideIn enterFrom="left">{(props) => <div data-testid="target" {...props} />}</SlideIn>,
		);

		expect(screen.getByTestId('target')).toHaveStyleDeclaration(
			'animation-timing-function',
			easeOut,
		);
	});

	it('should slide out easing in', () => {
		const { rerender } = render(
			<ExitingPersistence>
				<SlideIn enterFrom="left">{(props) => <div data-testid="target" {...props} />}</SlideIn>
			</ExitingPersistence>,
		);

		rerender(<ExitingPersistence>{false}</ExitingPersistence>);

		expect(screen.getByTestId('target')).toHaveStyleDeclaration(
			'animation-timing-function',
			easeIn,
		);
	});

	['entering', 'exiting'].forEach((state) => {
		['top', 'right', 'bottom', 'left'].forEach((from) => {
			['none', 'in', 'out', 'inout'].forEach((fade) => {
				it(`should animate ${state} from ${from} with fade ${fade}`, () => {
					expect(
						slideInAnimation(from as Direction, state as Transition, fade as Fade),
					).toMatchSnapshot();
				});
			});
		});
	});
});
