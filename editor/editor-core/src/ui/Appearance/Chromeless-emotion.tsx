/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/**
 * Emotion fallback branch of the `platform_editor_core_non_ecc_static_css` experiment.
 * Used via `componentWithCondition` in `Chromeless.tsx`.
 *
 * Cleanup: delete this file once the experiment has shipped.
 */
import type { HTMLAttributes } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports -- intentional: emotion fallback; jsx required at runtime for @jsxRuntime classic
import { css, jsx } from '@emotion/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { token } from '@atlaskit/tokens';

const scrollbarStylesNew = css({
	msOverflowStyle: '-ms-autohiding-scrollbar',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
	'&::-webkit-scrollbar-corner': {
		display: 'none',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
	'&::-webkit-scrollbar-thumb': {
		backgroundColor: token('color.background.neutral.subtle'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
	'&:hover::-webkit-scrollbar-thumb': {
		backgroundColor: token('color.background.neutral.bold'),
		borderRadius: token('radius.large'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
	'&::-webkit-scrollbar-thumb:hover': {
		backgroundColor: token('color.background.neutral.bold.hovered'),
	},
});

const chromelessEditorStylesNew = css({
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: '20px',
	height: 'auto',
	overflowX: 'hidden',
	overflowY: 'auto',
	maxWidth: 'inherit',
	boxSizing: 'border-box',
	wordWrap: 'break-word',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'div > .ProseMirror': {
		outline: 'none',
		whiteSpace: 'pre-wrap',
		padding: 0,
		margin: 0,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'& > :last-child': {
			paddingBottom: token('space.100'),
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'& > p:last-of-type': {
			marginBottom: token('space.0'),
		},
	},
});

export interface ChromelessEditorContainerProps extends HTMLAttributes<HTMLDivElement> {
	containerRef?: (ref: HTMLElement | null) => void;
	maxHeight?: number;
	minHeight: number;
}

export const ChromelessEditorContainerEmotion = ({
	children,
	containerRef,
	maxHeight,
	minHeight,
	...rest
}: ChromelessEditorContainerProps): jsx.JSX.Element => (
	<div
		css={[chromelessEditorStylesNew, scrollbarStylesNew]}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={
			fg('platform_editor_chromeless_akeditor_class') ||
			expValEquals('create_work_item_modernization_exp', 'isEnabled', true)
				? 'akEditor'
				: undefined
		}
		style={{
			maxHeight: maxHeight ? `${maxHeight}px` : undefined,
			minHeight: `${minHeight}px`,
		}}
		ref={containerRef}
		data-testid="chromeless-editor"
		id="chromeless-editor"
	>
		{children}
	</div>
);
