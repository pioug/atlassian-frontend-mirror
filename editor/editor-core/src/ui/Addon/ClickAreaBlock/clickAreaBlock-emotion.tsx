/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/**
 * Emotion fallback branch of the `platform_editor_core_non_ecc_static_css` experiment.
 * Used via `componentWithCondition` in `index.tsx`.
 *
 * Cleanup: delete this file once the experiment has shipped.
 */
import type { HTMLAttributes } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- intentional: emotion fallback for compiled migration
import { css, jsx } from '@emotion/react';

const clickWrapperEmotionStyles = css({
	flexGrow: 1,
	height: '100%',
});

export const ClickAreaBlockContainerEmotion = ({
	children,
	...rest
}: HTMLAttributes<HTMLDivElement>): React.JSX.Element => (
	// eslint-disable-next-line react/jsx-props-no-spreading
	<div css={clickWrapperEmotionStyles} {...rest}>
		{children}
	</div>
);
