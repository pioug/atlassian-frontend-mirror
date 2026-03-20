import React from 'react';

import { md, Props } from '@atlaskit/docs';

import { overrideActionsProps } from '../../utils';

const _default_1: any = md`

### Props

${(
	<Props
		heading=""
		props={require('!!extract-react-types-loader!../../../src/view/FlexibleCard/components/blocks/footer-block')}
		overrides={{
			actions: overrideActionsProps,
		}}
	/>
)}

`;
export default _default_1;
