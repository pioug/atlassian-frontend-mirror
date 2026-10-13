import React from 'react';

import Select from '@atlaskit/select/default';
import { SingleValue } from '@atlaskit/user-picker/components/single-value';
import type { OptionData } from '@atlaskit/user-picker/types';
import type { Option } from '@atlaskit/user-picker/types';

const options: OptionData[] = [
	{ id: 'team-platform', name: 'Platform team', type: 'team', verified: true },
	{ id: 'account-123', name: 'Avery Chen', type: 'user' },
];

/** Reuse the package renderer when configuring a consumer-owned component map. */
export default function SingleValueRendererExample(): React.JSX.Element {
	const selectOptions: Option[] = options.map((option) => ({
		label: option.name,
		value: option.id,
		data: option,
	}));
	const [value, setValue] = React.useState<Option | null>(selectOptions[0]);

	return (
		<div>
			<label htmlFor="team-owner">Team owner</label>
			<Select<Option, boolean>
				inputId="team-owner"
				aria-label="Team owner"
				options={selectOptions}
				value={value}
				onChange={(nextValue) => setValue(nextValue && 'data' in nextValue ? nextValue : null)}
				components={{ SingleValue }}
			/>
		</div>
	);
}
