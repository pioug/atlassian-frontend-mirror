import { JsonLd } from 'json-ld-types';
import { extractLink } from '@atlaskit/linking-common/extractors';
import { getActionsFromJsonLd } from '../../common/actions/extractActions';
import { ViewActionData } from '../../../state/flexible-ui-context/types';

export const extractViewAction = (
  data: JsonLd.Data.BaseData,
): ViewActionData | undefined => {
  const viewActionExists = getActionsFromJsonLd(data).find(
    (action) => action['@type'] === 'ViewAction',
  );
  if (viewActionExists) {
    return {
      viewUrl: extractLink(data),
    };
  }
  return undefined;
};
