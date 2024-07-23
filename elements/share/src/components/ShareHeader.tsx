/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx, type Theme, useTheme } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';

import { h500 } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

import { messages } from '../i18n';

export type Props = {
	title?: React.ReactNode;
};
const headerWrapperStyles = css({
	display: 'flex',
	justifyContent: 'space-between',
});

export const getFormHeaderTitleStyles = (theme: Theme) =>
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	css(h500(theme), {
		lineHeight: token('space.400', '32px'),
		marginRight: token('space.400', '32px'),
		marginTop: token('space.400', '32px'),
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'> span': {
			fontSize: 'initial',
		},
	});

export const ShareHeader: React.FunctionComponent<Props> = ({ title }) => {
	const theme = useTheme();

	return (
		<div css={headerWrapperStyles}>
			{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
			<h1 css={getFormHeaderTitleStyles(theme)}>
				{title || <FormattedMessage {...messages.formTitle} />}
			</h1>
		</div>
	);
};
