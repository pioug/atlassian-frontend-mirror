import React, { Fragment } from 'react';

import { SideNavigation } from '@atlaskit/side-navigation';

import AppFrame from './common/app-frame';

const Example = (): React.JSX.Element => {
	return (
		<AppFrame shouldHideAppBar shouldHideBorder>
			<SideNavigation label="project">
				<Fragment />
			</SideNavigation>
		</AppFrame>
	);
};

export default Example;
