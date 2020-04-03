import React from 'react';

import { BlockCardResolvedViewProps } from '@atlaskit/media-ui';
import { extractPropsFromDocument } from './extractPropsFromDocument';
import Spreadsheet24Icon from '@atlaskit/icon-file-type/glyph/spreadsheet/16';
import GoogleSheet24Icon from '@atlaskit/icon-file-type/glyph/google-sheet/16';
import ExcelSpreadsheet24Icon from '@atlaskit/icon-file-type/glyph/excel-spreadsheet/16';

export function extractPropsFromSpreadsheet(
  json: any,
): BlockCardResolvedViewProps {
  const props = extractPropsFromDocument(json);

  // We use vendor-specific variations of the icons, whenever possible
  if (json.fileFormat === 'application/vnd.google-apps.spreadsheet') {
    props.icon = {
      icon: (
        <GoogleSheet24Icon
          label={json.provider ? json.provider.name : 'Google Sheet'}
        />
      ),
    };
  } else if (json.fileFormat === 'application/vnd.ms-excel') {
    props.icon = {
      icon: (
        <ExcelSpreadsheet24Icon
          label={json.provider ? json.provider.name : 'MS Excel'}
        />
      ),
    };
  } else {
    props.icon = {
      icon: (
        <Spreadsheet24Icon
          label={json.provider ? json.provider.name : 'Spreadsheet'}
        />
      ),
    };
  }

  return props;
}
