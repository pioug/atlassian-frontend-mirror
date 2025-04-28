/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useRef } from 'react';

import { cssMap, jsx } from '@compiled/react';
import { useIntl } from 'react-intl-next';

import ShowMoreHorizontalIcon from '@atlaskit/icon/core/show-more-horizontal';
import { ButtonItem, Section } from '@atlaskit/menu';
import { Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { toolbarInsertBlockMessages } from '../../messages/insert-block';

const styles = cssMap({
	iconContainer: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		width: 32,
		height: 24,
		marginRight: token('space.050'),
	},
	buttonContent: {
		display: 'flex',
		alignItems: 'center',
		gap: token('space.150'),
		/**
		 * There is a space.025 padding in the elements list above so
		 * the below is added to match the spacing so that the icons
		 * and label lines up.
		 */
		paddingTop: token('space.025'),
		paddingRight: token('space.025'),
		paddingBottom: token('space.025'),
		paddingLeft: token('space.025'),
	},
});

export const ViewMore = ({ onViewMore, focus }: { focus: boolean; onViewMore: () => void }) => {
	const ref = useRef<HTMLElement>(null);
	const { formatMessage } = useIntl();
	useEffect(() => {
		if (ref.current && focus) {
			ref.current.focus();
		}
	}, [focus]);

	return (
		<Section hasSeparator>
			<ButtonItem
				onClick={onViewMore}
				aria-label={formatMessage(toolbarInsertBlockMessages.viewMoreAriaLabel)}
				data-testid="view-more-elements-item"
				ref={ref}
			>
				<div css={styles.buttonContent}>
					<div css={styles.iconContainer}>
						<ShowMoreHorizontalIcon label="" spacing="spacious" />
					</div>
					<Text>{formatMessage(toolbarInsertBlockMessages.viewMore)}</Text>
				</div>
			</ButtonItem>
		</Section>
	);
};
