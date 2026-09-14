import React from 'react';

import MenuGroup from '@atlaskit/menu/menu-group';

export const QuickInsertMenuRoot = ({ children }: React.PropsWithChildren): React.JSX.Element => (
	<MenuGroup>{children}</MenuGroup>
);
