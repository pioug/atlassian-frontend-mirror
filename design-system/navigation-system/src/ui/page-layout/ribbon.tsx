/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useContext } from 'react';

import { cssMap, jsx } from '@compiled/react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- TODO: migrate to @atlaskit/primitives/compiled
import { media } from '@atlaskit/primitives/responsive';

import { UNSAFE_ribbonVar } from './constants';
import type { localSlotLayers as LocalSlotLayersType } from './constants';
import { DangerouslyHoistCssVarToDocumentRoot } from './dangerously-hoist-css-var-to-document-root';
import { DangerouslyHoistSlotSizes } from './hoist-slot-sizes-context';
import type { CommonSlotProps } from './types';
import { useLayoutId } from './use-layout-id';
const localSlotLayersStatic = {
	ribbon: 4,
	// The side nav panel splitter is layered above the top nav when FHS is enabled.
	// It has the same z-index value, but is rendered after the top nav in the DOM so is stacked above.
	sideNavPanelSplitterFHS: 4,
	topBar: 4,
	banner: 4,
	// When FHS is enabled, the side nav is layered below the top nav,
	// but above the panel
	bannerFHS: 3,
	topNavFHS: 3,
	sideNav: 2,
	panelSmallViewports: 1,
} satisfies typeof LocalSlotLayersType;

const styles = cssMap({
	root: {
		gridArea: 'ribbon',
		height: '100%',
		insetBlockStart: 0,
		// Using sticky positioning to align with other layout slots
		// which use it to support mobile breakpoints when the body becomes scrollable.
		// Not necessary for Ribbon, but using it for consistency.
		position: 'sticky',
		boxSizing: 'border-box',
		overflow: 'hidden',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
		zIndex: localSlotLayersStatic.ribbon,
		display: 'none',
		'@media (min-width: 64rem)': {
			display: 'initial',
		},
	},
});

type RibbonProps = CommonSlotProps & {
	// Allowing width to be configured during MVP phase
	// TODO: reconsider this API after MVP, and once specs are more final
	width: string | number;
	children: React.ReactNode;
};

export function UNSAFE_Ribbon({
	children,
	testId,
	id: providedId,
	width = '0px',
}: RibbonProps): JSX.Element | null {
	const id = useLayoutId({ providedId });

	const dangerouslyHoistSlotSizes = useContext(DangerouslyHoistSlotSizes);

	return (
		<div id={id} data-layout-slot css={[styles.root]} style={{ width }} data-testid={testId}>
			{dangerouslyHoistSlotSizes && (
				// ------ START UNSAFE STYLES ------
				// These styles are needed for the UNSAFE legacy use case for Jira + Confluence.
				// But also for the panel resizing constraint to work correctly.
				<DangerouslyHoistCssVarToDocumentRoot
					variableName={UNSAFE_ribbonVar}
					mediaQuery={media.above.md}
					value="0px"
					responsiveValue={width}
				/>
				// ------ END UNSAFE STYLES ------
			)}

			{children}
		</div>
	);
}
