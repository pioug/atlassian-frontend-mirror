/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/**
 * Emotion fallback branch of the `platform_editor_core_non_ecc_static_css` experiment.
 * Used via `componentWithCondition` in `ToolbarInner.tsx`.
 *
 * Cleanup: delete this file once the experiment has shipped.
 */
import type { ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports -- intentional: emotion fallback for compiled migration
import { css, jsx } from '@emotion/react';

import { akEditorMobileMaxWidth } from '@atlaskit/editor-shared-styles';

const toolbarComponentsWrapperEmotionStyles = css({
	display: 'flex',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	[`@media (max-width: ${akEditorMobileMaxWidth}px)`]: {
		justifyContent: 'space-between',
	},
});

interface ToolbarComponentsWrapperEmotionProps {
	children?: ReactNode;
	'data-vc'?: string;
}

export const ToolbarComponentsWrapperEmotion = ({
	children,
	'data-vc': dataVc,
}: ToolbarComponentsWrapperEmotionProps): JSX.Element => (
	<div css={toolbarComponentsWrapperEmotionStyles} data-vc={dataVc}>
		{children}
	</div>
);
