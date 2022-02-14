import { JsonLd } from 'json-ld-types';

import { CONFLUENCE_GENERATOR_ID, JIRA_GENERATOR_ID } from '../../constants';

import { IconDescriptor } from './types';
import { IconType } from '../../../constants';
import extractUrlIcon from './extract-url-icon';

const extractProviderIcon = (
  provider?: string,
  icon?: JsonLd.Primitives.Image | JsonLd.Primitives.Link,
  label?: string,
): IconDescriptor | undefined => {
  if (provider === CONFLUENCE_GENERATOR_ID) {
    return [IconType.Confluence, label || 'Confluence'];
  }

  if (provider === JIRA_GENERATOR_ID) {
    return [IconType.Jira, label || 'Jira'];
  }

  return extractUrlIcon(icon, label);
};

export default extractProviderIcon;
