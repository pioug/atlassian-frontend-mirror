import React from 'react';

// import { css } from '@compiled/react';

// import { cssMap, cx, jsx } from '@atlaskit/css';
// import { Anchor, Box, Text } from '@atlaskit/primitives/compiled';
// import { token } from '@atlaskit/tokens';

import { SideInsertPanel } from '../src/ui/SideInsertPanel';

// const styles = cssMap({
// 	container: {
// 		marginTop: token('space.200'),
// 		marginRight: token('space.200'),
// 		marginBottom: token('space.200'),
// 		marginLeft: token('space.200'),
// 		paddingTop: token('space.200'),
// 		paddingRight: token('space.200'),
// 		paddingBottom: token('space.200'),
// 		paddingLeft: token('space.200'),
// 	},
// 	selected: {
// 		backgroundColor: token('color.background.selected'),
// 		borderColor: token('color.border.selected'),
// 		color: token('color.text.selected'),
// 		'&:hover': {
// 			backgroundColor: token('color.background.selected.hovered'),
// 		},
// 	},
// 	unselected: {
// 		borderColor: token('color.border'),
// 		'&:hover': {
// 			backgroundColor: token('color.background.neutral.hovered'),
// 		},
// 	},
// 	progressBarContainer: {
// 		marginTop: token('space.200'),
// 		marginLeft: 0,
// 		marginRight: 0,
// 		marginBottom: 0,
// 		paddingTop: token('space.200'),
// 		paddingRight: token('space.200'),
// 		paddingBottom: token('space.200'),
// 		paddingLeft: token('space.200'),
// 		color: token('color.text'),
// 	},
// });

// const progressBarStyles = css({
// 	marginLeft: token('space.100'),
// });

// NOTE: You can still use raw `css` from `@compiled/react` if you need to.
// In this case, we use it because `borderRadius` doesn't match our interface.
// const containerWithBorder = css({
// 	borderStyle: 'solid',
// 	borderWidth: token('border.width.outline'),
// 	borderRadius: '8px',
// });

const SidePanelWrapper = () => {
	return <SideInsertPanel />;
};

export default function SideInsertPanelExample() {
	return <SidePanelWrapper />;
}
