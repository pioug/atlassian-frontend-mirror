import React from 'react';

import { render } from '@testing-library/react';

import { varColumnSpan } from '../../constants';
import { Grid, GridColumn } from '../../index';

describe('<GridColumn />', () => {
	it('should set a css variable for the column span', () => {
		const testId = 'column';
		const medium = 11;
		const { getByTestId } = render(
			<Grid>
				<GridColumn medium={medium} testId={testId} />
			</Grid>,
		);

		const styles = getComputedStyle(getByTestId(testId));
		expect(styles.getPropertyValue(varColumnSpan)).toBe(medium.toString());
	});

	it("should have a span of 'auto' by default", () => {
		const testId = 'column';
		const { getByTestId } = render(
			<Grid>
				<GridColumn testId={testId} />
			</Grid>,
		);

		const styles = getComputedStyle(getByTestId(testId));
		expect(styles.getPropertyValue(varColumnSpan)).toBe('auto');
	});

	it('should treat a span of zero the same as the default', () => {
		const testId = 'column';
		const { getByTestId } = render(
			<Grid>
				<GridColumn testId={testId} medium={0} />
			</Grid>,
		);

		const styles = getComputedStyle(getByTestId(testId));
		expect(styles.getPropertyValue(varColumnSpan)).toBe('auto');
	});

	it('should treat negative spans as 1 column', () => {
		const testId = 'column';
		const { getByTestId } = render(
			<Grid>
				<GridColumn testId={testId} medium={-1} />
			</Grid>,
		);

		const styles = getComputedStyle(getByTestId(testId));
		expect(styles.getPropertyValue(varColumnSpan)).toBe('1');
	});

	it('should cap the span to the number of total columns', () => {
		const testId = 'column';
		const columns = 13;
		const medium = columns * 2;
		const { getByTestId } = render(
			<Grid columns={columns}>
				<GridColumn testId={testId} medium={medium} />
			</Grid>,
		);

		const styles = getComputedStyle(getByTestId(testId));
		expect(styles.getPropertyValue(varColumnSpan)).toBe(columns.toString());
	});
});
