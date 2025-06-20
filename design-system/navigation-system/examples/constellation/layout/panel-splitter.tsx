import React from 'react';

import { PanelSplitter } from '@atlaskit/navigation-system/layout/panel-splitter';
import { Root } from '@atlaskit/navigation-system/layout/root';
import { SideNav } from '@atlaskit/navigation-system/layout/side-nav';

export const PanelSplitterLayoutExample = () => (
	<Root>
		<SideNav>
			<PanelSplitter label="Resize side nav" />
		</SideNav>
	</Root>
);
