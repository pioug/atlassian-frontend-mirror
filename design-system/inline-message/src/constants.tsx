import ErrorIcon from '@atlaskit/icon/core/status-error';
import InformationIcon from '@atlaskit/icon/core/status-information';
import SuccessIcon from '@atlaskit/icon/core/status-success';
import WarningIcon from '@atlaskit/icon/core/status-warning';

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
