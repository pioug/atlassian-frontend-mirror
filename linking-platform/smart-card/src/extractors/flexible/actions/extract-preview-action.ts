import { JsonLd } from 'json-ld-types';

import { PreviewActionData } from '../../../state/flexible-ui-context/types';
import { extractDownloadUrl } from '../../common/detail';
import {
  extractPreview as extractPreviewData,
  extractLink,
  extractProvider,
  extractTitle,
} from '@atlaskit/link-extractors';
import { extractLinkIcon } from '../icon';
import { extractIsSupportTheming } from '../../common/meta/extractIsSupportTheming';

export const extractPreviewAction = (
  response: JsonLd.Response,
): PreviewActionData | undefined => {
  const data = response.data as JsonLd.Data.BaseData;
  const meta = response.meta as JsonLd.Meta.BaseMeta;

  const src = extractPreviewData(data, 'web')?.src;
  if (src) {
    return {
      downloadUrl: extractDownloadUrl(data as JsonLd.Data.Document),
      providerName: extractProvider(data)?.text,
      src,
      title: extractTitle(data),
      linkIcon: extractLinkIcon(response),
      url: extractLink(data),
      isSupportTheming: extractIsSupportTheming(meta),
    };
  }
};
