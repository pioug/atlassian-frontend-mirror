/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/**
 * Emotion fallback branch of the `platform_editor_core_non_ecc_static_css` experiment.
 * Used via `componentWithCondition` in `FullPage.tsx`.
 *
 * Cleanup: delete this file once the experiment has shipped.
 */
import { forwardRef } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports -- intentional: emotion fallback; jsx required at runtime for @jsxRuntime classic
import { jsx } from '@emotion/react';

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- intentional: emotion fallback branch imports from StyledComponents
import { fullPageEditorWrapper as fullPageEditorWrapperStyles } from './StyledComponents';

interface FullPageEditorWrapperProps {
	children: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
}

export const FullPageEditorWrapperEmotion: React.ForwardRefExoticComponent<
	FullPageEditorWrapperProps & React.RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, FullPageEditorWrapperProps>(
	({ children, className, style }, ref) => (
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-classname-prop -- intentional: emotion fallback branch reuses StyledComponents style
		<div css={fullPageEditorWrapperStyles} ref={ref} className={className} style={style}>
			{children}
		</div>
	),
);
