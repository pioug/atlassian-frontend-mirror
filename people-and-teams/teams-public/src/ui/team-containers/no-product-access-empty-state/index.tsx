import React from 'react';

import { defineMessages, FormattedMessage } from 'react-intl-next';

import { cssMap } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import { Box, Inline, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { NoProductAccessIcon } from './no-product-access-icon';

const styles = cssMap({
	emptyStateContainer: {
		borderWidth: token('border.width'),
		borderColor: token('color.border'),
		borderRadius: token('border.radius.100'),
		paddingInline: token('space.400'),
		outlineWidth: token('border.width'),
		outlineColor: token('color.border'),
		outlineStyle: 'solid',
	},
	contentWrapper: {
		paddingInlineStart: token('space.400'),
	},
});

export const NoProductAccessState = () => {
	return (
		<Stack
			space="space.100"
			xcss={styles.emptyStateContainer}
			testId="team-containers-no-product-access-state"
		>
			<Inline alignBlock="center">
				<NoProductAccessIcon />
				<Box xcss={styles.contentWrapper}>
					<Stack space="space.100">
						<Heading size="small">
							<FormattedMessage {...messages.teamContainerEmptyStateTitle} />
						</Heading>
						<FormattedMessage {...messages.teamContainerEmptyStateDescription} />
					</Stack>
				</Box>
			</Inline>
		</Stack>
	);
};

const messages = defineMessages({
	teamContainerEmptyStateTitle: {
		id: 'ptc.team-profile-page.team-containers.empty-state.title',
		defaultMessage: 'Add the places your team works',
		description: 'Empty state title when user has no product access',
	},
	teamContainerEmptyStateDescription: {
		id: 'ptc.team-profile-page.team-containers.empty-state.description',
		defaultMessage:
			'Your team can link their Jira projects, Confluence spaces here to show where they work',
		description: 'Empty state description when user has no product access',
	},
});
