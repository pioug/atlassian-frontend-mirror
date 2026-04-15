/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, cx, jsx } from '@atlaskit/css';
import RovoChatIcon from '@atlaskit/icon/core/rovo-chat';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	innerContainer: {
		display: 'inline',
		backgroundClip: 'padding-box',
		boxDecorationBreak: 'clone',
		paddingLeft: token('space.075'),
		paddingRight: token('space.075'),
	},
	rovoIcon: {
		color: token('color.text.inverse'),
		cursor: 'pointer',
		backgroundColor: token('color.background.selected.bold'),
		borderTopRightRadius: token('radius.xsmall'),
		borderBottomRightRadius: token('radius.xsmall'),
		paddingTop: token('space.025'),
		paddingBottom: token('space.025'),
	}
});

export const RovoActionsCta = ({ testId }: { testId?: string }) => {
	return (
		<Box xcss={cx(styles.innerContainer, styles.rovoIcon)} testId={testId}>
			<RovoChatIcon label="Rovo" color={token('color.icon.inverse')} size="small" />
		</Box>
	);
};
