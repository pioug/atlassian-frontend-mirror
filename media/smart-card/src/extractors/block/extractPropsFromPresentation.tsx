import React from 'react';

import { BlockCardResolvedViewProps } from '@atlaskit/media-ui';
import { extractPropsFromDocument } from './extractPropsFromDocument';
import Presentation16Icon from '@atlaskit/icon-file-type/glyph/presentation/16';
import PowerpointPresentation16Icon from '@atlaskit/icon-file-type/glyph/powerpoint-presentation/16';
import GoogleSlide16Icon from '@atlaskit/icon-file-type/glyph/google-slide/16';

export function extractPropsFromPresentation(
  json: any,
): BlockCardResolvedViewProps {
  const props = extractPropsFromDocument(json);

  // We use vendor-specific variations of the icons, whenever possible
  if (json.fileFormat === 'application/vnd.google-apps.presentation') {
    props.icon = {
      icon: (
        <GoogleSlide16Icon
          label={json.provider ? json.provider.name : 'Google Slides'}
        />
      ),
    };
  } else if (json.fileFormat === 'application/vnd.mspowerpoint') {
    props.icon = {
      icon: (
        <PowerpointPresentation16Icon
          label={json.provider ? json.provider.name : 'PowerPoint Presentation'}
        />
      ),
    };
  } else {
    props.icon = {
      icon: (
        <Presentation16Icon
          label={json.provider ? json.provider.name : 'Presentation'}
        />
      ),
    };
  }

  return props;
}
