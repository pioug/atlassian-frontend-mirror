import React from 'react';

import { Box, xcss } from '../src';

// Example usage of the box xcss API
// generates a safe set of classNames
const safeStyles = xcss({
	width: 'size.500',
	height: 'size.500',
	transition: 'all 0.3s',
	padding: 'space.100',
	':hover': {
		transform: 'scale(2)',
		padding: 'space.200',
	},
	// All of these will throw an error
	// '> *': {},
	// '[special-selector]': {},
	// '.class': {},
});

export default function Basic() {
	return (
		<Box
			xcss={safeStyles}
			backgroundColor="color.background.brand.bold"
			testId="box-basic"
			padding="space.100"
		/>
	);
}
