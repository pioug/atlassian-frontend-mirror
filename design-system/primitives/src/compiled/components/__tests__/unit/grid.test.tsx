/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';
import { render, screen } from '@testing-library/react';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

import { Grid } from '../../../index';

const testId = 'test';
const styles = cssMap({
	root: {
		alignItems: 'start',
		alignContent: 'start',
		justifyContent: 'start',
		gap: token('space.100'),
		columnGap: token('space.100'),
		rowGap: token('space.100'),
		gridAutoFlow: 'row',
		gridTemplateAreas: '"a b"',
		gridTemplateRows: '100px',
		gridTemplateColumns: '100px',
	},
});

const nestedGridStyles = cssMap({
	parent: {
		gridTemplateAreas: '"header"',
		gridTemplateColumns: '2fr',
		gridTemplateRows: '1fr',
	},
	child: {
		gridTemplateRows: '100px',
	},
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
				xcss={styles.root}
			>
				child
			</Grid>,
		);

		expect(screen.getByTestId(testId)).toHaveCompiledCss({
			// Every value in here overrides the props values
			// eg. `props.alignItems="end"` is overridden by `xcss.alignItems: 'start'`
			alignItems: 'start',
			alignContent: 'start',
			justifyContent: 'start',
			gap: 'var(--ds-space-100,8px)',
			columnGap: 'var(--ds-space-100,8px)',
			rowGap: 'var(--ds-space-100,8px)',
			gridAutoFlow: 'row',
			gridTemplateAreas: '"a b"',
			gridTemplateColumns: '75pt', // converted from 100px
			gridTemplateRows: '75pt', // converted from 100px
		});
	});

	test('nested grids renders without an error', () => {
		render(
			<Grid testId="parent" xcss={nestedGridStyles.parent}>
				<Grid testId="child" xcss={nestedGridStyles.child}>
					Child
				</Grid>
			</Grid>,
		);

		expect(screen.getByTestId('parent')).toHaveCompiledCss({
			gridTemplateAreas: '"header"',
			gridTemplateColumns: '2fr',
			gridTemplateRows: '1fr',
		});

		expect(screen.getByTestId('child')).toHaveCompiledCss({
			gridTemplateRows: '75pt', // converted from 100px
		});
	});
});
