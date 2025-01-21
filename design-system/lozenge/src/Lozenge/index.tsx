/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties, memo, type ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx, type SerializedStyles } from '@emotion/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { type BackgroundColor, Box, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

const baseStylesOld = xcss({
	display: 'inline-flex',
	borderRadius: 'border.radius',
	blockSize: 'min-content',
	position: 'static',
	overflow: 'hidden',
});

const styles = {
	container: css({
		display: 'inline-flex',
		boxSizing: 'border-box',
		position: 'static',
		blockSize: 'min-content',
		borderRadius: '3px',
		overflow: 'hidden',
		paddingInline: token('space.050'),
	}),
	containerSubtle: css({
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
		outlineOffset: -1,
	}),
	background: {
		bold: {
			default: css({ backgroundColor: '#DDDEE1' }),
			inprogress: css({ backgroundColor: '#8FB8F6' }),
			moved: css({ backgroundColor: '#F9C84E' }),
			new: css({ backgroundColor: '#D8A0F7' }),
			removed: css({ backgroundColor: '#FD9891' }),
			success: css({ backgroundColor: '#B3DF72' }),
		},
		subtle: {
			default: css({ backgroundColor: token('color.background.neutral.subtle') }),
			inprogress: css({ backgroundColor: token('color.background.neutral.subtle') }),
			moved: css({ backgroundColor: token('color.background.neutral.subtle') }),
			new: css({ backgroundColor: token('color.background.neutral.subtle') }),
			removed: css({ backgroundColor: token('color.background.neutral.subtle') }),
			success: css({ backgroundColor: token('color.background.neutral.subtle') }),
		},
	},
	border: {
		subtle: {
			default: css({ border: `1px solid #B7B9BE` }),
			inprogress: css({ border: `1px solid #669DF1` }),
			moved: css({ border: `1px solid #FCA700` }),
			new: css({ border: `1px solid #C97CF4` }),
			removed: css({ border: `1px solid #F87168` }),
			success: css({ border: `1px solid #94C748` }),
		},
	},
	outline: {
		subtle: {
			default: css({ outline: `1px solid #B7B9BE` }),
			inprogress: css({ outline: `1px solid #669DF1` }),
			moved: css({ outline: `1px solid #FCA700` }),
			new: css({ outline: `1px solid #C97CF4` }),
			removed: css({ outline: `1px solid #F87168` }),
			success: css({ outline: `1px solid #94C748` }),
		},
	},
	text: {
		subtle: css({ color: token('color.text') }),
		bold: css({ color: '#292A2E' }),
	},
};

const textStyles = css({
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
});

export type ThemeAppearance = 'default' | 'inprogress' | 'moved' | 'new' | 'removed' | 'success';

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
		const appearanceType =
			appearance in styles.background[appearanceStyle] ? appearance : 'default';

		const maxWidthValue = typeof maxWidth === 'string' ? maxWidth : `${maxWidth}px`;
		const maxWidthIsPc = typeof maxWidth === 'string' && /%$/.test(maxWidth);

		if (fg('platform-component-visual-refresh')) {
			return (
				<span
					style={{
						backgroundColor: style?.backgroundColor,
						maxWidth: maxWidthIsPc ? maxWidth : '100%',
					}}
					css={[
						styles.container,
						styles.background[appearanceStyle][appearanceType],
						appearanceStyle === 'subtle' &&
							!fg('visual-refresh_drop_5') &&
							styles.border.subtle[appearanceType],
						appearanceStyle === 'subtle' &&
							fg('visual-refresh_drop_5') &&
							styles.outline.subtle[appearanceType],
						appearanceStyle === 'subtle' && fg('visual-refresh_drop_5') && styles.containerSubtle,
					]}
					data-testid={testId}
				>
					<span
						css={[textStyles, styles.text[appearanceStyle]]}
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
		}

		const appearanceTypeOld =
			appearance in backgroundColorsOld[appearanceStyle] ? appearance : 'default';
		return (
			<Box
				as="span"
				backgroundColor={backgroundColorsOld[appearanceStyle][appearanceTypeOld]}
				style={{
					backgroundColor: style?.backgroundColor,
					maxWidth: maxWidthIsPc ? maxWidth : '100%',
				}}
				paddingInline="space.050"
				xcss={baseStylesOld}
				testId={testId}
			>
				<span
					css={[textStyles, textColorsOld[appearanceStyle][appearanceType]]}
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
			</Box>
		);
	},
);

Lozenge.displayName = 'Lozenge';

export default Lozenge;

const backgroundColorsOld: Record<'bold' | 'subtle', Record<ThemeAppearance, BackgroundColor>> = {
	bold: {
		default: 'color.background.neutral.bold',
		inprogress: 'color.background.information.bold',
		moved: 'color.background.warning.bold',
		new: 'color.background.discovery.bold',
		removed: 'color.background.danger.bold',
		success: 'color.background.success.bold',
	},
	subtle: {
		default: 'color.background.neutral',
		inprogress: 'color.background.information',
		moved: 'color.background.warning',
		new: 'color.background.discovery',
		removed: 'color.background.danger',
		success: 'color.background.success',
	},
};

const textColorsOld: Record<'bold' | 'subtle', Record<ThemeAppearance, SerializedStyles>> = {
	bold: {
		default: css({ color: token('color.text.inverse', '#FFFFFF') }),
		inprogress: css({ color: token('color.text.inverse', '#FFFFFF') }),
		moved: css({ color: token('color.text.warning.inverse', '#172B4D') }),
		new: css({ color: token('color.text.inverse', '#FFFFFF') }),
		removed: css({ color: token('color.text.inverse', '#FFFFFF') }),
		success: css({ color: token('color.text.inverse', '#FFFFFF') }),
	},
	subtle: {
		default: css({ color: token('color.text.subtle', '#42526E') }),
		inprogress: css({ color: token('color.text.information', '#0052CC') }),
		moved: css({ color: token('color.text.warning', '#974F0C') }),
		new: css({ color: token('color.text.discovery', '#403294') }),
		removed: css({ color: token('color.text.danger', '#DE350B') }),
		success: css({ color: token('color.text.success', '#006644') }),
	},
};
