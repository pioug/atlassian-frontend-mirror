// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css } from '@emotion/react';

// = akEditorDefaultLayoutWidth * breakoutWideScaleRatio = 1010.8 ~ 1011 This is a resulting width value that is applied to nodes that currently use breakouts (except table) and are set to `wide` when the viewport's width is > 1329px.
const akEditorCalculatedWideLayoutWidth = 1011;
// from breakoutConsts.calcWideWidth, layoutMaxWidth * breakoutConsts.wideScaleRatio = 904.8 ~ 905 This is a resulting width value that is applied to nodes that currently use breakouts (except table) and are set to `wide` when the viewport's width is <= 1266px.
const akEditorCalculatedWideLayoutWidthSmallViewport = 905;
const akEditorGutterPadding = 32;
const akEditorDefaultLayoutWidth = 760;
const akEditorFullWidthLayoutWidth = 1800;
// The breakpoint for small devices is 1266px, copied from getBreakpoint in platform/packages/editor/editor-common/src/ui/WidthProvider/index.tsx
const akEditorBreakpointForSmallDevice = `1266px`;

// jest warning: JSDOM version (22) doesn't support the new @container CSS rule
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const baseStyles = css({
	'--ak-editor--default-gutter-padding': `${akEditorGutterPadding}px`,
	'--ak-editor--default-layout-width': `${akEditorDefaultLayoutWidth}px`,
	'--ak-editor--full-width-layout-width': `${akEditorFullWidthLayoutWidth}px`,
	/* calculate editor line length, 100cqw is the editor container width */
	'--ak-editor--line-length':
		'min(calc(100cqw - var(--ak-editor--large-gutter-padding) * 2), var(--ak-editor--default-layout-width))',
	'--ak-editor--breakout-wide-layout-width': `${akEditorCalculatedWideLayoutWidthSmallViewport}px`,
	'--ak-editor--breakout-full-page-guttering-padding':
		'calc(var(--ak-editor--large-gutter-padding) * 2 + var(--ak-editor--default-gutter-padding))',

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.fabric-editor--full-width-mode': {
		'--ak-editor--line-length':
			'min(calc(100cqw - var(--ak-editor--large-gutter-padding) * 2), var(--ak-editor--full-width-layout-width))',
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		'--ak-editor-max-container-width': 'calc(100cqw - var(--ak-editor--large-gutter-padding))',
		outline: 'none',
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		fontSize: 'var(--ak-editor-base-font-size)',
	},

	/* We can't allow nodes that are inside other nodes to bleed from the parent container */
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror > div[data-prosemirror-node-block] [data-prosemirror-node-block]': {
		'--ak-editor-max-container-width': '100%',
	},

	/* container editor-area is defined in platform/packages/editor/editor-core/src/ui/Appearance/FullPage/StyledComponents.ts */
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-container-queries, @atlaskit/ui-styling-standard/no-unsafe-values
	[`@container editor-area (width >= ${akEditorBreakpointForSmallDevice})`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ProseMirror': {
			'--ak-editor--breakout-wide-layout-width': `${akEditorCalculatedWideLayoutWidth}px`,
		},
	},
});
