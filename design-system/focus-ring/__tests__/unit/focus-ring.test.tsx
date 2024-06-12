import React from 'react';

import { render } from '@testing-library/react';

import FocusRing from '../../src';

describe('Focus Ring', () => {
	it('renders with basic usage', () => {
		const { getByTestId } = render(
			<FocusRing>
				<div data-testid="test" />
			</FocusRing>,
		);

		expect(getByTestId('test')).toBeDefined();
	});

	it('renders with inset prop', () => {
		const { getByTestId } = render(
			<FocusRing isInset>
				<div data-testid="test" />
			</FocusRing>,
		);

		expect(getByTestId('test')).toBeDefined();
	});

	it('should join pre-defined class name', () => {
		const { getByTestId } = render(
			<FocusRing>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
				<div data-testid="test" className="foobar" />
			</FocusRing>,
		);

		expect(getByTestId('test').className.includes('foobar')).toBe(true);
	});
});
