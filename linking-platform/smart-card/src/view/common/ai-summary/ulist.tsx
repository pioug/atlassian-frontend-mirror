/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import UListOld from './ulistOld';

const listStyles = css({
	paddingLeft: token('space.250', '20px'),
	paddingInlineStart: token('space.250', '20px'),
});

const UListNew = ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
	<ul css={listStyles} {...props}>
		{children}
	</ul>
);

const UList = (props: React.HTMLAttributes<HTMLUListElement>) => {
	if (fg('bandicoots-compiled-migration-smartcard')) {
		return <UListNew {...props} />;
	}
	return <UListOld {...props} />;
};

export default UList;
