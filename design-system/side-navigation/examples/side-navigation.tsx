import React, { Fragment } from 'react';

import { SideNavigation } from '@atlaskit/side-navigation';

import AppFrame from './common/app-frame';

const Example = () => {
	return (
		<AppFrame shouldHideAppBar shouldHideBorder>
			<SideNavigation label="project">
				<Fragment />
			</SideNavigation>
		</AppFrame>
	);
};

export default Example;
