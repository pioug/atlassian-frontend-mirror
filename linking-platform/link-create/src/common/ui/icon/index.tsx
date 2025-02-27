/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, jsx } from '@compiled/react';
import { useIntl } from 'react-intl-next';

import Document16Icon from '@atlaskit/icon-file-type/glyph/document/16';
import PageLiveDoc16Icon from '@atlaskit/icon-object/glyph/page-live-doc/16';
import { fg } from '@atlaskit/platform-feature-flags';
import { N20A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { iconLabelMessages } from './messages';
import { UrlIconOld } from './old';

const baseStyles = css({
	backgroundColor: token('color.skeleton', N20A),
	backgroundSize: 'contain',
	backgroundRepeat: 'no-repeat',
	height: token('space.200', '16px'),
	width: token('space.200', '16px'),
	borderRadius: token('border.radius', '3px'),
	flexShrink: 0,
});

type UrlIconProps = {
	url?: string;
	children?: React.ReactNode;
};

const UrlIconNew = ({ url, children }: UrlIconProps): JSX.Element => {
	return (
		<div
			css={baseStyles}
			style={{
				backgroundImage: `url(${url ?? ''})`,
			}}
		>
			{children}
		</div>
	);
};

export const UrlIcon = (props: UrlIconProps) => {
	if (fg('platform_bandicoots-link-create-css')) {
		return <UrlIconNew {...props} />;
	}
	return <UrlIconOld {...props} />;
};

export const PageIcon = () => {
	const intl = useIntl();

	return <Document16Icon label={intl.formatMessage(iconLabelMessages.pageIconLabel)} />;
};

export const LiveDocIcon = () => {
	const intl = useIntl();

	return <PageLiveDoc16Icon label={intl.formatMessage(iconLabelMessages.pageIconLabel)} />;
};
