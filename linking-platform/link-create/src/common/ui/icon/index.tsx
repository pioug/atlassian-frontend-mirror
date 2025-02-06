/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, jsx } from '@compiled/react';

import Document16Icon from '@atlaskit/icon-file-type/glyph/document/16';
import { fg } from '@atlaskit/platform-feature-flags';
import { N20A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

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

export const PageIcon = () => <Document16Icon label="Page" />;
