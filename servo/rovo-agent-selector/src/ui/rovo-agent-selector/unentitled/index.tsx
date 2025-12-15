import React, { type ReactNode } from 'react';

import { useIntl } from 'react-intl-next';

import Link from '@atlaskit/link';
import { Box, Text } from '@atlaskit/primitives/compiled';

import messages from './messages';

export const UnentitledState = ({
	canCreateAgents,
}: {
	canCreateAgents: boolean;
}): React.JSX.Element => {
	const { formatMessage } = useIntl();

	return (
		<Box>
			<Text>
				{/* this component is only rendered when site has no rovo entitlement or user cannot create agents */}
				{formatMessage(
					canCreateAgents ? messages.noRovoEntitlementText : messages.noCreateAgentsPermissionText,
					{
						link: (chunks: ReactNode[]) => (
							<Link target="_blank" href="https://support.atlassian.com/rovo/docs/what-is-rovo/">
								{chunks}
							</Link>
						),
					},
				)}
			</Text>
		</Box>
	);
};
