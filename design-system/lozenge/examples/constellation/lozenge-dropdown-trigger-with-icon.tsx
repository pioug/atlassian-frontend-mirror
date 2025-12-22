import React from 'react';

import ImageIcon from '@atlaskit/icon/core/image';
import { LozengeDropdownTrigger } from '@atlaskit/lozenge';

export default (): React.JSX.Element => (
	<LozengeDropdownTrigger appearance="success" iconBefore={ImageIcon}>
		With icon
	</LozengeDropdownTrigger>
);
