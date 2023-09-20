import { useEffect } from 'react';

import { DatasourceTableStatusType } from '@atlaskit/linking-types';

import { failUfoExperience } from '../index';

export const useColumnPickerRenderedFailedUfoExperience = (
  status: DatasourceTableStatusType,
  experienceId: string,
) => {
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
