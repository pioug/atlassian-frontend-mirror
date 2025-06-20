import React from 'react';

import Banner from '@atlaskit/banner';
import WarningIcon from '@atlaskit/icon/core/migration/warning';
import { Banner as PageLayoutBanner } from '@atlaskit/navigation-system/layout/banner';
import { Root as PageLayoutRoot } from '@atlaskit/navigation-system/layout/root';

export const BannerLayoutExample = () => (
	<PageLayoutRoot>
		<PageLayoutBanner>
			<Banner icon={<WarningIcon label="Warning" spacing="spacious" color="currentColor" />}>
				Payment details needed. To stay on your current plan, add payment details by June 30, 2020.
			</Banner>
		</PageLayoutBanner>
	</PageLayoutRoot>
);
