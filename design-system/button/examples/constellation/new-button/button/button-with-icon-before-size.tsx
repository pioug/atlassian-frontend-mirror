import React from 'react';

import Button from '@atlaskit/button/new';
import WarningIcon from '@atlaskit/icon/core/migration/warning';
import { token } from '@atlaskit/tokens';

const ButtonIconOverrideExample = () => {
	return (
		<Button
			iconBefore={(iconProps) => (
				<WarningIcon
					{...iconProps}
					LEGACY_size="small"
					size="small"
					color={token('color.icon.warning')}
					LEGACY_primaryColor={token('color.icon.warning')}
					LEGACY_secondaryColor={token('color.icon.inverse')}
				/>
			)}
			appearance="warning"
		>
			Icon with overrides
		</Button>
	);
};

export default ButtonIconOverrideExample;
