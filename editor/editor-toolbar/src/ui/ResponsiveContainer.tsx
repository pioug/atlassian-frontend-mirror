/* eslint-disable @atlaskit/ui-styling-standard/no-unsafe-selectors */
/* eslint-disable @atlaskit/ui-styling-standard/no-container-queries */
/* eslint-disable @atlaskit/ui-styling-standard/no-nested-selectors */
import React, { type ReactNode } from 'react';

import type { AllowedStyles, ApplySchema, CompiledStyles } from '@compiled/react';

import { cssMap, cx } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, type MediaQuery } from '@atlaskit/primitives/compiled';
import type { DesignTokenStyles } from '@atlaskit/tokens/css-type-schema';

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

		'.show-only-sm, .show-only-md, .show-only-lg, .show-only-xl': {
			display: 'none',
		},
	},
	// Uses ancestor to provide container query context
	responsiveContainerFullPage: {
		width: 'fit-content',

		// @ts-expect-error - unsure why TS is failing here but not above
		'.show-above-sm, .show-above-md, .show-above-lg, .show-above-xl': {
			display: 'block',
		},

		'.show-below-sm, .show-below-md, .show-below-lg, .show-below-xl': {
			display: 'none',
		},

		'.show-only-sm, .show-only-md, .show-only-lg, .show-only-xl': {
			display: 'none',
		},
	},
	// Preset: fullpage (410, 476, 768, 1024)
	// Used for editor full-page experiences
	fullpage: {
		// @ts-expect-error - container queries are not typed in cssMap
		'@container toolbar-container (max-width: 421px)': {
			'.show-above-sm': {
				display: 'none',
			},
			'.show-below-sm': {
				display: 'block',
			},
		},
		'@container toolbar-container (min-width: 422px) and (max-width: 721px)': {
			'.show-only-sm': {
				display: 'block',
			},
		},
		'@container toolbar-container (max-width: 721px)': {
			'.show-above-md': {
				display: 'none',
			},
			'.show-below-md': {
				display: 'block',
			},
		},
		'@container toolbar-container (min-width: 722px) and (max-width: 857px)': {
			'.show-only-md': {
				display: 'block',
			},
		},
		'@container toolbar-container (max-width: 857px)': {
			'.show-above-lg': {
				display: 'none',
			},
			'.show-below-lg': {
				display: 'block',
			},
		},
		'@container toolbar-container (min-width: 858px) and (max-width: 1023px)': {
			'.show-only-lg': {
				display: 'block',
			},
		},
		'@container toolbar-container (max-width: 1023px)': {
			'.show-above-xl': {
				display: 'none',
			},
			'.show-below-xl': {
				display: 'block',
			},
		},
		'@container toolbar-container (min-width: 1024px)': {
			'.show-only-xl': {
				display: 'block',
			},
		},
	},
	// Preset: reduced (210, 408, 575, 1024)
	// Used for default compact toolbars, constrained layouts, and comment editors
	reduced: {
		// @ts-expect-error - container queries are not typed in cssMap
		'&&': {
			'@container toolbar-container (max-width: 295px)': {
				'.show-above-sm': {
					display: 'none',
				},
				'.show-below-sm': {
					display: 'block',
				},
			},
			'@container toolbar-container (min-width: 296px) and (max-width: 431px)': {
				'.show-only-sm': {
					display: 'block',
				},
			},
			'@container toolbar-container (max-width: 431px)': {
				'.show-above-md': {
					display: 'none',
				},
				'.show-below-md': {
					display: 'block',
				},
			},
			'@container toolbar-container (min-width: 432px) and (max-width: 661px)': {
				'.show-only-md': {
					display: 'block',
				},
			},
			'@container toolbar-container (max-width: 661px)': {
				'.show-above-lg': {
					display: 'none',
				},
				'.show-below-lg': {
					display: 'block',
				},
			},
			'@container toolbar-container (min-width: 662px) and (max-width: 1023px)': {
				'.show-only-lg': {
					display: 'block',
				},
			},
			'@container toolbar-container (max-width: 1023px)': {
				'.show-above-xl': {
					display: 'none',
				},
				'.show-below-xl': {
					display: 'block',
				},
			},
			'@container toolbar-container (min-width: 1024px)': {
				'.show-only-xl': {
					display: 'block',
				},
			},
		},
	},
	// Preset: jira-issue (280, 420, 650, 1024)
	// Used for Jira issue view and similar contexts
	jiraIssue: {
		// @ts-expect-error - container queries are not typed in cssMap
		'&&': {
			'@container toolbar-container (max-width: 279px)': {
				'.show-above-sm': {
					display: 'none',
				},
				'.show-below-sm': {
					display: 'block',
				},
			},
			'@container toolbar-container (min-width: 280px) and (max-width: 419px)': {
				'.show-only-sm': {
					display: 'block',
				},
			},
			'@container toolbar-container (max-width: 419px)': {
				'.show-above-md': {
					display: 'none',
				},
				'.show-below-md': {
					display: 'block',
				},
			},
			'@container toolbar-container (min-width: 420px) and (max-width: 649px)': {
				'.show-only-md': {
					display: 'block',
				},
			},
			'@container toolbar-container (max-width: 649px)': {
				'.show-above-lg': {
					display: 'none',
				},
				'.show-below-lg': {
					display: 'block',
				},
			},
			'@container toolbar-container (min-width: 650px) and (max-width: 1023px)': {
				'.show-only-lg': {
					display: 'block',
				},
			},
			'@container toolbar-container (max-width: 1023px)': {
				'.show-above-xl': {
					display: 'none',
				},
				'.show-below-xl': {
					display: 'block',
				},
			},
			'@container toolbar-container (min-width: 1024px)': {
				'.show-only-xl': {
					display: 'block',
				},
			},
		},
	},
	// Preset: jsm-comment (365, 500, 630, 1024)
	// Used for JSM comment editor with canned responses button
	jsmComment: {
		// @ts-expect-error - container queries are not typed in cssMap
		'&&': {
			'@container toolbar-container (max-width: 364px)': {
				'.show-above-sm': {
					display: 'none',
				},
				'.show-below-sm': {
					display: 'block',
				},
			},
			'@container toolbar-container (min-width: 365px) and (max-width: 499px)': {
				'.show-only-sm': {
					display: 'block',
				},
			},
			'@container toolbar-container (max-width: 499px)': {
				'.show-above-md': {
					display: 'none',
				},
				'.show-below-md': {
					display: 'block',
				},
			},
			'@container toolbar-container (min-width: 500px) and (max-width: 629px)': {
				'.show-only-md': {
					display: 'block',
				},
			},
			'@container toolbar-container (max-width: 629px)': {
				'.show-above-lg': {
					display: 'none',
				},
				'.show-below-lg': {
					display: 'block',
				},
			},
			'@container toolbar-container (min-width: 630px) and (max-width: 1023px)': {
				'.show-only-lg': {
					display: 'block',
				},
			},
			'@container toolbar-container (max-width: 1023px)': {
				'.show-above-xl': {
					display: 'none',
				},
				'.show-below-xl': {
					display: 'block',
				},
			},
			'@container toolbar-container (min-width: 1024px)': {
				'.show-only-xl': {
					display: 'block',
				},
			},
		},
	},
	// Preset: confluence-comment (210, 408, 648, 1024)
	// Used for Confluence comment editor and inline contexts
	confluenceComment: {
		// @ts-expect-error - container queries are not typed in cssMap
		'&&': {
			'@container toolbar-container (max-width: 209px)': {
				'.show-above-sm': {
					display: 'none',
				},
				'.show-below-sm': {
					display: 'block',
				},
			},
			'@container toolbar-container (min-width: 210px) and (max-width: 407px)': {
				'.show-only-sm': {
					display: 'block',
				},
			},
			'@container toolbar-container (max-width: 407px)': {
				'.show-above-md': {
					display: 'none',
				},
				'.show-below-md': {
					display: 'block',
				},
			},
			'@container toolbar-container (min-width: 408px) and (max-width: 647px)': {
				'.show-only-md': {
					display: 'block',
				},
			},
			'@container toolbar-container (max-width: 647px)': {
				'.show-above-lg': {
					display: 'none',
				},
				'.show-below-lg': {
					display: 'block',
				},
			},
			'@container toolbar-container (min-width: 648px) and (max-width: 1023px)': {
				'.show-only-lg': {
					display: 'block',
				},
			},
			'@container toolbar-container (max-width: 1023px)': {
				'.show-above-xl': {
					display: 'none',
				},
				'.show-below-xl': {
					display: 'block',
				},
			},
			'@container toolbar-container (min-width: 1024px)': {
				'.show-only-xl': {
					display: 'block',
				},
			},
		},
	},
	// Legacy styles - kept for backward compatibility with reducedBreakpoints prop
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
		'@container toolbar-container (min-width: 411px) and (max-width: 476px)': {
			'.show-only-sm': {
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
		'@container toolbar-container (min-width: 477px) and (max-width: 768px)': {
			'.show-only-md': {
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
		'@container toolbar-container (min-width: 768px) and (max-width: 1024px)': {
			'.show-only-lg': {
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
		'@container toolbar-container (min-width: 1024px)': {
			'.show-only-xl': {
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
			'@container toolbar-container (min-width: 211px) and (max-width: 408px)': {
				'.show-only-sm': {
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
			'@container toolbar-container (min-width: 408px) and (max-width: 575px)': {
				'.show-only-md': {
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
			'@container toolbar-container (min-width: 576px) and (max-width: 1024px)': {
				'.show-only-lg': {
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
			'@container toolbar-container (min-width: 1024px)': {
				'.show-only-xl': {
					display: 'block',
				},
			},
		},
	},
	// combine with responsiveRulesReduced when patch_6 is cleaned up
	responsiveRulesReducedOverridden: {
		// @ts-expect-error - container queries are not typed in cssMap
		'&&&': {
			'@container toolbar-container (max-width: 648px)': {
				'.show-above-lg': {
					display: 'none',
				},
				'.show-below-lg': {
					display: 'block',
				},
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

/**
 * Breakpoint preset names for ResponsiveContainer.
 * Each preset defines a specific set of breakpoints optimized for different use cases.
 */
export type BreakpointPreset =
	| 'fullpage'
	| 'reduced'
	| 'jira-issue'
	| 'jsm-comment'
	| 'confluence-comment';

// Map preset names to camelCase style keys
const presetStyleMap: Record<
	BreakpointPreset,
	CompiledStyles<ApplySchema<AllowedStyles<MediaQuery>, DesignTokenStyles, ''>>
> = {
	fullpage: styles.fullpage,
	reduced: styles.reduced,
	'jira-issue': styles.jiraIssue,
	'jsm-comment': styles.jsmComment,
	'confluence-comment': styles.confluenceComment,
};

export type ResponsiveContainerProps = {
	/**
	 * Selects the breakpoint preset for the responsive container.
	 *
	 * Available presets:
	 * - 'fullpage': (410, 476, 768, 1024) - Editor full-page experiences
	 * - 'reduced': (210, 408, 575, 1024) - Default compact toolbars, constrained layouts
	 * - 'jira-issue': (280, 420, 650, 1024) - Jira issue view and similar contexts
	 * - 'jsm-comment': (365, 500, 630, 1024) - JSM comment editor with canned responses button
	 * - 'confluence-comment': (210, 408, 648, 1024) - Confluence comment editor and inline contexts
	 *
	 * @default 'fullpage'
	 */
	breakpointPreset?: BreakpointPreset;
	children: ReactNode;
	/**
	 * Use `preset` prop instead. This flag changes the breakpoint definitions, which reduces them to cater for smaller editor widths.
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
 * @param preset - Selects the breakpoint preset for the responsive container
 *
 * @param reducedBreakpoints - Legacy prop for reduced breakpoints (deprecated, use preset instead)
 * @returns A Box component with container query styles applied
 */
export const ResponsiveContainer = ({
	children,
	breakpointPreset,
	reducedBreakpoints,
}: ResponsiveContainerProps): React.JSX.Element => {
	// Use new preset-based logic when preset is provided and feature gate is enabled
	if (breakpointPreset && fg('platform_editor_toolbar_aifc_responsive_improve')) {
		return (
			<Box
				xcss={cx(
					breakpointPreset === 'fullpage'
						? styles.responsiveContainerFullPage
						: styles.responsiveContainer,
					presetStyleMap[breakpointPreset],
				)}
			>
				{children}
			</Box>
		);
	}

	return (
		<Box
			xcss={cx(
				breakpointPreset === 'fullpage'
					? styles.responsiveContainerFullPage
					: styles.responsiveContainer,
				reducedBreakpoints ? styles.responsiveRulesReduced : styles.responsiveRules,
				reducedBreakpoints && styles.responsiveRulesReducedOverridden,
			)}
		>
			{children}
		</Box>
	);
};

/**
 * A wrapper that supports responsiveness with media queries. It needs to used together with Show component
 */
export const ResponsiveWrapper = ({ children }: { children: ReactNode }): React.JSX.Element => {
	return <Box xcss={styles.responsiveRulesWrapper}>{children}</Box>;
};
