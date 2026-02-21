/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { forwardRef, memo } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import CodeBidiWarning from './bidi-warning';
import codeBidiWarningDecorator from './bidi-warning/bidi-warning-decorator';
import type { CodeProps } from './types';
const styles = cssMap({
	base: {
		display: 'inline',
		padding: '2px 0.5ch',
		backgroundColor: `var(--ds--code--bg-color,${token('color.background.neutral')})`,
		borderRadius: token('radius.small', '3px'),
		borderStyle: 'none',
		boxDecorationBreak: 'clone',
		color: token('color.text'),
		font: token('font.code'),
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: 'inherit',
		overflow: 'auto',
		overflowWrap: 'break-word',
		whiteSpace: 'pre-wrap',
	},
});

/**
 * __Code__
 *
 * Code highlights short strings of code snippets inline with body text.
 *
 * - [Examples](https://atlassian.design/components/code/examples)
 * - [Code](https://atlassian.design/components/code/code)
 * - [Usage](https://atlassian.design/components/code/usage)
 */
const Code: React.MemoExoticComponent<
	React.ForwardRefExoticComponent<Omit<CodeProps, 'ref'> & React.RefAttributes<HTMLElement>>
> = memo(
	forwardRef<HTMLElement, CodeProps>(function Code({ testId, ...props }, ref) {
		const {
			children,
			codeBidiWarnings = true,
			hasBidiWarnings,
			codeBidiWarningLabel,
			codeBidiWarningTooltipEnabled = true,
			isBidiWarningTooltipEnabled,
			...otherProps
		} = props;

		// Use new props if provided, otherwise fall back to deprecated props
		const shouldShowBidiWarnings =
			hasBidiWarnings !== undefined ? hasBidiWarnings : codeBidiWarnings;
		const shouldEnableTooltip =
			isBidiWarningTooltipEnabled !== undefined
				? isBidiWarningTooltipEnabled
				: codeBidiWarningTooltipEnabled;

		const decoratedChildren = shouldShowBidiWarnings ? (
			<RenderCodeChildrenWithBidiWarnings
				codeBidiWarningLabel={codeBidiWarningLabel}
				codeBidiWarningTooltipEnabled={shouldEnableTooltip}
			>
				{children}
			</RenderCodeChildrenWithBidiWarnings>
		) : (
			children
		);
		return (
			<code ref={ref} data-testid={testId} css={styles.base} {...otherProps}>
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

export default Code;
