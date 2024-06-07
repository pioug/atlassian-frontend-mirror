import React, { useState } from 'react';

import { Label } from '@atlaskit/form';
import { Box } from '@atlaskit/primitives';
import Toggle from '@atlaskit/toggle';

function makeid(length = 12) {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	let counter = 0;
	while (counter < length) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
		counter += 1;
	}
	return result;
}

export const ToggleBox = ({
	label,
	onChange,
	...props
}: Omit<React.ComponentProps<typeof Toggle>, 'onChange'> & {
	label: string;
	onChange: (val: boolean) => void;
}) => {
	const [id] = useState(makeid());

	return (
		<Box>
			<Label htmlFor={id}>{label}</Label>
			<Toggle
				onChange={(evt) => {
					const { checked } = evt.target;
					onChange(checked);
				}}
				{...props}
				id={id}
			/>
		</Box>
	);
};
