/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useState } from 'react';

import { cssMap, cx, jsx } from '@atlaskit/css';
import { Label } from '@atlaskit/form';
import { AtlassianIcon } from '@atlaskit/logo';
import { useResizing } from '@atlaskit/motion/resizing';
import { Box, Inline } from '@atlaskit/primitives/compiled';
import Toggle from '@atlaskit/toggle';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	container: {
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: token('radius.xxlarge'),
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border'),
		backgroundColor: token('elevation.surface'),
		marginBlockStart: token('space.200'),
	},
	logo: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'column',
		fontWeight: token('font.weight.medium'),
		paddingBlockEnd: token('space.100'),
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
	},
	small: {
		height: '50px',
	},
	large: {
		height: '100px',
	},
});

const MotionResizingHeightNew = (): JSX.Element => {
	const [expand, setExpand] = useState(false);
	const toggleExpand = useCallback(() => {
		setExpand((expand) => !expand);
	}, []);

	const resizingProps = useResizing({
		dimension: 'height',
		duration: token('motion.duration.xxlong'),
		easing: token('motion.easing.out.practical'),
	});

	return (
		<Box>
			<Inline alignBlock="center">
				<Label htmlFor="inline-toggle-expand">Toggle expand</Label>
				<Toggle id="inline-toggle-expand" onChange={toggleExpand} />
			</Inline>
			<Box {...resizingProps} xcss={styles.container}>
				<Box xcss={cx(expand ? styles.large : styles.small, styles.logo)}>
					<AtlassianIcon size="medium" />
				</Box>
			</Box>
		</Box>
	);
};

export default MotionResizingHeightNew;
