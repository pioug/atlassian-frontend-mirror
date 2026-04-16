/**
 * Shared test helpers for teams-app-internal-navigation unit tests.
 */
import type React from 'react';

import type { NavigationContext } from '../../src/common/utils/getNavigationProps';

/**
 * Returns a NavigationContext populated with safe defaults. Pass overrides for the fields relevant to each test case.
 */
export function createMockContext(overrides: Partial<NavigationContext> = {}): NavigationContext {
	return {
		navigate: jest.fn(),
		openPreviewPanel: jest.fn(),
		...overrides,
	};
}

/**
 * Type for overrides to the default mouse event.
 */
type MouseEventOverrides = Partial<{
	button: number;
	metaKey: boolean;
	altKey: boolean;
	ctrlKey: boolean;
	shiftKey: boolean;
	defaultPrevented: boolean;
	preventDefault: jest.Mock;
}>;

/**
 * Returns a synthetic React mouse event. All modifier keys and special flags default to falsy; pass overrides for the specific scenario under test.
 * Use the generic to get the correct element type (e.g. createMouseEvent<HTMLAnchorElement>()) so no type assertions are needed at call sites.
 */
export function createMouseEvent<T extends HTMLElement = HTMLElement>(
	overrides: MouseEventOverrides = {},
): React.MouseEvent<T> {
	return {
		button: 0,
		metaKey: false,
		altKey: false,
		ctrlKey: false,
		shiftKey: false,
		defaultPrevented: false,
		preventDefault: jest.fn(),
		...overrides,
	} as unknown as React.MouseEvent<T>;
}

/**
 * Asserts that the given link props describe an external link, ie. `target="_blank"` and `rel="noopener noreferrer"`.
 */
export function expectExternalLinkBehaviour(props: { target?: string; rel?: string }): void {
	expect(props.target).toBe('_blank');
	expect(props.rel).toBe('noopener noreferrer');
}

/**
 * Asserts that the given link props describe an internal same-tab link, ie. `target="_self"` and no `rel` attribute.
 */
export function expectInternalLinkBehaviour(props: { target?: string; rel?: string }): void {
	expect(props.target).toBe('_self');
	expect(props.rel).toBeUndefined();
}

/**
 * Simulates a plain left-click via the provided onClick handler and asserts that SPA navigation (`context.navigate`) was invoked with the expected path.
 */
export function expectRouterNavigationUsed<T extends HTMLElement = HTMLElement>(
	onClick: ((e: React.MouseEvent<T>) => void) | undefined,
	context: NavigationContext,
	expectedPath: string,
): void {
	const event = createMouseEvent<T>();
	onClick?.(event);
	expect(context.navigate).toHaveBeenCalledWith(expectedPath);
	expect(event.preventDefault).toHaveBeenCalled();
}

/**
 * Simulates a plain left-click via the provided onClick handler and asserts that SPA navigation (`context.navigate`) was NOT invoked.
 */
export function expectRouterNavigationNotUsed<T extends HTMLElement = HTMLElement>(
	onClick: ((e: React.MouseEvent<T>) => void) | undefined,
	context: NavigationContext,
): void {
	const event = createMouseEvent<T>();
	onClick?.(event);
	if (context.navigate) {
		expect(context.navigate).not.toHaveBeenCalled();
	}
}
