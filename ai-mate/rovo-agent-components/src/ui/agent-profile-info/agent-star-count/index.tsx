/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useIntl } from 'react-intl-next';

import { cssMap, jsx } from '@atlaskit/css';
import StarIcon from '@atlaskit/icon/utility/migration/star-unstarred--star';
import { Box } from '@atlaskit/primitives/compiled';
import Skeleton from '@atlaskit/skeleton';
import { token } from '@atlaskit/tokens';

import { messages } from './messages';
import { formatNumber } from './utils';

const styles = cssMap({
	count: {
		font: token('font.body.small'),
		display: 'flex',
		alignItems: 'center',
		gap: token('space.050'),
		paddingInlineStart: token('space.025'),
	},
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
		<Box xcss={styles.count}>
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
