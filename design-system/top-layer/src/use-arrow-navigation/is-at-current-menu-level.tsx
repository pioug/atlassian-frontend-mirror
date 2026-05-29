const menuScope = '[role="menu"]';

/**
 * Returns true if the element belongs to the current menu level of the
 * container, i.e. it is NOT inside a nested `role="menu"` sub-container.
 *
 * Uses `element.closest('[role="menu"]')` to determine the nearest menu
 * scope. If the nearest scope is the container's own `role="menu"` element,
 * the element belongs to this level. If it is a different (nested) menu,
 * the element belongs to a child level and should be excluded.
 *
 * Supports two container patterns:
 *
 * **1. Container has `role="menu"` directly** (preferred, used by avatar-group):
 *   ```
 *   <div ref={containerRef} role="menu">
 *     <button role="menuitem" />   ← isAtCurrentMenuLevel → true
 *     <div role="menu">            ← nested sub-menu
 *       <button role="menuitem" /> ← isAtCurrentMenuLevel → false
 *     </div>
 *   </div>
 *   ```
 *   Uses the simple check: `element.closest('[role="menu"]') === container`
 *
 * **2. Container is a wrapper without `role="menu"`** (used by dropdown-menu,
 *   where `MenuGroup` owns `role="menu"` but does not accept a ref):
 *   ```
 *   <div ref={containerRef}>         ← wrapper (no role="menu")
 *     <MenuGroup role="menu">
 *       <button role="menuitem" />   ← isAtCurrentMenuLevel → true
 *       <div role="menu">            ← nested sub-menu
 *         <button role="menuitem" /> ← isAtCurrentMenuLevel → false
 *       </div>
 *     </MenuGroup>
 *   </div>
 *   ```
 *   Falls back to walking the DOM to check that the element's closest
 *   `role="menu"` is the container's own menu (not doubly nested).
 *
 * Ideally all consumers should use pattern 1 (place the ref directly on the
 * `role="menu"` element). Pattern 2 exists because `@atlaskit/menu`'s
 * `MenuGroup` does not currently accept a ref. If `MenuGroup` gains ref
 * support in the future, dropdown-menu should switch to pattern 1 and the
 * fallback path can be removed.
 *
 * Used both as a `TFocusableFilter` (to scope getNextFocusable etc.) and as
 * a guard to prevent parent menu handlers from acting on events that
 * belong to a nested menu.
 */
export function isAtCurrentMenuLevel(element: Element, container: HTMLElement): boolean {
	const closestMenu = element.closest(menuScope);

	// Container itself has role="menu". Element belongs to this level
	// if its closest menu is the container.
	if (container.getAttribute('role') === 'menu') {
		return closestMenu === container;
	}

	// Container is a wrapper without role="menu" (e.g. dropdown-menu
	// wraps a MenuGroup). The element belongs to the top level if its
	// closest role="menu" ancestor is a direct child of the container,
	// i.e. there is no nested role="menu" between them.
	if (closestMenu === null) {
		return true;
	}

	// Walk up from the closest menu to see if it is "owned" by this
	// container without passing through another role="menu" first.
	let parent = closestMenu.parentElement;
	while (parent && parent !== container) {
		if (parent.getAttribute('role') === 'menu') {
			// There is a parent menu between the closest menu and the
			// container, so the element is in a nested sub-menu.
			return false;
		}
		parent = parent.parentElement;
	}

	// The closest menu is directly inside the container (no nesting).
	return parent === container;
}
