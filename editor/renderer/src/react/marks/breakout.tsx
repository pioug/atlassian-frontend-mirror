/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import type { BreakoutMarkAttrs } from '@atlaskit/adf-schema';
import {
	akEditorFullWidthLayoutWidth,
	akEditorMaxLayoutWidth,
	blockNodesVerticalMargin,
} from '@atlaskit/editor-shared-styles';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import type { MarkProps } from '../types';

import type { BreakoutMode } from '@atlaskit/editor-common/types';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

const wrapperStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	margin: `${blockNodesVerticalMargin} 0`,
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	marginLeft: '50%',
	transform: 'translateX(-50%)',
});

const getWidth = (width: number | null, mode: BreakoutMode) => {
	if (editorExperiment('advanced_layouts', true) && width) {
		return `min(${width}px, var(--ak-editor--breakout-container-without-gutter-width))`;
	} else {
		if (
			expValEquals('editor_tinymce_full_width_mode', 'isEnabled', true) ||
			expValEquals('confluence_max_width_content_appearance', 'isEnabled', true)
		) {
			if (mode === 'max' || (typeof width === 'number' && width >= akEditorFullWidthLayoutWidth)) {
				return `min(${akEditorMaxLayoutWidth}px, var(--ak-editor--breakout-container-without-gutter-width))`;
			}
		}

		if (mode === 'full-width') {
			return `min(${akEditorFullWidthLayoutWidth}px, var(--ak-editor--breakout-container-without-gutter-width))`;
		}
		if (mode === 'wide') {
			return `min(var(--ak-editor--breakout-wide-layout-width), var(--ak-editor--breakout-container-without-gutter-width))`;
		}
	}
};

/**
 * React component that renders a breakout mark with dynamic width based on editor layout (wide or full-width).
 *
 * @param props - Breakout mark attrs, such as mode (wide or full-width).
 * @returns The rendered breakout mark as a React element.
 */
export default function Breakout(props: MarkProps<BreakoutMarkAttrs>) {
	return (
		<div
			css={wrapperStyles}
			data-mode={props.mode}
			// Ignored via go/ees005
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...(editorExperiment('advanced_layouts', true) && {
				'data-has-width': !!props.width,
				'data-width': props.width,
			})}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={{
				width: getWidth('width' in props ? props.width : null, props.mode),
			}}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className="fabric-editor-breakout-mark fabric-editor-block-mark"
		>
			{props.children}
		</div>
	);
}
