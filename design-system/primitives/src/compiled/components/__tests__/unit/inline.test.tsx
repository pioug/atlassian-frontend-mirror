/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';
import { render, screen } from '@testing-library/react';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

import { Inline } from '../../../index';

const styles = cssMap({
	root: {
		justifyContent: 'space-around',
		alignItems: 'start',
		flexWrap: 'nowrap',
		flexGrow: '42',
		gap: token('space.100'),
		rowGap: token('space.100'),
	},
});

describe('Inline', () => {
	const testId = 'test';

	it('should render inline', () => {
		render(
			<Inline space="space.050">
				<div>1</div>
				<div>2</div>
			</Inline>,
		);
		expect(screen.getByText('1')).toBeInTheDocument();
		expect(screen.getByText('2')).toBeInTheDocument();
	});

	it('should render inline with separators', () => {
		render(
			<Inline space="space.050" separator="/">
				<div>1</div>
				<div>2</div>
			</Inline>,
		);
		expect(screen.getByText('1')).toBeInTheDocument();
		expect(screen.getByText('2')).toBeInTheDocument();
		expect(screen.getByText('/')).toBeInTheDocument();
	});

	it('should render with a given test id', () => {
		render(
			<Inline space="space.050" testId={testId}>
				<div>1</div>
				<div>2</div>
			</Inline>,
		);
		const element = screen.getByTestId(testId);
		expect(element).toBeInTheDocument();
	});

	test('`xcss` should result in expected css', () => {
		render(
			<Inline
				testId={testId}
				alignInline="end"
				alignBlock="end"
				shouldWrap
				spread="space-between"
				grow="fill"
				space="space.0"
				rowSpace="space.0"
				xcss={styles.root}
			>
				child
			</Inline>,
		);
		const element = screen.getByTestId(testId);
		expect(element).toBeInTheDocument();

		expect(element).toHaveCompiledCss({
			// Every value in here overrides the props values
			// eg. `props.alignInline="end"` is overridden by `xcss.justifyContent: 'start'`
			alignItems: 'start',
			justifyContent: 'space-around',
			flexWrap: 'nowrap',
			flexGrow: '42',
			gap: 'var(--ds-space-100,8px)',
			rowGap: 'var(--ds-space-100,8px)',
		});
	});
});
