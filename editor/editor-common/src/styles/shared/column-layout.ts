// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { gridMediumMaxWidth, layoutBreakpointWidth } from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

const columnLayoutSharedStyle = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'[data-layout-section]': {
		position: 'relative',
		display: 'flex',
		flexDirection: 'row',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& > *': {
			flex: 1,
			minWidth: 0,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& > .unsupportedBlockView-content-wrap': {
			minWidth: 'initial',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		[`@media screen and (max-width: ${gridMediumMaxWidth}px)`]: {
			flexDirection: 'column',
		},
	},
});

const columnLayoutResponsiveSharedStyle = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.layout-section-container': {
		containerType: 'inline-size',
		containerName: 'layout-area',

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-layout-section]': {
			display: 'grid',
			gap: token('space.200', '16px'),
			gridTemplateColumns: `repeat(auto-fit, minmax(0, 1fr))`,

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-container-queries, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
			[`@container layout-area (max-width:${layoutBreakpointWidth.MEDIUM - 1}px) and (min-width: ${layoutBreakpointWidth.SMALL}px)`]:
				{
					gridTemplateColumns: `repeat(1, 1fr)`,

					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
					'&[data-layout-columns="4"], &[data-layout-columns="5"]': {
						gridTemplateColumns: `repeat(2, 1fr)`,

						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
						'& > :nth-child(5)': {
							gridColumn: 'span 2',
						},
					},
				},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-container-queries, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
			[`@container layout-area (width < ${layoutBreakpointWidth.SMALL}px)`]: {
				gridTemplateColumns: `repeat(1, 1fr)`,
			},
		},
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export { columnLayoutSharedStyle, columnLayoutResponsiveSharedStyle };
