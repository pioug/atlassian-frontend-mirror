import { JsonLd } from 'json-ld-types';

import { CONFLUENCE_GENERATOR_ID, JIRA_GENERATOR_ID } from '../../constants';

import { IconDescriptor } from './types';
import { IconType } from '../../../constants';
import extractUrlIcon from './extract-url-icon';
import { extractTitle } from '../../common/primitives';

const extractProviderIcon = (
  data?: JsonLd.Data.BaseData,
): IconDescriptor | undefined => {
  if (!data) {
    return undefined;
  }
  const generator = data.generator as JsonLd.Primitives.Object;
  const provider = generator?.['@id'];
  const icon = generator?.icon;
  const label = generator?.name || extractTitle(data);

  if (provider === CONFLUENCE_GENERATOR_ID) {
    return {
      icon: IconType.Confluence,
      label: label || 'Confluence',
    };
  }

  if (provider === JIRA_GENERATOR_ID) {
    return {
      icon: IconType.Jira,
      label: label || 'Jira',
    };
  }

  return extractUrlIcon(icon, label);
};

export default extractProviderIcon;
