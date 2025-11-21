/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import ErrorIcon from '@atlaskit/icon/core/migration/status-error--error';
import SuccessIcon from '@atlaskit/icon/core/migration/status-success--editor-success';
import { token } from '@atlaskit/tokens';

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

export const ErrorMessage = ({ children }: Props) => (
	<div
		css={() => {
			return [messageStyle(), errorColor];
		}}
	>
		<span css={iconWrapperStyle}>
			{/* eslint-disable-next-line @atlassian/i18n/no-literal-string-in-jsx */}
			<ErrorIcon LEGACY_size="small" label="error" aria-label="error" />
		</span>
		{children}
	</div>
);

export const ValidMessage = ({ children }: Props) => (
	<div
		css={() => {
			return [messageStyle(), validColor];
		}}
	>
		<span css={iconWrapperStyle}>
			<SuccessIcon LEGACY_size="small" label="success" />
		</span>
		{children}
	</div>
);
