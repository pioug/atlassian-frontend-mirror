import React from 'react';

import { md, Props } from '@atlaskit/docs';

export default md`

### Props

${(
	<Props
		heading=""
		props={require('!!extract-react-types-loader!../../props/props-element-item')}
	/>
)}

`;
