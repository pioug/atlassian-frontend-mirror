import React from 'react';

import { SideNavigation } from '../../src';
import AppFrame from '../common/app-frame';

const ContainerExample = () => {
	return (
		<AppFrame shouldHideAppBar shouldHideBorder>
			<SideNavigation label="project">
				<div />
			</SideNavigation>
		</AppFrame>
	);
};

export default ContainerExample;
