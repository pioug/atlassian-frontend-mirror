/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useEffect, useRef } from 'react';

import { cssMap, jsx } from '@compiled/react';

import type { StrictXCSSProp } from '@atlaskit/css';
import { OpenLayerObserver } from '@atlaskit/layering/experimental/open-layer-observer';

import { SkipLinksProvider } from '../../context/skip-links/skip-links-provider';
import { TopNavStartProvider } from '../../context/top-nav-start/top-nav-start-context-provider';

import { DangerouslyHoistSlotSizes } from './hoist-slot-sizes-context';
import { SideNavElementProvider } from './side-nav/element-context';
import { IsSideNavShortcutEnabledProvider } from './side-nav/is-side-nav-shortcut-enabled-context';
import { SideNavToggleButtonProvider } from './side-nav/toggle-button-provider';
import { SideNavVisibilityProvider } from './side-nav/visibility-provider';

// ID of the root element that the banner and top bar slots hoist their sizes to. Only internally exported.
export const gridRootId = 'unsafe-design-system-page-layout-root';

const styles = cssMap({
	root: {
		display: 'grid',
		minHeight: '100vh',
		gridTemplateAreas: `
            "banner"
            "top-bar"
            "main"
            "aside"
       `,
		gridTemplateColumns: 'minmax(0, 1fr)',
		gridTemplateRows: 'auto auto 1fr auto',
		'@media (min-width: 64rem)': {
			gridTemplateAreas: `
            "banner banner banner"
            "top-bar top-bar top-bar"
            "side-nav main aside"
       `,
			gridTemplateRows: 'auto auto 3fr',
			gridTemplateColumns: 'auto minmax(0,1fr) auto',
		},
		// Panel is only shown as a separate column on large viewports
		'@media (min-width: 90rem)': {
			gridTemplateAreas: `
                "banner banner banner banner"
                "top-bar top-bar top-bar top-bar"
                "side-nav main aside panel"
           `,
			gridTemplateRows: 'auto auto 3fr',
			gridTemplateColumns: 'auto minmax(0,1fr) auto auto',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'> :not([data-layout-slot])': {
			// This hides any non-layout components that would otherwise be added to an implicit grid
			// track and break the page layout grid in unexpected and hilarious ways. Adding anything
			// as a child to page layout that is not a layout component is not supported.
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			display: 'none !important',
		},
	},
});

/**
 * The root component of the navigation system. It wraps the underlying components with the necessary contexts allowing to use certain data and hooks
 * @param skipLinksLabel - The very first element of the layout is a skip links container that can be accessed by pressing Tab button and holds the links to the other sections of the layout thus improving accessibility. This parameter defines the header text for this container
 */
export function Root({
	children,
	xcss,
	UNSAFE_dangerouslyHoistSlotSizes = false,
	skipLinksLabel = 'Skip to:',
	testId,
	defaultSideNavCollapsed,
	isSideNavShortcutEnabled = false,
}: {
	/**
	 * For rendering the layout areas, e.g. TopNav, SideNav, Main.
	 * They should be rendered as immediate children.
	 */
	children: React.ReactNode;
	/**
	 * Bounded style overrides.
	 */
	xcss?: StrictXCSSProp<'backgroundColor', never>;
	/**
	 * **Note: This prop is only supported for legacy purposes in Jira and Confluence,
	 * and is subject to be removed without notice in the future.**
	 *
	 * Whether to dangerously hoist the layout slot sizes to the document root element,
	 * to support some legacy use cases. Do not use this prop for new code.
	 */
	UNSAFE_dangerouslyHoistSlotSizes?: boolean;
	/**
	 * The header text for the skip links container element.
	 */
	skipLinksLabel?: string;
	/**
	 * A unique string that appears as data attribute `data-testid` in the rendered code, serving as a hook for automated tests.
	 */
	testId?: string;
	/**
	 * Whether the side nav should be collapsed by default __on desktop screens__.
	 *
	 * It is always collapsed by default for mobile screens.
	 *
	 * This value is used when the side nav is first mounted, but you should continuously update your
	 * persisted state using the `onCollapse` and `onExpand` callbacks, to ensure it is up to date
	 * when the app is reloaded.
	 *
	 * __Note:__ When provided, the `defaultCollapsed` props on `SideNav` and `SideNavToggleButton` will be ignored.
	 */
	defaultSideNavCollapsed?: boolean;

	/**
	 * Controls whether the side nav toggle shortcut is enabled. This will be used to bind the keyboard event listener,
	 * and to display the keyboard shortcuts in the appropriate tooltips (`SideNavToggleButton`, `SideNavPanelSplitter`).
	 *
	 * The shortcut key is `Ctrl` + `[`.
	 *
	 * The shortcut is not enabled by default.
	 *
	 * The shortcut will also be ignored if there are any open ADS modal dialogs (`@atlaskit/modal-dialog`).
	 *
	 * `SideNav` has another prop `canToggleWithShortcut()` that can be used to run additional checks after the shortcut
	 * is pressed, before the SideNav is toggled. You can use this to conditionally disable the shortcut based on your
	 * your own custom checks, e.g. if there is a legacy dialog open.
	 *
	 * Note: The built-in keyboard shortcut is behind `useIsFhsEnabled`.
	 */
	isSideNavShortcutEnabled?: boolean;
}) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (process.env.NODE_ENV !== 'production') {
			const IGNORED_ELEMENTS = ['SCRIPT', 'STYLE'];

			if (ref.current) {
				Array.from(ref.current.children).forEach((child) => {
					if (
						!IGNORED_ELEMENTS.includes(child.tagName) &&
						!child.hasAttribute('data-layout-slot')
					) {
						// eslint-disable-next-line no-console
						console.error(
							`Page Layout Error

This element has been forcibly hidden:

`,
							child,
							`

An element was rendered as a child of the page layout root that isn't a page layout component! Resolve this error by moving it into a page layout component.

This message will not be displayed in production.
`,
						);
					}
				});
			}
		}
	}, []);

	return (
		<SideNavVisibilityProvider defaultCollapsed={defaultSideNavCollapsed}>
			<SideNavToggleButtonProvider>
				<SideNavElementProvider>
					<IsSideNavShortcutEnabledProvider isSideNavShortcutEnabled={isSideNavShortcutEnabled}>
						<TopNavStartProvider>
							<OpenLayerObserver>
								<DangerouslyHoistSlotSizes.Provider value={UNSAFE_dangerouslyHoistSlotSizes}>
									<SkipLinksProvider label={skipLinksLabel} testId={testId}>
										<div
											ref={ref}
											css={styles.root}
											className={xcss}
											id={gridRootId}
											data-testid={testId}
										>
											{children}
										</div>
									</SkipLinksProvider>
								</DangerouslyHoistSlotSizes.Provider>
							</OpenLayerObserver>
						</TopNavStartProvider>
					</IsSideNavShortcutEnabledProvider>
				</SideNavElementProvider>
			</SideNavToggleButtonProvider>
		</SideNavVisibilityProvider>
	);
}
