/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties, memo, type ReactNode, useMemo } from 'react';

import { cssMap as cssMapUnbounded } from '@compiled/react';

import { cssMap, jsx } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';
import { type BackgroundColor, Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const stylesOld = cssMap({
	container: {
		display: 'inline-flex',
		borderRadius: token('border.radius'),
		blockSize: 'min-content',
		position: 'static',
		overflow: 'hidden',
		paddingInline: token('space.050'),
		boxSizing: 'border-box',
	},
	'text.bold.default': { color: token('color.text.inverse', '#FFFFFF') },
	'text.bold.inprogress': { color: token('color.text.inverse', '#FFFFFF') },
	'text.bold.moved': { color: token('color.text.warning.inverse', '#172B4D') },
	'text.bold.new': { color: token('color.text.inverse', '#FFFFFF') },
	'text.bold.removed': { color: token('color.text.inverse', '#FFFFFF') },
	'text.bold.success': { color: token('color.text.inverse', '#FFFFFF') },
	'text.subtle.default': { color: token('color.text.subtle', '#42526E') },
	'text.subtle.inprogress': { color: token('color.text.information', '#0052CC') },
	'text.subtle.moved': { color: token('color.text.warning', '#974F0C') },
	'text.subtle.new': { color: token('color.text.discovery', '#403294') },
	'text.subtle.removed': { color: token('color.text.danger', '#DE350B') },
	'text.subtle.success': { color: token('color.text.success', '#006644') },
});

// NOTE: This is isolated to avoid breaking the bounded `stylesOld` interface as they do not fall within the Design System.
const stylesOldUnbounded = cssMapUnbounded({
	text: {
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		fontFamily:
			'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif',
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
});

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
		borderRadius: '3px',
		overflow: 'hidden',
		paddingInlineStart: token('space.050'),
		paddingInlineEnd: token('space.050'),
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
	'border.subtle.default': { border: `1px solid #B7B9BE` },
	'border.subtle.inprogress': { border: `1px solid #669DF1` },
	'border.subtle.moved': { border: `1px solid #FCA700` },
	'border.subtle.new': { border: `1px solid #C97CF4` },
	'border.subtle.removed': { border: `1px solid #F87168` },
	'border.subtle.success': { border: `1px solid #94C748` },
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

		if (fg('platform-component-visual-refresh')) {
			return (
				<span
					style={{
						backgroundColor: style?.backgroundColor,
						maxWidth: maxWidthIsPc ? maxWidth : '100%',
					}}
					css={[
						stylesNew.container,
						stylesNew[`bg.${appearanceStyle}.${appearanceType}`],
						appearanceStyle === 'subtle' && stylesNew[`border.subtle.${appearanceType}`],
					]}
					data-testid={testId}
				>
					<span
						css={[stylesNew.text, stylesNew[`text.${appearanceStyle}`]]}
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

		return (
			<Box
				as="span"
				backgroundColor={backgroundColorsOld[appearanceStyle][appearanceType]}
				style={{
					backgroundColor: style?.backgroundColor,
					maxWidth: maxWidthIsPc ? maxWidth : '100%',
				}}
				paddingInline="space.050"
				xcss={stylesOld.container}
				testId={testId}
			>
				<span
					css={[stylesOldUnbounded.text, stylesOld[`text.${appearanceStyle}.${appearanceType}`]]}
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
