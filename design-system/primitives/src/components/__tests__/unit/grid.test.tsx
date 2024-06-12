import React from 'react';

import { render, screen } from '@testing-library/react';

import { Grid, xcss } from '../../../index';

const testId = 'test';
const styles = xcss({
	alignItems: 'start',
	alignContent: 'start',
	justifyContent: 'start',
	gap: 'space.100',
	columnGap: 'space.100',
	rowGap: 'space.100',
	gridAutoFlow: 'row',
	gridTemplateAreas: 'a b',
	gridTemplateRows: '100px',
	gridTemplateColumns: '100px',
});

describe('Grid component', () => {
	it('should render with a given test id', () => {
		render(<Grid testId={testId}>Grid with testid</Grid>);
		const element = screen.getByTestId(testId);
		expect(element).toBeInTheDocument();
	});

	it('should render div by default', () => {
		render(<Grid testId={testId}>Grid as div default</Grid>);
		const element = screen.getByTestId(testId);
		expect(element).toBeInTheDocument();
		expect(element.tagName).toBe('DIV');
	});

	it('should render given `as` element', () => {
		render(
			<Grid testId={testId} as="span">
				Grid as span
			</Grid>,
		);
		const element = screen.getByTestId(testId);
		expect(element).toBeInTheDocument();
		expect(element.tagName).toBe('SPAN');
	});

	it('should render children', () => {
		render(
			<Grid testId={testId}>
				<div data-testid="grid-child">Child text</div>
			</Grid>,
		);
		const parent = screen.getByTestId(testId);
		expect(parent).toBeInTheDocument();
		const child = screen.getByTestId('grid-child');
		expect(child).toBeInTheDocument();
		expect(parent).toContainElement(child);
	});

	test('`xcss` should result in expected css', () => {
		render(
			<Grid
				testId={testId}
				alignItems="end"
				alignContent="end"
				justifyContent="end"
				gap="space.0"
				columnGap="space.0"
				rowGap="space.0"
				autoFlow="dense"
				templateAreas={['header']}
				templateColumns="2fr"
				templateRows="1fr"
				xcss={styles}
			>
				child
			</Grid>,
		);
		const element = screen.getByTestId(testId);
		expect(element).toBeInTheDocument();

		expect(element).toHaveStyle({
			'--ds-grid--grid-template-areas': '"header"',
			'--ds-grid--grid-template-columns': '2fr',
			'--ds-grid--grid-template-rows': '1fr',
		});

		expect(element).toHaveCompiledCss({
			// Every value in here overrides the props values
			// eg. `props.alignItems="end"` is overridden by `xcss.alignItems: 'start'`
			alignItems: 'start',
			alignContent: 'start',
			justifyContent: 'start',
			gap: 'var(--ds-space-100, 8px)',
			columnGap: 'var(--ds-space-100, 8px)',
			rowGap: 'var(--ds-space-100, 8px)',
			gridAutoFlow: 'row',
			// NOTE: These all calculate the css variable in tests
			gridTemplateAreas: '"header"', // via `var(--ds-grid--grid-template-areas)`
			gridTemplateColumns: '2fr', // via `var(--ds-grid--grid-template-columns)`
			gridTemplateRows: '1fr', // via `var(--ds-grid--grid-template-rows)`
		});
	});

	test('nested grids should not inherit css variables from parents', () => {
		render(
			<Grid testId="parent" templateAreas={['header']} templateColumns="2fr" templateRows="1fr">
				<Grid testId="child" templateRows="100px">
					Child
				</Grid>
			</Grid>,
		);

		const parent = screen.getByTestId('parent');
		expect(parent).toBeInTheDocument();
		expect(parent).toHaveStyle({
			'--ds-grid--grid-template-areas': '"header"',
			'--ds-grid--grid-template-columns': '2fr',
			'--ds-grid--grid-template-rows': '1fr',
		});
		expect(parent).toHaveCompiledCss({
			// NOTE: These all calculate the css variable in tests
			gridTemplateAreas: '"header"', // via `var(--ds-grid--grid-template-areas)`
			gridTemplateColumns: '2fr', // via `var(--ds-grid--grid-template-columns)`
			gridTemplateRows: '1fr', // via `var(--ds-grid--grid-template-rows)`
		});

		const child = screen.getByTestId('child');
		expect(child).toBeInTheDocument();
		expect(child).toHaveStyle({
			'--ds-grid--grid-template-areas': 'initial',
			'--ds-grid--grid-template-columns': 'initial',
			'--ds-grid--grid-template-rows': '100px',
		});
		expect(child).toHaveCompiledCss({
			// NOTE: These all calculate the css variable in tests
			gridTemplateAreas: 'initial', // via `var(--ds-grid--grid-template-areas)`
			gridTemplateColumns: 'initial', // via `var(--ds-grid--grid-template-columns)`
			gridTemplateRows: '100px', // via `var(--ds-grid--grid-template-rows)`
		});
	});
});
