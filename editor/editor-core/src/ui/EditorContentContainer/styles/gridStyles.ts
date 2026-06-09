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
export const gridStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.gridParent': {
		width: `calc(100% + 24px)`,
		marginLeft: token('space.negative.150'),
		marginRight: token('space.negative.150'),
		transform: 'scale(1)',
		zIndex: 2,
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.gridContainer': {
		position: 'fixed',
		height: '100vh',
		width: '100%',
		pointerEvents: 'none',
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.gridLine': {
		borderLeft: `${token('border.width')} solid ${token('color.border')}`,
		display: 'inline-block',
		boxSizing: 'border-box',
		height: '100%',
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
		marginLeft: '-1px',
		transition: 'border-color 0.15s linear',
		zIndex: 0,
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.highlight': {
		borderLeft: `1px solid ${token('color.border.focused')}`,
	},
});
