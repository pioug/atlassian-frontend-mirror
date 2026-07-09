import React from 'react';

import { cssMap } from '@atlaskit/css';
import AddIcon from '@atlaskit/icon/core/add';
import IconTile from '@atlaskit/icon/icon-tile';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	blueCircleSmall: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		width: '24px',
		height: '24px',
		borderRadius: token('radius.full'),
		backgroundColor: token('color.background.accent.blue.subtler'),
	},
});

const BlueCircleReplacement = (): React.JSX.Element => (
	<Box xcss={styles.blueCircleSmall}>
		<AddIcon label="" size="medium" color={token('color.icon.accent.blue', '#1D7AFC')} />
	</Box>
);

const _default_1 = (): React.JSX.Element[] => [
	<IconTile size="small" icon={AddIcon} label="Add" appearance="redBold" />,
	<IconTile
		size="small"
		icon={AddIcon}
		label="Add"
		shape="circle"
		appearance="blue"
		UNSAFE_circleReplacementComponent={<BlueCircleReplacement />}
	/>,
];
export default _default_1;
