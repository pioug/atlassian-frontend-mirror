import React from 'react';
import { md, Props } from '@atlaskit/docs';

export default md`
${(
	<Props
		heading="LinkUrlProps"
		props={require('!!extract-react-types-loader!../../../src/view/LinkUrl')}
	/>
)}
`;
