import React from 'react';

import Link from '@atlaskit/link';
import { Box } from '@atlaskit/primitives';

// eslint-disable-next-line @atlaskit/platform/use-entrypoints-in-examples
import variations from '../src/utils/variations';

export default function AllCombinationsExample() {
	return (
		<table>
			<thead>
				<tr>
					<th>Name</th>
					<th>Link</th>
				</tr>
			</thead>
			{variations.map(({ name, props }) => (
				<tr>
					<td>{name}</td>
					<td>
						{/* Inverse appearance requires a different background color to be visible */}
						<Box
							backgroundColor={
								props.appearance === 'inverse'
									? 'color.background.accent.purple.bolder'
									: 'color.background.neutral.subtle'
							}
						>
							{/* Anchor content will come from the variations file */}
							{/*eslint-disable-next-line jsx-a11y/anchor-has-content */}
							<Link {...props} />
						</Box>
					</td>
				</tr>
			))}
		</table>
	);
}
