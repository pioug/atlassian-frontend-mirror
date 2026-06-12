/* eslint-disable @atlaskit/ui-styling-standard/use-compiled,
	@repo/internal/deprecations/deprecation-ticket-required,
	@atlaskit/ui-styling-standard/no-exported-styles */
import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';

import { token } from '@atlaskit/tokens';

/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const shadowClassNames = {
	RIGHT_SHADOW: 'right-shadow',
	LEFT_SHADOW: 'left-shadow',
};

/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const shadowObserverClassNames = {
	SENTINEL_LEFT: 'sentinel-left',
	SENTINEL_RIGHT: 'sentinel-right',
	SHADOW_CONTAINER: 'with-shadow-observer',
};
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/volt-strict-mode/no-multiple-exports
export const shadowStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		[`& .${shadowClassNames.RIGHT_SHADOW}::before, .${shadowClassNames.RIGHT_SHADOW}::after, .${shadowClassNames.LEFT_SHADOW}::before, .${shadowClassNames.LEFT_SHADOW}::after`]:
			{
				display: 'none',
				position: 'absolute',
				pointerEvents: 'none',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				zIndex: 2,
				width: 8,
				content: "''",
				height: 'calc(100%)',
			},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		[`& .${shadowClassNames.RIGHT_SHADOW}, .${shadowClassNames.LEFT_SHADOW}`]: {
			position: 'relative',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		[`& .${shadowClassNames.LEFT_SHADOW}::before`]: {
			background: `linear-gradient(to left, transparent 0, ${token('elevation.shadow.overflow.spread')} 140% ), linear-gradient( to right, ${token('elevation.shadow.overflow.perimeter')} 0px, transparent 1px)`,
			top: 0,
			left: 0,
			display: 'block',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		[`& .${shadowClassNames.RIGHT_SHADOW}::after`]: {
			background: `linear-gradient(to right, transparent 0, ${token('elevation.shadow.overflow.spread')} 140% ), linear-gradient( to left, ${token('elevation.shadow.overflow.perimeter')} 0px, transparent 1px)`,
			right: 0,
			top: 0,
			display: 'block',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		[`& .${shadowObserverClassNames.SENTINEL_LEFT}`]: {
			height: '100%',
			width: 0,
			minWidth: 0,
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		[`& .${shadowObserverClassNames.SENTINEL_RIGHT}`]: {
			height: '100%',
			width: 0,
			minWidth: 0,
		},
	},
});
