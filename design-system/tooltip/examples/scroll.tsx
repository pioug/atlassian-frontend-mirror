import React from 'react';

import { cssMap, cx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { Target } from './styled';

const parentBaseStyles = cssMap({
	root: {
		borderRadius: token('radius.small'),
		marginBottom: token('space.100', '8px'),
		height: '80px',
		paddingTop: token('space.100', '8px'),
		paddingRight: token('space.100', '8px'),
		paddingBottom: token('space.100', '8px'),
		paddingLeft: token('space.100', '8px'),
	},
});

const parentScrollStyles = cssMap({
	horizontal: {
		overflowX: 'scroll',
	},
	vertical: {
		overflowY: 'scroll',
	},
	nested: {
		overflow: 'scroll',
	},
});

const shimStyles = cssMap({
	horizontal: {
		display: 'flex',
		justifyContent: 'space-between',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		width: '200%' as 'auto',
		flexDirection: 'row',
	},
	vertical: {
		display: 'flex',
		justifyContent: 'space-between',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		height: '200%' as 'auto',
		flexDirection: 'column',
	},
});

export default function ScrollExample() {
	return (
		<Box>
			<Box
				backgroundColor="elevation.surface.sunken"
				xcss={cx(parentBaseStyles.root, parentScrollStyles.horizontal)}
			>
				<Box xcss={shimStyles.horizontal}>
					<p>
						Horizontal &mdash; scroll <strong>right</strong> to see the target.
					</p>
					<Tooltip content={'Scroll "horizontal"'}>
						{(tooltipProps) => (
							<Target color="green" {...tooltipProps}>
								Horizontal
							</Target>
						)}
					</Tooltip>
				</Box>
			</Box>
			<Box
				backgroundColor="elevation.surface.sunken"
				xcss={cx(parentBaseStyles.root, parentScrollStyles.vertical)}
			>
				<Box xcss={shimStyles.vertical}>
					<p>
						Vertical &mdash; scroll <strong>down</strong> to see the target.
					</p>
					<Tooltip content={'Scroll "vertical"'}>
						{(tooltipProps) => (
							<Target color="yellow" {...tooltipProps}>
								Vertical
							</Target>
						)}
					</Tooltip>
				</Box>
			</Box>
			<Box
				backgroundColor="elevation.surface.sunken"
				xcss={cx(parentBaseStyles.root, parentScrollStyles.horizontal)}
			>
				<Box xcss={shimStyles.horizontal}>
					<p>
						Nested &mdash; scroll <strong>right</strong> to see the target.
					</p>
					<Box
						backgroundColor="elevation.surface.overlay"
						xcss={cx(parentBaseStyles.root, parentScrollStyles.vertical)}
					>
						<Box xcss={shimStyles.vertical}>
							<p>
								Scroll <strong>down</strong> to see the target.
							</p>
							<Tooltip content={'Scroll "nested"'}>
								{(tooltipProps) => (
									<Target color="red" {...tooltipProps}>
										Nested
									</Target>
								)}
							</Tooltip>
						</Box>
					</Box>
				</Box>
			</Box>
		</Box>
	);
}
