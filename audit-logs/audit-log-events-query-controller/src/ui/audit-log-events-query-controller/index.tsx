/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx } from '@atlaskit/css';
import { Box, Inline, Text } from '@atlaskit/primitives/compiled';

import type { AuditLogEventsQueryControllerProps } from './types';

export default function AuditLogEventsQueryController({
	testId,
}: AuditLogEventsQueryControllerProps): JSX.Element {
	return (
		<Box testId={`${testId}-events-query-controller-container`}>
			<Inline>
				<Box>
					<Text>{`Query Mode Switcher Placeholder`}</Text>
				</Box>
				<Box>
					<Text>{`Basic Query Filter Controller`}</Text>
				</Box>
				<Box>
					<Text>{`ALQL Query Filter Controller`}</Text>
				</Box>
			</Inline>
		</Box>
	);
}
