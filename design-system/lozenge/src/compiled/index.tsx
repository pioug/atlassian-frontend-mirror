/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties, memo, type ReactNode, useMemo } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';
import {
	type BackgroundColor,
	UNSAFE_SurfaceContext as SurfaceContext,
} from '@atlaskit/primitives';
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
	text: {
		// @ts-expect-error -- TODO: This is still pending migration to typography tokens
		fontFamily:
			'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif',
		// @ts-expect-error -- TODO: This is still pending migration to typography tokens
		fontSize: '11px',
		fontStyle: 'normal',
		// TODO: This is still pending migration to typography tokens
		fontWeight: token('font.weight.bold'),
		// @ts-expect-error -- TODO: This is still pending migration to typography tokens
		lineHeight: '16px',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		textTransform: 'uppercase',
		whiteSpace: 'nowrap',
	},
	'bg.bold.default': { backgroundColor: token('color.background.neutral.bold') },
	'bg.bold.inprogress': { backgroundColor: token('color.background.information.bold') },
	'bg.bold.moved': { backgroundColor: token('color.background.warning.bold') },
	'bg.bold.new': { backgroundColor: token('color.background.discovery.bold') },
	'bg.bold.removed': { backgroundColor: token('color.background.danger.bold') },
	'bg.bold.success': { backgroundColor: token('color.background.success.bold') },
	'bg.subtle.default': { backgroundColor: token('color.background.neutral') },
	'bg.subtle.inprogress': { backgroundColor: token('color.background.information') },
	'bg.subtle.moved': { backgroundColor: token('color.background.warning') },
	'bg.subtle.new': { backgroundColor: token('color.background.discovery') },
	'bg.subtle.removed': { backgroundColor: token('color.background.danger') },
	'bg.subtle.success': { backgroundColor: token('color.background.success') },
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

const stylesNew = cssMap({
	container: {
		display: 'inline-flex',
		boxSizing: 'border-box',
		position: 'static',
		blockSize: 'min-content',
		// @ts-expect-error -- TODO: css or lozenge are wrong
		borderRadius: '3px',
		overflow: 'hidden',
		paddingInlineStart: token('space.050'),
		paddingInlineEnd: token('space.050'),
	},
	text: {
		// @ts-expect-error -- TODO: This is still pending migration to typography tokens
		fontFamily:
			'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif',
		// @ts-expect-error -- TODO: This is still pending migration to typography tokens
		fontSize: '11px',
		fontStyle: 'normal',
		// TODO: This is still pending migration to typography tokens
		fontWeight: token('font.weight.bold'),
		// @ts-expect-error -- TODO: This is still pending migration to typography tokens
		lineHeight: '16px',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		textTransform: 'uppercase',
		whiteSpace: 'nowrap',
	},
	// @ts-expect-error -- Untokenized hardcoded values from the Visual Refresh…
	'bg.bold.default': { backgroundColor: '#DDDEE1' },
	// @ts-expect-error -- Untokenized hardcoded values from the Visual Refresh…
	'bg.bold.inprogress': { backgroundColor: '#8FB8F6' },
	// @ts-expect-error -- Untokenized hardcoded values from the Visual Refresh…
	'bg.bold.moved': { backgroundColor: '#F9C84E' },
	// @ts-expect-error -- Untokenized hardcoded values from the Visual Refresh…
	'bg.bold.new': { backgroundColor: '#D8A0F7' },
	// @ts-expect-error -- Untokenized hardcoded values from the Visual Refresh…
	'bg.bold.removed': { backgroundColor: '#FD9891' },
	// @ts-expect-error -- Untokenized hardcoded values from the Visual Refresh…
	'bg.bold.success': { backgroundColor: '#B3DF72' },
	'bg.subtle.default': { backgroundColor: token('color.background.neutral.subtle') },
	'bg.subtle.inprogress': { backgroundColor: token('color.background.neutral.subtle') },
	'bg.subtle.moved': { backgroundColor: token('color.background.neutral.subtle') },
	'bg.subtle.new': { backgroundColor: token('color.background.neutral.subtle') },
	'bg.subtle.removed': { backgroundColor: token('color.background.neutral.subtle') },
	'bg.subtle.success': { backgroundColor: token('color.background.neutral.subtle') },
	// @ts-expect-error -- Untokenized hardcoded values from the Visual Refresh…
	'border.subtle.default': { border: `1px solid #B7B9BE` },
	// @ts-expect-error -- Untokenized hardcoded values from the Visual Refresh…
	'border.subtle.inprogress': { border: `1px solid #669DF1` },
	// @ts-expect-error -- Untokenized hardcoded values from the Visual Refresh…
	'border.subtle.moved': { border: `1px solid #FCA700` },
	// @ts-expect-error -- Untokenized hardcoded values from the Visual Refresh…
	'border.subtle.new': { border: `1px solid #C97CF4` },
	// @ts-expect-error -- Untokenized hardcoded values from the Visual Refresh…
	'border.subtle.removed': { border: `1px solid #F87168` },
	// @ts-expect-error -- Untokenized hardcoded values from the Visual Refresh…
	'border.subtle.success': { border: `1px solid #94C748` },
	'text.subtle': { color: token('color.text') },
	// @ts-expect-error -- Untokenized hardcoded values from the Visual Refresh…
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
			<SurfaceContext.Provider value={backgroundColorsOld[appearanceStyle][appearanceType]}>
				<span
					style={{
						backgroundColor: style?.backgroundColor,
						maxWidth: maxWidthIsPc ? maxWidth : '100%',
					}}
					css={[stylesOld.container, stylesOld[`bg.${appearanceStyle}.${appearanceType}`]]}
					data-testid={testId}
				>
					<span
						css={[stylesOld.text, stylesOld[`text.${appearanceStyle}.${appearanceType}`]]}
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
			</SurfaceContext.Provider>
		);
	},
);

Lozenge.displayName = 'Lozenge';

export default Lozenge;
