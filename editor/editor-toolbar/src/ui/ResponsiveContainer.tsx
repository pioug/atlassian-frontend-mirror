/* eslint-disable @atlaskit/ui-styling-standard/no-unsafe-selectors */
/* eslint-disable @atlaskit/ui-styling-standard/no-container-queries */
/* eslint-disable @atlaskit/ui-styling-standard/no-nested-selectors */
import React, { type ReactNode } from 'react';

import { cssMap, cx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

const styles = cssMap({
	responsiveContainer: {
		width: '100%',
		// @ts-expect-error - containerType is not typed
		containerType: 'inline-size',
		// @ts-expect-error - containerName is not typed
		containerName: 'toolbar-container',

		'.show-above-sm, .show-above-md, .show-above-lg, .show-above-xl': {
			display: 'block',
		},

		'.show-below-sm, .show-below-md, .show-below-lg, .show-below-xl': {
			display: 'none',
		},
	},
	responsiveRules: {
		// @ts-expect-error - container queries are not typed in cssMap
		'@container toolbar-container (max-width: 410px)': {
			'.show-above-sm': {
				display: 'none',
			},
			'.show-below-sm': {
				display: 'block',
			},
		},
		'@container toolbar-container (max-width: 476px)': {
			'.show-above-md': {
				display: 'none',
			},
			'.show-below-md': {
				display: 'block',
			},
		},
		'@container toolbar-container (max-width: 768px)': {
			'.show-above-lg': {
				display: 'none',
			},
			'.show-below-lg': {
				display: 'block',
			},
		},
		'@container toolbar-container (max-width: 1024px)': {
			'.show-above-xl': {
				display: 'none',
			},
			'.show-below-xl': {
				display: 'block',
			},
		},
	},
	responsiveRulesReduced: {
		// @ts-expect-error - container queries are not typed in cssMap
		'&&': {
			'@container toolbar-container (max-width: 210px)': {
				'.show-above-sm': {
					display: 'none',
				},
				'.show-below-sm': {
					display: 'block',
				},
			},
			'@container toolbar-container (max-width: 408px)': {
				'.show-above-md': {
					display: 'none',
				},
				'.show-below-md': {
					display: 'block',
				},
			},
			'@container toolbar-container (max-width: 575px)': {
				'.show-above-lg': {
					display: 'none',
				},
				'.show-below-lg': {
					display: 'block',
				},
			},
			'@container toolbar-container (max-width: 1024px)': {
				'.show-above-xl': {
					display: 'none',
				},
				'.show-below-xl': {
					display: 'block',
				},
			},
		},
	},
	responsiveRulesReducedOld: {
		// @ts-expect-error - container queries are not typed in cssMap
		'@container toolbar-container (max-width: 210px)': {
			'.show-above-sm': {
				display: 'none',
			},
			'.show-below-sm': {
				display: 'block',
			},
		},
		'@container toolbar-container (max-width: 350px)': {
			'.show-above-md': {
				display: 'none',
			},
			'.show-below-md': {
				display: 'block',
			},
		},
		'@container toolbar-container (max-width: 500px)': {
			'.show-above-lg': {
				display: 'none',
			},
			'.show-below-lg': {
				display: 'block',
			},
		},
		'@container toolbar-container (max-width: 1024px)': {
			'.show-above-xl': {
				display: 'none',
			},
			'.show-below-xl': {
				display: 'block',
			},
		},
	},
	responsiveRulesWrapper: {
		// @ts-expect-error
		'.show-above-sm, .show-above-md, .show-above-lg, .show-above-xl': {
			display: 'block',
		},

		'.show-below-sm, .show-below-md, .show-below-lg, .show-below-xl': {
			display: 'none',
		},
		// We need to set breakpoints on both media queries and container queries
		// because editor-area does not shrink less than 700px (if no panels are open), hence we need media query for smaller screens
		// and when other panels are open, media query cannot detect, hence we need container query for smaller editor areas.
		'@media (max-width: 365px)': {
			'.show-above-sm': {
				display: 'none',
			},
			'.show-below-sm': {
				display: 'block',
			},
		},
		'@container editor-area  (max-width: 365px)': {
			'.show-above-sm': {
				display: 'none',
			},
			'.show-below-sm': {
				display: 'block',
			},
		},
		'@media (max-width: 533px)': {
			'.show-above-md': {
				display: 'none',
			},
			'.show-below-md': {
				display: 'block',
			},
		},
		'@container editor-area (max-width: 533px)': {
			'.show-above-md': {
				display: 'none',
			},
			'.show-below-md': {
				display: 'block',
			},
		},

		'@media (max-width: 700px)': {
			'.show-above-lg': {
				display: 'none',
			},
			'.show-below-lg': {
				display: 'block',
			},
		},
		'@container editor-area (max-width: 700px)': {
			'.show-above-lg': {
				display: 'none',
			},
			'.show-below-lg': {
				display: 'block',
			},
		},
	},
});

export type ResponsiveContainerProps = {
	children: ReactNode;
	/**
	 * This flag changes the breakpoint definitions, which reduces them to cater for smaller editor widths.
	 *
	 * Usages - for smaller editors such as comments
	 */
	reducedBreakpoints?: boolean;
};

/**
 * A responsive container that enables container query-based responsive design using CSS container queries.
 * This component establishes a containment context named 'toolbar-container' that child components can
 * reference for responsive behavior based on the container's width rather than the viewport width.
 *
 * The container defines breakpoints at:
 * - sm: 410px
 * - md: 476px
 * - lg: 768px
 * - xl: 1024px
 *
 * @example
 * Basic usage with Show component for responsive visibility:
 * ```tsx
 * <ResponsiveContainer>
 *   <Show above="md">
 *     <Button>Only visible when container is wider than 476px</Button>
 *   </Show>
 *   <Show below="sm">
 *     <Icon>Only visible when container is narrower than 410px</Icon>
 *   </Show>
 * </ResponsiveContainer>
 * ```
 *
 * @example
 * Combining multiple Show components for different breakpoints:
 * ```tsx
 * <ResponsiveContainer>
 *   <Show above="lg">
 *     <FullToolbar />
 *   </Show>
 *   <Show below="lg" above="md">
 *     <CompactToolbar />
 *   </Show>
 *   <Show below="md">
 *     <MinimalToolbar />
 *   </Show>
 * </ResponsiveContainer>
 * ```
 *
 * @param children - React nodes to render within the responsive container context
 * @returns A Box component with container query styles applied
 */
export const ResponsiveContainer = ({ children, reducedBreakpoints }: ResponsiveContainerProps) => {
	return (
		<Box
			xcss={cx(
				styles.responsiveContainer,

				reducedBreakpoints
					? editorExperiment('platform_editor_toolbar_aifc_patch_2', true)
						? styles.responsiveRulesReduced
						: styles.responsiveRulesReducedOld
					: styles.responsiveRules,
			)}
		>
			{children}
		</Box>
	);
};

/**
 * A wrapper that supports responsiveness with media queries. It needs to used together with Show component
 */
export const ResponsiveWrapper = ({ children }: { children: ReactNode }) => {
	return <Box xcss={styles.responsiveRulesWrapper}>{children}</Box>;
};
