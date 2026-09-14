import { type GasPayload, OPERATIONAL_EVENT_TYPE } from '@atlaskit/analytics-gas-types';

import { ComponentNames } from '../types';
import { packageName } from './package-name';
import { packageVersion } from './package-version';

export const buildSliPayload = (
	actionSubject: string,
	action: string,
	attributes?: {
		[key: string]: any;
	},
): GasPayload => {
	const eventPayload: GasPayload = {
		action,
		actionSubject,
		eventType: OPERATIONAL_EVENT_TYPE,
		attributes: {
			packageName,
			packageVersion,
			componentName: ComponentNames.MENTION,
			...attributes,
		},
	};
	return eventPayload;
};
