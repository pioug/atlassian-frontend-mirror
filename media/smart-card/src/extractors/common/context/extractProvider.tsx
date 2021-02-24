import React from 'react';
import { N700, B200, B400 } from '@atlaskit/theme/colors';
import { ConfluenceIcon } from '@atlaskit/logo/confluence-icon';
import { JiraIcon } from '@atlaskit/logo/jira-icon';
import { JsonLd } from 'json-ld-types';

import { extractUrlFromIconJsonLd } from '../utils';
import { CONFLUENCE_GENERATOR_ID, JIRA_GENERATOR_ID } from '../../constants';

export interface LinkProvider {
  text: string;
  id?: string;
  icon?: React.ReactNode;
}

export const extractProvider = (
  jsonLd: JsonLd.Data.BaseData,
): LinkProvider | undefined => {
  const generator = jsonLd.generator;
  if (generator) {
    if (typeof generator === 'string') {
      throw Error('Link.generator requires a name and icon.');
    } else if (generator['@type'] === 'Link') {
      if (generator.name) {
        return { text: generator.name };
      }
    } else {
      if (generator.name) {
        const id = generator['@id'];
        return {
          text: generator.name,
          icon: extractProviderIcon(generator.icon, id),
          id,
        };
      }
    }
  }
};

const extractProviderIcon = (
  icon?: JsonLd.Primitives.Image | JsonLd.Primitives.Link,
  id?: string,
): React.ReactNode | undefined => {
  if (id) {
    if (id === CONFLUENCE_GENERATOR_ID) {
      return (
        <ConfluenceIcon
          textColor={N700}
          iconColor={B200}
          iconGradientStart={B400}
          iconGradientStop={B200}
          size="xsmall"
        />
      );
    } else if (id === JIRA_GENERATOR_ID) {
      return (
        <JiraIcon
          textColor={N700}
          iconColor={B200}
          iconGradientStart={B400}
          iconGradientStop={B200}
          size="xsmall"
        />
      );
    }
  }
  if (icon) {
    return extractUrlFromIconJsonLd(icon);
  }
};
