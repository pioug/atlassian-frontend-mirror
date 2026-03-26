/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useRef, useState } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';
import { isAtCurrentMenuLevel, useArrowNavigation } from '@atlaskit/top-layer/use-arrow-navigation';

const styles = cssMap({
	menuItem: {
		paddingBlock: token('space.100'),
		paddingInline: token('space.150'),
		border: 'none',
		backgroundColor: 'transparent',
		cursor: 'pointer',
		textAlign: 'start',
		display: 'block',
		width: '100%',
	},
	nestedMenu: {
		display: 'flex',
		flexDirection: 'column',
		paddingBlock: token('space.050'),
		marginBlockStart: token('space.050'),
	},
	layout: {
		display: 'flex',
		gap: token('space.400'),
		paddingBlock: token('space.400'),
		paddingInline: token('space.400'),
	},
});

/**
 * Basic menu — flat list of items, no nesting.
 * Tests: ArrowDown, ArrowUp, Home, End, Tab, wrapping.
 */
function BasicMenu() {
	const [isOpen, setIsOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	const onClose = useCallback(() => setIsOpen(false), []);

	useArrowNavigation({
		containerRef: menuRef,
		onClose,
		isEnabled: isOpen,
	});

	return (
		<div>
			<button
				type="button"
				data-testid="basic-trigger"
				onClick={() => setIsOpen((prev) => !prev)}
				aria-expanded={isOpen}
				aria-haspopup={true}
			>
				Basic Menu
			</button>
			{isOpen && (
				<div ref={menuRef} role="menu" data-testid="basic-menu">
					<button type="button" role="menuitem" css={styles.menuItem} data-testid="basic-item-1">
						Item 1
					</button>
					<button type="button" role="menuitem" css={styles.menuItem} data-testid="basic-item-2">
						Item 2
					</button>
					<button type="button" role="menuitem" css={styles.menuItem} data-testid="basic-item-3">
						Item 3
					</button>
					<button type="button" role="menuitem" css={styles.menuItem} data-testid="basic-item-4">
						Item 4
					</button>
				</div>
			)}
		</div>
	);
}

/**
 * Nested menu — parent menu with a nested sub-menu.
 * Tests: filter=isAtCurrentMenuLevel, parent navigation scoped to current level.
 */
function NestedMenu() {
	const [isOpen, setIsOpen] = useState(false);
	const [isSubOpen, setIsSubOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	const subMenuRef = useRef<HTMLDivElement>(null);

	const onClose = useCallback(() => setIsOpen(false), []);
	const onSubClose = useCallback(() => setIsSubOpen(false), []);

	useArrowNavigation({
		containerRef: menuRef,
		onClose,
		isEnabled: isOpen,
		filter: isAtCurrentMenuLevel,
	});

	useArrowNavigation({
		containerRef: subMenuRef,
		onClose: onSubClose,
		isEnabled: isSubOpen,
		filter: isAtCurrentMenuLevel,
	});

	return (
		<div>
			<button
				type="button"
				data-testid="nested-trigger"
				onClick={() => setIsOpen((prev) => !prev)}
				aria-expanded={isOpen}
				aria-haspopup={true}
			>
				Nested Menu
			</button>
			{isOpen && (
				<div ref={menuRef} role="menu" data-testid="nested-menu">
					<button type="button" role="menuitem" css={styles.menuItem} data-testid="nested-item-1">
						Parent Item 1
					</button>
					<button
						type="button"
						role="menuitem"
						css={styles.menuItem}
						data-testid="nested-item-2"
						aria-haspopup={true}
						aria-expanded={isSubOpen}
						onClick={() => setIsSubOpen((prev) => !prev)}
					>
						Parent Item 2 (has sub-menu)
					</button>
					{isSubOpen && (
						<div ref={subMenuRef} role="menu" data-testid="nested-submenu" css={styles.nestedMenu}>
							<button type="button" role="menuitem" css={styles.menuItem} data-testid="sub-item-1">
								Sub Item 1
							</button>
							<button type="button" role="menuitem" css={styles.menuItem} data-testid="sub-item-2">
								Sub Item 2
							</button>
						</div>
					)}
					<button type="button" role="menuitem" css={styles.menuItem} data-testid="nested-item-3">
						Parent Item 3
					</button>
				</div>
			)}
		</div>
	);
}

/**
 * Menu with mixed focusable elements — buttons and a disabled button.
 * Tests: skips disabled elements.
 */
function MixedMenu() {
	const [isOpen, setIsOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	const onClose = useCallback(() => setIsOpen(false), []);

	useArrowNavigation({
		containerRef: menuRef,
		onClose,
		isEnabled: isOpen,
	});

	return (
		<div>
			<button
				type="button"
				data-testid="mixed-trigger"
				onClick={() => setIsOpen((prev) => !prev)}
				aria-expanded={isOpen}
				aria-haspopup={true}
			>
				Mixed Menu
			</button>
			{isOpen && (
				<div ref={menuRef} role="menu" data-testid="mixed-menu">
					<button type="button" role="menuitem" css={styles.menuItem} data-testid="mixed-item-1">
						Button Item
					</button>
					<button type="button" role="menuitem" css={styles.menuItem} data-testid="mixed-item-2">
						Another Button
					</button>
					<button
						type="button"
						role="menuitem"
						css={styles.menuItem}
						disabled
						data-testid="mixed-item-disabled"
					>
						Disabled Item
					</button>
					<button type="button" role="menuitem" css={styles.menuItem} data-testid="mixed-item-3">
						Last Button
					</button>
				</div>
			)}
		</div>
	);
}

export default function ArrowNavigationExample() {
	return (
		<div css={styles.layout}>
			<BasicMenu />
			<NestedMenu />
			<MixedMenu />
		</div>
	);
}
