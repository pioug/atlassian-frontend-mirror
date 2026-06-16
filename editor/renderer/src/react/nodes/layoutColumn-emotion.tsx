/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/**
 * Emotion branch of the `platform_editor_static_css` experiment.
 * Used via `componentWithCondition` in `layoutColumn.tsx`.
 *
 * Cleanup: delete this file once the experiment has shipped.
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- intentional: emotion fallback for compiled migration
import { css, jsx } from '@emotion/react';

import type { Valign } from '@atlaskit/adf-schema/layout-column';
import { WidthProvider } from '@atlaskit/editor-common/ui';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

// localized styles, was from clearNextSiblingMarginTopStyle in @atlaskit/editor-common/ui
const clearNextSiblingMarginTopStyle = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& + *': {
		// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview, @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		marginTop: '0 !important',
	},
});

const verticalAlignMiddleStyles = css({
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
});

const verticalAlignBottomStyles = css({
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'flex-end',
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

export const LayoutSectionEmotion = (
	props: React.PropsWithChildren<{ valign?: Valign; width?: number }>,
): React.JSX.Element => {
	const isLayoutColumnMenuEnabled = expValEqualsNoExposure(
		'platform_editor_layout_column_menu',
		'isEnabled',
		true,
	);
	// Pure rollout gate: no A/B exposure analysis is planned for this rendering switch.
	const isLayoutColumnValignRenderingEnabled = expValEqualsNoExposure(
		'platform_editor_layout_column_valign_rendering',
		'isEnabled',
		true,
	);

	return (
		<div
			data-layout-column
			data-column-width={props.width}
			data-valign={props.valign}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- flexBasis is dynamic
			style={{ flexBasis: `${props.width}%` }}
			css={[
				// Keep separate: Compiled crashes on ternary/object lookup here.
				(isLayoutColumnValignRenderingEnabled || isLayoutColumnMenuEnabled) &&
					props.valign === 'middle' &&
					verticalAlignMiddleStyles,
				(isLayoutColumnValignRenderingEnabled || isLayoutColumnMenuEnabled) &&
					props.valign === 'bottom' &&
					verticalAlignBottomStyles,
				fg('platform_editor_fix_media_in_renderer') && multipleWrappedImagesStyle,
			]}
		>
			<WidthProvider>
				<div css={[clearNextSiblingMarginTopStyle, clearNextSiblingBlockMarkMarginTopStyle]} />
				{props.children}
			</WidthProvider>
		</div>
	);
};
