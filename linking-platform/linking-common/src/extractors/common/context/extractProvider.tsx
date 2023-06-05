import React from 'react';
import { token } from '@atlaskit/tokens';
import { N700, B200, B400 } from '@atlaskit/theme/colors';
import { ConfluenceIcon } from '@atlaskit/logo/confluence-icon';
import { JiraIcon } from '@atlaskit/logo/jira-icon';
import { JsonLd } from 'json-ld-types';

import { extractUrlFromIconJsonLd, extractUrlFromLinkJsonLd } from '../url';
import { CONFLUENCE_GENERATOR_ID, JIRA_GENERATOR_ID } from '../constants';

export interface LinkProvider {
  text: string;
  id?: string;
  icon?: React.ReactNode;
  image?: string;
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
          image: extractProviderImage(generator.image),
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
          // eslint-disable-next-line @atlaskit/design-system/no-deprecated-apis
          textColor={token('color.text.subtle', N700)}
          /* eslint-disable @atlaskit/design-system/ensure-design-token-usage, @atlaskit/design-system/no-deprecated-apis */
          iconColor={B200}
          iconGradientStart={B400}
          iconGradientStop={B200}
          /* eslint-enable @atlaskit/design-system/ensure-design-token-usage, @atlaskit/design-system/no-deprecated-apis */
          size="xsmall"
        />
      );
    } else if (id === JIRA_GENERATOR_ID) {
      return (
        <JiraIcon
          textColor={token('color.text.subtle', N700)}
          /* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
          iconColor={B200}
          iconGradientStart={B400}
          iconGradientStop={B200}
          /* eslint-enable @atlaskit/design-system/ensure-design-token-usage */
          size="xsmall"
        />
      );
    }
  }
  if (icon) {
    return extractUrlFromIconJsonLd(icon);
  }
};

const extractProviderImage = (
  image?: JsonLd.Primitives.Image | JsonLd.Primitives.Link,
): string | undefined => {
  if (image) {
    if (typeof image === 'string') {
      return image;
    } else if (image['@type'] === 'Link') {
      return extractUrlFromLinkJsonLd(image);
    } else if (image['@type'] === 'Image') {
      if (image.url) {
        return extractUrlFromLinkJsonLd(image.url);
      }
    }
  }
};
