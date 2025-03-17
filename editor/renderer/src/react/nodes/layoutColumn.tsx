/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx, css } from '@emotion/react';

import {
	WidthProvider,
	clearNextSiblingMarginTopStyle,
	clearNextSiblingBlockMarkMarginTopStyle,
} from '@atlaskit/editor-common/ui';
import { fg } from '@atlaskit/platform-feature-flags';

// localized styles, was from clearNextSiblingMarginTopStyle in @atlaskit/editor-common/ui
const clearNextSiblingMarginTopStyleNew = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& + *': {
		// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview, @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		marginTop: '0 !important',
	},
});

// localized styles, was from clearNextSiblingBlockMarkMarginTopStyle in @atlaskit/editor-common/ui
const clearNextSiblingBlockMarkMarginTopStyleNew = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	[`+ .fabric-editor-block-mark > p,
	  + .fabric-editor-block-mark > h1,
	  + .fabric-editor-block-mark > h2,
	  + .fabric-editor-block-mark > h3,
	  + .fabric-editor-block-mark > h4,
	  + .fabric-editor-block-mark > h5,
	  + .fabric-editor-block-mark > h6
	`]: {
		// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview, @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		marginTop: '0 !important',
	},
});

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
const layoutColumnClearMarginTopStyles = css(
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	clearNextSiblingMarginTopStyle,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	clearNextSiblingBlockMarkMarginTopStyle,
);

export default function LayoutSection(props: React.PropsWithChildren<{ width?: number }>) {
	return (
		<div
			data-layout-column
			data-column-width={props.width}
			style={{ flexBasis: `${props.width}%` }}
		>
			<WidthProvider>
				<div
					css={
						fg('platform_editor_emotion_refactor_renderer')
							? [clearNextSiblingMarginTopStyleNew, clearNextSiblingBlockMarkMarginTopStyleNew]
							: layoutColumnClearMarginTopStyles
					}
				/>
				{props.children}
			</WidthProvider>
		</div>
	);
}
