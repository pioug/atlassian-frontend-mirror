import React from 'react';

import { md } from '@atlaskit/docs';
import Link from '@atlaskit/link';
import SectionMessage from '@atlaskit/section-message';

export default md`
${(
	<SectionMessage appearance="information">
		This component is now documented on{' '}
		<Link href="https://atlassian.design/components/side-navigation">atlassian.design</Link>
	</SectionMessage>
)}
`;
