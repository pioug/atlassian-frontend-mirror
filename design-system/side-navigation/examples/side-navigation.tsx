import React, { Fragment } from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
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
