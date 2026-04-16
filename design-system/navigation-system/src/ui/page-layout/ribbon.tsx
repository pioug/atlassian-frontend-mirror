/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useContext } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { media } from '@atlaskit/primitives/responsive';

import { localSlotLayers, UNSAFE_ribbonVar } from './constants';
import { DangerouslyHoistCssVarToDocumentRoot } from './dangerously-hoist-css-var-to-document-root';
import { DangerouslyHoistSlotSizes } from './hoist-slot-sizes-context';
import type { CommonSlotProps } from './types';
import { useLayoutId } from './use-layout-id';

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
