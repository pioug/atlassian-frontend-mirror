/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, jsx } from '@compiled/react';
import { useIntl } from 'react-intl-next';

import Document16Icon from '@atlaskit/icon-file-type/glyph/document/16';
import PageLiveDoc16Icon from '@atlaskit/icon-object/glyph/page-live-doc/16';
import { token } from '@atlaskit/tokens';

import { iconLabelMessages } from './messages';

const baseStyles = css({
	backgroundColor: token('color.skeleton'),
	backgroundSize: 'contain',
	backgroundRepeat: 'no-repeat',
	height: token('space.200'),
	width: token('space.200'),
	borderRadius: token('radius.small', '3px'),
	flexShrink: 0,
});

type UrlIconProps = {
	url?: string;
	children?: React.ReactNode;
};

export const UrlIcon = ({ url, children }: UrlIconProps): JSX.Element => {
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

export const PageIcon = () => {
	const intl = useIntl();

	return <Document16Icon label={intl.formatMessage(iconLabelMessages.pageIconLabel)} />;
};

export const LiveDocIcon = () => {
	const intl = useIntl();

	return <PageLiveDoc16Icon label={intl.formatMessage(iconLabelMessages.pageIconLabel)} />;
};
