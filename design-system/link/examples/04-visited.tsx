import React from 'react';

import Link from '@atlaskit/link';
import { Box } from '@atlaskit/primitives/compiled';

// eslint-disable-next-line @atlaskit/platform/use-entrypoints-in-examples
import variations from '../src/testutils/variations';

import GlobalStyleSimulator from './utils/global-style-simulator';

export default function VisitedExample() {
	return (
		<>
			<GlobalStyleSimulator />
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
								{/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
								<Link {...props} href="" testId={name}>
									I have been visited
								</Link>
							</Box>
						</td>
					</tr>
				))}
			</table>
		</>
	);
}
