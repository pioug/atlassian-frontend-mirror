import React, { type ReactNode, type Ref } from 'react';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Flex } from '@atlaskit/primitives/compiled/flex';
import { token } from '@atlaskit/tokens';

const timeWrapperStyles = cssMap({
	root: {
		position: 'absolute',
		insetInline: token('space.0'),
		top: token('space.negative.200'),
		marginTop: token('space.0'),
		marginInline: token('space.0'),
		marginBottom: token('space.0'),
	},
});

const timebarWrapperStyles = cssMap({
	root: {
		position: 'relative',
		width: '100%',
	},
});

const layoutStyles = cssMap({
	root: {
		position: 'relative',
		width: '100%',
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
	},
});

// The timeline over the left and right controls. Shared by the viewer footer and the fullscreen footer.
export const ControlsLayout = ({
	videoControlsWrapperRef,
	timeline,
	left,
	right,
}: {
	videoControlsWrapperRef?: Ref<HTMLDivElement>;
	timeline: ReactNode;
	left: ReactNode;
	right: ReactNode;
}): React.JSX.Element => (
	<Box ref={videoControlsWrapperRef} xcss={layoutStyles.root}>
		<Box xcss={timeWrapperStyles.root}>{timeline}</Box>
		<Flex alignItems="center" justifyContent="space-between" xcss={timebarWrapperStyles.root}>
			{left}
			{right}
		</Flex>
	</Box>
);
