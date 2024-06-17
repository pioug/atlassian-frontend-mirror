/** @jsx jsx */
import React from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { token } from '@atlaskit/tokens';

const listStyles = css({
	paddingLeft: token('space.250', '20px'),
	paddingInlineStart: token('space.250', '20px'),
});

const UList: React.FC<React.HTMLAttributes<HTMLUListElement>> = ({ children, ...props }) => (
	<ul css={listStyles} {...props}>
		{children}
	</ul>
);

export default UList;
