/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const listStyles = css({
	paddingLeft: token('space.250', '20px'),
	paddingInlineStart: token('space.250', '20px'),
});

const UListOld = ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
	<ul css={listStyles} {...props}>
		{children}
	</ul>
);

export default UListOld;
