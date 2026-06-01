import React from 'react';

import { cssMap } from '@compiled/react';

import Banner from '@atlaskit/banner';
import WarningIcon from '@atlaskit/icon/core/status-warning';
import { Box } from '@atlaskit/primitives/compiled';

const containerStyles = cssMap({
	root: {
		maxWidth: '400px',
		margin: 'auto',
	},
});

const message =
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum lobortis, odio egestas pulvinar sodales, neque justo tempor tellus, eget venenatis arcu ante non purus. Pellentesque tellus eros, rutrum vel enim non, tempor faucibus felis. Nullam pharetra erat sed magna porttitor, eget tincidunt odio finibus';

const BannerOverflowExample = (): React.JSX.Element => {
	return (
		<Box xcss={containerStyles.root}>
			<Banner icon={<WarningIcon label="Warning" />}>{message}</Banner>
		</Box>
	);
};

export default BannerOverflowExample;
