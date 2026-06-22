/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/**
 * Emotion fallback branch of the `platform_editor_core_non_ecc_static_css` experiment.
 * Used via `componentWithCondition` in `ToolbarWithSizeDetector.tsx`.
 *
 * Cleanup: delete this file once the experiment has shipped.
 */
import type { CSSProperties, ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports -- intentional: emotion fallback for compiled migration
import { css, jsx } from '@emotion/react';

const toolbarSizeDetectorWrapperEmotionStyles = css({
	width: '100%',
	position: 'relative',
});

interface ToolbarSizeDetectorWrapperEmotionProps {
	children?: ReactNode;
	style?: CSSProperties;
}

export const ToolbarSizeDetectorWrapperEmotion = ({
	children,
	style,
}: ToolbarSizeDetectorWrapperEmotionProps): JSX.Element => (
	<div css={toolbarSizeDetectorWrapperEmotionStyles} style={style}>
		{children}
	</div>
);
