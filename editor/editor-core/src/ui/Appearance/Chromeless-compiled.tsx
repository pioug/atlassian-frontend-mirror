/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/**
 * Compiled branch of the `platform_editor_core_non_ecc_static_css` experiment.
 * Used via `componentWithCondition` in `Chromeless.tsx`.
 *
 * Cleanup: delete this file once the experiment has shipped.
 */
import React from 'react';
import type { HTMLAttributes } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

const chromelessStyles = cssMap({
	scrollbar: {
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
	},
	editor: {
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
	},
});

export interface ChromelessEditorContainerProps extends HTMLAttributes<HTMLDivElement> {
	containerRef?: (ref: HTMLElement | null) => void;
	maxHeight?: number;
	minHeight: number;
}

export const ChromelessEditorContainerCompiled = ({
	children,
	containerRef,
	maxHeight,
	minHeight,
}: ChromelessEditorContainerProps): React.JSX.Element => (
	<div
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className="akEditor"
		css={[chromelessStyles.editor, chromelessStyles.scrollbar]}
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
