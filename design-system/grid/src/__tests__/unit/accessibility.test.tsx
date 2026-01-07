import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import Grid, { GridContainer, GridItem } from '../../index';

const jsx = (
	<Grid testId="grid">
		<GridItem>
			<div></div>
		</GridItem>
		{Array.from({ length: 8 }).map((_, i) => (
			<GridItem span={{ sm: 4, lg: 3 }} key={`small-items-${i}`}>
				<div>{i + 1}</div>
			</GridItem>
		))}

		<GridItem start={{ md: 4 }} span={{ md: 6 }}>
			<div>Offset Longer</div>
		</GridItem>

		{Array.from({ length: 8 }).map((_, i) => (
			<GridItem span={{ sm: 6 }} key={`medium-items-${i}`}>
				<div />
			</GridItem>
		))}
	</Grid>
);

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Grid and GridItem', () => {
	it('should pass an aXe audit', async () => {
		const { container } = render(jsx);
		await axe(container);
	});
});

describe('GridContainer', () => {
	it('should pass an aXe audit', async () => {
		const { container } = render(<GridContainer>{jsx}</GridContainer>);
		await axe(container);
	});
});
