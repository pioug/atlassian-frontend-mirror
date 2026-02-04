import React from 'react';

import { SimpleTag as Tag } from '@atlaskit/tag';

export const TokenTagCodeBlock = `
import { N800, P100, P500, P75 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

// purple tag
color: token('color.text.accent.purple.bolder',N800),
background: token('color.background.accent.purple.subtle', colors.P100),

// light purple tag
color: token('color.text.accent.purple', P500),
background: token('color.background.accent.purple.subtler', P75),
`;

export const TokenTag = (): React.JSX.Element => {
	return (
		<>
			<Tag text="purple Tag" color="purple" />
			<Tag text="purpleLight Tag" color="purpleLight" />
		</>
	);
};

const _default_1: {
    example: () => React.JSX.Element;
    code: string;
} = { example: TokenTag, code: TokenTagCodeBlock };
export default _default_1;
