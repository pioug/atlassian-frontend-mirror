/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { cssMap, jsx } from '@atlaskit/css';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { token } from '@atlaskit/tokens';

import { BenchmarkLayout } from './shared';

const initialRows = [
	{ id: 'design', team: 'Design Systems', status: 'On track' },
	{ id: 'navigation', team: 'Navigation', status: 'At risk' },
	{ id: 'editor', team: 'Editor', status: 'On track' },
];

const styles = cssMap({
	table: {
		width: '100%',
		borderCollapse: 'collapse',
	},
	cell: {
		borderBlockEndColor: token('color.border'),
		borderBlockEndStyle: 'solid',
		borderBlockEndWidth: token('border.width'),
		paddingBlockStart: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		textAlign: 'start',
	},
});

/**
 * Benchmark prompt:
 * Add motion when rows are added to or removed from this table. Preserve valid table markup and
 * screen-reader behavior.
 */
export default function TableRowsBenchmark(): JSX.Element {
	const [rows, setRows] = useState(initialRows);

	return (
		<BenchmarkLayout title="Team status" description="Remove and restore semantic table rows.">
			<Stack space="space.150">
				<table css={styles.table}>
					<thead>
						<tr>
							<th css={styles.cell} scope="col">
								Team
							</th>
							<th css={styles.cell} scope="col">
								Status
							</th>
							<th css={styles.cell} scope="col">
								Action
							</th>
						</tr>
					</thead>
					<tbody>
						{rows.map((row) => (
							<tr key={row.id}>
								<th css={styles.cell} scope="row">
									{row.team}
								</th>
								<td css={styles.cell}>{row.status}</td>
								<td css={styles.cell}>
									<Button
										onClick={() => setRows((items) => items.filter(({ id }) => id !== row.id))}
									>
										Remove
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				<Button
					onClick={() => setRows(initialRows)}
					isDisabled={rows.length === initialRows.length}
				>
					Restore rows
				</Button>
			</Stack>
		</BenchmarkLayout>
	);
}
