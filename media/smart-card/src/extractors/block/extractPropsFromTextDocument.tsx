import React from 'react';

import { BlockCardResolvedViewProps } from '@atlaskit/media-ui';
import { extractPropsFromDocument } from './extractPropsFromDocument';
import Document24Icon from '@atlaskit/icon-file-type/glyph/document/16';
import GoogleDoc24Icon from '@atlaskit/icon-file-type/glyph/google-sheet/16';
import WordDocument24Icon from '@atlaskit/icon-file-type/glyph/word-document/16';
import ConfluencePageIcon from '@atlaskit/icon-object/glyph/page/16';
import { CONFLUENCE_GENERATOR_ID } from '../utils/constants';

export function extractPropsFromTextDocument(
  json: any,
): BlockCardResolvedViewProps {
  const props = extractPropsFromDocument(json);

  // We use vendor-specific variations of the icons, whenever possible
  if (json.fileFormat === 'application/vnd.google-apps.document') {
    props.icon = {
      icon: (
        <GoogleDoc24Icon
          label={json.provider ? json.provider.name : 'Google Doc'}
        />
      ),
    };
  } else if (json.fileFormat === 'application/vnd.ms-word') {
    props.icon = {
      icon: (
        <WordDocument24Icon
          label={json.provider ? json.provider.name : 'MS Word'}
        />
      ),
    };
  } else if (
    json.generator &&
    json.generator['@id'] === CONFLUENCE_GENERATOR_ID
  ) {
    props.icon = { icon: <ConfluencePageIcon label="Confluence" /> };
  } else {
    props.icon = {
      icon: (
        <Document24Icon
          label={json.provider ? json.provider.name : 'Text document'}
        />
      ),
    };
  }

  return props;
}
