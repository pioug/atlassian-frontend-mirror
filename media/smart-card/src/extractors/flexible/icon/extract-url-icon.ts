import { JsonLd } from 'json-ld-types';

import { IconDescriptor } from './types';
import { extractUrlFromIconJsonLd } from '../../common/utils';

const extractUrlIcon = (
  icon?: JsonLd.Primitives.Image | JsonLd.Primitives.Link,
  label?: string,
): IconDescriptor | undefined => {
  const url = icon && extractUrlFromIconJsonLd(icon);
  return url ? [undefined, label, url] : undefined;
};

export default extractUrlIcon;
