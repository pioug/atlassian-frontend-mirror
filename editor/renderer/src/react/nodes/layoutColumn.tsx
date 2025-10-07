/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx, css } from '@emotion/react';

import { WidthProvider } from '@atlaskit/editor-common/ui';
import { fg } from '@atlaskit/platform-feature-flags';

// localized styles, was from clearNextSiblingMarginTopStyle in @atlaskit/editor-common/ui
const clearNextSiblingMarginTopStyle = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& + *': {
		// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview, @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		marginTop: '0 !important',
	},
});

const multipleWrappedImagesStyle = css({
	// Given the first wrapped mediaSingle has 0 marginTop (see clearNextSiblingMarginTopStyle),
	// update all wrapped mediaSingle inside layout to have 0 margin top unless they don't have sibling wrapped mediaSingle
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,  @atlaskit/ui-styling-standard/no-unsafe-selectors
	'& [class*="image-wrap-"] + [class*="image-wrap-"], & [class*="image-wrap-"]:has( + [class*="image-wrap-"])':
		{
			marginTop: '0',
		},
});

// localized styles, was from clearNextSiblingBlockMarkMarginTopStyle in @atlaskit/editor-common/ui
const clearNextSiblingBlockMarkMarginTopStyle = css({
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

export default function LayoutSection(props: React.PropsWithChildren<{ width?: number }>) {
	return (
		<div
			data-layout-column
			data-column-width={props.width}
			style={{ flexBasis: `${props.width}%` }}
			css={fg('platform_editor_fix_media_in_renderer') && multipleWrappedImagesStyle}
		>
			<WidthProvider>
				<div css={[clearNextSiblingMarginTopStyle, clearNextSiblingBlockMarkMarginTopStyle]} />
				{props.children}
			</WidthProvider>
		</div>
	);
}
