/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties, useContext, useEffect, useRef, useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import type { StrictXCSSProp } from '@atlaskit/css';
import usePreviousValue from '@atlaskit/ds-lib/use-previous-value';
import { media } from '@atlaskit/primitives/responsive';

import { useSkipLinkInternal } from '../../context/skip-links/skip-links-context';

import {
	asidePanelSplitterId,
	asideVar,
	contentHeightWhenFixed,
	contentInsetBlockStart,
	UNSAFE_asideLayoutVar,
} from './constants';
import { DangerouslyHoistSlotSizes } from './hoist-slot-sizes-context';
import { DangerouslyHoistCssVarToDocumentRoot } from './hoist-utils';
import { useLayoutId } from './id-utils';
import { PanelSplitterProvider } from './panel-splitter/provider';
import type { ResizeBounds } from './panel-splitter/types';
import type { CommonSlotProps } from './types';
import { useResizingWidthCssVarOnRootElement } from './use-resizing-width-css-var-on-root-element';

const panelSplitterResizingVar = '--n_asdRsz';
/**
 * The bounds for Aside and Panel are purposely set to support the current usage in Jira.
 *
 * Jira sets the slot's width to `0px` when there is no active content to display in it.
 *   - This means the min width needs to support `0px`.
 * The Conversation Assistant component in Jira (rendered in a nav3 RightSidebar, or a nav4 Aside) has a custom resizing
 * implementation, which has a maximum width of `50vw`.
 *   - This means the max width needs to support `50vw`.
 *
 * This is not the final implementation and will be updated once Jira's usage has been fixed.
 * Ticket to track this is: https://jplat.atlassian.net/browse/BLU-3951
 *
 * We're using two different bounds for each slot here, to support the `0px` min width when programatically set using the
 * `defaultWidth` prop, and another one that is used when resizing the slots which has a sensible min width.
 */
const asideWidthSlotBounds: ResizeBounds = { min: '0px', max: '50vw' };
const asideWidthResizeBounds: ResizeBounds = { min: '120px', max: '50vw' };

function getResizeBounds() {
	return asideWidthResizeBounds;
}

const styles = cssMap({
	root: {
		gridArea: 'aside',
		boxSizing: 'border-box',
		position: 'relative',
		'@media (min-width: 64rem)': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			width: `var(${panelSplitterResizingVar}, var(${asideVar}))`,
			justifySelf: 'end',
		},
	},
	inner: {
		// This sets the sticky point to be just below top bar + banner. It's needed to ensure the stick
		// point is exactly where this element is rendered to with no wiggle room. Unfortunately the CSS
		// spec for sticky doesn't support "stick to where I'm initially rendered" so we need to tell it.
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
		insetBlockStart: contentInsetBlockStart,
		overflow: 'auto',
		// We want the direct child of the "aside" grid item to also take up the full height of the grid item.
		// An example use case is for consumers to add a border that takes up the full height of the aside slot.
		height: '100%',
		'@media (min-width: 64rem)': {
			// Height is set so it takes up all of the available viewport space minus top bar + banner.
			// This is only set on larger viewports meaning stickiness only occurs on them.
			// On small viewports it is not sticky.
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			height: contentHeightWhenFixed,
			position: 'sticky',
		},
	},
});

/**
 * The Aside is rendered to the right (inline end) of the Main area.
 *
 * You can optionally render a `PanelSplitter` as a child to make the aside area resizable.
 */
export function Aside({
	children,
	xcss,
	defaultWidth = 330,
	label = 'Aside',
	skipLinkLabel = label,
	testId,
	id: providedId,
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
	 * Bounded style overrides.
	 */
	xcss?: StrictXCSSProp<'backgroundColor', never>;
	/**
	 * The default width of the layout area.
	 *
	 * It should be between the resize bounds - the minimum is 120px and the maximum is 50% of the viewport width.
	 */
	defaultWidth?: number;
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
	const previousWidthProp = usePreviousValue(defaultWidth);

	/**
	 * Updates the width state based on changes to `defaultWidth`.
	 * This is temporary and needed to support the current usage in Jira, and will be removed once it is no longer needed.
	 * https://jplat.atlassian.net/browse/BLU-3951
	 */
	useEffect(() => {
		setWidth(defaultWidth);
	}, [defaultWidth]);

	// Putting the warning in a separate effect to avoid adding `previousWidthProp` as an effect dependency when updating width.
	useEffect(() => {
		if (process.env.NODE_ENV !== 'production') {
			if (previousWidthProp !== undefined && defaultWidth !== previousWidthProp) {
				// eslint-disable-next-line no-console
				console.warn(
					'Page Layout warning\n\n',
					'The value of the `defaultWidth` prop on the `Aside` layout slot component has changed. This should not be changed after the component has been mounted.\n\n',
					'In the future, changes to the `defaultWidth` prop will not be respected. It is only supported as a stopgap to enable migration from Nav3 to Nav4.\n\n',
				);
			}
		}
	}, [defaultWidth, previousWidthProp]);

	const asideVariableWidth = `clamp(${asideWidthSlotBounds.min}, ${width}px, ${asideWidthSlotBounds.max})`;

	useResizingWidthCssVarOnRootElement({
		isEnabled: dangerouslyHoistSlotSizes,
		panelId: asidePanelSplitterId,
		cssVar: panelSplitterResizingVar,
	});

	return (
		<aside
			id={id}
			data-layout-slot
			aria-label={label}
			css={styles.root}
			className={xcss}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop, @atlaskit/ui-styling-standard/no-imported-style-values
			style={{ [asideVar]: asideVariableWidth } as CSSProperties}
			data-testid={testId}
			ref={ref}
		>
			{dangerouslyHoistSlotSizes && (
				// ------ START UNSAFE STYLES ------
				// These styles are only needed for the UNSAFE legacy use case for Jira + Confluence.
				// When they aren't needed anymore we can delete them wholesale.
				<DangerouslyHoistCssVarToDocumentRoot
					variableName={UNSAFE_asideLayoutVar}
					value="0px"
					mediaQuery={media.above.md}
					responsiveValue={`var(${panelSplitterResizingVar}, ${asideVariableWidth})`}
				/>
				// ------ END UNSAFE STYLES ------
			)}
			<PanelSplitterProvider
				panelId={asidePanelSplitterId}
				panelRef={ref}
				panelWidth={width}
				onCompleteResize={setWidth}
				getResizeBounds={getResizeBounds}
				resizingCssVar={panelSplitterResizingVar}
				position="start"
			>
				{/**
				 * Fixed styles are added here rather than on the `aside` container element, so that the panel splitter
				 * component can overflow out of the `Aside` container, to increase the interactive grab area
				 */}
				<div css={styles.inner} data-testid={testId ? `${testId}--inner` : undefined}>
					{children}
				</div>
			</PanelSplitterProvider>
		</aside>
	);
}
