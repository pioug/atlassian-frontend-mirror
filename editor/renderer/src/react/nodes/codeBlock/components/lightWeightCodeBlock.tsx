/** @jsx jsx */
import React, { forwardRef, useMemo } from 'react';
import { css, jsx } from '@emotion/react';

import { blockNodesVerticalMargin } from '@atlaskit/editor-shared-styles';
import { codeBlockSharedStyles, CodeBlockSharedCssClassName } from '@atlaskit/editor-common/styles';

import { useBidiWarnings } from '../../../hooks/use-bidi-warnings';
import { RendererCssClassName } from '../../../../consts';
import type { Props as CodeBlockProps } from '../codeBlock';

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
const lightWeightCodeBlockStyles = css`
	.${CodeBlockSharedCssClassName.CODEBLOCK_CONTAINER} {
		cursor: text;
	}
`;

export const LightWeightCodeBlockCssClassName = {
	CONTAINER: 'light-weight-code-block',
};

export const getLightWeightCodeBlockStylesForRootRendererStyleSheet = () => {
	// We overwrite the rule that clears margin-top for first nested codeblocks, as
	// our lightweight codeblock dom structure will always nest the codeblock inside
	// an extra container div which would constantly be targeted. Now, top-level
	// lightweight codeblock containers will not be targeted.
	// NOTE: This must be added after other .code-block styles in the root
	// Renderer stylesheet.
	// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- needs manual remediation
	return css`
		.${RendererCssClassName.DOCUMENT}
			> .${LightWeightCodeBlockCssClassName.CONTAINER}
			.${CodeBlockSharedCssClassName.CODEBLOCK_CONTAINER} {
			margin-top: ${blockNodesVerticalMargin};
		}
	`;
};

const LightWeightCodeBlock = forwardRef(
	(
		{
			text,
			codeBidiWarningTooltipEnabled = true,
			className,
		}: Pick<CodeBlockProps, 'text' | 'codeBidiWarningTooltipEnabled' | 'className'>,
		ref: React.Ref<HTMLDivElement>,
	) => {
		const textRows = useMemo(() => (text ?? '').split('\n'), [text]);
		const { renderBidiWarnings } = useBidiWarnings({
			enableWarningTooltip: codeBidiWarningTooltipEnabled,
		});
		const classNames = [LightWeightCodeBlockCssClassName.CONTAINER, className].join(' ');

		return (
			<div
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={classNames}
				ref={ref}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
				css={[codeBlockSharedStyles(), lightWeightCodeBlockStyles]}
			>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766  */}
				<div className={CodeBlockSharedCssClassName.CODEBLOCK_CONTAINER}>
					<div
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
						className={CodeBlockSharedCssClassName.CODEBLOCK_CONTENT_WRAPPER}
					>
						<div
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
							className={CodeBlockSharedCssClassName.CODEBLOCK_LINE_NUMBER_GUTTER}
						>
							{textRows.map((_, index) => (
								<span key={index} />
							))}
						</div>
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
						<div className={CodeBlockSharedCssClassName.CODEBLOCK_CONTENT}>
							<code>{renderBidiWarnings(text)}</code>
						</div>
					</div>
				</div>
			</div>
		);
	},
);

export default LightWeightCodeBlock;
