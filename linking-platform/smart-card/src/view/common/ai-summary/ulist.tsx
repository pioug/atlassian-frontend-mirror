/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

const listStyles = css({
	paddingLeft: token('space.250', '20px'),
	paddingInlineStart: token('space.250', '20px'),
});

const UList = ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
	<ul css={listStyles} {...props}>
		{children}
	</ul>
);

export default UList;
