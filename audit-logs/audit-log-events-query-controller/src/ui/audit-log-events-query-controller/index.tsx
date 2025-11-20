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
					{/* eslint-disable-next-line @atlassian/i18n/no-literal-string-in-jsx */}
					<Text>{`Query Mode Switcher Placeholder`}</Text>
				</Box>
				<Box>
					{/* eslint-disable-next-line @atlassian/i18n/no-literal-string-in-jsx */}
					<Text>{`Basic Query Filter Controller`}</Text>
				</Box>
				<Box>
					{/* eslint-disable-next-line @atlassian/i18n/no-literal-string-in-jsx */}
					<Text>{`ALQL Query Filter Controller`}</Text>
				</Box>
			</Inline>
		</Box>
	);
}
