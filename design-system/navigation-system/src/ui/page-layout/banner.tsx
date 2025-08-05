/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useContext } from 'react';

import { cssMap, jsx } from '@compiled/react';

import type { StrictXCSSProp } from '@atlaskit/css';

import { useSkipLinkInternal } from '../../context/skip-links/skip-links-context';

import { bannerMountedVar, localSlotLayers, UNSAFE_bannerVar } from './constants';
import { DangerouslyHoistSlotSizes } from './hoist-slot-sizes-context';
import { DangerouslyHoistCssVarToDocumentRoot, HoistCssVarToLocalGrid } from './hoist-utils';
import { useLayoutId } from './id-utils';
import type { CommonSlotProps } from './types';

const styles = cssMap({
	root: {
		gridArea: 'banner',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
		height: `var(${bannerMountedVar})`,
		insetBlockStart: 0,
		position: 'sticky',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		zIndex: localSlotLayers.banner,
		overflow: 'hidden',
	},
});

/**
 * The banner layout area. It will always be displayed at the top of the screen.
 *
 * Should be used to render a `Banner` component from `@atlaskit/banner`.
 */
export function Banner({
	children,
	xcss,
	// 48px has been chosen to align with the height of the Banner component from `@atlaskit/banner`.
	height = 48,
	skipLinkLabel = 'Banner',
	testId,
	id: providedId,
}: CommonSlotProps & {
	/**
	 * The content of the layout area.
	 * Should include a Banner component from `@atlaskit/banner`.
	 */
	children: React.ReactNode;
	/**
	 * Bounded style overrides.
	 */
	xcss?: StrictXCSSProp<'backgroundColor', never>;
	/**
	 * The height of the layout area.
	 *
	 * Defaults to 48px.
	 */
	height?: number;
}) {
	const dangerouslyHoistSlotSizes = useContext(DangerouslyHoistSlotSizes);
	const id = useLayoutId({ providedId });

	/**
	 * Don't show the skip link if the slot has 0 height.
	 */
	useSkipLinkInternal({
		id,
		label: skipLinkLabel,
		isHidden: height === 0,
	});

	return (
		/**
		 * Intentionally not using `role="banner"` because each page should only have one `banner` landmark,
		 * and the top bar is more suitable as the `banner` landmark.
		 */
		<div id={id} data-layout-slot css={styles.root} className={xcss} data-testid={testId}>
			<HoistCssVarToLocalGrid variableName={bannerMountedVar} value={height} />
			{dangerouslyHoistSlotSizes && (
				// ------ START UNSAFE STYLES ------
				// These styles are only needed for the UNSAFE legacy use case for Jira + Confluence.
				// When they aren't needed anymore we can delete them wholesale.
				<DangerouslyHoistCssVarToDocumentRoot variableName={UNSAFE_bannerVar} value={height} />
				// ------ END UNSAFE STYLES ------
			)}
			{children}
		</div>
	);
}
