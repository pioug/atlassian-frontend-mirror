/** @jsx jsx */
import { type PropsWithChildren } from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { DiProvider, injectable } from 'react-magnetic-di';

import DropdownMenu from '@atlaskit/dropdown-menu';

const mockDropdownMenu = injectable(DropdownMenu, (props) => (
	<DropdownMenu {...props} isOpen={true} />
));

const VrExpandDropdownMenuWrapper = ({ children }: PropsWithChildren<{}>) => {
	return <DiProvider use={[mockDropdownMenu]}>{children}</DiProvider>;
};

export default VrExpandDropdownMenuWrapper;
