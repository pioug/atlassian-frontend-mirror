/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { useIntl } from 'react-intl-next';

import ErrorIcon from '@atlaskit/icon/core/status-error';
import SuccessIcon from '@atlaskit/icon/core/status-success';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import commonMessages from '../../messages';

const errorColor = css({
	color: token('color.text.danger'),
});

const validColor = css({
	color: token('color.text.success'),
});

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
const messageStyle = () =>
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	css({
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		fontSize: `${12 / 14}em`,
		fontStyle: 'inherit',
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: 16 / 12,
		fontWeight: token('font.weight.regular'),
		color: token('color.text.subtlest'),
		marginTop: token('space.050', '4px'),
		display: 'flex',
		justifyContent: 'baseline',
	});

const iconWrapperStyle = css({
	display: 'flex',
	marginRight: token('space.050', '4px'),
});

interface Props {
	/** The content of the message */
	children: ReactNode;
}

export const HelperMessage = ({ children }: Props) => <div css={messageStyle}>{children}</div>;

export const ErrorMessage = ({ children }: Props) => {
	const intl = useIntl();
	return (
		<div
			css={() => {
				return [messageStyle(), errorColor];
			}}
		>
			<span css={iconWrapperStyle}>
				<ErrorIcon
					label={
						fg('platform_editor_dec_a11y_fixes')
							? intl.formatMessage(commonMessages.error)
							: 'error'
					}
					aria-label={fg('platform_editor_dec_a11y_fixes') ? undefined : 'error'}
				/>
			</span>
			{children}
		</div>
	);
};

export const ValidMessage = ({ children }: Props) => {
	const intl = useIntl();
	return (
		<div
			css={() => {
				return [messageStyle(), validColor];
			}}
		>
			<span css={iconWrapperStyle}>
				{fg('platform_editor_dec_a11y_fixes') ? (
					<SuccessIcon label={intl.formatMessage(commonMessages.success)} />
				) : (
					<SuccessIcon label="success" />
				)}
			</span>
			{children}
		</div>
	);
};
