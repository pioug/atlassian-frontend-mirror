/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, jsx } from '@atlaskit/css';
import WarningOutlineIcon from '@atlaskit/icon-lab/core/warning-outline';
import CalendarIcon from '@atlaskit/icon/core/calendar';
import ClockIcon from '@atlaskit/icon/core/clock';
import { token } from '@atlaskit/tokens';

import type { DateLabelAppearance, DateLabelProps } from './types';

const containerStyles = cssMap({
	base: {
		boxSizing: 'border-box',
		display: 'inline-flex',
		flexDirection: 'row',
		alignItems: 'center',
		paddingBlock: token('space.025'),
		paddingInline: token('space.050'),
		gap: token('space.050'),
		borderRadius: token('radius.small', '4px'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
	},
	spacious: {
		minHeight: '2rem',
		borderRadius: token('radius.medium', '6px'),
		paddingBlock: token('space.050'),
		paddingInline: token('space.150'),
		gap: token('space.075'),
	},
	neutral: {
		borderColor: token('color.border.accent.gray.subtle'),
	},
	warning: {
		borderColor: token('color.border.warning.subtle'),
	},
	danger: {
		borderColor: token('color.border.danger.subtle'),
	},
});

const textStyles = cssMap({
	base: {
		font: token('font.body.small'),
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		minWidth: 0,
	},
	spacious: {
		font: token('font.body'),
	},
	neutral: {
		color: token('color.text'),
	},
	warning: {
		color: token('color.text.warning'),
	},
	danger: {
		color: token('color.text.danger'),
	},
});

const iconStyles = cssMap({
	base: {
		display: 'flex',
		flexShrink: 0,
	},
});

const DEFAULT_MAX_WIDTH = 180;

const defaultIconLabels: Record<DateLabelAppearance, string> = {
	neutral: 'Date',
	warning: 'Warning',
	danger: 'Danger',
};

/**
 * __DateLabel__
 *
 * A date label is a compact label to display dates for quick recognition.
 * It supports three appearances: `neutral`, `warning`, and `danger`.
 *
 * - [Examples](https://atlassian.design/components/date-label/examples)
 * - [Code](https://atlassian.design/components/date-label/code)
 * - [Usage](https://atlassian.design/components/date-label/usage)
 */
export default function DateLabel({
	label,
	appearance = 'neutral',
	hasIconBefore = true,
	maxWidth = DEFAULT_MAX_WIDTH,
	isSpacious = false,
	iconLabel,
	testId,
}: DateLabelProps): JSX.Element {
	const maxWidthValue = typeof maxWidth === 'string' ? maxWidth : `${maxWidth}px`;
	const resolvedIconLabel = iconLabel !== undefined ? iconLabel : defaultIconLabels[appearance];
	const iconSize = isSpacious ? 'medium' : 'small';

	return (
		<span
			css={[
				containerStyles.base,
				isSpacious && containerStyles.spacious,
				containerStyles[appearance],
			]}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={{ maxWidth: maxWidthValue }}
			data-testid={testId}
		>
			{hasIconBefore && (
				<span css={iconStyles.base}>
					{appearance === 'neutral' && (
						<CalendarIcon
							label={resolvedIconLabel}
							size={iconSize}
							color={token('color.icon.subtlest')}
						/>
					)}
					{appearance === 'warning' && (
						<ClockIcon
							label={resolvedIconLabel}
							size={iconSize}
							color={token('color.icon.warning')}
						/>
					)}
					{appearance === 'danger' && (
						<WarningOutlineIcon
							label={resolvedIconLabel}
							size={iconSize}
							color={token('color.icon.danger')}
						/>
					)}
				</span>
			)}
			<span css={[textStyles.base, isSpacious && textStyles.spacious, textStyles[appearance]]}>
				{label}
			</span>
		</span>
	);
}
