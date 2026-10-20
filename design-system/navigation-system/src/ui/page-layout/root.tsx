/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useEffect, useRef } from 'react';

import { cssMap, jsx } from '@compiled/react';

import type { StrictXCSSProp } from '@atlaskit/css';
import { OpenLayerObserver } from '@atlaskit/layering/open-layer-observer';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { SkipLinksProvider } from '../../context/skip-links/skip-links-provider';
import { TopNavStartProvider } from '../../context/top-nav-start/top-nav-start-context-provider';
import type { mainMinimumWidthVar } from './constants';
import { DangerouslyHoistSlotSizes } from './hoist-slot-sizes-context';
import { LayoutAreaSizingProvider } from './layout-area-sizing-provider';
import { IsSideNavShortcutEnabledProvider } from './side-nav/is-side-nav-shortcut-enabled-provider';
import { SideNavElementProvider } from './side-nav/side-nav-element-provider';
import { SideNavToggleButtonProvider } from './side-nav/toggle-button-provider';
import { SideNavVisibilityProvider } from './side-nav/visibility-provider';

// ID of the root element that the banner and top bar slots hoist their sizes to. Only internally exported.
export const gridRootId = 'unsafe-design-system-page-layout-root';
export const gridRootFitId: string = `${gridRootId}-fit`;
export const gridRootChatFitId: string = `${gridRootId}-chat-fit`;

const styles = cssMap({
	widthContainer: {
		containerType: 'inline-size',
		containerName: 'navigation-layout-width',
		width: '100%',
	},
	mainSpace: {
		'--n_layoutW': '100cqw',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Shared layout CSS variable name.
		['--n_mainMinW' satisfies typeof mainMinimumWidthVar]: '20rem',
		containerType: 'inline-size',
		containerName: 'navigation-main-space',
		boxSizing: 'content-box',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Shared layout CSS variable name.
		width: `max(0px, calc(var(--n_layoutW) - var(${'--n_mainMinW' satisfies typeof mainMinimumWidthVar}) - var(--n_fitAside, 0px) - var(--n_fitRibbon, 0px) - var(--n_fitPanel, 0px)))`,
	},
	chatSpace: {
		'--n_fitNav': '0px',
		containerType: 'inline-size',
		containerName: 'navigation-chat-space',
		width: 'max(0px, calc(100% - var(--n_fitNav)))',
	},
	legacyRoot: {
		display: 'grid',
		minHeight: '100vh',
		gridTemplateAreas: `"banner" "top-bar" "main" "aside"`,
		gridTemplateColumns: 'minmax(0, 1fr)',
		gridTemplateRows: 'auto auto 1fr auto',
		'@media (min-width: 64rem)': {
			gridTemplateAreas: `"banner banner banner banner" "ribbon top-bar top-bar top-bar" "ribbon side-nav main aside"`,
			gridTemplateRows: 'auto auto 3fr',
			gridTemplateColumns: 'auto auto minmax(0,1fr) auto',
		},
		'@media (min-width: 90rem)': {
			gridTemplateAreas: `"banner banner banner banner banner" "ribbon top-bar top-bar top-bar top-bar" "ribbon side-nav main aside panel"`,
			gridTemplateRows: 'auto auto 3fr',
			gridTemplateColumns: 'auto auto minmax(0,1fr) auto auto',
		},
	},
	root: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Shared layout CSS variable name.
		['--n_mainMinW' satisfies typeof mainMinimumWidthVar]: '20rem',
		display: 'grid',
		minHeight: '100vh',
		width: 'var(--n_layoutW)',
		gridTemplateAreas: `
            "banner"
            "top-bar"
            "main"
            "aside"
       `,
		gridTemplateColumns: 'minmax(0, 1fr)',
		gridTemplateRows: 'auto auto 1fr auto',
		// ChatPanel is inline once it and Main can both fit at their minimum widths.
		'@media (min-width: 40rem)': {
			gridTemplateAreas: `
                "banner banner"
                "top-bar chat-panel"
                "main chat-panel"
                "aside chat-panel"
           `,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Shared layout CSS variable name.
			gridTemplateColumns: `minmax(var(${'--n_mainMinW' satisfies typeof mainMinimumWidthVar}), 1fr) var(--n_chatTrack, 0px)`,
		},
		// There is no ribbon grid area below 64rem. SideNav is inline from this breakpoint.
		'@media (min-width: 64rem)': {
			gridTemplateAreas: `
                "banner banner banner banner banner"
                "ribbon top-bar top-bar top-bar chat-panel"
                "ribbon side-nav main aside chat-panel"
           `,
			gridTemplateRows: 'auto auto 3fr',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Shared layout CSS variable name.
			gridTemplateColumns: `auto auto minmax(var(${'--n_mainMinW' satisfies typeof mainMinimumWidthVar}), 1fr) auto var(--n_chatTrack, 0px)`,
		},
		// The legacy navigation-system Panel keeps its existing large-viewport grid area.
		'@media (min-width: 90rem)': {
			gridTemplateAreas: `
                "banner banner banner banner banner banner"
                "ribbon top-bar top-bar top-bar top-bar chat-panel"
                "ribbon side-nav main aside panel chat-panel"
           `,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Shared layout CSS variable name.
			gridTemplateColumns: `auto auto minmax(var(${'--n_mainMinW' satisfies typeof mainMinimumWidthVar}), 1fr) auto auto var(--n_chatTrack, 0px)`,
		},
	},
	// Hides any non-layout components that would otherwise be added to an implicit grid track and
	// break the page layout grid in unexpected and hilarious ways. Adding anything as a child to
	// page layout that is not a layout component is not supported.
	safetyRail: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'> :not([data-layout-slot])': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			display: 'none !important',
		},
	},
	// Used when the `platform-dst-top-layer` feature gate is on. Widens the safety-rail guard to
	// allow `dialog` and `[popover]` as direct children of Root. They do not impact the CSS grid
	// of Root because they are rendered in the top layer when open, and are `display: none` per
	// the UA stylesheet when closed.
	safetyRailWithTopLayer: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'> :not([data-layout-slot]):not(dialog):not([popover])': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			display: 'none !important',
		},
	},
	// used when the `platform-dst-motion-uplift-panel` feature gate is on. Ensures the panel does not cause
	// scroll bars to appear when panel transforms off screen.
	// `overflow: clip` is used instead of `overflow: hidden` because `overflow: hidden` creates a new scroll
	// container, which breaks `position: sticky` on descendants such as the Aside slot's inner element.
	// `overflow: clip` clips content without creating a scroll container, preserving sticky positioning.
	panelUplift: {
		overflow: 'clip',
	},
});

function LayoutFitContainers({ children }: { children: React.ReactNode }) {
	// CSS cannot use custom properties in a size-query condition. Query the
	// remaining capacity instead: these wrappers subtract configured minimums
	// and occupied tracks, while the actual grid keeps its original host width.
	return (
		<div css={styles.widthContainer} data-layout-width-container="">
			{/* Resolve query units before the nested capacity containers change their meaning. */}
			{/* A fixed literal only: React 18 otherwise HTML-escapes the CSS syntax during SSR. */}
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles, react/no-danger */}
			<style
				dangerouslySetInnerHTML={{
					__html: `@property --n_layoutW { syntax: '<length>'; inherits: true; initial-value: 0px; }`,
				}}
			/>
			<div css={styles.mainSpace} id={gridRootFitId}>
				<div css={styles.chatSpace} id={gridRootChatFitId}>
					{children}
				</div>
			</div>
		</div>
	);
}

/**
 * The root component of the navigation system. It wraps the underlying components with the necessary contexts allowing to use certain data and hooks
 * @param skipLinksLabel - The very first element of the layout is a skip links container that can be accessed by pressing Tab button and holds the links to the other sections of the layout thus improving accessibility. This parameter defines the header text for this container
 */
export function Root({
	children,
	xcss,
	UNSAFE_dangerouslyHoistSlotSizes = false,
	skipLinksLabel = fg('platform_dst_nav4_skip_link_a11y_1') ? 'Skip to' : 'Skip to:',
	skipLinksTriggerLabel = 'Skip to',
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
	 * The label for the skip links button that opens the skip links popup.
	 */
	skipLinksTriggerLabel?: string;
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
	 * The built-in keyboard shortcut is available whenever this prop is enabled.
	 */
	isSideNavShortcutEnabled?: boolean;
}): JSX.Element {
	const ref = useRef<HTMLDivElement>(null);
	const isChatPanelLayoutEnabled = fg('platform-dst-chat-panel-layout');
	const LayoutProvider = isChatPanelLayoutEnabled ? LayoutAreaSizingProvider : React.Fragment;
	const WidthContainer = isChatPanelLayoutEnabled ? LayoutFitContainers : React.Fragment;

	useEffect(() => {
		if (process.env.NODE_ENV !== 'production') {
			const IGNORED_ELEMENTS = ['SCRIPT', 'STYLE'];

			const topLayerGateOn = fg('platform-dst-top-layer');

			if (ref.current) {
				Array.from(ref.current.children).forEach((child) => {
					// Top-layer elements are allowed as direct children when the gate is on.
					const isTopLayerElement =
						topLayerGateOn &&
						(child.tagName.toLowerCase() === 'dialog' || child.hasAttribute('popover'));

					if (
						!IGNORED_ELEMENTS.includes(child.tagName) &&
						!child.hasAttribute('data-layout-slot') &&
						!isTopLayerElement
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
							<LayoutProvider {...(isChatPanelLayoutEnabled ? { layoutRef: ref } : {})}>
								<OpenLayerObserver>
									<DangerouslyHoistSlotSizes.Provider value={UNSAFE_dangerouslyHoistSlotSizes}>
										<SkipLinksProvider
											label={skipLinksLabel}
											triggerLabel={skipLinksTriggerLabel}
											testId={testId}
										>
											<WidthContainer>
												<div
													ref={ref}
													css={[
														isChatPanelLayoutEnabled ? styles.root : styles.legacyRoot,
														fg('platform-dst-motion-uplift-panel') && styles.panelUplift,
														fg('platform-dst-top-layer')
															? styles.safetyRailWithTopLayer
															: styles.safetyRail,
													]}
													className={xcss}
													id={gridRootId}
													data-testid={testId}
												>
													{children}
												</div>
											</WidthContainer>
										</SkipLinksProvider>
									</DangerouslyHoistSlotSizes.Provider>
								</OpenLayerObserver>
							</LayoutProvider>
						</TopNavStartProvider>
					</IsSideNavShortcutEnabledProvider>
				</SideNavElementProvider>
			</SideNavToggleButtonProvider>
		</SideNavVisibilityProvider>
	);
}
