import React from 'react';

import { ExampleIssueLikeTableExample } from '../../examples-helpers/buildIssueLikeTable';
import VRTestWrapper from '../utils/VRWrapper';

export const VRIssueLikeTable = (
	props: React.ComponentProps<typeof ExampleIssueLikeTableExample>,
): JSX.Element => {
	return (
		<VRTestWrapper>
			<ExampleIssueLikeTableExample {...props} />
		</VRTestWrapper>
	);
};
