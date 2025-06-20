/**
 * Using a union type to represent the possible states of the side nav.
 * The flyout cannot be open when the desktop side nav is expanded.
 *
 * The flyout can be in the following states:
 * - `open` - the flyout is open and visible
 * - `triggered-animate-close` - the flyout was just closed. This is used so we can only animate the sidebar collapsing, when the flyout was open and gets collapsed.
 * - `closed` - the flyout state is closed and not visible. This is the default state.
 */
export type SideNavState =
	| { desktop: 'expanded'; mobile: 'expanded'; flyout: 'closed' }
	| { desktop: 'expanded'; mobile: 'collapsed'; flyout: 'closed' }
	| { desktop: 'collapsed'; mobile: 'expanded'; flyout: 'closed' }
	| { desktop: 'collapsed'; mobile: 'expanded'; flyout: 'open' }
	| { desktop: 'collapsed'; mobile: 'expanded'; flyout: 'triggered-animate-close' }
	| { desktop: 'collapsed'; mobile: 'collapsed'; flyout: 'closed' }
	| { desktop: 'collapsed'; mobile: 'collapsed'; flyout: 'open' }
	| { desktop: 'collapsed'; mobile: 'collapsed'; flyout: 'triggered-animate-close' };
