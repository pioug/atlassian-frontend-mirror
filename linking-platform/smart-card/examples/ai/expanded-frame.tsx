import React from 'react';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import { ExpandedFrame } from '@atlaskit/smart-card/expanded-frame';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	container: {
		paddingTop: token('space.200'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.200'),
	},
});

export default function ExpandedFrameExample(): React.JSX.Element {
	return (
		<ExpandedFrame
			frameStyle="show"
			href="https://example.atlassian.net/wiki/spaces/EXAMPLE/pages/1"
			text="Project overview"
			setOverflow={true}
			allowScrollBar={true}
		>
			<Box xcss={styles.container}>Embedded resource content goes here.</Box>
		</ExpandedFrame>
	);
}
