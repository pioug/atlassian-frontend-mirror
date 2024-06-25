import React from 'react';

import { Box } from '@atlaskit/primitives';

import Link from '../src';

export default function VisitedExample() {
	// Both link text and icon should be `color.link.visited`.
	return (
		<Box padding="space.100">
			{/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
			<Link href="" target="_blank" testId="link">
				I have been visited
			</Link>
		</Box>
	);
}
