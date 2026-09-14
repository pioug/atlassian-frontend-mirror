import React from 'react';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import LinkRenderType from '../../../issue-like-table/render-type/link';

const styles = cssMap({
	smartLinkContainerStyles: {
		paddingLeft: token('space.025'),
	},
});

export const SmartLink = ({ url }: { url: string }): React.JSX.Element => (
	<Box xcss={styles.smartLinkContainerStyles}>
		<LinkRenderType url={url} />
	</Box>
);
