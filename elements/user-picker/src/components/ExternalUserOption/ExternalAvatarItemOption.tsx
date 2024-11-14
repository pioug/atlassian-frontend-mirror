/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode } from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { B400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const outerWrapper = (isDisabled?: boolean) =>
	css({
		alignItems: 'center',
		boxSizing: 'border-box',
		display: 'flex',
		lineHeight: 1,
		outline: 'none',
		margin: 0,
		width: '100%',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		cursor: isDisabled ? 'not-allowed' : 'pointer',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		opacity: isDisabled ? token('opacity.disabled', '0.4') : undefined,
	});

const detailsWrapper = css({
	display: 'flex',
	maxWidth: '100%',
	minWidth: 0,
	flex: '1 1 100%',
	lineHeight: 1.4,
	paddingLeft: token('space.100', '8px'),
	alignItems: 'center',
});

const textSection = css({
	width: 'calc(100% - 32px)',
	flex: 'auto',
});

const getTextStyle = (isSecondary?: boolean) => {
	const secondaryCssArgs = isSecondary
		? {
				color: token('color.text.selected', B400),
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				fontSize: '0.85em',
			}
		: {};
	return css({
		display: 'flex',
		maxWidth: '100%',
		margin: 0,
		color: token('color.text.selected', B400),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		...{ secondaryCssArgs },
		whiteSpace: 'nowrap',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'> span': {
			maxWidth: 'inherit',
		},
	});
};

export type ExternalAvatarItemOptionProps = {
	avatar: ReactNode;
	isDisabled?: boolean;
	primaryText: ReactNode;
	secondaryText?: ReactNode;
	sourcesInfoTooltip?: ReactNode;
};

export const ExternalAvatarItemOption = ({
	avatar,
	isDisabled,
	primaryText,
	secondaryText,
	sourcesInfoTooltip,
}: ExternalAvatarItemOptionProps) => (
	// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
	<div css={outerWrapper(isDisabled)}>
		{avatar}
		<div css={detailsWrapper}>
			<div css={textSection}>
				<div>
					{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
					<div css={getTextStyle()}>{primaryText}</div>
				</div>
				{secondaryText && (
					<div>
						{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
						<div css={getTextStyle(true)}>{secondaryText}</div>
					</div>
				)}
			</div>
			<div>{sourcesInfoTooltip}</div>
		</div>
	</div>
);
