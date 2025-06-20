import React from 'react';

import { render, screen } from '@testing-library/react';

import { media } from '@atlaskit/primitives/responsive';

import { DangerouslyHoistCssVarToDocumentRoot, HoistCssVarToLocalGrid } from '../../hoist-utils';

describe('HoistCssVarToLocalGrid', () => {
	it('should add the correct style rule', () => {
		render(
			<div data-testid="test-wrapper">
				<HoistCssVarToLocalGrid variableName="--test-variable" value={100} />
			</div>,
		);

		expect(screen.getByTestId('test-wrapper')).toHaveTextContent(
			'#unsafe-design-system-page-layout-root { --test-variable: 100px }',
		);
	});
});

describe('DangerouslyHoistCssVarToDocumentRoot', () => {
	it('should add the correct style rule when the value is a number', () => {
		render(
			<div data-testid="test-wrapper">
				<DangerouslyHoistCssVarToDocumentRoot variableName="--test-variable" value={100} />
			</div>,
		);

		expect(screen.getByTestId('test-wrapper')).toHaveTextContent(
			':root { --test-variable: 100px }',
		);
	});

	it('should add the correct style rule when the value is a string', () => {
		render(
			<div data-testid="test-wrapper">
				<DangerouslyHoistCssVarToDocumentRoot variableName="--test-variable" value="100px" />
			</div>,
		);

		expect(screen.getByTestId('test-wrapper')).toHaveTextContent(
			':root { --test-variable: 100px }',
		);
	});

	it('should add media query when mediaQuery and responsiveValue are provided', () => {
		render(
			<div data-testid="test-wrapper">
				<DangerouslyHoistCssVarToDocumentRoot
					variableName="--test-variable"
					value={100}
					mediaQuery={media.above.sm}
					responsiveValue={200}
				/>
			</div>,
		);

		expect(screen.getByTestId('test-wrapper')).toHaveTextContent(
			':root { --test-variable: 100px }',
		);
		expect(screen.getByTestId('test-wrapper')).toHaveTextContent(
			'@media (min-width: 48rem) { :root { --test-variable: 200px } }',
		);
	});

	it('should not add media query when media query is provided but responsive value is not provided', () => {
		render(
			<div data-testid="test-wrapper">
				<DangerouslyHoistCssVarToDocumentRoot
					variableName="--test-variable"
					value={100}
					mediaQuery={media.above.sm}
				/>
			</div>,
		);

		expect(screen.getByTestId('test-wrapper')).toHaveTextContent(
			':root { --test-variable: 100px }',
		);

		expect(screen.getByTestId('test-wrapper')).not.toHaveTextContent('@media (min-width: 48rem)');
	});
});
