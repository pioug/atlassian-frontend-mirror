// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { getBooleanFF } from '@atlaskit/platform-feature-flags';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const backgroundColorStyles = () => {
	return getBooleanFF('platform.editor.review-text-highlighting-styling')
		? css({
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
				'.fabric-background-color-mark': {
					backgroundColor: 'var(--custom-palette-color, inherit)',
					borderRadius: '2px',
					// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
					paddingTop: '1px',
					// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
					paddingBottom: '2px',
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
			})
		: css({
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
				'.fabric-background-color-mark': {
					backgroundColor: 'var(--custom-palette-color, inherit)',
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
};
