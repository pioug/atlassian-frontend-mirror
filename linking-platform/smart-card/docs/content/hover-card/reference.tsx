import React from 'react';
import { md, Props } from '@atlaskit/docs';

export default md`

${(
	<Props
		heading="HoverCardProps"
		props={require('!!extract-react-types-loader!../../utils/props-hover-card')}
	/>
)}
`;
