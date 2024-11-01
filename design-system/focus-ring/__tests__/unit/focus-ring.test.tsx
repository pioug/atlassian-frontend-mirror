import React from 'react';

import { render, screen } from '@testing-library/react';

import FocusRing from '../../src';
import FocusRingCompiled from '../../src/compiled';

describe.each([
	['emotion', FocusRing],
	['compiled', FocusRingCompiled],
])(`variant=%p`, (_variant, Component) => {
	it('renders with basic usage', () => {
		render(
			<Component>
				<div data-testid="test" />
			</Component>,
		);

		expect(screen.getByTestId('test')).toBeInTheDocument();
	});

	it('renders with inset prop', () => {
		render(
			<Component isInset>
				<div data-testid="test" />
			</Component>,
		);

		expect(screen.getByTestId('test')).toBeInTheDocument();
	});

	it('should join pre-defined class name', () => {
		render(
			<Component>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
				<div data-testid="test" className="foobar" />
			</Component>,
		);

		expect(screen.getByTestId('test').className.includes('foobar')).toBe(true);
	});
});
