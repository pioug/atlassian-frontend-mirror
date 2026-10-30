const menuSelector = '[role="menu"]';

/**
 * Walks up from `element` and returns `true` when it reaches `container` before any other
 * `role="menu"` element.
 */
function reachesContainerWithoutNestedMenu({
	element,
	container,
}: {
	element: Element | null;
	container: HTMLElement;
}): boolean {
	if (!element) {
		return false;
	}
	if (element === container) {
		return true;
	}
	if (element.getAttribute('role') === 'menu') {
		return false;
	}
	return reachesContainerWithoutNestedMenu({ element: element.parentElement, container });
}

/**
 * Returns `true` if the element belongs to the current menu level of the container, that is, it
 * is not inside a nested `role="menu"`.
 *
 * It uses `element.closest('[role="menu"]')` to find the nearest menu. If that menu is the menu of
 * the container, the element belongs to this level. If it is a nested menu, the element belongs to
 * a child level.
 *
 * It supports two container patterns:
 *
 * **1. The container has `role="menu"`** (preferred):
 *   ```
 *   <div ref={containerRef} role="menu">
 *     <button role="menuitem" />   ← isAtCurrentMenuLevel → true
 *     <div role="menu">            ← nested menu
 *       <button role="menuitem" /> ← isAtCurrentMenuLevel → false
 *     </div>
 *   </div>
 *   ```
 *   The check is `element.closest('[role="menu"]') === container`.
 *
 * **2. The container is a wrapper without `role="menu"`**, for example when the `role="menu"`
 *   element (such as a `MenuGroup` from `@atlaskit/menu`) does not accept a ref:
 *   ```
 *   <div ref={containerRef}>         ← wrapper (no role="menu")
 *     <MenuGroup role="menu">
 *       <button role="menuitem" />   ← isAtCurrentMenuLevel → true
 *       <div role="menu">            ← nested menu
 *         <button role="menuitem" /> ← isAtCurrentMenuLevel → false
 *       </div>
 *     </MenuGroup>
 *   </div>
 *   ```
 *   It walks up from the closest `role="menu"` of the element, and checks that it reaches the
 *   container before any other `role="menu"`. An element in no menu belongs to this level.
 *
 * Prefer pattern 1: put the ref on the `role="menu"` element. Use pattern 2 only when you cannot.
 *
 * Use it as a `TFocusableFilter` (for example the `filter` of `useArrowNavigation`). It scopes the
 * focusable elements, and it stops a parent menu from acting on keys that belong to a nested menu.
 */
export function isAtCurrentMenuLevel(element: Element, container: HTMLElement): boolean {
	const closestMenu = element.closest(menuSelector);

	// Pattern 1: the element belongs to this level if its closest menu is the container.
	if (container.getAttribute('role') === 'menu') {
		return closestMenu === container;
	}

	// Pattern 2: the container is a wrapper without `role="menu"`. An element in no menu belongs to
	// this level.
	if (closestMenu === null) {
		return true;
	}

	// Start from the parent, so the walk does not stop at `closestMenu` itself.
	return reachesContainerWithoutNestedMenu({ element: closestMenu.parentElement, container });
}
