import React, { type PropsWithChildren } from 'react';

import { DiProvider, injectable } from 'react-magnetic-di';

import DropdownMenu from '@atlaskit/dropdown-menu';

const mockDropdownMenu = injectable(DropdownMenu, (props) => (
	<DropdownMenu {...props} isOpen={true} />
));

const VrExpandDropdownMenuWrapper = ({ children }: PropsWithChildren<{}>) => {
	return <DiProvider use={[mockDropdownMenu]}>{children}</DiProvider>;
};

export default VrExpandDropdownMenuWrapper;
