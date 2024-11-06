import React from 'react';

import { type JsonLd } from 'json-ld-types';

import PeopleIcon from '@atlaskit/icon/core/migration/people-group--people';
import { N600 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { type LinkDetail } from './types';

export type LinkSubscriberType =
	| JsonLd.Data.SourceCodeRepository
	| JsonLd.Data.Task
	| JsonLd.Data.TaskType;

export const extractSubscriberCount = (jsonLd: LinkSubscriberType): LinkDetail | undefined => {
	const subscriberCount = jsonLd['atlassian:subscriberCount'];
	if (subscriberCount) {
		return {
			text: subscriberCount.toString(),
			icon: (
				<PeopleIcon
					LEGACY_size="small"
					label="subscribers"
					color={token('color.icon.subtle', N600)}
				/>
			),
		};
	}
};
