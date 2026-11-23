/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';
import { isAtCurrentMenuLevel } from '@atlaskit/top-layer/is-at-current-menu-level';
import { Popover } from '@atlaskit/top-layer/popover/popover';
import { useAnchoredPopover } from '@atlaskit/top-layer/use-anchored-popover';
import { useArrowNavigation } from '@atlaskit/top-layer/use-arrow-navigation/use-arrow-navigation';

const styles = cssMap({
	root: {
		display: 'flex',
		gap: token('space.100'),
		paddingBlock: token('space.400'),
		paddingInline: token('space.400'),
	},
	menu: {
		display: 'flex',
		flexDirection: 'column',
		paddingBlock: token('space.050'),
		backgroundColor: token('elevation.surface.overlay'),
		boxShadow: token('elevation.shadow.overlay'),
	},
});

/**
 * Test fixture: a menu of animated `manual` popovers that closes on Tab, as `DropdownMenu` does. Tab
 * in the menu or its nested menu closes both in `flushSync`, in the `keydown` listener of
 * `useArrowNavigation`. `Popover` returns focus to the trigger before the browser acts on the Tab,
 * so the Tab moves on from the trigger (to "After", or "Before" for Shift+Tab), as for an `auto`
 * popover.
 *
 * See `notes/decisions/wrappers-ask-first-close.md` ("Focus return").
 */
export default function TestingManualMenuTabExit(): JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const [isNestedOpen, setIsNestedOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);
	const nestedTriggerRef = useRef<HTMLButtonElement>(null);
	const nestedMenuRef = useRef<HTMLDivElement>(null);

	const closeAll = useCallback(() => {
		flushSync(() => {
			setIsNestedOpen(false);
			setIsOpen(false);
		});
	}, []);
	const openNested = useCallback(() => {
		setIsNestedOpen(true);
	}, []);

	useArrowNavigation({
		containerRef: menuRef,
		onClose: closeAll,
		onNestedOpen: openNested,
		isEnabled: isOpen,
		filter: isAtCurrentMenuLevel,
	});
	useArrowNavigation({
		containerRef: nestedMenuRef,
		onClose: closeAll,
		isEnabled: isNestedOpen,
		filter: isAtCurrentMenuLevel,
	});
	useAnchoredPopover({
		anchorRef: triggerRef,
		popoverRef: menuRef,
		placement: { axis: 'block', edge: 'end' },
		isOpen,
	});
	useAnchoredPopover({
		anchorRef: nestedTriggerRef,
		popoverRef: nestedMenuRef,
		placement: { axis: 'inline', edge: 'end' },
		isOpen: isNestedOpen,
	});

	return (
		<div css={styles.root}>
			<button type="button" data-testid="before">
				Before
			</button>
			<button
				ref={triggerRef}
				type="button"
				data-testid="trigger"
				aria-haspopup="menu"
				aria-expanded={isOpen}
				onClick={() => setIsOpen(!isOpen)}
			>
				Options
			</button>
			<Popover
				ref={menuRef}
				mode="manual"
				isOpen={isOpen}
				role="menu"
				label="Options"
				shouldAnimate
			>
				<div css={styles.menu}>
					<button type="button" role="menuitem" data-testid="item">
						Move
					</button>
					<button
						ref={nestedTriggerRef}
						type="button"
						role="menuitem"
						data-testid="nested-trigger"
						aria-haspopup="menu"
						aria-expanded={isNestedOpen}
						onClick={openNested}
					>
						More
					</button>
					<Popover
						ref={nestedMenuRef}
						mode="manual"
						isOpen={isNestedOpen}
						role="menu"
						label="More"
						shouldAnimate
					>
						<div css={styles.menu}>
							<button type="button" role="menuitem" data-testid="nested-item">
								Archive
							</button>
						</div>
					</Popover>
				</div>
			</Popover>
			<button type="button" data-testid="after">
				After
			</button>
		</div>
	);
}
