import { JsonLd } from 'json-ld-types';

import { DownloadActionData } from '../../../state/flexible-ui-context/types';
import { getActionsFromJsonLd } from '../../common/actions/extractActions';
import { extractDownloadUrl } from '../../common/detail';

export const extractDownloadAction = (
  data: JsonLd.Data.BaseData,
): DownloadActionData | undefined => {
  const downloadActionExists = getActionsFromJsonLd(data).find(
    (action) => action['@type'] === 'DownloadAction',
  );
  if (downloadActionExists) {
    return {
      downloadUrl: extractDownloadUrl(data as JsonLd.Data.Document),
    };
  }
  return undefined;
};
