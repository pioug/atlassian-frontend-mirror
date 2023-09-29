import { JsonLd } from 'json-ld-types';

import { extractImage } from '@atlaskit/link-extractors';
import { MediaType } from '../../constants';
import { Media } from '../../state/flexible-ui-context/types';

const extractPreview = (data: JsonLd.Data.BaseData): Media | undefined => {
  if (!data) {
    return undefined;
  }

  const url = extractImage(data);

  return url ? { type: MediaType.Image, url } : undefined;
};

export default extractPreview;
