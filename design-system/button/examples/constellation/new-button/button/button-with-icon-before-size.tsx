import React from 'react';

import Button from '@atlaskit/button/new';
import WarningIcon from '@atlaskit/icon/core/status-warning';
import { token } from '@atlaskit/tokens';

const ButtonIconOverrideExample = (): React.JSX.Element => {
	return (
		<Button
			iconBefore={(iconProps) => (
				<WarningIcon {...iconProps} size="small" color={token('color.icon.warning')} />
			)}
			appearance="warning"
		>
			Icon with overrides
		</Button>
	);
};

export default ButtonIconOverrideExample;
