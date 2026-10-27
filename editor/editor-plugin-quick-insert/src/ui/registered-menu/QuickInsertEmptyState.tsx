import React from 'react';

import { useIntl } from 'react-intl';
import { lazy, LazySuspense } from 'react-loosely-lazy';

import { cssMap, cx } from '@atlaskit/css';
import { messages } from '@atlaskit/editor-common/quick-insert/messages';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Text } from '@atlaskit/primitives/compiled/text';
import { token } from '@atlaskit/tokens';

const NoResultsIllustration = lazy(() =>
	import(
		/* webpackChunkName: "@atlaskit-internal_editor-quick-insert-no-results" */
		'./assets/no-results'
	).then((module) => module.default),
);

type Props = {
	mode: 'inline' | 'full';
	spacing?: 'compact' | 'spacious';
};

const styles = cssMap({
	base: {
		alignItems: 'center',
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.300'),
		justifyContent: 'center',
		width: '100%',
	},
	compact: {
		paddingBlock: token('space.400'),
	},
	spacious: {
		paddingBlock: token('space.600'),
	},
	inlineIllustration: {
		height: '63px',
		width: '57px',
	},
	fullIllustration: {
		height: '84px',
		width: '76px',
	},
});

export const QuickInsertEmptyState = ({
	mode,
	spacing = mode === 'full' ? 'spacious' : 'compact',
}: Props): React.JSX.Element => {
	const { formatMessage } = useIntl();
	const illustrationSize = mode === 'full' ? { width: 76, height: 84 } : { width: 57, height: 63 };

	return (
		<Box testId="quick-insert-empty-state" xcss={cx(styles.base, styles[spacing])}>
			<Box xcss={mode === 'full' ? styles.fullIllustration : styles.inlineIllustration}>
				<LazySuspense fallback={null}>
					<NoResultsIllustration width={illustrationSize.width} height={illustrationSize.height} />
				</LazySuspense>
			</Box>
			<Text align="center">{formatMessage(messages.noSearchResults)}</Text>
		</Box>
	);
};
