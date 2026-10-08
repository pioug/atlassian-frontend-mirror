/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import type { JSX } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import Heading from '@atlaskit/heading/heading';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';
import Toggle from '@atlaskit/toggle/toggle';
import { token } from '@atlaskit/tokens';

const sectionHeaderStyles = cssMap({
	container: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBlockEnd: token('space.100'),
		width: '100%',
	},
});

export interface SectionHeaderProps {
	title: string;
	subtitle: string;
	isEnabled?: boolean;
	onToggleChange?: (enabled: boolean) => void;
	toggleLabel?: string;
}

export const SectionHeader = ({
	title,
	subtitle,
	isEnabled,
	onToggleChange,
	toggleLabel,
}: SectionHeaderProps): JSX.Element => {
	return (
		<Box xcss={sectionHeaderStyles.container}>
			<Stack space="space.050">
				<Heading as="h3" size="medium">
					{title}
				</Heading>
				<Text size="small" color="color.text.subtle">
					{subtitle}
				</Text>
			</Stack>
			{onToggleChange && toggleLabel !== undefined && (
				<Toggle
					isChecked={isEnabled}
					onChange={() => onToggleChange(!isEnabled)}
					label={toggleLabel}
				/>
			)}
		</Box>
	);
};
