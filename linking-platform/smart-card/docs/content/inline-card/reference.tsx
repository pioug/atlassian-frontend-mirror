import { md, Props } from '@atlaskit/docs';
import React from 'react';

export default md`

This outlines props for a Card with  \`inline\` appearance. Refer to Card documentation for general props.

${(
	<Props heading="" props={require('!!extract-react-types-loader!../../utils/props-inline-card')} />
)}
`;
