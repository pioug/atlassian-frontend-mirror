import React from 'react';

import { md, Props } from '@atlaskit/docs';

export default md`

This outlines props for a Card with  \`block\` appearance. Refer to [Card](./card) documentation for general props.

${(
	<Props heading="" props={require('!!extract-react-types-loader!../../props/props-block-card')} />
)}
`;
