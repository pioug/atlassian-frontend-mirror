import { useEffect } from 'react';

import type { DatasourceTableStatusType } from '@atlaskit/linking-types/datasource';

import { failUfoExperience } from '../failUfoExperience';

export const useColumnPickerRenderedFailedUfoExperience = (
	status: DatasourceTableStatusType,
	experienceId: string,
): void => {
	useEffect(() => {
		if (status === 'rejected' && experienceId) {
			failUfoExperience(
				{
					name: 'column-picker-rendered',
				},
				experienceId,
			);
		}
	}, [experienceId, status]);
};
