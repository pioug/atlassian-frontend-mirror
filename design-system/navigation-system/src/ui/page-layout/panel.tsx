/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties, useCallback, useContext, useEffect, useRef, useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import type { StrictXCSSProp } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';
import { media } from '@atlaskit/primitives/responsive';
import { token } from '@atlaskit/tokens';

import { useSkipLinkInternal } from '../../context/skip-links/skip-links-context';

import {
	contentHeightWhenFixed,
	contentInsetBlockStart,
	localSlotLayers,
	panelPanelSplitterId,
	panelVar,
	sideNavLiveWidthVar,
	UNSAFE_panelLayoutVar,
} from './constants';
import { DangerouslyHoistSlotSizes } from './hoist-slot-sizes-context';
import { DangerouslyHoistCssVarToDocumentRoot } from './hoist-utils';
import { useLayoutId } from './id-utils';
import { PanelSplitterProvider } from './panel-splitter/provider';
import type { ResizeBounds } from './panel-splitter/types';
import { useSideNavRef } from './side-nav/element-context';
import type { CommonSlotProps } from './types';
import { useResizingWidthCssVarOnRootElement } from './use-resizing-width-css-var-on-root-element';

const panelSplitterResizingVar = '--n_pnlRsz';

/**
 * We typically use the `defaultWidth` as the minimum resizing width,
 * but for large default widths we fallback to a standard value.
 *
 * This standard value of `400px` is to align with the Global Preview Panels.
 */
const fallbackResizeMinWidth = 400;

const styles = cssMap({
	root: {
		gridArea: 'main / aside / aside / aside',
		justifySelf: 'end',
		boxSizing: 'border-box',
		// On small viewports the panel is displayed above other slots so we set its zindex.
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
		zIndex: localSlotLayers.panelSmallViewports,
		// Height is set so it takes up all of the available viewport space minus top bar + banner.
		// Since panel is always rendered ontop of other grid items across all viewports height is
		// always set.
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
		height: contentHeightWhenFixed,
		position: 'sticky',
		// This sets the sticky point to be just below top bar + banner. It's needed to ensure the stick
		// point is exactly where this element is rendered to with no wiggle room. Unfortunately the CSS
		// spec for sticky doesn't support "stick to where I'm initially rendered" so we need to tell it.
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
		insetBlockStart: contentInsetBlockStart,
		backgroundColor: token('elevation.surface.overlay'),
		'@media (min-width: 48rem)': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			width: `var(${panelSplitterResizingVar}, var(${panelVar}))`,
		},
		'@media (min-width: 64rem)': {
			backgroundColor: token('elevation.surface'),
		},
		'@media (min-width: 90rem)': {
			gridArea: 'panel',
			// On large viewports the panel is displayed next to other slots so we reset the zindex.
			zIndex: 'auto',
		},
	},
	border: {
		// We use a shadow when the panel is an overlay
		boxShadow: token('elevation.shadow.overlay'),
		// Not required, but declaring explicitly because we really don't want a border at small sizes
		// Previously we had a transparent border to maintain width, but this unintentionally acted as padding
		borderInlineStart: 'none',
		'@media (min-width: 64rem)': {
			// Hiding the box shadow because we are adding a border
			boxShadow: 'none',
			// We only want the border to be visible when it is not an overlay
			borderInlineStart: `1px solid ${token('color.border')}`,
		},
	},
	scrollContainer: {
		overflow: 'auto',
		height: '100%',
	},
	hidden: {
		/**
		 * TODO: remove this once the `width: 0` usage is removed from Jira.
		 * https://jplat.atlassian.net/browse/BLU-3951
		 *
		 * This is used to hide the panel when the `defaultWidth` is set to 0.
		 * To ensure a usable experience on small viewports, we're using `display: none` to hide the slot, instead of just using the `defaultWidth`
		 * value, so that small viewports still use our pre-defined static size. e.g. if the slot was resized to `150px`, we still want the width
		 * on small viewports to be our static value.
		 */
		display: 'none',
	},
	oldMobileWidth: {
		// For mobile viewports, the panel will take up 90% of the screen width, up to a maximum of 365px (the default Panel width).
		width: 'min(90%, 365px)',
	},
	newMobileWidth: {
		/**
		 * For mobile viewports, the panel will try to take the minimum width, but no larger than 90% of the screen width.
		 *
		 * The minimum width is derived from the default width of the panel.
		 *
		 * This ensures the panel:
		 *
		 * - only shrinks below its minimum width if the viewport is too small
		 * - is not forced to grow if it is smaller than `365px`
		 */
		width: 'min(90%, var(--minWidth))',
	},
});

/**
 * The Panel layout area is rendered to the right (inline end) of the Main area, or the Aside area if it is present.
 *
 * On small viewports (below 64rem, or 1024px), the Panel slot will become an overlay.
 *
 * You can optionally render a `PanelSplitter` as a child to make the panel area resizable.
 */
export function Panel({
	children,
	defaultWidth = 365,
	label = 'Panel',
	skipLinkLabel = label,
	testId,
	id: providedId,
	xcss,
	hasBorder = fg('platform_design_system_nav4_panel_default_border'),
}: CommonSlotProps & {
	/**
	 * The content of the layout area.
	 */
	children: React.ReactNode;
	/**
	 * The accessible name of the slot, announced by screen readers.
	 */
	label?: string;
	/**
	 * The default width of the layout area.
	 *
	 * It should be between the resize bounds - the minimum is 120px and the maximum is 50% of the viewport width.
	 *
	 * This value is also used as the minimum resizing width, except when the `defaultWidth` is greater then `400px`,
	 * in which case `400px` will be used as the minimum resizing width instead.
	 */
	defaultWidth?: number;
	/**
	 * Bounded style overrides.
	 */
	xcss?: StrictXCSSProp<'backgroundColor', never>;
	/**
	 * Whether or not the slot has its own border. On small screens this becomes a shadow.
	 *
	 * Defaults to the `platform_design_system_nav4_panel_default_border` gate.
	 * This will be `false` while we update app usage, eventually becoming `true`.
	 * Then this prop will be removed.
	 */
	hasBorder?: boolean;
}) {
	const dangerouslyHoistSlotSizes = useContext(DangerouslyHoistSlotSizes);
	const id = useLayoutId({ providedId });
	/**
	 * Don't show the skip link if the slot has 0 width.
	 *
	 * Remove `isHidden` usage after https://jplat.atlassian.net/browse/BLU-3951
	 */
	useSkipLinkInternal({
		id,
		label: skipLinkLabel,
		isHidden: defaultWidth === 0,
	});
	const ref = useRef<HTMLDivElement | null>(null);
	const [width, setWidth] = useState(defaultWidth);
	// Used to track the previous value of the `defaultWidth` prop, for logging dev warnings when it changes.
	const defaultWidthRef = useRef(defaultWidth);

	/**
	 * TODO: Remove this useEffect once the `width: 0` usage is removed from Jira.
	 * It updates the width state based on changes to `defaultWidth`, as a temporary stopgap to support Jira's current usage.
	 * https://jplat.atlassian.net/browse/BLU-3951
	 */
	useEffect(() => {
		if (defaultWidthRef.current === defaultWidth) {
			return;
		}

		defaultWidthRef.current = defaultWidth;
		setWidth(defaultWidth);

		if (process.env.NODE_ENV !== 'production') {
			// eslint-disable-next-line no-console
			console.warn(
				'Page Layout warning\n\n',
				'The value of the `defaultWidth` prop on the `Panel` layout slot component has changed. This should not be changed after the component has been mounted.\n\n',
				'In the future, changes to the `defaultWidth` prop will not be respected. It is only supported as a stopgap to enable migration from Nav3 to Nav4.\n\n',
			);
		}
	}, [defaultWidth]);

	const sideNavRef = useSideNavRef();

	/**
	 * The minimum width that the panel can be resized to by the user.
	 *
	 * We only use the `defaultWidth` up to a point to avoid huge panels.
	 */
	const minWidth = Math.min(defaultWidth, fallbackResizeMinWidth);

	/**
	 * Returns the bounds for resizing, evaluated lazily when needed.
	 *
	 * Defined separately to the slot bounds because the resizing bounds need to be resolvable to a pixel value,
	 * and the panel's slot bounds use a complex CSS expression.
	 */
	const getResizeBounds = useCallback((): ResizeBounds => {
		const sideNavWidth = sideNavRef.current?.offsetWidth ?? 0;
		/**
		 * The panel should not resize larger than the page content, equivalent to the `Main` + `Aside` slots.
		 *
		 * This maximum width is equivalent to half the viewport width, after removing the sidebar width.
		 */
		const maxWidth = Math.round((window.innerWidth - sideNavWidth) / 2);

		return { min: `${minWidth}px`, max: `${maxWidth}px` };
	}, [minWidth, sideNavRef]);

	const panelWidthSlotBounds = {
		min: `${minWidth}px`,
		// `sideNavLiveWidthVar` is not defined if the `SideNav` is not mounted, so we fallback to `0px`.
		max: `round(nearest, calc((100vw - var(${sideNavLiveWidthVar}, 0px)) / 2), 1px)`,
	};

	const panelVariableWidth = `clamp(${panelWidthSlotBounds.min}, ${width}px, ${panelWidthSlotBounds.max})`;

	useResizingWidthCssVarOnRootElement({
		isEnabled: dangerouslyHoistSlotSizes,
		cssVar: panelSplitterResizingVar,
		panelId: panelPanelSplitterId,
	});

	return (
		<section
			id={id}
			data-layout-slot
			aria-label={label}
			className={xcss}
			css={[
				styles.root,
				defaultWidth === 0 && styles.hidden,
				hasBorder && styles.border,
				fg('platform_design_system_nav4_panel_mobile_width_fix')
					? styles.newMobileWidth
					: styles.oldMobileWidth,
			]}
			style={
				{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop, @atlaskit/ui-styling-standard/no-imported-style-values
					[panelVar]: panelVariableWidth,
					'--minWidth': fg('platform_design_system_nav4_panel_mobile_width_fix')
						? `${minWidth}px`
						: undefined,
				} as CSSProperties
			}
			data-testid={testId}
			ref={ref}
		>
			{dangerouslyHoistSlotSizes && (
				// ------ START UNSAFE STYLES ------
				// These styles are only needed for the UNSAFE legacy use case for Jira + Confluence.
				// When they aren't needed anymore we can delete them wholesale.
				<DangerouslyHoistCssVarToDocumentRoot
					variableName={UNSAFE_panelLayoutVar}
					value="0px"
					mediaQuery={media.above.lg}
					responsiveValue={`var(${panelSplitterResizingVar}, ${panelVariableWidth})`}
				/>
				// ------ END UNSAFE STYLES ------
			)}
			<PanelSplitterProvider
				panelId={panelPanelSplitterId}
				panelRef={ref}
				panelWidth={width}
				onCompleteResize={setWidth}
				getResizeBounds={getResizeBounds}
				resizingCssVar={panelSplitterResizingVar}
				position="start"
			>
				{/**
				 * Overflow scroll styles are added here rather than on the `section` container element, so that the panel splitter
				 * component can overflow out of the `Panel` container, to increase the interactive grab area
				 */}
				<div css={styles.scrollContainer}>{children}</div>
			</PanelSplitterProvider>
		</section>
	);
}
