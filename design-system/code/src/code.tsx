/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { forwardRef, memo } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import CodeBidiWarning from './bidi-warning';
import codeBidiWarningDecorator from './bidi-warning/bidi-warning-decorator';
import { VAR_CODE_BG_COLOR } from './internal/theme/constants';
import { getCodeStyles } from './internal/theme/styles';
import type { CodeProps } from './types';

/**
 * __Code__
 *
 * Code highlights short strings of code snippets inline with body text.
 *
 * - [Examples](https://atlassian.design/components/code/examples)
 * - [Code](https://atlassian.design/components/code/code)
 * - [Usage](https://atlassian.design/components/code/usage)
 */
const Code = memo(
	forwardRef<HTMLElement, CodeProps>(function Code({ testId, ...props }, ref) {
		// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
		const styles = fg('platform_design_system_team_code_new_typography')
			? css({
					display: 'inline',
					padding: '2px 0.5ch',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
					backgroundColor: `var(${VAR_CODE_BG_COLOR}, ${token('color.background.neutral')})`,
					borderRadius: token('border.radius', '3px'),
					borderStyle: 'none',
					boxDecorationBreak: 'clone',
					color: token('color.text'),
					font: token('font.code'),
					lineHeight: 'inherit',
					overflow: 'auto',
					overflowWrap: 'break-word',
					whiteSpace: 'pre-wrap',
				})
			: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				css(getCodeStyles());

		const {
			children,
			codeBidiWarnings = true,
			codeBidiWarningLabel,
			codeBidiWarningTooltipEnabled = true,
			...otherProps
		} = props;

		const decoratedChildren = codeBidiWarnings ? (
			<RenderCodeChildrenWithBidiWarnings
				codeBidiWarningLabel={codeBidiWarningLabel}
				codeBidiWarningTooltipEnabled={codeBidiWarningTooltipEnabled}
			>
				{children}
			</RenderCodeChildrenWithBidiWarnings>
		) : (
			children
		);
		return (
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
			<code ref={ref} data-testid={testId} css={styles} {...otherProps}>
				{decoratedChildren}
			</code>
		);
	}),
);

function RenderCodeChildrenWithBidiWarnings({
	children,
	codeBidiWarningLabel,
	codeBidiWarningTooltipEnabled,
}: {
	children: React.ReactNode;
	codeBidiWarningLabel?: string;
	codeBidiWarningTooltipEnabled: boolean;
}) {
	const replacedChildren = React.Children.map(children, (childNode) => {
		if (typeof childNode === 'string') {
			const decorated = codeBidiWarningDecorator(childNode, ({ bidiCharacter, index }) => (
				<CodeBidiWarning
					bidiCharacter={bidiCharacter}
					key={index}
					label={codeBidiWarningLabel}
					tooltipEnabled={codeBidiWarningTooltipEnabled}
				/>
			));
			return decorated;
		}

		if (isReactElement(childNode) && childNode.props.children) {
			// eslint-disable-next-line @repo/internal/react/no-clone-element
			const newChildNode = React.cloneElement(childNode as JSX.Element, {
				children: (
					<RenderCodeChildrenWithBidiWarnings
						codeBidiWarningLabel={codeBidiWarningLabel}
						codeBidiWarningTooltipEnabled={codeBidiWarningTooltipEnabled}
					>
						{childNode.props.children}
					</RenderCodeChildrenWithBidiWarnings>
				),
			});
			return newChildNode;
		}

		return childNode;
	});

	return <React.Fragment>{replacedChildren}</React.Fragment>;
}

function isReactElement<P>(child: React.ReactNode): child is React.ReactElement<P> {
	return !!(child as React.ReactElement<P>).type;
}

Code.displayName = 'Code';

export { getCodeStyles };

export default Code;
