import { useContext } from 'react';

import { TopNavElementContext, type TopNavBreakpoints } from './top-nav-element-context';

/**
 * Private breakpoint state for React rendering (overflow and responsive buttons).
 * Presentation is handled by TopNav container queries, independently of this hook.
 * Returns null outside TopNav or when platform-dst-chat-panel-layout is disabled.
 * SSR and initial hydration use the expanded presentation. Measurements are published
 * in a transition so suspended navigation can finish hydrating without losing its
 * server DOM. All consumers share one observer on TopNav.
 */
export function useTopNavBreakpoints(): TopNavBreakpoints | null {
	return useContext(TopNavElementContext);
}
