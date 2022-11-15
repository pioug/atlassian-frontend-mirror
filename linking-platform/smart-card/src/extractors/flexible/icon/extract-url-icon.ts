import { JsonLd } from 'json-ld-types';

import { IconDescriptor } from './types';
import { extractUrlFromIconJsonLd } from '@atlaskit/linking-common/extractors';

const extractUrlIcon = (
  icon?: JsonLd.Primitives.Image | JsonLd.Primitives.Link,
  label?: string,
): IconDescriptor | undefined => {
  const url = icon && extractUrlFromIconJsonLd(icon);
  return url ? { label, url } : undefined;
};

export default extractUrlIcon;
