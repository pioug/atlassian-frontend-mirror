import React from 'react';

import Link from '../src';
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
						{/* Anchor content will come from the variations file */}
						{/*eslint-disable-next-line jsx-a11y/anchor-has-content */}
						<Link {...props} />
					</td>
				</tr>
			))}
		</table>
	);
}
