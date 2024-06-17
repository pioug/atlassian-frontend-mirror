/** @jsx jsx */
import { type CSSProperties, memo, type ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx, type SerializedStyles } from '@emotion/react';

import { type BackgroundColor, Box, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

const baseStyles = xcss({
	display: 'inline-flex',
	borderRadius: 'border.radius',
	blockSize: 'min-content',
	position: 'static',
	overflow: 'hidden',
});

const textStyles = css({
	font: token('font.body.small'),
	fontWeight: token('font.weight.bold'),
	overflow: 'hidden',
	textOverflow: 'ellipsis',
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
		const appearanceType = appearance in backgroundColors[appearanceStyle] ? appearance : 'default';

		const maxWidthValue = typeof maxWidth === 'string' ? maxWidth : `${maxWidth}px`;
		const maxWidthIsPc = typeof maxWidth === 'string' && /%$/.test(maxWidth);
		return (
			<Box
				as="span"
				backgroundColor={backgroundColors[appearanceStyle][appearanceType]}
				style={{
					backgroundColor: style?.backgroundColor,
					maxWidth: maxWidthIsPc ? maxWidth : '100%',
				}}
				paddingInline="space.050"
				xcss={baseStyles}
				testId={testId}
			>
				<span
					css={[textStyles, textColors[appearanceStyle][appearanceType]]}
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

const backgroundColors: Record<'bold' | 'subtle', Record<ThemeAppearance, BackgroundColor>> = {
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

const textColors: Record<'bold' | 'subtle', Record<ThemeAppearance, SerializedStyles>> = {
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
