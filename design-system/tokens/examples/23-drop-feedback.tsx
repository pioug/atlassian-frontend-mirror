/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { JSX } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import DragHandleVerticalIcon from '@atlaskit/icon/core/drag-handle-vertical';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	container: {
		paddingBlockStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingBlockEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
		backgroundColor: token('elevation.surface'),
		color: token('color.text'),
	},
	region: {
		paddingBlockStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingBlockEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
		borderStyle: 'solid',
		borderWidth: token('border.width.selected'),
		borderColor: token('color.border'),
		borderRadius: token('radius.small'),
	},
	accepting: {
		backgroundColor: token('color.background.droptarget'),
		borderColor: token('color.border.dropindicator'),
	},
	blocked: { borderColor: token('color.border.dropindicator.warning') },
	reserved: { backgroundColor: token('color.background.neutral') },
	selected: {
		backgroundColor: token('color.background.selected'),
		borderColor: token('color.border.selected'),
	},
	insertion: {
		borderBlockStartWidth: token('border.width.selected'),
		borderBlockStartStyle: 'solid',
		borderBlockStartColor: token('color.border.dropindicator'),
	},
	handle: {
		display: 'inline-flex',
		paddingBlockStart: token('space.050'),
		paddingInlineEnd: token('space.050'),
		paddingBlockEnd: token('space.050'),
		paddingInlineStart: token('space.050'),
		backgroundColor: token('color.background.draghandle'),
		borderRadius: token('radius.small'),
	},
});

// Static color-role illustration, not a replacement for maintained PDD indicators.
export default function DropFeedbackExample(): JSX.Element {
	return (
		<div css={styles.container}>
			<Stack space="space.200">
				<strong>Drag-and-drop color roles</strong>
				<div css={styles.region}>Ordinary area: no active destination feedback</div>
				<div css={[styles.region, styles.selected]}>Selected item: persistent selection</div>
				<div css={[styles.region, styles.accepting]}>
					<Stack space="space.100">
						<span>Active eligible receiving area</span>
						<div css={styles.insertion} />
						<span>Insert before this item</span>
					</Stack>
				</div>
				<div css={[styles.region, styles.blocked]}>Blocked drop: no accepting fill</div>
				<div css={[styles.region, styles.reserved]}>Reserved space only</div>
				<div>
					<span css={styles.handle}>
						<DragHandleVerticalIcon
							label="Filled drag handle"
							size="small"
							color={token('color.icon.inverse')}
						/>
					</span>
				</div>
			</Stack>
		</div>
	);
}
