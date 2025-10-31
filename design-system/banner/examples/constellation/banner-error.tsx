import React from 'react';

import Banner from '@atlaskit/banner';
import ErrorIcon from '@atlaskit/icon/core/status-error';
import Link from '@atlaskit/link';

const BannerErrorExample = () => {
	return (
		<Banner appearance="error" icon={<ErrorIcon label="Error" />}>
			Bitbucket is experiencing an incident. Check our status page for more details.{' '}
			<Link href="http://www.bitbucket.com">Status page</Link>
		</Banner>
	);
};

export default BannerErrorExample;
