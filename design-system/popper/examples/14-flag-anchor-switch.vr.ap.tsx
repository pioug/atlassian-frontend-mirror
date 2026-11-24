/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { Popper } from '@atlaskit/popper/main';
import { token } from '@atlaskit/tokens';

/**
 * The popper opens on anchor A. "show on B" changes `referenceElement` to
 * anchor B while the popper stays open, and the popper must move to B.
 */
const styles = cssMap({
	root: {
		paddingBlock: token('space.200'),
		paddingInline: token('space.200'),
	},
	anchors: {
		display: 'flex',
		gap: token('space.800'),
		marginBlockStart: token('space.200'),
	},
	anchor: {
		display: 'inline-block',
		paddingBlock: token('space.075'),
		paddingInline: token('space.150'),
		backgroundColor: token('color.background.neutral'),
		borderColor: token('color.border'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		borderRadius: token('radius.small'),
	},
	surface: {
		backgroundColor: token('color.background.neutral.bold'),
		color: token('color.text.inverse'),
		paddingBlock: token('space.075'),
		paddingInline: token('space.150'),
		borderRadius: token('radius.small'),
		font: token('font.body.small'),
	},
});

export default function FlagAnchorSwitch(): React.JSX.Element {
	// State, not refs, so the Popper re-renders when the anchors mount.
	const [anchorA, setAnchorA] = useState<HTMLElement | null>(null);
	const [anchorB, setAnchorB] = useState<HTMLElement | null>(null);
	const [isOnB, setIsOnB] = useState(false);

	const reference = (isOnB ? anchorB : anchorA) ?? undefined;

	return (
		<div css={styles.root}>
			<button type="button" data-testid="show-b" onClick={() => setIsOnB(true)}>
				show on B
			</button>
			<div css={styles.anchors}>
				<span ref={(node) => setAnchorA(node)} data-testid="anchor-a" css={styles.anchor}>
					anchor A
				</span>
				<span ref={(node) => setAnchorB(node)} data-testid="anchor-b" css={styles.anchor}>
					anchor B
				</span>
			</div>
			<Popper referenceElement={reference} placement="bottom-start">
				{({ ref, style }) => (
					<div ref={ref} data-testid="popper" css={styles.surface} style={style}>
						attached popover
					</div>
				)}
			</Popper>
		</div>
	);
}
