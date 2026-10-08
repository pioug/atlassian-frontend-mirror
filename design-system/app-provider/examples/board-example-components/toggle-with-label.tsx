/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React, { type JSX } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';
import Toggle from '@atlaskit/toggle/toggle';
import { token } from '@atlaskit/tokens';

const toggleStyles = cssMap({
	label: {
		font: token('font.body.small'),
		fontWeight: token('font.weight.bold'),
		color: token('color.text.subtle'),
	},
});

type ToggleWithLabelProps = {
	id: string;
	label: string;
	isChecked: boolean;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	description?: string;
};

export const ToggleWithLabel = ({
	id,
	label,
	isChecked,
	onChange,
	description,
}: ToggleWithLabelProps): JSX.Element => (
	<Stack space="space.050">
		<Inline space="space.100" alignBlock="center">
			<Toggle id={id} isChecked={isChecked} onChange={onChange} />
			<label htmlFor={id} css={toggleStyles.label}>
				{label}
			</label>
		</Inline>
		{description && (
			<Text size="small" color="color.text.subtle">
				{description}
			</Text>
		)}
	</Stack>
);
