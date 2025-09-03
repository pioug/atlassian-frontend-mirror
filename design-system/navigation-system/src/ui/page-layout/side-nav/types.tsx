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
	| {
			desktop: 'expanded';
			mobile: 'expanded';
			flyout: 'closed';
			lastTrigger: SideNavTrigger | null;
	  }
	| {
			desktop: 'expanded';
			mobile: 'collapsed';
			flyout: 'closed';
			lastTrigger: SideNavTrigger | null;
	  }
	| {
			desktop: 'collapsed';
			mobile: 'expanded';
			flyout: 'closed';
			lastTrigger: SideNavTrigger | null;
	  }
	| {
			desktop: 'collapsed';
			mobile: 'expanded';
			flyout: 'open';
			lastTrigger: SideNavTrigger | null;
	  }
	| {
			desktop: 'collapsed';
			mobile: 'expanded';
			flyout: 'triggered-animate-close';
			lastTrigger: SideNavTrigger | null;
	  }
	| {
			desktop: 'collapsed';
			mobile: 'collapsed';
			flyout: 'closed';
			lastTrigger: SideNavTrigger | null;
	  }
	| {
			desktop: 'collapsed';
			mobile: 'collapsed';
			flyout: 'open';
			lastTrigger: SideNavTrigger | null;
	  }
	| {
			desktop: 'collapsed';
			mobile: 'collapsed';
			flyout: 'triggered-animate-close';
			lastTrigger: SideNavTrigger | null;
	  };

/**
 * The type of trigger that caused the side nav to be toggled.
 * - `click-outside-on-mobile` - toggled by clicking outside of the side nav (mobile only)
 * - `double-click` - toggled by double clicking on the side nav panel splitter
 * - `keyboard` - toggled by a keyboard action
 * - `programmatic` - toggled by a custom action, this is the default value when using the `useToggleSideNav` hook without specifying a trigger
 * - `screen-resize` - toggled by a screen resize action
 * - `skip-link` - toggled by a skip link action
 * - `toggle-button` - toggled by the `SideNavToggleButton` component
 */
export type SideNavTrigger =
	| 'click-outside-on-mobile'
	| 'double-click'
	| 'keyboard'
	| 'programmatic'
	| 'screen-resize'
	| 'skip-link'
	| 'toggle-button';
