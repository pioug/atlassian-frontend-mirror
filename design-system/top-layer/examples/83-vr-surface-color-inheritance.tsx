/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode, useRef, useState } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';
import { Popover } from '@atlaskit/top-layer/popover';
import { PopoverSurface } from '@atlaskit/top-layer/popover-surface';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';

const styles = cssMap({
	// A coloured ancestor region (for example a danger banner). Inline top-layer
	// content is still a DOM child of its trigger for CSS inheritance, so without a
	// surface-level colour the popover text would inherit this red `color`.
	region: {
		color: token('color.text.danger'),
		backgroundColor: token('color.background.danger'),
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		minHeight: '240px',
		paddingBlockStart: token('space.1000'),
		paddingInlineEnd: token('space.1000'),
		paddingBlockEnd: token('space.1000'),
		paddingInlineStart: token('space.1000'),
	},
	// Padding only. Deliberately sets no `color` so the rendered text colour is
	// determined purely by inheritance, which makes `PopoverSurface`'s own text
	// colour the thing under test.
	content: {
		paddingBlockStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingBlockEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
		maxWidth: '260px',
	},
});

/**
 * Baseline for the surface text-colour default: a `PopoverSurface` opened from a
 * trigger inside a red (danger) region. Its text should render in the default
 * overlay text colour, not the inherited red, because `PopoverSurface` establishes
 * its own `color` alongside the overlay background.
 */
export function VrSurfaceColourInheritance(): ReactNode {
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen] = useState(true);

	useAnchorPosition({
		anchorRef: triggerRef,
		popoverRef,
		placement: { edge: 'end' },
		isOpen,
	});

	return (
		<div css={styles.region}>
			<button ref={triggerRef} type="button">
				Trigger inside a red region
			</button>
			<Popover
				ref={popoverRef}
				role="dialog"
				label="Surface colour inheritance"
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
			>
				<PopoverSurface>
					<div css={styles.content}>
						Surface text stays the default overlay colour and does not inherit the red ancestor
						colour.
					</div>
				</PopoverSurface>
			</Popover>
		</div>
	);
}

export default function VrSurfaceColourInheritanceExample(): ReactNode {
	return <VrSurfaceColourInheritance />;
}
