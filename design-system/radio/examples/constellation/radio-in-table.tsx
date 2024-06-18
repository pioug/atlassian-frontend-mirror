/**
 * @jsxRuntime classic
 */
/** @jsx jsx */
import { type SyntheticEvent, useCallback, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { Box, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { Radio } from '../../src';

interface RadioOptions {
	id: number;
	value: string;
	name: string;
	description: string;
	commit: string;
	updated: string;
}

const items: Array<RadioOptions> = [
	{
		id: 1,
		value: '1',
		name: 'branch',
		description: 'master',
		commit: 'dcc0f15',
		updated: '14 minutes ago',
	},
	{
		id: 2,
		value: '2',
		name: 'branch',
		description: 'feature/dark-mode',
		commit: 'cbc0fa3',
		updated: '56 minutes ago',
	},
	{
		id: 3,
		value: '3',
		name: 'branch',
		description: 'feature/right-to-left',
		commit: '69568ea',
		updated: '16 hours ago',
	},
	{
		id: 4,
		value: '4',
		name: 'branch',
		description: 'bug/type-incorrect-for-checked-prop',
		commit: '1159c76',
		updated: 'yesterday',
	},
];

const tableStyles = xcss({
	marginBlock: 'space.200',
	padding: 'space.100',
	borderColor: 'color.border',
	borderStyle: 'dashed',
	borderWidth: 'border.width',
	color: 'color.text',
});

export default function RadioInputExample() {
	const [value, setValue] = useState<string>('1');

	const onChange = useCallback(
		({ currentTarget: { value } }: SyntheticEvent<any>) => {
			setValue(value);
		},
		[setValue],
	);

	return (
		<Box>
			<table>
				<thead>
					<tr>
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
						<td style={{ width: 0 }} />
						<th id="head-description">Branch</th>
						<th id="head-commit">Last commit</th>
						<th id="head-updated">Updated</th>
					</tr>
				</thead>
				<tbody>
					{items.map((item) => (
						<tr
							onClick={() => setValue(item.value)}
							key={`${item.value}${item.name}${item.id}`}
							style={{
								backgroundColor:
									item.value === value ? token('color.background.selected') : 'transparent',
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
								transition: 'background-color 200ms ease-in-out',
							}}
						>
							{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
							<th scope="row" style={{ width: 24, paddingRight: 0 }}>
								<Radio
									isChecked={item.value === value}
									onChange={onChange}
									name={item.name}
									value={item.value}
									aria-labelledby={`head-description row-${item.id}-description head-commit row-${item.id}-commit head-updated row-${item.id}-updated`}
								/>
							</th>
							<td id={`row-${item.id}-description`}>{item.description}</td>
							<td id={`row-${item.id}-commit`}>{item.commit}</td>
							<td id={`row-${item.id}-updated`}>{item.updated}</td>
						</tr>
					))}
				</tbody>
			</table>
			<Box xcss={tableStyles}>currently selected value: {value}</Box>
		</Box>
	);
}
