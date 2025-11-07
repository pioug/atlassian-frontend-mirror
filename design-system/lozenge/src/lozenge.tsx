/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties, memo, type ReactNode, useMemo } from 'react';

import { cssMap as cssMapUnbounded } from '@compiled/react';

import { jsx } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

/**
 * TODO: We should be using our bounded `cssMap` here, but most of
 * these styles from the visual refresh are not in the Design System.
 */
const stylesNew = cssMapUnbounded({
	container: {
		display: 'inline-flex',
		boxSizing: 'border-box',
		position: 'static',
		blockSize: 'min-content',
		borderRadius: token('radius.small', '3px'),
		overflow: 'hidden',
		paddingInlineStart: token('space.050'),
		paddingInlineEnd: token('space.050'),
	},
	containerSubtle: {
		outlineOffset: -1,
	},
	text: {
		fontFamily: token('font.family.body'),
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		fontSize: '11px',
		fontStyle: 'normal',
		fontWeight: token('font.weight.bold'),
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: '16px',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		textTransform: 'uppercase',
		whiteSpace: 'nowrap',
	},
	customLetterspacing: {
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		letterSpacing: 0.165,
	},
	'bg.bold.default': { backgroundColor: '#DDDEE1' },
	'bg.bold.inprogress': { backgroundColor: '#8FB8F6' },
	'bg.bold.moved': { backgroundColor: '#F9C84E' },
	'bg.bold.new': { backgroundColor: '#D8A0F7' },
	'bg.bold.removed': { backgroundColor: '#FD9891' },
	'bg.bold.success': { backgroundColor: '#B3DF72' },
	'bg.subtle.default': { backgroundColor: token('color.background.neutral.subtle') },
	'bg.subtle.inprogress': { backgroundColor: token('color.background.neutral.subtle') },
	'bg.subtle.moved': { backgroundColor: token('color.background.neutral.subtle') },
	'bg.subtle.new': { backgroundColor: token('color.background.neutral.subtle') },
	'bg.subtle.removed': { backgroundColor: token('color.background.neutral.subtle') },
	'bg.subtle.success': { backgroundColor: token('color.background.neutral.subtle') },
	'outline.subtle.default': { outline: `1px solid #B7B9BE` },
	'outline.subtle.inprogress': { outline: `1px solid #669DF1` },
	'outline.subtle.moved': { outline: `1px solid #FCA700` },
	'outline.subtle.new': { outline: `1px solid #C97CF4` },
	'outline.subtle.removed': { outline: `1px solid #F87168` },
	'outline.subtle.success': { outline: `1px solid #94C748` },
	'text.subtle': { color: token('color.text') },
	'text.bold': { color: '#292A2E' },
});

export type ThemeAppearance = 'default' | 'inprogress' | 'moved' | 'new' | 'removed' | 'success';
const appearanceTypes: ThemeAppearance[] = [
	'default',
	'inprogress',
	'moved',
	'new',
	'removed',
	'success',
];

export interface LozengeProps {
	/**
	 * The appearance type.
	 */
	appearance?: ThemeAppearance;

	/**
	 * Elements to be rendered inside the lozenge. This should ideally be just a word or two.
	 */
	children?: ReactNode;

	/**
	 * Determines whether to apply the bold style or not.
	 */
	isBold?: boolean;

	/**
	 * max-width of lozenge container. Default to 200px.
	 */
	maxWidth?: number | string;

	/**
	 * Style customization to apply to the badge. Only `backgroundColor` and `color` are supported.
	 */
	style?: Pick<CSSProperties, 'backgroundColor' | 'color'>;

	/**
	 * A `testId` prop is provided for specified elements, which is a unique
	 * string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests
	 */
	testId?: string;
}

/**
 * __Lozenge__
 *
 * A lozenge is a visual indicator used to highlight an item's status for quick recognition.
 *
 * - [Examples](https://atlassian.design/components/lozenge/examples)
 * - [Code](https://atlassian.design/components/lozenge/code)
 * - [Usage](https://atlassian.design/components/lozenge/usage)
 */
const Lozenge = memo(
	({
		children,
		testId,
		isBold = false,
		appearance = 'default',
		maxWidth = 200,
		style,
	}: LozengeProps) => {
		const appearanceStyle = isBold ? 'bold' : 'subtle';
		const appearanceType = useMemo(
			() => (appearanceTypes.includes(appearance) ? appearance : 'default'),
			[appearance],
		);

		const maxWidthValue = typeof maxWidth === 'string' ? maxWidth : `${maxWidth}px`;
		const maxWidthIsPc = typeof maxWidth === 'string' && /%$/.test(maxWidth);

		return (
			<span
				style={{
					backgroundColor: style?.backgroundColor,
					maxWidth: maxWidthIsPc ? maxWidth : '100%',
				}}
				css={[
					stylesNew.container,
					stylesNew[`bg.${appearanceStyle}.${appearanceType}`],
					appearanceStyle === 'subtle' && stylesNew[`outline.subtle.${appearanceType}`],
					appearanceStyle === 'subtle' && stylesNew.containerSubtle,
				]}
				data-testid={testId}
			>
				<span
					css={[
						stylesNew.text,
						fg('platform-lozenge-custom-letterspacing') && stylesNew.customLetterspacing,
						stylesNew[`text.${appearanceStyle}`],
					]}
					style={{
						color: style?.color,
						// to negate paddingInline specified on Box above
						maxWidth: maxWidthIsPc
							? '100%'
							: `calc(${maxWidthValue} - ${token('space.100', '8px')})`,
					}}
					data-testid={testId && `${testId}--text`}
				>
					{children}
				</span>
			</span>
		);
	},
);

Lozenge.displayName = 'Lozenge';

export default Lozenge;
