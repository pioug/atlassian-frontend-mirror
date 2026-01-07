import React from 'react';

import { render, screen } from '@testing-library/react';

import ExitingPersistence from '../../../entering/exiting-persistence';
import ZoomIn from '../../../entering/zoom-in';
import { easeInOut } from '../../../utils/curves';

jest.mock('../../../utils/accessibility');

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('<ZoomIn />', () => {
	it('should default to medium duration', () => {
		render(<ZoomIn>{(props) => <div data-testid="target" {...props} />}</ZoomIn>);

		expect(screen.getByTestId('target')).toHaveCompiledCss('animation-duration', '.1s');
	});

	it('should override default duration', () => {
		render(<ZoomIn duration="large">{(props) => <div data-testid="target" {...props} />}</ZoomIn>);

		expect(screen.getByTestId('target')).toHaveCompiledCss('animation-duration', '.7s');
	});

	it('should zoom in ease in out', () => {
		render(<ZoomIn>{(props) => <div data-testid="target" {...props} />}</ZoomIn>);

		expect(screen.getByTestId('target')).toHaveCompiledCss(
			'animation-timing-function',
			easeInOut.replace(new RegExp(/0\./, 'g'), '.'),
		);
	});

	it('should zoom out easing in out', () => {
		const { rerender } = render(
			<ExitingPersistence>
				<ZoomIn>{(props) => <div data-testid="target" {...props} />}</ZoomIn>
			</ExitingPersistence>,
		);

		rerender(<ExitingPersistence>{false}</ExitingPersistence>);

		expect(screen.getByTestId('target')).toHaveCompiledCss(
			'animation-timing-function',
			easeInOut.replace(new RegExp(/0\./, 'g'), '.'),
		);
	});
});
