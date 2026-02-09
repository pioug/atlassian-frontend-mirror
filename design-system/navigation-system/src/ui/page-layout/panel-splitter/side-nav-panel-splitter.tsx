import React, { type ReactNode, useContext, useEffect, useState } from 'react';

import invariant from 'tiny-invariant';

import { useOpenLayerObserver } from '@atlaskit/layering/experimental/open-layer-observer';
import { fg } from '@atlaskit/platform-feature-flags';

import { useIsFhsEnabled } from '../../fhs-rollout/use-is-fhs-enabled';
import {
	openLayerObserverSideNavNamespace,
	openLayerObserverTopNavEndNamespace,
	openLayerObserverTopNavMiddleNamespace,
	openLayerObserverTopNavStartNamespace,
	sideNavPanelSplitterId,
} from '../constants';
import { useToggleSideNav } from '../side-nav/use-toggle-side-nav';

import { OnDoubleClickContext, PanelSplitterContext } from './context';
import { PanelSplitter, type PanelSplitterProps } from './panel-splitter';

/**
 * Namespaces to check for open layers that would interfere with the panel splitter.
 *
 * Placed outside the component for stability, as the list is used as an effect dependency.
 */
const openLayerNamespacesToCheck = [
	// The side nav panel splitter is layered above the side nav, so needs to be disabled when there are open popups in the side nav.
	openLayerObserverSideNavNamespace,
	// The side nav panel splitter is layered above the top nav, so needs to be disabled when there are open popups in the top nav.
	openLayerObserverTopNavStartNamespace,
	openLayerObserverTopNavMiddleNamespace,
	openLayerObserverTopNavEndNamespace,
];

/**
 * Returns whether there are any open popups in the side nav or top nav
 */
function useHasOpenPopupsInSideNavOrTopNav(): boolean {
	const isFhsEnabled = useIsFhsEnabled();
	const openLayerObserver = useOpenLayerObserver();
	// Setting the initial state to false, as it is unlikely that there would be any open popups when the app starts.
	const [hasOpenPopups, setHasOpenPopups] = useState(false);

	useEffect(() => {
		if (!openLayerObserver || !isFhsEnabled || !fg('platform-dst-side-nav-layering-fixes')) {
			return;
		}

		function updateState(): void {
			if (!openLayerObserver) {
				return;
			}

			const hasAnyOpenLayers = openLayerNamespacesToCheck.some(
				(namespace) => openLayerObserver.getCount({ namespace, type: 'popup' }) > 0,
			);
			setHasOpenPopups(hasAnyOpenLayers);
		}

		// Initial check. We do this _in case_ a popup is already open when the component mounts.
		updateState();

		// Subscribe to each namespace
		const cleanups = openLayerNamespacesToCheck.map((namespace) =>
			openLayerObserver.onChange(updateState, { namespace }),
		);

		return function cleanupHook() {
			cleanups.forEach((cleanup) => cleanup());
		};
	}, [isFhsEnabled, openLayerObserver]);

	return hasOpenPopups;
}

type SideNavPanelSplitterProps = Omit<
	PanelSplitterProps,
	| 'onDoubleClick'
	// Omitting tooltipContent so we can add custom JSDocs
	| 'tooltipContent'
> & {
	/**
	 * Whether the side nav should collapse on double click.
	 *
	 * If not provided, it will default to `true`.
	 */
	shouldCollapseOnDoubleClick?: boolean;
	/**
	 * Displays a tooltip with the provided content. It is expected to be a string that explains the double click to collapse interaction.
	 *
	 * It will only be displayed if the `shouldCollapseOnDoubleClick` prop is `true`, or not provided (as it defaults to `true`).
	 *
	 * The `tooltipContent` will not be announced by screen readers because it pertains to the draggable element, which lacks keyboard functionality.
	 * Use the `label` prop to provide accessible information about the panel splitter.
	 *
	 * If the `isSideNavShortcutEnabled` prop is enabled on `<Root />`, the built-in keyboard shortcut will be displayed with the tooltip.
	 *
	 * Only used if `useIsFhsEnabled` is true.
	 */
	tooltipContent?: PanelSplitterProps['tooltipContent'];
};

/**
 * _SideNavPanelSplitter_
 *
 * A component that allows the user to resize or collapse the side nav.
 * It must be used within the `SideNav` layout area.
 *
 * Example usage:
 * ```tsx
 * <SideNav>
 *   <SideNavPanelSplitter label="Double click to collapse"  />
 * </SideNav>
 * ```
 */
export const SideNavPanelSplitter = ({
	label,
	onResizeStart,
	onResizeEnd,
	testId,
	shouldCollapseOnDoubleClick = true,
	tooltipContent,
}: SideNavPanelSplitterProps): ReactNode => {
	const context = useContext(PanelSplitterContext);
	invariant(
		context?.panelId === sideNavPanelSplitterId,
		'SideNavPanelSplitter must be rendered as a child of <SideNav />.',
	);
	const toggleSideNav = useToggleSideNav({ trigger: 'double-click' });
	const isFhsEnabled = useIsFhsEnabled();

	// The logic and state for disabling the panel splitter when there are open popups
	// in the side nav or top nav is being placed here, instead of in `SideNav`, to prevent
	// re-rendering the side nav anytime the number of open popups changes.
	const hasOpenLayersInSideNavOrTopNav = useHasOpenPopupsInSideNavOrTopNav();

	if (
		hasOpenLayersInSideNavOrTopNav &&
		isFhsEnabled &&
		fg('platform-dst-side-nav-layering-fixes')
	) {
		return null;
	}

	return (
		<OnDoubleClickContext.Provider value={shouldCollapseOnDoubleClick ? toggleSideNav : undefined}>
			<PanelSplitter
				label={label}
				onResizeStart={onResizeStart}
				onResizeEnd={onResizeEnd}
				testId={testId}
				tooltipContent={
					// Only displaying the tooltip if double click to collapse is enabled.
					// Otherwise, we would be displaying a tooltip with "Double click to collapse", when it actually won't.
					shouldCollapseOnDoubleClick ? tooltipContent : undefined
				}
			/>
		</OnDoubleClickContext.Provider>
	);
};
