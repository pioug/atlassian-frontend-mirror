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
export const textHighlightPaddingStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'.fabric-background-color-mark:has(.background-color-padding-left)': {
		paddingLeft: token('space.025'),
		marginLeft: token('space.negative.025'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'.fabric-background-color-mark:has(.background-color-padding-right)': {
		paddingRight: token('space.025'),
		marginRight: token('space.negative.025'),
	},
});

/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const backgroundColorStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.fabric-background-color-mark': {
		backgroundColor: 'var(--custom-palette-color, inherit)',
		borderRadius: token('radius.xsmall'),
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
		paddingTop: 1,
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
		paddingBottom: 2,
		boxDecorationBreak: 'clone',
	},

	// Don't show text highlight styling when there is a hyperlink
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'a .fabric-background-color-mark': {
		backgroundColor: 'unset',
	},

	// Don't show text highlight styling when there is an inline comment
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.fabric-background-color-mark .ak-editor-annotation': {
		backgroundColor: 'unset',
	},
});
