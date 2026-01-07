import React from 'react';

import { render, screen } from '@testing-library/react';

import FocusRing from '../../src';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('focus ring', () => {
	it('renders with basic usage', () => {
		render(
			<FocusRing>
				<div data-testid="test" />
			</FocusRing>,
		);

		expect(screen.getByTestId('test')).toBeInTheDocument();
	});

	it('renders with inset prop', () => {
		render(
			<FocusRing isInset>
				<div data-testid="test" />
			</FocusRing>,
		);

		expect(screen.getByTestId('test')).toBeInTheDocument();
	});

	it('should join pre-defined class name', () => {
		render(
			<FocusRing>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
				<div data-testid="test" className="foobar" />
			</FocusRing>,
		);

		expect(screen.getByTestId('test').className.includes('foobar')).toBe(true);
	});
});
