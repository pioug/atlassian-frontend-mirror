/* eslint-disable @compiled/shorthand-property-sorting */
/* eslint-disable @atlaskit/design-system/use-tokens-typography */
/* eslint-disable @atlaskit/ui-styling-standard/no-nested-selectors */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import type { LinkPerson } from '@atlaskit/link-extractors/types';

import { type IconType } from '../../../../../../constants';
import type { LinkLozenge } from '../../../../../../extractors/common/lozenge/types';
import {
	type FlexibleUiActions,
	type FlexibleUiDataContext,
	type LinkLocation,
	type LinkTitle,
	type Media,
	type PreviewActionData,
} from '../../../../../../state/flexible-ui-context/types';
import { isProfileType } from '../../../../../../utils/is-profile-type';

export const toLinkIconProps = (
	data: FlexibleUiDataContext[keyof FlexibleUiDataContext] | undefined,
	type: FlexibleUiDataContext['type'],
):
	| string[]
	| FlexibleUiActions
	| PreviewActionData
	| LinkPerson[]
	| LinkTitle
	| LinkLocation
	| {
			accessType?: string;
			objectId?: string;
			resourceType?: string;
			tenantId?: string;
	  }
	| Media
	| LinkLozenge
	| {
			department?: string;
			location?: string;
			pronouns?: string;
			role?: string;
	  }
	| {
			appearance: string;
			icon?: IconType;
			label?: string;
			url?: string;
	  }
	| undefined => {
	const isDataLinkIcon = (_data: typeof data): _data is FlexibleUiDataContext['linkIcon'] => {
		return typeof _data === 'object' && _data !== null && ('icon' in _data || 'url' in _data);
	};

	if (!isDataLinkIcon(data)) {
		return typeof data === 'object' ? data : undefined;
	}

	const isImageRound = isProfileType(type);

	return { ...data, appearance: isImageRound ? 'round' : 'square' };
};
