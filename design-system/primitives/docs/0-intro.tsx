import React from 'react';

import { md } from '@atlaskit/docs';
import Link from '@atlaskit/link';
import SectionMessage from '@atlaskit/section-message';

export default md`
${(
	<SectionMessage appearance="information">
		This package is now documented on{' '}
		<Link href="https://atlassian.design/components/primitives/overview">atlassian.design</Link>
	</SectionMessage>
)}
`;
