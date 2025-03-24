import React from 'react';

import { FormattedMessage } from 'react-intl-next';

import { cssMap } from '@atlaskit/css';
import { ConfluenceIcon, JiraIcon } from '@atlaskit/logo';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import type { LinkedContainerCardProps } from '@atlaskit/teams-public';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	containerWrapperStyles: {
		display: 'flex',
		alignItems: 'center',
	},
	containerIconStyles: {
		borderRadius: token('border.radius.100'),
		height: '30px',
		width: '30px',
	},
	containerTypeIconButtonStyles: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: token('border.radius.100'),
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border'),
		marginLeft: 'auto',
		height: '20px',
		width: '20px',
	},
});

export const TeamConnections = ({
	containerType,
	title,
	containerIcon,
}: LinkedContainerCardProps) => {
	return (
		<Inline space="space.100" xcss={styles.containerWrapperStyles}>
			<Box
				as="img"
				src={containerIcon}
				alt=""
				testId="linked-container-icon"
				xcss={styles.containerIconStyles}
			/>
			<Stack>
				<Text maxLines={1} weight="medium" color="color.text">
					{title}
				</Text>
				<Text maxLines={1} color="color.text.subtlest">
					{containerType === 'ConfluenceSpace' ? (
						<FormattedMessage
							defaultMessage="Confluence space"
							id="people-and-teams.team-connections.container-type"
						/>
					) : (
						<FormattedMessage
							defaultMessage="Jira project"
							id="people-and-teams.team-connections.container-type"
						/>
					)}
				</Text>
			</Stack>
			<Box
				backgroundColor={'color.background.neutral.subtle'}
				xcss={styles.containerTypeIconButtonStyles}
				testId="container-type-icon"
			>
				{containerType === 'ConfluenceSpace' ? (
					<ConfluenceIcon appearance="brand" size="xsmall" />
				) : (
					<JiraIcon appearance="brand" size="xsmall" />
				)}
			</Box>
		</Inline>
	);
};
