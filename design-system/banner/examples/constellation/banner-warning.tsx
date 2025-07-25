import React from 'react';

import Banner from '@atlaskit/banner';
import WarningIcon from '@atlaskit/icon/core/migration/status-warning--warning';
import Link from '@atlaskit/link';

const BannerWarningExample = () => {
	return (
		<Banner
			appearance="warning"
			icon={<WarningIcon label="Warning" LEGACY_secondaryColor="inherit" />}
		>
			Payment details needed. To stay on your current plan, add payment details by June 30, 2020.{' '}
			<Link href="/components/banner/examples">Add payment details</Link>
		</Banner>
	);
};

export default BannerWarningExample;
