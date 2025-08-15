/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type ReactNode } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import { Box, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	rows: {
		borderBlockStartColor: token('color.border', '#091E4224'),
		borderBlockStartStyle: 'solid',
		borderBlockStartWidth: token('border.width', '1px'),
	},
});

import type { AuditLogEventData } from '../../../types';

export interface DetailsSubSectionProps {
	event: AuditLogEventData | undefined;
	title: string;
	children: ReactNode;
}

export const DetailsSubSection = ({ event, title, children }: DetailsSubSectionProps) => {
	return (
		<Stack
			space="space.050"
			role="region"
			key={`details-sub-section-${title}-${event?.id}`}
			testId={`details-sub-section-${title}`}
		>
			<Heading size="small">
				<Text color="color.text.subtle" as="span" size="large" weight="medium">
					{title}
				</Text>
			</Heading>
			<Box paddingBlockStart="space.100" xcss={styles.rows}>
				<Stack space="space.050">{children}</Stack>
			</Box>
		</Stack>
	);
};
