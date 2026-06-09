/* eslint-disable @atlaskit/ui-styling-standard/use-compiled,
	@repo/internal/deprecations/deprecation-ticket-required,
	@atlaskit/ui-styling-standard/no-exported-styles */
import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';

/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const indentationStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'.fabric-editor-indentation-mark': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
			"&[data-level='1']": {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
				marginLeft: 30,
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
			"&[data-level='2']": {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
				marginLeft: 60,
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
			"&[data-level='3']": {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
				marginLeft: 90,
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
			"&[data-level='4']": {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
				marginLeft: 120,
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
			"&[data-level='5']": {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
				marginLeft: 150,
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
			"&[data-level='6']": {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
				marginLeft: 180,
			},
		},
	},
});
