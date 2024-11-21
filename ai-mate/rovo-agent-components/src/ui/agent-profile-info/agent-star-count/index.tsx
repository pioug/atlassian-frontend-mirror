import React from 'react';

import { useIntl } from 'react-intl-next';

import StarIcon from '@atlaskit/icon/utility/migration/star-unstarred--star';
import { Box, xcss } from '@atlaskit/primitives';
import Skeleton from '@atlaskit/skeleton';
import { token } from '@atlaskit/tokens';

import { messages } from './messages';
import { formatNumber } from './utils';

const countStyles = xcss({
	font: token('font.body.small'),
	display: 'flex',
	alignItems: 'center',
	gap: 'space.050',
	paddingInlineStart: 'space.025',
});

export const AgentStarCount = ({
	starCount,
	isLoading,
}: {
	starCount: number | null | undefined;
	isLoading: boolean;
}) => {
	const { formatMessage } = useIntl();

	if ((starCount === null || starCount === undefined) && !isLoading) {
		return null;
	}

	return (
		<Box xcss={countStyles}>
			<StarIcon
				LEGACY_margin={`0 ${token('space.negative.025')}`}
				color="currentColor"
				label=""
				LEGACY_size="small"
			/>
			{isLoading ? (
				<Skeleton
					testId="agent-profile-info-star-count-skeleton"
					isShimmering
					height={16}
					width={75}
					borderRadius={3}
				/>
			) : (
				formatMessage(messages.starredCount, { starCount: formatNumber(starCount ?? 0) })
			)}
		</Box>
	);
};
