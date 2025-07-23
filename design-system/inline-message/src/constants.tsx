import ErrorIcon from '@atlaskit/icon/core/migration/status-error--error';
import InformationIcon from '@atlaskit/icon/core/migration/status-information--info';
import SuccessIcon from '@atlaskit/icon/core/migration/status-success--check-circle';
import WarningIcon from '@atlaskit/icon/core/migration/status-warning--warning';

import type { IconAppearanceMap } from './types';

export const typesMapping: IconAppearanceMap = {
	connectivity: {
		icon: WarningIcon,
		defaultLabel: 'connectivity inline message',
	},
	confirmation: {
		icon: SuccessIcon,
		defaultLabel: 'confirmation inline message',
	},
	info: {
		icon: InformationIcon,
		defaultLabel: 'info inline message',
	},
	warning: {
		icon: WarningIcon,
		defaultLabel: 'warning inline message',
	},
	error: {
		icon: ErrorIcon,
		defaultLabel: 'error inline message',
	},
};
