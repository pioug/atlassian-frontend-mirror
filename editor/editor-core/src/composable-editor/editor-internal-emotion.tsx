/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/**
 * Emotion fallback branch of the `platform_editor_core_non_ecc_static_css` experiment.
 * Used via `componentWithCondition` in `editor-internal.tsx`.
 *
 * Cleanup: delete this file once the experiment has shipped.
 */
import type { CSSProperties, ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- intentional: emotion fallback for compiled migration
import { css, jsx } from '@emotion/react';

const editorContainerEmotionStyles = css({
	position: 'relative',
	width: '100%',
	height: '100%',
});

export const EditorInternalContainerEmotion = ({
	children,
	fontSize,
}: {
	children?: ReactNode;
	fontSize?: number;
}): React.JSX.Element => (
	<div
		css={editorContainerEmotionStyles}
		style={
			{
				'--ak-editor-base-font-size': `${fontSize}px`,
			} as CSSProperties
		}
	>
		{children}
	</div>
);
