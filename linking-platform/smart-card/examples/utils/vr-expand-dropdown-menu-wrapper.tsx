import React, { type PropsWithChildren } from 'react';

import { DiProvider, injectable } from 'react-magnetic-di';

import DropdownMenu from '@atlaskit/dropdown-menu';
import { fg } from '@atlaskit/platform-feature-flags';

const mockDropdownMenu = injectable(DropdownMenu, (props) => (
	<DropdownMenu
		{...props}
		isOpen={true}
		shouldFitContainer={
			fg('should-render-to-parent-should-be-true-linking-pla') ? false : undefined
		}
		shouldRenderToParent={fg('should-render-to-parent-should-be-true-linking-pla')}
	/>
));

const VrExpandDropdownMenuWrapper = ({ children }: PropsWithChildren<{}>) => {
	return <DiProvider use={[mockDropdownMenu]}>{children}</DiProvider>;
};

export default VrExpandDropdownMenuWrapper;
