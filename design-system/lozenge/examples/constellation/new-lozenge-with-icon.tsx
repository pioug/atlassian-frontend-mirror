import React from 'react';

import ImageIcon from '@atlaskit/icon/core/image';
import Lozenge from '@atlaskit/lozenge';

export default (): React.JSX.Element => (
	<Lozenge appearance="success" iconBefore={ImageIcon}>
		With icon
	</Lozenge>
);
