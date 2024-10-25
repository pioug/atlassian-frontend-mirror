import React from 'react';

import { md, Props } from '@atlaskit/docs';

import { overrideActionsProps } from '../../utils';

export default md`

### Props

${(
	<Props
		heading=""
		props={require('!!extract-react-types-loader!../../../src/view/FlexibleCard/components/blocks/title-block')}
		overrides={{
			actions: overrideActionsProps,
		}}
	/>
)}

`;
