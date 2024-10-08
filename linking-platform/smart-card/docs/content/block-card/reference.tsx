import { md, Props } from '@atlaskit/docs';
import React from 'react';

export default md`

This outlines props for a Card with  \`block\` appearance. Refer to [Card](./card) documentation for general props.

${(
	<Props heading="" props={require('!!extract-react-types-loader!../../utils/props-block-card')} />
)}
`;
