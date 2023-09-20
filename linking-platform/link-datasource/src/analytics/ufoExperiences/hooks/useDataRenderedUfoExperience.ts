import { useEffect } from 'react';

import { DatasourceTableStatusType } from '@atlaskit/linking-types';

import {
  addMetadataToExperience,
  failUfoExperience,
  succeedUfoExperience,
} from '../index';

interface DataRenderedUfoExperienceProps {
  status: DatasourceTableStatusType;
  experienceId: string;
  itemCount: number;
  canBeLink?: boolean;
  extensionKey?: string | null;
}

/**
 * Hook to mark DataRendered UFO experience as either Success or Failure
 * 1. Success when
 *    * its rendered as a link
 *    * it returns empty results
 *    * the request is unauthorized
 * 2. Fail when
 *    * request is rejected
 *
 * Note:
 *    * When the request is resolved as a datasource table, it will be marked success in the table component, every other success case is marked by this hook
 */
export const useDataRenderedUfoExperience = ({
  status,
  experienceId,
  itemCount,
  canBeLink,
  extensionKey,
}: DataRenderedUfoExperienceProps) => {
  useEffect(() => {
    const isEmptyResult = status === 'resolved' && itemCount === 0;
    const isLink = status === 'resolved' && (itemCount === 1 || canBeLink); // this will take care of count-mode/single-item smart-link rendering
    const isUnauthorized = status === 'unauthorized';

    const shouldSucceedUfoExperience =
      isEmptyResult || isLink || isUnauthorized;

    const shouldFailUfoExperience = status === 'rejected';

    if (extensionKey) {
      addMetadataToExperience(
        { name: 'datasource-rendered', metadata: { extensionKey } },
        experienceId,
      );
    }

    if (shouldFailUfoExperience) {
      failUfoExperience({ name: 'datasource-rendered' }, experienceId);
    } else if (shouldSucceedUfoExperience) {
      succeedUfoExperience({ name: 'datasource-rendered' }, experienceId);
    }
  }, [canBeLink, experienceId, extensionKey, itemCount, status]);
};
