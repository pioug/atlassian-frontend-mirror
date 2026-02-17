/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useContext } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { media } from '@atlaskit/primitives/responsive';

import { localSlotLayers, UNSAFE_ribbonVar } from './constants';
import { DangerouslyHoistSlotSizes } from './hoist-slot-sizes-context';
import { DangerouslyHoistCssVarToDocumentRoot } from './hoist-utils';
import { useLayoutId } from './id-utils';
import type { CommonSlotProps } from './types';

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
		zIndex: localSlotLayers.ribbon,
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

export function UNSAFE_Ribbon({ children, testId, id: providedId, width = '0px' }: RibbonProps) {
	const id = useLayoutId({ providedId });

	const dangerouslyHoistSlotSizes = useContext(DangerouslyHoistSlotSizes);

	if (!fg('platform_dst_nav4_ribbon_slot')) {
		return null;
	}

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
