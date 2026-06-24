/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useLayoutEffect, useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { Popper } from '@atlaskit/popper';
import { token } from '@atlaskit/tokens';

/**
 * FF-on anchor toggle example. The popper's `referenceElement` cycles
 * `anchorA` → `null` → `anchorB`, exercising the `isOpen` derivation
 * and the per-activation latch in `useAnchorPositionAtPoint` /
 * `useAnchorPosition`. The surface must reposition over `anchorB`
 * after the cycle, not stay at `anchorA`'s former position.
 */
const styles = cssMap({
	root: {
		position: 'relative',
		display: 'flex',
		gap: token('space.400'),
		alignItems: 'center',
		paddingBlock: token('space.200'),
		paddingInline: token('space.200'),
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
	controls: {
		marginBlockStart: token('space.200'),
		display: 'flex',
		gap: token('space.100'),
	},
});

type TStage = 'anchorA' | 'closed' | 'anchorB';

export default function FlagAnchorToggle(): React.JSX.Element {
	// Publish the anchor elements through state so the Popper re-renders
	// once the refs are populated (first render sees `null`).
	const [anchorA, setAnchorA] = useState<HTMLElement | null>(null);
	const [anchorB, setAnchorB] = useState<HTMLElement | null>(null);

	const [stage, setStage] = useState<TStage>('anchorA');

	// Default to anchor A as soon as it is published.
	useLayoutEffect(() => {
		if (anchorA && stage === 'anchorA') {
			// Force a re-render so Popper picks up the resolved anchor.
			setStage('anchorA');
		}
	}, [anchorA, stage]);

	function resolveAnchor(): HTMLElement | undefined {
		if (stage === 'anchorA') {
			return anchorA ?? undefined;
		}
		if (stage === 'anchorB') {
			return anchorB ?? undefined;
		}
		return undefined;
	}

	return (
		<div>
			<div css={styles.root}>
				<span ref={(node) => setAnchorA(node)} data-testid="anchor-a" css={styles.anchor}>
					anchor A
				</span>
				<span ref={(node) => setAnchorB(node)} data-testid="anchor-b" css={styles.anchor}>
					anchor B
				</span>
			</div>
			<div css={styles.controls}>
				<button type="button" data-testid="show-a" onClick={() => setStage('anchorA')}>
					show on A
				</button>
				<button type="button" data-testid="close" onClick={() => setStage('closed')}>
					close
				</button>
				<button type="button" data-testid="show-b" onClick={() => setStage('anchorB')}>
					show on B
				</button>
			</div>
			<Popper referenceElement={resolveAnchor()} placement="bottom-start">
				{({ ref, style }) => (
					<div ref={ref} data-testid="popper" css={styles.surface} style={style}>
						attached popover
					</div>
				)}
			</Popper>
		</div>
	);
}
