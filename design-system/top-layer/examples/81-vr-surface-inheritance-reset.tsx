/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, type ReactNode, useRef, useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';
import { Popover } from '@atlaskit/top-layer/popover';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';

const LONG_TEXT = 'Another done with a long name that will be truncated';

const styles = cssMap({
	page: {
		paddingBlockStart: token('space.400'),
		paddingInlineEnd: token('space.400'),
		paddingBlockEnd: token('space.400'),
		paddingInlineStart: token('space.400'),
	},
	/**
	 * Simulates a mount context that sets `white-space: nowrap` — e.g. an
	 * `@atlaskit/select` option row (`control-option.tsx`). Because the top-layer
	 * popover renders inline in the DOM (no portal), its content inherits this
	 * `nowrap` unless the `Popover` primitive resets it.
	 */
	nowrapAncestor: {
		whiteSpace: 'nowrap',
	},
	/**
	 * A bounded content surface (like `TooltipContainer`, `max-width: 240px`).
	 * With the surface reset, the long text wraps inside this box; without it,
	 * the inherited `nowrap` lays the text on one line that spills past the box.
	 */
	content: {
		maxWidth: '240px',
		backgroundColor: token('color.background.neutral.bold'),
		borderRadius: token('radius.small', '3px'),
		color: token('color.text.inverse'),
		font: token('font.body.small'),
		overflowWrap: 'break-word',
		paddingBlockStart: token('space.050'),
		paddingBlockEnd: token('space.050'),
		paddingInlineStart: token('space.075'),
		paddingInlineEnd: token('space.075'),
	},
});

/**
 * Regression guard for the top-layer surface reset. The trigger + popover are
 * nested inside a `white-space: nowrap` ancestor. The expected rendering is that
 * the long content still WRAPS inside the 240px surface (the `Popover` reset
 * neutralises the inherited `nowrap`). If the reset regresses, the text renders
 * on a single line and overflows the box.
 */
export default function VrSurfaceInheritanceReset(): ReactNode {
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen] = useState(true);

	useAnchorPosition({
		anchorRef: triggerRef,
		popoverRef,
		placement: { axis: 'inline', edge: 'end' },
		isOpen,
	});

	return (
		<div css={styles.page}>
			<div css={styles.nowrapAncestor}>
				<Fragment>
					<button ref={triggerRef} type="button">
						trigger inside nowrap
					</button>
					<Popover
						ref={popoverRef}
						role="tooltip"
						label="Surface inheritance reset"
						isOpen={isOpen}
						onClose={() => setIsOpen(false)}
					>
						<div css={styles.content}>{LONG_TEXT}</div>
					</Popover>
				</Fragment>
			</div>
		</div>
	);
}
