import React from 'react';
import { md, PropsTable } from '@atlaskit/docs';

export default md`

${(
	<PropsTable
		props={require('!!extract-react-types-loader!../../../src/components/browser/browser')}
	/>
)}

`;
